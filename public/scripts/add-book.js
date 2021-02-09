import { logOut } from "./logOut.js";
import { getUserName } from "./getUserName.js";

const id = location.search.replace("?id=", "");
const submitBtn = document.getElementById("submit");
const headLine = document.getElementById("head-line");
const form = document.getElementById("form");
const token = localStorage.getItem("token");

const getData = () => {
  const data = {};
  data.name = form.children[1].value || "unknown";
  data.imgSrc = form.children[3].value || "unknown";
  data.format = form.children[5].value || "unknown";
  data.author = form.children[7].value || "unknown";
  data.language = form.children[9].value || "unknown";
  data.price = form.children[11].value || 0;
  data.pages = form.children[13].value || 0;
  data.width = form.children[15].value || 0;
  data.height = form.children[17].value || 0;
  data.weight = form.children[19].value || 0;
  data.publicationDate =
    form.children[21].value === ""
      ? new Date().toISOString()
      : new Date(form.children[21].value).toISOString();

  data.publisher = form.children[23].value || "unknown";
  data.publicationCity = form.children[25].value || "";
  data.publicationCountry = form.children[27].value || "unknown";
  data.ISBN10 = form.children[29].value || "unknown";
  data.ISBN13 = form.children[31].value || "unknown";
  data.bestsellersRank = form.children[33].value || 0;
  data.description1 = form.children[37].value || "unknown";
  data.description2 = form.children[39].value || "unknown";
  return data;
};

const renderData = (data) => {
  form.children[1].value = data.name;
  form.children[3].value = data.imgSrc;
  form.children[5].value = data.format;
  form.children[7].value = data.author;
  form.children[9].value = data.language;
  form.children[11].value = data.price;
  form.children[13].value = data.pages;
  form.children[15].value = data.width;
  form.children[17].value = data.height;
  form.children[19].value = data.weight;
  const d = new Date(data.publicationDate);
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  form.children[21].value = `${ye}-${mo}-${da}`;
  form.children[23].value = data.publisher;
  form.children[25].value = data.publicationCity;
  form.children[27].value = data.publicationCountry;
  form.children[29].value = data.ISBN10;
  form.children[31].value = data.ISBN13;
  form.children[33].value = data.bestsellersRank;
  form.children[37].value = data.description1;
  form.children[39].value = data.description2;
};

logOut();
getUserName();

//במידה ויש איידי צריך להביא את הנתונים לעדכון
if (id) {
  submitBtn.innerHTML = "Edit book";
  headLine.innerHTML = "Edit book";
  fetch(`http://localhost:3000/books/get?id=${id}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    })
    .then((jsonObj) => {
      renderData(jsonObj);
    })
    .catch((err) => {
      console.log(err);
    });
}

//לחיצה על שליחה
//במידה ויש איידי צריך לשלוח עדכון במידה ולא צריך לשלוח ספר חדש
submitBtn.addEventListener("click", () => {
  if (id) {
    fetch(`http://localhost:3000/books/edit?id=${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getData()),
    })
      .then((res) => {
        if (res.ok) {
          window.location.href = "http://localhost:3000/pages/admin.html";
        } else {
          console.log(res);
          throw new Error(res.status);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    fetch("http://localhost:3000/books/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getData()),
    })
      .then((res) => {
        if (res.ok) {
          window.location.href = "http://localhost:3000/pages/admin.html";
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

setInterval(() => {
  console.log();
}, 1000);
