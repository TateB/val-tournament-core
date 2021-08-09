import { CaretDownIcon, Heading, IconButton, Pane } from "evergreen-ui"
import { Component } from "react"
import "./Features.css"

class RestrictedFeature extends Component {
  render() {
    return (
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        elevation={1}
        width={1000}
        padding={20}
        marginY={16}
        background={"tint2"}
      >
        <Pane
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Pane display="flex" flexDirection="column">
            <Heading color="#8f95b2">Requires Twitch Login</Heading>
            <Heading color="#c1c4d6">{this.props.name}</Heading>
          </Pane>
          <IconButton icon={CaretDownIcon} disabled appearance="minimal" />
        </Pane>
      </Pane>
    )
  }
}

export default RestrictedFeature
