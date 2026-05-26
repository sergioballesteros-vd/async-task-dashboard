"use client";

import { useState } from "react";
import { TaskStatusCard } from "../components/TaskStatusCard";
import { useTaskPolling } from "../hooks/useTaskPolling";
import { createTask } from "../lib/api";

export default function HomePage() {
  const [task_id, setTaskId] = useState<string | null>(null);
  const [is_creating_task, setIsCreatingTask] = useState(false);
  const [creation_error, setCreationError] = useState<string | null>(null);

  const { task_status, progress, result, task_error, network_state } = useTaskPolling(task_id);

  async function handleStartSimulation() {
    setIsCreatingTask(true);
    setCreationError(null);

    try {
      const new_task = await createTask();
      setTaskId(new_task.task_id);
    } catch (error) {
      const error_message = error instanceof Error ? error.message : "Task creation failed";
      setCreationError(error_message);
    } finally {
      setIsCreatingTask(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Async Task Dashboard</h1>
        <p className="mt-3 text-slate-300">
          Production-style demo: Next.js + FastAPI + Celery + Redis with resilient polling UX.
        </p>
      </div>

      <button
        className="w-fit rounded-lg bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleStartSimulation}
        disabled={is_creating_task}
      >
        {is_creating_task ? "Starting..." : "Start Heavy Simulation"}
      </button>

      {creation_error && (
        <p className="mt-4 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          API Error: {creation_error}
        </p>
      )}

      <div className="mt-8">
        <TaskStatusCard
          task_id={task_id}
          task_status={task_status}
          progress={progress}
          result={result}
          task_error={task_error}
          network_state={network_state}
        />
      </div>
    </main>
  );
}
