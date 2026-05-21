'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', form);
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>{label}</label>
      <input className="input" type={type} placeholder={placeholder} value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
    </div>
  );

  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Create account</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Join QFX Finance today</p>

      {error && (
        <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {field('firstName', 'First Name', 'text', 'John')}
          {field('lastName', 'Last Name', 'text', 'Doe')}
        </div>
        {field('email', 'Email', 'email', 'you@example.com')}
        {field('password', 'Password', 'password', '••••••••')}
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Minimum 8 characters with uppercase, number, and symbol.
        </p>
        <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link href="/auth/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
