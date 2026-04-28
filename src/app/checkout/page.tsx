import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCheckoutProduct } from "@/lib/checkout-products";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Hello You Wellness Center",
  robots: { index: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: slug } = await searchParams;
  if (!slug) redirect("/store");

  const product = getCheckoutProduct(slug);
  if (!product) redirect("/store");

  return <CheckoutClient product={product} />;
}
