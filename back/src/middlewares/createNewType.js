const Type = require("../models/type");

const createNewType = async (req, res, next) => {
  try {
    const availableType = await Type.findOne({ type: req.body.type });
    if (availableType) {
      req.parentIdA = availableType._id;
      return next();
    }
    const type = new Type({ type: req.body.type });
    await type.save();
    req.parentIdA = type._id;
    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

module.exports = createNewType;
