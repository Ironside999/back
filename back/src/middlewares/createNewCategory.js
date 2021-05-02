const Category = require("../models/category");

const createNewCategory = async (req, res, next) => {
  try {
    const availableCategory = await Category.findOne({
      category: req.body.category,
      parentId: req.parentIdA,
    });

    if (availableCategory) {
      req.parentIdB = availableCategory._id;
      return next();
    }

    const category = new Category({
      category: req.body.category,
      parentId: req.parentIdA,
    });
    await category.save();
    req.parentIdB = category._id;
    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

module.exports = createNewCategory;
