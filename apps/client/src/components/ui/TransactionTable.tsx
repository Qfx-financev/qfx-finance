'use client';

interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  description?: string;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  COMPLETED: 'badge-success', PENDING: 'badge-pending',
  PROCESSING: 'badge-info', FAILED: 'badge-danger', CANCELLED: 'badge-danger',
};

const typeIcon: Record<string, string> = {
  DEPOSIT: '↓', WITHDRAWAL: '↑', TRANSFER: '⇄',
  INVESTMENT: '◆', PROFIT_DISTRIBUTION: '★', FEE: '−',
};

const typeColor: Record<string, string> = {
  DEPOSIT: 'var(--success)', WITHDRAWAL: 'var(--danger)',
  TRANSFER: 'var(--accent-primary)', INVESTMENT: 'var(--accent-secondary)',
  PROFIT_DISTRIBUTION: 'var(--accent-gold)', FEE: 'var(--text-muted)',
};

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (!transactions.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        No transactions yet
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: typeColor[tx.type], fontSize: '18px', fontWeight: 700 }}>
                    {typeIcon[tx.type] || '•'}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{tx.type.replace('_', ' ')}</span>
                </div>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                {tx.description || '—'}
              </td>
              <td>
                <span className="mono" style={{ fontWeight: 600, color: ['DEPOSIT', 'PROFIT_DISTRIBUTION'].includes(tx.type) ? 'var(--success)' : 'var(--text-primary)' }}>
                  {['DEPOSIT', 'PROFIT_DISTRIBUTION'].includes(tx.type) ? '+' : '-'}
                  ${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </td>
              <td>
                <span className={`badge ${statusColor[tx.status] || 'badge-info'}`}>
                  {tx.status}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
