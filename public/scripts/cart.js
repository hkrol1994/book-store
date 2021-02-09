import { logOut } from "./logOut.js";
import { getUserName } from "./getUserName.js";
import { renderCart } from "./renderCart.js";

const token = localStorage.getItem("token");
const localStorageCart = localStorage.getItem("cart");
const booksContainer = document.querySelector(".basket-items-wrap");
const basketAmount = document.getElementById("basket-amount");
const basketTotal = document.getElementById("basket-total");
const basketTotal2 = document.getElementById("basket-total2");
let cart;

getUserName();
logOut();
renderCart();

const addBtnListener = () => {
  const checkoutBtns = document.querySelectorAll(".checkout-btn");
  const updateBtns = document.querySelectorAll(".update-btn");
  const removeBtns = document.querySelectorAll(".remove-btn");
  for (let btn of checkoutBtns) {
    btn.addEventListener("click", () => {
      if (token) {
        fetch("http://localhost:3000/users/delete-basket", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (res.ok) {
              alert("thank you for buying");
              setTimeout(() => {
                window.location.href = "http://localhost:3000/index.html";
              }, 1000);
            } else {
              throw new Error(res.status);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        localStorage.removeItem("cart");
        alert("thank you for buying");
        setTimeout(() => {
          window.location.href = "http://localhost:3000/index.html";
        }, 1000);
      }
    });
  }
  for (let btn of updateBtns) {
    btn.addEventListener("click", (event) => {
      const updateCart = [];
      for (let i = 0; i < cart.length; i++) {
        updateCart.push({
          book: {
            bookId: cart[i].book.bookId._id,
            amount: cart[i].book.amount,
          },
        });

        if (cart[i].book.bookId._id === event.target.id) {
          updateCart[i].book.amount = parseInt(
            event.target.parentElement.children[1].value
          );
          if (token) {
            fetch("http://localhost:3000/users/add-to-basket", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateCart),
            })
              .then((res) => {
                if (res.ok) {
                } else {
                  throw new Error(res.status);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            localStorage.setItem("cart", JSON.stringify(updateCart));
          }
          window.location.href = "http://localhost:3000/pages/cart.html";
        }
      }
    });
  }
  for (let btn of removeBtns) {
    btn.addEventListener("click", (event) => {
      console.log(token);
      let updateCart = [];
      for (let i = 0; i < cart.length; i++) {
        updateCart.push({
          book: {
            bookId: cart[i].book.bookId._id,
            amount: cart[i].book.amount,
          },
        });
      }
      updateCart = updateCart.filter(
        (obj) => obj.book.bookId !== event.target.id
      );
      if (token) {
        fetch("http://localhost:3000/users/add-to-basket", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateCart),
        })
          .then((res) => {
            if (res.ok) {
            } else {
              throw new Error(res.status);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        localStorage.setItem("cart", JSON.stringify(updateCart));
      }
      window.location.href = "http://localhost:3000/pages/cart.html";
    });
  }
};

const emptyBasket = () => {
  const basketMsg = document.querySelector(".basket-msg");
  basketMsg.innerHTML = "Your basket is empty.";
  const checkoutBtns = document.querySelectorAll(".checkout-btn");
  for (let btn of checkoutBtns) {
    btn.className = "none";
  }
  const basketItems = document.querySelector(".basket-items-wrap");
  basketItems.className = "none";
  const basketTotals = document.querySelector(".basket-totals-wrap");
  basketTotals.className = "none";
};

const makeBasketItem = (data) => {
  const basketItem = document.createElement("div");
  basketItem.className = "basket-item";
  const itemInfoWrap = document.createElement("div");
  itemInfoWrap.className = "item-info-wrap";
  const itemImg = document.createElement("div");
  itemImg.className = "item-img";
  const img = document.createElement("img");
  img.src = data.book.bookId.imgSrc;
  itemImg.appendChild(img);
  itemInfoWrap.appendChild(itemImg);
  const itemInfo = document.createElement("div");
  itemInfo.className = "item-info";
  const itemName = document.createElement("h2");
  itemName.innerHTML = data.book.bookId.name;
  const itemFormat = document.createElement("span");
  itemFormat.className = "format";
  itemFormat.innerHTML = `${data.book.bookId.format}, ${data.book.bookId.language}`;
  const itemAuthor = document.createElement("span");
  itemAuthor.className = "author";
  itemAuthor.innerHTML = data.book.bookId.author;
  const itemPrice = document.createElement("span");
  itemPrice.className = "price";
  itemPrice.innerHTML = data.book.bookId.price + "$";
  itemInfo.appendChild(itemName);
  itemInfo.appendChild(itemFormat);
  itemInfo.appendChild(itemAuthor);
  itemInfo.appendChild(itemPrice);
  itemInfoWrap.appendChild(itemInfo);
  basketItem.appendChild(itemInfoWrap);
  const itemCheckoutInfo = document.createElement("div");
  itemCheckoutInfo.className = "item-checkout-info";
  const quantityLabel = document.createElement("label");
  quantityLabel.innerHTML = "Quantity";
  const amountInput = document.createElement("input");
  amountInput.value = data.book.amount;
  const updateBtn = document.createElement("button");
  updateBtn.id = data.book.bookId._id;
  updateBtn.className = "update-btn";
  updateBtn.innerHTML = "Update";
  const totalPrice = document.createElement("p");
  totalPrice.className = "price";
  totalPrice.innerHTML =
    (data.book.amount * data.book.bookId.price).toFixed(2) + "$";
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.innerHTML = "Remove";
  removeBtn.id = data.book.bookId._id;
  itemCheckoutInfo.appendChild(quantityLabel);
  itemCheckoutInfo.appendChild(amountInput);
  itemCheckoutInfo.appendChild(updateBtn);
  itemCheckoutInfo.appendChild(totalPrice);
  itemCheckoutInfo.appendChild(removeBtn);
  basketItem.appendChild(itemCheckoutInfo);
  booksContainer.appendChild(basketItem);
};

const renderData = (data) => {
  let amount = 0;
  let total = 0;
  if (data.length === 0) emptyBasket();
  else {
    for (let obj of data) {
      if (!token) {
        fetch(`http://localhost:3000/books/get?id=${obj.book.bookId}`)
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error(res.status);
            }
          })
          .then((jsonObj) => {
            obj.book.bookId = jsonObj;
            amount += obj.book.amount;
            total += obj.book.amount * obj.book.bookId.price;
            basketTotal.innerHTML = total.toFixed(2) + "$";
            basketTotal2.innerHTML = total.toFixed(2) + "$";
            makeBasketItem(obj);
            addBtnListener();
            basketAmount.innerHTML = amount;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        amount += obj.book.amount;
        total += obj.book.amount * obj.book.bookId.price;
        basketTotal.innerHTML = total.toFixed(2) + "$";
        basketTotal2.innerHTML = total.toFixed(2) + "$";
        makeBasketItem(obj);
        addBtnListener();
        basketAmount.innerHTML = amount;
      }
    }
  }
};

if (token) {
  fetch("http://localhost:3000/users/get-cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        if (localStorageCart) {
          cart = JSON.parse(localStorageCart);
          renderData(cart);
        } else {
          emptyBasket();
        }
      }
    })
    .then((resObj) => {
      cart = resObj.cart;
      renderData(cart);
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  if (localStorageCart) {
    cart = JSON.parse(localStorageCart);
    renderData(cart);
  } else {
    emptyBasket();
  }
}
