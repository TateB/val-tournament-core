import Peer, { prototype } from "simple-peer"
import db from "../db/db"
import { initialSend } from "./send"

class ConnectionArray extends Array {
  #listeners

  constructor(...items) {
    super(...items)
  }

  push(val) {
    if (val.protocol) {
      const category = val.protocol.split("_")[0]
      Array.prototype.push.call(
        this,
        new Proxy(val, {
          set: function (pTarg, pProp, pVal) {
            console.log("TPV", pTarg, pProp, pVal)
            if (pProp === "connected") {
              window.dispatchEvent(
                new CustomEvent(category, {
                  detail: {
                    protocol: pTarg.protocol,
                    connected: pVal,
                  },
                  bubbles: true,
                })
              )
            }
            pTarg[pProp] = pVal
            return true
          },
        })
      )
    } else {
      Array.prototype.push.call(this, val)
    }
  }

  static get [Symbol.species]() {
    return Array
  }
}

export const connections = new ConnectionArray()

export async function connect() {
  const webRTCSettings = await db.settings.get("webrtc")
  const roomID = webRTCSettings.settings.roomID
  const wsURI = process.env.REACT_APP_WEBSOCKET + "?roomID=" + roomID
  const websocket = new WebSocket(wsURI, "UI")
  websocket.onmessage = (evt) => {
    onMessage(evt)
  }
  websocket.onopen = () => createPeers()
  const neededConnections = [
    "mapbans",
    "predictions",
    "scores",
    "scores_start",
    "scores_break",
    "scores_characterselect",
    "timer",
  ]
  const findConnection = (protocol) =>
    connections.find((x) => x.protocol === protocol)

  function createPeers() {
    for (let connection of neededConnections) {
      connections.push({
        peer: new rtcConnect(connection),
        protocol: connection,
        connected: false,
      })
    }
  }

  async function onMessage(event) {
    const msgObj = JSON.parse(event.data)
    const protocol = msgObj.protocol
    console.log("got message")
    if (msgObj.offer) {
      console.log("signalling")
      console.log(findConnection(protocol))
      findConnection(protocol).peer.signal(msgObj.offer)
    } else if (findConnection(protocol).connected) {
      console.log("connection closed")
      console.log(connections)
      await findConnection(protocol).peer.destroy()
      console.log("after destroy ")
      findConnection(protocol).peer = null
      findConnection(protocol).peer = new rtcConnect(protocol)
    } else {
      findConnection(protocol).peer = null
      findConnection(protocol).peer = new rtcConnect(protocol)
    }
    console.log(protocol)
    console.log(msgObj.offer)
    console.log(findConnection(protocol).connected)
  }

  function rtcConnect(protocol) {
    var p = new Peer({
      channelName: roomID,
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
      },
    })

    p.on("signal", (data) => {
      console.log("sending for: ", protocol)
      websocket.send(JSON.stringify({ protocol: protocol, offer: data }))
    })

    p.on("connect", (data) => {
      console.log("connected")
      findConnection(protocol).connected = true
      initialSend(protocol)
    })

    p.on("close", () => {
      console.log("closed peer")
      p.removeAllListeners()
      findConnection(protocol).connected = false
    })

    p.on("error", (err) => {
      console.log("error in peer", err)
      p.removeAllListeners()
      findConnection(protocol).connected = false
    })

    return p
  }
}
