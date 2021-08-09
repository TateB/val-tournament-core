import { Card, Heading, Pane, Spinner, Text } from "evergreen-ui"
import { useEffect, useState } from "react"
import { twitch } from "../../apis/apis"
import db from "../../db/db"
import { sendPredictions } from "../../webrtc/send"
import { ReactComponent as PersonIcon } from "./person.svg"
import { ReactComponent as PointIcon } from "./point.svg"

function kNum(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num)
}

function ResultsPreview(props) {
  const [minutes, setMinutes] = useState(
    Math.floor(props.predLength / 60) || "00"
  )
  const [seconds, setSeconds] = useState(props.predLength % 60)
  const [predsResult, setPredsResult] = useState([])

  useEffect(() => {
    var fetchPredsTask

    db.settings
      .get("predictions")
      .then((predSet) => predSet.settings)
      .then((res) =>
        !res.results.length > 0
          ? (fetchPredsTask = setTimeout(
              () =>
                twitch
                  .fetchPredictions()
                  .then((resPreds) =>
                    Promise.all([
                      setPredsResult(resPreds),
                      db.settings
                        .where("name")
                        .equals("predictions")
                        .modify((s) => (s.settings.results = resPreds)),
                    ])
                  )
                  .then(() => sendPredictions()),
              props.predLength * 1000
            ))
          : setPredsResult(res.results)
      )
    return () => clearTimeout(fetchPredsTask)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (predsResult.length !== 0) return
    global.log(props)
    var secs = parseInt(props.predLength)
    var updateTimer = setInterval(() => {
      let now = new Date().getTime()
      let countDownTo = now + secs * 1000
      let distance = countDownTo - now

      var minutesCd = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      if (minutesCd < 10) minutesCd = "0" + minutesCd
      var secondsCd = Math.floor((distance % (1000 * 60)) / 1000)
      if (secondsCd < 10) secondsCd = "0" + secondsCd
      setMinutes(minutesCd)
      setSeconds(secondsCd)
      if (secs === 0) clearInterval(updateTimer)
      secs -= 1
    }, 1000)
    return () => clearInterval(updateTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (predsResult.length === 0)
    return (
      <Card
        display="flex"
        flexDirection="column"
        marginTop={24}
        elevation={1}
        padding={24}
        justifyContent="space-between"
        backgroundColor="white"
        minHeight={120}
      >
        <Heading>
          WHO WINS {props.pickedMap.toUpperCase()}? (
          {props.teams[props.otherMapInfo.teamPick].short.toUpperCase()} PICK)
        </Heading>
        <Pane
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading>Waiting for results...</Heading>
          <Spinner margin={32} />
          <Text>
            Time Remaining: {minutes}:{seconds}
          </Text>
        </Pane>
      </Card>
    )

  return (
    <Card
      display="flex"
      flexDirection="column"
      elevation={1}
      padding={24}
      justifyContent="space-between"
      backgroundColor="white"
      minHeight={120}
    >
      <Heading marginBottom={8}>
        WHO WINS {props.pickedMap.toUpperCase()}? (
        {props.teams[props.otherMapInfo.teamPick].short.toUpperCase()} PICK)
      </Heading>
      <Pane display="flex" flexDirection="column">
        {predsResult.map((r, i) => (
          <Pane
            elevation={3}
            paddingY={12}
            paddingX={12}
            marginY={8}
            backgroundColor={
              r.colour === "BLUE" ? "rgb(56, 122, 255)" : "rgb(245, 0, 155)"
            }
            display="flex"
            flexDirection="row"
          >
            <Pane display="flex" flexDirection="column">
              <Text color="white" fontWeight="bolder" marginBottom={8}>
                {props.teams[i].name.toUpperCase()}
              </Text>
              <Pane display="flex" flexDirection="row" alignItems="center">
                <PersonIcon width="25px" fill="white" />{" "}
                <Text color="white" fontWeight="500">
                  {kNum(r.participants)}
                </Text>
              </Pane>
              <Pane display="flex" flexDirection="row" alignItems="center">
                <PointIcon width="25px" height="18px" fill="white" />{" "}
                <Text color="white" fontWeight="500">
                  {kNum(r.pointsUsed)}
                </Text>
              </Pane>
            </Pane>
            <Pane
              flexGrow="1"
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <Heading size={800} fontWeight={700} color="white">
                {r.percent}%
              </Heading>
            </Pane>
          </Pane>
        ))}
      </Pane>
    </Card>
  )
}

export default ResultsPreview
