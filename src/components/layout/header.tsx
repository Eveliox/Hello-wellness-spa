"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Header() {
  const pathname = usePathname();
  // Reset disclosure state on every route change, including browser back/forward.
  return <HeaderNavigation key={pathname} pathname={pathname} />;
}

function HeaderNavigation({ pathname }: { pathname: string }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isPeptidesPage = pathname === "/services/peptide-therapy";
  const navItems = isPeptidesPage
    ? mainNav.filter((item) => item.href !== "/services")
    : mainNav;
  const showBookCta = !isPeptidesPage &&
    !["/book", "/intake", "/admin", "/checkout"].some((path) => pathname.startsWith(path));

  useEffect(() => {
    if (!open) return;
    const dismiss = () => setOpenPath(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
        toggleRef.current?.focus();
      }
    };
    const onOutsideInteraction = (event: Event) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) dismiss();
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) dismiss(); };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onOutsideInteraction);
    document.addEventListener("focusin", onOutsideInteraction);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onOutsideInteraction);
      document.removeEventListener("focusin", onOutsideInteraction);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  if (pathname.startsWith("/checkout")) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-white/10 bg-chrome text-on-chrome">
      <Container className="flex h-16 items-center justify-between gap-2 lg:h-20 lg:gap-6">
        <Link href="/" aria-label={`${site.name} home`} onClick={() => setOpenPath(null)} className="shrink-0 leading-none">
          <span className="font-script text-3xl text-white">Hello You</span>
          <span className="mt-1 hidden text-[10px] uppercase tracking-[0.2em] text-white/70 sm:block">Wellness · Miami</span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn("rounded-full px-4 py-3 text-sm font-medium text-white/75 hover:text-white", isActive(item.href) && "bg-white/10 text-white")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/programs/packages" onClick={() => setOpenPath(null)} className="inline-flex min-h-11 items-center px-1 text-sm font-medium text-white/90 lg:hidden">
            Pricing
          </Link>
          {showBookCta ? (
            <Button
              href={site.bookingUrl}
              variant="inverse"
              size="sm"
              className="h-11 px-3 sm:px-5"
              onClick={() => {
                setOpenPath(null);
                trackEvent("book_click", {
                  cta_location: window.matchMedia("(min-width: 1024px)").matches ? "header_desktop" : "header_mobile",
                  booking_service: "general",
                });
              }}
            >
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">Book a consultation</span>
            </Button>
          ) : null}
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white lg:hidden"
            aria-controls={menuId}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            <span aria-hidden className="text-xl">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </Container>

      {/* Non-modal disclosure: normal tab order, no body scroll lock or focus trap. */}
      <nav
        id={menuId}
        aria-label="Mobile navigation"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/15 bg-chrome px-4 py-5 shadow-lg lg:hidden"
      >
        <div className="mx-auto max-w-lg space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn("block rounded-xl px-4 py-3 text-base text-white/85 hover:bg-white/10", isActive(item.href) && "bg-white/10 text-white")}
              onClick={() => setOpenPath(null)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`tel:${site.phoneTel}`}
            className="mt-3 block border-t border-white/15 px-4 py-4 text-sm text-white/75 hover:text-white"
            onClick={() => {
              setOpenPath(null);
              trackEvent("click_to_call", { link_location: "header_mobile_menu" });
            }}
          >
            Call {site.phoneDisplay}
          </a>
        </div>
      </nav>
    </header>
  );
}
