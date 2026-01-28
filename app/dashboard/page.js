import DashNav from "@/components/DashNav";
import { getSessionUserId } from "@/lib/session";
import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";

export default async function Dashboard() {
  const userId = getSessionUserId();
  const sb = supabaseServer();

  const { data: tenant } = await sb.from("tenants").select("*").eq("owner_user_id", userId).maybeSingle();

  return (
    <div className="space-y-6">
      <DashNav />

      {!tenant ? (
        <CreateTenant />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6 md:p-8">
            <div className="text-sm text-white/60">المنيو</div>
            <div className="text-2xl font-black mt-1">{tenant.brand_name}</div>
            <div className="text-white/70 mt-2">رابط المنيو:</div>
            <div className="mt-2">
              <a className="btn" href={`/m/${tenant.slug}`} target="_blank">/m/{tenant.slug}</a>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            <div className="text-sm text-white/60">الخطوات السريعة</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link className="btn btnPrimary" href="/dashboard/products">أضف منتجات</Link>
              <Link className="btn" href="/dashboard/settings">إعدادات + ثيم</Link>
              <Link className="btn" href="/dashboard/orders">لوحة الطلبات</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateTenant() {
  return (
    <div className="card p-6 md:p-10">
      <div className="text-xl font-black">ابدأ بإنشاء منيو لك</div>
      <div className="text-white/70 mt-2">اختر اسم المنيو و (slug) للرابط.</div>
      <form action="/api/tenant" method="post" className="mt-5 grid md:grid-cols-2 gap-3">
        <input className="input" name="brand_name" placeholder="اسم المنيو (مثال: سُلافة)" required />
        <input className="input" name="slug" placeholder="slug (مثال: sulafa)" required />
        <button className="btn btnPrimary md:col-span-2" type="submit">إنشاء</button>
      </form>
      <div className="text-xs text-white/50 mt-3">الـ slug لازم يكون إنجليزي/أرقام/شرطة.</div>
    </div>
  );
}
