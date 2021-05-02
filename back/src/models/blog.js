const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    backgroundImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sections: [
      {
        subTitle: {
          type: String,
          required: true,
        },
        paragraph: {
          type: String,
          required: true,
        },
        importantLine: {
          type: String,
          trim: true,
        },
        image: {
          type: String,
          required: true,
        },
        Num: Number,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // id: false,
  }
);

blogSchema.virtual("comment", {
  ref: "comment",
  localField: "_id",
  foreignField: "forPost",
});

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
