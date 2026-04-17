"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().optional(),
  interest: z.string().min(1, "Choose a topic."),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)."),
  website: z.string().optional(), // honeypot (validated server-side)
});

export type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { interest: "general" },
  });

  async function onSubmit(values: ContactInput) {
    setServerMessage(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { ok?: boolean; message?: string };
    if (!res.ok || !data.ok) {
      setServerMessage(data.message ?? "We could not send your message. Please call us.");
      return;
    }
    reset();
    setServerMessage("Thank you. We received your message.");
  }

  const inputClass =
    "mt-1 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink shadow-inner outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/25";

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="contact-name">
            Name
          </label>
          <input id="contact-name" className={inputClass} autoComplete="name" {...register("name")} />
          {errors.name ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="contact-email">
            Email address
          </label>
          <input
            id="contact-email"
            type="email"
            className={inputClass}
            autoComplete="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="contact-phone">
            Phone number <span className="text-muted font-normal">(optional)</span>
          </label>
          <input id="contact-phone" type="tel" className={inputClass} autoComplete="tel" {...register("phone")} />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="contact-interest">
            Topic
          </label>
          <select id="contact-interest" className={inputClass} {...register("interest")}>
            <option value="general">General question</option>
            <option value="weight-loss">Assisted weight loss</option>
            <option value="aesthetics">Aesthetics & cosmetics</option>
            <option value="iv">IV therapy</option>
            <option value="peptides">Peptides</option>
            <option value="booking">Booking help</option>
          </select>
          {errors.interest ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {errors.interest.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="hidden">
        <label htmlFor="contact-website">Company website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className={`${inputClass} resize-y`}
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-sm text-red-700" role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Submit"}
      </Button>

      {serverMessage ? (
        <p className="text-sm font-medium text-accent" role="status">
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}
