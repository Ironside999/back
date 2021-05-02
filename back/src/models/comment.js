const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    forPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    comment: [
      { type: mongoose.Schema.Types.ObjectId, ref: "comment", default: [] },
    ],
  },
  {
    timestamps: true,
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "comment",
  });

  next();
});

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;
