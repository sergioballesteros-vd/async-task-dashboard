import time

from celery import states
from celery.exceptions import Ignore

from .celery_app import celery_app


@celery_app.task(bind=True, max_retries=2, default_retry_delay=2)
def run_heavy_simulation(self):
    """Idempotent simulation task. Re-running yields deterministic output for same steps."""
    try:
        total_steps = 10
        for current_step in range(1, total_steps + 1):
            time.sleep(1)
            progress_percent = int((current_step / total_steps) * 100)
            self.update_state(
                state="PROCESSING",
                meta={
                    "progress": progress_percent,
                    "result": None,
                    "error": None,
                },
            )

        return {
            "progress": 100,
            "result": {
                "status": "COMPLETED",
                "analysis_report": {
                    "total_savings_eur": 450.50,
                    "recommended_tariff": "Indexada",
                    "confidence_score": 98.5,
                    "simulated_scenarios": 3,
                    "insights": [
                        "High consumption detected during peak hours.",
                        "Switching to 'Indexada' could reduce costs by 15%."
                    ]
                }
            },
            "error": None,
        }
    except Exception as execution_error:
        self.update_state(
            state=states.FAILURE,
            meta={
                "progress": 0,
                "result": None,
                "error": str(execution_error),
            },
        )
        raise Ignore()
