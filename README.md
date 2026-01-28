# سعود منيو (SaaS) — ثيمين + طلبات (لوحة/واتساب/الاثنين)

## التشغيل
1) Supabase:
- أنشئ مشروع جديد
- SQL Editor: شغّل `supabase/schema.sql`

2) ضع متغيرات البيئة (Vercel أو محلي .env.local):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY   (سري جدًا)
- SESSION_SECRET              (أي نص طويل عشوائي)

3) محلي:
npm i
npm run dev

## المسارات
- /auth/signup  تسجيل
- /auth/login   دخول
- /dashboard    إنشاء منيو (tenant) + رابط
- /dashboard/products  إضافة/حذف منتجات
- /dashboard/orders    لوحة طلبات + صوت
- /dashboard/settings  اختيار ثيم + طريقة الطلب + واتساب
- /m/[slug]      منيو عام (ثيم حسب اختيار العميل)

## ملاحظة واتساب
اكتب رقم واتساب بصيغة دولية بدون + مثل:
966532212529
