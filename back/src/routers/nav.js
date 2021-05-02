const express = require("express");
const Category = require("../models/category");
const Type = require("../models/type");
const ProductTitle = require("../models/productTitle");

const router = new express.Router();

router.get("/api/nav", async (req, res) => {
  try {
    const nav = await Type.find({})
      .select("type")
      .populate({
        path: "children",
        select: "category -parentId",
        model: Category,
        populate: {
          path: "children",
          select: "productTitle -parentId",
          model: ProductTitle,
        },
      })
      .exec();

    res.send(nav);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.name });
  }
});

module.exports = router;
