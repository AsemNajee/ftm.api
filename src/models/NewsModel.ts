import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
});

export const NewsModel = mongoose.model<typeof NewsSchema>("News", NewsSchema);
