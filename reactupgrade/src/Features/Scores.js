import { Pane, TextInput, Select, Text, Button, Checkbox } from "evergreen-ui"
import { Component, useEffect, useState } from "react"
import db from "../db/db"
import Layout from "./etc/Layout"
import { sendScores } from "../webrtc/send"
import { useLiveQuery } from "dexie-react-hooks"
import { nightbot } from "../apis/apis"

function Scores(props) {
  const [teams, setTeams] = useState([])
  const [pickedMaps, setPickedMaps] = useState([])
  const [mapsArray, setMapsArray] = useState([])
  const [settings, setSettings] = useState({})
  const [scoreMap, _setScoreMap] = useState([])

  const teamReference = useLiveQuery(() => db.teams.bulkGet([0, 1]))
  const mapbansRef = useLiveQuery(() => db.mapbans.toArray())

  useEffect(() => {
    db.teams.bulkGet([0, 1]).then((scoresarray) => {
      setTeams(scoresarray)
    })
    db.mapbans
      .where("isBan")
      .equals(0)
      .sortBy("played")
      .then((array) =>
        Promise.all([
          setPickedMaps(array),
          _setScoreMap([...Array(array.length).keys()]),
        ])
      )
    db.maps.toArray().then((array) => {
      setMapsArray(
        array.map(
          (obj) => obj.name.replace(/\b[a-z]/gi, (char) => char.toUpperCase()) // Capitalise word
        )
      )
    })
    db.settings.get("scores").then((obj) => setSettings(obj.settings))
  }, [teamReference, mapbansRef])

  const setScore = (team, inx, score) => {
    setTeams((prevState) => {
      let otherScore = prevState[team ? 0 : 1].score[inx]
      if (otherScore < 12 && parseInt(score) > 13) score = 13
      if (otherScore > 12 && otherScore + 2 < score) score = otherScore + 2

      var prevTeams = [...prevState]
      prevTeams[team].score[inx] = parseInt(score) || 0
      return prevTeams
    })
  }

  const setValue = (name, newValue) => {
    setSettings((prevState) => {
      var prevSettings = { ...prevState }
      prevSettings[name] = newValue
      return prevSettings
    })
  }

  const setScoreMap = (inx, newValue) => {
    _setScoreMap((prevState) => {
      const swapInx = prevState.indexOf(parseInt(newValue))
      var prevSM = [...prevState]
      ;[prevSM[inx], prevSM[swapInx]] = [prevSM[swapInx], prevSM[inx]]
      return prevSM
    })
  }

  const submitToDb = () =>
    db.teams
      .update(0, { score: teams[0].score })
      .then(() => db.teams.update(1, { score: teams[1].score }))
      .then(() => db.settings.update("scores", { settings: settings }))
      .then(() => Math.max(...teams.map((tr) => tr.score.indexOf(0))))
      .then((hasScores) => (hasScores === -1 ? 3 : hasScores))
      .then((hasScores) =>
        Promise.all(
          pickedMaps.map((m, inx) => (inx < hasScores ? m.id : undefined))
        )
      )
      .then((ids) => ids.filter((x) => x !== undefined))
      .then((ids) =>
        Promise.all(ids.map((x, inx) => db.mapbans.update(x, { played: inx })))
      )
      .then(() =>
        db.mapbans
          .toArray()
          .then((arr) => arr.filter((x) => x.played !== undefined))
      )
      .then((res) => console.log("RESULTS FOR Q", res))
      .then(() => nightbot.setCommands(["maps", "score"]))
      .then(() => sendScores(teams, settings))

  const clearScores = () => {
    const clearArray = pickedMaps.fill(0)
    db.teams
      .toCollection()
      .modify({ score: clearArray })
      .then(() => db.mapbans.toCollection().modify({ played: undefined }))
      .then(() => nightbot.setCommands(["maps", "score"]))
      .then(() => sendScores(teamReference, settings))
  }

  return (
    <Layout
      name={props.name}
      openAppCallback={props.openAppCallback}
      openedApp={props.openedApp}
      protocols={[
        "scores",
        "scores_start",
        "scores_break",
        "scores_characterselect",
      ]}
    >
      <Pane display="flex" flexDirection="column">
        {pickedMaps.map((map, inx) => (
          <Pane key={inx} marginTop={8} display="flex" flexDirection="row">
            <Pane
              flexGrow="2"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text>Map {inx + 1}</Text>
              <Select
                disabled={
                  teams[0].score[inx - 1] > 0 ||
                  teams[1].score[inx - 1] > 0 ||
                  inx === 0
                    ? false
                    : true
                }
                value={scoreMap[inx]}
                onChange={(e) => setScoreMap(inx, e.target.value)}
                maxWidth={120}
              >
                {pickedMaps.map((umap, uinx) => (
                  <option value={uinx}>{mapsArray[umap.map]}</option>
                ))}
              </Select>
            </Pane>
            <TextInput
              name={inx}
              type="number"
              placeholder={teams[0].name + " Map Score"}
              value={
                teams[0].score[inx] > 0 || teams[1].score[inx] > 0
                  ? teams[0].score[inx]
                  : ""
              }
              marginRight={4}
              marginLeft={4}
              disabled={
                teams[0].score[inx - 1] > 0 ||
                teams[1].score[inx - 1] > 0 ||
                inx === 0
                  ? false
                  : true
              }
              onChange={(e) => setScore(0, inx, e.target.value)}
            />
            <TextInput
              name={inx}
              placeholder={teams[1].name + " Map Score"}
              value={
                (teams[0].score[inx] > 0) | (teams[1].score[inx] > 0)
                  ? teams[1].score[inx]
                  : ""
              }
              marginLeft={4}
              disabled={
                teams[0].score[inx - 1] > 0 ||
                teams[1].score[inx - 1] > 0 ||
                inx === 0
                  ? false
                  : true
              }
              onChange={(e) => setScore(1, inx, e.target.value)}
            />
          </Pane>
        ))}
        <Pane
          display="flex"
          flexDirection="row"
          marginTop={16}
          alignItems="center"
        >
          <Button intent="success" onClick={submitToDb}>
            Submit
          </Button>
          <Checkbox
            name="reversed"
            marginY={4}
            marginLeft={8}
            label="Flip Scoreboard"
            checked={settings.reversed}
            onChange={(e) => setValue("reversed", e.target.checked)}
          />
          <Pane flexGrow="1"></Pane>
          <Button intent="danger" onClick={clearScores}>
            Clear
          </Button>
        </Pane>
      </Pane>
    </Layout>
  )
}

export default Scores
