import Image from "next/image";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";

export const metadata: Metadata = createMetadata({
  title: "Store",
  description: `Shop curated skincare and wellness essentials from ${site.name}—online checkout coming soon.`,
  path: "/store",
});

const products = [
  {
    name: "Barrier cream · SPF 40",
    price: "$48",
    note: "Placeholder product — wire to Shopify, WooCommerce, or Medusa later.",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Post-treatment cleansing balm",
    price: "$36",
    note: "Placeholder product — sync inventory from your ecommerce platform.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Travel electrolyte sticks",
    price: "$28",
    note: "Placeholder product — ideal for upsell after IV visits.",
    image: "https://images.unsplash.com/photo-1512069772990cfa7270ee436?w=800&q=80&auto=format&fit=crop",
  },
];

export default function StorePage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <TrustChip>Retail</TrustChip>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Curated essentials that extend your in-studio results
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            This page is structured for ecommerce: product grid, merchandising notes, and a primary CTA to your
            future checkout domain.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={site.externalStoreUrl} size="lg">
              Open external store (placeholder)
            </Button>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg">
              Call for pick-up
            </Button>
            <Button href={site.social.instagram} variant="secondary" size="lg">
              Instagram
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((p) => (
              <article
                key={p.name}
                className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-sm"
              >
                <div className="relative aspect-square">
                  <Image src={p.image} alt="" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-xl text-ink">{p.name}</h2>
                  <p className="mt-2 text-sm text-muted">{p.note}</p>
                  <p className="mt-4 text-sm font-semibold text-ink">{p.price}</p>
                  <Button variant="secondary" className="mt-auto w-full" href={site.externalStoreUrl}>
                    View product (placeholder)
                  </Button>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-faint">
            Tip: point `site.externalStoreUrl` in `src/content/site.ts` to Shopify once live.
          </p>
        </Container>
      </section>
    </>
  );
}
