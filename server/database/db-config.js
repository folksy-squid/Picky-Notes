/*jshint esversion: 6 */
var config = process.env.NODE_ENV || 'dev';
var { dbName, username, password, host, port } = process.env.NODE_ENV !== 'test' && require('../../keys').db[config];
if ( process.env.NODE_ENV === 'test') {
  var { dbName, username, password, host, port } = require('../../example_keys').db[test];
}

const Sequelize = require('sequelize');

const db = new Sequelize(`postgres://${username}:${password}@${host}:${port}/${dbName}`, { logging: false });

const {User} = require('./controllers/UserController')(db, Sequelize);
const {Room} = require('./controllers/RoomController')(db, Sequelize);
const {Note} = require('./controllers/NoteController')(db, Sequelize);

Room.belongsTo(User, {foreignKey: 'hostId', as: 'host', constraints: false});

User.belongsToMany(Room, {through: 'UserRoom'});
Room.belongsToMany(User, {through: 'UserRoom'});

Room.hasMany(Note);
Note.belongsTo(Room, {onDelete: 'cascade'});

Note.belongsTo(User, {foreignKey: 'editingUserId', as: 'editingUser', onDelete: 'cascade'});
Note.belongsTo(User, {foreignKey: 'originalUserId', as: 'originalUser'});

module.exports = {db, User, Room, Note};
