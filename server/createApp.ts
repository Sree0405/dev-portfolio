import express, { type Express } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { createApiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { usesCookieSession } from "./session.js";

export function createApp(): Express {
  const isProduction = process.env.NODE_ENV === "production";
  const app = express();

  if (isProduction) {
    app.set("trust proxy", 1);
  }

  app.use(express.json());
  app.use(cookieParser());

  const secret = process.env.SESSION_SECRET || "dev-session-secret-change-me";

  if (usesCookieSession()) {
    app.use(
      cookieSession({
        name: "session",
        keys: [secret],
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
      }),
    );
  } else {
    app.use(
      session({
        secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000,
        },
      }),
    );
  }

  app.use("/api", createApiRouter());
  app.use(errorHandler);

  return app;
}
