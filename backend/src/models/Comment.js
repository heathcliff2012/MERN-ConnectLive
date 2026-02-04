import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // 1. The Comment Content
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },

    // 2. Who wrote the comment?
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 3. Which post does this belong to?
    // CRITICAL: This allows you to find all comments for a specific post easily
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // 4. (Optional) Comment Likes
    // Just like posts, comments can have their own likes array
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;