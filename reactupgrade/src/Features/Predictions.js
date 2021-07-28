import { Pane, Text, TextInput, Button, Select } from "evergreen-ui"
import { Component } from "react"
import Layout from "./etc/Layout"
import States from "./Predictions/States"

class Predictions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pickedMaps: ["Ascent", "Haven", "Icebox"],
      cState: 1,
    }
  }

  render() {
    return (
      <Layout
        name={this.props.name}
        openAppCallback={this.props.openAppCallback}
        openedApp={this.props.openedApp}
      >
        <States cState={this.state.cState} />
      </Layout>
    )
  }
}

export default Predictions
