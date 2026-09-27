"use client";

import { motion } from "framer-motion";
import type { AchievementGoal } from "@prisma/client";
import { THEME_CONFIG, type ThemeKey } from "@/lib/theme-config";

const STATUS_STYLES: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "Pending",
    color: "var(--color-status-neutral)",
    bg: "color-mix(in srgb, var(--color-status-neutral) 10%, transparent)",
  },
  UNDER_ACHIEVED: {
    label: "Under Achieved",
    color: "var(--color-status-danger)",
    bg: "color-mix(in srgb, var(--color-status-danger) 10%, transparent)",
  },
  ACHIEVED: {
    label: "Achieved",
    color: "var(--color-status-success)",
    bg: "color-mix(in srgb, var(--color-status-success) 10%, transparent)",
  },
  OVER_ACHIEVED: {
    label: "Over Achieved",
    color: "var(--color-status-warning)",
    bg: "color-mix(in srgb, var(--color-status-warning) 10%, transparent)",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  SALARY: "Salary Target",
  SAVING: "Saving Target",
  ACADEMIC: "Academic Goal",
  INVESTMENT: "Investment Target",
  CERTIFICATION: "Certification Goal",
};

const MONETARY_CATEGORIES = ["SALARY", "SAVING", "INVESTMENT"];

function formatValue(value: number, category: string) {
  if (MONETARY_CATEGORIES.includes(category)) {
    return `Rp ${value.toLocaleString("id-ID")}`;
  }
  return value.toLocaleString("id-ID");
}

export default function AchievementTracker({
  year,
  goals,
  theme = "RACING",
}: {
  year: number;
  goals: AchievementGoal[];
  theme?: ThemeKey;
}) {
  if (goals.length === 0) return null;

  const themeConfig = THEME_CONFIG[theme];

  const renderGoalCard = (goal: AchievementGoal) => {
    const style = STATUS_STYLES[goal.status];
    const label = CATEGORY_LABELS[goal.category] || goal.category;
    const progress =
      goal.actualValue != null && goal.targetIdeal > 0
        ? Math.min(100, Math.round((goal.actualValue / goal.targetIdeal) * 100))
        : 0;

    return (
      <motion.div
        key={goal.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-bg-secondary border border-border rounded-lg p-5 border-l-4"
        style={{ borderLeftColor: themeConfig.accentVar }}
      >
        <div className="flex justify-between items-start mb-3">
          <h4
            className={`${themeConfig.fontClassName} text-lg text-text-primary`}
          >
            {label}
          </h4>
          <span
            className="text-xs font-heading px-2 py-1 rounded"
            style={{ color: style.color, backgroundColor: style.bg }}
            aria-label={`Status: ${style.label}`}
          >
            {style.label}
          </span>
        </div>

        <div className="text-sm text-text-muted mb-3">
          <p>Min: {formatValue(goal.targetMin, goal.category)}</p>
          <p>Ideal: {formatValue(goal.targetIdeal, goal.category)}</p>
          {goal.actualValue != null && (
            <p className="text-text-primary mt-1">
              Actual: {formatValue(goal.actualValue, goal.category)}
            </p>
          )}
        </div>

        {goal.actualValue != null && (
          <div
            className="h-2 bg-bg-primary rounded-full overflow-hidden"
            role="progressbar"
            aria-label={`${label} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                backgroundColor: themeConfig.accentVar,
              }}
            />
          </div>
        )}

        {goal.note && (
          <p className="text-text-muted text-xs mt-3 italic">{goal.note}</p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="mb-8">
      <h3
        className={`${themeConfig.fontClassName} text-2xl text-text-primary mb-4`}
      >
        {year}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => renderGoalCard(goal))}
      </div>
    </div>
  );
}
