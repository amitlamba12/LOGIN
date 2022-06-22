const jwt = require("jsonwebtoken");
const timeToExpire = 60 * 5;
const oneDay = 1000 * 60 * 60 * 24;
const secret = process.env.APP_SECRET;

const generateToken = (data, time) => {
  return jwt.sign(data, secret, { expiresIn: time ? time : timeToExpire });
};

module.exports = { generateToken ,oneDay};
