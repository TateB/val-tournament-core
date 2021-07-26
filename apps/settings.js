import fetch from "node-fetch"
import db from "../db.mjs"
import nightbot from "../extensions/nightbot.js"
import urlExist from "url-exist"

function forward(app) {
    db.read().then(() => {
        app.get('/', (req, res) => mainpage(req,res))
        app.get('/submitteams', (req,res) => submitteams(req,res))
        app.get('/generalsettings', (req,res) => realsettings(req,res))
        app.get('/submitsettings', (req, res) => submitsettings(req,res))
        app.get('/nightbot/login', (req, res) => nightbotLogin(req, res))
    })
    
}

function logoURL(name) {
    return new Promise((resolve, reject) => {
        urlExist(`https://raw.githubusercontent.com/lootmarket/esport-team-logos/master/valorant/${name}/${name}-logo.png?raw=true`)
        .then((result) => {
            console.log(name, result)
            if (result) {
                resolve(`https://raw.githubusercontent.com/lootmarket/esport-team-logos/master/valorant/${name}/${name}-logo.png?raw=true`)
            } else {
                resolve("/icons/default.png")
            }
        })
    })
}

let realsettings = async (req, res) => {
    await db.read()
    const gameInfo = db.data.gameInfo
    const info = db.data.info
    const mapbans = db.data.mapbans
    const generalSettings = db.data.generalSettings
    const twitch = db.data.twitch
    const nightbot = db.data.nightbot

    const { mapOrder, showBans, showAutobans } = mapbans 
    const { teams, teamShorts } = info 
    const { maps, sides } = gameInfo
    const { isLowerCase, useVOTColours, customColour } = generalSettings
    const { clientId } = twitch

    var nbExpiry;
    nightbot.user.expiry ? nbExpiry = nightbot.user.expiry : nbExpiry = false

    res.render('settings/realsettings', {
        options: maps,
        maps: mapOrder,
        teams: teams,
        teamShorts: teamShorts,
        clientId: clientId,
        nightbotExpiry: nbExpiry,
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
    let q = req.query

    q.teama != "" ? teams[0] = q.teama : null
    q.teamb != "" ? teams[1] = q.teamb : null
    q.teamaShort != "" ? teamShorts[0] = q.teamaShort : null
    q.teambShort != "" ? teamShorts[1] = q.teambShort : null

    let formattedTeamA = teams[0].replace(/\s+/g, '-').toLowerCase()
    let formattedTeamB = teams[1].replace(/\s+/g, '-').toLowerCase()
    let iconLinks = [
        await logoURL(formattedTeamA),
        await logoURL(formattedTeamB)
    ]

    

    db.data.info = { teams, teamShorts, iconLinks }

    await db.write()
    console.log("written")
    res.redirect('/')
}

let nightbotLogin = async (req, res) => {
    await db.read()
    const nightbotData = db.data.nightbot
    let finalURL = `https://api.nightbot.tv/oauth2/authorize?response_type=token&client_id=${nightbotData.clientId}&redirect_uri=https://localhost:3500&scope=commands%20commands_default`

    res.redirect(finalURL)

    let nbRes = await nightbot.retrieveNightbotToken()
    
    console.log("full response received: ", nbRes)
    if (nbRes.access_token != undefined) {
        console.log("looking good")
        db.data.nightbot.user = {
            accessToken: nbRes.access_token,
            expiry: Date.now() + (parseInt(nbRes.expires_in) * 1000)
        }
    } else {
        console.log("there was an error retrieving token")
        return
    }

    await db.write()
}

export default { forward }
// change other than gen settings to not be here