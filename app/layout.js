export const metadata = {
  title: "سعود منيو",
  description: "منصة سعود منيو لصناعة المنيو واستقبال الطلبات",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </body>
    </html>
  );
}
