import type { Request, Response } from "express";
import { InfoModel } from "../models/InfoModel";
import type { RequestListener } from "node:http";
import TeacherModel from "../models/TeacherModel";
import { CategoryModel } from "../models/CategoryModel";
import { MajorModel } from "../models/MajorModel";

export const getInfo = async (req: Request, res: Response) => {
  try {
    const info = await InfoModel.findOne();
    if (info) {
      return res.json({ data: info });
    }
    return res.json({ error: "no data found" });
  } catch (e) {
    return res.status(500).json({ error: "An error occurred while fetching the institute info" });
  }
};

// set seen and message for the institute
export const setInfo = async (req: Request, res: Response) => {
  try {
    await InfoModel.updateOne(
      { id: 1 },
      { $set: { seen: req.body?.seen, message: req.body?.message } },
    );
    return res.json({ data: "info has updated successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "حصل خطا اثنا محاولة تحديث رؤية المعهد" });
  }
};

export const setSeen = async (req: Request, res: Response) => {
  try {
    await InfoModel.updateOne({ id: 1 }, { $set: { seen: req.body?.seen } });
    return res.json({ data: "seen has updated successfully" });
  } catch (e) {
    return res.json({ error: "حصل خطا اثنا محاولة تحديث رؤية المعهد" });
  }
};

export const setMessage = async (req: Request, res: Response) => {
  try {
    await InfoModel.updateOne(
      { id: 1 },
      { $set: { message: req.body?.message } },
    );
    return res.json({ data: "message has updated successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "حصل خطا اثنا محاولة تحديث رؤية المعهد" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const teachers = await TeacherModel.estimatedDocumentCount();
    const categories = await CategoryModel.estimatedDocumentCount();
    const majors = await MajorModel.estimatedDocumentCount();
    return res.json({
      data: {
        teachers,
        categories,
        majors,
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ data: { teachers: 0, categories: 0, majors: 0 } });
  }
};
