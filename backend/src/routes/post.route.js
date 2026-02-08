import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

import { getFriendPosts, getExplorePosts, getPostComments, getUserProfileData, deletePost, deleteComment } from '../controllers/post.controller.js';

router.use(protectRoute);

router.get('/friend-posts', getFriendPosts);
router.get('/user-profile-posts/:id', getUserProfileData);
router.get('/explore-posts', getExplorePosts);
router.get('/comments/:postId', getPostComments);
router.get('/', getExplorePosts);
router.post('/delete-post/:id',deletePost);
router.post('/delete-comment/:postId/:commentId',deleteComment);

export default router;