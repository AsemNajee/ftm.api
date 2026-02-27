import { Request, Response } from 'express';
import Comment from '../models/Comment';

export const createComment = async (req: any, res: Response) => {
  try {
    const { content, article, parent } = req.body;
    const comment = await Comment.create({
      content,
      author: req.user._id,
      article,
      parent,
    });
    res.status(201).json({ comment });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إضافة التعليق' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId }).populate('author');
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب التعليقات' });
  }
};

export const updateComment = async (req: any, res: Response) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ comment });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تحديث التعليق' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف التعليق' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في حذف التعليق' });
  }
};

export const likeComment = async (req: any, res: Response) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    res.json({ comment });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الإعجاب' });
  }
};
