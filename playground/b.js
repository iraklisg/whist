const a = require('./a.js').a;

console.log('require(a) within b: ');
console.dir(require('./a.js'));

exports.b = 'b from b.js';
exports.a = a;