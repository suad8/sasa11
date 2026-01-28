import DashNav from "@/components/DashNav";
import dynamic from "next/dynamic";

const ProductsClient = dynamic(() => import("./ProductsClient.jsx"), { ssr: false });

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <DashNav />
      <ProductsClient />
    </div>
  );
}
