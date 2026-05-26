export type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface AnalysisReport {
  total_savings_eur: number;
  recommended_tariff: string;
  confidence_score: number;
  simulated_scenarios: number;
  insights: string[];
}

export interface SimulationResult {
  status: "COMPLETED";
  analysis_report: AnalysisReport;
}

export interface CreateTaskResponse {
  task_id: string;
  status: TaskStatus;
}

export interface TaskStatusResponse {
  task_id: string;
  status: TaskStatus;
  progress: number;
  result: SimulationResult | null;
  error: string | null;
}

export interface TaskNetworkState {
  is_timeout: boolean;
  error_message: string | null;
}
