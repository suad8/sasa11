"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);

    // مهم عشان Server Components تقرأ الكوكي الجديدة
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="card p-6 md:p-10 w-full max-w-md space-y-4">
        <div className="text-2xl font-black">تسجيل دخول</div>

        <input className="input" placeholder="الإيميل" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input" placeholder="كلمة المرور" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <button className="btn btnPrimary w-full" onClick={login}>دخول</button>
        <a className="btn w-full" href="/auth/signup">إنشاء حساب</a>

        {msg ? <div className="text-white/80 text-sm">{msg}</div> : null}
      </div>
    </div>
  );
}
