import mongoose, { Schema } from "mongoose";

const InfoSchema = new Schema({
    seen: {type: String, required: [true, "seen is required here"]},
    message: {type: String, required: [true, "message is required here"]},
    id: {type: Number, default: 1}
});

export const InfoModel = mongoose.model<typeof InfoSchema>('info', InfoSchema);