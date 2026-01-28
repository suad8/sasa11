"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const POLL_MS = 5000;

function formatTime(iso){
  try { return new Date(iso).toLocaleString("ar-SA"); } catch { return iso; }
}

export default function OrdersClient(){
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const lastSeen = useRef(null);

  const beep = useMemo(() => () => {
    try{
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = 880;
      g.gain.value = 0.06;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      setTimeout(()=>{ o.stop(); ctx.close(); }, 220);
    }catch{}
  }, []);

  const load = async () => {
    setMsg("");
    const res = await fetch("/api/orders/admin", { cache:"no-store" });
    if (!res.ok) return setMsg("تعذر تحميل الطلبات");
    const js = await res.json();
    const list = js.orders || [];
    setOrders(list);

    const newest = list[0]?.created_at || null;
    if (!lastSeen.current) lastSeen.current = newest;
    else if (newest && newest !== lastSeen.current) { beep(); lastSeen.current = newest; }
  };

  useEffect(()=>{
    load();
    const t = setInterval(load, POLL_MS);
    return ()=>clearInterval(t);
  }, []);

  const setStatus = async (id, status) => {
    await fetch("/api/orders/admin", {
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ id, status })
    });
    load();
  };

  return (
    <div className="card p-6 md:p-10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xl font-black">الطلبات</div>
          <div className="text-white/60 text-sm">صوت عند وصول طلب جديد + تحديث تلقائي</div>
        </div>
        <button className="btn" onClick={load}>تحديث</button>
      </div>

      {msg ? <div className="text-white/80">{msg}</div> : null}

      <div className="space-y-3">
        {orders.map((o)=>(
          <div key={o.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-black">#{String(o.id).slice(0,8)}</div>
              <div className="text-white/60 text-sm">{formatTime(o.created_at)}</div>
            </div>

            <div className="grid md:grid-cols-3 gap-2 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-white/60">الطريقة</div>
                <div className="font-bold">{o.order_type}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:col-span-2">
                <div className="text-white/60">تفاصيل</div>
                <div className="font-bold">{o.extra_info}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-white/60 text-sm">العناصر</div>
              <div className="mt-2 space-y-1">
                {(o.items||[]).map((it, idx)=>(
                  <div key={idx} className="flex items-center justify-between">
                    <div className="text-white/80">{it.name}</div>
                    <div className="text-blue-200 font-black">{it.price} ﷼</div>
                  </div>
                ))}
              </div>
              <div className="hr my-2" />
              <div className="flex items-center justify-between">
                <div className="font-black">الإجمالي</div>
                <div className="text-blue-200 font-black">{o.total} ﷼</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="badge">الحالة: {o.status}</span>
              <button className="btn" onClick={()=>setStatus(o.id, "new")}>جديد</button>
              <button className="btn" onClick={()=>setStatus(o.id, "in_progress")}>قيد التنفيذ</button>
              <button className="btn" onClick={()=>setStatus(o.id, "done")}>تم</button>
            </div>
          </div>
        ))}
        {orders.length===0 ? <div className="text-white/70">لا توجد طلبات</div> : null}
      </div>
    </div>
  );
}
