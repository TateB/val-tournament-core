import NotCreated from "./NotCreated"
import InProgress from "./InProgress"
import Created from "./Created"
import { useEffect, useState } from "react"
import { Spinner, Pane } from "evergreen-ui"

function States(props) {
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    setShowSpinner(true)
    setTimeout(() => setShowSpinner(false), 1500)
  }, [props.loading])

  if (showSpinner) {
    return (
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={250}
      >
        <Spinner />
      </Pane>
    )
  }

  if (!props.predState.available && !props.predState.willSend)
    return (
      <NotCreated
        pickedMaps={props.pickedMaps}
        setCState={props.setCState}
        teams={props.teams}
        maps={props.maps}
        setLoading={props.setLoading}
      />
    )

  if (props.predState.willSend)
    return (
      <InProgress
        pickedMaps={props.pickedMaps}
        setCState={props.setCState}
        teams={props.teams}
        maps={props.maps}
      />
    )

  if (props.predState.available && props.predState.forMap !== null) {
    return (
      <Created
        pickedMaps={props.pickedMaps}
        setCState={props.setCState}
        teams={props.teams}
        maps={props.maps}
        setLoading={props.setLoading}
        pStateProp={props.predState}
      />
    )
  }
}

export default States
