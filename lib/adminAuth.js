import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "sm_admin";

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function isAdmin() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const token = cookies().get(COOKIE)?.value;
  if (!token) return false;

  const [payload, sig] = token.split(".");
  if (payload !== "ok" || !sig) return false;

  return sign("ok", secret) === sig;
}
