import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import db from "../db/db"
import Layout from "./etc/Layout"
import States from "./Predictions/States"

function Predictions(props) {
  const [cState, setCState] = useState(0)
  const teams = useLiveQuery(() => db.teams.bulkGet([0, 1, 2]))
  const maps = useLiveQuery(() =>
    db.maps.toArray((arr) => arr.map((x) => x.name))
  )
  const pickedMaps = useLiveQuery(() =>
    db.mapbans.where("isBan").equals(0).toArray()
  )
  const playedMaps = useLiveQuery(() =>
    db.mapbans.toArray().then((arr) => arr.filter((x) => x.played >= 0))
  )
  const predSettings = useLiveQuery(() => db.settings.get("predictions"))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [predSettings])

  if (
    !pickedMaps ||
    !teams ||
    !maps ||
    !predSettings ||
    !playedMaps ||
    pickedMaps.length === 0 ||
    teams.length === 0 ||
    maps.length === 0
  )
    return (
      <Layout
        name={props.name}
        openAppCallback={props.openAppCallback}
        openedApp={props.openedApp}
        protocols={["predictions"]}
      ></Layout>
    )

  return (
    <Layout
      name={props.name}
      openAppCallback={props.openAppCallback}
      openedApp={props.openedApp}
      protocols={["predictions"]}
      disabled={playedMaps.length === pickedMaps.length}
    >
      <States
        cState={cState}
        teams={teams}
        setCState={setCState}
        pickedMaps={pickedMaps}
        maps={maps}
        setLoading={setLoading}
        predState={predSettings.settings}
        loading={loading}
      />
    </Layout>
  )
}

export default Predictions
