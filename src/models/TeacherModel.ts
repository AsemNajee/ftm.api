import mongoose, { Schema } from "mongoose";

const TeacherModel = new Schema({
    name: {type: String, required: [true, 'يجب ادخال اسم للدكتور او الاستاذ']},
    role: {type: String, required: [true, 'يجب تحديد صفة الاستاذ']},
    male: {type: Boolean, default: true}
})

export default mongoose.model<typeof TeacherModel>('teachers', TeacherModel);
