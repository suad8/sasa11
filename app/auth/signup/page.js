"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function SignupPage() {
  const sb = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const signup = async () => {
    setMsg("");
    const { error } = await sb.auth.signUp({ email, password });
    if (error) return setMsg(error.message);
    setMsg("تم التسجيل ✅ سجل دخول الآن");
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="card p-6 md:p-10 w-full max-w-md space-y-4">
        <div className="text-2xl font-black">تسجيل حساب</div>
        <div className="text-white/70 text-sm">إيميل + كلمة مرور</div>
        <input className="input" placeholder="الإيميل" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input" placeholder="كلمة المرور" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn btnPrimary w-full" onClick={signup}>تسجيل</button>
        <a className="btn w-full" href="/auth/login">عندي حساب</a>
        {msg ? <div className="text-white/80 text-sm">{msg}</div> : null}
      </div>
    </div>
  );
}
