import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { packToHtml } from "@/lib/render/html";
import { htmlToPdfBuffer } from "@/lib/render/pdf";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { packId } = await req.json();
  const { data: pack } = await supabase
    .from("generated_packs")
    .select("output, company_name, user_id")
    .eq("id", packId)
    .single();

  if (!pack) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (pack.user_id !== auth.user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const html = packToHtml(pack.output);
  const pdf = await htmlToPdfBuffer(html);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${(pack.company_name || "policy-pack").replaceAll('"', "")}.pdf"`
    }
  });
}
