import { Request, Response } from 'express';
import Category from '../models/Category';
import Article from '../models/Article';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon, color, description, parent } = req.body;
    if (!name || !icon || !color || !description) {
      return res.status(400).json({ message: 'جميع الحقول المطلوبة يجب أن تكون موجودة', body: req.body });
    }
    const category = await Category.create({
      name,
      icon,
      color,
      description,
      parent: parent === "" ? undefined : parent,
    });
    if (!category) {
      return res.status(400).json({ message: 'خطأ في إنشاء التصنيف' });
    }
    return res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إنشاء التصنيف' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب التصنيفات' });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'التصنيف غير موجود' });
    }
    const articles = await Article.find({category: req.params.id}).populate('author', 'profile.fullName profile.avatar');
    if (!articles || articles.length === 0) {
      return res.status(200).json({ message: 'لا توجد مقالات في هذا التصنيف', articles: [], category });
    }
    res.json({ articles, category });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب التصنيف' });
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تحديث التصنيف' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف التصنيف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في حذف التصنيف' });
  }
};
