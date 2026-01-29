import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

function slugify(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .slice(0, 60) || "menu";
}

export async function POST(req) {
  const supabase = supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();

  const title = body?.title || "منيو";
  const data = body?.data || body; // خليه مرن
  const slug = body?.slug || `${slugify(title)}-${userData.user.id.slice(0, 6)}`;

  const { data: created, error } = await supabase
    .from("menus")
    .insert({ user_id: userData.user.id, slug, title, data })
    .select("slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, slug: created.slug });
}
