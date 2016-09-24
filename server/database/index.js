const Sequelize = require('sequelize');
var db = new Sequelize('postgres://ubuntu:password@localhost:5432/notepicker');

const {User} = require('./UserController')(db, Sequelize);
const {Room} = require('./RoomController')(db, Sequelize, User);
const {Note} = require('./NoteController')(db, Sequelize, User);

User.hasMany(Room, {as: 'hostedRooms', onDelete: 'cascade'});
Room.belongsTo(User, {as: 'host'});

User.belongsToMany(Room, {through: 'UserRoom'});
Room.belongsToMany(User, {as: 'students', through: 'UserRoom'});

Note.belongsTo(User, {as: 'originalUser', onDelete: 'cascade'});

Room.hasMany(Note, {as: 'notes'});
Note.belongsTo(Room);

Note.belongsTo(User, {foreignKey: 'edittingUserId', as: 'edittingUser', onDelete: 'cascade'});

db.sync({force: true})
.then(
User.findOrCreate({
  where: {
    facebookId: '10206128224638462',
  }
})
.then((user) => {
  Room.findOrCreate({
    where: {
      pathUrl: 'awBzD',      
    }
  })
  .then((room) => {
    console.log(user[0]);
    Note.findOrCreate({
      where: {
        content: 'a note',
        audioTimestamp: new Date(),
        edittingUserId: user[0].dataValues.facebookId
      }
    }).then((note) => {
      user.addRoom(room[0]);
      room.addNote(note[0]);
    });
  });
})
.catch((err) => {
  console.log(err);
}));



module.exports = {db: db};