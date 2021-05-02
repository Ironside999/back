const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(token, process.env.USER_SECRET, async (err, decode) => {
      if (err) {
        return res.status(401).send({ error: "Unauthorized" });
      }
      try {
        const user = await User.findById(decode._id);
        if (!user) {
          return res.status(404).send({ error: "Notfound" });
        }
        req.user = user;
        next();
      } catch (err) {
        res.status(404).send({ error: "BAD REQUEST" });
      }
    });
  } catch (err) {
    res.status(401).send({ error: "Unauthorized" });
  }
};

module.exports = userAuth;
