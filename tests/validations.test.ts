import assert from "node:assert/strict";
import test from "node:test";
import { eraSchema } from "../src/lib/validations/era";
import { contentBlockSchema } from "../src/lib/validations/content-block";

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
