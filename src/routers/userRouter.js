const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/userModel");

const router = new express.Router();

router.post("/users/new", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findUserByEmailEndPassword(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (tokenDoc) => tokenDoc.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/users/get", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/users/add-to-basket", auth, async (req, res) => {
  try {
    req.user.cart = req.body;
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/users/delete-basket", auth, async (req, res) => {
  try {
    req.user.cart = [];
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/users/get-cart", auth, async (req, res) => {
  try {
    let books = await req.user.populate("cart.book.bookId").execPopulate();
    res.send(books);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
