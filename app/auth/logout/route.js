import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req) {
  const supabase = supabaseServer();
  await supabase.auth.signOut();

  const url = new URL(req.url);
  url.pathname = "/auth/login";
  url.search = "";

  return NextResponse.redirect(url);
}
