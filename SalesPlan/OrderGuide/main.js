const DIV = (cls, inner) => `<div class="${cls}">${inner}</div>`
const upc = (upc) => DIV("upc", upc)
const desc = (name, size) => DIV("desc", `${name} - ${size}`)
const esi_item = (date, n) => DIV("esi-item", `${date.toDateString().slice(0, -4)} ${n}cs`)
const esi_group = (items) => DIV("esi-group", `${items.forEach((v) => `${v}`)}`)
const row = (u, name, esi) => DIV("row", `${u}${name}${esi}`)

const data = {}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

window.onload = function() {
    console.log(".")
    document.getElementById("input").oninput = (e) => {
        if (!e.target.value) return;
        csv_to_obj(e.target.value);
        obj_to_dom();
    }
}

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
    h1_plan_heading.innerText =
        `Order Guide P${pw[2]}W${pw[4]} ${pw[0]}`;
    
    for (let prio in data.priorities) {
        if (!data.priorities.hasOwnProperty(prio)) continue;

        const cur_prio = data.priorities[prio];
        
        const h2_description = main.appendChild(createElement("h2", "priority-heading"));
        h2_description.innerText = toTitleCase(cur_prio.description);

        const prio_div = main.appendChild(document.createElement("div"));
        prio_div.classList.add("priority-data");

        prio_div.appendChild(document.createElement("span"))
            .innerText = `${cur_prio.retail}`;
        prio_div.appendChild(document.createElement("span"))
            .innerText = cur_prio.size;
        prio_div.appendChild(document.createElement("span"))
            .innerText = `${cur_prio.start} through ${cur_prio.thru}`;

        for (let upc in cur_prio.items) {
            const cur_item = cur_prio.items[upc];

            const div_item = createElement("div", "priority-item");

            const span_upc = createElement("span", "item-upc");
            span_upc.innerText = `${upc.slice(2)}?`;
            div_item.appendChild(span_upc);

            const span_name = createElement("span", "item-name");
            span_name.innerText = `${cur_item.name} - ${cur_item.size}`;
            div_item.appendChild(span_name);

            if (cur_item.esi) {
                if (cur_item.esi.length === 0) continue;
                const span_esi = createElement("span", "item-esi-container");
                for (let i in cur_item.esi) {
                    const div_esi_item = document.createElement("div");
                    const date = new Date(Date.parse(cur_item.esi[i].date))
                    div_esi_item.innerHTML =
                        `${date.toDateString().slice(0, -4)} ${cur_item.esi[i].qty}cs`;
                    span_esi.appendChild(div_esi_item);
                }
                div_item.appendChild(span_esi);
            }
            main.appendChild(div_item);
        }
    }
}

function csv_to_obj(csv) {
    let lines = csv.split("\n").map(a => a.split(","));
    data.period_week = lines[1][0];
    data.priorities = {};

    let cur_prio = 0;

    for (let i = 5; i < lines.length; i++) {
        const ln = lines[i];
        const esi = {
            date: ln[14],
            qty: ln[12],
            size: ln[13]
        };

        if (ln[2] === "main" || ln[2] === "Tie-In") {
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
                items: {}
            }
        } 
        else {
            if (!ln[3]) continue;
            if (!data.priorities[cur_prio].items[ln[3]]) {
                data.priorities[cur_prio].items[ln[3]] = {
                    name: ln[5],
                    upc: ln[3],
                    size: ln[6]
                }
            }
            if (ln[13] !== "") {
                if (data.priorities[cur_prio].items[ln[3]].esi) {
                    data.priorities[cur_prio].items[ln[3]].esi.push(esi);
                }
                else {
                    data.priorities[cur_prio].items[ln[3]].esi = [esi];
                }
            }
        }
    }
    
    // console.log(data);
}