import express from "express"
import path from "path"
import { renderFile } from "ejs"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3500

app.engine(".html", renderFile)
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "html")

import mb from "./apps/mapbans.js"
import settings from "./apps/settings.js"
import scoreoverlay from "./apps/scoreoverlay.js"
import timer from "./apps/timer.js"
import predictions from "./apps/predictions.js"

mb.forward(app)
settings.forward(app)
scoreoverlay.forward(app)
timer.forward(app)
predictions.forward(app)

app.get("/error", (req, res) => {
  res.render("error", {})
})

app.listen(port, () => {
  console.log(`Overlay app listening at http://localhost:${port}`)
})

export default { app }
