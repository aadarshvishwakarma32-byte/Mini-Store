import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '../../services/admin.service.js';

const formatUptime = (seconds) =>
  `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;

function AdminMonitoring() {
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    try {
      const result = await adminService.getMonitoring();
      setData(result.data);
    } catch {
      toast.error('Unable to load monitoring data');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [load]);

  if (!data) return <div className="adminDashboardLoading">Loading monitoring data…</div>;

  return (
    <section className="adminContentPage">
      <div className="adminPageIntro">
        <p className="adminEyebrow">SYSTEM MONITORING</p>
        <h1>Live store health</h1>
        <p>Updates automatically every 15 seconds while this page is open.</p>
      </div>
      <div className="adminStatsGrid">
        <article className="adminStatCard">
          <span>Server uptime</span>
          <strong>{formatUptime(data.uptimeSeconds)}</strong>
          <small>Current application runtime</small>
        </article>
        <article className="adminStatCard">
          <span>Memory</span>
          <strong>{data.memoryMb} MB</strong>
          <small>Server process usage</small>
        </article>
        <article className="adminStatCard">
          <span>Server errors</span>
          <strong>{data.errorCount}</strong>
          <small>Since last restart</small>
        </article>
        <article className="adminStatCard">
          <span>Active users</span>
          <strong>{data.totals.activeUsers}</strong>
          <small>{data.totals.users} total accounts</small>
        </article>
      </div>
      <article className="adminPanel">
        <div className="adminPanelTitle">
          <h2>Recent activity</h2>
          <button type="button" className="adminRefreshButton" onClick={load}>
            Refresh
          </button>
        </div>
        <div className="activityList">
          {data.recentActivity.map((entry, index) => (
            <div key={`${entry.createdAt}-${index}`}>
              <span className={entry.status >= 500 ? 'activityError' : ''}>
                {entry.method} {entry.path}
              </span>
              <small>
                {entry.status} · {entry.durationMs}ms
              </small>
            </div>
          ))}
          {!data.recentActivity.length && (
            <p className="adminEmpty">Activity will appear after the store receives requests.</p>
          )}
        </div>
      </article>
    </section>
  );
}

export default AdminMonitoring;
