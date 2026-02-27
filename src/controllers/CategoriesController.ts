import type { Response, Request } from "express";
import { CategoryModel } from "../models/CategoryModel";

export const getCategories = async (req: Request, res: Response) => {
    try{
        const allCategories = await CategoryModel.find().populate('majors');
        return res.json({data: allCategories});
    }catch(e) {
        return res.status(500).json({message: "An error occurred while fetching categories"});
    }
}

export const addCategory = async (req: Request, res: Response) => {
    try{
        const category = await CategoryModel.insertOne(req.body);
        return res.status(201).json({data: category});
    }catch(e) {
        return res.status(400).json();
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await CategoryModel.deleteOne({_id: id});
        return res.json();
    }catch(e) {
        return res.status(400).json();
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await CategoryModel.updateOne({_id: id}, {$set: req.body});
        return res.json();
    }catch(e) {
        return res.status(400).json();
    }
}