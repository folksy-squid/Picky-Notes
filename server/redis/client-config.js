var bluebird = require('bluebird');
var redis = require('redis');
var client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('error', function(err) {
  console.log('Error', err);
});

client.setAsync('newNote', 'a new thing')
  .then(() => client.getAsync('newNote'))
  .then((data) => {
    console.log(data);
    client.quit();
  });
