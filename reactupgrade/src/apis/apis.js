import twitchImport from "./twitch"
import nightbotImport from "./nightbot"

export const checkForOAuth = () => {
  if (window.location.pathname !== "/") {
    if (window.location.pathname === "/twitch/") twitchImport.authCheck()
    if (window.location.pathname === "/nightbot/") nightbotImport.authCheck()
  }
}

export function convertMiliseconds(miliseconds, format) {
  var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds

  total_seconds = parseInt(Math.floor(miliseconds / 1000))
  total_minutes = parseInt(Math.floor(total_seconds / 60))
  total_hours = parseInt(Math.floor(total_minutes / 60))
  days = parseInt(Math.floor(total_hours / 24))

  seconds = parseInt(total_seconds % 60)
  minutes = parseInt(total_minutes % 60)
  hours = parseInt(total_hours % 24)

  switch (format) {
    case "s":
      return total_seconds
    case "m":
      return total_minutes
    case "h":
      return total_hours
    case "d":
      return days
    default:
      return { d: days, h: hours, m: minutes, s: seconds }
  }
}

export const twitch = twitchImport
export const nightbot = nightbotImport
