import db from "./db"

const resetSettings = async (setting) => {
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
        },
      })
      return
    default:
      return
  }
}

export default resetSettings
