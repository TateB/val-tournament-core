import db from "../../db/db"

function textInput(teams, mapinput, mapsArray, sides) {
  return new Promise(async (resolve, reject) => {
    const teamNames = teams.map((x) => x.name)
    const teamShorts = teams.map((x) => x.short)
    const maps = mapsArray.map((x) => x.name)

    var invalid = false
    let vetos = mapinput
    let mapPicks = vetos.split(/\r?\n/).map((x) => x.toLowerCase()) // splits into lines
    let potentialTeamSearch = await teamNames.map((x) =>
      x.split(" ")[0].toLowerCase()
    ) // first word if multiple words, easier to search
    let potentialTeamSearchShort = await teamShorts.map((x) => x.toLowerCase())
    let banWords = ["banned", "bans", "ban"]
    let pickWords = ["picks", "picked", "pick"]
    let atkWords = ["atk", "attack", "attackers", "attacking"]
    let defWords = ["def", "defense", "defence", "defending", "defenders"]

    var mapOrder = []

    Promise.all(
      mapPicks.map((mapline, id) => {
        let words = mapline.split(" ")
        mapOrder[id] = {}

        return Promise.all(
          words.map(
            (sword) =>
              new Promise((resolveInner, rejectInner) => {
                let [pTeam, pMap, pBan, pSide] = [
                  [
                    potentialTeamSearch.indexOf(sword),
                    potentialTeamSearchShort.indexOf(sword),
                  ],
                  [maps.indexOf(sword)],
                  [banWords.indexOf(sword), pickWords.indexOf(sword)],
                  [atkWords.indexOf(sword), defWords.indexOf(sword)],
                ]

                global.log(potentialTeamSearchShort.indexOf(sword))

                if (pTeam > [-1, -1]) {
                  global.log(
                    "resolved team:",
                    teamNames[pTeam.find((x) => x !== -1)]
                  )
                  resolveInner(
                    (mapOrder[id].teamPick = pTeam.find((x) => x !== -1))
                  )
                }

                if (pMap > [-1]) resolveInner((mapOrder[id].map = pMap[0]))
                if (pBan > [-1, -1])
                  resolveInner((mapOrder[id].isBan = pBan[0] > pBan[1] ? 1 : 0))
                if (pSide > [-1, -1])
                  resolveInner(
                    (mapOrder[id].sidePick = pSide[0] > pSide[1] ? 0 : 1)
                  )
                if (
                  [pTeam, pMap, pBan, pSide] ===
                  [[-1, -1], [-1], [-1, -1], [-1, -1]]
                )
                  resolveInner()
              })
          )
        ).then(() => {
          const map = mapOrder[id]
          global.log(map)
          if (map.teamPick === undefined)
            new Error(reject("There was no team pick on line: " + id))
          if (map.map === undefined)
            new Error(reject("There was no map selected on line: " + id))
          if (map.isBan === undefined)
            new Error(reject("There was no ban/pick selected on line: " + id))
          if (map.sidePick === undefined && map.isBan === 0)
            new Error(reject("There was no side pick selected on line: " + id))
          if (map.sidePick === undefined && map.isBan === 1)
            mapOrder[id].sidePick = 2
          mapOrder[id].id = id
          mapOrder[id].isShowing = true
        })
      })
    )
      .then(() => {
        if (
          mapOrder.find((x) => x.teamPick == 2) ||
          mapOrder.length === maps.length
        ) {
          // Autoban already added
          return db.mapbans
            .clear()
            .then(() => db.mapbans.bulkAdd(mapOrder))
            .then(() => resolve(mapOrder))
        } else {
          let mapsAdded = mapOrder.map((x) => x.map)
          let difference = maps.filter(
            (x) => !mapsAdded.includes(maps.indexOf(x))
          )
          mapOrder.push({
            id: mapOrder.length,
            map: maps.indexOf(difference[0]),
            isBan: 1,
            teamPick: 2,
            sidePick: 2,
            isShowing: true,
          })

          return db.mapbans
            .clear()
            .then(() => db.mapbans.bulkAdd(mapOrder))
            .then(() => resolve(mapOrder))
        }
      })
      .then(() => resolve(mapOrder))
  })
}

export default textInput
