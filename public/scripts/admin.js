import { logOut } from "./logOut.js";
import { getUserName } from "./getUserName.js";

const booksContainer = document.getElementById("books-container");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const token = localStorage.getItem("token");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

const renderBooks = (books) => {
  while (booksContainer.children.length !== 0) {
    booksContainer.lastChild.remove();
  }
  for (let book of books) {
    const bookItem = document.createElement("div");
    bookItem.className = "book-item";
    bookItem.id = book._id;
    const itemImg = document.createElement("div");
    itemImg.className = "item-img";
    const bookImg = document.createElement("img");
    bookImg.src = book.imgSrc;
    itemImg.appendChild(bookImg);
    bookItem.appendChild(itemImg);
    const itemInfo = document.createElement("div");
    itemInfo.className = "item-info";
    const bookName = document.createElement("h3");
    bookName.className = "title";
    bookName.innerHTML = book.name;
    itemInfo.appendChild(bookName);
    const bookAuthor = document.createElement("p");
    bookAuthor.innerHTML = book.author;
    bookAuthor.className = "author";
    itemInfo.appendChild(bookAuthor);
    const priceDiv = document.createElement("div");
    priceDiv.className = "price-wrap";
    const bookPrice = document.createElement("p");
    bookPrice.className = "price";
    bookPrice.innerHTML = book.price + "$";
    priceDiv.appendChild(bookPrice);
    itemInfo.appendChild(priceDiv);
    bookItem.appendChild(itemInfo);
    const itemActions = document.createElement("div");
    itemActions.className = "item-actions";
    const bookBtn = document.createElement("button");
    bookBtn.className = "book-btn none";
    bookBtn.innerHTML = "Add to basket";
    itemActions.appendChild(bookBtn);
    bookItem.appendChild(itemActions);
    booksContainer.appendChild(bookItem);
    bookItem.addEventListener("click", () => {
      window.location.href = `http://localhost:3000/pages/book.html?id=${bookItem.id}`;
    });
  }
};

const searchFilter = (value) => {
  const searchValue = searchInput.value.trim().toLowerCase();
  const name = value.name.trim().toLowerCase();
  const author = value.author.trim().toLowerCase();
  const ISBN10 = value.ISBN10;
  const ISBN13 = value.ISBN13;
  return (
    name.includes(searchValue) ||
    author.includes(searchValue) ||
    ISBN10.includes(searchValue) ||
    ISBN13.includes(searchValue)
  );
};

getUserName();
logOut();

const addClickEvent = () => {
  const btns = document.querySelectorAll(".book-btn");
  for (let btn of btns) {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (btn.innerHTML === "Edit") {
        window.location.href = `http://localhost:3000/pages/add-book.html?id=${event.target.parentElement.parentElement.id}`;
      } else if (btn.innerHTML === "Delete") {
        fetch(
          `http://localhost:3000/books/delete?id=${event.target.parentElement.parentElement.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((res) => {
            if (res.ok) {
              window.location.href = "http://localhost:3000/pages/admin.html";
            } else {
              throw new Error(res.status);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
};

fetch("http://localhost:3000/books/all")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(res.status);
    }
  })
  .then((jsonObj) => {
    renderBooks(jsonObj);
  })
  .catch((err) => {
    console.log(err);
  });

editBtn.addEventListener("click", () => {
  const btns = document.querySelectorAll(".book-btn");
  for (let btn of btns) {
    if (btn.classList.contains("none")) btn.classList.remove("none");
    btn.innerHTML = "Edit";
  }
  addClickEvent();
});

deleteBtn.addEventListener("click", () => {
  const btns = document.querySelectorAll(".book-btn");
  for (let btn of btns) {
    if (btn.classList.contains("none")) btn.classList.remove("none");
    btn.innerHTML = "Delete";
  }
  addClickEvent();
});

searchBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/books/all")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    })
    .then((jsonObj) => {
      const data = jsonObj.filter(searchFilter);
      renderBooks(data);
      searchInput.value = "";
    })
    .catch((err) => {
      console.log(err);
    });
});
