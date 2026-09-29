const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export type DeadlineNotificationType =
  "DEADLINE_7D" | "DEADLINE_3D" | "DEADLINE_1D";

export function getDeadlineNotificationType(
  deadline: Date,
  now: Date,
): DeadlineNotificationType | null {
  const timeUntilDeadline = deadline.getTime() - now.getTime();

  if (timeUntilDeadline < 0 || timeUntilDeadline > 7 * ONE_DAY_MS) {
    return null;
  }
  if (timeUntilDeadline <= ONE_DAY_MS) return "DEADLINE_1D";
  if (timeUntilDeadline <= 3 * ONE_DAY_MS) return "DEADLINE_3D";
  return "DEADLINE_7D";
}
