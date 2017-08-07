/**
 @see https://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
 */
const b = require('./b.js').b;

console.log('require(b) within a: ');
console.dir(require('./b.js'));

exports.a = 'a from a.js';
exports.b = b;