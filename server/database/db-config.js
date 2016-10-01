/*jshint esversion: 6 */
var testDb = { username: 'ubuntu', password: 'password', awsDB: 'localhost:5432/pickynotes' };
var { username, password, awsDB } = process.env.NODE_ENV === 'production' ? require('../../keys').dbCredentials : testDb;
const Sequelize = require('sequelize');

const db = new Sequelize(`postgres://${username}:${password}@${awsDB}`, { logging: false });

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
