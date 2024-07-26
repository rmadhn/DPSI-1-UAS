const { Sequelize } = require("sequelize");
require("dotenv").config();

// Menggunakan variabel environment untuk konfigurasi database
const sequelize = new Sequelize({
  host: process.env.HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dialect: "mysql",
  dialectModule: require("mysql2"),
  benchmark: true,
});

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
