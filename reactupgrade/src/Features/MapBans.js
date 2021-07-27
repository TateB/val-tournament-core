import { Pane, Textarea, Button } from "evergreen-ui"
import { Component } from "react"
import Layout from "./etc/Layout"
import ManualInput from "./MapBans/ManualInput"
import Preview from "./MapBans/Preview"

class MapBans extends Component {
  render() {
    return (
      <Layout
        name={this.props.name}
        openAppCallback={this.props.openAppCallback}
        openedApp={this.props.openedApp}
      >
        <Pane display="flex" width="100%" flexDirection="column">
          <Pane display="flex" flexDirection="row">
            <Textarea
              flexGrow="1"
              name="textarea-1"
              placeholder="Veto Log &#10;E.g. TEAMA pick Haven Def &#10;TEAMB pick Icebox Atk"
              resize="none"
            />
            <Preview />
          </Pane>
          <Pane display="flex" flexDirection="row" marginTop="5px">
            <Button intent="success" marginRight="8px">
              Submit
            </Button>
            <Pane flexGrow="1"></Pane>
            <ManualInput />
            <Button intent="danger">Clear</Button>
          </Pane>
        </Pane>
      </Layout>
    )
  }
}

export default MapBans
