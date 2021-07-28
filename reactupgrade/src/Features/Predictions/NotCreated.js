import { useState, Fragment } from "react"
import { Pane, Button, Select } from "evergreen-ui"

function NotCreated() {
  const [pickedMaps] = useState(["Ascent", "Icebox", "Haven"])

  return (
    <Fragment>
      <Pane display="flex" flexDirection="row">
        <Select onChange={(event) => alert(event.target.value)}>
          {pickedMaps.map((pMap) => (
            <option value={pMap.toLowerCase()}>{pMap}</option>
          ))}
        </Select>
      </Pane>
      <Pane display="flex" flexDirection="row" marginTop={8}>
        <Button intent="success">Create</Button>
        <Pane flexGrow="1"></Pane>
      </Pane>
    </Fragment>
  )
}

export default NotCreated
