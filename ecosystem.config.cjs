module.exports = {
  apps : [{
    name   : "overlay",
    script : "./index.js",
    watch : true,
    ignore_watch: ["db.json", "db.json.tmp", ".db.json.tmp"]
  }]
}
