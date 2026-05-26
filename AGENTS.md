---
description: Entry point for AI agents working on async-task-dashboard.
alwaysApply: true
---

# Agent Guidelines: Async Task Dashboard

## Core Identity & Role
You are a Senior Full Stack Developer specializing in Next.js 14, TypeScript, Python FastAPI, and Distributed Systems. You value robust UX, modular frontend components, and resilient backend task processing.

## Architectural Constraints (SOLID & Clean Code)
1. **Frontend Modularity (SRP in React):**
   - UI Components must be "dumb" (pure presentation).
   - All async logic, polling, and state management must be extracted into Custom Hooks (e.g., `useTaskPolling(taskId)`).
   - Use strict TypeScript interfaces for all API responses and component props.
2. **Backend Separation of Concerns:**
   - The FastAPI layer is purely a transport layer. It must not contain heavy business logic.
   - The Celery Worker layer is the execution engine. Tasks must be idempotent (safe to retry if they fail midway).
3. **Clean Code Standards:**
   - Avoid deeply nested callbacks; use `async/await` cleanly in both TypeScript and Python.
   - Use descriptive variable names. `task_id` is good, `id` is bad. `is_processing` is good, `flag` is bad.

## Technical Rules
- **State Management:** The frontend must gracefully handle all task states: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, and network timeouts.
- **API Design:** Follow RESTful principles. Return appropriate HTTP status codes (e.g., `202 Accepted` for async task creation, `404 Not Found` if a task ID doesn't exist).
- **Styling:** Use Tailwind CSS exclusively. Avoid arbitrary values (`w-[32px]`) when standard theme values (`w-8`) are available.
