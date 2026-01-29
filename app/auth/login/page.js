"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const sb = supabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    setMsg("");
    try {
      const { data, error } = await sb.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return setMsg(error.message);

      const userId = data?.user?.id || data?.session?.user?.id;
      if (!userId) return setMsg("ما قدرنا نجيب بيانات المستخدم");

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) return setMsg("فشل إنشاء الجلسة");

      router.replace("/dashboard");
    } catch {
      setMsg("صار خطأ غير متوقع");
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="card p-6 md:p-10 w-full max-w-md space-y-4">
        <div className="text-2xl font-black">تسجيل دخول</div>

        <input
          className="input"
          placeholder="الإيميل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btnPrimary w-full" onClick={login}>
          دخول
        </button>

        <a className="btn w-full" href="/auth/signup">
          إنشاء حساب
        </a>

        {msg && <div className="text-sm text-white/80">{msg}</div>}
      </div>
    </div>
  );
}
