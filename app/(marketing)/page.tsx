import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto", display: "grid", gap: 18 }}>
      <h1 style={{ fontSize: 40, margin: 0 }}>AI compliance templates in 10 minutes.</h1>
      <p style={{ color: "#555", fontSize: 16, marginTop: 0 }}>
        Generate audit-ready internal AI policies and risk templates for <b>EU AI Act</b> and <b>US best practices</b>.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        <div>✅ AI Acceptable Use Policy</div>
        <div>✅ LLM Data Handling Policy</div>
        <div>✅ AI Governance Framework</div>
        <div>✅ Risk Matrix + Vendor Assessment</div>
        <div>✅ EU AI Act risk classification (template)</div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/pricing">View pricing</Link>
        <Link href="/generate">Generate (requires login)</Link>
      </div>

      <p style={{ color: "#777", fontSize: 12 }}>
        Disclaimer: Generated documents are templates and do not constitute legal advice.
      </p>
    </div>
  );
}
