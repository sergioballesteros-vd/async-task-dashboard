import { SimulationResult, TaskNetworkState, TaskStatus } from "../lib/types";

interface TaskStatusCardProps {
  task_id: string | null;
  task_status: TaskStatus | null;
  progress: number;
  result: SimulationResult | null;
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
  const report = result?.analysis_report;

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

      {report && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3">
            <p className="text-xs text-emerald-200">Estimated Savings</p>
            <p className="mt-1 text-xl font-semibold text-emerald-100">€ {report.total_savings_eur.toFixed(2)}</p>
          </article>
          <article className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-3">
            <p className="text-xs text-cyan-200">Recommended Tariff</p>
            <p className="mt-1 text-xl font-semibold text-cyan-100">{report.recommended_tariff}</p>
          </article>
          <article className="rounded-lg border border-violet-400/30 bg-violet-500/10 p-3">
            <p className="text-xs text-violet-200">Confidence</p>
            <p className="mt-1 text-xl font-semibold text-violet-100">{report.confidence_score}%</p>
          </article>
          <article className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-3">
            <p className="text-xs text-amber-100">Scenarios Simulated</p>
            <p className="mt-1 text-xl font-semibold text-amber-50">{report.simulated_scenarios}</p>
          </article>
          <article className="rounded-lg border border-slate-600 bg-slate-800/60 p-3 sm:col-span-2">
            <p className="text-xs text-slate-300">Insights</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
              {report.insights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </article>
        </div>
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
