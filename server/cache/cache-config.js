var Redis = require('ioredis');
var cache = new Redis(6379, '127.0.0.1');

module.exports = cache;
