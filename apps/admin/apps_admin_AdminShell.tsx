'use client'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      <aside className="w-72 bg-white/5 p-8 space-y-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/users">Users</Link>
        <Link href="/deposits">Deposits</Link>
        <Link href="/withdrawals">Withdrawals</Link>
        <Link href="/kyc">KYC</Link>
        <Link href="/support">Support</Link>
        <Link href="/wallets">Wallets</Link>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  )
}
