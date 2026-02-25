"use client";

export default function BillingPage() {
  const openPortal = async () => {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Failed");
    window.location.href = json.url;
  };

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto", display: "grid", gap: 12 }}>
      <h1>Billing</h1>
      <p style={{ color: "#666" }}>Manage your subscription via Stripe Customer Portal.</p>
      <button onClick={openPortal}>Open billing portal</button>
    </div>
  );
}
