export type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface CreateTaskResponse {
  task_id: string;
  status: TaskStatus;
}

export interface TaskStatusResponse {
  task_id: string;
  status: TaskStatus;
  progress: number;
  result: string | null;
  error: string | null;
}

export interface TaskNetworkState {
  is_timeout: boolean;
  error_message: string | null;
}
