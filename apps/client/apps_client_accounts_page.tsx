'use client'
import DashboardShell from '@/components/layout/DashboardShell'
import { useAuthStore } from './apps_client_authStore'
import { formatCurrency } from '@packages/utils/account'

export default function AccountsPage(){
  const user = useAuthStore((s:any)=>s.user)

  return (
    <DashboardShell>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/5 p-8 rounded-3xl">
          <h3 className="text-xl font-semibold mb-3">Checking Account</h3>
          <p className="text-4xl font-bold">{formatCurrency(user?.checkingBalance || 0)}</p>
        </div>
        <div className="bg-white/5 p-8 rounded-3xl">
          <h3 className="text-xl font-semibold mb-3">Crypto Wallet Value</h3>
          <p className="text-4xl font-bold">{formatCurrency(user?.cryptoBalance || 0)}</p>
        </div>
      </div>
    </DashboardShell>
  )
}
