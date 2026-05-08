export default function PageHeader({ title, subtitle }: { title:string, subtitle?:string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-white/50 mt-2">{subtitle}</p>}
    </div>
  )
}
