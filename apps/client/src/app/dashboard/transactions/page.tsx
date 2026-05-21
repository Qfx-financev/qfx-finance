'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionTable } from '@/components/ui/TransactionTable';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

type ModalType = 'deposit' | 'withdraw' | null;

export default function TransactionsPage() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [modal, setModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, filter],
    queryFn: () => api.get(`/transactions?page=${page}&limit=20${filter ? `&type=${filter}` : ''}`).then(r => r.data),
  });

  const deposit = useMutation({
    mutationFn: (amt: number) => api.post('/transactions/deposit', { amount: amt }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['me'] });
      setFeedback({ type: 'success', msg: 'Deposit initiated successfully' });
      setModal(null); setAmount('');
    },
    onError: (e: any) => setFeedback({ type: 'error', msg: e.response?.data?.message || 'Failed' }),
  });

  const withdraw = useMutation({
    mutationFn: (amt: number) => api.post('/transactions/withdraw', { amount: amt }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['me'] });
      setFeedback({ type: 'success', msg: 'Withdrawal request submitted' });
      setModal(null); setAmount('');
    },
    onError: (e: any) => setFeedback({ type: 'error', msg: e.response?.data?.message || 'Failed' }),
  });

  const FILTERS = ['', 'DEPOSIT', 'WITHDRAWAL', 'INVESTMENT', 'PROFIT_DISTRIBUTION'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Transactions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Balance: <span className="mono" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
              ${Number(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={() => { setModal('withdraw'); setFeedback(null); }}>
            ↑ Withdraw
          </button>
          <button className="btn-primary" onClick={() => { setModal('deposit'); setFeedback(null); }}>
            ↓ Deposit
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{ background: feedback.type === 'success' ? 'rgba(0,208,132,0.1)' : 'rgba(255,71,87,0.1)', border: `1px solid ${feedback.type === 'success' ? 'rgba(0,208,132,0.3)' : 'rgba(255,71,87,0.3)'}`, borderRadius: '10px', padding: '14px 20px', marginBottom: '24px', fontSize: '14px', color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
          {feedback.type === 'success' ? '✅' : '❌'} {feedback.msg}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(1); }}
            style={{ padding: '6px 14px', borderRadius: '100px', border: '1px solid', fontSize: '12px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase', transition: 'all 0.15s', borderColor: filter === f ? 'var(--accent-primary)' : 'var(--border-glass)', background: filter === f ? 'rgba(0,212,255,0.1)' : 'transparent', color: filter === f ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
            {f || 'All'}
          </button>
        ))}
      </div>

      <div className="glass-card">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <>
            <TransactionTable transactions={data?.data || []} />
            {data?.meta && data.meta.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Page {data.meta.page} of {data.meta.pages} · {data.meta.total} total
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-ghost" style={{ padding: '6px 16px', fontSize: '13px' }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <button className="btn-ghost" style={{ padding: '6px 16px', fontSize: '13px' }} disabled={page >= data.meta.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', textTransform: 'capitalize' }}>{modal}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              {modal === 'deposit' ? 'Add funds to your account' : `Available: $${Number(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </p>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Amount (USD)</label>
            <input className="input" type="number" placeholder="0.00" value={amount}
              onChange={e => setAmount(e.target.value)} style={{ marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }}
                disabled={deposit.isPending || withdraw.isPending || !amount}
                onClick={() => modal === 'deposit' ? deposit.mutate(Number(amount)) : withdraw.mutate(Number(amount))}>
                {deposit.isPending || withdraw.isPending ? 'Processing...' : `Confirm ${modal}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
