'use client'
import DashboardShell from '@/components/layout/DashboardShell'
import TopHeader from '@/components/layout/TopHeader'
import StatCard from '@packages/ui/StatCard'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@packages/utils/account'

export default function DashboardPage(){
  const user = useAuthStore((s:any)=>s.user)

  return (
    <DashboardShell>
      <TopHeader />
      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Checking Balance" value={formatCurrency(user?.checkingBalance || 0)} />
        <StatCard title="Crypto Holdings" value={formatCurrency(user?.cryptoBalance || 0)} />
        <StatCard title="Investments" value={formatCurrency(user?.investmentTotal || 0)} />
      </div>
    </DashboardShell>
  )
}
