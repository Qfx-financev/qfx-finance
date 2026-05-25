'use client'
import { Bell, UserCircle2 } from 'lucide-react'
import { useAuthStore } from './apps_client_authStore'

export default function TopHeader(){
  const user = useAuthStore((s:any)=>s.user)

  return (
    <div className="flex justify-between items-center mb-10">
      <div>
        <p className="text-white/50">Welcome back</p>
        <h2 className="text-2xl font-bold">{user?.fullName || 'Client'}</h2>
      </div>
      <div className="flex gap-5 items-center">
        <Bell />
        <UserCircle2 />
      </div>
    </div>
  )
}
