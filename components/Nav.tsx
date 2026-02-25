"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #eee" }}>
      <Link href="/" style={{ fontWeight: 700, textDecoration: "none", color: "#111" }}>AI Policy OS</Link>
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/pricing">Pricing</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
