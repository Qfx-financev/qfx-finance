'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  trend?: number;
}

export function StatCard({ label, value, sub, accent = 'var(--accent-primary)', trend }: StatCardProps) {
  return (
    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>
        {label}
      </div>
      <div className="mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {value}
      </div>
      {(sub || trend !== undefined) && (
        <div style={{ fontSize: '13px', color: trend !== undefined ? (trend >= 0 ? 'var(--success)' : 'var(--danger)') : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {trend !== undefined && <span>{trend >= 0 ? '↑' : '↓'}</span>}
          {sub}
        </div>
      )}
    </div>
  );
}
