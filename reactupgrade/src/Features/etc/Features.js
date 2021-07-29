import MapBans from "../MapBans"
import Predictions from "../Predictions"
import Scores from "../Scores"
import Settings from "../Settings"
import Teams from "../Teams"

const allFeatures = [
  { name: "Teams", element: Teams },
  { name: "Map Bans", element: MapBans },
  { name: "Predictions", element: Predictions },
  { name: "Scores", element: Scores },
  { name: "Settings", element: Settings },
]

export default allFeatures
