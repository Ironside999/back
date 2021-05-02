const express = require("express");
const Blog = require("../models/blog");
const comments = require("../models/comment");
const userAuth = require("../middlewares/userAuth");

const router = new express.Router();

router.post("/api/blog/:blogId/comment", userAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).send();
    }

    const comment = new comments({
      forPost: blog._id,
      author: req.user._id,
      name: req.user.name,
      text: req.body.text,
    });
    await comment.save();

    blog.comment.push(comment);
    await blog.save();
    res.send();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

router.post("/api/comment/:cmId", userAuth, async (req, res) => {
  try {
    const comment = await comments.findById(req.params.cmId);

    if (!comment) {
      return res.status(404).send();
    }

    const commentS = new comments({
      author: req.user._id,
      name: req.user.name,
      text: req.body.text,
    });

    await commentS.save();

    comment.comment.push(commentS);

    await comment.save();
    res.send();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

module.exports = router;
