"use client";

export default function PricingTable() {
  const checkout = async (plan: "monthly" | "yearly") => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Checkout failed");
    window.location.href = json.url;
  };

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h3>Monthly</h3>
        <div style={{ fontSize: 28, fontWeight: 700 }}>$79<span style={{ fontSize: 14, fontWeight: 400 }}>/mo</span></div>
        <ul>
          <li>AI Acceptable Use Policy</li>
          <li>LLM Data Handling Policy</li>
          <li>AI Governance Framework</li>
          <li>Risk Matrix + Vendor Template</li>
          <li>EU AI Act Risk Classification (template)</li>
          <li>PDF export</li>
        </ul>
        <button onClick={() => checkout("monthly")}>Start subscription</button>
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h3>Yearly</h3>
        <div style={{ fontSize: 28, fontWeight: 700 }}>$199<span style={{ fontSize: 14, fontWeight: 400 }}>/yr</span></div>
        <p style={{ color: "#666" }}>Best for teams needing ongoing updates.</p>
        <button onClick={() => checkout("yearly")}>Start yearly</button>
      </div>
    </div>
  );
}
