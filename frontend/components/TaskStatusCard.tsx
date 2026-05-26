import { TaskNetworkState, TaskStatus } from "../lib/types";

interface TaskStatusCardProps {
  task_id: string | null;
  task_status: TaskStatus | null;
  progress: number;
  result: string | null;
  task_error: string | null;
  network_state: TaskNetworkState;
}

function statusBadgeColor(task_status: TaskStatus | null): string {
  if (task_status === "PENDING") return "bg-amber-500";
  if (task_status === "PROCESSING") return "bg-cyan-500";
  if (task_status === "COMPLETED") return "bg-emerald-500";
  if (task_status === "FAILED") return "bg-rose-500";
  return "bg-slate-500";
}

export function TaskStatusCard({
  task_id,
  task_status,
  progress,
  result,
  task_error,
  network_state
}: TaskStatusCardProps) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl">
      <h2 className="text-lg font-semibold">Task Monitor</h2>
      <p className="mt-2 text-sm text-slate-400">Task ID: {task_id ?? "-"}</p>

      <div className="mt-4 flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${statusBadgeColor(task_status)}`} />
        <span className="text-sm font-medium">Status: {task_status ?? "IDLE"}</span>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-slate-700">
          <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {result && (
        <p className="mt-4 rounded-md border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          Result: {result}
        </p>
      )}

      {task_error && (
        <p className="mt-4 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          Worker Error: {task_error}
        </p>
      )}

      {network_state.error_message && (
        <p className="mt-4 rounded-md border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          Network Issue: {network_state.error_message}
          {network_state.is_timeout ? " (request timeout)" : ""}
        </p>
      )}
    </section>
  );
}
