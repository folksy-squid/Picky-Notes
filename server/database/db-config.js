const Sequelize = require('sequelize');
const db = new Sequelize('postgres://ubuntu:password@localhost:5432/pickynotes', { logging: false });

const {User} = require('./controllers/UserController')(db, Sequelize);
const {Room} = require('./controllers/RoomController')(db, Sequelize);
const {Note} = require('./controllers/NoteController')(db, Sequelize);

Room.belongsTo(User, {foreignKey: 'hostId', as: 'host', constraints: false});

User.belongsToMany(Room, {foreignKey: 'lectureRoomId', through: 'UserRoom'});
Room.belongsToMany(User, {foreignKey: 'studentId', through: 'UserRoom'});

Room.hasMany(Note, {as: 'notes'});
Note.belongsTo(Room, {as: 'room', onDelete: 'cascade'});

Note.belongsTo(User, {foreignKey: 'editingUserId', as: 'editingUser', onDelete: 'cascade'});
Note.belongsTo(User, {foreignKey: 'originalUserId', as: 'originalUser'});

// db.sync()
//   .then(
//   User.create({
//     facebookId: '10206128224638462',
//     name: 'Kunal Rathi',
//     email: 'volcanic.phoenix@gmail.com',
//     pictureUrl: 'https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-1/p320x320/735019_3760102334957_1830986009_n.jpg?oh=95f952f6a491fa054cbb85122e45395f&oe=587471E6',
//     gender: 'Male'
// })
// .then((user) => {
//   Room.create({
//     pathUrl: 'awBzD',
//   })
//   .then((room) => {
//     Note.create({
//       content: 'a note',
//       audioTimestamp: new Date()
//     })
//     .then((note) => {
//       note.setOriginalUser(user);
//       note.setEditingUser(user);
//       room.setHost(user);
//       room.addNote(note);
//     });
//   });
// })
// .catch((err) => {
//   console.log(err);
// }));

module.exports = {db, User, Room, Note};
