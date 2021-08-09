import { useLiveQuery } from "dexie-react-hooks"
import { Pane, IconButton, MoonIcon, Heading } from "evergreen-ui"
import { useState, useEffect } from "react"
import db from "../db/db"

export function FtHeader(props) {
  const [mapScores, setMapScores] = useState([0, 0])
  const useDarkMode = useLiveQuery(() =>
    db.settings.get("general").then((genset) => genset.settings.useDarkMode)
  )
  const teams = useLiveQuery(() => db.teams.bulkGet([0, 1]))

  useEffect(() => {
    if (teams === undefined) return
    const mapScores = teams[0].score.reduce(
      (acc, curval, i) => {
        const other = teams[1].score[i]
        if (curval > other) acc[0] += 1
        if (curval < other) acc[1] += 1
        return acc
      },
      [0, 0]
    )
    setMapScores(mapScores)
  }, [teams])

  const setDarkMode = () =>
    db.settings
      .where("name")
      .equals("general")
      .modify({ "settings.useDarkMode": !useDarkMode })

  if (teams === undefined) return null

  return (
    <Pane
      height="15vh"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Pane flexGrow="1">
        <Pane width={40}></Pane>
      </Pane>
      <Pane
        flexGrow="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Heading size={900}>
          {teams[0].short} ({mapScores[0]}) - ({mapScores[1]}) {teams[1].short}
        </Heading>
      </Pane>
      <Pane
        flexGrow="1"
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-end"
        height="100%"
      >
        <IconButton
          icon={MoonIcon}
          appearance="minimal"
          borderRadius="100%"
          width={32}
          height={32}
          marginTop={8}
          marginRight={8}
          onClick={setDarkMode}
          id="darkButton"
        />
      </Pane>
    </Pane>
  )
}
