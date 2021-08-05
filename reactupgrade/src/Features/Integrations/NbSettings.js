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
} from "evergreen-ui"
import { Fragment } from "react"
import { useEffect, useState } from "react"
import { nightbot } from "../../apis/apis"
import db from "../../db/db"

export const NbSettings = () => {
  const tabs = [
    { name: "Commands", dbRef: "commands" },
    { name: "Casters", dbRef: "casters" },
    { name: "Match Info", dbRef: "matchInformation" },
  ]
  const [settings, setSettings] = useState()
  const [isShowing, setIsShowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [nightbotCommands, setNightbotCommands] = useState()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const settingsRef = useLiveQuery(() =>
    db.settings.get("nightbot").then((arr) => arr.settings)
  )

  useEffect(() =>
    db.settings.get("nightbot").then((arr) => setSettings(arr), [settingsRef])
  )

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

  const setOther = (category, inx, type, newVal) => {
    setSettings((prevState) => {
      const prevSettings = { ...prevState }
      prevSettings[category][inx][type] = newVal
      return prevSettings
    })
  }

  return (
    <>
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
          <Pane>
            <Pane>
              <Heading>Nightbot Settings</Heading>
            </Pane>
            <Pane>
              <Tablist marginBottom={16} flexGrow="1" marginRight={24}>
                {tabs.map((tab, index) => (
                  <Tab
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
            </Pane>
            {tabs.map((tab, index) => (
              <Pane
                key={index}
                id={`panel-${tab.dbRef}`}
                role="tabpanel"
                aria-labelledby={tab.dbRef}
                aria-hidden={index !== selectedIndex}
                display={index === selectedIndex ? "flex" : "none"}
                width="100%"
                alignItems="center"
                flexDirection="column"
              >
                {settingsRef[tab.dbRef].map((drop, inx) => (
                  <Pane
                    key={drop.name}
                    width="100%"
                    display="flex"
                    alignItems="center"
                    flexDirection="row"
                    marginBottom={
                      inx === settingsRef[tab.dbRef].length - 1 ? 0 : 16
                    }
                  >
                    <Pane>
                      <Text width="100%" textAlign="left" marginLeft={32}>
                        {drop.name}
                      </Text>
                      {drop.example ? <Text>{drop.example}</Text> : undefined}
                    </Pane>
                    {tab.dbRef === "commands" ? (
                      <SelectField
                        value={drop.id}
                        onChange={(e) => setCommand(inx, e.target.value)}
                      >
                        {nightbotCommands.map((x) => (
                          <option value={x.id}>{x.name}</option>
                        ))}
                      </SelectField>
                    ) : (
                      Object.entries(drop).map(([key, val]) => (
                        <TextInput
                          onChange={(e) => setOther(tab.dbRef, inx, key, val)}
                          value={val}
                        />
                      ))
                    )}
                  </Pane>
                ))}
              </Pane>
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
    </>
  )
}
