export interface ContentBlockPreview {
  id: string;
  title: string;
  subtitle: string | null;
  deadline: Date | null;
  isCompleted: boolean;
  data: {
    description?: string;
    techStack?: string;
    responsibilities?: string;
    textColor?: string;
  };
}
