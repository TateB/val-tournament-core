import db from "../db/db"
import { connections } from "./connect"

// FORMAT:
// TEAMS: Best Of Number, Maps Wins, Team Shorts, Team Names, iconLink, scoreArray,
// SETTINGS: reversed, useVOTColours, useCustomIcon

export function sendScores(protocol = "") {
  async function logoURL(name, tinx) {
    return db.settings.get("general").then((genset) => {
      if (tinx === 0 && genset.settings.useTeamOneCustomIcon)
        return genset.settings.teamOneCustomIcon[0]
      if (tinx === 1 && genset.settings.useTeamTwoCustomIcon)
        return genset.settings.teamTwoCustomIcon[0]

      return genset.settings.useCustomIcon
        ? genset.settings.customIcon[0]
        : "icons/default.png"
    })
  }

  var teams, settings, genset

  db.teams
    .bulkGet([0, 1])
    .then((t) => (teams = t))
    .then(() => db.settings.get("general"))
    .then((genset) => ({
      useVOTColors: genset.settings.useVOTColours,
      customColour: genset.settings.customColour,
    }))
    .then((gs) => (genset = gs))
    .then(() => db.settings.get("scores"))
    .then((scSet) => ({
      reversed: scSet.settings.reversed,
    }))
    .then((scSet) => (settings = scSet))
    .then(() => {
      const mapScores = teams[0].score.reduce(
        (acc, curval, i) => {
          const other = teams[1].score[i]
          if (curval > other) acc[0] += 1
          if (curval < other) acc[1] += 1
          return acc
        },
        [0, 0]
      )
      teams[0].maps = mapScores[0]
      teams[1].maps = mapScores[1]
      return logoURL(teams[0].name, 0)
        .then((newlink) => (teams[0].iconLink = newlink))
        .then(() => logoURL(teams[1].name, 1))
        .then((newlink) => (teams[1].iconLink = newlink))
        .then(() => db.mapbans.where("isBan").equals(0).toArray())
        .then((mbArr) => mbArr.length)
        .then((boAmount) =>
          connections
            .filter((x) =>
              protocol === ""
                ? x.protocol.split("_")[0] === "scores" && x.connected === true
                : x.protocol === protocol
            )
            .map((x) => {
              global.log("mapping for send")
              global.log(x)
              // If icon is a file/blob, chunk data so logos can be transferred without crash
              function sendAsChunks(teamNum) {
                const iconStore = teams[teamNum].iconLink
                x.peer.send(`${teamNum}_chunk_img_start`)
                return iconStore.arrayBuffer().then((buffer) => {
                  const chunkSize = 16 * 1024
                  while (buffer.byteLength) {
                    const chunk = buffer.slice(0, chunkSize)
                    buffer = buffer.slice(chunkSize, buffer.byteLength)
                    x.peer.send(chunk)
                  }
                  return x.peer.send(`${teamNum}_chunk_img_end`)
                })
              }
              const checkForChunks = (teamNum) =>
                new Promise((resolve, reject) => {
                  teams[teamNum].iconLink instanceof Blob
                    ? sendAsChunks(teamNum)
                        .then(() => (teams[teamNum].iconLink = "chunked"))
                        .then(() => resolve())
                    : resolve()
                })
              return checkForChunks(0)
                .then(() => checkForChunks(1))
                .then(() =>
                  x.peer.send(
                    JSON.stringify({
                      teams,
                      genset,
                      settings,
                      boAmount,
                    })
                  )
                )
            })
        )
    })
}

export function setNewTeams(teams) {
  sendScores()
}

export function sendTimer(settings) {
  const timer = connections.find(
    (x) => x.protocol === "timer" && x.connected === true
  )
  return timer ? timer.peer.send(JSON.stringify(settings)) : null
}

export function sendTimerStart() {
  const timer = connections.find(
    (x) => x.protocol === "timer" && x.connected === true
  )
  return timer ? timer.peer.send(JSON.stringify({ start: true })) : null
}

export function sendTimerStop() {
  const timer = connections.find(
    (x) => x.protocol === "timer" && x.connected === true
  )
  return timer ? timer.peer.send(JSON.stringify({ stop: true })) : null
}

export function sendTimerReset() {
  const timer = connections.find(
    (x) => x.protocol === "timer" && x.connected === true
  )
  return timer ? timer.peer.send(JSON.stringify({ reset: true })) : null
}

export function sendMapBans() {
  var teams, genset, mapbans, maps, sides
  return db.mapbans
    .toArray()
    .then((arr) => (mapbans = arr))
    .then(() => db.teams.toArray())
    .then((arr) => (teams = arr))
    .then(() => db.settings.get("general"))
    .then((arr) => (genset = arr.settings))
    .then(() => db.maps.toArray())
    .then((arr) => arr.map((x) => x.name))
    .then((arr) => (maps = arr))
    .then(() => db.sides.toArray())
    .then((arr) => arr.map((x) => x.name))
    .then((arr) => (sides = arr))
    .then(() =>
      connections.find((x) => x.protocol === "mapbans" && x.connected === true)
    )
    .then((conn) =>
      conn
        ? conn.peer.send(
            JSON.stringify({ teams, mapbans, genset, maps, sides })
          )
        : null
    )
    .catch(() => console.error("couldn't send to peer"))
}

export function sendPredictions() {
  var teams, predictions, reversed
  return db.teams
    .bulkGet([0, 1])
    .then((arr) => (teams = arr))
    .then(() => db.settings.get("predictions"))
    .then((preds) => (predictions = preds.settings.results))
    .then(() => db.settings.get("scores"))
    .then((scSet) => (reversed = scSet.settings.reversed))
    .then(() =>
      connections.find(
        (x) => x.protocol === "predictions" && x.connected === true
      )
    )
    .then((conn) =>
      conn
        ? conn.peer.send(JSON.stringify({ teams, predictions, reversed }))
        : null
    )
}

export function togglePredictions() {
  var isShowing

  return db.settings
    .get("predictions")
    .then((predSet) => (isShowing = predSet.settings.showing))
    .then(() =>
      connections.find(
        (x) => x.protocol === "predictions" && x.connected === true
      )
    )
    .then((conn) =>
      conn ? conn.peer.send(JSON.stringify({ show: isShowing })) : null
    )
}

export function initialSend(protocol) {
  /* eslint-disable no-redeclare */
  switch (protocol) {
    case "mapbans":
      sendMapBans()
      break
    case "predictions":
      sendPredictions()
      break
    case "scores": {
      sendScores(protocol)
      break
    }
    case "scores_start": {
      sendScores(protocol)
      break
    }
    case "scores_break": {
      sendScores(protocol)
      break
    }
    case "scores_characterselect": {
      sendScores(protocol)
      break
    }
    case "timer":
      db.settings.get("timer").then((obj) => sendTimer(obj.settings))
      break
    default:
      break
  }
  /* eslint-enable no-redeclare */
}
