const {cache, pub} = require('./cache-config');

const test = () => {
  cache.set('newNote', 'a new thing')
  .then(() => cache.get('newNote'))
  .then((data) => {
    console.log(data);
    cache.quit();
  });
};

const pubsubTest = () => {
  cache.subscribe('news', 'music', function (err, count) {
    // Now we are subscribed to both the 'news' and 'music' channels.
    // `count` represents the number of channels we are currently subscribed to.

    pub.publish('news', 'Hello world!');
    pub.publish('music', 'Hello again!');
  });

  cache.on('message', function (channel, message) {
    // Receive message Hello world! from channel news
    // Receive message Hello again! from channel music
    console.log('Receive message %s from channel %s', message, channel);
  });
};
