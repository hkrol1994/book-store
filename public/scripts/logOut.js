const logOutBtn = document.getElementById("log-out-btn");
const token = localStorage.getItem("token");
const adminToken = localStorage.getItem("adminToken");

export const logOut = () => {
  logOutBtn.addEventListener("click", () => {
    if (token) {
      fetch("http://localhost:3000/users/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            localStorage.removeItem("token");
            window.location.href = "http://localhost:3000/index.html";
          } else {
            console.log(res);
            throw new Error(res.status);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (adminToken) {
      fetch("http://localhost:3000/admin/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            localStorage.removeItem("adminToken");
            window.location.href = "http://localhost:3000/index.html";
          } else {
            console.log(res);
            throw new Error(res.status);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
