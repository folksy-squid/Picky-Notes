const md5 = require('js-md5');
const {User, Room, Note} = require('./db-config');

const createNewRoom = ({topic, className, lecturer, hostId}, cb) => {
  // { topic, class, lecturer, hostId }
  const pathUrl = md5(topic + className + lecturer + hostId + Date()).slice(0, 5);

  Room.create({
    pathUrl: pathUrl,
    topic: topic,
    class: className,
    lecturer: lecturer,
    hostId: hostId
  })
  .then((roomInfo) => {
    cb(roomInfo);
  });
};

module.exports = {
  createNewRoom
};