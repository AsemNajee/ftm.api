import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User';
import Category from '../models/Category';
import Article from '../models/Article';
import Comment from '../models/Comment';
import { hashPassword } from './hash';
import {faker} from '@faker-js/faker';

dotenv.config();


const categories = [
  {
    name: 'JavaScript',
    slug: 'javascript',
    icon: 'Code2',
    color: '#F7DF1E',
    articleCount: 156,
    description: 'تعلم أساسيات وتقنيات JavaScript المتقدمة',
  },
  {
    name: 'قواعد البيانات',
    slug: 'database',
    icon: 'Database',
    color: '#E11D48',
    articleCount: 89,
    description: 'SQL, NoSQL, وتصميم قواعد البيانات',
  },
  {
    name: 'CSS والتصميم',
    slug: 'css',
    icon: 'Palette',
    color: '#8B5CF6',
    articleCount: 124,
    description: 'تصميم واجهات المستخدم وCSS المتقدم',
  },
  {
    name: 'الخوادم والسيرفرات',
    slug: 'backend',
    icon: 'Server',
    color: '#0EA5E9',
    articleCount: 98,
    description: 'Node.js, Python, وبرمجة الخوادم',
  },
  {
    name: 'تطبيقات الجوال',
    slug: 'mobile',
    icon: 'Smartphone',
    color: '#10B981',
    articleCount: 67,
    description: 'React Native, Flutter, وتطوير الجوال',
  },
  {
    name: 'الأمن السيبراني',
    slug: 'security',
    icon: 'Shield',
    color: '#F59E0B',
    articleCount: 45,
    description: 'أمن المعلومات وحماية التطبيقات',
  },
];

const users = [
  {
    username: 'ahmad',
    email: 'ahmad@example.com',
    password: 'hashedpassword1',
    role: 'author',
    profile: {
      fullName: 'أحمد محمد',
      bio: 'مطور ويب ومهتم بتقنيات React وNode.js.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      github: 'ahmaddev',
      twitter: 'ahmaddev',
      linkedin: 'ahmaddev',
    },
    stats: {
      articlesCount: 12,
      totalViews: 15400,
      followers: 320,
    },
  },
  {
    username: 'sara',
    email: 'sara@example.com',
    password: 'hashedpassword2',
    role: 'author',
    profile: {
      fullName: 'سارة العلي',
      bio: 'مهندسة برمجيات وخبيرة في JavaScript.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      github: 'saracode',
      twitter: 'saracode',
      linkedin: 'saracode',
    },
    stats: {
      articlesCount: 8,
      totalViews: 9800,
      followers: 210,
    },
  },
  {
    username: 'khaled',
    email: 'khaled@example.com',
    password: 'hashedpassword3',
    role: 'admin',
    profile: {
      fullName: 'خالد الرشيد',
      bio: 'مدير الموقع وخبير أمن سيبراني.',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      github: 'khaledsec',
      twitter: 'khaledsec',
      linkedin: 'khaledsec',
    },
    stats: {
      articlesCount: 5,
      totalViews: 4200,
      followers: 150,
    },
  },
];

const articles = [
  {
    slug: 'complete-guide-to-react-hooks',
    title: 'الدليل الشامل لـ React Hooks: من المبتدئ إلى الاحتراف',
    excerpt: 'تعلم كيفية استخدام React Hooks بشكل فعال لبناء تطبيقات React حديثة وقابلة للصيانة. يغطي هذا الدليل useState, useEffect, useContext والمزيد.',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    authorUsername: 'ahmad',
    categorySlug: 'react',
    categoryLabel: 'React',
    level: 'متوسط',
    readTime: 15,
    views: 12540,
    likes: 892,
    publishedAt: new Date('2024-01-15'),
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    techStack: ['React', 'JavaScript', 'TypeScript'],
  },
  // ... أضف بقية المقالات هنا بنفس النمط ...
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);

  // تنظيف المجموعات
  await User.deleteMany({});
  await Category.deleteMany({});
  await Article.deleteMany({});
  await Comment.deleteMany({});

  // --- إنشاء تصنيفات مزيفة ---
  const categoryCount = 8;
  // Generate unique, sanitized names (avoid relying on faker.helpers.unique)
  const uniqueNames = new Set<string>();
  while (uniqueNames.size < categoryCount) {
    const raw = faker.lorem.word();
    const name = raw.replace(/\W+/g, '').slice(0, 20);
    if (name) uniqueNames.add(name);
  }
  const categoriesData = Array.from(uniqueNames).map(name => {
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]+/g, '');
    return {
      // replaced faker.helpers.titleize => safe capitalization
      name: name.charAt(0).toUpperCase() + name.slice(1),
      slug,
      icon: faker.helpers.arrayElement(['Code2', 'Database', 'Palette', 'Server', 'Smartphone', 'Shield', 'Cloud', 'Bolt']),
      // stable hex color generator instead of faker.internet.color()
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      articleCount: 0,
      description: faker.lorem.sentence(),
    } as any;
  });

  const categoryDocs = await Category.insertMany(categoriesData);

  // --- إنشاء مستخدمين مزيفين ---
  const userCount = 12;
  const roles = ['user', 'author', 'editor', 'admin'];

  const usersData: any[] = [];
  for (let i = 0; i < userCount; i++) {
    const username = faker.internet.userName().toLowerCase();
    const role = i < 6 ? faker.helpers.arrayElement(['author', 'author', 'user']) : faker.helpers.arrayElement(roles);

    usersData.push({
      username,
      email: faker.internet.email(username),
      password: await hashPassword('123456'),
      role,
      profile: {
        fullName: faker.name.fullName(),
        bio: faker.lorem.sentences(2),
        avatar: faker.image.avatar(),
        github: faker.internet.userName(),
        twitter: faker.internet.userName(),
        linkedin: faker.internet.userName(),
      },
      stats: {
        articlesCount: 0,
        totalViews: 0,
        followers: 0,
      },
      followers: [],
      following: [],
    });
  }

  const userDocs = await User.insertMany(usersData);

  // --- ربط متابعين عشوائيين ---
  for (const user of userDocs) {
    const followers = faker.helpers.arrayElements(userDocs.filter(u => u._id.toString() !== user._id.toString()), faker.number.int({ min: 0, max: 6 }));
    user.followers = followers.map((f: any) => f._id);
    user.stats.followers = user.followers.length;
    await user.save();
  }

  // تحديث following بناءً على followers
  for (const u of userDocs) {
    for (const fId of u.followers) {
      const followed = userDocs.find(x => x._id.toString() === fId.toString());
      if (followed && !followed.following.map((id: any) => id.toString()).includes(u._id.toString())) {
        followed.following.push(u._id);
        await followed.save();
      }
    }
  }

  // --- إنشاء مقالات لكل مؤلف ---
  const levels = ['مبتدئ', 'متوسط', 'متقدم', 'خبير'] as const;
  const articleDocs: any[] = [];

  const authorUsers = userDocs.filter(u => ['author', 'editor', 'admin'].includes(u.role));

  for (const author of authorUsers) {
    const count = faker.number.int({ min: 1, max: 6 });
    for (let i = 0; i < count; i++) {
      const title = faker.lorem.sentence().slice(0, 120);
      const slug = title.toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]+/g, '');
      const cat = faker.helpers.arrayElement(categoryDocs);

      const contentText = faker.lorem.paragraphs(faker.number.int({ min: 1, max: 4 }));
      const content = {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: contentText }] }],
      };

      const status = faker.helpers.arrayElement(['published', 'draft']);
      const publishedAt = status === 'published' ? faker.date.past({ years: 2 }) : undefined;

      const likesUsers = faker.helpers.arrayElements(userDocs, faker.number.int({ min: 0, max: userDocs.length }));
      const bookmarksUsers = faker.helpers.arrayElements(userDocs, faker.number.int({ min: 0, max: userDocs.length }));

      const article = await Article.create({
        slug,
        title,
        excerpt: faker.lorem.sentences(2),
        content,
        contentText,
        coverImage: faker.image.urlLoremFlickr({ width: 800, height: 450 }),
        author: author._id,
        authorAvatar: author.profile.avatar,
        category: cat._id,
        categoryLabel: cat.name,
        level: faker.helpers.arrayElement(levels),
        readTime: faker.number.int({ min: 2, max: 25 }),
        views: faker.number.int({ min: 0, max: 25000 }),
        likes: likesUsers.map(u => u._id),
        bookmarks: bookmarksUsers.map(u => u._id),
        status,
        publishedAt,
        tags: faker.helpers.arrayElements(['javascript', 'node', 'react', 'database', 'security', 'css', 'mobile', 'devops'], faker.number.int({ min: 0, max: 5 })),
        techStack: faker.helpers.arrayElements(['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Docker'], faker.number.int({ min: 0, max: 4 })),
      });

      // تحديث إحصائيات
      await Category.findByIdAndUpdate(cat._id, { $inc: { articleCount: 1 } }).exec();
      await User.findByIdAndUpdate(author._id, { $inc: { 'stats.articlesCount': 1, 'stats.totalViews': article.views } }).exec();

      articleDocs.push(article);
    }
  }

  // --- إنشاء تعليقات عشوائية ---
  const commentDocs: any[] = [];
  for (const art of articleDocs) {
    const commentCount = faker.number.int({ min: 0, max: 8 });
    for (let i = 0; i < commentCount; i++) {
      const author = faker.helpers.arrayElement(userDocs);
      const comment = await Comment.create({
        content: faker.lorem.sentences(2),
        author: author._id,
        article: art._id,
        likes: faker.helpers.arrayElements(userDocs, faker.number.int({ min: 0, max: 10 })).map((u: any) => u._id),
      });
      commentDocs.push(comment);

      // بعض الردود على التعليقات
      if (faker.datatype.boolean() && commentDocs.length > 1) {
        const parent = faker.helpers.arrayElement(commentDocs.filter(c => c.article.toString() === art._id.toString() && c._id.toString() !== comment._id.toString()));
        if (parent) {
          const reply = await Comment.create({
            content: faker.lorem.sentences(1),
            author: faker.helpers.arrayElement(userDocs)._id,
            article: art._id,
            parent: parent._id,
            likes: [],
          });
          commentDocs.push(reply);
        }
      }
    }
  }

  console.log('Seeding finished:', {
    categories: categoryDocs.length,
    users: userDocs.length,
    articles: articleDocs.length,
    comments: commentDocs.length,
  });

  // Close mongoose gracefully
  await mongoose.disconnect();
  process.exit(0);
};

seed();
