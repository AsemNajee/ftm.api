import { Router } from "express";
import { addTeacher, deleteTeacher, getTeachers, updateTeacher } from "../controllers/TeacherController";
import { verifyAdmin } from "../middleware/AuthMiddleware";

const TeacherRouter = Router()

TeacherRouter.get('/', getTeachers);
TeacherRouter.post('/', verifyAdmin, addTeacher);
TeacherRouter.delete('/:id', verifyAdmin, deleteTeacher);
TeacherRouter.put('/:id', verifyAdmin, updateTeacher);

export default TeacherRouter;