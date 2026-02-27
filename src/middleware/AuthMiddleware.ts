import { JWT_TOKEN } from "./../env/env";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

export const createToken = () => {
  const token = jwt.sign(
    {
      isAdmin: true,
    },
    JWT_TOKEN,
    {
      expiresIn: "30m",
    },
  );
  return token;
};

export const verifyAdmin = (req: Request, res: Response, next: any) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({error: "No token provided"});
  }
  try {
    jwt.verify(token, JWT_TOKEN);
    next();
  } catch (e) {
    return res.status(401).json();
  }
};
