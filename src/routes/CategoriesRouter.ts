import { Router } from "express";
import { addCategory, deleteCategory, getCategories, updateCategory } from "../controllers/CategoriesController";
import { verifyAdmin } from "../middleware/AuthMiddleware";

const CategoriesRouter = Router();

CategoriesRouter.get('/', getCategories);
CategoriesRouter.post('/', verifyAdmin, addCategory);
CategoriesRouter.delete('/:id', verifyAdmin, deleteCategory);
CategoriesRouter.put('/:id', verifyAdmin, updateCategory);

export default CategoriesRouter;