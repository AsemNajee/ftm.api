import mongoose from "mongoose";
import { MONGODB_URI } from "../env/env";

let isConnected = false;

export const connectToDatabase = async () => {
    if (!MONGODB_URI) {
        console.warn("MONGODB_URI is not set. Skipping database connection.");
        return;
    }
    if (isConnected || mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(MONGODB_URI, {
            // useNewUrlParser and useUnifiedTopology are defaults in mongoose v6+
        });
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        // Do not throw to avoid crashing serverless function; return so handlers can decide
        return;
    }
};