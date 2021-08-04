import { useState, Fragment, useEffect } from "react"
import {
  Pane,
  Button,
  Label,
  SelectField,
  Text,
  Strong,
  TextInputField,
  Card,
} from "evergreen-ui"
import { twitch } from "../../apis/apis"
import db from "../../db/db"

function NotCreated(props) {
  const [selected, setSelected] = useState(0)
  const [predLength, setPredLength] = useState(300)
  const [selectedMap, setSelectedMap] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")

  useEffect(() => {
    setSelectedMap(props.maps[props.pickedMaps[selected].map].toUpperCase())
    setSelectedTeam(
      props.teams[props.pickedMaps[selected].teamPick].short.toUpperCase()
    )
    db.settings
      .get("predictions")
      .then((set) => setPredLength(set.settings.predictionLength))
  }, [selected])

  const submitToTwitch = () => {
    props.setLoading(true)
    twitch.submitPrediction(props.pickedMaps[selected], predLength)
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
            {props.pickedMaps.map((map, inx) => (
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
