const jwt = require("jsonwebtoken");

const checkAccessToken = async (req, res, next) => {
  let accessToken;

  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const secret = process.env.APP_SECRET;
    const decodedToken = jwt.verify(accessToken, secret);

    req.auth = decodedToken;
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  next();
};

const checkRefreshToken = async (req, res, next) => {
  let refreshToken;
  try {
    refreshToken = JSON.parse(req.cookies["refreshToken"]);
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const secret = process.env.APP_SECRET;
    const decodedToken = jwt.verify(refreshToken, secret);
    req.auth = decodedToken;
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  next();
};

module.exports = {
  checkAccessToken,
  checkRefreshToken,
};
