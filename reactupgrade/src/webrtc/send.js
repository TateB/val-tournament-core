import { connections } from "./connect"
import db from "../db/db"
import urlExist from "url-exist"
import { useLiveQuery } from "dexie-react-hooks"

// FORMAT:
// TEAMS: Best Of Number, Maps Wins, Team Shorts, Team Names, iconLink, scoreArray,
// SETTINGS: reversed, useVOTColours, useCustomIcon

export function sendScores(teams, settings) {
  function readFile(file) {
    return new Promise((resolve, reject) => {
      var fr = new FileReader()
      fr.onload = () => {
        resolve(fr.result)
      }
      fr.onerror = reject
      fr.readAsDataURL(file)
    })
  }

  async function logoURL(name, tinx) {
    const fName = name.replace(/\s+/g, "-").toLowerCase()
    const logoDBs = [
      `https://raw.githubusercontent.com/lootmarket/esport-team-logos/master/valorant/${fName}/${fName}-logo.png?raw=true`,
      `https://raw.githubusercontent.com/TateB/esportslogos/main/oceania/${fName}/${fName}.square.png?raw=true`,
    ]

    return db.teams
      .get(tinx)
      .then((sTeam) => {
        const link = sTeam.iconLink.split("/")
        const linkName = link[link.length - 2]
        return linkName == fName ? sTeam.iconLink : false
      })
      .then((isSame) => {
        if (isSame) {
          return [isSame]
        }
        return Promise.all(
          logoDBs.map(async (val) => ((await urlExist(val)) ? val : null))
        )
      })
      .then((nulls) => nulls.filter((x) => x !== null))
      .then((urlChqd) => {
        console.log(urlChqd)
        return urlChqd[0]
          ? db.teams
              .update(tinx, { iconLink: urlChqd[0] })
              .then(() => urlChqd[0])
          : "icons/default.png"
      })
      .then((url) => {
        return db.settings.get("general").then((genset) => {
          if (tinx === 0 && genset.settings.useTeamOneCustomIcon)
            return readFile(genset.settings.teamOneCustomIcon[0])
          if (tinx === 1 && genset.settings.useTeamTwoCustomIcon)
            return readFile(genset.settings.teamTwoCustomIcon[0])
          if (url === "icons/default.png") {
            return genset.settings.useCustomIcon
              ? readFile(genset.settings.customIcon[0])
              : "icons/default.png"
          }
          return url
        })
      })
  }

  db.settings
    .get("general")
    .then((genset) => {
      return {
        useVOTColors: genset.settings.useVOTColours,
        customColour: genset.settings.customColour,
      }
    })
    .then((genset) => {
      const mapScores = teams[0].score.reduce(
        (acc, curval, i) => {
          const other = teams[1].score[i]
          if (curval > other) acc[0] += 1
          if (curval < other) acc[1] += 1
          return acc
        },
        [0, 0]
      )
      teams[0].maps = mapScores[0]
      teams[1].maps = mapScores[1]
      return logoURL(teams[0].name, 0)
        .then((newlink) => (teams[0].iconLink = newlink))
        .then(() => logoURL(teams[1].name, 1))
        .then((newlink) => (teams[1].iconLink = newlink))
        .then(() =>
          connections
            .filter(
              (x) =>
                x.protocol.split("_")[0] === "scores" && x.connected === true
            )
            .map((x) =>
              x.peer.send(JSON.stringify({ teams, genset, settings }))
            )
        )
    })
}
