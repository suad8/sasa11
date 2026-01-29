import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) redirect("/auth/login");

  return children;
}
