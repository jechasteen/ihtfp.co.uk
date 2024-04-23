const fs = require("fs");
const path = require("path");

const files = {
    template: {
        source: "template.html",
        data: fs.readFileSync(path.join(__dirname, "template.html"), {
            encoding: "utf-8",
        }),
    },
    jquery: { source: "node_modules/jquery/dist/jquery.js" },
    adapter: { source: "https://webrtc.github.io/adapter/adapter-latest.js" },
    quagga: { source: "node_modules/quagga/dist/quagga.js" },
    main: { source: "static/main.js" },
};

for (const i in files) {
    if (i === "template") continue;
    if (files[i].source.includes("https")) {
        // download
    } else {
        files[i].data = fs.readFileSync(path.join(__dirname, files[i].source), {
            encoding: "utf-8",
        });
        console.log(`%${i.toUpperCase()}%`);
        files.template.data = files.template.data.replace(
            `%${i.toUpperCase()}%`,
            files[i].data
        );
    }
}

setTimeout(function () {
    fs.writeFileSync(path.join(__dirname, "app.html"), files.template.data, {
        encoding: "utf-8",
    });
}, 500)

