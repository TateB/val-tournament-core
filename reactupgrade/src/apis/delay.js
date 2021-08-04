import db from "../db/db"
import { nightbot, twitch } from "./apis"

export const createDelayListeners = () => {
  window.addEventListener("submitPred", async (e) => {
    const scores = e.detail.scores
    const force = e.detail.force
    var genSet
    var predSet
    var teams
    var userSessions
    var mapInx

    return db.settings
      .get("general")
      .then((obj) => (genSet = obj.settings))
      .then(() => db.settings.get("predictions"))
      .then((obj) => (predSet = obj.settings))
      .then(() =>
        force ? e.detail.setLoading(true) : (predSet.willSend = true)
      )
      .then(() => db.settings.update("predictions", { settings: predSet }))
      .then(() => db.mapbans.where("isBan").equals(0).toArray())
      .then((picks) => (mapInx = picks.indexOf(predSet.mapFor)))
      .then(() => db.teams.bulkGet([0, 1]))
      .then((teamsArr) => (teams = teamsArr))
      .then(() => (teams[0].scores[mapInx] = scores[0]))
      .then(() => (teams[1].scores[mapInx] = scores[1]))
      .then(() => db.teams.update(0, { scores: teams[0].scores }))
      .then(() => db.teams.update(1, { scores: teams[1].scores }))
      .then(() => db.userSessions.bulkGet(["nightbot", "twitch"]))
      .then((uS) => (userSessions = uS))
      .then(() =>
        force ? null : setTimeout(() => {}, genSet.streamDelay * 1000)
      )
      .then(() => calculateTeamInx(teams))
      .then((teamInx) => twitch.submitPredictionResult(teamInx))
      .then(() => nightbot.setCommand(["score", "maps"], teams))
      .then(() => (force ? e.detail.setLoading(false) : null))
      .catch((err) => console.log(err))
  })
}

const calculateTeamInx = (teams) => {
  return Promise.all(
    teams[0].score.map((sc, i) =>
      sc === teams[1].score[i] ? null : sc > teams[1].score[i] ? 0 : 1
    )
  )
    .then((scArr) => scArr.reverse())
    .then((revArr) => revArr.find((x) => x !== undefined))
}
