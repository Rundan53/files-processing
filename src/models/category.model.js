const { Schema, model } = require("mongoose");
const { isLowercase } = require("validator");

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
    },

    // might need changes
    categoryType: {
      type: String,
      enum: ["LOGO", "TEMPLATE"],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

categorySchema.index({ categoryType: 1, categoryName: 1 }, { unique: true });

// Set the `toJSON` and `toObject` transformation options
categorySchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    if (ret.categoryName) {
      ret.categoryName =
        ret.categoryName.charAt(0).toUpperCase() + ret.categoryName.slice(1);
    }
    return ret;
  },
});

categorySchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    if (ret.categoryName) {
      ret.categoryName =
        ret.categoryName.charAt(0).toUpperCase() + ret.categoryName.slice(1);
    }
    return ret;
  },
});

const Category = model("Category", categorySchema);
Category.ensureIndexes();

module.exports = Category;
