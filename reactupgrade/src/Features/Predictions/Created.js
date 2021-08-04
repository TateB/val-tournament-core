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
  const [otherMapInfo, setOMI] = useState({
    id: 0,
    isBan: 1,
    isShowing: true,
    map: 0,
    sidePick: 2,
    teamPick: 0,
  })
  const [mapCount, setMapCount] = useState({ totalCount: 3, currentMap: 1 })
  const [predLength, setPredLength] = useState(0)
  const [infoLoaded, setInfoLoaded] = useState(false)

  useEffect(
    () =>
      Promise.all([
        db.maps.toArray((arr) => arr.map((x) => x.name)),
        db.settings.get("predictions"),
        db.teams.bulkGet([0, 1]),
      ])
        .then(([maps, predSet, teams]) =>
          Promise.all([
            setPickedMap(maps[predSet.settings.forMap.map]),
            setTeams(teams.map((x) => ({ name: x.name, short: x.short }))),
            setOMI(predSet.settings.forMap),
            setPredLength(predSet.settings.predictionLength),
          ])
        )
        .then(() => db.mapbans.where("isBan").equals(0).toArray())
        .then((mbRef) =>
          setMapCount({
            totalCount: mbRef.length,
            currentMap: mbRef.findIndex((x) => (x.id = otherMapInfo.id)) + 1,
          })
        )
        .then(() => setInfoLoaded(true)),
    [props]
  )

  const submitCancel = () => {
    props.setLoading(true)
    twitch.cancelPrediction()
  }

  const submitPred = () => {
    const submitPredEv = new CustomEvent("submitPred", {
      detail: {
        force: !checked,
        scores: scores,
        setLoading: props.setLoading,
      },
      bubbles: true,
      cancelable: false,
      composed: false,
    })
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
                onChange={(e) => setScores([e.target.value, scores[1]])}
              />
              <TextInputField
                label={teams[1].name + " Score"}
                type="number"
                name="teamb"
                flexGrow="1"
                value={scores[1]}
                onChange={(e) => setScores([scores[0], e.target.value])}
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
            <Button intent="success" onClick={submitPred}>
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
