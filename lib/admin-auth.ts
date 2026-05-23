import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const cookie = (await cookies()).get(ADMIN_COOKIE);
  return cookie?.value === adminPassword;
}

export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdminAuthenticated()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: ONE_WEEK_SECONDS,
  };
}
