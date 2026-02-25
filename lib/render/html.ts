export function packToHtml(pack: any) {
  const esc = (s: string) =>
    String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const sectionList = (sections: any[]) =>
    (sections || [])
      .map(
        (s) => `
      <h3>${esc(s.heading)}</h3>
      <ul>${(s.bullets || []).map((b: string) => `<li>${esc(b)}</li>`).join("")}</ul>
    `
      )
      .join("");

  const riskClass = pack?.ai_act_risk_classification;
  const riskHtml = riskClass
    ? `
  <h2>EU AI Act – Risk Classification (Template)</h2>
  <ul>
    <li><b>Category:</b> ${esc(riskClass.category)}</li>
    <li><b>Rationale:</b> ${esc(riskClass.rationale)}</li>
    <li><b>Obligations (high-level):</b>
      <ul>${(riskClass.obligations || []).map((o: string) => `<li>${esc(o)}</li>`).join("")}</ul>
    </li>
  </ul>`
    : "";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial; padding: 28px; }
    h1 { font-size: 22px; margin-bottom: 6px; }
    h2 { font-size: 18px; margin-top: 18px; }
    h3 { font-size: 14px; margin-top: 12px; }
    ul { margin-top: 6px; }
    .muted { color: #666; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; vertical-align: top; }
    .disclaimer { margin-top: 18px; font-size: 11px; color: #666; }
    .pill { display:inline-block; padding:2px 8px; border:1px solid #ddd; border-radius:999px; font-size:12px; }
  </style>
</head>
<body>
  <h1>AI Compliance Policy Pack</h1>
  <div class="muted">Generated template. <span class="pill">EU + US</span> Not legal advice.</div>

  ${riskHtml}

  <h2>${esc(pack.acceptable_use_policy?.title || "AI Acceptable Use Policy")}</h2>
  ${sectionList(pack.acceptable_use_policy?.sections || [])}

  <h2>${esc(pack.llm_data_handling_policy?.title || "LLM Data Handling Policy")}</h2>
  ${sectionList(pack.llm_data_handling_policy?.sections || [])}

  <h2>${esc(pack.governance_framework?.title || "AI Governance Framework")}</h2>
  <h3>Roles</h3>
  <ul>
    ${(pack.governance_framework?.roles || []).map((r: any) => `
      <li><b>${esc(r.role)}</b>: ${(r.responsibilities || []).map(esc).join("; ")}</li>
    `).join("")}
  </ul>
  <h3>Controls</h3>
  <ul>${(pack.governance_framework?.controls || []).map((c: string) => `<li>${esc(c)}</li>`).join("")}</ul>

  <h2>AI Risk Assessment Matrix</h2>
  <table>
    <thead>
      <tr><th>System</th><th>Risk area</th><th>Likelihood</th><th>Impact</th><th>Mitigations</th></tr>
    </thead>
    <tbody>
      ${(pack.risk_matrix?.rows || []).map((row: any) => `
        <tr>
          <td>${esc(row.system || "")}</td>
          <td>${esc(row.risk_area || "")}</td>
          <td>${esc(String(row.likelihood || ""))}</td>
          <td>${esc(String(row.impact || ""))}</td>
          <td><ul>${(row.mitigations || []).map((m: string) => `<li>${esc(m)}</li>`).join("")}</ul></td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <h2>AI Vendor Assessment Template</h2>
  ${(pack.vendor_assessment_template?.questions || []).map((q: any) => `
    <h3>${esc(q.category || "")}</h3>
    <ul>${(q.items || []).map((i: string) => `<li>${esc(i)}</li>`).join("")}</ul>
  `).join("")}

  <div class="disclaimer">
    Disclaimer: This document is a template generated for internal drafting and planning purposes only and does not constitute legal advice.
    Consult qualified counsel to tailor documents for your organization, jurisdiction, and risk profile.
  </div>
</body>
</html>`;
}
