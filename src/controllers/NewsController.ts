import type { Response, Request } from "express";
import { NewsModel } from "../models/NewsModel";

export const getNews = async (req: Request, res: Response) => {
    try{
        const allNews = await NewsModel.find();
        return res.json({data: allNews});
    }catch(e) {
        return res.status(500).json({message: "An error occurred while fetching news"});
    }
}

export const addNews = async (req: Request, res: Response) => {
    try{
        const news = await NewsModel.insertOne(req.body);
        return res.status(201).json({data: news});
    }catch(e) {
        return res.status(400).json({message: "An error occurred while adding news"});
    }
}

export const deleteNews = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await NewsModel.deleteOne({_id: id});
        return res.json();
    }catch(e) {
        return res.status(400).json({message: "An error occurred while deleting news"});
    }
}

export const updateNews = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await NewsModel.updateOne({_id: id}, {$set: req.body});
        return res.json();
    }catch(e) {
        return res.status(400).json();
    }
}