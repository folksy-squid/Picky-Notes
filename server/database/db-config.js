/*jshint esversion: 6 */
const Sequelize = require('sequelize');
const logging = process.env.NODE_ENV === 'test' ? console.log : false;
const db = new Sequelize('postgres://ubuntu:password@localhost:5432/pickynotes', { logging: logging });

const {User} = require('./controllers/UserController')(db, Sequelize);
const {Room} = require('./controllers/RoomController')(db, Sequelize);
const {Note} = require('./controllers/NoteController')(db, Sequelize);

Room.belongsTo(User, {foreignKey: 'hostId', as: 'host', constraints: false});

User.belongsToMany(Room, {foreignKey: 'studentId', through: 'UserRoom'});
Room.belongsToMany(User, {foreignKey: 'lectureRoomId', through: 'UserRoom'});

Room.hasMany(Note);
Note.belongsTo(Room, {onDelete: 'cascade'});

Note.belongsTo(User, {foreignKey: 'editingUserId', as: 'editingUser', onDelete: 'cascade'});
Note.belongsTo(User, {foreignKey: 'originalUserId', as: 'originalUser'});

module.exports = {db, User, Room, Note};
