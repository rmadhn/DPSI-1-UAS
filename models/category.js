const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Category", {
    categoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
};
