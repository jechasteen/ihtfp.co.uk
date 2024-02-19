const fs = require("fs");
const path = require("path")

;(() => {

    // read all three files into vars
    const style = fs.readFileSync(path.join(__dirname, "style.css"), { encoding: "utf-8"});
    const script = fs.readFileSync(path.join(__dirname, "main.js"), { encoding: "utf-8"});
    let html = fs.readFileSync(path.join(__dirname, "template.html"), { encoding: "utf-8"});

    // inject into the template
    html = html.replace("%STYLE%", `<style>${style}</style>`);
    html = html.replace("%SCRIPT%", `<script>\n${script}</script>`);

    // output
    fs.writeFileSync(path.join(__dirname, "OrderGuide.html"), html);
})()