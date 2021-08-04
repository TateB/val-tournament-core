import {
  Pane,
  Heading,
  IconButton,
  CaretDownIcon,
  Tooltip,
  TickCircleIcon,
  FullCircleIcon,
  Position,
} from "evergreen-ui"
import { Component, useCallback, useEffect, useRef, useState } from "react"
import AnimateHeight from "react-animate-height"
import "./Features.css"
import useEvent from "./useEvent"

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

  useEffect(
    () => setBodyShowing(props.name === props.openedApp),
    [props.openedApp]
  )

  useEffect(() => {
    console.log(rtcStatus)
    return props.protocols
      ? window.addEventListener(props.protocols[0], (e) =>
          setRtcStatus((rtcStatus) =>
            Object.assign({}, rtcStatus, {
              [e.detail.protocol]: e.detail.connected,
            })
          )
        )
      : null
  }, [])

  useEffect(() => console.log("IS CONNECTED:", rtcStatus))

  const toggleShow = () => props.openAppCallback(props.name)

  const calculateItems = () => {
    if (props.protocols) {
      props.protocols.map((p) => {
        var circleIcon
        if (rtcStatus[p].connected) {
          circleIcon = <TickCircleIcon fill="#97D7BF" />
        } else {
          circleIcon = <TickCircleIcon color="#EE9191" />
        }
        return (
          <Tooltip content={p} position={Position.TOP}>
            circleIcon
          </Tooltip>
        )
      })
    }
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
                <Tooltip content={p} position={Position.TOP}>
                  {rtcStatus[p] ? (
                    <FullCircleIcon marginX={16} color="#97D7BF" />
                  ) : (
                    <FullCircleIcon marginX={16} color="#EE9191" />
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
