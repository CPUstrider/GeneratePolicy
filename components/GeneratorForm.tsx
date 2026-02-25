"use client";

import { useState } from "react";

export default function GeneratorForm() {
  const [companyName, setCompanyName] = useState("");
  const [jurisdiction, setJurisdiction] = useState<"EU" | "US" | "EU+US">("EU+US");
  const [industry, setIndustry] = useState("");
  const [usesLLMs, setUsesLLMs] = useState(true);
  const [output, setOutput] = useState<any>(null);
  const [packId, setPackId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setOutput(null);
    setPackId(null);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName,
        jurisdiction,
        industry,
        usesLLMs,
        useCases: ["DevTools", "Support"],
        dataTypes: ["PII", "SourceCode"],
        vendors: ["OpenAI"],
        employeeCount: 50
      })
    });
    setLoading(false);

    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "Error");
      return;
    }
    setOutput(json.output);
    setPackId(json.packId);
  };

  const exportPdf = async () => {
    if (!packId) return;
    const res = await fetch("/api/export/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packId })
    });
    if (!res.ok) return alert("Export failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${companyName || "policy-pack"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <label>Company name</label>
        <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." />

        <label>Jurisdiction</label>
        <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value as any)}>
          <option value="EU+US">EU + US</option>
          <option value="EU">EU</option>
          <option value="US">US</option>
        </select>

        <label>Industry</label>
        <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="SaaS / Fintech / Healthcare..." />

        <label>
          <input type="checkbox" checked={usesLLMs} onChange={(e) => setUsesLLMs(e.target.checked)} /> Uses LLMs
        </label>

        <button onClick={generate} disabled={loading || !companyName}>
          {loading ? "Generating..." : "Generate pack"}
        </button>
      </div>

      {output && (
        <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
          <h2>Preview (JSON)</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(output, null, 2)}</pre>
          <button onClick={exportPdf} disabled={!packId}>Download PDF</button>
        </div>
      )}
    </div>
  );
}
