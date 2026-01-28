import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sm_session";

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function setSessionCookie(userId) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET");

  const payload = String(userId);
  const sig = sign(payload, secret);
  const token = `${payload}.${sig}`;

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionUserId() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [userId, sig] = token.split(".");
  if (!userId || !sig) return null;

  const expected = sign(userId, secret);
  if (sig !== expected) return null;

  return userId;
}
