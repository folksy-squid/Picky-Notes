module.exports = (db, Sequelize, User) => {
  var Note = db.define('note', {
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    audioTimestamp: {
      type: Sequelize.DATE,
      allowNull: false
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