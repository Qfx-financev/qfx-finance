'use client'

import { ReactNode } from 'react'

export default function DashboardShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#070b14] text-white px-6 py-8">{children}</div>
}
