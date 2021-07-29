import "./App.css"
import features from "./Features/etc/Features"
import { Pane } from "evergreen-ui"
import { Component, useState, useEffect } from "react"
import { checkForOAuth } from "./apis/apis"

const App = () => {
  const [appOpen, setAppOpen] = useState("Teams")

  const openApp = (newApp) => {
    setAppOpen(newApp)
  }

  useEffect(() => {
    checkForOAuth()
  }, [])

  return (
    <Pane
      height="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-around"
      paddingTop="10%"
      paddingBottom="10%"
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
