import { CreateTaskResponse, TaskStatusResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const REQUEST_TIMEOUT_MS = 4000;

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout_id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout_id);
  }
}

export async function createTask(): Promise<CreateTaskResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/tasks`, { method: "POST" });

  if (!response.ok) {
    throw new Error(`Failed to create task (${response.status})`);
  }

  return (await response.json()) as CreateTaskResponse;
}

export async function getTaskStatus(task_id: string): Promise<TaskStatusResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/tasks/${task_id}/status`);

  if (response.status === 404) {
    throw new Error("Task not found");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch status (${response.status})`);
  }

  return (await response.json()) as TaskStatusResponse;
}
