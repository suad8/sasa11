export const dynamic = "force-dynamic";

export default function AdminHome() {
  return (
    <div className="card p-6 md:p-10">
      <h1 className="text-2xl font-black">لوحة التحكم</h1>
      <p className="mt-2 text-white/70">تم ✅ فتح /admin</p>
      <a className="btn btnPrimary mt-5" href="/admin/login">دخول الأدمن</a>
    </div>
  );
}
