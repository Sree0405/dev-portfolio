import type { SessionUser } from "../auth/config.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: SessionUser;
  }
}

declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
  }
}

export {};
