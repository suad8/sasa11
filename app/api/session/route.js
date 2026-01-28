import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "sm_session";

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function POST(req) {
  const { userId } = await req.json();
  if (!userId) return new NextResponse("missing userId", { status: 400 });

  const secret = process.env.SESSION_SECRET;
  if (!secret) return new NextResponse("Missing SESSION_SECRET", { status: 500 });

  const token = `${userId}.${sign(String(userId), secret)}`;

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
