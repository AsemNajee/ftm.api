import type { Request, Response } from "express";
import TeacherModel from "../models/TeacherModel";

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await TeacherModel.find();
    return res.json({data: teachers});
  } catch (e) {
    return res.status(500).json({error: "An error occurred while fetching teachers"});
  }
};

export const addTeacher = async (req: Request, res: Response) => {
    // const { name, role } = req.body;
    try{
        const teacher = await TeacherModel.insertOne(req.body);
        return res.json({data: teacher});
    }catch(e){
        return res.status(400).json({error: "An error occurred while adding the teacher"});
    }
}

export const deleteTeacher = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await TeacherModel.deleteOne({_id: id});
        return res.json();
    }catch(e){
        return res.status(400).json({error: "An error occurred while deleting the teacher"});
    }
}

export const updateTeacher = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const teacher = await TeacherModel.updateOne({_id: id}, {$set: req.body});
        return res.json({data: teacher});
    }catch(e){
        return res.status(400).json({error: "An error occurred while updating the teacher"});
    }
} 