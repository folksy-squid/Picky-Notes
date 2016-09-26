module.exports = (db, Sequelize) => {
  const User = db.define('user', {
    facebook_id: {
      type: Sequelize.TEXT, 
      unique: true
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    email: {
      type: Sequelize.TEXT, 
      allowNull: false
    },
    picture_url: Sequelize.TEXT,
    gender: Sequelize.TEXT
  });
  return {
    User: User
  };
};
