"use client";

import { useEffect, useState } from "react";

export default function ProductsClient() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:"", category:"", price:"", description:"" });
  const [msg, setMsg] = useState("");

  const load = async () => {
    setMsg("");
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) return setMsg("تعذر تحميل المنتجات");
    const js = await res.json();
    setItems(js.products || []);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        name: form.name, category: form.category, price: form.price, description: form.description
      })
    });
    if (!res.ok) return setMsg("فشل الإضافة");
    setForm({ name:"", category:"", price:"", description:"" });
    load();
  };

  const del = async (id) => {
    if (!confirm("حذف المنتج؟")) return;
    const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) return setMsg("فشل الحذف");
    load();
  };

  return (
    <div className="card p-6 md:p-10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xl font-black">المنتجات</div>
          <div className="text-white/60 text-sm">تظهر في منيو العميل مباشرة</div>
        </div>
        <button className="btn" onClick={load}>تحديث</button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
        <div className="font-black">إضافة منتج</div>
        <div className="grid md:grid-cols-2 gap-2">
          <input className="input" placeholder="الاسم" value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} />
          <input className="input" placeholder="القسم (مثال: مشروبات ساخنة)" value={form.category} onChange={(e)=>setForm(f=>({...f,category:e.target.value}))} />
          <input className="input" placeholder="السعر (رقم)" value={form.price} onChange={(e)=>setForm(f=>({...f,price:e.target.value}))} />
          <input className="input" placeholder="وصف مختصر" value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} />
        </div>
        <button className="btn btnPrimary" onClick={add}>إضافة</button>
      </div>

      {msg ? <div className="text-white/80">{msg}</div> : null}

      <div className="hr" />

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((p) => (
          <div key={p.id} className="card p-4 flex items-start justify-between gap-4">
            <div>
              <div className="font-extrabold">{p.name}</div>
              <div className="text-white/60 text-sm mt-1">{p.category || "بدون قسم"}</div>
              {p.description ? <div className="text-white/60 text-sm mt-1">{p.description}</div> : null}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="text-blue-200 font-black">{p.price} ﷼</div>
              <button className="btn" onClick={()=>del(p.id)}>حذف</button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 ? <div className="text-white/70">لا توجد منتجات</div> : null}
    </div>
  );
}
