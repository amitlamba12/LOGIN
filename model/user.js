const db = require("../config/db");
const type = require("sequelize/lib/data-types");

const User = db.define("users", {
  id: {
    type: type.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: type.STRING,
  },
  lastname: {
    type: type.STRING,
  },
  email: {
    type: type.STRING,
  },
  phoneNumber: {
    type: type.STRING,
  },
  password: {
    type: type.STRING,
  },
  roles: {
    type: type.STRING,
  }, 
  isVerified:{
    type:type.BOOLEAN,
    defaultValue:false
  },
  otp: {
    type: type.STRING,
  },
});

User.sync()

module.exports =  User ;
