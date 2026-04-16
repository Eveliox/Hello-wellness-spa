"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { mainNav } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const navLinkClass =
  "font-ui rounded-full px-3 py-2 text-sm font-medium text-white/70 transition hover:text-white";

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-chrome text-on-chrome">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
        <Link href="/" className="group flex min-w-0 items-center gap-3 leading-tight">
          <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/15 bg-white/5 shadow-sm">
            <Image
              src="/images/branding/logo.jpeg"
              alt={`${site.shortBrand} logo`}
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="font-display text-xl tracking-wide text-white sm:text-2xl">
              {site.shortBrand}
            </span>
            <span className="font-ui text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/55 sm:text-xs">
              Miami
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {mainNav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={cn(navLinkClass, servicesOpen && "text-white")}
                    onFocus={() => setServicesOpen(true)}
                  >
                    {item.label}
                  </Link>
                  <span className="-ml-1 pr-1 text-xs text-white/45" aria-hidden>
                    ▾
                  </span>
                </div>
                <div
                  className={cn(
                    "absolute left-0 top-full z-50 w-[min(100vw-2rem,22rem)] pt-2 transition",
                    servicesOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
                  )}
                  role="presentation"
                >
                  <div
                    className="rounded-2xl border border-line bg-surface p-2 text-ink shadow-soft"
                    role="menu"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        className="block rounded-xl px-3 py-2.5 text-sm hover:bg-accent-soft"
                        onClick={() => setServicesOpen(false)}
                      >
                        <span className="block font-ui font-semibold text-ink">{child.label}</span>
                        {child.description ? (
                          <span className="mt-0.5 block text-xs leading-snug text-muted">{child.description}</span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href={`tel:${site.phoneTel}`} variant="inverse" size="sm">
            Call {site.phoneDisplay}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button href={`tel:${site.phoneTel}`} variant="inverse" size="sm">
            Call
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white"
            aria-controls={menuId}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="flex flex-col gap-1">
              <span className={cn("h-0.5 w-5 bg-white transition", open && "translate-y-1.5 rotate-45")} />
              <span className={cn("h-0.5 w-5 bg-white transition", open && "opacity-0")} />
              <span className={cn("h-0.5 w-5 bg-white transition", open && "-translate-y-1.5 -rotate-45")} />
            </span>
          </button>
        </div>
      </Container>

      <div
        id={menuId}
        className={cn(
          "fixed inset-0 top-16 z-30 bg-chrome/98 px-4 pb-28 pt-4 text-on-chrome backdrop-blur-md lg:hidden",
          open ? "block" : "hidden",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          <Link
            href="/"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          {mainNav.map((item) =>
            item.children ? (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <Link
                  href={item.href}
                  className="block px-1 pb-2 font-ui text-xs font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                <div className="flex flex-col gap-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
          <div className="pt-2">
            <Button href={`tel:${site.phoneTel}`} variant="inverse" className="w-full">
              Call
            </Button>
          </div>
          <a href={`tel:${site.phoneTel}`} className="text-center text-sm font-medium text-white/80 hover:text-white">
            Call {site.phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}
