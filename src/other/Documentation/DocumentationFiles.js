import { Integrations } from "./Integrations"
import { MapBans } from "./MapBans"
import { OBSViews } from "./OBSViews"
import { Predictions } from "./Predictions"
import { QuickActions } from "./QuickActions"
import { Scores } from "./Scores"
import { Teams } from "./Teams"
import { Timer } from "./Timer"

export const tabs = [
  { name: "OBS Views", Element: OBSViews },
  { name: "Teams", Element: Teams },
  { name: "Map Bans", Element: MapBans },
  { name: "Predictions", Element: Predictions },
  { name: "Scores", Element: Scores },
  { name: "Timer", Element: Timer },
  { name: "Integrations", Element: Integrations },
  { name: "Quick Actions", Element: QuickActions },
]
