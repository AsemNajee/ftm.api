import { z } from 'zod';

// Helpers
const objectId = () => z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// --- User / Auth ---
export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email().optional(),
  password: z.string().min(6),
  role: z.enum(['user', 'author', 'admin']).optional().default('user'),
  profile: z
    .object({
      fullName: z.string().min(1),
      bio: z.string().max(500).optional(),
      avatar: z.string().url().optional(),
      github: z.string().url().optional(),
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    })
    .optional(),
});

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  profile: z
    .object({
      fullName: z.string().min(1).optional(),
      bio: z.string().max(500).optional(),
      avatar: z.url().optional(),
      github: z.url().optional(),
      twitter: z.url().optional(),
      linkedin: z.url().optional(),
    })
    .optional(),
});

// --- Article ---
export const createArticleSchema = z.object({
  title: z.string().min(3).max(300),
  excerpt: z.string().min(1).max(1000),
  content: z.any(), // محرر المخزن كـ JSON
  contentText: z.string().optional(),
  coverImage: z.string().url().optional(),
  author: objectId(),
  authorAvatar: z.string().url().optional(),
  category: objectId(),
  categoryLabel: z.string().min(1),
  level: z.enum(['مبتدئ', 'متوسط', 'متقدم', 'خبير']),
  readTime: z.number().int().nonnegative(),
  tags: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  publishedAt: z.preprocess((v) => (v ? new Date(v as string) : undefined), z.date().optional()),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  slug: z.string().optional(),
});

// --- Category ---
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().optional(),
  icon: z.string().min(1),
  color: z.string().min(3),
  description: z.string().min(1).max(1000),
  parent: objectId().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// --- Comment ---
export const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  author: objectId(),
  article: objectId(),
  parent: objectId().optional(),
});

export const updateCommentSchema = z.object({ content: z.string().min(1).max(2000).optional() });

// --- Generic IDs ---
export const idParamSchema = z.object({ id: objectId() });

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

export type IdParam = z.infer<typeof idParamSchema>;

export default {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
  createArticleSchema,
  updateArticleSchema,
  createCategorySchema,
  updateCategorySchema,
  createCommentSchema,
  updateCommentSchema,
  idParamSchema,
};
