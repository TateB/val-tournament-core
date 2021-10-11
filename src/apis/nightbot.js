import crypto from "crypto"
import db from "../db/db"
import { getSpecifics } from "../db/getSpecifics"

const authCheck = async () => {
  const hashes = window.location.hash.substring(1)
  const resObj = Object.fromEntries(new URLSearchParams(hashes).entries())

  if (resObj.error) return console.error("couldn't get nightbot")

  const state = await db.userSessions.get("nightbot")
  if (state.nonce !== resObj.state) return console.error("States don't match")

  db.userSessions
    .update("nightbot", {
      session: {
        accessToken: resObj.access_token,
      },
      expiresAt: Date.now() + parseInt(resObj.expires_in) * 1000,
      nonce: "",
      authenticated: true,
    })
    .then(() => {
      getNightbotInfo()
      window.location.hash = ""
      window.history.replaceState("", "", "/")
    })
}

const generateLoginLink = () => {
  const nonce = crypto.randomBytes(16).toString("base64")
  const params = new URLSearchParams({
    client_id: process.env.REACT_APP_NIGHTBOT_KEY,
    redirect_uri: process.env.REACT_APP_URL + "nightbot/",
    response_type: "token",
    scope: "commands channel",
    state: nonce,
  })

  db.userSessions.update("nightbot", { nonce: nonce }).then((upd) => {
    window.location.href = "https://api.nightbot.tv/oauth2/authorize?" + params
  })
}

const getNightbotInfo = async () => {
  const nightbotDb = await db.userSessions.get("nightbot")
  if (!nightbotDb.authenticated) return

  await fetch("https://api.nightbot.tv/1/channel", {
    headers: {
      Authorization: "Bearer " + nightbotDb.session.accessToken,
    },
  })
    .then((res) => {
      if (res.status !== 200) throw new Error(res)
      return res.json()
    })
    .then((json) => {
      var newSessionState = nightbotDb.session
      newSessionState.userId = json.channel._id
      newSessionState.username = json.channel.displayName

      return db.userSessions.update("nightbot", {
        session: newSessionState,
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

function isAuthed(settings) {
  return new Promise((resolve, reject) => {
    if (settings.authenticated) {
      return resolve()
    } else {
      return reject("Not authenticated with Nightbot")
    }
  })
}

function checkForErrors(res) {
  return new Promise((resolve, reject) => {
    switch (res.status) {
      case 200:
        return resolve(res.json())
      case 400:
        return reject("Request was invalid")
      case 401:
        return reject("Authorisation failed")
      default:
        return reject("Error: " + res.statusText)
    }
  })
}

const getNightbotCommands = () => {
  var settings

  return db.userSessions
    .get("nightbot")
    .then((nbSession) => (settings = nbSession))
    .then(() => isAuthed(settings))
    .then(() =>
      fetch("https://api.nightbot.tv/1/commands", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + settings.session.accessToken,
        },
      })
    )
    .then((res) => checkForErrors(res))
    .then((json) => json.commands)
}

const logout = async () => {
  const nightbotDb = await db.userSessions.get("nightbot")
  if (!nightbotDb.authenticated) return
  const token = nightbotDb.session.accessToken

  fetch("https://api.nightbot.tv/oauth2/token/revoke", {
    body: "token=" + token,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  })
    .then((res) => {
      if (res.status === 200) return
      if (res.status === 400) throw res.status
    })
    .then(() => {
      return db.userSessions.update("nightbot", {
        session: {
          accessToken: "",
          userId: "",
          username: "",
        },
        expiresAt: 0,
        nonce: "",
        authenticated: false,
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const requiredVars = {
  bracket: ["bracket"],
  caster: ["caster"],
  delay: ["delay"],
  maps: ["picks", "teams", "maps", "sides"],
  score: ["played", "teams", "maps"],
}

const setCommands = (commands) =>
  Promise.all(commands.map((x) => setCommand(x)))

const checkForId = (id) =>
  new Promise((resolve, reject) =>
    id !== undefined ? resolve() : reject("Id does not exist for command")
  )

const setCommand = (command) => {
  var dbVars
  var userId
  var settingId
  var settings

  return Promise.all(requiredVars[command].map((x) => getSpecifics(x)))
    .then((dbVarsRec) => (dbVars = dbVarsRec))
    .then(() => getSpecifics("nbSession"))
    .then((sess) => (settings = sess))
    .then(() => isAuthed(settings))
    .then(() => (userId = settings.session.accessToken))
    .then(() => getSpecifics("commands"))
    .then((nbSet) => nbSet.find((x) => x.name === command))
    .then((foundCommand) => (settingId = foundCommand.id))
    .then((id) => checkForId(id))
    .then(() => generateCommandText(command, dbVars))
    .then((text) =>
      JSON.stringify({
        message: text,
      })
    )
    .then((sendBody) =>
      fetch("https://api.nightbot.tv/1/commands/" + settingId, {
        method: "PUT",
        body: sendBody,
        headers: {
          Authorization: "Bearer " + userId,
          "Content-Type": "application/json",
        },
      })
    )
    .catch((err) =>
      console.error("Nightbot: Error setting command " + command + " :: " + err)
    )
}

const generateCommandText = (command, vars) => {
  /* eslint-disable no-redeclare */
  return new Promise((resolve) => {
    switch (command) {
      case "bracket": {
        resolve(
          "@$(user), The bracket for " +
            vars[0].name +
            " can be found here: " +
            vars[0].url
        )
        return
      }
      case "caster": {
        const [casters] = vars
        if (casters.length > 1) {
          var finalMsg = "@$(user), Your casters for today are: "
          casters.forEach((x, i) =>
            i === casters.length - 1
              ? (finalMsg += `${x.name}, ${x.url}`)
              : (finalMsg += `${x.name}, ${x.url}, `)
          )
          resolve(finalMsg)
        } else {
          resolve(
            `@$(user), Your caster for today is: ${casters[0].name}, ${casters[0].url}`
          )
        }
        return
      }
      case "delay": {
        var finalMsg = "@$(user), Stream delay is set to "
        const { minutes, seconds } = vars[0]
        /* eslint-disable no-unused-expressions */
        if (minutes > 0) {
          finalMsg += minutes + " minute"
          minutes > 1 ? (finalMsg += "s") : undefined
        }
        if (seconds > 0 && minutes > 0) {
          finalMsg += " and "
        }
        if (seconds > 0) {
          finalMsg += seconds + " second"
          seconds > 1 ? (finalMsg += "s") : undefined
        }
        /* eslint-enable no-unused-expressions */
        return resolve(finalMsg)
      }
      case "maps": {
        var finalMsg = "@$(user), "
        const [picks, teams, maps, sides] = vars
        picks.forEach((x, inx) => {
          finalMsg += `${teams[x.teamPick].short.toUpperCase()} ${
            x.isBan ? "bans" : "picks"
          } ${maps[x.map].name.toUpperCase()} (${teams[
            x.teamPick ? 0 : 1
          ].short.toUpperCase()} ${sides[x.sidePick].short.toUpperCase()})`
          if (inx !== picks.length - 1) finalMsg += ", "
        })
        return resolve(finalMsg)
      }
      case "score": {
        var finalMsg = "@$(user), "
        const [played, teams, maps] = vars
        if (played.length === 0)
          return resolve("@$(user), No maps completed yet.")

        return calculateWinnerArray(teams)
          .then((winnerArr) =>
            winnerArr.forEach((x, inx) => {
              finalMsg += `${teams[x].short.toUpperCase()} wins ${maps[
                played[inx].map
              ].name.toUpperCase()} (${teams[x].score[inx]} - ${
                teams[x ? 0 : 1].score[inx]
              })`
              if (inx !== played.length - 1) finalMsg += ", "
            })
          )
          .then(() => resolve(finalMsg))
      }
      default: {
        throw new Error("Nightbot: Unknown command set")
      }
    }
    /* eslint-enable no-redeclare */
  })
}

const calculateWinnerArray = (teams) => {
  return Promise.all(
    teams[0].score.map((sc, i) =>
      sc === teams[1].score[i] ? undefined : sc > teams[1].score[i] ? 0 : 1
    )
  ).then((arr) => arr.filter((x) => x !== undefined))
}

const allFunctions = {
  authCheck,
  generateLoginLink,
  getNightbotInfo,
  logout,
  setCommands,
  setCommand,
  getNightbotCommands,
}

export default allFunctions
