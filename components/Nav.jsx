"use client";
import Link from "next/link";

export default function Nav({ authed }) {
  return (
    <div className="card p-4 md:p-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-xs text-white/60">سعود منيو</div>
        <div className="text-xl font-black">منصة المنيو والطلبات</div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link className="btn" href="/">الرئيسية</Link>
        <Link className="btn" href="/m/demo">ديمو</Link>
        {authed ? (
          <>
            <Link className="btn" href="/dashboard">لوحة التحكم</Link>
            <form action="/auth/logout" method="post">
              <button className="btn" type="submit">تسجيل خروج</button>
            </form>
          </>
        ) : (
          <>
            <Link className="btn" href="/auth/login">دخول</Link>
            <Link className="btn btnPrimary" href="/auth/signup">تسجيل</Link>
          </>
        )}
      </div>
    </div>
  );
}
