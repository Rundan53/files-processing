const { Schema, model } = require("mongoose");
const validator = require("validator");

const PostSchema = new Schema({
  postURL: {
    type: String,
    validate: [validator.isURL, "URL is missing"],
    reqiured: true,
  },

  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Poster's name is missing"],
  },

  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: [true, "Client Id is required"],
  },

  //might need changes
  postedOn: [
    {
      type: String,
      enum: ["FACEBOOK", "INSTAGRAM", "GOOGLE"],
    },
  ],
});

const Post = model("Post", PostSchema);
module.exports = Post;
