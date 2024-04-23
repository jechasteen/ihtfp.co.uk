const fs = require("fs");
const path = require("path");

const Template = require("../../lib/template");
const $ = require("../../lib/runnner");

const VERSION = process.env.DISPLAYPLAN_VERSION || "3";
const read_opt = { encoding: "utf-8" };

$(() => {
    // update build number
    const pobj = JSON.parse(
        fs.readFileSync(path.join(__dirname, "package.json"), read_opt)
    );
    pobj.build_number++;
    pjson = JSON.stringify(pobj);
    fs.writeFileSync(path.join(__dirname, "package.json"), pjson);

    const t = Template(path.join(__dirname, "template.html"), {
        VERSION: VERSION,
        BUILD: pobj.build_number,
        STYLE: fs.readFileSync(path.join(__dirname, "style.css"), read_opt),
        SCRIPT: fs.readFileSync(path.join(__dirname, "main.js"), read_opt),
    });

    t.write(path.join(__dirname, "DisplayPlan.html"));
});
