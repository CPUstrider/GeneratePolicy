import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";

const InputSchema = z.object({
  companyName: z.string().min(2),
  jurisdiction: z.enum(["EU", "US", "EU+US"]),
  industry: z.string().optional(),
  usesLLMs: z.boolean(),
  useCases: z.array(z.enum(["HR", "Support", "DecisionMaking", "Analytics", "DevTools"])).default([]),
  dataTypes: z.array(z.enum(["PII", "PHI", "Financial", "SourceCode", "CustomerChats", "NoneSensitive"])).default([]),
  vendors: z.array(z.string()).default([]),
  employeeCount: z.number().int().min(1).max(5000).optional()
});

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // subscription gate
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status,current_period_end")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  const active = sub?.status === "active" || sub?.status === "trialing";
  if (!active) return NextResponse.json({ error: "subscription_required" }, { status: 402 });

  const json = await req.json();
  const input = InputSchema.parse(json);

  const system = `You are an AI compliance documentation assistant.
Generate professional, audit-ready internal documentation templates for AI usage.
Do NOT claim legal advice. Use clear policy language.
Consider EU AI Act high-level risk categories and US best practices.`;

  const user = `Create a policy pack for:
Company: ${input.companyName}
Jurisdiction: ${input.jurisdiction}
Industry: ${input.industry ?? "General SaaS"}
Uses LLMs: ${input.usesLLMs}
Use cases: ${input.useCases.join(", ") || "None specified"}
Data types: ${input.dataTypes.join(", ") || "None specified"}
Vendors: ${input.vendors.join(", ") || "Not specified"}
Employee count: ${input.employeeCount ?? "Not specified"}

Output JSON with:
- ai_act_risk_classification: { category: "minimal"|"limited"|"high"|"prohibited", rationale, obligations:string[] } (include if jurisdiction includes EU)
- acceptable_use_policy: { title, sections:[{heading, bullets:string[]}] }
- llm_data_handling_policy: { title, sections:[{heading, bullets:string[]}] }
- governance_framework: { title, roles:[{role,responsibilities:string[]}], controls:string[] }
- risk_matrix: { rows:[{system, risk_area, likelihood, impact, mitigations:string[]}] }
- vendor_assessment_template: { questions:[{category, items:string[]}] }

Keep it concise but credible, suitable for a SMB SaaS company.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    response_format: { type: "json_object" }
  });

  const output = JSON.parse(completion.choices[0]?.message?.content ?? "{}");

  const { data: saved, error } = await supabase
    .from("generated_packs")
    .insert({
      user_id: auth.user.id,
      company_name: input.companyName,
      jurisdiction: input.jurisdiction,
      industry: input.industry ?? null,
      inputs: input,
      output
    })
    .select("id, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ packId: saved.id, output });
}
