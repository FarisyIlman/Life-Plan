export type AchievementVisibility = "PRIVATE" | "SUMMARY" | "PUBLIC";

type AchievementGoalForPublic = {
  visibility: AchievementVisibility;
  showValues: boolean;
  showEvidence: boolean;
  targetMin: number;
  targetIdeal: number;
  actualValue: number | null;
  imageUrl: string | null;
  note: string | null;
};

export function getPublicAchievementGoals<T extends AchievementGoalForPublic>(
  goals: T[],
) {
  return goals
    .filter((goal) => goal.visibility !== "PRIVATE")
    .map((goal) => {
      const showValues = goal.visibility === "PUBLIC" && goal.showValues;
      const showEvidence = goal.visibility === "PUBLIC" && goal.showEvidence;

      return {
        ...goal,
        targetMin: showValues ? goal.targetMin : 0,
        targetIdeal: showValues ? goal.targetIdeal : 0,
        actualValue: showValues ? goal.actualValue : null,
        imageUrl: showEvidence ? goal.imageUrl : null,
        note: goal.visibility === "PUBLIC" ? goal.note : null,
      };
    });
}
