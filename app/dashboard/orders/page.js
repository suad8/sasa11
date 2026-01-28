import DashNav from "@/components/DashNav";
import dynamic from "next/dynamic";

const OrdersClient = dynamic(() => import("./OrdersClient.jsx"), { ssr: false });

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <DashNav />
      <OrdersClient />
    </div>
  );
}
