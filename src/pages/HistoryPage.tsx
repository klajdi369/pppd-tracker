import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLogs } from '../utils/storage';
import { formatDisplay } from '../utils/dates';
import { ChevronRight, Frown, Meh, Smile } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const allLogs = getAllLogs();
  const [filter, setFilter] = useState<'all' | 'high' | 'low'>('all');

  const filtered = useMemo(() => {
    if (filter === 'high') return allLogs.filter((l) => l.dizzinessSeverity >= 6);
    if (filter === 'low') return allLogs.filter((l) => l.dizzinessSeverity <= 3);
    return allLogs;
  }, [allLogs, filter]);

  function getSeverityIcon(severity: number) {
    if (severity <= 3) return <Smile size={20} className="icon-good" />;
    if (severity <= 6) return <Meh size={20} className="icon-moderate" />;
    return <Frown size={20} className="icon-bad" />;
  }

  function getSeverityClass(severity: number) {
    if (severity <= 3) return 'severity-low';
    if (severity <= 6) return 'severity-medium';
    return 'severity-high';
  }

  return (
    <div className="page history-page">
      <h1>History</h1>

      <div className="filter-bar">
        <button
          className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({allLogs.length})
        </button>
        <button
          className={`tab ${filter === 'high' ? 'tab-active' : ''}`}
          onClick={() => setFilter('high')}
        >
          Bad Days
        </button>
        <button
          className={`tab ${filter === 'low' ? 'tab-active' : ''}`}
          onClick={() => setFilter('low')}
        >
          Good Days
        </button>
      </div>

      <div className="history-list">
        {filtered.map((log) => (
          <div
            key={log.id}
            className={`history-card ${getSeverityClass(log.dizzinessSeverity)}`}
            onClick={() => navigate(`/log?date=${log.date}`)}
          >
            <div className="history-card-left">
              {getSeverityIcon(log.dizzinessSeverity)}
              <div className="history-card-info">
                <span className="history-date">{formatDisplay(log.date)}</span>
                <span className="history-details">
                  Dizziness: {log.dizzinessSeverity}/10
                  {' · '}Sleep: {log.sleepHours}h
                  {' · '}Stress: {log.stressLevel}/10
                </span>
                {log.triggers.length > 0 && (
                  <span className="history-triggers">
                    {log.triggers.slice(0, 3).join(', ')}
                    {log.triggers.length > 3 && ` +${log.triggers.length - 3}`}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight size={18} className="history-chevron" />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No entries found. Start logging to see your history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
