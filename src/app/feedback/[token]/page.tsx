import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { FeedbackForm } from "@/components/feedback/feedback-form";

export const metadata: Metadata = {
  title: "Share your feedback",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ token: string }> };

export default async function FeedbackPage({ params }: Props) {
  const { token } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) notFound();

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("review_requests")
    .select("id, token, patient_name, service, submitted_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) notFound();

  const firstName = data.patient_name?.trim().split(/\s+/)[0] ?? "there";
  const alreadySubmitted = Boolean(data.submitted_at);

  return (
    <main className="min-h-[80vh] bg-canvas py-16">
      <Container className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
          {site.shortBrand}
        </p>

        {alreadySubmitted ? (
          <>
            <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Thanks — we already got your feedback.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              If you meant to add something, call us at{" "}
              <a href={`tel:${site.phoneTel}`} className="font-semibold text-ink underline-offset-2 hover:underline">
                {site.phoneDisplay}
              </a>{" "}
              or reply to the text and we&apos;ll pick it up from there.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Hi {firstName} — how did we do?
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Takes 30 seconds. Your answer helps us take better care of you and everyone who
              walks through the door.
            </p>

            <div className="mt-8">
              <FeedbackForm token={data.token} />
            </div>
          </>
        )}
      </Container>
    </main>
  );
}
