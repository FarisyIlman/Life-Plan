export type ThemeKey = "GALAXY" | "MONTHLY" | "RACING" | "VOYAGE" | "TREE";

type ThemeConfig = {
  accentVar: string;
  fontClassName: string;
  progressLabel: string;
  achievementLabel: string;
};

export const THEME_CONFIG: Record<ThemeKey, ThemeConfig> = {
  GALAXY: {
    accentVar: "var(--color-theme-galaxy)",
    fontClassName: "font-galaxy",
    progressLabel: "Mission progress",
    achievementLabel: "Mission targets",
  },
  MONTHLY: {
    accentVar: "var(--color-theme-monthly)",
    fontClassName: "font-heading",
    progressLabel: "Year progress",
    achievementLabel: "Year targets",
  },
  RACING: {
    accentVar: "var(--color-theme-racing)",
    fontClassName: "font-racing",
    progressLabel: "Race progress",
    achievementLabel: "Race targets",
  },
  VOYAGE: {
    accentVar: "var(--color-theme-voyage)",
    fontClassName: "font-voyage",
    progressLabel: "Journey progress",
    achievementLabel: "Journey targets",
  },
  TREE: {
    accentVar: "var(--color-theme-tree)",
    fontClassName: "font-heading",
    progressLabel: "Growth progress",
    achievementLabel: "Growth targets",
  },
};
