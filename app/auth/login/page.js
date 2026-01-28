"use client";
export const dynamic = "force-dynamic";
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",   // ⭐ هذا أهم سطر
  cache: "no-store",
  body: JSON.stringify({ userId }),
});
