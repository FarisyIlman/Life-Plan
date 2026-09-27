import type { CSSProperties } from "react";

type EraReflectionProps = {
  thesis?: string | null;
  tradeOff?: string | null;
  successIndicators?: string | null;
  retrospective?: string | null;
  accent: string;
  fontClassName?: string;
};

const ITEMS = [
  ["THESIS", "thesis"],
  ["TRADE-OFF", "tradeOff"],
  ["SUCCESS INDICATORS", "successIndicators"],
  ["RETROSPECTIVE", "retrospective"],
] as const;

export default function EraReflection({
  thesis,
  tradeOff,
  successIndicators,
  retrospective,
  accent,
  fontClassName = "font-heading",
}: EraReflectionProps) {
  const values = { thesis, tradeOff, successIndicators, retrospective };
  const visibleItems = ITEMS.filter(([, key]) => values[key]);

  if (visibleItems.length === 0) return null;

  return (
    <section className="px-6 pb-12 max-w-5xl mx-auto">
      <div className="border-y border-border py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {visibleItems.map(([label, key]) => (
            <div key={key}>
              <p
                className={`${fontClassName} text-xs tracking-widest mb-2`}
                style={{ color: accent } as CSSProperties}
              >
                {label}
              </p>
              <p className="text-text-muted text-sm leading-6 whitespace-pre-line">
                {values[key]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
