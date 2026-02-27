import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email?: string;
  password: string;
  role: 'user' | 'author' | 'admin';
  profile: {
    fullName: string;
    bio?: string;
    avatar?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  stats: {
    articlesCount: number;
    totalViews: number;
    followers: number;
  };
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'author', 'admin'], default: 'user' },
  profile: {
    fullName: { type: String, required: true },
    bio: { type: String, required: false },
    avatar: { type: String, required: false },
    github: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
  },
  stats: {
    articlesCount: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
  },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
