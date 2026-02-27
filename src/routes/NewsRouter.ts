import { Router } from "express";
import { getNews, addNews, deleteNews, updateNews } from "../controllers/NewsController";
import { verifyAdmin } from "../middleware/AuthMiddleware";

const NewsRouter = Router();

NewsRouter.get('/', getNews);
NewsRouter.post('/', verifyAdmin, addNews);
NewsRouter.delete('/:id', verifyAdmin, deleteNews);
NewsRouter.put('/:id', verifyAdmin, updateNews);

export default NewsRouter;