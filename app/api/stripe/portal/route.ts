import { NextResponse } from "next/server";
import { stripe, appUrl } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: subRow } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  const customerId = subRow?.stripe_customer_id;
  if (!customerId) return NextResponse.json({ error: "no_customer" }, { status: 400 });

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: appUrl("/dashboard")
  });

  return NextResponse.json({ url: portal.url });
}
