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
var teams = ["teama", "teamb"]

var mapOrder = [
    {map: "ascent", isBan: true, teamPick: "", sidePick: false},
    {map: "bind", isBan: true, teamPick: "", sidePick: false},
    {map: "breeze", isBan: false, teamPick: "teama", sidePick: "attack"},
    {map: "haven", isBan: false, teamPick: "teamb", sidePick: "defense"},
    {map: "icebox", isBan: true, teamPick: "", sidePick: false},
    {map: "split", isBan: false, teamPick: "teama", sidePick: "defense"},
]

app.get('/obs', (req, res) => {
  res.render('obs', {
    maps: mapOrder.filter(x => (x.isBan == false)),
    teams: teams
  })
})

app.get('/', (req, res) => {
    res.render('settings', {
        options: maps,
        maps: mapOrder,
        teams: teams
    })
})

app.get('/submitmaps', (req, res) => {
    for (const [key, value] of Object.entries(req.query)) {
        let info = key.split('.')
        let mapNum = info[0]
        let other = info[1]
        switch(other) {
            case "ban":
                if (value == "ban") {
                    mapOrder[mapNum].isBan = true
                } else {
                    mapOrder[mapNum].isBan = false
                }
                break;
            case "teamPick":
                mapOrder[mapNum].teamPick = value
                break;
            case "sidePick":
                mapOrder[mapNum].sidePick = value
                break;
            default:
                mapOrder[mapNum].map = value
                break;
        }
    }

    console.log(mapOrder)

    res.redirect('/');
})

app.get('/submitteams', (req, res) => {
    teams[0] = req.query.teama
    teams[1] = req.query.teamb
    res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})