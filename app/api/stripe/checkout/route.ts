import { NextResponse } from "next/server";
import { stripe, appUrl } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const plan = body.plan === "yearly" ? "yearly" : "monthly";

  const price =
    plan === "yearly"
      ? process.env.STRIPE_PRICE_ID_YEARLY!
      : process.env.STRIPE_PRICE_ID_MONTHLY!;

  const { data: subRow } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  let customerId = subRow?.stripe_customer_id as string | undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: auth.user.email ?? undefined,
      metadata: { supabase_user_id: auth.user.id }
    });
    customerId = customer.id;

    await supabase.from("subscriptions").upsert({
      user_id: auth.user.id,
      stripe_customer_id: customerId,
      status: "none"
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    success_url: appUrl("/dashboard?paid=1"),
    cancel_url: appUrl("/pricing"),
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { supabase_user_id: auth.user.id }
    }
  });

  return NextResponse.json({ url: session.url });
}
