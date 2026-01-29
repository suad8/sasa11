import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export default async function MenuPublicPage({ params }) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("menus")
    .select("title,data")
    .eq("slug", params.slug)
    .single();

  if (error || !data) return notFound();

  const menu = data.data;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="text-2xl font-black">{data.title}</div>
        <div className="text-white/60 mt-1">رابط عام للمنيو</div>
      </div>

      {/* هنا تقدر تستخدم مكوّن MenuCategory حقك */}
      <pre className="card p-6 overflow-auto text-sm">{JSON.stringify(menu, null, 2)}</pre>
    </div>
  );
}
