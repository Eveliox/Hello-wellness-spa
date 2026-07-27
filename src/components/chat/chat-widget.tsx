"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi! I'm the Hello You concierge. Ask me about services, hours, pricing, or booking a consultation.",
};

const QUICK_REPLIES = [
  "What are your hours?",
  "How does weight loss work?",
  "How much is IV therapy?",
  "Where are you located?",
];

const WHATSAPP_URL =
  "https://wa.me/17867803626?text=Hola+Hello+You+Wellness+Center%2C+me+gustar%C3%ADa+m%C3%A1s+informaci%C3%B3n.";

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (pathname?.startsWith("/checkout") || pathname?.startsWith("/admin")) {
    return null;
  }

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);
    trackEvent("chat_message_sent", { message_length: trimmed.length });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .slice(0, -1)
            .filter((m) => m.content.length > 0)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) {
        const fallback =
          response.status === 429
            ? "You've sent a lot of messages — try again in a few minutes, or tap WhatsApp below to reach us."
            : "Something went wrong. Please try WhatsApp or call us at (786) 780-3626.";
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: fallback };
          return copy;
        });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Connection error. Please try WhatsApp or call (786) 780-3626.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) trackEvent("chat_open");
  };

  return (
    <>
      {/* Toggle button — stacked above WhatsApp FAB */}
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className="fixed right-4 bottom-40 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-canvas shadow-[0_8px_24px_rgba(33,32,32,0.4)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/30 md:right-6 md:bottom-24 md:h-[60px] md:w-[60px]"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Hello You Wellness"
          className="fixed inset-x-4 bottom-56 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-2xl md:inset-x-auto md:right-6 md:bottom-40 md:h-[560px] md:max-h-[calc(100vh-12rem)] md:w-[380px]"
        >
          <header className="flex items-center gap-3 border-b border-ink/10 bg-ink px-4 py-3 text-canvas">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas/15 font-serif text-lg">
              H
            </div>
            <div className="flex-1">
              <p className="font-serif text-base leading-tight">Hello You concierge</p>
              <p className="text-xs opacity-80">Typically replies instantly</p>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2 text-sm text-canvas"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-ink/5 px-3.5 py-2 text-sm text-ink"
                }
              >
                {m.content || (
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink/40" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink/40 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink/40 [animation-delay:300ms]" />
                  </span>
                )}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs text-ink transition hover:border-ink/40 hover:bg-ink/5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Persistent CTAs — always visible above the input */}
          <div className="flex gap-2 border-t border-ink/10 bg-ink/[0.02] px-3 py-2">
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("chat_book_clicked")}
              className="flex-1 rounded-full bg-ink px-3 py-2 text-center text-xs font-semibold text-canvas transition hover:opacity-90"
            >
              Book consultation
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("chat_whatsapp_clicked")}
              className="flex-1 rounded-full border border-ink/20 px-3 py-2 text-center text-xs font-semibold text-ink transition hover:bg-ink/5"
            >
              Message on WhatsApp
            </a>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-ink/10 px-3 py-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder="Type your question…"
              disabled={streaming}
              className="max-h-32 flex-1 resize-none rounded-2xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-ink/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={streaming || input.trim().length === 0}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition hover:opacity-90 disabled:opacity-40"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m22 2-7 20-4-9-9-4z" />
              </svg>
            </button>
          </form>

          <p className="border-t border-ink/10 bg-ink/[0.02] px-4 py-2 text-[10px] leading-snug text-ink/50">
            Not medical advice. For clinical questions, book a consultation or message us on WhatsApp.
          </p>
        </div>
      )}
    </>
  );
}
