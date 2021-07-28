import { Pane, TextInput, Select, Text, Button } from "evergreen-ui"
import { Component } from "react"
import Layout from "./etc/Layout"

class Scores extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pickedMaps: ["Ascent", "Icebox", "Haven"],
      teams: ["Team A", "Team B"],
      mapScores: [
        { map: "Ascent", teamScores: [0, 0] },
        { map: "Icebox", teamScores: [0, 0] },
        { map: "Haven", teamScores: [0, 0] },
      ],
    }
  }

  render() {
    return (
      <Layout
        name={this.props.name}
        openAppCallback={this.props.openAppCallback}
        openedApp={this.props.openedApp}
      >
        <Pane display="flex" flexDirection="column">
          {this.state.mapScores.map((mScore, inx) => (
            <Pane key={inx} marginTop={8} display="flex" flexDirection="row">
              <Pane flexGrow="2" display="flex" alignItems="center">
                <Text>Map {inx + 1}</Text>
              </Pane>
              <Select
                flexGrow="1"
                marginRight={4}
                onChange={(event) => alert(event.target.value)}
                disabled={inx === 0 ? false : true}
              >
                {this.state.pickedMaps.map((pMap) => (
                  <option value={pMap.toLowerCase()}>{pMap}</option>
                ))}
              </Select>
              <TextInput
                name={inx}
                placeholder={this.state.teams[0] + " Map Score"}
                marginRight={4}
                marginLeft={4}
                disabled={inx === 0 ? false : true}
              />
              <TextInput
                name={inx}
                placeholder={this.state.teams[1] + " Map Score"}
                marginLeft={4}
                disabled={inx === 0 ? false : true}
              />
            </Pane>
          ))}
          <Pane display="flex" flexDirection="row" marginTop={16}>
            <Button intent="success" marginRight="8px">
              Submit
            </Button>
            <Pane flexGrow="1"></Pane>
            <Button intent="danger">Clear</Button>
          </Pane>
        </Pane>
      </Layout>
    )
  }
}

export default Scores
