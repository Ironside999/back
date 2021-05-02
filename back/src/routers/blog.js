const express = require("express");
const Blog = require("../models/blog");
const upload = require("../middlewares/multer");
const format = require("../middlewares/sharp");
const adminAuth = require("../middlewares/adminAuth");
const router = new express.Router();

// admin only
router.post(
  "/api/blog",
  adminAuth,
  upload.uploadBlogImages,
  format.formatBlogImages,
  async (req, res) => {
    const blog = new Blog({ ...req.body });
    try {
      await blog.save();
      res.status(200).send();
    } catch (err) {
      res.status(400).send({ error: err.name });
    }
  }
);

// admin only
router.delete("/api/blog/:id", adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).send();
    }
    res.send(blog);
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

router.get("/api/blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("comment").exec();
    if (!blog) {
      return res.status(404).send();
    }
    res.send(blog);
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

router.get("/api/blogs", async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludeFields = ["skip", "sort", "limit", "fields"];

    excludeFields.forEach((itm) => delete queryObj[itm]);

    let query = Blog.find(queryObj);

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
      query = query.select("-__v -author -backgroundImage -sections");
    }

    if (req.query.skip && req.query.limit) {
      const skip = +req.query.skip || 0;
      const limit = +req.query.limit || 10;

      query = query.skip(skip).limit(limit);
    }

    const total = await Blog.countDocuments(queryObj);

    const blog = await query;
    res.send({ blog, total });
  } catch (err) {
    res.status(404).send({ error: err.name });
  }
});

module.exports = router;
