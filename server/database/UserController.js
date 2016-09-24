module.exports = (db, Sequelize) => {
  var User = db.define('user', {
    facebookId: {
      type: Sequelize.STRING, 
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING, 
      allowNull: false
    },
    pictureUrl: Sequelize.STRING,
    gender: Sequelize.STRING
  });
  return {
    User: User
  };
};
