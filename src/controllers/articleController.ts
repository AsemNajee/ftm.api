import { Request, Response } from 'express';
import Article from '../models/Article';
import { uploadToCloudinary } from '../utils/upload';
import User from '../models/User';
import Category from '../models/Category';

const extractTextFromEditor = (node: any): string => {
  let text = "";
  if (!node) return text;

  if (node.text) text += node.text + " ";

  if (Array.isArray(node.content)) {
    node.content.forEach((child: any) => {
      text += extractTextFromEditor(child);
    });
  }

  return text;
};

export const createArticle = async (req: any, res: Response) => {
  try {
    const {
      title,
      excerpt,
      content, // JSON
      coverImage,
      category,
      categoryLabel,
      level,
      readTime,
      tags,
      techStack,
      status,
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "بيانات غير مكتملة" });
    }

    const contentText = extractTextFromEditor(content);

    const article = await Article.create({
      title,
      excerpt,
      content,
      contentText,
      coverImage,
      category,
      categoryLabel,
      level,
      readTime,
      tags,
      techStack,
      status: status || "draft",
      publishedAt: status === "published" ? new Date() : undefined,
      author: req.user._id,
      authorAvatar: req.user.avatar,
    });
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.articlesCount': 1 } }).exec();
    await Category.findByIdAndUpdate(category, { $inc: { articleCount: 1 } }).exec();

    res.status(201).json({ article });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في إنشاء المقال" });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .populate("author", "profile.fullName profile.avatar")
      .populate("category", "name");

    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب المقالات" });
  }
};

// بحث عام للمقالات: title, excerpt, categoryLabel, category.name, author.profile.fullName
export const searchArticles = async (req: Request, res: Response) => {
  try {
    const q = String(req.query.query || '').trim();
    if (!q) return res.status(400).json({ message: 'يرجى تقديم نص البحث في المتغير query=textToSearch' });

    const regex = { $regex: q, $options: 'i' };

    const searchTerm = 'بحث'; // النص المدخل

    const results = await Article.aggregate([
      { $match: { status: 'published' } },
      {
        $lookup: {
          from: 'users',
          let: { authorId: '$author' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },
            { $project: { 'profile.fullName': 1 } }
          ],
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'categories',
          let: { categoryId: '$category' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$categoryId'] } } },
            { $project: { name: 1 } }
          ],
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $match: {
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { excerpt: { $regex: searchTerm, $options: 'i' } },
            { 'category.name': { $regex: searchTerm, $options: 'i' } },
            { 'author.profile.fullName': { $regex: searchTerm, $options: 'i' } }
          ]
        }
      },
      { $sort: { publishedAt: -1 } },
      {
        $project: {
          content: 0,
          'author.__v': 0,
          'category.__v': 0
        }
      }
    ]).exec();

    res.json({ articles: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في البحث عن المقالات' });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "profile.fullName profile.avatar stats")
      .populate("category", "name");

    if (!article) {
      return res.status(404).json({ message: "المقال غير موجود" });
    }

    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب المقال" });
  }
};

export const updateArticle = async (req: any, res: Response) => {
  try {
    const updates: any = { ...req.body };

    if (updates.content) {
      updates.contentText = extractTextFromEditor(updates.content);
    }

    if (updates.status === "published") {
      updates.publishedAt = new Date();
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: "خطأ في تحديث المقال" });
  }
};


export const deleteArticle = async (req: any, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذا المقال' });
    }
    await Article.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.articlesCount': -1 } }).exec();
    await Category.findByIdAndUpdate(req.body.category, { $inc: { articleCount: -1 } }).exec();
    res.json({ message: 'تم حذف المقال' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في حذف المقال' });
  }
};

export const likeArticle = async (req: any, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "المقال غير موجود" });

    const userId = req.user._id.toString(); // 👈 stringify ObjectId

    // إذا المستخدم موجود مسبقاً في likes → نزيله، وإلا نضيفه
    if (article.likes.map(id => id.toString()).includes(userId)) {
      article.likes = article.likes.filter(id => id.toString() !== userId);
    } else {
      article.likes.push(req.user._id);
    }

    await article.save();

    res.json({
      likesCount: article.likes.length,
      likedByUser: article.likes.map(id => id.toString()).includes(userId)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الإعجاب" });
  }
};

export const bookmarkArticle = async (req: any, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "المقال غير موجود" });

    const userId = req.user._id.toString();

    if (article.bookmarks.map(id => id.toString()).includes(userId)) {
      article.bookmarks = article.bookmarks.filter(id => id.toString() !== userId);
    } else {
      article.bookmarks.push(req.user._id);
    }

    await article.save();

    res.json({
      bookmarksCount: article.bookmarks.length,
      bookmarkedByUser: article.bookmarks.map(id => id.toString()).includes(userId)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الحفظ بالمفضلة" });
  }
};


export const uploadArticleImage = async (req: any, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'لم يتم رفع صورة' });
    const result = await uploadToCloudinary(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في رفع الصورة' });
  }
};
