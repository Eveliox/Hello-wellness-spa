import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { OrderForm } from "@/components/admin/order-form";

export const metadata: Metadata = {
  title: "Order Tracker | Hello You Wellness",
  robots: { index: false },
};

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !session || session.value !== adminPassword) {
    redirect("/admin/login");
  }

  const webhookConfigured = Boolean(process.env.GOOGLE_ORDERS_WEBHOOK_URL);

  return (
    <main className="min-h-screen bg-canvas py-10">
      <Container className="max-w-2xl space-y-6">
        <div>
          <Link
            href="/admin"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:text-ink"
          >
            ← Back to admin
          </Link>
          <h1 className="mt-3 font-display text-3xl text-ink">Order tracker</h1>
        </div>

        {webhookConfigured ? (
          <OrderForm />
        ) : (
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 text-sm text-muted shadow-sm sm:p-8">
            <p className="font-semibold text-ink">Google Sheet webhook not configured.</p>
            <p className="mt-2">
              Set <code>GOOGLE_ORDERS_WEBHOOK_URL</code> and{" "}
              <code>GOOGLE_ORDERS_WEBHOOK_SECRET</code> in Vercel, then redeploy. Setup
              instructions live in{" "}
              <code>docs/apps-script-order-tracker/Code.gs</code>.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
