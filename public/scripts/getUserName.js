const logIn = document.getElementById("log-in-a");
const userName = document.getElementById("user-name");
const logOutBtn = document.getElementById("log-out-btn");
const adminBtn = document.getElementById("admin-a");
const token = localStorage.getItem("token");
const adminToken = localStorage.getItem("adminToken");

export const getUserName = () => {
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
          throw new Error(res.status);
        }
      })
      .then((resObj) => {
        logIn.classList.add("none");
        logOutBtn.classList.remove("none");
        userName.innerHTML = resObj.name;
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (adminToken) {
    fetch("http://localhost:3000/admin/get", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
      .then((resObj) => {
        logIn.classList.add("none");
        logOutBtn.classList.remove("none");
        userName.innerHTML = resObj.name;
        adminBtn.classList.remove("none");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
