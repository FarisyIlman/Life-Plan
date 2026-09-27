import type { ContentBlock } from "@prisma/client";

type ContentData = { visibility?: "PUBLIC" | "SUMMARY" | "PRIVATE" };

function getContentData(block: ContentBlock): ContentData {
  return typeof block.data === "object" && block.data !== null
    ? (block.data as ContentData)
    : {};
}

export function isPublicContentBlock(block: ContentBlock) {
  return getContentData(block).visibility !== "PRIVATE";
}

export function getPublicContentBlocks(blocks: ContentBlock[]) {
  return blocks.filter(isPublicContentBlock);
}

export function getContentProgress(blocks: ContentBlock[]) {
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
