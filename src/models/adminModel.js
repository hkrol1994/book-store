const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email!!!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

adminSchema.statics.findUserByEmailEndPassword = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error("unable to login");
  }
  const isPassMatch = await bcrypt.compare(password, admin.password);
  if (!isPassMatch) {
    throw new Error("unable to login");
  }

  return admin;
};

adminSchema.methods.generateAuthToken = async function () {
  const admin = this;
  const token = jwt.sign(
    {
      _id: admin.id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "6h",
    }
  );
  admin.tokens = admin.tokens.concat({ token });
  await admin.save();
  return token;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
