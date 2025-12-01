export const STARTED_KEY = 'startedExamIds';

export function getStartedExamIds(): string[] {
  try {
    const raw = localStorage.getItem(STARTED_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map((x: any) => String(x)) : [];
  } catch {
    return [];
  }
}

export function isExamStarted(id: string | number): boolean {
  const ids = getStartedExamIds();
  return ids.includes(String(id));
}

export function markExamStarted(id: string | number): void {
  try {
    const ids = getStartedExamIds();
    const sid = String(id);
    if (!ids.includes(sid)) {
      ids.push(sid);
      localStorage.setItem(STARTED_KEY, JSON.stringify(ids));
    }
  } catch (e) {
    // ignore
  }
}

export function clearStartedExams(): void {
  try { localStorage.removeItem(STARTED_KEY); } catch {}
}
