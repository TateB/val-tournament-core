const { query } = require('express');
const express = require('express')
var path = require('path');
const app = express()

const port = 3000


app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

var maps = ["ascent", "bind", "breeze", "haven", "icebox", "split"]
var teams = ["Cool Team", "Gamerz", "auto"]
var teamShorts = ["ATM", "BTM"]
var sides = ["attack", "defense"]

var mapOrder = [
    { map: 4, isBan: true, teamPick: 0, sidePick: 1, isShowing: true, },
    { map: 3, isBan: true, teamPick: 1, sidePick: 1, isShowing: true, },
    { map: 5, isBan: false, teamPick: 0, sidePick: 0, isShowing: true, },
    { map: 2, isBan: false, teamPick: 1, sidePick: 1, isShowing: true, },
    { map: 0, isBan: false, teamPick: 0, sidePick: 1, isShowing: true, },
    { map: 1, isBan: true, teamPick: 2, sidePick: 0, isShowing: true, }
 ]

var isLowerCase = false;
var otherSettings = {
    "showBans": true,
    "showAutobans": true,
    "useVOTColours": true,
}

app.get('/obs', (req, res) => {
    console.log(mapOrder)

  res.render('obs', {
    mapOrder: mapOrder.filter(x => (x.teamPick !== 2 && x.isBan == false)),
    bannedMaps: mapOrder.filter(x => (x.isBan == true && x.teamPick !== 2)),
    autoBannedMaps: mapOrder.filter(x => (x.teamPick === 2)),
    teams: teams,
    teamShorts: teamShorts,
    maps: maps,
    sides: sides,
    isLowerCase: isLowerCase,
    otherSettings: otherSettings,
  })
})

app.get('/manualinput', (req, res) => {
    res.render('settings', {
        maps: maps,
        mapOrder: mapOrder,
        teams: teams,
        teamShorts: teamShorts,
        otherSettings: otherSettings,
    })
})

app.get('/', (req, res) => {
    res.render('mainpage', {
        options: maps,
        maps: mapOrder,
        teams: teams,
        teamShorts: teamShorts,
        otherSettings, otherSettings,
    })
})

app.get('/submitmaps', (req, res) => {
    console.log(req.query)
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

    res.redirect('/');
})

app.get('/error', (req, res) => {
    res.render('error', {

    })
})

app.get('/submitmapsbeta', (req, res) => {
    var invalid = false
    let vetos = req.query.vetotext
    let mapPicks = vetos.split(/\r?\n/).map(x => x.toLowerCase()) // splits into lines
    let potentialTeamSearch = teams.map( x => x.split(' ')[0].toLowerCase()) // first word if multiple words, easier to search
    mapOrder = []
    for (const [id, mapline] of mapPicks.entries()) {
        console.log("mapline: " + mapline)
        let words = mapline.split(' ')
        let banWords = ["banned", "bans", "ban"]
        let pickWords = ["picks", "picked", "pick"]
        let atkWords = ["atk", "attack", "attackers", "attacking"]
        let defWords = ["def", "defense", "defence", "defending", "defenders"]

        let teampick = potentialTeamSearch.indexOf(
            words.find((x) => 
                    potentialTeamSearch.includes(x)
                )
            )

        let chosenMap = maps.indexOf(words.find(x => maps.includes(x)))
        let isBan = words.find(x => banWords.includes(x)) ? true : false
        if (!isBan && !words.find(x => pickWords.includes(x))) {
            console.error(`Mapline ${id} is neither a pick nor a ban`)
            invalid = true
        }
        console.log(words.find(x => atkWords.includes(x)) ? true : false)
        let sidePick = words.find(x => atkWords.includes(x)) ? 0 : 1
        if (sidePick === 1 && words.find(x => defWords.includes(x)) == undefined) {
            console.error(`Mapline ${id} doesn't have a side selected`)
            invalid = true
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

            if (id+1 == mapPicks.length) {
                console.log("directing...")
                res.redirect('/')
            }
        } else {
            res.redirect('/error')
        }
    }


})

app.get('/submitteams', (req, res) => {
    req.query.useVOTColours ? otherSettings.useVOTColours = true : otherSettings.useVOTColours = false
    req.query.teama != "" ? teams[0] = req.query.teama : null
    req.query.teamb != "" ? teams[1] = req.query.teamb : null
    req.query.teamaShort != "" ? teamShorts[0] = req.query.teamaShort : null
    req.query.teambShort != "" ? teamShorts[1] = req.query.teambShort : null
    console.log(req.query)
    console.log(teams, otherSettings)
    res.redirect('/')
})

app.listen(port, () => {
  console.log(`Overlay app listening at http://localhost:${port}`)
})