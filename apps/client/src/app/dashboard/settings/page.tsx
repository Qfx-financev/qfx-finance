'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [qrCode, setQrCode] = useState('');
  const [twoFaToken, setTwoFaToken] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | '2fa'>('profile');
  const [feedback, setFeedback] = useState<Record<string, { type: 'success' | 'error'; msg: string }>>({});

  const setFb = (key: string, type: 'success' | 'error', msg: string) => {
    setFeedback(f => ({ ...f, [key]: { type, msg } }));
    setTimeout(() => setFeedback(f => { const n = { ...f }; delete n[key]; return n; }), 4000);
  };

  const updateProfile = useMutation({
    mutationFn: () => api.patch('/users/me', { firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone }),
    onSuccess: (r) => { updateUser(r.data); setFb('profile', 'success', 'Profile updated'); },
    onError: () => setFb('profile', 'error', 'Update failed'),
  });

  const changePassword = useMutation({
    mutationFn: () => api.patch('/users/me/password', { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }),
    onSuccess: () => { setPwd({ currentPassword: '', newPassword: '', confirm: '' }); setFb('pwd', 'success', 'Password changed'); },
    onError: (e: any) => setFb('pwd', 'error', e.response?.data?.message || 'Failed'),
  });

  const setup2fa = useMutation({
    mutationFn: () => api.get('/auth/2fa/setup'),
    onSuccess: (r) => setQrCode(r.data.qrCode),
  });

  const enable2fa = useMutation({
    mutationFn: () => api.post('/auth/2fa/enable', { token: twoFaToken }),
    onSuccess: () => { updateUser({ twoFactorEnabled: true } as any); setFb('2fa', 'success', '2FA enabled'); setQrCode(''); setTwoFaToken(''); },
    onError: () => setFb('2fa', 'error', 'Invalid code'),
  });

  const TABS = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: '2fa', label: 'Two-Factor Auth' },
  ];

  const Feedback = ({ k }: { k: string }) => feedback[k] ? (
    <div style={{ background: feedback[k].type === 'success' ? 'rgba(0,208,132,0.1)' : 'rgba(255,71,87,0.1)', border: `1px solid ${feedback[k].type === 'success' ? 'rgba(0,208,132,0.3)' : 'rgba(255,71,87,0.3)'}`, borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: feedback[k].type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
      {feedback[k].msg}
    </div>
  ) : null;

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            style={{ flex: 1, padding: '8px 16px', borderRadius: '9px', border: 'none', background: activeTab === t.id ? 'var(--bg-card)' : 'transparent', color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: activeTab === t.id ? 600 : 400, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, marginBottom: '20px' }}>Personal Information</h3>
          <Feedback k="profile" />

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#0a0e1a' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</div>
              <span className={`badge ${user?.kycStatus === 'APPROVED' ? 'badge-success' : 'badge-pending'}`} style={{ marginTop: '6px' }}>
                {user?.kycStatus}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {[
              { key: 'firstName', label: 'First Name' },
              { key: 'lastName', label: 'Last Name' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>{label}</label>
                <input className="input" value={profile[key as keyof typeof profile]}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Phone (optional)</label>
            <input className="input" placeholder="+1 234 567 8900" value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
          </div>

          <button className="btn-primary" disabled={updateProfile.isPending} onClick={() => updateProfile.mutate()}>
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, marginBottom: '20px' }}>Change Password</h3>
          <Feedback k="pwd" />

          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>{label}</label>
              <input className="input" type="password" placeholder="••••••••"
                value={pwd[key as keyof typeof pwd]}
                onChange={e => setPwd(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}

          {pwd.newPassword && pwd.confirm && pwd.newPassword !== pwd.confirm && (
            <div style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '12px' }}>Passwords do not match</div>
          )}

          <button className="btn-primary" style={{ marginTop: '4px' }}
            disabled={changePassword.isPending || !pwd.currentPassword || !pwd.newPassword || pwd.newPassword !== pwd.confirm}
            onClick={() => changePassword.mutate()}>
            {changePassword.isPending ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      )}

      {/* 2FA Tab */}
      {activeTab === '2fa' && (
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Two-Factor Authentication</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Add an extra layer of security using Google Authenticator or Authy
          </p>
          <Feedback k="2fa" />

          {user?.twoFactorEnabled ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(0,208,132,0.08)', borderRadius: '10px', border: '1px solid rgba(0,208,132,0.2)' }}>
              <span style={{ fontSize: '24px' }}>🔐</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--success)' }}>2FA is enabled</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Your account is protected with two-factor auth</div>
              </div>
            </div>
          ) : (
            <>
              {!qrCode ? (
                <button className="btn-primary" disabled={setup2fa.isPending} onClick={() => setup2fa.mutate()}>
                  {setup2fa.isPending ? 'Generating...' : 'Set Up 2FA'}
                </button>
              ) : (
                <div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Scan this QR code with your authenticator app, then enter the 6-digit code below.
                  </p>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '24px' }}>
                    <img src={qrCode} alt="2FA QR Code" style={{ display: 'block', width: '180px', height: '180px' }} />
                  </div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Authenticator Code
                  </label>
                  <input className="input" placeholder="000000" maxLength={6} value={twoFaToken}
                    onChange={e => setTwoFaToken(e.target.value)}
                    style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '6px', marginBottom: '16px' }} />
                  <button className="btn-primary" disabled={twoFaToken.length !== 6 || enable2fa.isPending}
                    onClick={() => enable2fa.mutate()}>
                    {enable2fa.isPending ? 'Verifying...' : 'Enable 2FA'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
