import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function slugify(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "");
}

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const name = body?.name || "منيو جديد";
  const whatsapp = String(body?.whatsapp || "966532212529").replace(/\D/g, "");
  const slug = body?.slug || `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("menus")
    .insert({ name, whatsapp, slug, theme: body?.theme || "slv" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, menu: data });
}
