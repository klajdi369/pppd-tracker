import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLogs } from '../utils/storage';
import { today, formatDisplay, getLast7Days, formatShort, formatDayOfWeek } from '../utils/dates';
import { getLogByDate } from '../utils/storage';
import type { DailyLog } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { PenSquare, TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const todayLog = getLogByDate(today());
  const allLogs = getAllLogs();

  const last7Days = useMemo(() => getLast7Days(), []);

  const weekData = useMemo(() => {
    return last7Days.map((date) => {
      const log = allLogs.find((l) => l.date === date);
      return {
        date,
        label: formatDayOfWeek(date),
        shortDate: formatShort(date),
        dizziness: log?.dizzinessSeverity ?? null,
        stress: log?.stressLevel ?? null,
        energy: log?.energyLevel ?? null,
        sleep: log?.sleepHours ?? null,
        fatigue: log?.fatigueSeverity ?? null,
      };
    });
  }, [last7Days, allLogs]);

  const triggerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const recentLogs = allLogs.slice(0, 30);
    for (const log of recentLogs) {
      for (const trigger of log.triggers) {
        counts[trigger] = (counts[trigger] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [allLogs]);

  function getTrend(field: keyof DailyLog): 'up' | 'down' | 'flat' {
    if (allLogs.length < 2) return 'flat';
    const recent = allLogs.slice(0, 3);
    const older = allLogs.slice(3, 6);
    if (older.length === 0) return 'flat';
    const recentAvg = recent.reduce((s, l) => s + (l[field] as number), 0) / recent.length;
    const olderAvg = older.reduce((s, l) => s + (l[field] as number), 0) / older.length;
    const diff = recentAvg - olderAvg;
    if (Math.abs(diff) < 0.5) return 'flat';
    return diff > 0 ? 'up' : 'down';
  }

  function TrendIcon({ trend, invertColor }: { trend: 'up' | 'down' | 'flat'; invertColor?: boolean }) {
    if (trend === 'flat') return <Minus size={16} className="trend-flat" />;
    const isGood = invertColor ? trend === 'up' : trend === 'down';
    if (trend === 'up') return <TrendingUp size={16} className={isGood ? 'trend-good' : 'trend-bad'} />;
    return <TrendingDown size={16} className={isGood ? 'trend-good' : 'trend-bad'} />;
  }

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>PPPD Tracker</h1>
          <p className="subtitle">{formatDisplay(today())}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/log')}>
          <PenSquare size={18} />
          Log Today
        </button>
      </div>

      {todayLog ? (
        <div className="today-summary">
          <h3>Today's Summary</h3>
          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-label">Dizziness</span>
              <span className="summary-value" data-severity={todayLog.dizzinessSeverity > 6 ? 'high' : todayLog.dizzinessSeverity > 3 ? 'medium' : 'low'}>
                {todayLog.dizzinessSeverity}/10
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Sleep</span>
              <span className="summary-value">{todayLog.sleepHours}h</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Stress</span>
              <span className="summary-value" data-severity={todayLog.stressLevel > 6 ? 'high' : todayLog.stressLevel > 3 ? 'medium' : 'low'}>
                {todayLog.stressLevel}/10
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Energy</span>
              <span className="summary-value">{todayLog.energyLevel}/10</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Water</span>
              <span className="summary-value">{todayLog.waterIntake} glasses</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Triggers</span>
              <span className="summary-value">{todayLog.triggers.length}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-entry-card" onClick={() => navigate('/log')}>
          <p>No entry for today yet. Tap to start logging.</p>
        </div>
      )}

      <div className="trends-section">
        <h3>Trends</h3>
        <div className="trend-indicators">
          <div className="trend-item">
            <span>Dizziness</span>
            <TrendIcon trend={getTrend('dizzinessSeverity')} />
          </div>
          <div className="trend-item">
            <span>Stress</span>
            <TrendIcon trend={getTrend('stressLevel')} />
          </div>
          <div className="trend-item">
            <span>Energy</span>
            <TrendIcon trend={getTrend('energyLevel')} invertColor />
          </div>
          <div className="trend-item">
            <span>Sleep</span>
            <TrendIcon trend={getTrend('sleepHours')} invertColor />
          </div>
        </div>
      </div>

      {weekData.some((d) => d.dizziness !== null) && (
        <div className="chart-section">
          <h3>Dizziness & Stress (7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" stroke="var(--color-text-secondary)" fontSize={12} />
              <YAxis domain={[0, 10]} stroke="var(--color-text-secondary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="dizziness"
                stroke="var(--color-bad)"
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
                name="Dizziness"
              />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="var(--color-moderate)"
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
                name="Stress"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {weekData.some((d) => d.sleep !== null) && (
        <div className="chart-section">
          <h3>Sleep & Energy (7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" stroke="var(--color-text-secondary)" fontSize={12} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
                name="Sleep (hrs)"
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="var(--color-good)"
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
                name="Energy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {triggerCounts.length > 0 && (
        <div className="chart-section">
          <h3>Top Triggers (Last 30 Entries)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={triggerCounts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" stroke="var(--color-text-secondary)" fontSize={12} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="var(--color-text-secondary)"
                fontSize={11}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} name="Times" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {allLogs.length === 0 && (
        <div className="empty-state">
          <h3>Welcome to PPPD Tracker</h3>
          <p>Start tracking your symptoms, triggers, and habits to identify patterns and manage your PPPD.</p>
          <p className="hint">Track dizziness, sleep, food, exercise, stress, medications, and more.</p>
        </div>
      )}
    </div>
  );
}
