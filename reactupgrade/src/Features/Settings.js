import {
  Pane,
  Text,
  Checkbox,
  Popover,
  Button,
  TextInputField,
  FilePicker,
} from "evergreen-ui"
import { useState, useEffect } from "react"
import { BlockPicker } from "react-color"
import Layout from "./etc/Layout"
import db from "../db/db"
import resetSettings from "../db/resetToDefault"

function Settings(props) {
  const [settings, setSettings] = useState({
    streamDelay: 180,
  })

  useEffect(() => {
    db.settings.get("general").then((res) => {
      setSettings(res.settings)
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
    db.settings.update("general", { settings: settings })
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
            <Checkbox
              name="nightbotDelay"
              label="Use Stream Delay When Updating Nightbot"
              checked={settings.nightbotDelay}
              onChange={(e) => setValue("nightbotDelay", e.target.checked)}
            />
            <TextInputField
              width={240}
              label="Stream Delay (in seconds)"
              required
              value={settings.streamDelay}
              onChange={(e) => setValue("streamDelay", e.target.value)}
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
              placeholder="Custom Icon"
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
              placeholder="Custom Icon"
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
