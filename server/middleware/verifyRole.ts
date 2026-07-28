import { Request, Response, NextFunction } from "express";
import { Role } from "../types/JwtPayload";

export default function authorize(role: Role) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return res.status(401).send("Unauthorized.");
    }

    if (req.user.role !== role) {
      return res.status(403).send("Access denied.");
    }

    next();
  };
}
