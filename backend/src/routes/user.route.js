import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';
import { 
        getRecomendedUsers,
        getMyFriends,
        sendFriendRequest,
        acceptFriendRequest,
        getFriendRequest,
        getOutgoingFriendRequest,
        getUserProfile, 
        declineFriendRequest, 
        searchUsers, 
        addPost, 
        likePost, 
        addComment, 
        getComments, 
        addLikeToComment
    } 
        from '../controllers/user.controller.js';


const router = express.Router();

router.use(protectRoute);

router.get("/", getRecomendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/decline", declineFriendRequest);
router.get("/friend-request/", getFriendRequest);
router.get("/outgoing-friend-request/", getOutgoingFriendRequest);

router.get("/user-profile",getUserProfile);
router.post("/user-profile/add-post",upload.single("image"), addPost);
router.post("/user-profile/like-post/:postId", likePost);
router.post("/user-profile/comment/:postId", addComment);
router.get("/user-profile/comment/:postId", getComments);
router.post("/user-profile/comment/:postId/:commentId", addLikeToComment);

router.get("/search", searchUsers);



export default router;