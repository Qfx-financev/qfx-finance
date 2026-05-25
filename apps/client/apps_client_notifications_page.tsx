'use client'
import { useEffect, useState } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import { api } from '@/services/api'
import { useAuthStore } from './apps_client_authStore'

export default function NotificationsPage(){
  const user = useAuthStore((s:any)=>s.user)
  const [rows,setRows] = useState<any[]>([])

  useEffect(()=>{
    if(user?.id){
      api.get(`/notifications/${user.id}`).then(res=>setRows(res.data))
    }
  },[user])

  return (
    <DashboardShell>
      <div className="space-y-4">
        {rows.map((n)=>(
          <div key={n.id} className="bg-white/5 p-5 rounded-2xl">
            <h3>{n.title}</h3>
            <p>{n.message}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
