import {
  Button,
  Checkbox,
  FilePicker,
  Pane,
  Popover,
  Text,
  TextInputField,
} from "evergreen-ui"
import { useEffect, useState } from "react"
import { BlockPicker } from "react-color"
import { nightbot } from "../apis/apis"
import db from "../db/db"
import { resetSettings } from "../db/resetToDefault"
import { sendScores } from "../webrtc/send"
import Layout from "./etc/Layout"

function Settings(props) {
  const [settings, setSettings] = useState({
    streamDelay: 180,
  })

  const [iconNames, setIconNames] = useState(["Custom Icon", "Custom Icon"])

  useEffect(() => {
    db.settings.get("general").then((res) => {
      var iconNameRef = ["Custom Icon", "Custom Icon"]
      setSettings(res.settings)
      if (
        res.settings.teamOneCustomIcon[0] &&
        res.settings.teamOneCustomIcon[0].name
      )
        iconNameRef[0] = res.settings.teamOneCustomIcon[0].name
      if (
        res.settings.teamTwoCustomIcon[0] &&
        res.settings.teamTwoCustomIcon[0].name
      )
        iconNameRef[1] = res.settings.teamTwoCustomIcon[0].name
      setIconNames(iconNameRef)
    })
  }, [setSettings])

  const setValue = (name, newValue) => {
    setSettings((prevState) => {
      var prevSettings = { ...prevState }
      prevSettings[name] = newValue
      return prevSettings
    })
  }

  const setColour = (colour) => {
    setSettings((prevState) => {
      var prevSettings = { ...prevState }
      prevSettings["customColour"] = colour.hex
      return prevSettings
    })
  }

  const submitToDb = () => {
    var scUpNeed = false
    db.settings
      .get("general")
      .then((res) => {
        const gensetRef = res.settings
        if (
          gensetRef.useTeamOneCustomIcon !== settings.useTeamOneCustomIcon ||
          gensetRef.useTeamTwoCustomIcon !== settings.useTeamTwoCustomIcon ||
          gensetRef.teamOneCustomIcon !== settings.teamOneCustomIcon ||
          gensetRef.teamTwoCustomIcon !== settings.teamTwoCustomIcon
        ) {
          return (scUpNeed = true)
        } else {
          return (scUpNeed = false)
        }
      })
      .then(() =>
        db.settings
          .update("general", { settings: settings })
          .then(() => nightbot.setCommand("delay"))
      )
      .then(() => (scUpNeed ? sendScores() : null))
  }

  const resetToDefault = () => {
    resetSettings("general")
      .then(() => {
        return db.settings.get("general")
      })
      .then((res) => {
        setSettings(res.settings)
      })
  }

  return (
    <Layout
      name={props.name}
      openAppCallback={props.openAppCallback}
      openedApp={props.openedApp}
    >
      <Pane display="flex" flexDirection="column">
        <Pane display="flex" flexDirection="row">
          <Pane flexGrow="1">
            <Checkbox
              name="useVOTColours"
              label="Use VOT Colours"
              checked={settings.useVOTColours}
              onChange={(e) => setValue("useVOTColours", e.target.checked)}
            />
            <Pane display="flex" flexDirection="row" alignItems="center">
              {settings.useVOTColours ? (
                <Pane
                  className={"colorButton"}
                  width={16}
                  height={16}
                  backgroundColor="#E6E8F0"
                  borderRadius={4}
                  marginRight={8}
                ></Pane>
              ) : (
                <Popover
                  minWidth={0}
                  content={
                    <BlockPicker
                      onChangeComplete={setColour}
                      color={
                        settings.customColour !== ""
                          ? settings.customColour
                          : "#ff4654"
                      }
                      colors={["#ff4654", "#A800FF", "#00FFEF"]}
                    />
                  }
                >
                  <Pane
                    className={"colorButton"}
                    width={16}
                    height={16}
                    backgroundColor={
                      settings.customColour !== ""
                        ? settings.customColour
                        : "#ff4654"
                    }
                    cursor="pointer"
                    borderRadius={4}
                    marginRight={8}
                  ></Pane>
                </Popover>
              )}
              <Text
                size={300}
                color={settings.useVOTColours ? "#c1c4d6" : "#474d66"}
              >
                Custom Colour
              </Text>
            </Pane>
            <Checkbox
              name="isLowerCase"
              label="Use Lowercase Styling"
              checked={settings.isLowerCase}
              onChange={(e) => setValue("isLowerCase", e.target.checked)}
            />
            <TextInputField
              width={240}
              type="number"
              label="Stream Delay (in seconds)"
              required
              value={settings.streamDelay}
              onChange={(e) =>
                setValue("streamDelay", parseInt(e.target.value))
              }
            />
          </Pane>
          <Pane flexGrow="1">
            <Checkbox
              marginY={8}
              name="useCustomIcon"
              label="Use Custom Default Icon"
              checked={settings.useCustomIcon}
              onChange={(e) => setValue("useCustomIcon", e.target.checked)}
            />
            <FilePicker
              disabled={!settings.useCustomIcon}
              width={250}
              onChange={(file) => setValue("customIcon", file)}
              placeholder="Custom Icon"
            />
            <Checkbox
              marginY={8}
              name="useTeamOneCustomIcon"
              label="Use Custom Icon for Team One"
              checked={settings.useTeamOneCustomIcon}
              onChange={(e) =>
                setValue("useTeamOneCustomIcon", e.target.checked)
              }
            />
            <FilePicker
              disabled={!settings.useTeamOneCustomIcon}
              width={250}
              onChange={(file) => setValue("teamOneCustomIcon", file)}
              placeholder={iconNames[0]}
            />
            <Checkbox
              marginY={8}
              name="useTeamTwoCustomIcon"
              label="Use Custom Icon for Team Two"
              checked={settings.useTeamTwoCustomIcon}
              onChange={(e) =>
                setValue("useTeamTwoCustomIcon", e.target.checked)
              }
            />
            <FilePicker
              disabled={!settings.useTeamTwoCustomIcon}
              width={250}
              onChange={(file) => setValue("teamTwoCustomIcon", file)}
              placeholder={iconNames[1]}
            />
          </Pane>
        </Pane>
        <Pane
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          marginTop={8}
        >
          <Button intent="success" onClick={submitToDb}>
            Submit
          </Button>
          <Button intent="danger" onClick={resetToDefault}>
            Reset to Defaults
          </Button>
        </Pane>
      </Pane>
    </Layout>
  )
}

export default Settings
