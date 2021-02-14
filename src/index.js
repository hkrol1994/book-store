const express = require("express");
const cors = require("cors");
const path = require("path");

const publicDirectoryPath = path.join(__dirname, "../public");
require("./db/mongoose");
const bookRouter = require("./routers/bookRouter");
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");

const port = process.env.PORT;
const app = express();

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(cors());
app.use(bookRouter);
app.use(userRouter);
app.use(adminRouter);

app.listen(port, () => {
  console.log('Server conected, port:"', port);
});
