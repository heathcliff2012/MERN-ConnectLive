import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import cloudinary from "../lib/cloudinary.js";

import FriendRequest from '../models/FriendRequest.js';

export async function getRecomendedUsers(req, res) {

    try{
        const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
    }catch(error){
        console.error("Get recommended users error:", error);
        res.status(500).json({ message: "Server error while fetching recommended users." });
    }
}

export async function getMyFriends(req, res) {

    try{
        const user = await User.findById(req.user._id)
        .populate('friends','fullName profilePic location');

        res.status(200).json(user.friends);
    }catch(error){
        console.error("Get my friends error:", error);
        res.status(500).json({ message: "Server error while fetching friends." });
    }
}

export async function sendFriendRequest(req, res) {
    try{
        const myId = req.user._id;
        const {id: recipientId} = req.params;

        if(myId.toString() === recipientId){
            return  res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({ message: "Recipient user not found." });
        }

        if(recipient.friends.includes(myId)){
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if (existingRequest) {
            if (existingRequest.status === 'accepted') {
                return res.status(400).json({ message: "You are already friends." });
            }
            
            if (existingRequest.status === 'pending') {
                return res.status(400).json({ message: "A friend request is already pending." });
            }

            if (existingRequest.status === 'declined') {
                 await FriendRequest.findByIdAndDelete(existingRequest._id);
            }
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });

        res.status(201).json(friendRequest);
    }catch(error){
        console.error("Send friend request error:", error);
        res.status(500).json({ message: "Server error while sending friend request." });
    }
}

export async function acceptFriendRequest(req, res) {

    try{
        const {id: requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({ message: "Friend request accepted." });
    }catch(error){
        console.error("Accept friend request error:", error);
        res.status(500).json({ message: "Server error while accepting friend request." });
    }
}

export async function declineFriendRequest(req, res) {

    try{
        const {id: requestId} = req.params;
        const friendRequest = await FriendRequest.findByIdAndUpdate(requestId);
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to decline this request" });
        }
        friendRequest.status = 'declined';
        await friendRequest.save();
        res.status(200).json({ message: "Friend request declined." });
    }catch(error){
        console.error("Decline friend request error:", error);
        res.status(500).json({ message: "Server error while declining friend request." });
    }
}

export async function getFriendRequest(req, res) {
    try{
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: 'pending'
        }).populate('sender', 'fullName profilePic location');

        const acceptReqs = await FriendRequest.find({
            sender: req.user._id,
            status: 'accepted'
        }).populate('recipient', 'fullName profilePic location');

        res.status(200).json({ incomingRequests, acceptReqs });
    }catch(error){
        console.error("Get friend requests error:", error);
        res.status(500).json({ message: "Server error while fetching friend requests." });
    }
}

export async function getOutgoingFriendRequest(req, res) {
    try{
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: 'pending'
        }).populate('recipient', 'fullName profilePic');

        res.status(200).json(outgoingRequests);
    }catch(error){
        console.error("Get outgoing friend requests error:", error);
        res.status(500).json({ message: "Server error while fetching outgoing friend requests." });
    }
}

export async function getUserProfile(req, res) {
    try {
        const userId = req.user._id;

        // 1. Get the User
        const user = await User.findById(userId).select('-password').lean();
        if (!user) return res.status(404).json({ message: "User not found." });

        // 2. Get the User's Posts
        const posts = await Post.find({ user: userId }).lean();

        // 3. EXTRACT POST IDs
        // We need a list of ID strings: ['postID1', 'postID2', ...]

        // 4. FIND COMMENTS ON THOSE POSTS
        // "Find comments where the 'post' field is IN our list of postIds"

        // 5. Attach data
        user.posts = posts; 
        user.postsCount = posts.length;

        res.status(200).json(user);

    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ message: "Server error." });
    }
}

export const addPost = async (req, res) => {
    try {
        const { text, body } = req.body;
        let imageUrl = "";

        // CHECK 1: Did the user upload a file?
        if (req.file) {
            // 1. Convert Buffer to Base64 (Standard for memory storage)
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

            // 2. Upload to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(dataURI);
            
            // 3. Save the specific Cloudinary URL
            imageUrl = uploadResponse.secure_url;
        }

        // Optional: Validation to prevent empty posts
        if (!text && !imageUrl && !body) {
             return res.status(400).json({ message: "Post must have text or an image" });
        }

        const newPost = new Post({
            user: req.user._id,
            text,
            body,
            image: imageUrl // Stores the URL string
        });

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.error("Error in addPost controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function likePost(req, res) {
    try {
        const userId = req.user._id;
        const { id, postId } = req.params;
        const targetPostId = id || postId;
        const post = await Post.findById(targetPostId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "You have already liked this post." });
        }
        post.likes.push(userId);
        await post.save();
        res.status(200).json({ message: "Post liked successfully." });
    } catch (error) {
        console.error("Like post error:", error);
        res.status(500).json({ message: "Server error while liking post." });
    }
}

export async function addComment(req, res) {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const newComment = await Comment.create({
      user: userId,
      post: postId,
        text
    });
    console.log("New comment created:", newComment);
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error while adding comment." });
  }
}

export async function getComments(req, res) {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate('user', 'fullName profilePic')
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Server error while fetching comments." });
  }
}

export async function addLikeToComment(req, res) {
  try {
    const userId = req.user._id;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    if (comment.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this comment." });
    }
    comment.likes.push(userId);
    await comment.save();
    res.status(200).json({ message: "Comment liked successfully." });
  } catch (error) {
    console.error("Like comment error:", error);
    res.status(500).json({ message: "Server error while liking comment." });
  }
}

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    // Assuming your auth middleware populates req.user
    const currentUserId = req.user._id; 

    if (!query) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const users = await User.find({
      // 1. Exclude the current user
      _id: { $ne: currentUserId },
      // 2. Search by name (case-insensitive) OR email if you want
      $or: [
        { fullName: { $regex: query, $options: "i" } }
      ]
    }).select("-password");

    res.status(200).json(users);

  } catch (error) {
    console.log("Error in searchUsers: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
