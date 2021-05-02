const internalProductComment = require("../models/internalProductComment");
const Product = require("../models/product");
const express = require("express");
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");

const router = new express.Router();

router.post("/api/products/:prdId/comment", userAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.prdId);

    if (!product) {
      return res.status(404).send();
    }

    const comment = new internalProductComment({
      forProduct: product._id,
      author: req.user._id,
      name: req.user.name,
      comment: req.body.comment,
    });

    await comment.save();
    res.send();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

// admin only

router.get("/api/products/comments", adminAuth, async (req, res) => {
  try {
    const comments = await internalProductComment
      .find({
        reply: { $eq: "none" },
      })
      .populate({
        path: "forProduct",
        model: Product,
        select: "type category productTitle name",
      });

    if (!comments || !comments.length) {
      return res.status(404).send();
    }

    res.send(comments);
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

// admin only

router.patch("/api/products/comments/:id", adminAuth, async (req, res) => {
  try {
    const comment = await internalProductComment.findByIdAndUpdate(
      req.params.id,
      {
        reply: req.body.reply,
      }
    );

    if (!comment) {
      return res.status(404).send();
    }

    res.send();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

// admin only
router.delete("/api/products/comments/:id", adminAuth, async (req, res) => {
  try {
    const comment = await internalProductComment.findByIdAndDelete(
      req.params.id
    );

    if (!comment) {
      return res.status(404).send();
    }

    res.send();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

module.exports = router;
