const mongoose = require("mongoose");
const typeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["raw", "product"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

typeSchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentId",
});

const Type = mongoose.model("type", typeSchema);

module.exports = Type;
