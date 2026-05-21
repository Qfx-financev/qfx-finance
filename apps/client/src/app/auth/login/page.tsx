'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [twoFa, setTwoFa] = useState({ show: false, userId: '', token: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.requires2fa) {
        setTwoFa({ show: true, userId: data.userId, token: '' });
      } else {
        setAuth(data.user, data.accessToken, data.refreshToken);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handle2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/2fa/verify', { userId: twoFa.userId, token: twoFa.token });
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push('/dashboard');
    } catch {
      setError('Invalid 2FA code');
    } finally { setLoading(false); }
  };

  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
        {twoFa.show ? 'Two-Factor Auth' : 'Welcome back'}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
        {twoFa.show ? 'Enter your authenticator code' : 'Sign in to your account'}
      </p>

      {error && (
        <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {!twoFa.show ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handle2fa} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input className="input" type="text" placeholder="000000" maxLength={6} value={twoFa.token}
            onChange={e => setTwoFa(f => ({ ...f, token: e.target.value }))}
            style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }} required />
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
          Create account
        </Link>
      </p>
    </div>
  );
}
