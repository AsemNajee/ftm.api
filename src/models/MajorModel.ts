import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { CategoryModel } from "./CategoryModel";

const MajorSchema = new mongoose.Schema({
    title: {type: String, required: [true, 'يجب ادخال عنوان التخصص']},
    category: {type: ObjectId, ref: CategoryModel, required: [true, 'يجب اختيار التصنيف']}
})

export const MajorModel = mongoose.model<typeof MajorSchema>('majors', MajorSchema);