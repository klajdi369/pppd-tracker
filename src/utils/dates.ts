import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export function today(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDisplay(dateStr: string): string {
  return format(new Date(dateStr + 'T00:00:00'), 'MMM d, yyyy');
}

export function formatShort(dateStr: string): string {
  return format(new Date(dateStr + 'T00:00:00'), 'MMM d');
}

export function formatDayOfWeek(dateStr: string): string {
  return format(new Date(dateStr + 'T00:00:00'), 'EEE');
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
}

export function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
}

export function getCurrentWeekRange(): [string, string] {
  const now = new Date();
  return [
    format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  ];
}

export function getCurrentMonthRange(): [string, string] {
  const now = new Date();
  return [
    format(startOfMonth(now), 'yyyy-MM-dd'),
    format(endOfMonth(now), 'yyyy-MM-dd'),
  ];
}
