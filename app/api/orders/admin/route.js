import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { supabaseServer } from "@/lib/supabaseServer";

async function tenantIdFor(sb, userId){
  const { data } = await sb.from("tenants").select("id").eq("owner_user_id", userId).maybeSingle();
  return data?.id || null;
}

export async function GET(){
  const userId = getSessionUserId();
  if (!userId) return new NextResponse("unauthorized", { status: 401 });
  const sb = supabaseServer();
  const tid = await tenantIdFor(sb, userId);
  if (!tid) return NextResponse.json({ orders: [] });

  const { data, error } = await sb.from("orders").select("*").eq("tenant_id", tid).order("created_at", { ascending: false }).limit(200);
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ orders: data || [] });
}

export async function PATCH(req){
  const userId = getSessionUserId();
  if (!userId) return new NextResponse("unauthorized", { status: 401 });

  const body = await req.json();
  const { id, status } = body || {};
  if (!id || !status) return new NextResponse("bad", { status: 400 });

  const sb = supabaseServer();
  const tid = await tenantIdFor(sb, userId);
  if (!tid) return new NextResponse("no tenant", { status: 400 });

  const { error } = await sb.from("orders").update({ status }).eq("id", id).eq("tenant_id", tid);
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ ok: true });
}
