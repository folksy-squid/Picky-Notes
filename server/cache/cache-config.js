var bluebird = require('bluebird');
var Redis = require('ioredis');
var redis = new Redis();

redis.set('newNote', 'a new thing')
  .then(() => redis.get('newNote'))
  .then((data) => {
    console.log(data);
    redis.quit();
  });
