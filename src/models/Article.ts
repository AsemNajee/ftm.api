import mongoose, { Document, Schema } from "mongoose";

export interface IArticle extends Document {
  slug: string;
  title: string;
  excerpt: string;

  content: any; // ← JSON من المحرر
  contentText?: string; // نسخة نصية للبحث

  coverImage?: string;
  author: mongoose.Types.ObjectId;
  authorAvatar?: string;

  category: mongoose.Types.ObjectId;
  categoryLabel: string;

  level: "مبتدئ" | "متوسط" | "متقدم" | "خبير";
  readTime: number;

  views: number;

  likes: mongoose.Types.ObjectId[]; // ✅ IDs المستخدمين الذين أعجبوا بالمقال
  bookmarks: mongoose.Types.ObjectId[]; // ✅ IDs المستخدمين الذين حفظوا المقال


  status: "draft" | "published";
  publishedAt?: Date;

  tags: string[];
  techStack: string[];
}

const ArticleSchema = new Schema<IArticle>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },

    content: { type: Schema.Types.Mixed, required: true }, // ⭐
    contentText: { type: String },

    coverImage: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorAvatar: { type: String },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    categoryLabel: { type: String, required: true },

    level: {
      type: String,
      enum: ["مبتدئ", "متوسط", "متقدم", "خبير"],
      required: true,
    },

    readTime: { type: Number, required: true },
    views: { type: Number, default: 0 },

    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], // 👈 جديد
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], // 👈 جديد

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: { type: Date },

    tags: [{ type: String }],
    techStack: [{ type: String }],
  },
  { timestamps: true }
);

/* توليد slug تلقائي */
ArticleSchema.pre("validate", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\u0600-\u06FF-]+/g, "");
  }
});

export default mongoose.model<IArticle>("Article", ArticleSchema);
