const read = require("fs").readFileSync;
const join = require("path").join;

const Template = require("../../lib/template");
const $ = require("../../lib/runner");
const read_opt = { encoding: "utf-8" };

$(() => {
    const t = Template(join(__dirname, "template.html"), {
        STYLE: read(join(__dirname, "style.css"), read_opt),
        SCRIPT: read(join(__dirname, "main.js"), read_opt),
        DELI: read(join(__dirname, "deli.txt"), read_opt),
        STORESUPPLIES: read(join(__dirname, "store_supplies.txt"), read_opt),
    });

    t.write(join(__dirname, "BarcodeListulator.html"));
});