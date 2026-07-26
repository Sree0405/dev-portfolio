import type { User } from "@prisma/client";
import type { SessionUser } from "../auth/config.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import * as userRepository from "../repositories/userRepository.js";

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
  };
}

export async function login(username: string, password: string): Promise<SessionUser | null> {
  const user = await userRepository.findUserByUsername(username.trim());
  if (!user) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  return toSessionUser(user);
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export async function signup(input: SignupInput): Promise<SessionUser> {
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();

  const existingUsername = await userRepository.findUserByUsername(username);
  if (existingUsername) {
    throw new Error("USERNAME_TAKEN");
  }

  const existingEmail = await userRepository.findUserByEmail(email);
  if (existingEmail) {
    throw new Error("EMAIL_TAKEN");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await userRepository.createUser({
    username,
    email,
    passwordHash,
    displayName: input.displayName?.trim() || username,
    role: "user",
  });

  return toSessionUser(user);
}

export async function updateProfile(
  userId: string,
  data: { email?: string; displayName?: string | null },
): Promise<SessionUser> {
  if (data.email) {
    const existing = await userRepository.findUserByEmail(data.email);
    if (existing && existing.id !== userId) {
      throw new Error("EMAIL_TAKEN");
    }
  }

  const user = await userRepository.updateUserProfile(userId, data);
  return toSessionUser(user);
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    throw new Error("INVALID_PASSWORD");
  }

  const passwordHash = await hashPassword(newPassword);
  await userRepository.updateUserPassword(userId, passwordHash);
}
