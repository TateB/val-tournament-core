import { useLiveQuery } from "dexie-react-hooks"
import {
  DoubleChevronUpIcon,
  Heading,
  IconButton,
  MoonIcon,
  Pane,
  RefreshIcon,
  Text,
  Tooltip,
} from "evergreen-ui"
import { useEffect, useState } from "react"
import db from "../db/db"
import { sendPredictions, sendScores, togglePredictions } from "../webrtc/send"
import { Documentation } from "./Documentation"

export function FtHeader(props) {
  const [mapScores, setMapScores] = useState([0, 0])
  const useDarkMode = useLiveQuery(() =>
    db.settings.get("general").then((genset) => genset.settings.useDarkMode)
  )
  const reversed = useLiveQuery(() =>
    db.settings.get("scores").then((genset) => genset.settings.reversed)
  )
  const teams = useLiveQuery(() => db.teams.bulkGet([0, 1]))
  const predSet = useLiveQuery(() =>
    db.settings.get("predictions").then((obj) => obj.settings)
  )

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

  const flipScoreboard = () =>
    db.settings
      .where("name")
      .equals("scores")
      .modify({ "settings.reversed": !reversed })
      .then(() => sendScores())
      .then(() => sendPredictions())

  const togglePredictionsShowing = () =>
    db.settings
      .where("name")
      .equals("predictions")
      .modify({ "settings.showing": !predSet.showing })
      .then(() => togglePredictions())

  if (teams === undefined || predSet === undefined) return null

  return (
    <Pane
      height="15vh"
      minHeight="200px"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Pane flexGrow="1">
        <Pane width={80}></Pane>
      </Pane>
      <Pane
        width="1000px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="100%"
      >
        <Pane
          flexGrow="1"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Heading size={900}>
            {teams[0].short} ({mapScores[0]}) - ({mapScores[1]}){" "}
            {teams[1].short}
          </Heading>
        </Pane>
        <Pane width="100%">
          <Tooltip
            content={
              <Pane>
                <Text color="white">Flip Scoreboard</Text>
                <br />
                <Text color="white">
                  Currently: {reversed ? teams[1].short : teams[0].short} starts
                  on DEF
                </Text>
              </Pane>
            }
          >
            <IconButton
              icon={RefreshIcon}
              onClick={flipScoreboard}
              marginRight={8}
            />
          </Tooltip>
          <Tooltip content="Toggle Predictions Showing">
            <IconButton
              disabled={!predSet.available}
              icon={DoubleChevronUpIcon}
              onClick={togglePredictionsShowing}
            />
          </Tooltip>
        </Pane>
      </Pane>
      <Pane
        flexGrow="1"
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-end"
        height="100%"
      >
        <Documentation />
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
