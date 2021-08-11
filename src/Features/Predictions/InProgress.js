import { Button, Pane, Text } from "evergreen-ui"
import { Fragment } from "react"

function InProgress() {
  return (
    <Fragment>
      <Pane display="flex" flexDirection="row">
        <Text>Submission in progress...</Text>
      </Pane>
      <Pane display="flex" flexDirection="row" marginTop={8}>
        <Button intent="success" disabled>
          Create
        </Button>
        <Pane flexGrow="1"></Pane>
      </Pane>
    </Fragment>
  )
}

export default InProgress
