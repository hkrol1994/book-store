const token = localStorage.getItem("token");
const localStorageCart = localStorage.getItem("cart");
const spanTotal = document.querySelectorAll("#total");
const spanAmount = document.querySelectorAll("#amount");

let amount = 0;
let total = 0;

const renderData = (data) => {
  for (let obj of data) {
    amount += obj.book.amount;
    fetch(`http://localhost:3000/books/get?id=${obj.book.bookId}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
      .then((jsonObj) => {
        total += obj.book.amount * jsonObj.price;
        for (let span of spanTotal) {
          span.innerHTML = total.toFixed(2) + "$";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  for (let span of spanAmount) {
    span.innerHTML = amount;
  }
};

export const renderCart = () => {
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
          if (localStorageCart) {
            renderData(JSON.parse(localStorageCart));
          }
        }
      })
      .then((resObj) => {
        renderData(resObj.cart);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    if (localStorageCart) {
      renderData(JSON.parse(localStorageCart));
    }
  }
};
