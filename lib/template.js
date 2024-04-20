const fs = require("fs");

/** Creates an object that allows maniplation of the given template
 *
 * @param {path} path - full path to template
 * @typedef {Object} Item
 * @property {string} key - key to be searched in template, e.g. style -> %style%
 * @property {string} content - content to be injected
 * @property {string} [outerTag] - wrap content in tag, e.g. script -> "<script>...</script>"
 * @param {Item[]} items
 * @returns {Object} that allows further manipulation of
 * the template.
 *
 */
function Template(path, items) {
    if (fs.existsSync(path)) this.path = path;
    else
        throw Error(
            `Failed to open\n${path}\nCan't continue to process template.`
        );

    this.items = items;
    this.HTML = fs.readFileSync(path, { encoding: "utf-8" });
    this.write = (path) => fs.writeFileSync(path, this.HTML);

    for (let key in items) {
        this.HTML = this.HTML.replace(`%${key}%`, items[key])
    }

    return this;
}

module.exports = Template;
