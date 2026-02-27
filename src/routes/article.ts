import express from 'express';
import { createArticle, getArticles, getArticle, updateArticle, deleteArticle, likeArticle, bookmarkArticle, uploadArticleImage, searchArticles } from '../controllers/articleController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../utils/upload';

const router = express.Router();

// all routes starts with /articles
router.post('/', protect, authorize('author', 'admin'), createArticle);
router.get('/', getArticles);
// بحث: /articles/search?textToSearch=...
router.get('/search', searchArticles);
router.get('/:id', getArticle);
router.put('/:id', protect, authorize('author', 'admin'), updateArticle);
router.delete('/:id', protect, authorize('author', 'admin'), deleteArticle);
router.post('/:id/like', protect, likeArticle);
router.post('/:id/bookmark', protect, bookmarkArticle);
router.post('/upload', protect, upload.single('image'), uploadArticleImage);

export default router;
