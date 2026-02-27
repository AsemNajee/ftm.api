import { Request, Response } from 'express';
import User from '../models/User';
import Article from '../models/Article';

export const getMe = async (req: any, res: Response) => {
  res.json({ user: req.user });
};

export const getProfile = async (req: Request, res: Response) => {
  const username = req.params.username;
  const user = await User.findOne({ username }).populate('profile').populate('stats');

  if(!user) {
    const userById = await User.findById(username).populate('profile').populate('stats');
    if(!userById) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    return res.json({ user: userById });
  }
  res.json({ user });
}

export const getProfileById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate('profile').populate('stats');

  if(!user) {
    return res.status(404).json({ message: 'المستخدم غير موجود' });
  }
  res.json({ user });
}

export const updateProfile = async (req: any, res: Response) => {
  const { username, profile: { bio, avatar, github, twitter, linkedin, fullName }} = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { username, profile: { bio, avatar, github, twitter, linkedin, fullName } }, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تحديث البيانات' });
  }
};

export const followUser = async (req: any, res: Response) => {
  const userId = req.user._id;
  const followId = req.params.id;
  if (userId === followId) return res.status(400).json({ message: 'لا يمكنك متابعة نفسك' });
  try {
    await User.findByIdAndUpdate(userId, { $addToSet: { following: followId } });
    await User.findByIdAndUpdate(followId, { $addToSet: { followers: userId } });
    res.json({ message: 'تمت المتابعة' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في المتابعة' });
  }
};

export const getUserFollowers = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'username profile.fullName profile.avatar');
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    res.json({ followers: user.followers });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب المتابعين' });
  }
}

export const getUserFollowing = async (req: Request, res: Response) => {  
  try {
    const user = await User.findById(req.params.id).populate('following', 'username profile.fullName profile.avatar');
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    res.json({ following: user.following });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب المتابعين' });
  }
}

export const getUserArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({ author: req.params.id });
    if (!articles || articles.length === 0) {
      return res.status(200).json({ message: 'لا توجد مقالات لهذا المستخدم', articles: [] });
    }
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب المقالات' });
  }
};


/**
 * subscribe in news letter
 * @param req 
 * @param res 
 */
export const subscribe = async (req: any, res: Response) => {
  const email = req.body.email;
  const mailerLiteApiKey = process.env.MAILERLITE;
  if (!mailerLiteApiKey) {
    return res.status(500).json({ message: 'MailerLite API key is not configured' });
  }

  try {
    const response = await fetch('https://api.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': mailerLiteApiKey
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(400).json({ message: 'خطأ في الاشتراك', error: errorData });
    }

    res.json({ message: 'تم الاشتراك بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الاشتراك' });
  }
};