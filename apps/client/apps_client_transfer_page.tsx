'use client'
import { useForm } from 'react-hook-form'
import DashboardShell from '@/components/layout/DashboardShell'
import { api } from '@/services/api'
import { useAuthStore } from './apps_client_authStore'

export default function TransferPage(){
  const { register, handleSubmit } = useForm()
  const user = useAuthStore((s:any)=>s.user)

  const submit = async(data:any)=>{
    await api.post('/transactions/transfer',{ ...data, userId:user.id })
    alert('Transfer initiated')
  }

  return (
    <DashboardShell>
      <form onSubmit={handleSubmit(submit)} className="max-w-2xl bg-white/5 p-8 rounded-3xl space-y-4">
        <input {...register('beneficiaryName')} placeholder="Beneficiary Name" className="w-full p-4 rounded-xl bg-black/30" />
        <input {...register('beneficiaryBank')} placeholder="Beneficiary Bank" className="w-full p-4 rounded-xl bg-black/30" />
        <input {...register('accountNumber')} placeholder="Account Number" className="w-full p-4 rounded-xl bg-black/30" />
        <input {...register('amount')} placeholder="Amount" className="w-full p-4 rounded-xl bg-black/30" />
        <button className="px-8 py-4 rounded-xl bg-blue-600">Send Transfer</button>
      </form>
    </DashboardShell>
  )
}
