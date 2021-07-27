import "./App.css"
import features from "./Features/etc/Features"
import { Pane } from "evergreen-ui"
import { Component } from "react"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appOpen: "Map Bans",
    }
  }

  openApp = (newApp) => {
    this.setState({ appOpen: newApp })
  }

  render() {
    return (
      <Pane
        height="100vh"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        paddingTop="10%"
        paddingBottom="10%"
      >
        {features.map(function (feature) {
          return (
            <feature.element
              key={feature.name}
              name={feature.name}
              openAppCallback={this.openApp}
              openedApp={this.state.appOpen}
            />
          )
        }, this)}
      </Pane>
    )
  }
}

export default App
