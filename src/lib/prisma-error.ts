import { Prisma } from "@prisma/client";

export function getPrismaErrorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = error.meta?.target as string[] | undefined;
        const field = target?.join(", ") || "field";
        return `A record with this ${field} already exists.`;
      }
      case "P2003":
        return "This action references a record that doesn't exist (it may have been deleted).";
      case "P2025":
        return "The record you're trying to update or delete no longer exists.";
      default:
        return "A database error occurred. Please try again.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
