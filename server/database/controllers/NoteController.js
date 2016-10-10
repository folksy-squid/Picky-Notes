module.exports = (db, Sequelize) => {
  const Note = db.define('note', {
    content: {
      type: Sequelize.TEXT,
    },
    audioTimestamp: {
      type: Sequelize.TEXT,
    },
    show: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    thought: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return {
    Note
  };
};
