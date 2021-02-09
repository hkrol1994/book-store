const token = localStorage.getItem("token");

let cart;

const updateLocalStorageCart = (id) => {
  const localStorageCart = localStorage.getItem("cart");
  console.log(localStorageCart);
  if (localStorageCart) {
    cart = getData(JSON.parse(localStorageCart), id);
  } else {
    cart = getData([], id);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "http://localhost:3000/index.html";
};

const updateUserCart = () => {
  fetch("http://localhost:3000/users/add-to-basket", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: cart,
  })
    .then((res) => {
      if (res.ok) {
        window.location.href = "http://localhost:3000/index.html";
      } else {
        throw new Error(res.status);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getData = (data, id) => {
  if (data.length === 0) {
    data.push({ book: { bookId: id, amount: 1 } });
  } else {
    const cartFilter = data.filter((obj) => obj.book.bookId === id);
    if (cartFilter.length !== 0) {
      for (let obj of data) {
        if (obj.book.bookId === id) obj.book.amount++;
      }
    } else {
      data.push({ book: { bookId: id, amount: 1 } });
    }
  }
  return data;
};

export const addToBasket = () => {
  const btns = document.querySelectorAll(".book-btn");
  for (let btn of btns) {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = event.target.parentElement.parentElement.id;
      if (token) {
        fetch("http://localhost:3000/users/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              updateLocalStorageCart(id);
            }
          })
          .then((resObj) => {
            cart = JSON.stringify(getData(resObj.cart, id));
            console.log(cart);
            updateUserCart();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        updateLocalStorageCart(id);
      }
    });
  }
};
