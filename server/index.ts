import "dotenv/config";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createApiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 8080;

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-session-secret-change-me",
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

  app.use("/api", createApiRouter());
  app.use(errorHandler);

  if (!isProduction) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: { server },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "../dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
