module.exports = (db, Sequelize, User) => {
  var Room = db.define('room', {
    name: Sequelize.STRING,
    pathUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    audioUrl: {
      type: Sequelize.STRING,
      default: null
    }
  });
  return {
    Room: Room,
  };
};