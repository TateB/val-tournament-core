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
          .toArray()
          .then((arr) => arr.filter((x) => x.played !== undefined))
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
      case "commands":
        db.settings
          .get("nightbot")
          .then((obj) => obj.settings.commands)
          .then((obj) => resolve(obj))
        break
      case "nbSession":
        db.userSessions.get("nightbot").then((obj) => resolve(obj))
        break
      case "delay":
        db.settings
          .get("general")
          .then((obj) => obj.settings.streamDelay)
          .then((sdelay) => [Math.floor(sdelay / 60), sdelay % 60])
          .then((formatted) =>
            resolve({ minutes: formatted[0], seconds: formatted[1] })
          )
        break
      case "caster":
        db.settings
          .get("nightbot")
          .then((obj) => obj.settings.casters)
          .then((casters) =>
            casters.map((x) => ({
              name: x.infoVals[0].value,
              url: x.infoVals[1].value,
            }))
          )
          .then((casters) => resolve(casters))
        break
      case "bracket":
        db.settings
          .get("nightbot")
          .then((obj) => obj.settings.matchInformation)
          .then((mInfo) => mInfo.find((x) => x.name === "Tournament"))
          .then((tourney) =>
            resolve({
              name: tourney.infoVals[0].value,
              url: tourney.infoVals[1].value,
            })
          )
        break
      default:
        throw new Error("DB: Couldn't get " + needed)
        break
    }
  })
