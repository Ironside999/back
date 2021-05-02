const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.ADMIN_SECRET);
    const admin = await Admin.findById(decode._id);
    if (!admin) {
      throw new Error();
    }
    req.token = token;
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).send({ error: "Authorizaton" });
  }
};

module.exports = adminAuth;
