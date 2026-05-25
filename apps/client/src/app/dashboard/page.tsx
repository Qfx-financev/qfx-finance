'use client'

import { useEffect, useState } from 'react'

type HealthResponse = {
  status: string
  db: string
  redis: string
  uptimeSec: number
  timestamp: string
}

type PricesResponse = Record<string, { usd: number }>

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function formatUsd(value: number | undefined) {
  if (typeof value !== 'number') return '--'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [prices, setPrices] = useState<PricesResponse | null>(null)

  useEffect(() => {
    fetch(`${apiBase}/health`)
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth(null))

    fetch(`${apiBase}/crypto/prices`)
      .then((res) => res.json())
      .then(setPrices)
      .catch(() => setPrices(null))
  }, [])

  return (
    <main className="min-h-screen bg-[#070b14] text-white px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Qfx-finance Dashboard</h1>
        <p className="text-slate-400 mb-8">Live system status and market snapshot.</p>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="glass-card p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">API Status</p>
            <p className="text-2xl font-semibold">{health?.status || 'unknown'}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Database</p>
            <p className="text-2xl font-semibold">{health?.db || 'unknown'}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Redis</p>
            <p className="text-2xl font-semibold">{health?.redis || 'unknown'}</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Crypto Prices</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-sm text-slate-300 mb-1">Bitcoin (BTC)</p>
              <p className="text-xl font-bold">{formatUsd(prices?.bitcoin?.usd)}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-sm text-slate-300 mb-1">Ethereum (ETH)</p>
              <p className="text-xl font-bold">{formatUsd(prices?.ethereum?.usd)}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-sm text-slate-300 mb-1">Solana (SOL)</p>
              <p className="text-xl font-bold">{formatUsd(prices?.solana?.usd)}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
