import type { DailyLog } from '../types';

const STORAGE_KEY = 'pppd-tracker-logs';

export function getAllLogs(): DailyLog[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getLogByDate(date: string): DailyLog | undefined {
  return getAllLogs().find((log) => log.date === date);
}

export function saveLog(log: DailyLog): void {
  const logs = getAllLogs();
  const idx = logs.findIndex((l) => l.date === log.date);
  if (idx >= 0) {
    logs[idx] = log;
  } else {
    logs.push(log);
  }
  logs.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function deleteLog(date: string): void {
  const logs = getAllLogs().filter((l) => l.date !== date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getLogsInRange(startDate: string, endDate: string): DailyLog[] {
  return getAllLogs().filter(
    (log) => log.date >= startDate && log.date <= endDate
  );
}

export function exportData(): string {
  return JSON.stringify(getAllLogs(), null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
