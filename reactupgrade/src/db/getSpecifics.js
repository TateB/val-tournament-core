import db from "./db"

export const getSpecifics = (needed) =>
  new Promise((resolve, reject) => {
    switch (needed) {
      case "teams":
        db.teams.toArray().then((arr) => resolve(arr))
        break
      case "picks":
        db.mapbans
          .where("isBan")
          .equals(0)
          .toArray()
          .then((arr) => resolve(arr))
        break
      case "bans":
        db.mapbans
          .where("isBan")
          .equals(1)
          .toArray()
          .then((arr) => resolve(arr))
        break
      case "bansPicks":
        db.mapbans.toArray().then((arr) => resolve(arr))
        break
      case "played":
        db.mapbans
          .where("played")
          .toArray()
          .then((arr) => resolve(arr))
        break
      case "sides":
        db.sides.toArray().then((arr) => resolve(arr))
        break
      case "maps":
        db.maps.toArray().then((arr) => resolve(arr))
        break
      case "nbSet":
        db.settings.get("nightbot").then((obj) => resolve(obj.settings))
        break
      case "nbSession":
        db.userSessions.get("nightbot").then((obj) => resolve(obj))
        break
      case "delay":
        db.settings
          .get("general")
          .then((obj) => resolve(obj.settings.streamDelay))
        break
      default:
        throw new Error("DB: Couldn't get " + needed)
        break
    }
  })
