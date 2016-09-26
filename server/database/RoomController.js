module.exports = (db, Sequelize, User) => {
  const Room = db.define('room', {
    path_url: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    topic: Sequelize.TEXT,
    class: Sequelize.TEXT,
    lecturer: Sequelize.TEXT,
    audio_url: {
      type: Sequelize.TEXT,
      defaultValue: 'audio url'
    }
  });

  return {
    Room: Room,
  };


};