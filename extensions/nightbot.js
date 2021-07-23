import fetch from "node-fetch"
import express from "express"
import path from "path"
import { renderFile } from "ejs"
import { fileURLToPath } from 'url'
import fs from "fs"
import https from "https"


function retrieveNightbotToken() {
    return new Promise((resolve, reject) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename); 
        const app = express()
        app.engine('.html', renderFile);
        app.set('views', path.join(__dirname, './views'));
        app.set('view engine', 'html');

        const key = fs.readFileSync('./certs/key.pem'); // key/certs NEEDED for nightbot (only accepts HTTPS)
        const cert = fs.readFileSync('./certs/cert.pem');
        const server = https.createServer({key: key, cert: cert }, app);
    
        server.listen(3500, () => {
            console.log("listening for nightbot on 3500")
        })

        app.get('/', (req, res) => {
            res.render("hashReadout")
        })

        app.get('/hash', (req, res) => {
            console.log("got hash")
            if (req.query.access_token) {
                res.json({})
                console.log("resolving now...")
                resolve(req.query)
            } else {
                res.json({})
                console.log("error now...")
                reject()
            }
        })
    })
}

function setCommand(command, content, userId) {
    console.log("got set command req for", command)
    return new Promise((resolve, reject) => {
        let sendBody = {
            message: content
        }
    
        fetch("https://api.nightbot.tv/1/commands/" + command, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + userId,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendBody)
        })
        .then((res) => {
            console.log(res)
            resolve()
        })
        .catch((err) => {
            console.log(err)
            reject()
        })
    })
}

export default { retrieveNightbotToken, setCommand }