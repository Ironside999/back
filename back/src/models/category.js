const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Type",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);
categorySchema.virtual("children", {
  ref: "ProductTitle",
  localField: "_id",
  foreignField: "parentId",
});

categorySchema.virtual("type").get(function () {
  return this.category;
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
