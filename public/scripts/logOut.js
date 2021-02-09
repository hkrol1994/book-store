const logOutBtn = document.getElementById("log-out-btn");
const token = localStorage.getItem("token");

export const logOut = () => {
  logOutBtn.addEventListener("click", () => {
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
  });
};
