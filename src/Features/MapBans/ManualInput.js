import {
  Button,
  Combobox,
  Pane,
  SideSheet,
  Tab,
  Tablist,
  Text,
} from "evergreen-ui"
import { Fragment, useEffect, useRef, useState } from "react"

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || ""

function ManualInput(props) {
  const [tabs] = useState([
    "Map 1",
    "Map 2",
    "Map 3",
    "Map 4",
    "Map 5",
    "Map 6",
  ])

  const [dropOptions, setDropOptions] = useState([
    {
      name: "Map",
      options: [
        { label: "Ascent" },
        { label: "Icebox" },
        { label: "Haven" },
        { label: "Breeze" },
        { label: "Bind" },
        { label: "Split" },
      ],
    },
    {
      name: "Team",
      options: [{ label: "Team A" }, { label: "Team B" }, { label: "Auto" }],
    },
    {
      name: "Ban/Pick",
      options: [{ label: "Pick" }, { label: "Ban" }],
    },
    {
      name: "Side",
      options: [{ label: "Attack" }, { label: "Defence" }, { label: "None" }],
    },
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isShown, setIsShown] = useState(false)
  const [formattedMapBans, setFMB] = useState([])
  const prevMB = usePrevious(formattedMapBans)

  useEffect(() => {
    setDropOptions((prevState) => {
      var prevSettings = [...prevState]
      prevSettings[1].options = [
        { label: props.teams[0].name },
        { label: props.teams[1].name },
        { label: "Auto" },
      ]
      prevSettings[0].options = props.maps.map((m) => ({
        label: capitalize(m.name),
        id: m.id,
      }))
      return prevSettings
    })
    setFMB(props.mapBans.map((m) => [m.map, m.teamPick, m.isBan, m.sidePick]))
  }, [props, props.setMapBans])

  if (formattedMapBans.length === 0) return null

  const setExMapBans = (mapInx, keyInx, newVal) => {
    props.setMapBans((prevState) => {
      const relayArray = ["map", "teamPick", "isBan", "sidePick"]
      var prevMapBans = [...prevState]
      prevMapBans[mapInx][relayArray[keyInx]] = newVal
      if (keyInx === 0) {
        prevMapBans[prevMB.findIndex((x) => x[0] === newVal)].map =
          prevMB[mapInx][0]
        return prevMapBans
      } else {
        return prevMapBans
      }
    })
  }

  return (
    <Fragment>
      <SideSheet isShown={isShown} onCloseComplete={() => setIsShown(false)}>
        <Pane
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginTop={16}
        >
          <Pane
            display="flex"
            padding={8}
            paddingLeft={32}
            paddingRight={32}
            width="100%"
          >
            <Tablist marginBottom={16} flexGrow="1" marginRight={24}>
              {tabs.map((tab, index) => (
                <Tab
                  key={tab}
                  id={tab}
                  onSelect={() => setSelectedIndex(index)}
                  isSelected={index === selectedIndex}
                  aria-controls={`panel-${tab}`}
                >
                  {tab}
                </Tab>
              ))}
            </Tablist>
          </Pane>
          <Pane
            padding={16}
            background="tint1"
            display="flex"
            width="100%"
            flex="1"
          >
            {tabs.map((tab, index) => (
              <Pane
                key={tab}
                id={`panel-${tab}`}
                role="tabpanel"
                aria-labelledby={tab}
                aria-hidden={index !== selectedIndex}
                display={index === selectedIndex ? "flex" : "none"}
                width="100%"
                alignItems="center"
                flexDirection="column"
              >
                {dropOptions.map((drop, inx) => (
                  <Pane
                    key={drop.name}
                    width="100%"
                    display="flex"
                    alignItems="center"
                    flexDirection="row"
                    marginBottom={inx === dropOptions.length - 1 ? 0 : 16}
                  >
                    <Text width="100%" textAlign="left" marginLeft={32}>
                      {drop.name}
                    </Text>
                    <Combobox
                      selectedItem={drop.options[formattedMapBans[index][inx]]}
                      items={drop.options}
                      itemToString={(item) => (item ? item.label : "")}
                      onChange={(selected) =>
                        setExMapBans(
                          index,
                          inx,
                          dropOptions[inx].options.findIndex(
                            (x) => x === selected
                          )
                        )
                      }
                    />
                  </Pane>
                ))}
              </Pane>
            ))}
          </Pane>
        </Pane>
      </SideSheet>
      <Button intent="none" onClick={() => setIsShown(true)} marginRight="8px">
        Manual Edit
      </Button>
    </Fragment>
  )
}

export default ManualInput
