'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const PLAN_META: Record<string, { color: string; accent: string; icon: string; description: string }> = {
  BRONZE: { color: '#cd7f32', accent: 'rgba(205,127,50,0.1)', icon: '🥉', description: 'Perfect entry point for new investors' },
  SILVER: { color: '#c0c0c0', accent: 'rgba(192,192,192,0.1)', icon: '🥈', description: 'Balanced returns for growing portfolios' },
  GOLD: { color: '#f4c430', accent: 'rgba(244,196,48,0.1)', icon: '🥇', description: 'Premium returns for serious investors' },
  VIP: { color: '#7b61ff', accent: 'rgba(123,97,255,0.1)', icon: '💎', description: 'Institutional-grade maximum returns' },
};

export default function InvestPage() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ plan: string; minAmount: number } | null>(null);
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/investments/plans').then(r => r.data),
  });

  const activate = useMutation({
    mutationFn: (body: { plan: string; amount: number }) => api.post('/investments/activate', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['investments'] });
      qc.invalidateQueries({ queryKey: ['me'] });
      setSuccess(`${modal?.plan} plan activated successfully!`);
      setModal(null); setAmount('');
    },
    onError: (e: any) => setError(e.response?.data?.message || 'Activation failed'),
  });

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Investment Plans</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Available balance: <span className="mono" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
            ${Number(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </p>
      </div>

      {success && (
        <div style={{ background: 'rgba(0,208,132,0.1)', border: '1px solid rgba(0,208,132,0.3)', borderRadius: '10px', padding: '14px 20px', marginBottom: '24px', color: 'var(--success)', fontSize: '14px' }}>
          ✅ {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {plans.map((plan: any) => {
          const meta = PLAN_META[plan.plan] || PLAN_META.BRONZE;
          return (
            <div key={plan.plan} className="glass-card" style={{ border: `1px solid ${meta.color}30`, background: meta.accent, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: meta.color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '28px' }}>{meta.icon}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: meta.color, marginTop: '8px' }}>{plan.plan}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: meta.color }}>
                    {(Number(plan.dailyReturn) * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px' }}>DAILY ROI</div>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>{meta.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                {[
                  { l: 'Min. Investment', v: `$${Number(plan.minAmount).toLocaleString()}` },
                  { l: 'Max. Investment', v: plan.maxAmount ? `$${Number(plan.maxAmount).toLocaleString()}` : 'Unlimited' },
                  { l: 'Duration', v: `${plan.durationDays} days` },
                  { l: 'Total Return', v: `${(Number(plan.dailyReturn) * plan.durationDays * 100).toFixed(0)}%` },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>{l}</div>
                    <div className="mono" style={{ fontSize: '14px', fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>

              <button className="btn-primary" style={{ width: '100%', background: `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)` }}
                onClick={() => { setModal({ plan: plan.plan, minAmount: Number(plan.minAmount) }); setError(''); setAmount(''); }}>
                Activate Plan
              </button>
            </div>
          );
        })}
      </div>

      {/* Activation Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '420px', border: '1px solid var(--border-glass)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Activate {modal.plan} Plan</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              Minimum investment: <strong className="mono">${modal.minAmount.toLocaleString()}</strong>
            </p>
            {error && <div style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Investment Amount (USD)
            </label>
            <input className="input" type="number" placeholder={`Min. $${modal.minAmount}`} value={amount}
              onChange={e => setAmount(e.target.value)} style={{ marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }}
                disabled={activate.isPending}
                onClick={() => activate.mutate({ plan: modal.plan, amount: Number(amount) })}>
                {activate.isPending ? 'Activating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
