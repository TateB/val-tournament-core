import { join } from 'path'
import { Low, JSONFile } from 'lowdb'

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

db.data ||= {
    "gameInfo": {
        "maps": ["ascent", "bind", "breeze", "haven", "icebox", "split"],
        "sides": ["attack", "defense"],
    },
    "info": {
        "teams": ["Team A", "Team B", "auto"],
        "teamShorts": ["TMA", "TMB", "AUTO"],
    }, 
    "mapbans": {
        "mapOrder": [
            { map: 4, isBan: true, teamPick: 0, sidePick: 1, isShowing: true, },
            { map: 3, isBan: true, teamPick: 1, sidePick: 1, isShowing: true, },
            { map: 5, isBan: false, teamPick: 0, sidePick: 0, isShowing: true, },
            { map: 2, isBan: false, teamPick: 1, sidePick: 1, isShowing: true, },
            { map: 0, isBan: false, teamPick: 0, sidePick: 1, isShowing: true, },
            { map: 1, isBan: true, teamPick: 2, sidePick: 0, isShowing: true, }
         ],
        "showBans": true,
        "showAutobans": true,
    },
    "scoreOverlay": {
        "scores": [0, 0],
        "reversed": false,
        "mapsToWin": 2,
    },
    "timer": {
        "seconds": 600,
        "reset": false,
    },
    "generalSettings": {
        "useVOTColours": true,
        "customColour": "",
        "isLowerCase": false,
    },
    "twitch" : {
        "clientId" : "",
        "clientSecret": "",
        "channelAccessToken": "",
        "userId": "",
    },
    "predictions": {
        "currentPredicting": false,
        "predId": "",
        "teamIds": [],
        "predictionsShowing": false,
    }
 }

 await db.write()

 export default db