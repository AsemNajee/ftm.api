import express from 'express';
import { getProfile, updateProfile, followUser, getUserArticles, getMe, getUserFollowers, getUserFollowing, subscribe, getProfileById } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/profile/id/:id', getProfileById)
router.get('/profile/:username', getProfile)
router.post('/follow/:id', protect, followUser);
router.get('/:id/articles', getUserArticles);
router.get('/:id/followers', getUserFollowers);
router.get('/:id/following', getUserFollowing);
router.post('/subscribe', subscribe);

export default router;
