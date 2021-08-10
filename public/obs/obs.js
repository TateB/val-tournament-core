const protocol = window.location.pathname.split("/").pop().split(".")[0]
const params = new URLSearchParams(window.location.hash.substr(1))
const roomID = params.get("roomID")
const recievedData = {
  state: {},
  dataListener: (val) => {},
  set data(val) {
    this.state = val
    this.dataListener(val)
  },
  get data() {
    return state
  },
  registerListener: function (listener) {
    this.dataListener = listener
  },
}

var currentPeer
const wsURI = "wss://signal.val.tatebulic.com.au:443/?roomID=" + roomID
const websocket = new WebSocket(wsURI, protocol)
websocket.onopen = () => {
  currentPeer = createPeer()
}
websocket.onmessage = (evt) => onMessage(evt)

function createPeer() {
  const p = new SimplePeer({
    channelName: roomID,
    initiator: false,
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
    console.log("got signal")
    websocket.send(JSON.stringify({ protocol: protocol, offer: data }))
  })

  p.on("connect", (data) => {
    console.log("connected")
  })

  p.on("data", (data) => {
    recievedData.data = JSON.parse(data.toString())
  })

  p.on("close", (data) => {
    console.log("closing listener")
    p.removeAllListeners()
    currentPeer = null
    currentPeer = new createPeer()
  })

  p.on("error", (data) => {
    console.log("closing error listener")
    p.removeAllListeners()
    currentPeer = null
    currentPeer = new createPeer()
  })

  return p
}

function onMessage(evt) {
  const msgObj = JSON.parse(evt.data)
  if (!msgObj.error && !msgObj.closed) {
    console.log("msg:", msgObj)
    currentPeer.signal(msgObj)
  } else {
    console.log("msg for destroy:", msgObj)
    currentPeer.destroy()
  }
}
