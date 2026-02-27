import { config } from "dotenv";

config({
    path: '.env'
})

export const MONGODB_URI = process.env.MONGODB_URI ?? "";
export const JWT_TOKEN = process.env.JWT_TOKEN ?? "";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "123";