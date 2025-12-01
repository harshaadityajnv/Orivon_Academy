// src/utils/eventSender.ts
/**
 * sendProctorEvent
 * - sends a POST to /attempts/{id}/events with proper Authorization header (Bearer token)
 * - expects backend route as per spec: POST /attempts/{attempt_id}/events { event_type, metadata }
 *
 * The hook queues events if attempt_id is not available yet.
 */

export async function sendProctorEvent(attemptId: string, payload: { event_type: string; metadata?: any }) {
  if (!attemptId) throw new Error("attemptId required");
  const API_BASE = (window as any).__API_BASE || "";
  const token = localStorage.getItem("access_token") || "";

  const url = `${API_BASE}/attempts/${attemptId}/events`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      event_type: payload.event_type,
      metadata: payload.metadata || {}
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`Proctor event failed: ${res.status} ${text}`);
    (err as any).status = res.status;
    throw err;
  }
  return res.json().catch(() => ({}));
}
