import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export async function getFriendPosts(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);

        // 1. Get friends' IDs
        const friendsIds = currentUser.friends;
        // 2. Find posts by friends
        const friendPosts = await Post.find({ user: { $in: friendsIds } })
            .sort({ createdAt: -1 }) // Newest posts first
            .populate('user', 'fullName profilePic') // Show who posted
            .lean();
        res.json(friendPosts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get friend posts', error });
    }
}

export async function getUserProfileData(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .lean();
        
        user.posts = await Post.find({ user: id })
            .sort({ createdAt: -1 })
            .populate('user', 'fullName profilePic')
            .lean();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user profile data', error });
    }
}

export async function getExplorePosts(req, res) {
    try {
        const currentUserId = req.user._id;

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // 2. Fetch the current user to get their 'friends' or 'following' list
        // We use .select('friends') to only fetch that specific field for speed
        const currentUser = await User.findById(currentUserId).select('friends');

        // 3. Create a list of IDs to EXCLUDE
        // This includes: Your friends' IDs + Your own ID
        const excludedIds = [...currentUser.friends, currentUserId];

        // 4. Query posts where 'user' is NOT IN ($nin) the excluded list
        const explorePosts = await Post.find({ 
                user: { $nin: excludedIds },
                createdAt: { $gte: oneWeekAgo } // Only posts from the last week

            })
            .sort({ createdAt: -1 })
            .populate('user', 'fullName profilePic')
            .lean();

        res.json(explorePosts);

    } catch (error) {
        console.error("Error in getExplorePosts:", error);
        res.status(500).json({ message: 'Failed to get explore posts', error });
    }
}

export async function getPostComments(req, res){
    try{
        const {postId} = req.params;
        const comments = Post.findById(postId)
            .sort({createdAt: -1})
            .populate('user', 'fullName profilePic')
            .lean();
        res.json(comments);
    }catch(error){
        console.log("Error in fetching comments " + error);
        throw error;
    }
}

export async function deletePost(req, res){
    try{
        const {id} = req.params;
        const currentUserId = req.user._id;
        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        if(post.user.toString() !== currentUserId.toString()){
            return res.status(403).json({message: "Unauthorized to delete this post"});
        }
        await Post.findByIdAndDelete(id);
        res.json({message: "Post deleted successfully"});
    }catch(error){
        console.log("Error in deleting post " + error);
        res.status(500).json({message: "Failed to delete post", error});
    }
}

export async function deleteComment(req, res){
    try{
        const {postId, commentId} = req.params;
        const currentUserId = req.user._id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
        if(comment.user.toString() !== currentUserId.toString()){
            return res.status(403).json({message: "Unauthorized to delete this comment"});
        }
        await Comment.findByIdAndDelete(commentId);
        res.json({message: "Comment deleted successfully"});
    }catch(error){
        console.log("Error in deleting comment " + error);
        res.status(500).json({message: "Failed to delete comment", error});
    }
}
