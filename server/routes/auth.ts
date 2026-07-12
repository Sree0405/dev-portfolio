import { Router } from "express";
import { authenticateUser, SESSION_USER_KEY } from "../auth/config.js";
import { normalizeSessionUser } from "../auth/sessionUser.js";
import { loginSchema } from "../lib/validation.js";

const router = Router();

router.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }

  const { username, password } = parsed.data;
  const user = authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session[SESSION_USER_KEY] = user;

  return res.json({ user });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    return res.json({ success: true });
  });
});

router.get("/me", (req, res) => {
  const user = normalizeSessionUser(req.session[SESSION_USER_KEY]);
  if (!user) {
    if (req.session[SESSION_USER_KEY]) {
      req.session.destroy(() => {});
    }
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ user });
});

export default router;
