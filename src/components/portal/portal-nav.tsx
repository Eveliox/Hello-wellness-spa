"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS: { href: string; label: string }[] = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/intakes", label: "My intakes" },
  { href: "/portal/profile", label: "Profile" },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Portal navigation" className="space-y-1">
      {ITEMS.map((item) => {
        const isActive =
          item.href === "/portal"
            ? pathname === "/portal"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-ink text-white"
                : "text-muted hover:bg-canvas hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
