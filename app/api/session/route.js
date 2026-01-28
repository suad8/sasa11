import { NextResponse } from "next/server";

const COOKIE_NAME = "sm_session";

export async function GET() {
  const url = new URL("/auth/login", "http://localhost"); // بس للـ URL
  const res = NextResponse.redirect(url.pathname);

  // امسح كوكي الجلسة
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
