const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    port: process.env.DB_PORT || 3306, // Default port for MySQL
  }
);

module.exports = {
  sequelize,
};

// Mengimpor model dan menghubungkan dengan instance Sequelize
const Category = require("./category")(sequelize);
const Archive = require("./archive")(sequelize);
const User = require("./user")(sequelize);

// Definisi relasi antar model
Archive.belongsTo(Category, { foreignKey: "categoryID" });

// Sinkronisasi model dengan database
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

module.exports = {
  sequelize,
  Archive,
  Category,
  User,
};
