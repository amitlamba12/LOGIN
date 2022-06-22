const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
const { DB_NAME, DB_USER, DB_PASSWORD, DB_PORT, DB_HOST, DB_DIALECT } =
  process.env;
  
const db = new Sequelize("login", "root", "", {
  host: "localhost",
  dialect: "mysql",
  define: {
    timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    freezeTableName: true,
  },
  dialectOptions: {
    decimalNumbers: true,
  },
  logging: false,
});

module.exports = db;
