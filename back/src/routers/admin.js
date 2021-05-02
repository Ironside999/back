const Admin = require("../models/admin");
const express = require("express");

const router = new express.Router();

router.post("/api/admin", async (req, res) => {
  try {
    checkAdmin = await Admin.find({});
    if (checkAdmin.length) throw new Error("Unathourized");

    const admin = new Admin({
      username: req.body.username,
      password: req.body.password,
      passwordC: req.body.passwordC,
    });
    const token = await admin.generateAuthToken();
    await admin.save();
    res.status(201).send({ token });
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

router.post("/api/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.username,
      req.body.password,
      req.body.passwordC
    );
    const token = await admin.generateAuthToken();
    res.send({ token });
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
});

module.exports = router;
