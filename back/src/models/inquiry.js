const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    Inquirer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // companyInquirer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "Company",
    // },
    product: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["fulfilled", "pending", "rejected"],
      default: "pending",
    },
    price: Number,
    expiresIn: Date,
    code: {
      type: String,
      unique: true,
    },
    callNumber: Number,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Inquiry = mongoose.model("inquiry", inquirySchema);

module.exports = Inquiry;
