const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("archive", {
    arsipID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    arsipName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
};
