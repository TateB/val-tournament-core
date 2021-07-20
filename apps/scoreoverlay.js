import db from "../db.mjs"

function forward(app) {
    db.read().then(() => {
        app.get('/scoreoverlay', (req, res) => scoreoverlay(req,res))
        app.get('/submitscores', (req, res) => submitscores(req,res))
        app.get('/scoreoverlay/obs', (req, res) => obs(req, res))
        app.get('/scoreoverlay/obs_vs', (req, res) => obsVS(req, res))
        app.get('/scoreoverlay/obs_rs', (req, res) => obsRS(req, res))
        app.get('/charselect/obs', (req, res) => obsCharSelect(req, res))
        app.get('/scoreoverlay/live', (req, res) => liveUpdate(req, res))
    })
    
}

let scoreoverlay = async (req, res) => {
    await db.read()
    const teams = db.data.info.teams
    const teamShorts = db.data.info.teamShorts
    const scoreOverlay = db.data.scoreOverlay

    res.render('settings/scoreoverlay', {
        teams: teams,
        teamShorts: teamShorts,
        scoreOverlay: scoreOverlay
    })
}

let submitscores = async (req, res) => {
    await db.read()
    var scoreOverlay = db.data.scoreOverlay
    let q = req.query

    q.teama ? scoreOverlay.scores[0] = parseInt(q.teama) : null
    q.teamb ? scoreOverlay.scores[1] = parseInt(q.teamb) : null
    q.mapsToWin ? scoreOverlay.mapsToWin = parseInt(q.mapsToWin) : null
    q.reverse ? scoreOverlay.reversed = true : scoreOverlay.reversed = false

    db.data.scoreOverlay = scoreOverlay

    console.log(q)
    console.log(scoreOverlay)
    await db.write()
    res.redirect('/scoreoverlay')
}

let obs = async (req, res) => {
    await db.read()
    const teamShorts = db.data.info.teamShorts
    const scoreOverlay = db.data.scoreOverlay
    const useVOTColours = db.data.generalSettings.useVOTColours

    res.render('obs/scoreoverlay', {
        teamShorts: teamShorts,
        scoreOverlay: scoreOverlay,
        useVOTColours: useVOTColours
    })
}
let obsVS = async (req, res) => {
    await db.read()
    const teams = db.data.info.teams

    res.render('obs/scoreoverlay_VS', {
        teams: teams,
    })
}

let obsRS = async (req, res) => {
    await db.read()
    const teams = db.data.info.teams
    const scoreOverlay = db.data.scoreOverlay

    res.render('obs/scoreoverlay_rs', {
        teams: teams,
        scoreOverlay: scoreOverlay,
    })
}

let obsCharSelect = async (req, res) => {
    await db.read()
    const teamShorts = db.data.info.teamShorts
    const teams = db.data.info.teams
    const scoreOverlay = db.data.scoreOverlay
    const useVOTColours = db.data.generalSettings.useVOTColours

    res.render('obs/charselectteams', {
        teamShorts: teamShorts,
        scoreOverlay: scoreOverlay,
        useVOTColours: useVOTColours,
        teams: teams,
    })
}

let liveUpdate = async (req, res) => {
    await db.read()
    const scoreOverlay = db.data.scoreOverlay
    const teamShorts = db.data.info.teamShorts
    const teams = db.data.info.teams

    res.json({
        scoreOverlay: scoreOverlay,
        teamShorts: teamShorts,
        teams: teams,
    })
}

export default { forward }