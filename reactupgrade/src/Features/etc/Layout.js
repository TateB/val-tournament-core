import { Pane, Heading, IconButton, CaretDownIcon } from "evergreen-ui"
import { Component, useEffect } from "react"
import AnimateHeight from "react-animate-height"
import "./Features.css"

class Layout extends Component {
  constructor(props) {
    super(props)
    this.toggleShow = this.toggleShow.bind(this)
    this.state = {
      bodyShowing: this.props.openedApp === this.props.name ? true : false,
    }
  }

  toggleShow() {
    this.props.openAppCallback(this.props.name)
  }

  componentDidUpdate(prevProps) {
    if (this.props.openedApp !== prevProps.openedApp) {
      if (this.props.openedApp === this.props.name) {
        this.setState({ bodyShowing: true })
      } else {
        this.setState({ bodyShowing: false })
      }
    }
  }

  render() {
    return (
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        elevation={this.state.bodyShowing ? 2 : 1}
        width={1000}
        padding={20}
      >
        <Pane
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Heading>{this.props.name}</Heading>
          <IconButton
            icon={CaretDownIcon}
            appearance="minimal"
            onClick={this.toggleShow}
          />
        </Pane>
        <AnimateHeight
          duration={600}
          height={this.state.bodyShowing ? "auto" : 0}
          style={{ width: "100%" }}
        >
          <Pane paddingTop="25px">{this.props.children}</Pane>
        </AnimateHeight>
      </Pane>
    )
  }
}

export default Layout
