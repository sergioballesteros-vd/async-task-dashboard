from app.celery_app import celery_app
from app.tasks import run_heavy_simulation


def test_run_heavy_simulation_completes_successfully() -> None:
    celery_app.conf.task_always_eager = True
    celery_app.conf.task_eager_propagates = True

    result = run_heavy_simulation.delay().get(timeout=30)

    assert result["progress"] == 100
    assert result["result"]["status"] == "COMPLETED"
    assert result["result"]["analysis_report"]["recommended_tariff"] == "Indexada"
