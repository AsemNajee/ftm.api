import express from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory, getCategory } from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('admin', 'user'), createCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
