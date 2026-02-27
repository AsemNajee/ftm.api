import type { Request, Response } from "express";
import { MajorModel } from "../models/MajorModel";

export const getMajors = async (req: Request, res: Response) => {
    try{
        const majors = await MajorModel.find().populate('category');;
        return res.json({data: majors});
    }catch(e){
        return res.status(500).json({error: "An error occurred while fetching majors"});
    }
}

export const addMajor = async (req: Request, res: Response) => {
    try{
        const major = await (await MajorModel.insertOne(req.body)).populate('category')
        return res.status(201).json({data: major});
    }catch(e){
        return res.status(500).json({error: "An error occurred while adding the major"});
    }
}

// Delete major by id
export const deleteMajor = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await MajorModel.deleteOne({_id: id});
        return res.json();
    }catch(e){
        return res.status(500).json({error: "An error occurred while deleting the major"});
    }
}

// Update major by id
export const updateMajor = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await MajorModel.updateOne({_id: id}, {$set: req.body});
        return res.json();
    }catch(e){
        return res.status(500).json({error: "An error occurred while updating the major"});
    }
}