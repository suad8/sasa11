import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req){
  try{
    const body = await req.json();
    const tenant_slug = String(body.tenant_slug||"");
    if (!tenant_slug) return new NextResponse("bad", { status: 400 });
    if (!body?.items?.length) return new NextResponse("empty", { status: 400 });

    const sb = supabaseServer();
    const { data: tenant } = await sb.from("tenants").select("id,order_mode,whatsapp_number").eq("slug", tenant_slug).maybeSingle();
    if (!tenant) return new NextResponse("tenant not found", { status: 404 });

    // Always save order when dashboard enabled or both
    const shouldSave = tenant.order_mode === "dashboard" || tenant.order_mode === "both";
    let saved = null;

    if (shouldSave){
      const { data, error } = await sb.from("orders").insert([{
        tenant_id: tenant.id,
        status: "new",
        order_type: body.order_type,
        extra_info: body.extra_info,
        total: body.total,
        items: body.items
      }]).select("*").single();
      if (error) return new NextResponse(error.message, { status: 500 });
      saved = data;
    }

    return NextResponse.json({ ok: true, saved: Boolean(saved), whatsapp: tenant.whatsapp_number || "" });
  }catch{
    return new NextResponse("bad request", { status: 400 });
  }
}
