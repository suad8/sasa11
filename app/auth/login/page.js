const login = async () => {
  setMsg("");
  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);

    // بعض الأحيان user يكون داخل session
    const userId = data?.user?.id || data?.session?.user?.id;
    if (!userId) return setMsg("تم الدخول لكن ما قدرنا نجيب userId.");

    // create server session cookie
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return setMsg("فشل إنشاء جلسة" + (t ? `: ${t}` : ""));
    }

    window.location.href = "/dashboard";
  } catch (e) {
    setMsg(e?.message || "صار خطأ غير متوقع");
  }
};
