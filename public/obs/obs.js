const protocol = window.location.pathname.split("/").pop().split(".")[0]
const params = new URLSearchParams(window.location.hash.substr(1))
const roomID = params.get("roomID")
const recievedData = {
  state: {},
  chunkData: {
    receiving: false,
    id: 0,
    fileChunks: [],
    processedFiles: [],
  },
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
const wsURI = "ws://localhost:6503/?roomID=" + roomID
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
    const chunkCheck = data.toString().split("_")
    const chunkTeamId = parseInt(chunkCheck[0])
    const chunkData = recievedData.chunkData
    if (chunkCheck[3] === "start") {
      chunkData.receiving = true
      chunkData.id = chunkTeamId
    } else if (chunkCheck[3] === "end") {
      chunkData.receiving = false
      const file = new Blob(chunkData.fileChunks)
      chunkData.processedFiles[chunkTeamId] = URL.createObjectURL(file)
      console.log(file)
      console.log(chunkData.processedFiles[chunkTeamId])
      chunkData.fileChunks = []
    } else if (chunkData.receiving) {
      chunkData.fileChunks.push(data)
    } else {
      const finalisedForm = JSON.parse(data.toString())
      if (chunkData.processedFiles[0])
        finalisedForm.teams[0].iconLink = chunkData.processedFiles[0]
      if (chunkData.processedFiles[1])
        finalisedForm.teams[1].iconLink = chunkData.processedFiles[1]
      chunkData.processedFiles = []
      recievedData.data = finalisedForm
    }
    recievedData.chunkData = chunkData
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
