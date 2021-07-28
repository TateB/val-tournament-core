import { Pane, Text, TextInput, Button } from "evergreen-ui"
import { Component } from "react"
import Layout from "./etc/Layout"

class Teams extends Component {
  constructor(props) {
    super(props)
    this.state = {
      teams: ["Team A", "Team B"],
      teamShorts: ["TEMA", "TEMB"],
    }
  }

  render() {
    return (
      <Layout
        name={this.props.name}
        openAppCallback={this.props.openAppCallback}
        openedApp={this.props.openedApp}
      >
        <Pane>
          <Pane display="flex" flexDirection="row">
            <TextInput
              name="teama"
              value={this.state.teams[0]}
              flexGrow="1"
              marginRight={4}
            />
            <TextInput
              name="teamaShort"
              value={this.state.teamShorts[0]}
              flexGrow="1"
              marginLeft={4}
            />
          </Pane>
          <Pane display="flex" flexDirection="row" marginTop={8}>
            <TextInput
              name="teama"
              value={this.state.teams[1]}
              flexGrow="1"
              marginRight={4}
            />
            <TextInput
              name="teamaShort"
              value={this.state.teamShorts[1]}
              flexGrow="1"
              marginLeft={4}
            />
          </Pane>
          <Pane display="flex" flexDirection="row" marginTop={8}>
            <Button intent="success">Submit</Button>
            <Pane flexGrow="1"></Pane>
            <Button intent="danger">Clear</Button>
          </Pane>
        </Pane>
      </Layout>
    )
  }
}

export default Teams
