import db from "../db.mjs"
import fetch from "node-fetch"

function forward(app) {
    db.read().then(() => {
        app.get('/submitprediction', (req, res) => submitPred(req,res))
        app.get('/predresult', (req,res) => submitPredResult(req,res))
        app.get('/checksubmit', (req,res) => checkSubmit(req,res))
        app.get('/showobs', (req,res) => submitShowObs(req,res))
        app.get('/predictions/obs', (req,res) => predObs(req,res))
        app.get('/predobscheck', (req, res) => predCheck(req, res))
    })
}

let submitPred = async (req, res) => {
    await db.read()
    const teams = db.data.info.teams
    const teamShorts = db.data.info.teamShorts
    const twitch = db.data.twitch
    const predMaps = db.data.mapbans.mapOrder.filter(x => !x.isBan)
    const maps = db.data.gameInfo.maps
    const { channelAccessToken, userId } = twitch

    let q = req.query

    let playingMap = predMaps[q.mapSelect]
    let sendBody = {
        broadcaster_id: userId,
        title: `WHO TAKES ${maps[playingMap.map].toUpperCase()}? (${teamShorts[playingMap.teamPick]} PICK)`,
        outcomes: [
            {
                title: teams[0]
            },
            {
                title: teams[1]
            }
        ],
        prediction_window: 300,
    }

    console.log(sendBody)

    await fetch('https://api.twitch.tv/helix/predictions', 
        {
            method: 'POST',
            body: JSON.stringify(sendBody),
            headers: {
                "Authorization": "Bearer " + channelAccessToken,
                "Client-Id": twitch.clientId,
                "Content-Type": "application/json",
            }
        }).then((res) => {
            return res.json()
        }).then((json) => {
            console.log(json)
            db.data.predictions = {
                currentPredicting: true,
                submitting: false,
                predId: json.data[0].id,
                teamIds: [ json.data[0].outcomes[0].id, json.data[0].outcomes[1].id ]
            }
        })

    

    await db.write()
    res.redirect('/')
}

let submitPredResult = async (req, res) => {
    await db.read()
    const { userId, channelAccessToken, clientId } = db.data.twitch
    const { predId, teamIds } = db.data.predictions

    let q = req.query

    let sendBody = {
        broadcaster_id: userId,
        id: predId,
        status: "RESOLVED",
        winning_outcome_id: teamIds[q.teamSelect]
    }

    if (q.keepDelay) {
        db.data.predictions.submitting = true
        await db.write()
        res.redirect('/')
        await new Promise(r => setTimeout(r, 10000));
    }

    await fetch('https://api.twitch.tv/helix/predictions', 
    {
        method: 'PATCH',
        body: JSON.stringify(sendBody),
        headers: {
            "Authorization": "Bearer " + channelAccessToken,
            "Client-Id": clientId,
            "Content-Type": "application/json",
        }
        }).then((res) => res.json())
        .then((json) => {
            console.log(json)
            db.data.predictions = {
                currentPredicting: false,
                submitting: false,
                predictionsShowing: false,
                predId: "",
                teamIds: [],
            }
        })

    await db.write()
    if (!q.keepDelay) res.redirect('/')
}

let predObs = async (req, res) => {
    res.render('obs/predictions')
}

let submitShowObs = async (req, res) => {
    await db.read()
    const show = db.data.predictions.predictionsShowing
    let q = req.query

    db.data.predictions.predictionsShowing = !show
    if (!show) db.data.predictions.savedPrediction = {}

    await db.write()
    res.redirect('/')
}

let predCheck = async (req, res) => {
    await db.read()
    const show = db.data.predictions.predictionsShowing
    const saved = db.data.predictions.savedPrediction
    if (!show) return res.json({})
    if (Object.keys(saved).length !== 0) return res.json(saved)
    console.log("getting preds")


    const { userId, channelAccessToken, clientId } = db.data.twitch
    const { predId, teamIds } = db.data.predictions

    await fetch(`https://api.twitch.tv/helix/predictions?broadcaster_id=${userId}&id=${predId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + channelAccessToken,
            "Client-Id": clientId,
        }
    }).then((res) => res.json())
    .then((json) => {
        console.log(json)
        db.data.predictions.savedPrediction = json.data[0]
        res.json(json.data[0])
    })

    await db.write()
}

let checkSubmit = async (req, res) => {
    await db.read()
    const { submitting } = db.data.predictions

    res.json({
        submitting: submitting
    })
}

export default { forward }

