import express from 'express';
import { createComment, getComments, updateComment, deleteComment, likeComment } from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createComment);
router.get('/:articleId', getComments);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, likeComment);

export default router;
