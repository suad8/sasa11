import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req){
  const userId = getSessionUserId();
  if (!userId) return new NextResponse("unauthorized", { status: 401 });

  const form = await req.formData();
  const brand_name = String(form.get("brand_name")||"").trim();
  const whatsapp_number = String(form.get("whatsapp_number")||"").trim();
  const order_mode = String(form.get("order_mode")||"both");
  const theme_id = String(form.get("theme_id")||"modern_glass");

  const sb = supabaseServer();
  const { error } = await sb.from("tenants").update({
    brand_name, whatsapp_number, order_mode, theme_id
  }).eq("owner_user_id", userId);

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.redirect(new URL("/dashboard/settings", req.url));
}
