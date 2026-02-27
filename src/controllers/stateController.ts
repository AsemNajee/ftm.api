import { Request, Response } from 'express';
import Article from '../models/Article';
import User from '../models/User';

export const getState = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({}, 'views author');
    const totalArticles = articles.length;
    const totalViews = articles.reduce((acc, art) => acc + (art.views || 0), 0);
    // المؤلفون الفريدون فقط
    const authorIds = new Set(articles.map(a => a.author.toString()));
    const totalAuthors = authorIds.size;
    res.json({ totalViews, totalArticles, totalAuthors });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب الإحصائيات' });
  }
};
