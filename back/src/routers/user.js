const User = require("../models/user");
const express = require("express");
const crypto = require("crypto");
const userAuth = require("../middlewares/userAuth");
const { sendVerifyCode, sendResetPassword } = require("../utils/sendEmail");
const upload = require("../middlewares/multer");
const format = require("../middlewares/sharp");
const bcrypt = require("bcryptjs");
const generateRandomCode = require("../utils/randomCode");

const router = new express.Router();
// sign up ------------------------------------------------------------------------------------
router.post("/api/user/signup", async (req, res) => {
  const code = await generateRandomCode(3);
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    tCodeExp: Date.now() + 900000,
    temporaryCode: code,
  });
  try {
    const token = await user.generateAuthToken();
    await user.save();
    // await sendVerifyCode(user.email, user.temporaryCode);
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});
// confirm email code and send again email code -----------------------------------------------------------------
router.post("/api/user/confirm", userAuth, async (req, res) => {
  if (req.body.code) {
    try {
      const match = req.user.isTempCodeMatch(req.body.code);
      if (!match) throw new Error("wrong code");
      req.user.tCodeExp = undefined;
      req.user.temporaryCode = undefined;
      req.user.isVerified = true;
      await req.user.save();

      return res.send(req.user);
    } catch (err) {
      return res.status(404).send(err);
    }
  }

  try {
    const code = await generateRandomCode(3);
    req.user.tCodeExp = Date.now() + 900000;
    req.user.temporaryCode = code;

    await req.user.save();

    await sendVerifyCode(req.user.email, code);

    res.send(req.user);
  } catch (err) {
    res.status(404).send(err);
  }
});
// login ------------------------------------------------------------------------------------
router.post("/api/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send();
  }
});
// forget password ------------------------------------------------------------------------------------
router.post("/api/user/forgotPassword", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send();
    }

    const token = await user.createPasswordResetToken();

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/user/resetPassword/${token}`;

    await sendResetPassword(req.body.email, resetURL);

    await user.save({ validateBeforeSave: false });

    res.send();
  } catch (err) {
    const user = await User.findOne({ email: req.body.email });
    user.passwordResetToken = undefined;
    user.passwordResetExp = undefined;
    // test with some custom error********************
    await user.save({ validateBeforeSave: false });
    console.log(err);

    res.status(500).send(err);
  }
});
// reset password after forgotten password ----------------------------------------------------------------
router.patch("/api/user/resetPassword/:token", async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).send();
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExp = undefined;

    await user.save();

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (err) {
    res.status(400).send();
  }
});
// update user ------------------------------------------------------------------------------------
router.patch(
  "/api/user/update",
  userAuth,
  upload.uploadProfile,
  format.formatProfile,
  async (req, res) => {
    try {
      const isMatch = await bcrypt.compare(
        req.body.password,
        req.user.password
      );

      if (!isMatch) throw new Error("wrong password");

      if (req.body.newPassword) {
        req.user.password = req.body.newPassword;
      }
      if (req.body.name) {
        req.user.name = req.body.name;
      }
      if (req.body.photo) {
        req.user.photo = req.body.photo;
      }

      await req.user.save();
      res.send(req.user);
    } catch (err) {
      res.status(400).send({ error: err.name });
    }
  }
);

module.exports = router;
