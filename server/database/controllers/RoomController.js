module.exports = (db, Sequelize) => {
  const Room = db.define('room', {
    pathUrl: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    topic: Sequelize.TEXT,
    class: Sequelize.TEXT,
    lecturer: Sequelize.TEXT,
    audioUrl: {
      type: Sequelize.TEXT,
      defaultValue: 'audio url'
    }
  });

  return {
    Room: Room,
  };


};
