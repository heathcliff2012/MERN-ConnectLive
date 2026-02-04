import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // 1. Link to the User who created the post
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Must match the name of your User model
      required: true,
    },

    // 2. The textual content (optional if they just post an image)
    text: {
      type: String,
      trim: true, // Removes whitespace from ends
      default: "" // Default to empty string instead of null/undefined
    },

    // 3. Image/Video URL (stored in Cloudinary/S3/Firebase)
    image: {
      type: String, 
      default: "", // Default to empty string instead of null/undefined
    },

    body: {
      type: String,
      default: ""
    },

    // 4. Likes: Array of User IDs
    // This lets you easily check `likes.includes(currentUserId)`
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 5. Comments: Array of Sub-documents
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment", // Refers to the new model above
        },
    ],
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

const Post = mongoose.model("Post", postSchema);

export default Post;