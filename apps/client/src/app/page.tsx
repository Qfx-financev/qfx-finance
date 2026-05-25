import Link from 'next/link'

const themes = [
  {
    name: 'Midnight Pro',
    accent: 'from-blue-500 to-cyan-400',
    description: 'Dark-first premium banking experience for pro traders.',
  },
  {
    name: 'Aurora Wealth',
    accent: 'from-fuchsia-500 to-violet-500',
    description: 'Luxury gradient palette for high-end portfolio clients.',
  },
  {
    name: 'Forest Ledger',
    accent: 'from-emerald-500 to-lime-400',
    description: 'Modern green variant focused on sustainability investing.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_60%)] text-white">
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">QFX Finance</h1>

        <p className="text-lg md:text-xl text-slate-300 mb-10">
          Premium Digital Banking & Crypto Investment Platform
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
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold">Theme Templates</h2>
            <span className="text-sm text-slate-300">Ready for production customization</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {themes.map((theme) => (
              <article key={theme.name} className="rounded-2xl border border-white/15 bg-white/5 p-5 hover:bg-white/10 transition">
                <div className={`h-2 w-full rounded-full bg-gradient-to-r ${theme.accent} mb-4`} />
                <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{theme.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
