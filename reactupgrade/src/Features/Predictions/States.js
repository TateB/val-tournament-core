import NotCreated from "./NotCreated"
import InProgress from "./InProgress"
import Created from "./Created"

const States = (props) => {
  switch (props.cState) {
    case 0:
      return <NotCreated />
    case 1:
      return <Created />
    case 2:
      return <InProgress />
    default:
      return null
  }
}

export default States
