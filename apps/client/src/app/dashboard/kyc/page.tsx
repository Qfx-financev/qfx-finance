'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const DOC_TYPES = [
  { id: 'NATIONAL_ID', label: 'National ID', icon: '🪪', desc: 'Front and back of your government-issued ID' },
  { id: 'PASSPORT', label: 'Passport', icon: '🛂', desc: 'Photo page of your passport' },
  { id: 'DRIVERS_LICENSE', label: "Driver's License", icon: '🚗', desc: 'Front of your driver\'s license' },
  { id: 'PROOF_OF_ADDRESS', label: 'Proof of Address', icon: '🏠', desc: 'Utility bill or bank statement (last 3 months)' },
  { id: 'SELFIE', label: 'Selfie with ID', icon: '🤳', desc: 'Selfie holding your ID document' },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  PENDING:      { color: 'var(--accent-secondary)', bg: 'rgba(123,97,255,0.1)',  label: 'Verification Pending',  icon: '⏳' },
  UNDER_REVIEW: { color: 'var(--warning)',           bg: 'rgba(255,165,2,0.1)',   label: 'Under Review',          icon: '🔍' },
  APPROVED:     { color: 'var(--success)',            bg: 'rgba(0,208,132,0.1)',   label: 'Verified',              icon: '✅' },
  REJECTED:     { color: 'var(--danger)',             bg: 'rgba(255,71,87,0.1)',   label: 'Rejected',              icon: '❌' },
};

export default function KycPage() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [selectedType, setSelectedType] = useState('NATIONAL_ID');
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const { data: documents = [] } = useQuery({
    queryKey: ['kyc-docs'],
    queryFn: () => api.get('/kyc/documents').then(r => r.data),
  });

  const upload = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('file', file!);
      fd.append('type', selectedType);
      return api.post('/kyc/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kyc-docs'] });
      setFeedback({ type: 'success', msg: 'Document uploaded successfully. Our team will review it shortly.' });
      setFile(null);
    },
    onError: (e: any) => setFeedback({ type: 'error', msg: e.response?.data?.message || 'Upload failed' }),
  });

  const kycStatus = user?.kycStatus || 'PENDING';
  const statusCfg = STATUS_CONFIG[kycStatus] || STATUS_CONFIG.PENDING;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>KYC Verification</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Complete identity verification to unlock all features</p>
      </div>

      {/* Status Banner */}
      <div style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.color}40`, borderRadius: '14px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '32px' }}>{statusCfg.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: statusCfg.color }}>{statusCfg.label}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {kycStatus === 'APPROVED' && 'Your identity has been verified. You have full platform access.'}
            {kycStatus === 'PENDING' && 'Please upload the required documents below to start verification.'}
            {kycStatus === 'UNDER_REVIEW' && 'Your documents are being reviewed. This usually takes 1–3 business days.'}
            {kycStatus === 'REJECTED' && 'Your documents were rejected. Please re-upload clearer copies.'}
          </div>
        </div>
      </div>

      {feedback && (
        <div style={{ background: feedback.type === 'success' ? 'rgba(0,208,132,0.1)' : 'rgba(255,71,87,0.1)', border: `1px solid ${feedback.type === 'success' ? 'rgba(0,208,132,0.3)' : 'rgba(255,71,87,0.3)'}`, borderRadius: '10px', padding: '14px 20px', marginBottom: '24px', fontSize: '14px', color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
          {feedback.msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Upload Form */}
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '20px' }}>Upload Document</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {DOC_TYPES.map(dt => (
              <button key={dt.id} onClick={() => setSelectedType(dt.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${selectedType === dt.id ? 'var(--accent-primary)' : 'var(--border-glass)'}`, background: selectedType === dt.id ? 'rgba(0,212,255,0.08)' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <span style={{ fontSize: '20px' }}>{dt.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: selectedType === dt.id ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{dt.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dt.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* File Drop Area */}
          <div style={{ border: `2px dashed ${file ? 'var(--success)' : 'var(--border-glass)'}`, borderRadius: '12px', padding: '28px', textAlign: 'center', marginBottom: '16px', cursor: 'pointer', transition: 'all 0.15s', background: file ? 'rgba(0,208,132,0.05)' : 'transparent' }}
            onClick={() => document.getElementById('kyc-file')?.click()}>
            <input id="kyc-file" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }}
              onChange={e => setFile(e.target.files?.[0] || null)} />
            {file ? (
              <>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--success)' }}>{file.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(0)} KB</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📎</div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Click to upload</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>JPEG or PNG, max 10MB</div>
              </>
            )}
          </div>

          <button className="btn-primary" style={{ width: '100%' }} disabled={!file || upload.isPending}
            onClick={() => upload.mutate()}>
            {upload.isPending ? 'Uploading...' : 'Submit Document'}
          </button>
        </div>

        {/* Uploaded Documents */}
        <div className="glass-card">
          <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '20px' }}>Submitted Documents</h3>
          {documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
              No documents submitted yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {documents.map((doc: any) => {
                const dt = DOC_TYPES.find(d => d.id === doc.type);
                const sc = STATUS_CONFIG[doc.status] || STATUS_CONFIG.PENDING;
                return (
                  <div key={doc.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{dt?.icon || '📄'}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{dt?.label || doc.type}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <span className={`badge`} style={{ background: sc.bg, color: sc.color }}>
                      {sc.icon} {doc.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,212,255,0.04)', borderRadius: '10px', border: '1px solid rgba(0,212,255,0.1)' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', color: 'var(--accent-primary)' }}>Required Documents</div>
            {DOC_TYPES.slice(0, 3).map(dt => {
              const submitted = documents.some((d: any) => d.type === dt.id);
              return (
                <div key={dt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: submitted ? 'var(--success)' : 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>{submitted ? '✅' : '○'}</span>
                  {dt.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
