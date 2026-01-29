"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    setMsg("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(j?.error || "فشل الدخول");
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="card p-6 md:p-10 w-full max-w-md space-y-4">
        <div className="text-2xl font-black">دخول الأدمن</div>
        <input className="input" type="password" placeholder="كلمة السر" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn btnPrimary w-full" onClick={login}>دخول</button>
        {msg ? <div className="text-sm text-white/80">{msg}</div> : null}
      </div>
    </div>
  );
}
