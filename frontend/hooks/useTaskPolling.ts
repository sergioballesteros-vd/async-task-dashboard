"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTaskStatus } from "../lib/api";
import { TaskNetworkState, TaskStatus, TaskStatusResponse } from "../lib/types";

const POLLING_INTERVAL_MS = 1200;

interface UseTaskPollingResponse {
  task_status: TaskStatus | null;
  progress: number;
  result: string | null;
  task_error: string | null;
  network_state: TaskNetworkState;
}

export function useTaskPolling(task_id: string | null): UseTaskPollingResponse {
  const [task_data, setTaskData] = useState<TaskStatusResponse | null>(null);
  const [network_state, setNetworkState] = useState<TaskNetworkState>({
    is_timeout: false,
    error_message: null
  });

  const pollTaskStatus = useCallback(async () => {
    if (!task_id) {
      return;
    }

    try {
      const current_status = await getTaskStatus(task_id);
      setTaskData(current_status);
      setNetworkState({ is_timeout: false, error_message: null });
    } catch (error) {
      const error_message = error instanceof Error ? error.message : "Network error";
      const is_timeout = error instanceof Error && error.name === "AbortError";
      setNetworkState({ is_timeout, error_message });
    }
  }, [task_id]);

  useEffect(() => {
    if (!task_id) {
      setTaskData(null);
      setNetworkState({ is_timeout: false, error_message: null });
      return;
    }

    const is_terminal_status =
      task_data?.status === "COMPLETED" || task_data?.status === "FAILED";

    if (is_terminal_status) {
      return;
    }

    void pollTaskStatus();

    const interval_id = setInterval(() => {
      void pollTaskStatus();
    }, POLLING_INTERVAL_MS);

    return () => {
      clearInterval(interval_id);
    };
  }, [task_id, task_data?.status, pollTaskStatus]);

  return useMemo(
    () => ({
      task_status: task_data?.status ?? null,
      progress: task_data?.progress ?? 0,
      result: task_data?.result ?? null,
      task_error: task_data?.error ?? null,
      network_state
    }),
    [task_data, network_state]
  );
}
