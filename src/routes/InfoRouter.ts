import { Router } from "express";
import { getInfo, getStats, setInfo, setMessage, setSeen} from "../controllers/InfoController";
import { verifyAdmin } from "../middleware/AuthMiddleware";

const InfoRouter = Router()

InfoRouter.get('/', getInfo);
InfoRouter.post('/', verifyAdmin, setInfo);
InfoRouter.post('/seen', verifyAdmin, setSeen);
InfoRouter.post('/message', verifyAdmin, setMessage);
InfoRouter.get('/stats', verifyAdmin, getStats)

export default InfoRouter;