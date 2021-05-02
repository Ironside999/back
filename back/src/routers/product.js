const express = require("express");
const Product = require("../models/product");
const upload = require("../middlewares/multer");
const resizeUploadedImages = require("../middlewares/sharp");
const createNewType = require("../middlewares/createNewType");
const createNewCategory = require("../middlewares/createNewCategory");
const createNewProductTitle = require("../middlewares/createNewProductTitle");
const internalProductComment = require("../models/internalProductComment");
const adminAuth = require("../middlewares/adminAuth");

const router = new express.Router();

// admin only
router.post(
  "/api/product",
  adminAuth,
  upload.uploadProductImages,
  resizeUploadedImages.formatImage,
  createNewType,
  createNewCategory,
  createNewProductTitle,
  async (req, res) => {
    const product = new Product({ ...req.body });

    try {
      await product.save();
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: err.name });
    }
  }
);

// admin only
router.delete("/api/product/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }

    await product.remove();

    res.send();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

router.get("/api/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: "comment",
        match: { reply: { $ne: "none" } },
        model: internalProductComment,
        options: { sort: "-createdAt" },
      })
      .exec();

    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

router.get("/api/products", async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((itm) => delete queryObj[itm]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v -review -images");
    }

    if (req.query.page) {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);
    }

    const total = await Product.countDocuments(JSON.parse(queryStr));

    const products = await query;

    res.send({ products, total });
  } catch (err) {
    res.status(404).send({ error: err.name });
  }
});

module.exports = router;
