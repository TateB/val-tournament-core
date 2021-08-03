import NotCreated from "./NotCreated"
import InProgress from "./InProgress"
import Created from "./Created"

const States = (props) => {
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

  if (props.predState.available)
    return (
      <Created
        pickedMaps={props.pickedMaps}
        setCState={props.setCState}
        teams={props.teams}
        maps={props.maps}
        setLoading={props.setLoading}
      />
    )
}

export default States
