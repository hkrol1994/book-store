const joinBtn = document.getElementById("join-btn");
const signInBtn = document.getElementById("sign-in-btn");
const cart = localStorage.getItem("cart");

const updateUserCart = () => {
  fetch("http://localhost:3000/users/add-to-basket", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
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

joinBtn.addEventListener("click", (event) => {
  const data = {};
  data.name = event.target.parentElement.children[1].value;
  data.email = event.target.parentElement.children[2].value;
  data.password = event.target.parentElement.children[3].value;
  fetch("http://localhost:3000/users/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    })
    .then((resObj) => {
      const token = resObj.token;
      localStorage.setItem("token", token);
      if (cart) {
        updateUserCart();
        localStorage.removeItem("cart");
      }
      window.location.href = `http://localhost:3000/index.html`;
    })
    .catch((err) => {
      console.log(err);
      alert("Unable to join");
    });
});

signInBtn.addEventListener("click", (event) => {
  const data = {};
  data.email = event.target.parentElement.children[1].value;
  data.password = event.target.parentElement.children[2].value;
  fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res);
        throw new Error(res.status);
      }
    })
    .then((resObj) => {
      const token = resObj.token;
      localStorage.setItem("token", token);
      if (cart) {
        updateUserCart();
        localStorage.removeItem("cart");
      }
      window.location.href = `http://localhost:3000/index.html`;
    })
    .catch((err) => {
      alert("Unable to sign in");
    });
});
