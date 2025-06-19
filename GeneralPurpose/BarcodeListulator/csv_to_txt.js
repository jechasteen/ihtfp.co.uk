const fs = require("fs");
const join = require("path").join;
const $ = require("../../lib/runner");
const { write } = require("fs");

$(() => {
    const input = fs.readFileSync(join(__dirname, "DeliSupplies.csv"), { encoding: "utf-8"});
    let rows = input.split("\n");
    let output = "UPC\tDESC\n";
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i].split(',');
        console.log(row);
        if (row[0].length < 11) {
            let n = 11 - row[0].length;
            output += `${"0".repeat(n)}${row[0]}?\t${row[1]}`;
        }
        else if (row[0].length === 11) {
            output += `${row[0]}?\t${row[1]}`;
        }
        else if (row[0].length === 12) {
            output += row.join('\t');
        }
        else if (row[0].length > 12) {
            output += `${row[0].substring(row[0].length - 12)}\t${row[1]}`
        }
        output += '\n';
    }
    fs.writeFileSync(join(__dirname, "DeliSuppliesDataForInDesign.txt"), output, { encoding: "utf-8" });
})