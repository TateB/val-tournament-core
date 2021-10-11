import { useLiveQuery } from "dexie-react-hooks"
import { Button, Tooltip } from "evergreen-ui"
import html2canvas from "html2canvas"
import { useEffect, useState } from "react"
import db from "../../db/db"

export const DownloadAsPNG = (props) => {
  const roomID = useLiveQuery(() =>
    db.settings.get("webrtc").then((obj) => obj.settings.roomID)
  )
  const [iframe, setIframe] = useState()

  useEffect(() => {
    if (roomID === undefined) return
    const el = document.createElement("iframe")
    el.setAttribute("width", "1500px")
    el.setAttribute("height", "720px")
    el.setAttribute(
      "src",
      process.env.REACT_APP_URL + "obs/mapbans#roomID=" + roomID
    )
    el.setAttribute("id", "mapbansframe")
    setIframe(el)
  }, [roomID])

  const downloadButton = () => {
    document.body.appendChild(iframe)
    console.log(iframe)
    const windowListener = (e, resolve) => {
      if (e.detail.connected) {
        setTimeout(() => {
          let count = 0
          const iframemaps = document
            .getElementById("mapbansframe")
            .contentWindow.document.getElementsByClassName("iframemap")

          const addEvent = () => {
            count += 1
            if (count === iframemaps.length) {
              resolve()
              deregLoads()
            }
          }

          console.log(iframemaps)
          for (let map of iframemaps) {
            map.addEventListener("load", addEvent)
          }

          function deregLoads() {
            for (let map of iframemaps) {
              map.removeEventListener("load", addEvent)
            }
          }
        }, 50)
      }
    }
    const iframeListener = (resolve) =>
      window.addEventListener("mapbans", (e) => windowListener(e, resolve))
    const loadCompleted = () =>
      new Promise((resolve) =>
        iframe.addEventListener("load", iframeListener(resolve))
      )
    loadCompleted()
      .then(() => window.removeEventListener("mapbans", windowListener))
      .then(() => iframe.removeEventListener("load", iframeListener))
      .then(() =>
        html2canvas(
          document.getElementById("mapbansframe").contentWindow.document.body
        )
      )
      .then((canvas) => {
        const link = document.createElement("a")
        link.download = "mapbans.png"
        link.href = canvas.toDataURL("image/png")
        return link.click()
      })
      .then(() => document.body.removeChild(iframe))
  }

  if (props.rtcState.mapbans) {
    return (
      <Tooltip content="Cannot download while OBS is connected">
        <Button
          intent="none"
          style={{ cursor: "default" }}
          color="#c1c4d6"
          borderColor="#E6E8F0"
        >
          Download as PNG
        </Button>
      </Tooltip>
    )
  } else {
    return (
      <Button
        intent="none"
        onClick={() => props.sendToDb().then(() => downloadButton())}
      >
        Download as PNG
      </Button>
    )
  }
}
