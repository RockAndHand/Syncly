const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    } catch (error) {
      res.status(401).json({
        message: "Invalid token",
      });
    }
  } else {
    res.status(401).json({
      message: "No token provided",
    });
  }
};

module.exports = protect;
