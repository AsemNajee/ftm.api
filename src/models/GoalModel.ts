import mongoose from "mongoose";

// Goals of institute
const GoalsSchema = new mongoose.Schema({
  imogy: String,
  title: String,
  description: String,
});

export const GoalsModel = mongoose.model<typeof GoalsSchema>("Goals", GoalsSchema);
