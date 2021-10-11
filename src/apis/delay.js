import db from "../db/db"
import { nightbot, twitch } from "./apis"

const submitPredListener = async (e) => {
  e.stopPropagation()
  e.preventDefault()
  const scores = e.detail.scores
  const force = e.detail.force
  const selected = e.detail.selected
  var genSet
  var predSet
  var teams
  var mapInx

  return db.settings
    .get("general")
    .then((obj) => (genSet = obj.settings))
    .then(() => db.settings.get("predictions"))
    .then((obj) => (predSet = obj.settings))
    .then(() => (force ? e.detail.setLoading(true) : (predSet.willSend = true)))
    .then(() => db.settings.update("predictions", { settings: predSet }))
    .then(() => db.teams.bulkGet([0, 1]))
    .then((teamsArr) => (teams = teamsArr))
    .then(() => Math.max(...teams.map((tr) => tr.score.indexOf(0))))
    .then((gotMapInx) => (mapInx = gotMapInx))
    .then(() => (teams[0].score[mapInx] = parseInt(scores[0])))
    .then(() => (teams[1].score[mapInx] = parseInt(scores[1])))
    .then(() => db.teams.update(0, { score: teams[0].score }))
    .then(() => db.teams.update(1, { score: teams[1].score }))
    .then(() => db.mapbans.update(selected.id, { played: mapInx }))
    .then(() => delay(force ? 0 : genSet.streamDelay * 1000))
    .then(() => calculateTeamInx(teams))
    .then((teamInx) => twitch.submitPredictionResult(teamInx))
    .then(() => nightbot.setCommand("score"))
    .then(() => (force ? e.detail.setLoading(false) : null))
    .catch((err) => console.error(err.message))
}

const submitTwitchAd = async (e) => {
  e.stopPropagation()
  e.preventDefault()
  const time = e.detail.time

  return db.settings
    .get("general")
    .then((genSet) => delay(genSet.settings.streamDelay * 1000))
    .then(() => twitch.submitAd(time))
    .catch((err) => console.error(err.message))
}

export const createDelayListeners = () => {
  window.addEventListener("submitPred", submitPredListener)
  window.addEventListener("submitAd", submitTwitchAd)
}

export const removeDelayListeners = () => {
  window.removeEventListener("submitPred", submitPredListener)
  window.removeEventListener("submitAd", submitTwitchAd)
}

function delay(duration) {
  return new Promise((resolve) => setTimeout(() => resolve(), duration))
}

const calculateTeamInx = (teams) => {
  return Promise.all(
    teams[0].score.map((sc, i) =>
      sc === teams[1].score[i] ? undefined : sc > teams[1].score[i] ? 0 : 1
    )
  )
    .then((scArr) => scArr.reverse())
    .then((revArr) => revArr.find((x) => x !== undefined))
}
