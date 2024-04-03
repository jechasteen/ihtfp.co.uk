// Main data structure. Logged upon parsing the CSV
const data = {};

window.onload = function () {
    console.log("."); // Are we all hooked up?
    document.getElementById("input").oninput = (e) => {
        if (!e.target.value) return;
        csv_to_obj(e.target.value);
        obj_to_dom();
    };
};

function obj_to_dom() {
    function createElement(tagName, className) {
        const el = document.createElement(tagName);
        el.classList.add(className);
        return el;
    }

    const main = document.getElementById("main");
    main.innerHTML = "";

    console.log(data);

    const h1_plan_heading = main.appendChild(createElement("h1", "heading"));
    const pw = data.period_week.split(" ");
    h1_plan_heading.innerText = `Order Guide P${pw[2]}W${pw[4]} ${pw[0]}`;

    const h2_date = main.appendChild(createElement("h2", "date"));
    h2_date.innerText = data.dates;

    let prio_number = 0;

    for (let i in data.priorities) {
        if (!data.priorities.hasOwnProperty(i)) continue;

        const cur_prio = data.priorities[i];

        let prio_text;
        if (cur_prio.type.toUpperCase() === "MAIN") {
            prio_text = `${++prio_number}. `;
        } else if (cur_prio.type === "Tie-In") {
            prio_text = `${prio_number}T. `;
        } else {
            prio_text = "";
        }
    
        // Section Heading
        const h2_description = main.appendChild(
            createElement("h2", "priority-heading")
        );
        h2_description.innerText = toTitleCase(
            `${prio_text} ${cur_prio.description}`
        );

        const prio_div = main.appendChild(document.createElement("div"));
        prio_div.classList.add("priority-data");
        prio_div.appendChild(
            document.createElement("span")
        ).innerText = `${cur_prio.evt_part}`;
        prio_div.appendChild(
            document.createElement("span")
        ).innerText = `${cur_prio.retail}`;
        prio_div.appendChild(document.createElement("span")).innerText =
            cur_prio.size;
        prio_div.appendChild(
            document.createElement("span")
        ).innerText = `${cur_prio.start} through ${cur_prio.thru}`;


        // Member Items
        const prio_container = main.appendChild(
            createElement("div", "priority-container")
        );

        for (let upc in cur_prio.items) {
            const cur_item = cur_prio.items[upc];

            const div_item = createElement("span", "priority-item");

            const span_upc = createElement("span", "item-upc");
            span_upc.innerText = `${upc.slice(2)}?`;
            div_item.appendChild(span_upc);

            const span_name = createElement("span", "item-name");
            span_name.innerText = toTitleCase(cur_item.name);
            div_item.appendChild(span_name);

            if (cur_item.esi) {
                if (cur_item.esi.length === 0) continue;
                const span_esi = createElement("span", "item-esi-container");

                // Begin ESI Data
                for (let i in cur_item.esi) {
                    const div_esi_item = document.createElement("div");
                    const date = new Date(Date.parse(cur_item.esi[i].date));
                    div_esi_item.innerHTML = `${date
                        .toDateString()
                        .slice(0, -4)} ${cur_item.esi[i].qty}cs`;
                    span_esi.appendChild(div_esi_item);
                }
                div_item.appendChild(span_esi);
            }
            prio_container.appendChild(div_item);
        }
        main.appendChild(prio_container);
    }
}

function csv_to_obj(csv) {
    let lines = csv.split("\n").map((a) => a.split(","));
    data.period_week = lines[1][0];
    data.dates = lines[2]
        .slice(0, lines[2].length - 15)
        .join(",")
        .replace(/"/g, "");
    data.priorities = {};

    let cur_prio = 0;
    let n_prio = 0;

    for (let i = 5; i < lines.length; i++) {
        const ln = lines[i];
        const esi = {
            date: ln[14],
            qty: ln[12],
            size: ln[13],
        };

        if (ln[9] && ln[9].length > 0) {
            // Is Main display item
            data.priorities[++cur_prio] = {
                n: cur_prio,
                type: ln[2],
                description: ln[5],
                size: ln[6],
                retail: ln[7],
                evt_part: ln[8],
                thru: ln[9],
                start: ln[10],
                end: ln[11],
                items: {},
            };
        }
        else { // is Tie-In or the next group
            if (!ln[3]) continue;   // UPC missing?
            if (!data.priorities[cur_prio].items[ln[3]]) {
                data.priorities[cur_prio].items[ln[3]] = {
                    name: ln[5],
                    upc: ln[3],
                    size: ln[6],
                };
            }
            if (ln[13] !== "") {
                if (data.priorities[cur_prio].items[ln[3]].esi) {
                    data.priorities[cur_prio].items[ln[3]].esi.push(esi);
                } else {
                    data.priorities[cur_prio].items[ln[3]].esi = [esi];
                }
            }
        }
    }
}

// This could be used as a node module to parse the CSV and work with the resulting object
if (typeof window === "undefined") {
    module.exports = csv_to_obj;
}

// The text in the spreadsheet is inconsistently capitalized. This a borrowed
// routine (stack overflow?) that "fixes" it. It could be improved.
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        if (txt === "WDD") return txt;
        else return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
