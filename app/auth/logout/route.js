import { NextResponse } from "next/server";

const COOKIE_NAME = "sm_session";

export async function GET(req) {
  const url = new URL(req.url);
  url.pathname = "/auth/login";
  url.search = "";

  const res = NextResponse.redirect(url);

  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
