const Inquiry = require("../models/inquiry");
const express = require("express");
const userAuth = require("../middlewares/userAuth");
const isRestricted = require("../middlewares/isRestricted");
const generateRandomCode = require("../utils/randomCode");
const User = require("../models/user");
const adminAuth = require("../middlewares/adminAuth");

const router = new express.Router();

router.post(
  "/api/inquiry",
  userAuth,
  isRestricted,
  // hasCompany,
  // getCompanyId,
  async (req, res) => {
    const inquiry = new Inquiry({
      Inquirer: req.user._id,
      product: req.body.product,
      productId: req.body.productId,
      count: +req.body.count,
    });

    try {
      await inquiry.save();
      res.send(inquiry);
    } catch (err) {
      res.status(400).send({ error: err.name });
    }
  }
);
// admin only
router.get("/api/inquiries", adminAuth, async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((itm) => delete queryObj[itm]);

    let query = Inquiry.find(queryObj);

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
      query = query.select("-__v ");
    }

    if (req.query.page) {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);
    }

    const total = await Inquiry.countDocuments(queryObj);

    const inquiries = await query;
    res.send({ inquiries, total });
  } catch (err) {
    res.status(404).send({ error: err.name });
  }
});

// admin only
router.patch("/api/inquiry/:id", adminAuth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).send();
    }

    if (req.body.status === "fulfilled") {
      const code = await generateRandomCode(4);
      inquiry.status = req.body.status;
      inquiry.price = +req.body.price;
      inquiry.callNumber = +req.body.callNumber;
      inquiry.expiresIn = req.body.expire;
      inquiry.code = code;
      await inquiry.save();

      return res.send(inquiry);
    }

    inquiry.status = "rejected";

    await inquiry.save();

    res.send(inquiry);
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

// admin only
router.get("/api/inquiry/:id", adminAuth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate({
      path: "Inquirer",
      model: User,
    });

    if (!inquiry) {
      return res.status(404).send();
    }

    res.send(inquiry);
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

// admin only
router.delete("/api/inquiry/:id", adminAuth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).send();
    }

    res.send(inquiry);
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

module.exports = router;
