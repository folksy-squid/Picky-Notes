/*jshint esversion: 6 */
var {username, password, awsDB} = require('../../keys').dbCredentials;
const Sequelize = require('sequelize');

var testDB = 'ubuntu:password@localhost:5432/pickynotes';
var prodDB = `${username}:${password}@${awsDB}`;
var dbInstance = process.env.NODE_ENV === 'production' ? prodDB : testDB;

const db = new Sequelize(`postgres://${dbInstance}`, { logging: false });

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
