import type { SessionUser } from "../../server/auth/config.js";

declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export {};
