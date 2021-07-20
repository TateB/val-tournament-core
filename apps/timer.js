import db from "../db.mjs"

function forward(app) {
    db.read().then(() => {
        app.get('/timer', (req, res) => timer(req,res))
        app.get('/submittimer', (req, res) => submittimer(req,res))
        app.get('/timer/obs', (req, res) => obs(req, res))
        app.get('/timer/live', (req, res) => liveUpdate(req, res))
    })
    
}

let timer = async (req, res) => {
    await db.read()
    const secondsSet = db.data.timer.seconds
    
    const minutes = Math.floor(secondsSet / 60)
    const seconds = secondsSet - (minutes * 60)

    res.render('settings/timer', {
        seconds: seconds,
        minutes: minutes
    })
}

let submittimer = async (req, res) => {
    await db.read()
    var seconds = db.data.timer.seconds
    var reset = db.data.timer.reset
    let q = req.query

    let secondsSet = (q.seconds ? parseInt(q.seconds) : 0) + (q.minutes ? parseInt(q.minutes * 60) : 0)
    console.log(q.seconds, q.minutes)

    secondsSet > 0 ? seconds = secondsSet : null
    q.reset ? reset = true : reset = false

    db.data.timer.seconds = seconds
    db.data.timer.reset = reset

    await db.write()
    res.redirect('/timer')
}

let obs = async (req, res) => {
    await db.read()
    const seconds = db.data.timer.seconds

    var stMinutes = Math.floor(seconds / 60)
    var stSeconds = seconds - (stMinutes * 60)
    stMinutes < 10 ? stMinutes = "0" + stMinutes : null
    stSeconds < 10 ? stSeconds = "0" + stSeconds : null

    res.render('obs/timer', {
        stMinutes: stMinutes,
        stSeconds: stSeconds,
        seconds: seconds
    })
}

let liveUpdate = async (req, res) => {
    await db.read()
    const seconds = db.data.timer.seconds
    const reset = db.data.timer.reset

    if (reset) {
        db.data.timer.reset = false
        await db.write()

        res.json({
            seconds: seconds,
            reset: true,
        })
    } else {
        res.json({
            seconds: seconds,
            reset: reset,
        })
    }
}

export default { forward }