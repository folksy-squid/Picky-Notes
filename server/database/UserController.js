module.exports = (db, Sequelize) => {
  const User = db.define('user', {
    facebookId: {
      type: Sequelize.TEXT, 
      primaryKey: true
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    email: {
      type: Sequelize.TEXT, 
      allowNull: false
    },
    pictureUrl: Sequelize.TEXT,
    gender: Sequelize.TEXT
  });
  return {
    User: User
  };
};
