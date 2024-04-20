/** Immediately invokes the given function
 * 
 * @param {function} fn - function to be run
 * @return {any} Whatever fn returns
 */
function $(fn) { return fn(); };

module.exports = $;