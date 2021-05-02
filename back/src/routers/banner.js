const express = require("express");
const Banner = require("../models/banner");
const upload = require("../middlewares/multer");
const format = require("../middlewares/sharp");
const adminAuth = require("../middlewares/adminAuth");

const router = new express.Router();

// admin only
router.post(
  "/api/banner",
  adminAuth,
  upload.uploadBanner,
  format.formatBanner,
  async (req, res) => {
    const banner = new Banner({ ...req.body });
    try {
      await banner.save();
      res.status(200).send(banner);
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: err.name });
    }
  }
);

// admin only
router.delete("/api/banner/:id", adminAuth, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).send();
    }
    res.send(banner);
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

router.get("/api/banners", async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludeFields = ["skip", "sort", "limit", "fields"];

    excludeFields.forEach((itm) => delete queryObj[itm]);

    let query = Banner.find(queryObj);

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
      query = query.select("-__v");
    }

    if (req.query.skip && req.query.limit) {
      const skip = +req.query.skip || 0;
      const limit = +req.query.limit || 10;

      query = query.skip(skip).limit(limit);
    }

    const banner = await query;
    res.send({ banner });
  } catch (err) {
    res.status(404).send({ error: err.name });
  }
});

module.exports = router;
