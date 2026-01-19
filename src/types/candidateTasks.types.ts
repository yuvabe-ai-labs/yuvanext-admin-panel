export type TaskStatus = "pending" | "accepted" | "redo" | "submitted";

export interface TaskItem {
  taskId: string;
  taskStatus: TaskStatus;
  taskTitle: string;
  taskDescription: string | null;

  taskCreatedAt: string;
  taskStartDate: string | null;
  taskEndDate: string | null;
  taskStartTime: string | null;
  taskEndTime: string | null;

  taskColor: string | null;

  taskSubmissionLink: string | null;
  taskSubmittedAt: string | null;
  taskReviewRemarks: string | null;
  taskReviewedAt: string | null;
}

export interface ApplicationTaskDetails {
  applicationId: string;
  applicantId: string;
  applicantName: string | null;
  applicantEmail: string | null;

  candidateAvatarUrl: string | null;
  candidatePhoneNumber: string | null;

  internshipId: string;
  internshipName: string | null;
  internshipCreatedAt: string;
  internshipClosingDate: string | null;

  tasks: TaskItem[];
}
