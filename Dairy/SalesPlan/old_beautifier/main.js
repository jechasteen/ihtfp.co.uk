const fs = require("fs");
const path = require("path");
const print = console.log;

function DocFromTemplate(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+EAN13+Text&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${body}
</body>
</html>
`
}

function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}

const line_data = [];
const all_items = [];
const upc_regex = /\d{13}/g;

(() => {
    const raw_data = fs.readFileSync(path.join(__dirname, "demo.csv"), {
        encoding: "utf-8",
    });
    const data = raw_data.split("\r\n");

    // Gather all UPCs and Section Headings
    for (let i = 0; i < data.length; i++) {
        const line = data[i];
        let upc = line.match(upc_regex);
        if (!upc) {
            if (line.includes("Dairy Displays - BUNKER")) {
                let cols = line.split(",");
                line_data.push(`${sanitizeString(cols[1])}. ${sanitizeString(cols[5])}`);
            }
            continue
        }
        if (!line_data.includes(upc)) {
            line_data.push(upc[0]);
        }
    }
    // print(all_UPCs);

    // Gather all of the UPC's data together into objects
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < line_data.length; j++) {
            if (line_data[j].length === 13 && data[i].match(line_data[j])) {
                const col = data[i].split(",");
                const esi_date = new Date(Date.parse(col[14]));

                if (!all_items[j]) {
                    all_items[j] = {
                        upc: line_data[j],
                        description: col[5],
                        size: col[6],
                        esi: ((col) => {
                            if (col[14] !== "") {
                                return [{
                                    date: esi_date,
                                    qty: col[12],
                                    pack: col[13],
                                }]
                            }
                            return []
                        })(col),
                    };
                } else {
                    const entry = {
                        date: esi_date,
                        qty: col[12],
                        pack: col[13],
                    }
                    if (Array.isArray(all_items[j].esi)) {
                        all_items[j].esi.push(entry)
                    } else {
                        all_items[j].esi = [entry];
                    }
                }
            }
            else {
                print('hit')

                all_items[j] = `${line_data[j]}`;
            }
        }
    }
    // print(all_items);

    function make_node(type, cls, content) {
        return `<${type} class="${cls}">${content}</${type}>`
    }

    function DIV(cls, content) {
        return make_node('div', cls, content)
    }

    function SPAN(cls, content) {
        return make_node('span', cls, content);
    }

    let html = (
        () => {
            let output = []

            for (let i in all_items) {
                const item = all_items[i];
                if (typeof item === "string") {
                    output.push(
                        DIV("header", `${item}`)
                    )
                } else {
                    output.push(
                        DIV("item",
                            DIV("col upc", item.upc.slice(2) + "?")
                            + DIV("col desc", `${item.description} - ${item.size}`)
                            + DIV("col",
                                (() => {
                                    if (item.esi.length) {
                                        let divs = [];
                                        for (let j in item.esi) {
                                            divs.push(
                                                DIV("col-group",
                                                    DIV("col-group-row",
                                                        SPAN("col-group-row-item", `${item.esi[j].date.toDateString().slice(0, -4)}`)
                                                        +
                                                        SPAN("col-group-row-item", `${item.esi[j].qty}cs`)
                                                    )
                                                )
                                            )
                                        }
                                        return divs.join("")
                                    } else {
                                        return ""
                                    }
                                })())
                        )
                    )
                }
            }
            return output.join("");
        }
    )()

    // console.log(html)

    // Barf out some data
    // for (let i in all_items) {
    //     const item = all_items[i]
    //     html += '<div class="item">'
    //     html += `<div class="col upc">${item.upc.slice(2)}?</div>`
    //     html += `<div class="col desc">${item.description} - ${item.size}</div>`
    //     html += '<div class="col">'
    //     if (item.esi.length) {
    //         for (let j in item.esi) {
    //             html += `<div class="col-group">`
    //             html += `<div class="col-group-row">`
    //             html += `<span class="col-group-row-item">${item.esi[j].date.toDateString().slice(0, -4)}</span>`
    //             html += `<span class="col-group-row-item">${item.esi[j].qty}cs</span>`
    //             html += `</div></div>`
    //         }
    //     }
    //     html += '</div></div>'
    // }

    const title = data[0].split(',')[0]
    fs.writeFileSync(path.join(__dirname, "alpha.html"), DocFromTemplate(title, html), { encoding: 'utf-8'});
})();
