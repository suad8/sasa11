import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE = "sm_admin";

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function POST(req) {
  const { password } = await req.json();
  const real = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!real || !secret) return new NextResponse("Missing env vars", { status: 500 });

  if (password !== real) {
    return NextResponse.json({ ok: false, error: "كلمة السر غير صحيحة" }, { status: 401 });
  }

  const token = `ok.${sign("ok", secret)}`;
  const res = NextResponse.json({ ok: true });

  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
