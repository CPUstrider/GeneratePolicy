import PricingTable from "@/components/PricingTable";

export default function PricingPage() {
  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto", display: "grid", gap: 16 }}>
      <h1>Pricing</h1>
      <p style={{ color: "#666" }}>
        Subscription required to generate and export policy packs.
      </p>
      <PricingTable />
    </div>
  );
}
