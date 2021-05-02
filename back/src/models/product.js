const mongoose = require("mongoose");
const internalProductComment = require("./internalProductComment");

const productSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["raw", "product"],
    },
    category: {
      type: String,
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    measureUnit: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
      required: true,
    },
    imported: {
      type: String,
      required: true,
      enum: ["0", "1"],
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 1,
    },
    price: {
      type: Number,
      default: 0,
      select: false,
    },
    discountPrice: {
      type: Number,
      default: 0,
      select: false,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: [String],
    inStock: {
      type: String,
      required: true,
      enum: ["0", "1"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("comment", {
  ref: "internalProductComment",
  localField: "_id",
  foreignField: "forProduct",
});

productSchema.pre("remove", async function (next) {
  await internalProductComment.deleteMany({ forProduct: this._id });
  next();
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
