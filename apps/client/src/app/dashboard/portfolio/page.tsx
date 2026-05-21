'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { StatCard } from '@/components/ui/StatCard';
import { PortfolioChart, AllocationChart } from '@/components/charts/PortfolioChart';
import api from '@/lib/api';

const PLAN_COLOR: Record<string, string> = {
  BRONZE: '#cd7f32', SILVER: '#c0c0c0', GOLD: '#f4c430', VIP: '#7b61ff',
};

export default function PortfolioPage() {
  const user = useAuthStore((s) => s.user);

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: () => api.get('/investments/my').then(r => r.data),
  });

  const active = investments.filter((i: any) => i.isActive);
  const closed = investments.filter((i: any) => !i.isActive);
  const totalInvested = active.reduce((a: number, i: any) => a + Number(i.amount), 0);
  const totalEarned = investments.reduce((a: number, i: any) => a + Number(i.totalEarned), 0);
  const dailyIncome = active.reduce((a: number, i: any) => a + Number(i.amount) * Number(i.dailyReturn), 0);

  const allocationData = Object.entries(
    active.reduce((acc: any, i: any) => {
      acc[i.plan] = (acc[i.plan] || 0) + Number(i.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value: value as number }));

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Portfolio</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Your investment performance overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard label="Total Invested" value={`$${totalInvested.toLocaleString()}`} sub="Active capital" accent="var(--accent-primary)" />
        <StatCard label="Total Earned" value={`$${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} sub="All-time profits" accent="var(--accent-gold)" trend={1} />
        <StatCard label="Daily Income" value={`$${dailyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} sub="Expected today" accent="var(--success)" trend={1} />
        <StatCard label="Active Plans" value={active.length} sub={`${closed.length} completed`} accent="var(--accent-secondary)" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '20px' }}>Growth Curve</h3>
          <PortfolioChart />
        </div>
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Allocation</h3>
          <AllocationChart plans={allocationData} />
        </div>
      </div>

      {/* Active Investments */}
      {active.length > 0 && (
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '20px' }}>Active Investments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {active.map((inv: any) => {
              const progress = inv.endDate
                ? Math.min(100, ((Date.now() - new Date(inv.startDate).getTime()) /
                    (new Date(inv.endDate).getTime() - new Date(inv.startDate).getTime())) * 100)
                : 50;
              const color = PLAN_COLOR[inv.plan] || 'var(--accent-primary)';
              return (
                <div key={inv.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                      <span style={{ fontWeight: 600, color }}>{inv.plan}</span>
                    </div>
                    <span className="badge badge-success">Active</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '14px' }}>
                    {[
                      { l: 'Invested', v: `$${Number(inv.amount).toLocaleString()}` },
                      { l: 'Daily Rate', v: `${(Number(inv.dailyReturn) * 100).toFixed(1)}%` },
                      { l: 'Earned', v: `$${Number(inv.totalEarned).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
                      { l: 'Ends', v: inv.endDate ? new Date(inv.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' },
                    ].map(({ l, v }) => (
                      <div key={l}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{l}</div>
                        <div className="mono" style={{ fontSize: '13px', fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{progress.toFixed(0)}% complete</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && investments.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
          <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>No investments yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Start growing your wealth today</p>
          <a href="/dashboard/invest" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Plans</a>
        </div>
      )}
    </div>
  );
}
