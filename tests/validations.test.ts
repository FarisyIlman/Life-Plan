import assert from "node:assert/strict";
import test from "node:test";
import { eraSchema } from "../src/lib/validations/era";
import { achievementGoalSchema } from "../src/lib/validations/achievement-goal";
import { contentBlockSchema } from "../src/lib/validations/content-block";
import { getPublicAchievementGoals } from "../src/lib/achievement-visibility";
import { getDeadlineNotificationType } from "../src/lib/notification-rules";
import {
  getContentProgress,
  getPublicContentBlocks,
} from "../src/lib/content-progress";
import { CONTENT_BLOCK_TYPES } from "../src/lib/validations/content-block-data";
import {
  MAX_IMAGE_SIZE_BYTES,
  validateImageFile,
} from "../src/lib/cloudinary-upload";

const baseEra = {
  slug: "2026",
  title: "A new era",
  theme: "GALAXY",
  startYear: "2026",
  endYear: "2026",
  isPublished: "false",
  order: "0",
};

test("strict boolean parsing keeps unchecked fields false", () => {
  const result = eraSchema.safeParse(baseEra);

  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.isPublished, false);
});

test("strict boolean parsing rejects unknown values", () => {
  const result = eraSchema.safeParse({ ...baseEra, isPublished: "unknown" });

  assert.equal(result.success, false);
});

test("era validation rejects an end year before the start year", () => {
  const result = eraSchema.safeParse({ ...baseEra, endYear: "2025" });

  assert.equal(result.success, false);
});

test("Beyond page variant is restricted to Tree eras", () => {
  assert.equal(
    eraSchema.safeParse({ ...baseEra, theme: "TREE", pageVariant: "BEYOND" })
      .success,
    true,
  );
  assert.equal(
    eraSchema.safeParse({ ...baseEra, pageVariant: "BEYOND" }).success,
    false,
  );
});

test("achievement visibility defaults to private with public details disabled", () => {
  const result = achievementGoalSchema.safeParse({
    eraId: "era-1",
    year: "2028",
    category: "SAVING",
    targetMin: "2000000",
    targetIdeal: "3000000",
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.visibility, "PRIVATE");
    assert.equal(result.data.showValues, false);
    assert.equal(result.data.showEvidence, false);
  }
});

test("public achievement serialization removes unapproved values and evidence", () => {
  const goals = [
    {
      visibility: "PRIVATE" as const,
      showValues: true,
      showEvidence: true,
      targetMin: 2_000_000,
      targetIdeal: 3_000_000,
      actualValue: 2_500_000,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/proof.png",
      note: "Private note",
    },
    {
      visibility: "SUMMARY" as const,
      showValues: true,
      showEvidence: true,
      targetMin: 2_000_000,
      targetIdeal: 3_000_000,
      actualValue: 2_500_000,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/proof.png",
      note: "Summary note",
    },
    {
      visibility: "PUBLIC" as const,
      showValues: false,
      showEvidence: true,
      targetMin: 2_000_000,
      targetIdeal: 3_000_000,
      actualValue: 2_500_000,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/proof.png",
      note: "Public note",
    },
    {
      visibility: "PUBLIC" as const,
      showValues: true,
      showEvidence: false,
      targetMin: 2_000_000,
      targetIdeal: 3_000_000,
      actualValue: 2_500_000,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/hidden.png",
      note: null,
    },
  ];
  const result = getPublicAchievementGoals(goals);

  assert.equal(result.length, 3);
  assert.equal(result[0].targetMin, 0);
  assert.equal(result[0].actualValue, null);
  assert.equal(result[0].imageUrl, null);
  assert.equal(result[0].note, null);
  assert.equal(result[1].targetIdeal, 0);
  assert.equal(result[1].actualValue, null);
  assert.equal(result[1].imageUrl, goals[2].imageUrl);
  assert.equal(result[2].targetMin, goals[3].targetMin);
  assert.equal(result[2].actualValue, goals[3].actualValue);
  assert.equal(result[2].imageUrl, null);
});

test("achievement evidence URLs must use Cloudinary HTTPS image URLs", () => {
  const baseGoal = {
    eraId: "era-1",
    year: "2028",
    category: "SAVING",
    targetMin: "2000000",
    targetIdeal: "3000000",
  };

  assert.equal(
    achievementGoalSchema.safeParse({
      ...baseGoal,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/proof.png",
    }).success,
    true,
  );
  assert.equal(
    achievementGoalSchema.safeParse({
      ...baseGoal,
      imageUrl: "https://example.com/proof.png",
    }).success,
    false,
  );
});

test("deadline notifications classify 1, 3, and 7 day windows", () => {
  const now = new Date("2026-09-27T00:00:00Z");
  const after = (days: number) => new Date(now.getTime() + days * 86_400_000);

  assert.equal(getDeadlineNotificationType(after(1), now), "DEADLINE_1D");
  assert.equal(getDeadlineNotificationType(after(3), now), "DEADLINE_3D");
  assert.equal(getDeadlineNotificationType(after(7), now), "DEADLINE_7D");
  assert.equal(getDeadlineNotificationType(after(8), now), null);
  assert.equal(getDeadlineNotificationType(after(-1), now), null);
});

test("content block validation rejects invalid deadlines", () => {
  const result = contentBlockSchema.safeParse({
    eraId: "era-1",
    type: "card",
    title: "A block",
    deadline: "not-a-date",
    isPublished: "false",
    isCompleted: "false",
    order: "0",
  });

  assert.equal(result.success, false);
});

test("content block validation rejects invalid text colors", () => {
  const result = contentBlockSchema.safeParse({
    eraId: "era-1",
    type: "card",
    title: "A block",
    textColor: "red",
    isPublished: "false",
    isCompleted: "false",
    order: "0",
  });

  assert.equal(result.success, false);
});

test("content block validation accepts hex text colors", () => {
  const result = contentBlockSchema.safeParse({
    eraId: "era-1",
    type: "card",
    title: "A block",
    textColor: "#12AbEF",
    isPublished: "false",
    isCompleted: "false",
    order: "0",
  });

  assert.equal(result.success, true);
});

test("content block visibility defaults to public", () => {
  const result = contentBlockSchema.safeParse({
    eraId: "era-1",
    type: "card",
    title: "A block",
    isPublished: "false",
    isCompleted: "false",
    order: "0",
  });

  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.visibility, "PUBLIC");
});

test("content block validation accepts supported visibility modes", () => {
  for (const visibility of ["PUBLIC", "SUMMARY", "PRIVATE"]) {
    const result = contentBlockSchema.safeParse({
      eraId: "era-1",
      type: "card",
      title: "A block",
      visibility,
      isPublished: "false",
      isCompleted: "false",
      order: "0",
    });

    assert.equal(result.success, true);
  }
});

test("content block validation rejects unknown types", () => {
  const result = contentBlockSchema.safeParse({
    eraId: "era-1",
    type: "unknown-card",
    title: "A block",
    isPublished: "false",
    isCompleted: "false",
    order: "0",
  });

  assert.equal(result.success, false);
});

test("monthly content requires a month", () => {
  const result = contentBlockSchema.safeParse({
    eraId: "era-1",
    type: "monthly-card",
    title: "A monthly block",
    isPublished: "false",
    isCompleted: "false",
    order: "0",
  });

  assert.equal(result.success, false);
});

test("grand design content types are explicit", () => {
  assert.deepEqual(CONTENT_BLOCK_TYPES, [
    "card",
    "monthly-card",
    "quest-main",
    "quest-bonus",
    "quest-hidden",
    "about-hobby",
    "about-mbti",
  ]);
});

test("image validation accepts supported files under the size limit", () => {
  assert.equal(
    validateImageFile({ type: "image/webp", size: MAX_IMAGE_SIZE_BYTES }),
    null,
  );
});

test("image validation rejects unsupported formats and oversized files", () => {
  const unsupportedType = validateImageFile({
    type: "image/gif",
    size: 100,
  });
  const oversizedFile = validateImageFile({
    type: "image/png",
    size: MAX_IMAGE_SIZE_BYTES + 1,
  });

  assert.ok(unsupportedType);
  assert.ok(oversizedFile);
  assert.match(unsupportedType, /JPG, PNG, and WebP/);
  assert.match(oversizedFile, /5 MB or smaller/);
});

test("public content excludes private blocks from progress and lists", () => {
  const blocks = [
    { data: { visibility: "PUBLIC" }, isCompleted: true },
    { data: { visibility: "SUMMARY" }, isCompleted: false },
    { data: { visibility: "PRIVATE" }, isCompleted: true },
  ];

  assert.equal(getPublicContentBlocks(blocks).length, 2);
  assert.deepEqual(getContentProgress(blocks), {
    total: 2,
    completed: 1,
    percentage: 50,
  });
});

test("content without visibility remains public for backwards compatibility", () => {
  const blocks = [{ data: {}, isCompleted: false }];

  assert.equal(getPublicContentBlocks(blocks).length, 1);
});
