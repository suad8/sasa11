import Nav from "@/components/Nav";
import { getSessionUserId } from "@/lib/session";

export default function HomePage() {
  const uid = getSessionUserId();
  const authed = Boolean(uid);

  return (
    <div className="space-y-6">
      <Nav authed={authed} />

      <div className="card p-6 md:p-10">
        <div className="badge">SaaS</div>
        <h1 className="mt-4 text-3xl md:text-5xl font-black leading-tight">
          سعود منيو
          <span className="block text-white/70 text-xl md:text-2xl font-bold mt-2">
            صانع منيو + طلبات (لوحة أو واتساب) + ثيمين جاهزين
          </span>
        </h1>
        <p className="mt-4 text-white/70 text-base md:text-lg">
          كل عميل يسجل، ينشئ منيو خاص فيه، يختار ثيم (دافي أو عصري)، ويستقبل الطلبات بالطريقة اللي تناسبه.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a className="btn btnPrimary" href="/auth/signup">ابدأ الآن</a>
          <a className="btn" href="/m/demo">شوف الديمو</a>
          <a className="btn" href="/dashboard">لوحة التحكم</a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="font-black text-lg">ثيمين</div>
          <div className="text-white/70 mt-2">Warm Cards (دافي) + Modern Glass (عصري)</div>
        </div>
        <div className="card p-6">
          <div className="font-black text-lg">طلبات</div>
          <div className="text-white/70 mt-2">لوحة داخلية + صوت + حالات، أو واتساب، أو الاثنين</div>
        </div>
        <div className="card p-6">
          <div className="font-black text-lg">رابط و QR</div>
          <div className="text-white/70 mt-2">رابط منيو لكل عميل (slug) وتجهيز QR لاحقًا</div>
        </div>
      </div>
    </div>
  );
}
