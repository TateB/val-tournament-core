import { useLiveQuery } from "dexie-react-hooks"
import { Pane, Textarea, Button } from "evergreen-ui"
import { Component, useEffect, useRef, useState } from "react"
import db from "../db/db"
import { sendMapBans } from "../webrtc/send"
import Layout from "./etc/Layout"
import ManualInput from "./MapBans/ManualInput"
import Preview from "./MapBans/Preview"
import textInput from "./MapBans/textInput"

function MapBans(props) {
  const [dbMapBans, setDbMapBans] = useState([])
  const [mapsArray, setMapsArray] = useState([])
  const dbTeams = useLiveQuery(() => db.teams.bulkGet([0, 1]))
  const [vetoLog, setVetoLog] = useState("")
  const [sides, setSides] = useState([])

  useEffect(() => {
    db.mapbans.toArray().then((arr) => setDbMapBans(arr))
    db.maps.toArray().then((arr) => setMapsArray(arr))
    db.sides.toArray().then((arr) => setSides(arr))
  }, [setDbMapBans, dbTeams])

  const sendToDb = () => {
    if (vetoLog === "") {
      const savedMapBans = dbMapBans
      db.mapbans.clear().then(() => db.mapbans.bulkAdd(savedMapBans))
    } else {
      textInput(dbTeams, vetoLog, mapsArray, sides)
        .then((recievedBans) => setDbMapBans(recievedBans))
        .then(() => setVetoLog(""))
        .then(() => sendMapBans())
        .catch((err) => console.error(err))
    }
  }

  if (dbMapBans.length === 0 || mapsArray.length === 0 || dbTeams === undefined)
    return null

  return (
    <Layout
      name={props.name}
      openAppCallback={props.openAppCallback}
      openedApp={props.openedApp}
    >
      <Pane display="flex" width="100%" flexDirection="column">
        <Pane display="flex" flexDirection="row">
          <Textarea
            flexGrow="1"
            name="textarea-1"
            placeholder="Veto Log &#10;E.g. TEAMA pick Haven Def &#10;TEAMB pick Icebox Atk"
            resize="none"
            value={vetoLog}
            onChange={(e) => setVetoLog(e.target.value)}
          />
          <Preview mapBans={dbMapBans} teams={dbTeams} maps={mapsArray} />
        </Pane>
        <Pane display="flex" flexDirection="row" marginTop="5px">
          <Button intent="success" marginRight="8px" onClick={sendToDb}>
            Submit
          </Button>
          <Pane flexGrow="1"></Pane>
          <ManualInput
            mapBans={dbMapBans}
            teams={dbTeams}
            maps={mapsArray}
            setMapBans={setDbMapBans}
          />
          <Button intent="danger">Clear</Button>
        </Pane>
      </Pane>
    </Layout>
  )
}

export default MapBans
