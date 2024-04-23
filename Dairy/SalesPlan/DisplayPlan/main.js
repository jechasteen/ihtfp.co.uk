const headings = [
    "", "Prio", "Cat", "New?", "Description",
    "OnOr?", "Tie-In/Clean-up", "Set?"
]
const narrowHeadings = [1, 2, 3, 5, 7]
const secNames = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" ]
const secLines = [  1,   1,   4,   1,   4,   1,   4,   1,   4,   4  ]

window.onload = function() {
    console.log(".")    // All hooked up?
    const table = document.getElementById("table");

    // Draw Table Head
    const head = document.getElementById("heading")
    for (let i in headings) {
        const col = headings[i];
        const el = document.createElement("td");
        el.innerText = col;

        if (narrowHeadings.includes(parseInt(i))) {
            el.style = "max-width: 50px;"
        }

        head.appendChild(el);
    }

    // Draw the Rest
    for (let i in secNames) {
        table.appendChild(paddedLine(secNames[i]));
        for (let j = 1; j < secLines[i]; j++) {
            table.appendChild(paddedLine(""));
        }
    }

    // Listeners for metadata fields
    document.getElementById("period").addEventListener("change", (e) => {
        const week = document.getElementById("week").value;
        document.getElementById("print-period-week").innerText = `P${e.target.value}W${week}`;
    });
    document.getElementById("week").addEventListener("change", (e) => {
        const period = document.getElementById("period").value;
        document.getElementById("print-period-week").innerText = `P${period}W${e.target.value}`;
    });
    document.getElementById("date").addEventListener("change", (e) => {
        document.getElementById("print-date").innerText = (new Date(e.target.value)).toLocaleDateString();
    });

    // Listen for catalog changes
    document.querySelectorAll("select").forEach((el) => {
        el.addEventListener("change", (e) => {
            e.target.parentNode.children[1].innerText = e.target.value;
        });
    });

    // stupid, should be a css rule, but we have to do it this way to grab any <td>
    // with "&nbsp;" as its content so that we can gray out the background...
    document.querySelectorAll("td").forEach((el) => {
        if (el.innerHTML === "&nbsp;") { 
            console.log("..");
            el.style.backgroundColor = "lightgray";
        }
    });
}

// Returns full <tr>
function paddedLine(l) {
    const row = document.createElement("tr");
    const label = document.createElement("td");
    label.innerText = l;
    label.style = "text-align: center;"
    row.appendChild(label);
    for (let i = 0; i < headings.length - 1; i++) {
        const col = headings[i + 1];
        const td = document.createElement("td");
        
        if (col === "Cat") {
            const select = document.createElement("select");
            select.style = "width: 100%;"
            const opNone = document.createElement("option");
            opNone.innerText = "";
            select.appendChild(opNone);
            const op56 = document.createElement("option");
            op56.innerText = "56";
            select.appendChild(op56);
            const op17 = document.createElement("option");
            op17.innerText = "17";
            select.appendChild(op17);
            const opSlow = document.createElement("option");
            opSlow.innerText = "Slow";
            select.appendChild(opSlow);
            td.innerHTML = select.outerHTML;
            const pCatDisplay = document.createElement("p");
            pCatDisplay.classList = "print-catalog";
            td.appendChild(pCatDisplay);
        } else if (col === "New?" || col === "Set?") {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            td.innerHTML = checkbox.outerHTML;
            td.style = "text-align: center;"
        } else {
            const textInput = document.createElement("input");
            textInput.type = "text";
            if (col === "Prio" || col === "OnOr?") {
                td.style = "max-width: 50px;"
                textInput.style = "text-align: center;"
            }
            td.innerHTML = textInput.outerHTML;
        }

        row.appendChild(td);
    }
    return row;
}