import { Pane, Text, TextInput, Button } from "evergreen-ui"
import { Component, useEffect, useState } from "react"
import db from "../db/db"
import { setNewTeams } from "../webrtc/send"
import Layout from "./etc/Layout"

function Teams(props) {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    db.teams.bulkGet([0, 1]).then((arr) => setTeams(arr))
  }, [setTeams])

  const setValue = (inx, name, newValue) => {
    setTeams((prevState) => {
      var prevTeams = [...prevState]
      prevTeams[inx][name] = newValue
      return prevTeams
    })
  }

  if (teams[0] == undefined) return null

  const submitToDb = () => {
    db.teams.update(0, { name: teams[0].name, short: teams[0].short })
    db.teams.update(1, { name: teams[1].name, short: teams[1].short })
    setNewTeams(teams)
  }

  return (
    <Layout
      name={props.name}
      openAppCallback={props.openAppCallback}
      openedApp={props.openedApp}
    >
      <Pane>
        <Pane display="flex" flexDirection="row">
          <TextInput
            name="teama"
            value={teams[0].name}
            flexGrow="1"
            marginRight={4}
            onChange={(e) => setValue(0, "name", e.target.value)}
          />
          <TextInput
            name="teamaShort"
            value={teams[0].short}
            flexGrow="1"
            marginLeft={4}
            onChange={(e) => setValue(0, "short", e.target.value)}
          />
        </Pane>
        <Pane display="flex" flexDirection="row" marginTop={8}>
          <TextInput
            name="teamb"
            value={teams[1].name}
            flexGrow="1"
            marginRight={4}
            onChange={(e) => setValue(1, "name", e.target.value)}
          />
          <TextInput
            name="teambShort"
            value={teams[1].short}
            flexGrow="1"
            marginLeft={4}
            onChange={(e) => setValue(1, "short", e.target.value)}
          />
        </Pane>
        <Pane display="flex" flexDirection="row" marginTop={8}>
          <Button intent="success" onClick={submitToDb}>
            Submit
          </Button>
          <Pane flexGrow="1"></Pane>
          <Button intent="danger">Clear</Button>
        </Pane>
      </Pane>
    </Layout>
  )
}

export default Teams
