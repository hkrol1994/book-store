const express = require("express");
const authAdmin = require("../middleware/auth-admin");
const Admin = require("../models/adminModel");

const router = new express.Router();

router.post("/admin/new", async (req, res) => {
  const admin = new Admin(req.body);
  try {
    await admin.save();
    const token = await admin.generateAuthToken();
    res.send({ admin, token });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findUserByEmailEndPassword(
      req.body.email,
      req.body.password
    );
    const token = await admin.generateAuthToken();
    res.send({ admin, token });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.post("/admin/logout", authAdmin, async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter(
      (tokenDoc) => tokenDoc.token !== req.token
    );
    await req.admin.save();
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/admin/get", authAdmin, async (req, res) => {
  try {
    res.send(req.admin);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
