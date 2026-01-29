import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req) {
  const supabase = supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();

  // مثال إدخال: احفظ المنيو مرتبط بالمستخدم
  const { error } = await supabase.from("menus").insert({
    user_id: userData.user.id,
    title: body.title,
    data: body.data,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
