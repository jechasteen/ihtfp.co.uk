const fs = require("fs");
const path = require("path");

const Template = require("../../lib/template");
const $ = require("../../lib/runner");
const read_opt = { encoding: "utf-8" };

$(() => {
    const t = Template(path.join(__dirname, "template.html"), {
        STYLE: fs.readFileSync(path.join(__dirname, "style.css"), read_opt),
        SCRIPT: fs.readFileSync(path.join(__dirname, "main.js"), read_opt),
        EGDATA: fs.readFileSync(path.join(__dirname, "eg_data.txt"), read_opt),
    });

    t.write(path.join(__dirname, "BarcodeListulator.html"));
});