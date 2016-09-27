const redis = require('./cache-config');

const test = () => {
  redis.set('newNote', 'a new thing')
  .then(() => redis.get('newNote'))
  .then((data) => {
    console.log(data);
    redis.quit();
  });
};
