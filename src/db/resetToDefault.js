import db from "./db"

export const resetSettings = async (setting) => {
  switch (setting) {
    case "scores":
      await db.settings.update("scores", {
        settings: {
          reversed: false,
          bestOf: 3,
        },
      })
      return
    case "timer":
      await db.settings.update("timer", {
        settings: {
          seconds: 600,
          sendReset: false,
        },
      })
      return
    case "general":
      await db.settings.update("general", {
        settings: {
          streamDelay: 180,
          useVOTColours: true,
          customColour: "",
          isLowerCase: false,
          nightbotDelay: true,
          useCustomIcon: false,
          customIcon: "",
          useDarkMode: false,
          needsIntro: false,
        },
      })
      return
    default:
      return
  }
}

export const resetMapBans = () => {
  return db.mapbans.clear().then(() =>
    db.mapbans.bulkPut([
      { id: 0, map: 0, isBan: 1, teamPick: 0, sidePick: 2, isShowing: true },
      { id: 1, map: 1, isBan: 1, teamPick: 1, sidePick: 2, isShowing: true },
      { id: 2, map: 2, isBan: 0, teamPick: 0, sidePick: 0, isShowing: true },
      { id: 3, map: 3, isBan: 0, teamPick: 1, sidePick: 1, isShowing: true },
      { id: 4, map: 4, isBan: 0, teamPick: 0, sidePick: 1, isShowing: true },
      { id: 5, map: 5, isBan: 1, teamPick: 2, sidePick: 2, isShowing: true },
    ])
  )
}
