import db from "../db.mjs"
import nightbot from "../extensions/nightbot.js"

function forward(app) {
    app.get('/mapbans/manualinput', (req, res) => manualinput(req,res))
    app.get('/mapbans/', (req, res) => settingsPage(req,res))
    app.get('/mapbans/submitmaps', (req, res) => submitmaps(req,res))
    app.get('/mapbans/submitmapsbeta', (req, res) => submitmapsbeta(req,res))
    app.get('/mapbans/obs', (req, res) => obs(req,res))
}


let manualinput = async (req, res) => {
    await db.read()
    let gameInfo = db.data.gameInfo
    let info = db.data.info
    let mapbans = db.data.mapbans

    let { mapOrder, showBans, showAutobans } = mapbans 
    let { teams, teamShorts } = info 
    let { maps, sides } = gameInfo

   res.render('settings/manualinput', {
        maps: maps,
        mapOrder: mapOrder,
        teams: teams,
        teamShorts: teamShorts,
        otherSettings: {
            showBans: showBans,
            showAutobans: showAutobans,
        }
    })
}

let settingsPage = async (req, res) => {
    await db.read()
    let gameInfo = db.data.gameInfo
    let info = db.data.info
    let mapbans = db.data.mapbans

    let { mapOrder, showBans, showAutobans } = mapbans 
    let { teams, teamShorts } = info 
    let { maps, sides } = gameInfo
    
    res.render('settings/mapbans', {
        options: maps,
        maps: mapOrder,
        teams: teams,
        teamShorts: teamShorts,
    })
}

let submitmaps = async (req, res) => {
    await db.read()
    let gameInfo = db.data.gameInfo
    let info = db.data.info
    let mapbans = db.data.mapbans

    let { mapOrder, showBans, showAutobans } = mapbans 
    let { teams, teamShorts } = info 
    let { maps, sides } = gameInfo

    var newMapOrder = []
    for (const [key, value] of Object.entries(req.query)) {
        let info = key.split('.')
        if (info[1] == undefined) {
            value != undefined ? otherSettings[key] = (value == "on" ? true : false) : null
        } else {
            let num = info[0]
            let name = info[1]
            newMapOrder[num] ? null : newMapOrder[num] = {}
            value != undefined ? newMapOrder[num][name] = value : null
        }
    }

    mapOrder = newMapOrder.map((x, i) => x = {
        "map": maps.findIndex(z => z == x.map),
        "isBan": x.ban == "ban" ? true : false,
        "teamPick": teams.findIndex(z => z == x.teamPick),
        "sidePick": sides.findIndex(z => z == x.sidePick),
        "isShowing": x.isShowing == "on" ? true : false,
    })
    db.data.mapbans.mapOrder = mapOrder

    sendToNightbot(mapOrder, teamShorts, maps)
    db.write()

    res.redirect('/');
}

let submitmapsbeta = async (req, res) => {
    await db.read()
    let gameInfo = db.data.gameInfo
    let info = db.data.info
    let mapbans = db.data.mapbans
    let generalSettings = db.data.generalSettings

    let { mapOrder, showBans, showAutobans } = mapbans 
    let { teams, teamShorts } = info 
    let { maps, sides } = gameInfo
    let { isLowerCase, useVOTColours, customColour } = generalSettings

    var invalid = false
    let vetos = req.query.vetotext
    let mapPicks = vetos.split(/\r?\n/).map(x => x.toLowerCase()) // splits into lines
    let potentialTeamSearch = teams.map(x => x.split(' ')[0].toLowerCase()) // first word if multiple words, easier to search
    let potentialTeamSearchShort = teamShorts.map(x => x.toLowerCase())
    mapOrder = []
    for (const [id, mapline] of mapPicks.entries()) {
        let words = mapline.split(' ')
        let banWords = ["banned", "bans", "ban"]
        let pickWords = ["picks", "picked", "pick"]
        let atkWords = ["atk", "attack", "attackers", "attacking"]
        let defWords = ["def", "defense", "defence", "defending", "defenders"]

        var teampick;
        let teamword = words.find((x) =>
            potentialTeamSearch.includes(x) || potentialTeamSearchShort.includes(x)
        )

        if (potentialTeamSearch.indexOf(teamword) !== -1) teampick = potentialTeamSearch.indexOf(teamword)
        if (potentialTeamSearchShort.indexOf(teamword) !== -1) teampick = potentialTeamSearchShort.indexOf(teamword)

        let chosenMap = maps.indexOf(words.find(x => maps.includes(x)))
        let isBan = words.find(x => banWords.includes(x)) ? true : false
        if (!isBan && !words.find(x => pickWords.includes(x))) {
            console.error(`Mapline ${id} is neither a pick nor a ban`)
            invalid = true
        }

        var sidePick;
        if (!isBan && teampick !== 2) {
            sidePick = words.find(x => atkWords.includes(x)) ? 0 : 1
            if (sidePick === 1 && words.find(x => defWords.includes(x)) == undefined) {
                console.error(`Mapline ${id} doesn't have a side selected`)
                invalid = true
            }
        } else {
            sidePick = -1
        }



        if (!invalid) {
            console.log(
                `teampick: ${teampick} ${teams[teampick]}\n
                chosenMap: ${chosenMap} ${maps[chosenMap]}\n
                isBan: ${isBan}\n
                sidePick: ${sidePick} ${sides[sidePick]}`
            )

            mapOrder.push({
                map: chosenMap,
                isBan: isBan,
                teamPick: teampick,
                sidePick: sidePick
            })

            if (id + 1 == mapPicks.length) {
                if (mapOrder.find(x => x.teamPick == 2)) {
                    // Autoban already added
                    db.data.mapbans.mapOrder = mapOrder
                    sendToNightbot(mapOrder, teamShorts, maps)
                    db.write()
                    res.redirect('/mapbans')
                } else {
                    console.log('adding autoban')
                    let mapsAdded = mapOrder.map(x => x.map)
                    let difference = maps.filter(x => !mapsAdded.includes(maps.indexOf(x)));
                    mapOrder.push({
                        map: maps.indexOf(difference[0]),
                        isBan: true,
                        teamPick: 2,
                        sidePick: -1,
                    })

                    db.data.mapbans.mapOrder = mapOrder

                    sendToNightbot(mapOrder, teamShorts, maps)
                    db.write()
                    res.redirect('/mapbans')
                }
            }
        } else {
            res.redirect('/error')
        }
    }


}

function sendToNightbot(mapOrder, teamShorts, maps) {
    const nbData = db.data.nightbot
    let pickedMaps = mapOrder.filter(x => !x.isBan)
    var nbMsg = ""
    let atkSrts = ["ATK", "DEF"]
    for (let [i, pmap] of Object.entries(pickedMaps)) {
        let oppTeam = teamShorts[pmap.teamPick ? 0 : 1]
        // E.g. "TMA pick HAVEN (TMB ATK),"
        nbMsg += `${teamShorts[pmap.teamPick]} pick ${maps[pmap.map].toUpperCase()} (${oppTeam} ${atkSrts[pmap.sidePick]})` 
        if (i != pickedMaps.length -1) {
            nbMsg += ", "
        }
    }

    nightbot.setCommand(nbData.commands.maps, nbMsg, nbData.user.accessToken)
}

let obs = async (req, res) => {
    await db.read()
    let gameInfo = db.data.gameInfo
    let info = db.data.info
    let mapbans = db.data.mapbans
    let generalSettings = db.data.generalSettings

    let { mapOrder, showBans, showAutobans } = mapbans 
    let { teams, teamShorts } = info 
    let { maps, sides } = gameInfo
    let { isLowerCase, useVOTColours, customColour } = generalSettings

    console.log(teams)
    console.log("loading obs... ", generalSettings)

    res.render('obs/obs', {
        mapOrder: mapOrder.filter(x => (x.teamPick !== 2 && x.isBan == false)),
        bannedMaps: mapOrder.filter(x => (x.isBan == true && x.teamPick !== 2)),
        autoBannedMaps: mapOrder.filter(x => (x.teamPick === 2)),
        teams: teams,
        teamShorts: teamShorts,
        maps: maps,
        sides: sides,
        otherSettings: {
            isLowerCase: isLowerCase,
            useVOTColours: useVOTColours,
            customColour: customColour,
        },
    })
}

export default { forward }