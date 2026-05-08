import { ReactNode } from 'react'

export default function StatCard({ title, value, icon }: { title:string, value:string, icon?:ReactNode }) {
  return (
    <div className="bg-white/5 rounded-3xl p-6 shadow-xl border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/60">{title}</p>
        {icon}
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  )
}
