'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const CHAINS = [
  { id: 'ETH', label: 'Ethereum', icon: '⟠', color: '#627EEA' },
  { id: 'BTC', label: 'Bitcoin', icon: '₿', color: '#F7931A' },
  { id: 'TRX', label: 'TRON (USDT)', icon: '◈', color: '#EF0027' },
  { id: 'BNB', label: 'BNB Chain', icon: '◆', color: '#F0B90B' },
  { id: 'SOL', label: 'Solana', icon: '◎', color: '#9945FF' },
];

export default function WalletConnectPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ address: '', chain: 'ETH', label: '' });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const { data: myWallets = [] } = useQuery({
    queryKey: ['my-wallets'],
    queryFn: () => api.get('/wallets/my').then(r => r.data),
  });

  const { data: platformWallets = [] } = useQuery({
    queryKey: ['platform-wallets'],
    queryFn: () => api.get('/wallets/platform').then(r => r.data),
  });

  const linkWallet = useMutation({
    mutationFn: () => api.post('/wallets/link', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-wallets'] });
      setFeedback({ type: 'success', msg: 'Wallet linked successfully' });
      setForm({ address: '', chain: 'ETH', label: '' });
    },
    onError: (e: any) => setFeedback({ type: 'error', msg: e.response?.data?.message || 'Failed to link wallet' }),
  });

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Wallet Connect</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Link your crypto wallets and view deposit addresses</p>
      </div>

      {feedback && (
        <div style={{ background: feedback.type === 'success' ? 'rgba(0,208,132,0.1)' : 'rgba(255,71,87,0.1)', border: `1px solid ${feedback.type === 'success' ? 'rgba(0,208,132,0.3)' : 'rgba(255,71,87,0.3)'}`, borderRadius: '10px', padding: '14px 20px', marginBottom: '24px', fontSize: '14px', color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
          {feedback.msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Link Wallet Form */}
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '20px' }}>Link a Wallet</h3>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Blockchain Network</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {CHAINS.map(c => (
              <button key={c.id} onClick={() => setForm(f => ({ ...f, chain: c.id }))}
                style={{ padding: '10px 6px', borderRadius: '10px', border: `1px solid ${form.chain === c.id ? c.color : 'var(--border-glass)'}`, background: form.chain === c.id ? `${c.color}15` : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{c.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: form.chain === c.id ? c.color : 'var(--text-muted)' }}>{c.id}</div>
              </button>
            ))}
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Wallet Address</label>
          <input className="input" placeholder="0x..." value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={{ marginBottom: '16px', fontFamily: 'monospace', fontSize: '13px' }} />

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Label (optional)</label>
          <input className="input" placeholder="e.g. My MetaMask" value={form.label}
            onChange={e => setForm(f => ({ ...f, label: e.target.value }))} style={{ marginBottom: '20px' }} />

          <button className="btn-primary" style={{ width: '100%' }}
            disabled={!form.address || linkWallet.isPending}
            onClick={() => linkWallet.mutate()}>
            {linkWallet.isPending ? 'Linking...' : 'Link Wallet'}
          </button>
        </div>

        {/* My Wallets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card">
            <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '16px' }}>My Wallets ({myWallets.length})</h3>
            {myWallets.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No wallets linked yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myWallets.map((w: any) => {
                  const chain = CHAINS.find(c => c.id === w.chain);
                  return (
                    <div key={w.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ color: chain?.color }}>{chain?.icon}</span>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: chain?.color }}>{w.chain}</span>
                        {w.label && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>· {w.label}</span>}
                      </div>
                      <div className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{w.address}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Platform Deposit Wallets */}
          <div className="glass-card">
            <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Deposit Addresses</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Send funds to these addresses to deposit</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {platformWallets.map((w: any) => {
                const chain = CHAINS.find(c => c.id === w.chain);
                return (
                  <div key={w.id} style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: chain?.color }}>{chain?.icon || '◎'}</span>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{w.label}</span>
                      </div>
                      <button onClick={() => navigator.clipboard.writeText(w.address)}
                        style={{ fontSize: '11px', color: 'var(--accent-primary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>
                        Copy
                      </button>
                    </div>
                    <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{w.address}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
