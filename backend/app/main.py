import os
from typing import Any

import redis
from celery.result import AsyncResult
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .celery_app import celery_app
from .tasks import run_heavy_simulation

app = FastAPI(title="Async Task Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", "6379")),
    db=2,
    decode_responses=True,
)
TASK_REGISTRY_KEY = "async_task_dashboard:known_tasks"


class CreateTaskResponse(BaseModel):
    task_id: str
    status: str


class TaskStatusResponse(BaseModel):
    task_id: str
    status: str
    progress: int
    result: dict[str, Any] | None
    error: str | None


@app.post("/api/tasks", response_model=CreateTaskResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_task() -> CreateTaskResponse:
    async_result = run_heavy_simulation.delay()
    redis_client.sadd(TASK_REGISTRY_KEY, async_result.id)
    return CreateTaskResponse(task_id=async_result.id, status="PENDING")


@app.get("/api/tasks/{task_id}/status", response_model=TaskStatusResponse)
async def get_task_status(task_id: str) -> TaskStatusResponse:
    if not redis_client.sismember(TASK_REGISTRY_KEY, task_id):
        raise HTTPException(status_code=404, detail="Task not found")

    async_result = AsyncResult(task_id, app=celery_app)

    if async_result.state == "PENDING":
        return TaskStatusResponse(task_id=task_id, status="PENDING", progress=0, result=None, error=None)

    if async_result.state == "PROCESSING":
        metadata = async_result.info or {}
        return TaskStatusResponse(task_id=task_id, status="PROCESSING", progress=metadata.get("progress", 0), result=None, error=None)

    if async_result.state == "SUCCESS":
        payload = async_result.result or {}
        return TaskStatusResponse(
            task_id=task_id,
            status="COMPLETED",
            progress=payload.get("progress", 100),
            result=payload.get("result"),
            error=None,
        )

    if async_result.state in {"FAILURE", "REVOKED"}:
        error_text = None
        if isinstance(async_result.info, dict):
            error_text = async_result.info.get("error")
        if error_text is None and async_result.info is not None:
            error_text = str(async_result.info)

        return TaskStatusResponse(task_id=task_id, status="FAILED", progress=0, result=None, error=error_text or "Task failed")

    raise HTTPException(status_code=500, detail="Unexpected task state")
