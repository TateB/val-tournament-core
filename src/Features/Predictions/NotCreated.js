import {
  Button,
  Card,
  Pane,
  SelectField,
  Strong,
  Text,
  TextInputField,
} from "evergreen-ui"
import { Fragment, useEffect, useState } from "react"
import { twitch } from "../../apis/apis"
import db from "../../db/db"

function NotCreated(props) {
  const [selected, setSelected] = useState(0)
  const [predLength, setPredLength] = useState(300)
  const [selectedMap, setSelectedMap] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [unplayedPicks, setUnplayed] = useState(
    props.pickedMaps.filter((x) => !x.played)
  )

  useEffect(
    () => setUnplayed(props.pickedMaps.filter((x) => !x.played)),
    [props]
  )

  useEffect(() => {
    setSelectedMap(props.maps[unplayedPicks[selected].map].toUpperCase())
    setSelectedTeam(
      props.teams[unplayedPicks[selected].teamPick].short.toUpperCase()
    )
    db.settings
      .get("predictions")
      .then((set) => setPredLength(set.settings.predictionLength))
  }, [selected, props.maps, props.teams, unplayedPicks])

  const submitToTwitch = () => {
    props.setLoading(true)
    twitch.submitPrediction(unplayedPicks[selected], predLength)
  }

  return (
    <Fragment>
      <Pane display="flex" flexDirection="row">
        <Pane flexGrow="1">
          <SelectField
            label="Map to predict"
            onChange={(event) => setSelected(event.target.value)}
            id="m2p"
          >
            {unplayedPicks.map((map, inx) => (
              <option
                style={{ textTransform: "capitalize" }}
                value={inx}
                key={inx}
              >
                {props.maps[map.map]}
              </option>
            ))}
          </SelectField>
          <TextInputField
            name="predictionLength"
            label="Length of Prediction Time (seconds)"
            value={predLength}
            onChange={(e) => setPredLength(e.target.value)}
          />
        </Pane>
        <Pane
          flexGrow="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Card
            display="flex"
            flexDirection="column"
            marginTop={24}
            elevation={1}
            padding={24}
            justifyContent="space-between"
            backgroundColor="white"
            minHeight={120}
          >
            <Strong>
              WHO WINS {selectedMap}? ({selectedTeam} PICK)
            </Strong>
            <Pane display="flex" flexDirection="column">
              <Text>{props.teams[0].name.toUpperCase()}</Text>
              <Text>{props.teams[1].name.toUpperCase()}</Text>
            </Pane>
          </Card>
        </Pane>
      </Pane>
      <Pane display="flex" flexDirection="row" marginTop={8}>
        <Button intent="success" onClick={submitToTwitch}>
          Create Prediction
        </Button>
        <Pane flexGrow="1"></Pane>
      </Pane>
    </Fragment>
  )
}

export default NotCreated
