import db from "../db.mjs"

function forward(app) {
    db.read().then(() => {
        app.get('/', (req, res) => mainpage(req,res))
        app.get('/submitteams', (req,res) => submitteams(req,res))
        app.get('/generalsettings', (req,res) => realsettings(req,res))
        app.get('/submitsettings', (req, res) => submitsettings(req,res))
    })
    
}

let realsettings = async (req, res) => {
    await db.read()
    const gameInfo = db.data.gameInfo
    const info = db.data.info
    const mapbans = db.data.mapbans
    const generalSettings = db.data.generalSettings
    const twitch = db.data.twitch

    const { mapOrder, showBans, showAutobans } = mapbans 
    const { teams, teamShorts } = info 
    const { maps, sides } = gameInfo
    const { isLowerCase, useVOTColours, customColour } = generalSettings
    const { clientId } = twitch

    res.render('settings/realsettings', {
        options: maps,
        maps: mapOrder,
        teams: teams,
        teamShorts: teamShorts,
        clientId: clientId,
        otherSettings: {
            isLowerCase: isLowerCase,
            useVOTColours: useVOTColours,
            customColour: customColour,
        },
    })
}

let submitsettings = async (req, res) => {
    await db.read()
    const generalSettings = db.data.generalSettings

    let q = req.query
    var { isLowerCase, useVOTColours, customColour } = generalSettings

    q.useVOTColours == "on" ? useVOTColours = true : useVOTColours = false
    q.isLowerCase == "on" ? isLowerCase = true : isLowerCase = false
    q.customColour != "" ? customColour = q.customColour : null

    db.data.generalSettings = {
        useVOTColours,
        isLowerCase,
        customColour
    }

    console.log(generalSettings)

    await db.write()
    res.redirect('/generalsettings')
}

let mainpage = async (req, res) => {
    await db.read()
    const gameInfo = db.data.gameInfo
    const info = db.data.info
    const mapbans = db.data.mapbans
    const generalSettings = db.data.generalSettings

    const { mapOrder, showBans, showAutobans } = mapbans 
    const { teams, teamShorts } = info 
    const { maps, sides } = gameInfo
    const { isLowerCase, useVOTColours, customColour } = generalSettings
    const { currentPredicting, submitting, predictionsShowing } = db.data.predictions

    res.render('index', {
        options: maps,
        maps: mapOrder,
        teams: teams,
        predictableMaps: mapOrder.filter(x => !x.isBan),
        predOn: currentPredicting,
        predSubmitting: submitting,
        predictionsShowing: predictionsShowing,
        teamShorts: teamShorts,
        otherSettings: {
            isLowerCase: isLowerCase,
            useVOTColours: useVOTColours,
            customColour: customColour,
        },
    })
}

let submitteams = async (req, res) => {
    await db.read()
    let info = db.data.info
    var { teams, teamShorts } = info 
    console.log(db.data)
    let q = req.query

    q.teama != "" ? teams[0] = q.teama : null
    q.teamb != "" ? teams[1] = q.teamb : null
    q.teamaShort != "" ? teamShorts[0] = q.teamaShort : null
    q.teambShort != "" ? teamShorts[1] = q.teambShort : null

    db.data.info = { teams, teamShorts }

    await db.write()
    console.log("written")
    res.redirect('/')
}

export default { forward }
// change other than gen settings to not be here