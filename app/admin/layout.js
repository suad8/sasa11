import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }) {
  if (!isAdmin()) redirect("/admin/login");
  return children;
}
