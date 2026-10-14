# Mission 22 — Sentinel Agent Command & Control

## Objective
Build a real-time workflow observability and governance dashboard for Sentinel-managed AI agents. Distinguish telemetry from enforcement and never infer control from a green status.

## User journey
1. Open portfolio dashboard and select a workflow.
2. See the orchestrator, subordinate agents, task status, owners, models, tools, and delegated authority.
3. Select an agent to inspect trace-linked events, tool calls, policy decisions, timestamps, failures, and exceptions.
4. Review intervention capabilities with role-based access and explicit confirmation.
5. Export a board-facing evidence report with coverage limitations.

## Technical design
- Frontend: conform to existing site's React/Vite patterns, responsive and accessible.
- Backend: authenticated event ingestion, durable event store, websocket/SSE live updates, scoped tenant and workflow queries.
- Events: event_id, occurred_at, ingested_at, tenant_id, workflow_id, run_id, trace_id, span_id, agent_id, parent_agent_id, action_type, tool_id, authority_grant_id, policy_version, decision, outcome, evidence_reference.
- Support OpenTelemetry-compatible spans, plus Sentinel-specific authorization decision events.
- Enforce actions at the tool/data boundary; dashboard buttons must call a server-side RBAC-protected intervention API, never simulate enforcement.
- Privacy: redact secrets and sensitive payloads, minimize retention, encrypt storage, enforce tenant isolation, immutable/tamper-evident evidence chain.
- Resilience: idempotent ingestion, ordering tolerance, replay, clock skew, heartbeat, stale/offline/unknown state, ingestion lag and coverage indicator.
- Initial adapters: Sentinel-native; define an adapter interface for external frameworks without claiming automatic discovery.

## Acceptance criteria
- Demonstrate one orchestrator with at least three subordinate agents executing a representative synthetic regulated-industry workflow.
- Display agent graph and updates in near real time, measured event-to-display latency and documented limits.
- Show permitted tool call, denied tool call, escalation and human approval, revoked permission, and halted run with independently verified backend logs.
- Replay a run deterministically; correlate each action with agent identity, policy version, authority, decision and trace.
- Demonstrate missing telemetry explicitly as unknown, not compliant.
- Unit/integration/security tests pass; document limitations and deployment instructions.
- Board evidence export clearly separates observed events, enforced decisions, exceptions, and unverified assertions.

## Build prompt
Inspect the existing Sentinel codebase and documentation first. Implement the smallest complete, tested vertical slice of this mission in a feature branch, preserving existing security controls and workflows. Reuse existing governance primitives, event models, test infrastructure and UI conventions where possible. Do not invent production data or claim unsupported interoperability. Run the full relevant test suite, inspect the UI, and provide commit, deployment preview, acceptance evidence and remaining gaps. Do not merge or deploy without successful verification.
