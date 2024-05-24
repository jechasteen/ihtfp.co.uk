const read = require("fs").readFileSync;
const write = require("fs").writeFileSync;
const join = require("path").join;
const $ = require("../../lib/runner");
const encode = require("../../lib/encoder");

$(() => {
    const data = read(join(__dirname, "store_supplies.csv"), { encoding: "utf-8" });
    let output = "";
    const rows = data.split("\n");
    for (let i = 0; i < rows.length; i++) {
        let cur = rows[i].split(",");
        const upc = encode(cur[0]);
        output += `${upc}\t${cur[1]}\t${cur[2]}\n`;
    }
    console.log(output);
    write(join(__dirname, "psdata.csv"), output, {encoding: "utf8"});
});