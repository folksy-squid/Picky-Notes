module.exports = (db, Sequelize, User) => {
  var Note = db.define('note', {
    content: {
      type: Sequelize.TEXT,
    },
    audioTimestamp: {
      type: Sequelize.DATE,
    },
    show: {
      type: Sequelize.BOOLEAN,
      default: false
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
    Note: Note
  };
};