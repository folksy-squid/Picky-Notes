module.exports = (db, Sequelize) => {
  const Note = db.define('note', {
    content: {
      type: Sequelize.TEXT,
    },
    audioTimestamp: {
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
