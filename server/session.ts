import type { Request, Response } from "express";

export function usesCookieSession(): boolean {
  return Boolean(process.env.VERCEL);
}

export function clearSession(req: Request, _res: Response): Promise<void> {
  if (usesCookieSession()) {
    req.session = null;
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export function clearSessionCookies(res: Response): void {
  res.clearCookie("connect.sid");
  res.clearCookie("session");
}
