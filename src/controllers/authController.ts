import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/hash';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'اسم المستخدم مستخدم بالفعل' });
    const hashed = await hashPassword(password);
    const user = await User.create({
      username,
      email,
      password: hashed,
      profile: {
        fullName: name,
      },
      stats: {
        articlesCount: 0,
        totalViews: 0,
        followers: 0,
      },
    });
    res.status(201).json({ message: 'تم التسجيل بنجاح'  });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التسجيل' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'بيانات الدخول غير صحيحة', user: user });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ token, user: user});
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل الدخول' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'تم تسجيل الخروج' });
};

export const getSession = async (req: any, res: Response) => {
  res.json({ user: req.user });
};
