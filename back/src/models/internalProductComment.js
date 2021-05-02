const mongoose = require("mongoose");

const internalProductCommentSchema = new mongoose.Schema(
  {
    forProduct: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

const internalProductComment = mongoose.model(
  "internalProductComment",
  internalProductCommentSchema
);

module.exports = internalProductComment;
