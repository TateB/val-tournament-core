import { useState, Fragment, useEffect } from "react"
import {
  Pane,
  Button,
  Heading,
  Checkbox,
  Text,
  TextInputField,
  Card,
  Spinner,
} from "evergreen-ui"
import { twitch } from "../../apis/apis"
import db from "../../db/db"
import ResultsPreview from "./ResultsPreview"

function Created(props) {
  const [pickedMap, setPickedMap] = useState("Ascent")
  const [teams, setTeams] = useState([
    { name: "Team A", short: "TEMA" },
    { name: "Team B", short: "TEMB" },
  ])
  const [scores, setScores] = useState([0, 0])
  const [checked, setChecked] = useState(true)
  const [otherMapInfo, setOMI] = useState(props.pStateProp.forMap)
  const [mapCount, setMapCount] = useState({ totalCount: 3, currentMap: 1 })
  const [predLength, setPredLength] = useState(0)
  const [infoLoaded, setInfoLoaded] = useState(false)

  useEffect(
    () =>
      Promise.all([
        global.log(
          "INDEX/CMAP",
          props.teams.map((tr) => tr.score.indexOf(0))
        ),
        setPickedMap(props.maps[props.pStateProp.forMap.map]),
        setTeams(props.teams.map((x) => ({ name: x.name, short: x.short }))),
        setOMI(props.pStateProp.forMap),
        setPredLength(props.pStateProp.predictionLength),
        setMapCount({
          totalCount: props.pickedMaps.length,
          currentMap:
            Math.max(...props.teams.map((tr) => tr.score.indexOf(0))) + 1,
        }),
      ])
        .then(() =>
          global.log(
            props.teams,
            mapCount.currentMap,
            props.teams.map((x) => x)
          )
        )
        .then(() => setInfoLoaded(true))
        .then(() => global.log(otherMapInfo)),
    [props]
  )

  const submitCancel = () => {
    props.setLoading(true)
    twitch.cancelPrediction()
  }

  const setScore = (team, score) => {
    setScores((prevState) => {
      let otherScore = prevState[team ? 0 : 1]
      if (otherScore < 12 && parseInt(score) > 13) score = 13
      if (otherScore > 12 && otherScore + 2 < score) score = otherScore + 2

      var prevTeams = [...prevState]
      prevTeams[team] = parseInt(score) || ""
      return prevTeams
    })
  }

  const submitPred = () => {
    const submitPredEv = new CustomEvent("submitPred", {
      detail: {
        force: !checked,
        scores: scores,
        setLoading: props.setLoading,
        selected: otherMapInfo,
      },
      bubbles: false,
      cancelable: false,
      composed: false,
    })
    global.log("DISPATCHING SUBMISSION")
    window.dispatchEvent(submitPredEv)
  }

  if (!infoLoaded) return null

  return (
    <Fragment>
      <Pane display="flex" flexDirection="row">
        <Pane display="flex" flexDirection="column" flexGrow="1">
          <Heading
            size={600}
            display="inline"
            style={{ textTransform: "capitalize", fontWeight: 600 }}
          >
            {pickedMap}
            <span style={{ color: "#696f8c" }}>
              {" " + teams[otherMapInfo.teamPick].name + " Pick"}
            </span>
            <span style={{ color: "#8f95b2" }}>
              {" " + "Map " + mapCount.currentMap + "/" + mapCount.totalCount}
            </span>
          </Heading>
          <Pane display="flex" flexDirection="row" marginTop={8}>
            <Pane display="flex" flexDirection="column" flexGrow="1">
              <TextInputField
                label={teams[0].name + " Score"}
                type="number"
                name="teama"
                flexGrow="1"
                value={scores[0]}
                onChange={(e) => setScore(0, e.target.value)}
              />
              <TextInputField
                label={teams[1].name + " Score"}
                type="number"
                name="teamb"
                flexGrow="1"
                value={scores[1]}
                onChange={(e) => setScore(1, e.target.value)}
              />
            </Pane>
          </Pane>
          <Text>WINNER OF MAP </Text>
          <Checkbox
            label="Use Stream Delay"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <Pane display="flex" flexDirection="row" marginTop={8}>
            <Button
              intent="success"
              disabled={scores[0] === scores[1]}
              onClick={submitPred}
            >
              Submit
            </Button>
            <Pane flexGrow="1"></Pane>
            <Button intent="danger" onClick={submitCancel}>
              Cancel Prediction
            </Button>
          </Pane>
        </Pane>
        <Pane
          flexGrow="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <ResultsPreview
            teams={teams}
            pickedMap={pickedMap}
            otherMapInfo={otherMapInfo}
            predLength={predLength}
          />
        </Pane>
      </Pane>
    </Fragment>
  )
}

export default Created
