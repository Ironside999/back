const mongoose = require("mongoose");

const productTitleSchema = new mongoose.Schema(
  {
    productTitle: {
      type: String,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

productTitleSchema.virtual("type").get(function () {
  return this.productTitle;
});
const ProductTitle = mongoose.model("productTitle", productTitleSchema);

module.exports = ProductTitle;
