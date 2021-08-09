import { useLiveQuery } from "dexie-react-hooks"
import {
  SideSheet,
  Pane,
  Tab,
  IconButton,
  CogIcon,
  Heading,
  Tablist,
  SelectField,
  Text,
  Spinner,
  TextInput,
  Card,
  Button,
} from "evergreen-ui"
import { Fragment } from "react"
import { useEffect, useState } from "react"
import { nightbot } from "../../apis/apis"
import db from "../../db/db"
import { NbTabs } from "./NbTabs"

export const NbSettings = () => {
  const tabs = [
    { name: "Commands", dbRef: "commands" },
    { name: "Casters", dbRef: "casters" },
    { name: "Match Info", dbRef: "matchInformation" },
  ]
  const [settings, setSettings] = useState()
  const [isOriginal, setIsOriginal] = useState(true)
  const [isShowing, setIsShowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [nightbotCommands, setNightbotCommands] = useState()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const settingsRef = useLiveQuery(() =>
    db.settings.get("nightbot").then((arr) => arr.settings)
  )

  useEffect(
    () => db.settings.get("nightbot").then((arr) => setSettings(arr.settings)),
    [settingsRef]
  )

  useEffect(() => {
    if (settings === undefined || settingsRef === undefined) return
    Promise.all([JSON.stringify(settings), JSON.stringify(settingsRef)]).then(
      (sets) =>
        sets[0] === sets[1] ? setIsOriginal(true) : setIsOriginal(false)
    )
  }, [settings])

  useEffect(() => {
    if (!isShowing) return
    setIsLoading(true)
    nightbot
      .getNightbotCommands()
      .then((commands) => commands.map((x) => ({ name: x.name, id: x._id })))
      .then((commands) => setNightbotCommands(commands))
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.error(err)
        setIsShowing(false)
        throw new Error("Nightbot: Error fetching commands")
      })
  }, [isShowing])

  const setCommand = (inx, id) => {
    setSettings((prevState) => {
      const prevSettings = { ...prevState }
      prevSettings.commands[inx].id = id
      return prevSettings
    })
  }

  const setOther = (category, nameinx, inx, newVal) => {
    setSettings((prevState) => {
      const prevSettings = { ...prevState }
      prevSettings[category][nameinx].infoVals[inx].value = newVal
      return prevSettings
    })
  }

  const addNewCaster = (newVal) => {
    setSettings((prevState) => {
      const prevSettings = { ...prevState }
      global.log("ADDING CASTER", newVal)
      prevSettings.casters.push(newVal)
      return prevSettings
    })
  }

  const removeCaster = (inx) => {
    setSettings((prevState) => {
      const prevSettings = { ...prevState }
      prevSettings.casters.splice(inx)
      return prevSettings
    })
  }

  const cancelChanges = () => {
    setSettings({ ...settingsRef })
  }

  const submitToDb = () =>
    db.settings
      .update("nightbot", { settings: settings })
      .then(() => nightbot.setCommands(["caster", "bracket"]))

  return (
    <Fragment>
      <SideSheet
        isShown={isShowing}
        onCloseComplete={() => setIsShowing(false)}
        containerProps={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
        }}
      >
        {!isLoading ? (
          <Pane padding={16}>
            <Pane marginBottom={8}>
              <Heading size={800}>Nightbot Settings</Heading>
            </Pane>
            <Card
              background="tint2"
              elevation={1}
              padding={4}
              marginBottom={8}
              display="flex"
              flex-direction="row"
            >
              <Tablist flexGrow="1">
                {NbTabs.map((tab, index) => (
                  <Tab
                    height="auto"
                    key={tab.dbRef}
                    id={tab.dbRef}
                    onSelect={() => setSelectedIndex(index)}
                    isSelected={index === selectedIndex}
                    aria-controls={`panel-${tab.dbRef}`}
                  >
                    {tab.name}
                  </Tab>
                ))}
              </Tablist>
              <Button
                intent="danger"
                marginRight={8}
                disabled={isOriginal}
                onClick={cancelChanges}
              >
                Cancel
              </Button>
              <Button
                intent="success"
                disabled={isOriginal}
                onClick={submitToDb}
              >
                Submit
              </Button>
            </Card>
            {NbTabs.map((Tab, index) => (
              <Tab.element
                index={index}
                selectedIndex={selectedIndex}
                settings={settings}
                setCommand={setCommand}
                nightbotCommands={nightbotCommands}
                setOther={setOther}
                addNewCaster={addNewCaster}
                removeCaster={removeCaster}
              />
            ))}
          </Pane>
        ) : (
          <Pane>
            <Spinner />
          </Pane>
        )}
      </SideSheet>
      <IconButton
        icon={CogIcon}
        onClick={() => setIsShowing(true)}
        intent="none"
      />
    </Fragment>
  )
}
