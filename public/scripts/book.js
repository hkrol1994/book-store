import { logOut } from "./logOut.js";
import { getUserName } from "./getUserName.js";
import { addToBasket } from "./addToBasket.js";
import { renderCart } from "./renderCart.js";

const id = location.search.replace("?id=", "");
const renderBook = (book) => {
  const divForId = document.querySelector(".item-tools");
  divForId.id = id;
  const bookImg = document.getElementById("book-img");
  bookImg.src = book.imgSrc;
  const bookName = document.getElementById("name");
  bookName.innerHTML = book.name;
  const bookFormat = document.getElementById("format");
  bookFormat.innerHTML = book.format;
  const bookLanguage = document.getElementById("language");
  bookLanguage.innerHTML = book.language;
  const bookAuthor = document.getElementById("author-info");
  bookAuthor.innerHTML = `By ${book.author}`;
  const bookDecs1 = document.getElementById("decs1");
  bookDecs1.innerHTML = book.description1;
  const bookDecs2 = document.getElementById("decs2");
  bookDecs2.innerHTML = book.description2;
  const bookPrice = document.getElementById("price");
  bookPrice.innerHTML = `Price: ${book.price}$`;
  const bookFormatAndPages = document.getElementById("format-and-pages");
  bookFormatAndPages.innerHTML = `${book.format} | ${book.pages} pages`;
  const bookDimensions = document.getElementById("dimensions");
  bookDimensions.innerHTML = `${book.width} X ${book.height} | ${book.weight}g`;
  const publicationDate = document.getElementById("date");
  const d = new Date(book.publicationDate);
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  publicationDate.innerHTML = `${da}-${mo}-${ye}`;
  const bookPublisher = document.getElementById("publisher");
  bookPublisher.innerHTML = book.publisher;
  const bookPublicationLocation = document.getElementById("publication-city");
  bookPublicationLocation.innerHTML = book.publicationCity
    ? `${book.publicationCity}, ${book.publicationCountry}`
    : book.publicationCountry;
  const bookLanguage2 = document.getElementById("book-language");
  bookLanguage2.innerHTML = book.language;
  const bookISBN10 = document.getElementById("ISBN10");
  bookISBN10.innerHTML = book.ISBN10;
  const bookISBN13 = document.getElementById("ISBN13");
  bookISBN13.innerHTML = book.ISBN13;
  const bookRank = document.getElementById("rank");
  bookRank.innerHTML = book.bestsellersRank;
  addToBasket();
};

getUserName();
logOut();
renderCart();

fetch(`http://localhost:3000/books/get?id=${id}`)
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(res.status);
    }
  })
  .then((jsonObj) => {
    renderBook(jsonObj);
  })
  .catch((err) => {
    console.log(err);
  });
