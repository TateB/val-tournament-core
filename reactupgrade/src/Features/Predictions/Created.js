import { useState, Fragment } from "react"
import { Pane, Button, SelectField, Checkbox, TextInput } from "evergreen-ui"
import { twitch } from "../../apis/apis"

function Created(props) {
  const [pickedMap] = useState("Ascent")
  const [teams] = useState(["Team A", "Team B"])
  const [scores] = useState([0, 0])
  const [checked, setChecked] = useState(true)

  const submitCancel = () => {
    props.setLoading(true)
    twitch.cancelPrediction().then(() => props.setLoading(false))
  }

  return (
    <Fragment>
      <Pane display="flex" flexDirection="column">
        <SelectField
          label={"Winner of map " + pickedMap}
          description="NOTE: Submitting a prediction will auto update stream/nightbot score if enabled"
          onChange={(event) => alert(event.target.value)}
          marginBottom={0}
        >
          {teams.map((team, inx) => (
            <option key={inx} value={inx}>
              {team}
            </option>
          ))}
        </SelectField>
        <Pane display="flex" flexDirection="row" marginTop={8}>
          <TextInput
            type="number"
            name="teama"
            placeholder={teams[0] + " Score"}
            flexGrow="1"
            marginRight={4}
          />
          <TextInput
            type="number"
            name="teamb"
            placeholder={teams[1] + " Score"}
            flexGrow="1"
            marginLeft={4}
          />
        </Pane>
        <Checkbox
          label="Use Stream Delay"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </Pane>
      <Pane display="flex" flexDirection="row" marginTop={8}>
        <Button intent="success">Submit</Button>
        <Pane flexGrow="1"></Pane>
        <Button intent="danger" onClick={submitCancel}>
          Cancel Prediction
        </Button>
      </Pane>
    </Fragment>
  )
}

export default Created
