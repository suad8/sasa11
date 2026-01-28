"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

function money(n){ return `${n} ﷼`; }

function applyTheme(themeId){
  // Two themes: warm_cards / modern_glass
  const r = document.documentElement;
  if (themeId === "warm_cards"){
    r.style.setProperty("--bg", "#f4efe4");
    r.style.setProperty("--card", "rgba(255,255,255,.85)");
    r.style.setProperty("--border", "rgba(58,42,26,.18)");
    r.style.setProperty("--text", "#3a2a1a");
    r.style.setProperty("--muted", "rgba(58,42,26,.70)");
    r.style.setProperty("--primary", "#5a2d1a");
    r.style.setProperty("--accent", "#7c4a2e");
  }else{
    r.style.setProperty("--bg", "#071125");
    r.style.setProperty("--card", "rgba(255,255,255,.06)");
    r.style.setProperty("--border", "rgba(255,255,255,.10)");
    r.style.setProperty("--text", "rgba(255,255,255,.92)");
    r.style.setProperty("--muted", "rgba(255,255,255,.70)");
    r.style.setProperty("--primary", "#2563eb");
    r.style.setProperty("--accent", "#93c5fd");
  }
}

export default function PublicMenu({ params }){
  const slug = params.slug;
  const sb = useMemo(()=>supabaseBrowser(), []);
  const [tenant, setTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const total = useMemo(()=>cart.reduce((s,x)=>s+x.price,0), [cart]);

  useEffect(()=>{
    (async ()=>{
      const t = await sb.from("tenants").select("*").eq("slug", slug).maybeSingle();
      if (t.data) {
        setTenant(t.data);
        applyTheme(t.data.theme_id);
      }
      const p = await sb.from("products").select("*").eq("tenant_slug", slug).order("category").order("name");
      if (p.data) setProducts(p.data);
    })();
  }, [slug]);

  const grouped = useMemo(()=>{
    const m = {};
    for (const p of products){
      const c = p.category || "بدون قسم";
      (m[c] = m[c] || []).push(p);
    }
    return m;
  }, [products]);

  const add = (p)=>setCart(c=>[...c, { id:p.id, name:p.name, price:p.price }]);
  const removeAt = (i)=>setCart(c=>c.filter((_,idx)=>idx!==i));

  const send = async ()=>{
    if (cart.length===0) return alert("السلة فارغة");
    if (!orderType) return alert("اختر الطريقة");
    if (!extraInfo.trim()) return alert("أكمل البيانات");

    const payload = {
      tenant_slug: slug,
      order_type: orderType,
      extra_info: extraInfo.trim(),
      total,
      items: cart
    };

    const res = await fetch("/api/orders", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) return alert("فشل إرسال الطلب");

    const js = await res.json();

    // WhatsApp mode: open WA with message
    const mode = tenant?.order_mode || "both";
    if (mode === "whatsapp" || mode === "both"){
      const wa = tenant?.whatsapp_number || js.whatsapp;
      if (wa){
        let msg = `طلب جديد من ${tenant?.brand_name || slug}:\n`;
        cart.forEach(x => msg += `- ${x.name} (${x.price} ﷼)\n`);
        msg += `\nالإجمالي: ${total} ﷼\n${orderType}: ${extraInfo.trim()}`;
        window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, "_blank");
      }
    }

    alert("تم إرسال الطلب ✅");
    setCart([]); setOrderType(""); setExtraInfo("");
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="card p-6 md:p-10 text-center sticky top-0 z-10" style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)" }}>
        <div className="text-2xl md:text-3xl font-black">{tenant?.brand_name || "منيو"}</div>
        <div className="mt-2" style={{ color: "var(--muted)" }}>
          {tenant?.theme_id === "warm_cards" ? "ثيم دافي" : "ثيم عصري"}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Object.keys(grouped).map((c)=>(
            <a key={c} className="btn" href={`#cat-${encodeURIComponent(c)}`}>{c}</a>
          ))}
        </div>
      </div>

      {Object.entries(grouped).map(([cat, items])=>(
        <section key={cat} id={`cat-${encodeURIComponent(cat)}`} className="space-y-3 scroll-mt-32">
          <h2 className="text-xl font-black px-1">{cat}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((p)=>(
              <div key={p.id} className="card p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-extrabold">{p.name}</div>
                  {p.description ? <div className="text-sm mt-1" style={{ color:"var(--muted)" }}>{p.description}</div> : null}
                </div>
                <button className="btn btnPrimary shrink-0" onClick={()=>add(p)}>{money(p.price)}</button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* cart */}
      <div className="fixed bottom-0 left-0 right-0 border-t" style={{ background: "color-mix(in srgb, var(--bg) 92%, transparent)", borderColor:"var(--border)" }}>
        <div className="max-w-6xl mx-auto p-4 space-y-2">
          <div className="font-black">🛒 السلة</div>

          <div className="text-sm" style={{ color:"var(--muted)" }}>
            {cart.length===0 ? "فارغة" : cart.map((x,i)=>(
              <div key={i} className="flex items-center justify-between gap-3 py-1">
                <div className="truncate">{x.name}</div>
                <div className="flex items-center gap-2 shrink-0">
                  <div style={{ color:"var(--accent)" }} className="font-black">{money(x.price)}</div>
                  <button className="btn" onClick={()=>removeAt(i)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="hr" />

          <div className="flex flex-col md:flex-row gap-2">
            <select className="input" value={orderType} onChange={(e)=>setOrderType(e.target.value)}>
              <option value="">اختر الطريقة</option>
              <option value="استلام">استلام</option>
              <option value="توصيل">توصيل</option>
            </select>
            <input className="input" value={extraInfo} onChange={(e)=>setExtraInfo(e.target.value)}
              placeholder={orderType === "توصيل" ? "العنوان / رقم اللوحة" : orderType === "استلام" ? "رقم الطاولة / الاسم" : "تفاصيل إضافية"} />
            <button className="btn btnPrimary" onClick={send}>تأكيد الطلب ({money(total)})</button>
          </div>
        </div>
      </div>
    </div>
  );
}
