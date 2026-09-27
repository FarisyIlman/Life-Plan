import type { ContentBlock } from "@prisma/client";

export type ContentVisibility = "PUBLIC" | "SUMMARY" | "PRIVATE";
type ContentData = { visibility?: ContentVisibility };

function getContentData(data: unknown): ContentData {
  return typeof data === "object" && data !== null ? (data as ContentData) : {};
}

export function getContentVisibility(data: unknown): ContentVisibility {
  return getContentData(data).visibility || "PUBLIC";
}

export function isPublicContentBlock<T extends Pick<ContentBlock, "data">>(
  block: T,
) {
  return getContentVisibility(block.data) !== "PRIVATE";
}

export function getPublicContentBlocks<T extends Pick<ContentBlock, "data">>(
  blocks: T[],
) {
  return blocks.filter(isPublicContentBlock);
}

export function getContentProgress<
  T extends Pick<ContentBlock, "data" | "isCompleted">,
>(blocks: T[]) {
  const publicBlocks = getPublicContentBlocks(blocks);
  const completed = publicBlocks.filter((block) => block.isCompleted).length;

  return {
    total: publicBlocks.length,
    completed,
    percentage:
      publicBlocks.length > 0
        ? Math.round((completed / publicBlocks.length) * 100)
        : 0,
  };
}
