"use client";

import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const WHATSAPP_URL =
  "https://wa.me/17867803626?text=Hola+Hello+You+Wellness+Center%2C+me+gustar%C3%ADa+m%C3%A1s+informaci%C3%B3n.";

export function WhatsAppFab() {
  const pathname = usePathname();
  if (pathname?.startsWith("/checkout") || pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onClick={() => trackEvent("click_whatsapp", { link_location: "fab" })}
      className="group fixed right-4 bottom-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:bg-[#1ebd5b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30 md:right-6 md:bottom-6 md:h-[60px] md:w-[60px]"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0a11.94 11.94 0 0 0-10.14 18l-1.7 6.2 6.36-1.66A11.94 11.94 0 0 0 12 24a11.86 11.86 0 0 0 8.52-20.52ZM12 22a9.93 9.93 0 0 1-5.06-1.38l-.36-.21-3.78.98 1-3.69-.23-.38A9.94 9.94 0 1 1 12 22Zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07a8.16 8.16 0 0 1-2.39-1.47 9 9 0 0 1-1.66-2.07c-.17-.3 0-.46.13-.61s.3-.35.45-.52.2-.3.3-.5.05-.37 0-.52-.67-1.6-.92-2.2-.49-.5-.67-.5h-.57a1.1 1.1 0 0 0-.79.37 3.34 3.34 0 0 0-1.04 2.49 5.81 5.81 0 0 0 1.21 3.05c.15.2 2.1 3.21 5.1 4.5a17.2 17.2 0 0 0 1.7.63 4.1 4.1 0 0 0 1.88.12 3.07 3.07 0 0 0 2-1.41 2.47 2.47 0 0 0 .17-1.41c-.07-.13-.27-.2-.57-.35Z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition group-hover:opacity-100 md:block">
        Message us on WhatsApp
      </span>
    </a>
  );
}
