import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db'; // Importing the database connection

// اتصال قاعدة البيانات
connectDB(); // Establishing the database connection

import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';


import MajorsRouter from './routes/MajorsRouter';
import CategoriesRouter from './routes/CategoriesRouter';
import TeacherRouter from './routes/TeacherRouter';
import NewsRouter from './routes/NewsRouter';
import InfoRouter from './routes/InfoRouter';
import { ADMIN_PASSWORD, ADMIN_USERNAME } from './env/env';
import { createToken } from './middleware/AuthMiddleware';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:8000',
    'https://techcode.buzog.com',
    'https://ftm-frontend-jade.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));
// app.use(cors({ origin: true }));
//app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use("/majors", MajorsRouter);
app.use("/categories", CategoriesRouter);
app.use("/teachers", TeacherRouter);
app.use("/news", NewsRouter);
app.use("/info", InfoRouter);

app.post("/login", (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (username !== ADMIN_USERNAME) {
      return res.status(403).json({message: "Username or password is incorrect"});
    }
    if (password !== ADMIN_PASSWORD) {
      return res.status(403).json({message: "Username or password is incorrect"});
    }
    const token = createToken();
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ message: "An error occurred during login", error: e instanceof Error ? e.message : "Unknown error" });
  }
});

app.use('*link', (req, res) => {
  res.status(404).json({ message: "المسار غير موجود" });
});

// معالجة الأخطاء الموحدة
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
