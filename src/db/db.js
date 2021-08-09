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

export default db

/*export const resetToDefaults = async () => {
  await db.delete()
  await db.version(1).stores({
    maps: "id,name",
    sides: "id,name,short",
    mapbans: "id,map,isBan,teamPick,sidePick,isShowing",
    teams: "id,name,short,iconLink,score",
    settings: "id,name",
    userSessions: "name,authenticated",
  })
  await makeDefaults()
  return
}
*/
