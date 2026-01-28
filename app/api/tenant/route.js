import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { supabaseServer } from "@/lib/supabaseServer";

function cleanSlug(s){
  return String(s||"").toLowerCase().trim().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
}

export async function POST(req){
  const userId = getSessionUserId();
  if (!userId) return new NextResponse("unauthorized", { status: 401 });

  const form = await req.formData();
  const brand = String(form.get("brand_name") || "").trim();
  const slug = cleanSlug(form.get("slug"));

  if (!brand || !slug) return new NextResponse("bad", { status: 400 });

  const sb = supabaseServer();

  // prevent duplicate slug
  const { data: exists } = await sb.from("tenants").select("id").eq("slug", slug).maybeSingle();
  if (exists) return new NextResponse("slug taken", { status: 409 });

  const { data, error } = await sb.from("tenants").insert([{
    owner_user_id: userId,
    brand_name: brand,
    slug,
    theme_id: "modern_glass",
    order_mode: "both",
    whatsapp_number: "966532212529"
  }]).select("*").single();

  if (error) return new NextResponse(error.message, { status: 500 });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
