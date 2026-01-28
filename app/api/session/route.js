import { NextResponse } from "next/server";
import { setSession } from "@/lib/session";

export async function POST(req){
  const body = await req.json();
  if (!body?.userId) return new NextResponse("bad", { status: 400 });
  setSession(String(body.userId));
  return NextResponse.json({ ok: true });
}
