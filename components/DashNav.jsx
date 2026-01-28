"use client";
import Link from "next/link";

export default function DashNav() {
  return (
    <div className="card p-4 md:p-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-xs text-white/60">سعود منيو</div>
        <div className="text-xl font-black">لوحة التحكم</div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link className="btn" href="/dashboard">نظرة عامة</Link>
        <Link className="btn" href="/dashboard/products">المنتجات</Link>
        <Link className="btn" href="/dashboard/orders">الطلبات</Link>
        <Link className="btn" href="/dashboard/settings">الإعدادات</Link>
        <form action="/auth/logout" method="post">
          <button className="btn" type="submit">تسجيل خروج</button>
        </form>
      </div>
    </div>
  );
}
