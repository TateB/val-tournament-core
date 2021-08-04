import "./App.css"
import features from "./Features/etc/Features"
import { Pane } from "evergreen-ui"
import { Component, useState, useEffect, Fragment } from "react"
import { checkForOAuth } from "./apis/apis"
import { connect } from "./webrtc/connect"
import db from "./db/db"
import makeDefaults from "./db/makeDefaults"
import { createDelayListeners } from "./apis/delay"
import { useLiveQuery } from "dexie-react-hooks"
import RestrictedFeature from "./Features/etc/RestrictedFeature"

const App = () => {
  const [appOpen, setAppOpen] = useState("Teams")
  const twitchStatus = useLiveQuery(() =>
    db.userSessions.get("twitch").then((obj) => obj.authenticated)
  )

  const openApp = (newApp) => {
    setAppOpen(newApp)
  }

  useEffect(() => {
    checkForOAuth()
    connect()
    db.on("populate", makeDefaults)
    db.teams.get(0)
    createDelayListeners()
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
      {features.map(function (feature, inx) {
        if (feature.name === "Predictions" && !twitchStatus) return null
        if (!twitchStatus && inx === features.length - 1)
          return (
            <Fragment>
              <feature.element
                key={feature.name}
                name={feature.name}
                openAppCallback={openApp}
                openedApp={appOpen}
              />
              <RestrictedFeature key="Predictions" name="Predictions" />
            </Fragment>
          )
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
