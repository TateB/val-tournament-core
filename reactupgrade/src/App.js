import "./App.css"
import features from "./Features/etc/Features"
import { Pane } from "evergreen-ui"
import { Component, useState, useEffect } from "react"
import { checkForOAuth } from "./apis/apis"
import { connect } from "./webrtc/connect"
import db from "./db/db"
import makeDefaults from "./db/makeDefaults"

const App = () => {
  const [appOpen, setAppOpen] = useState("Teams")

  const openApp = (newApp) => {
    setAppOpen(newApp)
  }

  useEffect(() => {
    checkForOAuth()
    connect()
    db.on("populate", makeDefaults)
    db.teams.get(0)
  }, [])

  return (
    <Pane
      minHeight="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-around"
      paddingTop="10vh"
      paddingBottom="10vh"
    >
      {features.map(function (feature) {
        return (
          <feature.element
            key={feature.name}
            name={feature.name}
            openAppCallback={openApp}
            openedApp={appOpen}
          />
        )
      })}
    </Pane>
  )
}

export default App
