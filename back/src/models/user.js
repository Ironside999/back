const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateRandomCode = require("../utils/randomCode");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: "User",
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("wrong email");
        }
      },
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(val) {
        if (val.toLowerCase().includes("password")) {
          throw new Error("wrong pass");
        }
      },
    },

    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },

    // ownCompany: {
    //   type: String,
    //   required: true,
    //   enum: ["none", "pending", "own"],
    //   default: "none",
    // },

    photo: {
      type: String,
      default: "photo",
    },

    isRestricted: {
      type: Boolean,
      default: false,
      required: true,
    },

    tCodeExp: Number,
    temporaryCode: String,

    passwordResetToken: String,
    passwordResetExp: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// userSchema.virtual("myCompany", {
//   ref: "Company",
//   localField: "_id",
//   foreignField: "owner",
//   justOne: true,
// });

userSchema.virtual("myInquiries", {
  ref: "Inquiry",
  localField: "_id",
  foreignField: "Inquirer",
});

userSchema.virtual("timeLeft").get(function () {
  return this.tCodeExp ? this.tCodeExp - Date.now() : undefined;
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  // Reminder: move secret to env file
  const token = await jwt.sign(
    { _id: this._id.toString() },
    process.env.USER_SECRET,
    {
      expiresIn: "1 days",
    }
  );

  return token;
};

userSchema.methods.isTempCodeMatch = function (any) {
  const code = this.temporaryCode === any;
  const exp = this.tCodeExp > Date.now();

  return code && exp ? true : false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = await generateRandomCode(32);

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExp = Date.now() + 900000;

  return resetToken;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.temporaryCode;
  delete userObject.passwordResetToken;

  return userObject;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
