import mongoose from "mongoose";
import { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    title: { type: String, required: [true, "يجب ادخال عنوان القسم"] },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CategorySchema.virtual('majors', {ref: 'majors', localField: '_id', foreignField: 'category'});

export const CategoryModel = mongoose.model<typeof CategorySchema>(
  "categories",
  CategorySchema,
);
