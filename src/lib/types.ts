export interface ContentBlockPreview {
  id: string;
  title: string;
  subtitle: string | null;
  deadline: Date | null;
  isCompleted: boolean;
  data: {
    description?: string;
    why?: string;
    nextAction?: string;
    evidenceUrl?: string;
    visibility?: "PUBLIC" | "SUMMARY" | "PRIVATE";
    techStack?: string;
    responsibilities?: string;
    textColor?: string;
    imageUrl?: string;
    imageCaption?: string;
  };
}
