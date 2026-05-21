import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 600 }}>
          Institutional Grade
        </span>
      </div>
      <h1 style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 800, lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-2px' }}>
        <span className="gradient-text">QFX</span> Finance
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '520px', marginBottom: '48px', lineHeight: 1.7 }}>
        Premium crypto banking and institutional wealth management. Grow your assets with confidence.
      </p>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/auth/register" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '15px' }}>
          Get Started
        </Link>
        <Link href="/auth/login" className="btn-ghost" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '15px' }}>
          Sign In
        </Link>
      </div>
      <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '600px', width: '100%' }}>
        {[
          { label: 'Assets Under Management', value: '$2.4B+' },
          { label: 'Active Investors', value: '18,400+' },
          { label: 'Avg. Daily Return', value: '3.5%' },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div className="mono" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
