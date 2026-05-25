import Link from 'next/link'

type ThemePreset = {
  name: string
  accent: string
  description: string
  tokens: string[]
}

const themePresets: ThemePreset[] = [
  {
    name: 'Qfx-finance Nebula Dashboard',
    accent: 'from-cyan-400 to-violet-500',
    description: 'Dark premium dashboard with collapsible sidebar, glass panels, and rich finance widgets.',
    tokens: ['#070B14', '#0C1220', '#00D4FF', '#8B5CF6'],
  },
  {
    name: 'KYC Priority Flow',
    accent: 'from-amber-400 to-orange-500',
    description: 'Compliance-first variation with prominent verification prompts and high-contrast status cues.',
    tokens: ['#F59E0B', '#EF4444', '#94A3B8', '#111827'],
  },
  {
    name: 'Growth Portfolio Pro',
    accent: 'from-emerald-400 to-cyan-500',
    description: 'Performance-oriented layout for portfolio, crypto watchlists, and transaction insights.',
    tokens: ['#10B981', '#00D4FF', '#64748B', '#0F172A'],
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_60%)] text-white">
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Qfx-finance</h1>

        <p className="text-lg md:text-xl text-slate-300 mb-3">Premium Digital Banking & Crypto Investment Platform</p>
        <p className="text-sm text-slate-400 mb-10 max-w-3xl mx-auto">
          Updated with the v2 dashboard theme direction: collapsible navigation, glass cards, KYC banner hierarchy, and
          portfolio analytics styling.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-14">
          <Link href="/login" className="glass-button-primary px-8 py-4 rounded-xl">
            Login
          </Link>

          <Link href="/register" className="border border-white/40 hover:border-white px-8 py-4 rounded-xl transition">
            Open Account
          </Link>
        </div>

        <div className="glass-card p-6 md:p-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-2">
            <h2 className="text-2xl font-semibold">Updated Theme Templates (v2)</h2>
            <span className="text-sm text-slate-300">Aligned to sidebar + dashboard preview direction</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {themePresets.map((theme) => (
              <article key={theme.name} className="rounded-2xl border border-white/15 bg-white/5 p-5 hover:bg-white/10 transition">
                <div className={`h-2 w-full rounded-full bg-gradient-to-r ${theme.accent} mb-4`} />
                <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{theme.description}</p>
                <div className="flex flex-wrap gap-2">
                  {theme.tokens.map((token) => (
                    <span key={token} className="text-xs font-medium text-slate-200 border border-white/20 bg-white/5 px-2 py-1 rounded-md">
                      {token}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
