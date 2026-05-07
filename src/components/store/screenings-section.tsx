import { screenings } from "@/data/screenings";
import { ScreeningCard } from "@/components/store/screening-card";

export function ScreeningsSection() {
  return (
    <section>
      <header className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#888]">
          Screenings & Diagnostics
        </p>
        <hr className="mt-2 border-[#e8e8e8]" />
      </header>

      <div className="space-y-6">
        {screenings.map((s) => (
          <ScreeningCard key={s.id} screening={s} />
        ))}
      </div>
    </section>
  );
}
