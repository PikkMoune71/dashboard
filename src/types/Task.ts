export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: "todo" | "inProgress" | "done";
  projectId: string;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
}
