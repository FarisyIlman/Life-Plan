import assert from "node:assert/strict";
import test from "node:test";
import { eraSchema } from "../src/lib/validations/era";
import { contentBlockSchema } from "../src/lib/validations/content-block";
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
