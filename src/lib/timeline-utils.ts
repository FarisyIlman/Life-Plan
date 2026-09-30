import type { ContentBlock } from "@prisma/client";
import {
  getContentVisibility,
  getPublicContentBlocks,
} from "@/lib/content-progress";

export type TimelineFilter =
  "ALL" | "GOALS" | "PROJECTS" | "EVIDENCE" | "UPCOMING" | "COMPLETED";

export type TimelineSignals = {
  goals: number;
  projects: number;
  completed: number;
  evidence: number;
  upcoming: number;
};

type TimelineContentBlock = Pick<
  ContentBlock,
  "data" | "deadline" | "isCompleted"
>;

type TimelineEraData = {
  contentBlocks: TimelineContentBlock[];
  achievementGoals: { id: string }[];
};

function getUtcDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function isUpcomingDeadline(
  deadline: Date | null,
  isCompleted: boolean,
  now: Date,
) {
  return (
    !isCompleted &&
    deadline !== null &&
    getUtcDateKey(deadline) >= getUtcDateKey(now)
  );
}

export function formatTimelineDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC" }).format(date);
}

function hasPublicEvidence(block: TimelineContentBlock) {
  const data =
    typeof block.data === "object" && block.data !== null
      ? (block.data as { evidenceUrl?: unknown })
      : {};

  return (
    getContentVisibility(block.data) === "PUBLIC" &&
    typeof data.evidenceUrl === "string" &&
    data.evidenceUrl.trim().length > 0
  );
}

export function getTimelineSignals(
  era: TimelineEraData,
  now: Date,
): TimelineSignals {
  const publicBlocks = getPublicContentBlocks(era.contentBlocks);

  return {
    goals: era.achievementGoals.length,
    projects: publicBlocks.length,
    completed: publicBlocks.filter((block) => block.isCompleted).length,
    evidence: publicBlocks.filter(hasPublicEvidence).length,
    upcoming: publicBlocks.filter((block) =>
      isUpcomingDeadline(block.deadline, block.isCompleted, now),
    ).length,
  };
}

export function getTimelineSummary<T extends TimelineEraData>(
  eras: T[],
  now: Date,
): TimelineSignals {
  return eras.reduce<TimelineSignals>(
    (summary, era) => {
      const signals = getTimelineSignals(era, now);
      summary.goals += signals.goals;
      summary.projects += signals.projects;
      summary.completed += signals.completed;
      summary.evidence += signals.evidence;
      summary.upcoming += signals.upcoming;
      return summary;
    },
    { goals: 0, projects: 0, completed: 0, evidence: 0, upcoming: 0 },
  );
}

export function filterTimelineEras<T extends { signals: TimelineSignals }>(
  eras: T[],
  filter: TimelineFilter,
) {
  if (filter === "ALL") return eras;

  const signalByFilter = {
    GOALS: "goals",
    PROJECTS: "projects",
    EVIDENCE: "evidence",
    UPCOMING: "upcoming",
    COMPLETED: "completed",
  } as const;
  const signal = signalByFilter[filter];

  return eras.filter((era) => era.signals[signal] > 0);
}
