const express = require("express");
const Book = require("../models/bookModel");
const authAdmin = require("../middleware/auth-admin");

const router = new express.Router();

router.get("/books/all", async (req, res) => {
  try {
    const books = await Book.find({});
    if (books.lenght === 0) {
      return res.status(404).send({
        status: 404,
        message: "No books",
      });
    }
    res.send(books);
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
});

router.get("/books/get", async (req, res) => {
  const id = req.query.id;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send({
        status: 404,
        message: "No book",
      });
    }
    res.send(book);
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
});

router.post("/books/add", authAdmin, async (req, res) => {
  const user = new Book(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.patch("/books/edit", authAdmin, async (req, res) => {
  const id = req.query.id;
  const allowdUpdates = [
    "name",
    "format",
    "author",
    "description1",
    "description2",
    "language",
    "imgSrc",
    "price",
    "pages",
    "width",
    "height",
    "weight",
    "publicationDate",
    "publisher",
    "publicationCity",
    "publicationCountry",
    "ISBN10",
    "ISBN13",
    "bestsellersRank",
  ];
  for (let update in req.body) {
    if (!allowdUpdates.includes(update)) {
      return res.status(400).send({
        status: 400,
        message: "Invalid update: " + update,
      });
    }
  }
  try {
    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      res.status(400).send({
        status: 400,
        message: "no book",
      });
    }
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/books/delete", authAdmin, async (req, res) => {
  try {
    const id = req.query.id;
    await Book.findByIdAndDelete(id);
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
