import DashNav from "@/components/DashNav";
import { getSessionUserId } from "@/lib/session";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function SettingsPage() {
  const userId = getSessionUserId();
  const sb = supabaseServer();
  const { data: tenant } = await sb.from("tenants").select("*").eq("owner_user_id", userId).maybeSingle();

  if (!tenant) {
    return (
      <div className="space-y-6">
        <DashNav />
        <div className="card p-6 md:p-10">أنشئ منيو أولًا من صفحة لوحة التحكم الرئيسية.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashNav />

      <div className="card p-6 md:p-10">
        <div className="text-xl font-black">الإعدادات</div>
        <div className="text-white/60 text-sm mt-2">اختر ثيم + طريقة الطلب + رقم واتساب</div>

        <form action="/api/settings" method="post" className="mt-5 grid md:grid-cols-2 gap-3">
          <input className="input" name="brand_name" defaultValue={tenant.brand_name} placeholder="اسم المنيو" />
          <input className="input" name="whatsapp_number" defaultValue={tenant.whatsapp_number || ""} placeholder="واتساب (مثال: 9665xxxxxxx)" />
          <select className="input" name="order_mode" defaultValue={tenant.order_mode}>
            <option value="dashboard">لوحة داخلية فقط</option>
            <option value="whatsapp">واتساب فقط</option>
            <option value="both">الاثنين</option>
          </select>
          <select className="input" name="theme_id" defaultValue={tenant.theme_id}>
            <option value="warm_cards">Warm Cards (دافي)</option>
            <option value="modern_glass">Modern Glass (عصري)</option>
          </select>

          <button className="btn btnPrimary md:col-span-2" type="submit">حفظ</button>
        </form>
      </div>
    </div>
  );
}
