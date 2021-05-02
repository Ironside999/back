const User = require("../models/user");
const express = require("express");
const adminAuth = require("../middlewares/adminAuth");
const router = new express.Router();

// admin only
router.get("/api/users/all", adminAuth, async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((itm) => delete queryObj[itm]);

    let query = User.find(queryObj);

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
      query = query.select("-__v email name isRestricted");
    }

    if (req.query.page) {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);
    }

    const total = await User.countDocuments(queryObj);

    const user = await query;
    res.send({ user, total });
  } catch (err) {
    res.status(404).send({ error: err.name });
  }
});

// admin only
router.patch("/api/user/control/:id", adminAuth, async (req, res) => {
  if (req.body.isRestricted === "true" || req.body.isRestricted === "false") {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        isRestricted: req.body.isRestricted === "true" ? true : false,
      });

      if (!user) {
        return res.status(404).send();
      }
      res.send();
    } catch (err) {
      return res.status(400).send({ error: err.name });
    }
  } else {
    return res.status(400).send({ error: "BAD REQUEST" });
  }
});

module.exports = router;
