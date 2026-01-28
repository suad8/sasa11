import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { supabaseServer } from "@/lib/supabaseServer";

async function getTenantId(sb, userId){
  const { data } = await sb.from("tenants").select("id").eq("owner_user_id", userId).maybeSingle();
  return data?.id || null;
}

export async function GET(){
  const userId = getSessionUserId();
  if (!userId) return new NextResponse("unauthorized", { status: 401 });
  const sb = supabaseServer();
  const tenantId = await getTenantId(sb, userId);
  if (!tenantId) return NextResponse.json({ products: [] });

  const { data, error } = await sb.from("products").select("*").eq("tenant_id", tenantId).order("category").order("name");
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ products: data || [] });
}

export async function POST(req){
  const userId = getSessionUserId();
  if (!userId) return new NextResponse("unauthorized", { status: 401 });
  const sb = supabaseServer();
  const tenantId = await getTenantId(sb, userId);
  if (!tenantId) return new NextResponse("no tenant", { status: 400 });

  const body = await req.json();
  const { data, error } = await sb.from("products").insert([{
    tenant_id: tenantId,
    name: String(body.name||"").trim(),
    category: String(body.category||"بدون قسم").trim(),
    description: String(body.description||"").trim(),
    price: Number(body.price)||0
  }]).select("*").single();

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(req){
  const userId = getSessionUserId();
  if (!userId) return new NextResponse("unauthorized", { status: 401 });
  const sb = supabaseServer();
  const tenantId = await getTenantId(sb, userId);
  if (!tenantId) return new NextResponse("no tenant", { status: 400 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new NextResponse("bad", { status: 400 });

  // ensure tenant scoping
  const { error } = await sb.from("products").delete().eq("id", id).eq("tenant_id", tenantId);
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ ok: true });
}
