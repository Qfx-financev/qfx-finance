export default function TransactionTable({ rows }: { rows:any[] }) {
  return (
    <div className="space-y-3">
      {rows.map((tx)=>(
        <div key={tx.id} className="bg-white/5 p-5 rounded-2xl flex justify-between">
          <div>
            <p className="uppercase font-semibold">{tx.type}</p>
            <p className="text-sm text-white/50">{tx.reference}</p>
          </div>
          <div>{tx.amount}</div>
          <div>{tx.status}</div>
        </div>
      ))}
    </div>
  )
}
