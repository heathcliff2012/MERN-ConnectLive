import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

import { getFriendPosts, getExplorePosts, getPostComments, getUserProfileData } from '../controllers/post.controller.js';

router.use(protectRoute);

router.get('/friend-posts', getFriendPosts);
router.get('/user-profile-posts/:id', getUserProfileData);
router.get('/explore-posts', getExplorePosts);
router.get('/comments/:postId', getPostComments);
router.get('/', getExplorePosts);

export default router;