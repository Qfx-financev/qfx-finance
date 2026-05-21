'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { StatCard } from '@/components/ui/StatCard';
import { TransactionTable } from '@/components/ui/TransactionTable';
import { PortfolioChart } from '@/components/charts/PortfolioChart';
import api from '@/lib/api';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: txData } = useQuery({
    queryKey: ['transactions', 1],
    queryFn: () => api.get('/transactions?limit=8').then(r => r.data),
  });

  const { data: investments } = useQuery({
    queryKey: ['investments'],
    queryFn: () => api.get('/investments/my').then(r => r.data),
  });

  const activeInvestments = investments?.filter((i: any) => i.isActive) || [];
  const totalInvested = activeInvestments.reduce((a: number, i: any) => a + Number(i.amount), 0);
  const totalEarned = activeInvestments.reduce((a: number, i: any) => a + Number(i.totalEarned), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>
          Good {getGreeting()}, {user?.firstName} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Here&apos;s your financial overview
        </p>
      </div>

      {/* KYC Banner */}
      {user?.kycStatus !== 'APPROVED' && (
        <div style={{ background: 'rgba(244,196,48,0.08)', border: '1px solid rgba(244,196,48,0.2)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚠️</span>
            <span style={{ fontSize: '14px', color: 'var(--warning)' }}>
              Complete KYC verification to unlock full platform features
            </span>
          </div>
          <a href="/dashboard/kyc" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-gold)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Verify Now →
          </a>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard
          label="Total Balance"
          value={`$${Number(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          sub="Available funds"
          accent="var(--accent-primary)"
        />
        <StatCard
          label="Active Investments"
          value={activeInvestments.length}
          sub={`$${totalInvested.toLocaleString()} invested`}
          accent="var(--accent-secondary)"
        />
        <StatCard
          label="Total Earned"
          value={`$${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          sub="All-time profits"
          accent="var(--accent-gold)"
          trend={totalEarned > 0 ? 1 : undefined}
        />
        <StatCard
          label="Portfolio Growth"
          value={totalInvested > 0 ? `${((totalEarned / totalInvested) * 100).toFixed(2)}%` : '0.00%'}
          sub="Return on investment"
          accent="var(--success)"
          trend={totalEarned > 0 ? 1 : undefined}
        />
      </div>

      {/* Chart + Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '16px' }}>Portfolio Performance</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Last 30 days</span>
          </div>
          <PortfolioChart />
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '16px' }}>Recent Transactions</h3>
            <a href="/dashboard/transactions" style={{ fontSize: '13px', color: 'var(--accent-primary)', textDecoration: 'none' }}>
              View all →
            </a>
          </div>
          <TransactionTable transactions={txData?.data || []} />
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
