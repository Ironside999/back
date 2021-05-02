const ProductTitle = require("../models/productTitle");
const createNewProductTitle = async (req, res, next) => {
  try {
    const availableProductTitle = await ProductTitle.findOne({
      productTitle: req.body.productTitle,
      parentId: req.parentIdB,
    });
    if (availableProductTitle) {
      return next();
    }
    const productTitle = new ProductTitle({
      productTitle: req.body.productTitle,
      parentId: req.parentIdB,
    });
    await productTitle.save();
    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

module.exports = createNewProductTitle;
