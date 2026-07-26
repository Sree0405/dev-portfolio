import { Router } from "express";
import { SESSION_USER_KEY } from "../auth/config.js";
import { normalizeSessionUser } from "../auth/sessionUser.js";
import { clearSession, clearSessionCookies } from "../session.js";
import {
  loginSchema,
  signupSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../lib/validation.js";
import { getFeatureFlags } from "../lib/featureFlags.js";
import * as authService from "../services/authService.js";
import { requireAuth, getSessionUser } from "../middleware/auth.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }

  try {
    const user = await authService.signup(parsed.data);
    req.session[SESSION_USER_KEY] = user;
    return res.status(201).json({ user, features: getFeatureFlags() });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "USERNAME_TAKEN") {
        return res.status(409).json({ error: "Username is already taken" });
      }
      if (error.message === "EMAIL_TAKEN") {
        return res.status(409).json({ error: "Email is already registered" });
      }
    }
    return res.status(500).json({ error: "Failed to create account" });
  }
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }

  const { username, password } = parsed.data;
  const user = await authService.login(username, password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session[SESSION_USER_KEY] = user;

  return res.json({ user, features: getFeatureFlags() });
});

router.post("/logout", (req, res) => {
  clearSession(req, res)
    .then(() => {
      clearSessionCookies(res);
      return res.json({ success: true });
    })
    .catch(() => res.status(500).json({ error: "Failed to logout" }));
});

router.get("/me", (req, res) => {
  const user = normalizeSessionUser(req.session[SESSION_USER_KEY]);
  if (!user) {
    if (req.session[SESSION_USER_KEY]) {
      clearSession(req, res).catch(() => {});
    }
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ user, features: getFeatureFlags() });
});

router.get("/me/profile", requireAuth, (req, res) => {
  const user = getSessionUser(req);
  return res.json({ user });
});

router.patch("/me/profile", requireAuth, async (req, res) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }

  try {
    const user = getSessionUser(req);
    const updated = await authService.updateProfile(user.id, parsed.data);
    req.session[SESSION_USER_KEY] = updated;
    return res.json({ user: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return res.status(409).json({ error: "Email is already registered" });
    }
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

router.patch("/me/password", requireAuth, async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }

  try {
    const user = getSessionUser(req);
    await authService.changePassword(
      user.id,
      parsed.data.currentPassword,
      parsed.data.newPassword,
    );
    return res.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_PASSWORD") {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    return res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;
