export const dynamic = "force-dynamic";

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="card p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-extrabold">لوحة التحكم</h1>
        <p className="mt-2 text-white/70">
          إذا وصلت هنا ✅ معناها /admin صار شغال. الخطوة الجاية نركّب صفحة إدارة المنيوهات والمنتجات.
        </p>
      </div>
    </div>
  );
}
