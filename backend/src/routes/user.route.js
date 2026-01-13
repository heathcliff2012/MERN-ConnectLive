import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecomendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequest, getOutgoingFriendRequest } from '../controllers/user.controller.js';


const router = express.Router();

router.use(protectRoute);

router.get("/", getRecomendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-request/", getFriendRequest);
router.get("/outgoing-friend-request/", getOutgoingFriendRequest);



export default router;