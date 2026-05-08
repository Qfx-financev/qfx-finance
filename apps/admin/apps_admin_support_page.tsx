'use client'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import AdminShell from '@/components/AdminShell'

export default function SupportPage(){
  const [rows,setRows] = useState<any[]>([])

  useEffect(()=>{ api.get('/admin/support').then(res=>setRows(res.data)) },[])

  return (
    <AdminShell>
      <div className="space-y-4">
        {rows.map((r)=>(
          <div key={r.id} className="bg-white/5 p-5 rounded-2xl">
            <h3>{r.subject}</h3>
            <p>{r.message}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
