'use client'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import AdminShell from '@/components/AdminShell'

export default function KycPage(){
  const [rows,setRows] = useState<any[]>([])

  useEffect(()=>{ api.get('/admin/kyc').then(res=>setRows(res.data)) },[])

  return (
    <AdminShell>
      <div className="space-y-4">
        {rows.map((r)=>(
          <div key={r.id} className="bg-white/5 p-5 rounded-2xl flex justify-between">
            <div>{r.userId}</div>
            <div>{r.documentType}</div>
            <div>{r.status}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
