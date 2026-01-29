"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function SignupPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    setMsg("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return setMsg(error.message);

      // إذا Email confirmation مفعّل، غالبًا session = null
      if (!data?.session) {
        setMsg("تم التسجيل ✅ راجع بريدك لتأكيد الحساب ثم سجّل دخول.");
        // نوديه لصفحة الدخول بعد ثانيتين
        setTimeout(() => router.replace("/auth/login"), 1500);
        return;
      }

      // إذا session موجودة (يعني confirmation غير مفعّل)
      router.replace("/dashboard");
      router.refresh();
    } catch (e) {
      setMsg(e?.message || "صار خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="card p-6 md:p-10 w-full max-w-md space-y-4">
        <div className="text-2xl font-black">إنشاء حساب</div>

        <input className="input" placeholder="الإيميل" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input" placeholder="كلمة المرور" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <button className="btn btnPrimary w-full" onClick={signup} disabled={loading}>
          {loading ? "جاري التسجيل..." : "تسجيل"}
        </button>

        <a className="btn w-full" href="/auth/login">عندي حساب</a>

        {msg ? <div className="text-sm text-white/80">{msg}</div> : null}
      </div>
    </div>
  );
}
