const express = require("express");
const userAuth = require("../middlewares/userAuth");

const Inquiry = require("../models/inquiry");

const router = new express.Router();

router.get("/api/user/data", userAuth, async (req, res) => {
  try {
    // const userData = await Company.findOne({ owner: req.user._id })
    //   .populate({
    //     path: "myAds",
    //     model: AdProduct,
    //   })
    //   .populate({
    //     path: "companyInquiries",
    //     model: Inquiry,
    //   })
    //   .exec();

    const userData = await req.user
      .populate({
        path: "myInquiries",
        model: Inquiry,
      })
      .execPopulate();

    if (!userData) {
      return res.status(404).send();
    }

    res.send({ userData });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.name });
  }
});

module.exports = router;
