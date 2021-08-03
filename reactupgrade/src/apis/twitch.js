import db from "../db/db"
import IdTokenVerifier from "idtoken-verifier"
import crypto from "crypto"

const authCheck = async () => {
  const errorQuery = new URLSearchParams(window.location.search).get("error")
  const twitchHashes = window.location.hash.substring(1)
  const resObj = Object.fromEntries(new URLSearchParams(twitchHashes).entries())
  console.log(resObj)

  if (errorQuery) return console.error("couldn't get twitch")

  const verifier = new IdTokenVerifier({
    issuer: "https://id.twitch.tv/oauth2",
    audience: process.env.REACT_APP_TWITCH_KEY,
    jwksURI: "https://id.twitch.tv/oauth2/keys",
  })

  const nonce = await db.userSessions.get("twitch").nonce

  const tryVerify = await verifier.verify(
    resObj.id_token,
    nonce,
    (err, payload) => {
      console.log(payload)
      if (err) return console.error(err)
      db.userSessions
        .update("twitch", {
          session: {
            accessToken: resObj.access_token,
            userId: payload.sub,
            username: payload.preferred_username,
          },
          nonce: "",
          authenticated: true,
        })
        .then(() => {
          revalidateToken()
          window.location.hash = ""
          window.history.replaceState("", "", "/")
        })
    }
  )
}

const revalidateToken = async () => {
  const twitchDb = await db.userSessions.get("twitch")
  if (!twitchDb.authenticated) return
  const token = twitchDb.session.accessToken
  console.log(twitchDb)

  fetch("https://id.twitch.tv/oauth2/validate", {
    method: "GET",
    headers: {
      Authorization: "OAuth " + token,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      return db.userSessions.update("twitch", {
        expiresAt: Date.now() + json.expires_in * 1000,
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const logout = async () => {
  const twitchDb = await db.userSessions.get("twitch")
  if (!twitchDb.authenticated) return
  const token = twitchDb.session.accessToken
  console.log("logging out")

  fetch(
    "https://id.twitch.tv/oauth2/revoke?client_id=" +
      process.env.REACT_APP_TWITCH_KEY +
      "&token=" +
      token,
    {
      method: "POST",
    }
  )
    .then((res) => {
      if (res.status === 200) return
      if (res.status === 400) throw res.status
    })
    .then(() => {
      return db.userSessions.update("twitch", {
        session: {
          accessToken: "",
          userId: "",
          username: "",
        },
        nonce: "",
        authenticated: false,
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const generateLoginLink = () => {
  const nonce = crypto.randomBytes(16).toString("base64")
  const params = new URLSearchParams({
    client_id: process.env.REACT_APP_TWITCH_KEY,
    redirect_uri: process.env.REACT_APP_URL + "twitch/",
    response_type: "token id_token",
    scope: "channel:manage:predictions openid",
    nonce: nonce,
  })

  db.userSessions.update("twitch", { nonce: nonce }).then((upd) => {
    window.location.href =
      "https://id.twitch.tv/oauth2/authorize?" +
      decodeURIComponent(params.toString())
  })
}

function isAuthed(settings) {
  return new Promise((resolve, reject) => {
    if (settings.authenticated) {
      return resolve()
    } else {
      return reject("Not authenticated with Twitch")
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

const submitPrediction = (selected, predLength) => {
  var map, teams, twitch
  return db.maps
    .toArray((arr) => {
      return (map = arr[selected])
    })
    .then(() => db.teams.bulkGet([0, 1]))
    .then((arr) => (teams = arr))
    .then(() => db.userSessions.get("twitch"))
    .then((obj) => (twitch = obj))
    .then(() => isAuthed(twitch))
    .then(() => db.mapbans.where("id").equals(selected).toArray())
    .then((arr) => {
      const selectedMapInfo = arr[0]
      const mapName = map.name
      const teamShort = teams[selectedMapInfo.teamPick].short
      const title = `WHO TAKES ${mapName.toUpperCase()}? (${teamShort.toUpperCase()} PICK)`
      const sendBody = {
        broadcaster_id: twitch.session.userId,
        title: title,
        outcomes: [
          {
            title: teams[0].name.toUpperCase(),
          },
          {
            title: teams[1].name.toUpperCase(),
          },
        ],
        prediction_window: predLength,
      }
      return sendBody
    })
    .then((sendBody) =>
      fetch("https://api.twitch.tv/helix/predictions", {
        method: "POST",
        body: JSON.stringify(sendBody),
        headers: {
          Authorization: "Bearer " + twitch.session.accessToken,
          "Client-Id": process.env.REACT_APP_TWITCH_KEY,
          "Content-Type": "application/json",
        },
      })
    )
    .then((res) => {
      return res.json()
    })
    .then((json) =>
      db.settings.update("predictions", {
        settings: {
          available: true,
          id: json.data[0].id,
          teamIds: [json.data[0].outcomes[0].id, json.data[0].outcomes[1].id],
          predictionLength: predLength,
          showing: false,
          willSend: false,
        },
      })
    )
    .catch((err) => console.error(err))
}

const cancelPrediction = () => {
  var twitch, predSet
  return db.userSessions
    .get("twitch")
    .then((obj) => (twitch = obj))
    .then(() => db.settings.get("predictions"))
    .then((obj) => (predSet = obj.settings))
    .then(() => isAuthed(twitch))
    .then(() => ({
      broadcaster_id: twitch.session.userId,
      id: predSet.id,
      status: "CANCELED",
    }))
    .then((sendBody) =>
      fetch("https://api.twitch.tv/helix/predictions", {
        method: "PATCH",
        body: JSON.stringify(sendBody),
        headers: {
          Authorization: "Bearer " + twitch.session.accessToken,
          "Client-Id": process.env.REACT_APP_TWITCH_KEY,
          "Content-Type": "application/json",
        },
      })
    )
    .then((res) => checkForErrors(res))
    .then(() =>
      db.settings.update("predictions", {
        settings: {
          available: false,
          id: "",
          teamIds: [],
          predictionLength: predSet.predictionLength,
          showing: false,
          willSend: false,
        },
      })
    )
    .catch((err) => console.error(err))
}

const submitPredictionResult = () => {}

const fetchPredictions = () => {}

const allFunctions = {
  authCheck,
  generateLoginLink,
  revalidateToken,
  logout,
  submitPrediction,
  cancelPrediction,
}

export default allFunctions
