import { Router } from "express";
import { addMajor, deleteMajor, getMajors, updateMajor } from "../controllers/MajorController";
import { verifyAdmin } from "../middleware/AuthMiddleware";

const MajorsRouter = Router();

MajorsRouter.get('/', getMajors);
MajorsRouter.post('/', verifyAdmin , addMajor);
MajorsRouter.put('/:id', verifyAdmin, updateMajor);
MajorsRouter.delete('/:id', verifyAdmin, deleteMajor);

export default MajorsRouter;