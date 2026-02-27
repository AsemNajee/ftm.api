import mongoose, { Document, Schema } from 'mongoose';


export interface ICategory extends Document {
  name: string;
  slug: string;
  icon: string;
  color: string;
  articleCount: number;
  description: string;
  parent?: mongoose.Types.ObjectId;
}


const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: false, unique: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  articleCount: { type: Number, default: 0 },
  description: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

// توليد slug تلقائي من الاسم
CategorySchema.pre('validate', function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\u0600-\u06FF-]+/g, '');
  }
});

export default mongoose.model<ICategory>('Category', CategorySchema);
