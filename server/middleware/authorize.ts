import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/JwtPayload";

export default function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY as string
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    console.error("An error occurred while authorizing admin user:", error);

    return res.status(400).send("Invalid token.");
  }
}
