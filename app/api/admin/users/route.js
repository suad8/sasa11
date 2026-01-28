import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  const userId = getSessionUserId();
  if (!userId) return new NextResponse("unauthorized", { status: 401 });

  const sb = supabaseServer();

  // قفلها على أدمن واحد (اختياري لكن مهم)
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const { data } = await sb.auth.admin.getUserById(userId);
    const email = (data?.user?.email || "").toLowerCase();
    if (email !== adminEmail.toLowerCase()) return new NextResponse("forbidden", { status: 403 });
  }

  const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return new NextResponse(error.message, { status: 500 });

  const users = (data?.users || []).map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
  }));

  return NextResponse.json({ users });
}
