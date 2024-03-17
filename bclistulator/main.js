const express = require("express")
const app = express()
const path = require("path")
const read = require("fs").readFileSync

app.use("/q", express.static(path.join(__dirname, "node_modules/quagga/dist")))
app.use("/jq", express.static(path.join(__dirname, "node_modules/jquery/dist")))
app.use("/static", express.static(path.join(__dirname, "static")))

app.get('/', (req, res) => {
    res.send(read(path.join(__dirname, "index.html"), { encoding: 'utf-8' }))
});

app.listen(1337, 'localhost', () => {
    console.log("...");
})