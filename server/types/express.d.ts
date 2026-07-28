import type { JwtPayload } from "./JwtPayload";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
