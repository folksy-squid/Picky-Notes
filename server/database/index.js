const Sequelize = require('sequelize');
const db = new Sequelize('postgres://ubuntu:password@localhost:5432/notepicker');

var {User} = require('./UserController')(db, Sequelize);
var {Room} = require('./RoomController')(db, Sequelize, User);
var {Note} = require('./NoteController')(db, Sequelize, User);

Room.belongsTo(User, {foreignKey: 'hostFacebookId', as: 'host', onDelete: 'cascade', constraints: false});

User.belongsToMany(Room, {foreignKey: 'lectureRoomId', as: 'lectureRooms', through: 'UserRoom'});
Room.belongsToMany(User, {foreignKey: 'studentId', as: 'students', through: 'UserRoom'});

Room.hasMany(Note, {as: 'notes'});
Note.belongsTo(Room, {as: 'room', onDelete: 'cascade'});

Note.belongsTo(User, {foreignKey: 'edittingUserId', as: 'edittingUser', onDelete: 'cascade'});
Note.belongsTo(User, {foreignKey: 'originalUserId', as: 'originalUser', onDelete: 'cascade'});

Room.hasMany(Note, {as: 'notes'});
Note.belongsTo(Room, {as: 'room', onDelete: 'cascade'});

db.sync()
  .then(
  User.create({
    facebookId: '10206128224638462',
    name: 'Kunal Rathi',
    email: 'volcanic.phoenix@gmail.com',
    pictureUrl: 'https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-1/p320x320/735019_3760102334957_1830986009_n.jpg?oh=95f952f6a491fa054cbb85122e45395f&oe=587471E6',
    gender: 'Male'    
})
.then((user) => {
  Room.create({
    pathUrl: 'awBzD',
  })
  .then((room) => {
    Note.create({
      content: 'a note',
      audioTimestamp: new Date()
    })
    .then((note) => {
      // console.log(user);
      note.setOriginalUser(user);
      note.setEdittingUser(user);
      room.setHost(user);
      room.addNote(note);
    });
  });
})
.catch((err) => {
  console.log(err);
}));

module.exports = {db: db};