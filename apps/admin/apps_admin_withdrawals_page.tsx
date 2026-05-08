'use client'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import AdminShell from '@/components/AdminShell'

export default function WithdrawalsPage(){
  const [rows,setRows] = useState<any[]>([])

  useEffect(()=>{ api.get('/admin/withdrawals').then(res=>setRows(res.data)) },[])

  const approve = async(id:string)=>{
    await api.patch(`/admin/approve/${id}`)
    location.reload()
  }

  return (
    <AdminShell>
      <div className="space-y-4">
        {rows.map((r)=>(
          <div key={r.id} className="bg-white/5 p-5 rounded-2xl flex justify-between">
            <div>{r.userId}</div>
            <div>${r.amount}</div>
            <button onClick={()=>approve(r.id)}>Approve</button>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
