import Stripe from "stripe";
import { z } from "zod";
import { getCheckoutProduct } from "@/lib/checkout-products";

const bodySchema = z.object({
  productSlug: z.string().min(1).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(40).optional(),
  fulfillmentMethod: z.enum(["ship", "pickup", "in-clinic"]),
  intake: z
    .object({
      primaryGoal: z.string().optional(),
      previousGLP1Use: z.string().optional(),
      allergiesNotes: z.string().max(500).optional(),
    })
    .optional(),
  researchAcknowledgment: z.boolean().optional(),
  orderNotes: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ ok: false, message: "Payment not configured." }, { status: 503 });
  }

  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
    }

    const {
      productSlug,
      customerEmail,
      customerPhone,
      fulfillmentMethod,
      intake,
      researchAcknowledgment,
      orderNotes,
    } = parsed.data;

    const product = getCheckoutProduct(productSlug);
    if (!product) {
      return Response.json({ ok: false, message: "Product not found." }, { status: 404 });
    }

    if (product.isPeptide && !researchAcknowledgment) {
      return Response.json(
        { ok: false, message: "Research acknowledgment required for peptide products." },
        { status: 400 },
      );
    }

    const stripe = new Stripe(secretKey);
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

    const metadata: Record<string, string> = {
      product_slug: productSlug,
      fulfillment: fulfillmentMethod,
    };
    if (customerPhone) metadata.phone = customerPhone;
    if (orderNotes) metadata.order_notes = orderNotes.slice(0, 500);
    if (researchAcknowledgment) metadata.research_ack = "true";
    if (intake?.primaryGoal) metadata.intake_goal = intake.primaryGoal;
    if (intake?.previousGLP1Use) metadata.intake_glp1 = intake.previousGLP1Use;
    if (intake?.allergiesNotes) metadata.intake_allergies = intake.allergiesNotes.slice(0, 500);

    const imageUrl = product.image.startsWith("/")
      ? `${baseUrl}${product.image}`
      : product.image;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [imageUrl],
            },
            unit_amount: product.priceCents,
          },
          quantity: 1,
        },
      ],
      metadata,
      ...(fulfillmentMethod === "ship"
        ? { shipping_address_collection: { allowed_countries: ["US"] } }
        : {}),
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?product=${productSlug}`,
    });

    return Response.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[checkout] stripe error", err);
    return Response.json(
      { ok: false, message: "Could not create checkout session." },
      { status: 500 },
    );
  }
}
