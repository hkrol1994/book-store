const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  format: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  description1: {
    type: String,
    required: true,
    trim: true,
  },
  description2: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  imgSrc: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  pages: {
    type: Number,
    min: 0,
    required: true,
  },
  width: {
    type: Number,
    min: 0,
    required: true,
  },
  height: {
    type: Number,
    min: 0,
    required: true,
  },
  weight: {
    type: Number,
    min: 0,
    required: true,
  },
  publicationDate: {
    type: Date,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true,
  },
  publicationCity: {
    type: String,
    trim: true,
  },
  publicationCountry: {
    type: String,
    required: true,
    trim: true,
  },
  ISBN10: {
    type: String,
    minlength: 10,
    maxLength: 10,
    required: true,
    trim: true,
  },
  ISBN13: {
    type: String,
    minlength: 13,
    maxLength: 13,
    required: true,
    trim: true,
  },
  bestsellersRank: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
