module.exports = (db, Sequelize, User) => {
  const Note = db.define('note', {
    content: {
      type: Sequelize.TEXT,
    },
    audio_timestamp: {
      type: Sequelize.DATE,
    },
    show: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    // edittingUserId: {
    //   type: Sequelize.BOOLEAN,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     foreignKey: 'facebookId'
    //   }
    // }
  });

  return {
    Note
  };
};