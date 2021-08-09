import { useLiveQuery } from "dexie-react-hooks"
import {
  CaretDownIcon,
  FullCircleIcon,
  Heading,
  IconButton,
  Pane,
  Position,
  Text,
  TextInput,
  Tooltip,
} from "evergreen-ui"
import { useEffect, useState } from "react"
import AnimateHeight from "react-animate-height"
import db from "../../db/db"
import "./Features.css"

function Layout(props) {
  const [bodyShowing, setBodyShowing] = useState(props.name === props.openedApp)
  const [rtcStatus, setRtcStatus] = useState(() =>
    props.protocols
      ? props.protocols.reduce(
          (obj, x) => Object.assign(obj, { [x]: false }),
          {}
        )
      : null
  )
  const roomID = useLiveQuery(() =>
    db.settings.get("webrtc").then((obj) => obj.settings.roomID)
  )

  useEffect(
    () => setBodyShowing(props.name === props.openedApp),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.openedApp]
  )

  useEffect(() => {
    global.log(rtcStatus)
    return props.protocols
      ? window.addEventListener(props.protocols[0], (e) =>
          setRtcStatus((rtcStatus) =>
            Object.assign({}, rtcStatus, {
              [e.detail.protocol]: e.detail.connected,
            })
          )
        )
      : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleShow = () => props.openAppCallback(props.name)

  const copyToClipboard = (p) => {
    var copyText = document.querySelector("#" + p + "clip")
    copyText.select()
    document.execCommand("copy")
  }

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      elevation={bodyShowing ? 2 : 1}
      width={1000}
      padding={20}
      marginY={16}
      background={bodyShowing ? "tint1" : ""}
    >
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
        alignItems="center"
      >
        <Heading>{props.name}</Heading>
        <Pane>
          {props.protocols
            ? props.protocols.map((p) => (
                <Tooltip
                  content={
                    <Pane
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <TextInput
                        value={
                          process.env.REACT_APP_URL +
                          "obs/" +
                          p +
                          "#" +
                          "roomID=" +
                          roomID
                        }
                        id={p + "clip"}
                        readOnly
                        width={160}
                      ></TextInput>
                      <Text marginTop={8} color="white">
                        {p}
                      </Text>
                    </Pane>
                  }
                  position={Position.TOP}
                >
                  {rtcStatus[p] ? (
                    <IconButton
                      icon={<FullCircleIcon color="#97D7BF" />}
                      appearance="minimal"
                      onClick={() => copyToClipboard(p)}
                      marginX={12}
                    />
                  ) : (
                    <IconButton
                      icon={<FullCircleIcon color="#EE9191" />}
                      appearance="minimal"
                      onClick={() => copyToClipboard(p)}
                      marginX={12}
                    />
                  )}
                </Tooltip>
              ))
            : null}
          <IconButton
            icon={CaretDownIcon}
            appearance="minimal"
            onClick={toggleShow}
          />
        </Pane>
      </Pane>
      <AnimateHeight
        duration={600}
        height={bodyShowing ? "auto" : 0}
        style={{ width: "100%" }}
      >
        <Pane paddingTop="20px">
          <hr
            style={{
              backgroundColor: "lightgrey",
              border: "none",
              height: "1px",
            }}
          />
          {props.children}
        </Pane>
      </AnimateHeight>
    </Pane>
  )
}

export default Layout
