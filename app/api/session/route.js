import { NextResponse } from "next/server";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) return new NextResponse("missing userId", { status: 400 });

    setSessionCookie(userId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return new NextResponse(e?.message || "error", { status: 500 });
  }
}

export async function DELETE() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
