import Dexie from "dexie"

const db = new Dexie("valDB")
db.version(1).stores({
  maps: "id,name",
  sides: "id,name,short",
  mapbans: "id,map,isBan,teamPick,sidePick,isShowing",
  teams: "id,name,short,iconLink,score",
  settings: "name",
  userSessions: "name,authenticated",
})

// DB VERSION 2: ADD FRACTURE
db.version(2)
  .stores({
    maps: "id,name",
    sides: "id,name,short",
    mapbans: "id,map,isBan,teamPick,sidePick,isShowing",
    teams: "id,name,short,iconLink,score",
    settings: "name",
    userSessions: "name,authenticated",
  })
  .upgrade((tx) => {
    return tx
      .table("maps")
      .bulkPut([
        { id: 0, name: "ascent" },
        { id: 1, name: "bind" },
        { id: 2, name: "breeze" },
        { id: 3, name: "haven" },
        { id: 4, name: "icebox" },
        { id: 5, name: "split" },
        { id: 6, name: "fracture" },
      ])
      .then(
        tx.table("mapbans").bulkPut([
          {
            id: 0,
            map: 0,
            isBan: 1,
            teamPick: 0,
            sidePick: 2,
            isShowing: true,
          },
          {
            id: 1,
            map: 1,
            isBan: 1,
            teamPick: 1,
            sidePick: 2,
            isShowing: true,
          },
          {
            id: 2,
            map: 2,
            isBan: 1,
            teamPick: 0,
            sidePick: 2,
            isShowing: true,
          },
          {
            id: 3,
            map: 3,
            isBan: 0,
            teamPick: 1,
            sidePick: 1,
            isShowing: true,
          },
          {
            id: 4,
            map: 4,
            isBan: 0,
            teamPick: 0,
            sidePick: 1,
            isShowing: true,
          },
          {
            id: 5,
            map: 5,
            isBan: 0,
            teamPick: 1,
            sidePick: 0,
            isShowing: true,
          },
          {
            id: 6,
            map: 6,
            isBan: 1,
            teamPick: 2,
            sidePick: 2,
            isShowing: true,
          },
        ])
      )
  })

export default db
