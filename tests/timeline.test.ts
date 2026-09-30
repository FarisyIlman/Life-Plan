import assert from "node:assert/strict";
import test from "node:test";
import {
  filterTimelineEras,
  formatTimelineDate,
  getTimelineSignals,
  getTimelineSummary,
} from "../src/lib/timeline-utils";

const today = new Date("2026-09-30T12:00:00.000Z");

function makeBlock({
  visibility = "PUBLIC",
  evidenceUrl,
  deadline,
  isCompleted = false,
}: {
  visibility?: "PUBLIC" | "SUMMARY" | "PRIVATE";
  evidenceUrl?: string;
  deadline?: string;
  isCompleted?: boolean;
} = {}) {
  return {
    data: { visibility, evidenceUrl },
    deadline: deadline ? new Date(`${deadline}T00:00:00.000Z`) : null,
    isCompleted,
  };
}

test("timeline metrics exclude private blocks and summary evidence", () => {
  const era = {
    achievementGoals: [{ id: "goal-1" }],
    contentBlocks: [
      makeBlock({
        evidenceUrl: "https://example.com/public",
        deadline: "2026-09-30",
      }),
      makeBlock({
        visibility: "SUMMARY",
        evidenceUrl: "https://example.com/summary",
        isCompleted: true,
      }),
      makeBlock({
        visibility: "PRIVATE",
        evidenceUrl: "https://example.com/private",
        deadline: "2026-10-01",
      }),
    ],
  };

  assert.deepEqual(getTimelineSignals(era, today), {
    goals: 1,
    projects: 2,
    completed: 1,
    evidence: 1,
    upcoming: 1,
  });
  assert.deepEqual(getTimelineSummary([era], today), {
    goals: 1,
    projects: 2,
    completed: 1,
    evidence: 1,
    upcoming: 1,
  });
});

test("timeline dates keep the UTC calendar date for date-only deadlines", () => {
  assert.equal(
    formatTimelineDate(new Date("2026-09-30T00:00:00.000Z")),
    "30/09/2026",
  );
});

test("upcoming includes today and future incomplete deadlines only", () => {
  const era = {
    achievementGoals: [],
    contentBlocks: [
      makeBlock({ deadline: "2026-09-29" }),
      makeBlock({ deadline: "2026-09-30" }),
      makeBlock({ deadline: "2026-10-01" }),
      makeBlock({ deadline: "2026-10-02", isCompleted: true }),
    ],
  };

  assert.equal(getTimelineSignals(era, today).upcoming, 2);
});

test("timeline filters select eras from public signal metrics", () => {
  const eras = [
    {
      id: "with-project",
      signals: {
        goals: 0,
        projects: 1,
        completed: 0,
        evidence: 0,
        upcoming: 0,
      },
    },
    {
      id: "no-project",
      signals: {
        goals: 1,
        projects: 0,
        completed: 0,
        evidence: 0,
        upcoming: 0,
      },
    },
  ];

  assert.deepEqual(
    filterTimelineEras(eras, "PROJECTS").map((era) => era.id),
    ["with-project"],
  );
  assert.deepEqual(
    filterTimelineEras(eras, "GOALS").map((era) => era.id),
    ["no-project"],
  );
  assert.deepEqual(getTimelineSummary([], today), {
    goals: 0,
    projects: 0,
    completed: 0,
    evidence: 0,
    upcoming: 0,
  });
});
