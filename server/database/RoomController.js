module.exports = (db, Sequelize, User) => {
  const Room = db.define('room', {
    name: Sequelize.STRING,
    pathUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    audioUrl: {
      type: Sequelize.STRING,
      default: 'audio url'
    }
  });

  return {
    Room: Room,
  };


};