import { cookies } from "next/headers";
import { z } from "zod";

const bodySchema = z.object({
  product: z.string().min(1, "product is required").max(300),
  dateOrdered: z.string().min(1, "dateOrdered is required"),
  expectedArrival: z.string().optional().or(z.literal("").transform(() => undefined)),
  cost: z.string().max(120).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().max(2000).optional().or(z.literal("").transform(() => undefined)),
});

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!adminPassword || !session || session.value !== adminPassword) {
    return Response.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.GOOGLE_ORDERS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_ORDERS_WEBHOOK_SECRET;
  if (!webhookUrl || !secret) {
    return Response.json(
      {
        ok: false,
        error:
          "Google Sheet webhook not configured. Set GOOGLE_ORDERS_WEBHOOK_URL and GOOGLE_ORDERS_WEBHOOK_SECRET in Vercel.",
      },
      { status: 503 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret,
        product: parsed.data.product,
        dateOrdered: parsed.data.dateOrdered,
        expectedArrival: parsed.data.expectedArrival ?? "",
        cost: parsed.data.cost ?? "",
        notes: parsed.data.notes ?? "",
      }),
      // Apps Script web apps 302-redirect to the actual response — follow it.
      redirect: "follow",
    });
  } catch (err) {
    console.error("[admin/orders/add] webhook fetch threw", err);
    return Response.json(
      { ok: false, error: "Could not reach the Google Sheet. Try again in a moment." },
      { status: 502 },
    );
  }

  const upstreamText = await upstream.text();
  let upstreamJson: { ok?: boolean; error?: string } = {};
  try {
    upstreamJson = JSON.parse(upstreamText);
  } catch {
    console.error("[admin/orders/add] upstream returned non-JSON", upstreamText.slice(0, 200));
    return Response.json(
      { ok: false, error: "Sheet webhook returned an unexpected response." },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstreamJson.ok) {
    return Response.json(
      { ok: false, error: upstreamJson.error ?? "Sheet webhook rejected the request." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
