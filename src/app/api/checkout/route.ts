import Stripe from "stripe";
import { z } from "zod";
import { getCheckoutProduct } from "@/lib/checkout-products";
import { emailFallbackPayload } from "@/lib/email";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const bodySchema = z.object({
  productSlug: z.string().min(1).max(100),
  variantSlug: z.string().min(1).max(100).optional(),
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
  glp1Intake: z
    .object({
      currentlyOnGLP1: z.enum(["yes", "no"]),
      currentDose: z.string().max(60).optional(),
      dosePreference: z.enum(["stay", "increase", "decrease"]).optional(),
      sideEffects: z.enum(["yes", "no"]).optional(),
      sideEffectsDetails: z.string().max(500).optional(),
      medicationOnHand: z.enum(["yes", "no"]).optional(),
    })
    .optional(),
  orderNotes: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const rl = await checkRateLimit(request, "checkout");
  if (!rl.allowed) return rateLimitResponse(rl);

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
      variantSlug,
      customerEmail,
      customerPhone,
      fulfillmentMethod,
      intake,
      glp1Intake,
      orderNotes,
    } = parsed.data;

    const product = getCheckoutProduct(productSlug);
    if (!product) {
      return Response.json({ ok: false, message: "Product not found." }, { status: 404 });
    }

    const variant = variantSlug
      ? product.variants?.find((v) => v.slug === variantSlug)
      : undefined;
    if (variantSlug && !variant) {
      return Response.json({ ok: false, message: "Variant not found." }, { status: 404 });
    }

    const effectivePriceCents = variant?.priceCents ?? product.priceCents;
    const effectiveName = variant ? `${product.name} — ${variant.label}` : product.name;

    const stripe = new Stripe(secretKey);
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

    const metadata: Record<string, string> = {
      product_slug: productSlug,
      fulfillment: fulfillmentMethod,
    };
    if (variant) metadata.variant_slug = variant.slug;
    if (customerPhone) metadata.phone = customerPhone;
    if (orderNotes) metadata.order_notes = orderNotes.slice(0, 500);
    if (intake?.primaryGoal) metadata.intake_goal = intake.primaryGoal;
    if (intake?.previousGLP1Use) metadata.intake_glp1 = intake.previousGLP1Use;
    if (intake?.allergiesNotes) metadata.intake_allergies = intake.allergiesNotes.slice(0, 500);
    if (glp1Intake) {
      metadata.glp1_current = glp1Intake.currentlyOnGLP1;
      if (glp1Intake.currentDose) metadata.glp1_dose = glp1Intake.currentDose;
      if (glp1Intake.dosePreference) metadata.glp1_pref = glp1Intake.dosePreference;
      if (glp1Intake.sideEffects) metadata.glp1_side_effects = glp1Intake.sideEffects;
      if (glp1Intake.sideEffectsDetails)
        metadata.glp1_side_effects_details = glp1Intake.sideEffectsDetails.slice(0, 480);
      if (glp1Intake.medicationOnHand) metadata.glp1_med_on_hand = glp1Intake.medicationOnHand;
    }

    // Fire-and-forget: persist GLP-1 intake to Supabase if configured.
    // Never blocks the checkout flow.
    if (glp1Intake) {
      void persistGlp1Intake({
        productSlug,
        variantSlug: variant?.slug,
        customerEmail,
        customerPhone,
        intake: glp1Intake,
      }).catch((err) => console.error("[checkout] glp1 persist threw", err));
    }

    const imageUrl = product.image.startsWith("/")
      ? `${baseUrl}${product.image}`
      : product.image;

    // TODO(analytics): Wire GA4 Measurement Protocol `purchase` event from a
    // Stripe webhook (does not yet exist — create /api/stripe/webhook and
    // subscribe to `checkout.session.completed`). Do NOT fire `purchase` from
    // the client-side /checkout/success page — Stripe redirects are unreliable
    // (users close tabs, ad-blockers strip params) and firing both client +
    // server risks double-counting without event_id dedup.
    //
    // Envelope shape when implementing (send to https://www.google-analytics.com/mp/collect):
    //   {
    //     client_id: <cid from _ga cookie or falls back to session.id>,
    //     events: [{
    //       name: "purchase",
    //       params: {
    //         transaction_id: session.id,
    //         value: session.amount_total / 100,
    //         currency: session.currency,
    //         items: [{ item_id: productSlug, item_name: effectiveName,
    //                   price: effectivePriceCents / 100, quantity: 1 }]
    //       }
    //     }]
    //   }
    // Requires GA4 Measurement Protocol API secret (Admin → Data Streams →
    // Measurement Protocol API secrets) stored as GA_MP_API_SECRET.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: effectiveName,
              images: [imageUrl],
            },
            unit_amount: effectivePriceCents,
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

async function persistGlp1Intake(args: {
  productSlug: string;
  variantSlug: string | undefined;
  customerEmail: string;
  customerPhone: string | undefined;
  intake: {
    currentlyOnGLP1: "yes" | "no";
    currentDose?: string;
    dosePreference?: "stay" | "increase" | "decrease";
    sideEffects?: "yes" | "no";
    sideEffectsDetails?: string;
    medicationOnHand?: "yes" | "no";
  };
}) {
  let dbFailure: string | null = null;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      dbFailure = "Supabase env vars not configured";
    } else {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from("glp1_intake_submissions").insert({
        product_slug: args.productSlug,
        variant_slug: args.variantSlug ?? null,
        customer_email: args.customerEmail,
        customer_phone: args.customerPhone ?? null,
        currently_on_glp1: args.intake.currentlyOnGLP1,
        current_dose: args.intake.currentDose ?? null,
        dose_preference: args.intake.dosePreference ?? null,
        side_effects: args.intake.sideEffects ?? null,
        side_effects_details: args.intake.sideEffectsDetails ?? null,
        medication_on_hand: args.intake.medicationOnHand ?? null,
      });
      if (error) {
        console.error("[checkout] glp1 db error", error);
        dbFailure = `Supabase insert error: ${error.message}`;
      }
    }
  } catch (err) {
    console.error("[checkout] glp1 supabase threw", err);
    dbFailure = `Supabase client threw: ${err instanceof Error ? err.message : String(err)}`;
  }

  if (dbFailure) {
    await emailFallbackPayload({
      routeName: "checkout-glp1",
      reason: dbFailure,
      payload: args,
    });
  }
}
