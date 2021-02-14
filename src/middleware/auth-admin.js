const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const authAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const admin = await Admin.findOne({
      _id: data._id,
      "tokens.token": token,
    });

    if (!admin) {
      throw new Error();
    }
    req.admin = admin;
    req.token = token;
    next();
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "not authenticate",
    });
  }
};

module.exports = authAdmin;
