import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const { data: auth } = await supabase.auth.getUser();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status,current_period_end")
    .eq("user_id", auth.user!.id)
    .maybeSingle();

  const { data: packs } = await supabase
    .from("generated_packs")
    .select("id, company_name, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const active = sub?.status === "active" || sub?.status === "trialing";

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto", display: "grid", gap: 14 }}>
      <h1>Dashboard</h1>
      <div style={{ color: "#666" }}>
        Subscription: <b>{sub?.status ?? "none"}</b> {sub?.current_period_end ? `(renews/ends ${new Date(sub.current_period_end).toLocaleDateString()})` : ""}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/generate">Generate new pack</Link>
        <Link href="/billing">Billing</Link>
      </div>

      {!active && (
        <div style={{ padding: 12, border: "1px solid #f2c", borderRadius: 8 }}>
          You need an active subscription to generate packs. <Link href="/pricing">Subscribe</Link>
        </div>
      )}

      <h2>Recent packs</h2>
      <ul>
        {(packs || []).map((p: any) => (
          <li key={p.id}>
            {p.company_name} — {new Date(p.created_at).toLocaleString()} — <code>{p.id}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
