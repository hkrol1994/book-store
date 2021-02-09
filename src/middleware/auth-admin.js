const jwt = require("jsonwebtoken");
const Admin = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await Admin.findOne({
      _id: data._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    next();
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "not authenticate",
    });
  }
};

module.exports = authAdmin;
