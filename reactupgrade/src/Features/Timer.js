import {
  Pane,
  TextInputField,
  IconButton,
  PlayIcon,
  StopIcon,
  Button,
  RefreshIcon,
} from "evergreen-ui"
import { useEffect, useState } from "react"
import db from "../db/db"
import resetSettings from "../db/resetToDefault"
import {
  sendTimerReset,
  sendTimerStart,
  sendTimerStop,
  sendTimer,
} from "../webrtc/send"
import Layout from "./etc/Layout"

function Timer(props) {
  const [settings, setSettings] = useState({
    seconds: 600,
  })

  useEffect(() => {
    db.settings.get("timer").then((obj) => setSettings(obj.settings))
  }, [setSettings])

  const setValue = (name, newValue) => {
    setSettings((prevState) => {
      var prevSettings = { ...prevState }
      prevSettings[name] = newValue
      return prevSettings
    })
  }

  const submitToDb = () => {
    db.settings.update("timer", { settings: settings })
    sendTimer(settings)
  }

  const resetToDefault = () => {
    resetSettings("timer")
  }

  return (
    <Layout
      name={props.name}
      openAppCallback={props.openAppCallback}
      openedApp={props.openedApp}
      protocols={["timer"]}
    >
      <Pane>
        <TextInputField
          width={240}
          label="Timer Amount (in seconds)"
          value={settings.seconds}
          onChange={(e) => setValue("seconds", e.target.value)}
        />
      </Pane>
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        marginTop={8}
      >
        <Button intent="success" onClick={submitToDb} marginRight={4}>
          Submit
        </Button>
        <IconButton
          icon={PlayIcon}
          intent="success"
          marginX={4}
          onClick={sendTimerStart}
        />
        <IconButton
          icon={StopIcon}
          intent="none"
          marginX={4}
          onClick={sendTimerStop}
        />
        <IconButton
          icon={RefreshIcon}
          intent="danger"
          marginX={4}
          onClick={sendTimerReset}
        />
        <Pane flexGrow="1"></Pane>
        <Button intent="danger" onClick={resetToDefault}>
          Reset to Default
        </Button>
      </Pane>
    </Layout>
  )
}

export default Timer
