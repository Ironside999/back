const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(val) {
        if (val.toLowerCase().includes("password")) {
          throw new Error("wrong pass");
        }
      },
    },
    passwordC: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(val) {
        if (val === this.password) {
          throw new Error("wrong pass");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.statics.findByCredentials = async (
  username,
  password,
  passwordC
) => {
  const user = await Admin.findOne({ username });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  const isMatchC = await bcrypt.compare(passwordC, user.passwordC);

  if (!isMatch || !isMatchC) {
    throw new Error("Unable to login");
  }

  return user;
};

adminSchema.methods.generateAuthToken = async function () {
  // Reminder: move secret and expire to config.env
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.ADMIN_SECRET,
    {
      expiresIn: "12h",
    }
  );
  return token;
};

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordC = await bcrypt.hash(this.passwordC, 10);

  next();
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
