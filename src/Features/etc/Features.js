import MapBans from "../MapBans"
import Predictions from "../Predictions"
import Scores from "../Scores"
import Timer from "../Timer"
import Settings from "../Settings"
import Teams from "../Teams"
import Integrations from "../Integrations"

const allFeatures = [
  { name: "Teams", element: Teams },
  { name: "Map Bans", element: MapBans },
  { name: "Predictions", element: Predictions },
  { name: "Scores", element: Scores },
  { name: "Timer", element: Timer },
  { name: "Settings", element: Settings },
  { name: "Integrations", element: Integrations },
]

export default allFeatures
