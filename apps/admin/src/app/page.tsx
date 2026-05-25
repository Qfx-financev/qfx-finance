'use client';
import { useState, useEffect, useCallback } from 'react';

const API = 'https://api.qfx-finance.com/api';
type Tab = 'dashboard' | 'users' | 'transactions' | 'kyc';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [token, setToken] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchStats = useCallback(async () => {
    const r = await fetch(`${API}/admin/platform/stats`, { headers });
    if (r.ok) setStats(await r.json());
  }, [token]);

  const fetchUsers = useCallback(async () => {
    const r = await fetch(`${API}/admin/users?limit=50${search ? `&search=${search}` : ''}`, { headers });
    if (r.ok) { const d = await r.json(); setUsers(d.data || []); }
  }, [token, search]);

  const fetchTransactions = useCallback(async () => {
    const r = await fetch(`${API}/admin/transactions?limit=50`, { headers });
    if (r.ok) { const d = await r.json(); setTransactions(d.data || []); }
  }, [token]);

  const fetchKyc = useCallback(async () => {
    const r = await fetch(`${API}/admin/kyc/documents`, { headers });
    if (r.ok) setKycDocs(await r.json());
  }, [token]);

  useEffect(() => {
    const saved = localStorage.getItem('qfx-admin-token');
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchStats();
    if (tab === 'users') fetchUsers();
    if (tab === 'transactions') fetchTransactions();
    if (tab === 'kyc') fetchKyc();
  }, [token, tab]);

  const login = async () => {
    setLoginError(''); setLoading(true);
    try {
      const r = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
      const d = await r.json();
      if (!r.ok) { setLoginError(d.message || 'Login failed'); setLoading(false); return; }
      const me = await fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${d.accessToken}` } });
      const user = await me.json();
      if (!['SUPER_ADMIN','ADMIN','COMPLIANCE_OFFICER','KYC_OFFICER'].includes(user.role)) {
        setLoginError('Access denied. Admin role required.'); setLoading(false); return;
      }
      localStorage.setItem('qfx-admin-token', d.accessToken);
      setToken(d.accessToken);
    } catch { setLoginError('Connection failed'); }
    setLoading(false);
  };

  const updateKyc = async (userId: string, status: string) => {
    await fetch(`${API}/admin/users/${userId}/kyc`, { method: 'PATCH', headers, body: JSON.stringify({ status }) });
    setFeedback(`KYC ${status}`); fetchUsers(); fetchKyc();
    setTimeout(() => setFeedback(''), 3000);
  };

  const toggleUser = async (userId: string, isActive: boolean) => {
    await fetch(`${API}/admin/users/${userId}/status`, { method: 'PATCH', headers, body: JSON.stringify({ isActive }) });
    setFeedback(`User ${isActive ? 'activated' : 'suspended'}`); fetchUsers();
    setTimeout(() => setFeedback(''), 3000);
  };

  const approveTransaction = async (txId: string) => {
    await fetch(`${API}/admin/transactions/${txId}/approve`, { method: 'PATCH', headers });
    setFeedback('Transaction approved'); fetchTransactions();
    setTimeout(() => setFeedback(''), 3000);
  };

  if (!token) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,255,0.1) 0%, transparent 60%), #0a0e1a' }}>
      <div className="card" style={{ width:'100%', maxWidth:'400px', padding:'40px' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <h1 style={{ fontSize:'24px', fontWeight:800 }}><span style={{ color:'#00d4ff' }}>QFX</span> Admin</h1>
          <p style={{ color:'#6b7280', marginTop:'4px', fontSize:'13px' }}>Restricted — authorized personnel only</p>
        </div>
        {loginError && <div style={{ background:'rgba(255,71,87,0.1)', border:'1px solid rgba(255,71,87,0.3)', borderRadius:'8px', padding:'10px 14px', marginBottom:'16px', color:'#ff4757', fontSize:'13px' }}>{loginError}</div>}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div>
            <label style={{ display:'block', fontSize:'12px', color:'#6b7280', marginBottom:'6px' }}>Email</label>
            <input style={{ width:'100%' }} type="email" placeholder="admin@qfx-finance.com" value={loginForm.email} onChange={e => setLoginForm(f=>({...f,email:e.target.value}))} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'12px', color:'#6b7280', marginBottom:'6px' }}>Password</label>
            <input style={{ width:'100%' }} type="password" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm(f=>({...f,password:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&login()} />
          </div>
          <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:'8px' }} onClick={login} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );

  const NAV = [
    { id:'dashboard' as Tab, label:'Dashboard', icon:'⬡' },
    { id:'users' as Tab, label:'Users', icon:'◉' },
    { id:'transactions' as Tab, label:'Transactions', icon:'⇄' },
    { id:'kyc' as Tab, label:'KYC Queue', icon:'◈' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <aside style={{ width:'220px', flexShrink:0, background:'#0f1629', borderRight:'1px solid rgba(255,255,255,0.05)', padding:'24px 0', position:'fixed', top:0, left:0, height:'100vh', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'0 20px', marginBottom:'32px' }}>
          <h2 style={{ fontSize:'18px', fontWeight:800 }}><span style={{ color:'#00d4ff' }}>QFX</span> Admin</h2>
          <p style={{ fontSize:'10px', color:'#6b7280', letterSpacing:'2px', textTransform:'uppercase', marginTop:'2px' }}>Control Panel</p>
        </div>
        <nav style={{ flex:1, padding:'0 10px', display:'flex', flexDirection:'column', gap:'2px' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'9px', border:'none', background:tab===n.id?'rgba(0,212,255,0.1)':'transparent', color:tab===n.id?'#00d4ff':'#6b7280', fontWeight:tab===n.id?600:400, fontSize:'13px', cursor:'pointer', textAlign:'left', width:'100%' }}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', fontSize:'12px' }} onClick={()=>{localStorage.removeItem('qfx-admin-token');setToken('');}}>Sign Out</button>
        </div>
      </aside>

      <main style={{ marginLeft:'220px', flex:1, padding:'32px', minHeight:'100vh' }}>
        {feedback && <div style={{ position:'fixed', top:'20px', right:'20px', background:'rgba(0,208,132,0.15)', border:'1px solid rgba(0,208,132,0.3)', borderRadius:'8px', padding:'10px 16px', color:'#00d084', fontSize:'13px', zIndex:100 }}>✅ {feedback}</div>}

        {tab==='dashboard' && (
          <div>
            <h1 style={{ fontSize:'22px', fontWeight:700, marginBottom:'6px' }}>Dashboard</h1>
            <p style={{ color:'#6b7280', marginBottom:'28px', fontSize:'13px' }}>Platform overview</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'16px', marginBottom:'28px' }}>
              {[
                {label:'Total Users',value:stats?.totalUsers??'—',color:'#00d4ff'},
                {label:'Active Investments',value:stats?.activeInvestments??'—',color:'#7b61ff'},
                {label:'Pending KYC',value:stats?.pendingKyc??'—',color:'#ffa502'},
                {label:'Total Volume',value:stats?.totalVolume?`$${Number(stats.totalVolume).toLocaleString()}`:'—',color:'#00d084'},
                {label:'AUM',value:stats?.aum?`$${Number(stats.aum).toLocaleString()}`:'—',color:'#f4c430'},
              ].map(s=>(
                <div key={s.label} className="card" style={{ position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:s.color }} />
                  <div style={{ fontSize:'11px', color:'#6b7280', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'10px' }}>{s.label}</div>
                  <div style={{ fontSize:'24px', fontWeight:700, color:s.color, fontFamily:'monospace' }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ fontWeight:600, marginBottom:'14px' }}>Quick Actions</h3>
              <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                <button className="btn btn-ghost" onClick={()=>setTab('users')}>👥 Manage Users</button>
                <button className="btn btn-ghost" onClick={()=>setTab('kyc')}>📋 Review KYC</button>
                <button className="btn btn-ghost" onClick={()=>setTab('transactions')}>💳 Transactions</button>
              </div>
            </div>
          </div>
        )}

        {tab==='users' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
              <div>
                <h1 style={{ fontSize:'22px', fontWeight:700, marginBottom:'4px' }}>Users</h1>
                <p style={{ color:'#6b7280', fontSize:'13px' }}>{users.length} users</p>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:'200px' }} />
                <button className="btn btn-primary" onClick={fetchUsers}>Search</button>
              </div>
            </div>
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table>
                  <thead><tr><th>User</th><th>Role</th><th>KYC</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {users.map((u:any)=>(
                      <tr key={u.id}>
                        <td><div style={{ fontWeight:600 }}>{u.firstName} {u.lastName}</div><div style={{ color:'#6b7280', fontSize:'12px' }}>{u.email}</div></td>
                        <td><span className="badge badge-info">{u.role}</span></td>
                        <td><span className={`badge ${u.kycStatus==='APPROVED'?'badge-success':u.kycStatus==='REJECTED'?'badge-danger':'badge-warning'}`}>{u.kycStatus}</span></td>
                        <td style={{ fontFamily:'monospace' }}>${Number(u.balance).toFixed(2)}</td>
                        <td><span className={`badge ${u.isActive?'badge-success':'badge-danger'}`}>{u.isActive?'Active':'Suspended'}</span></td>
                        <td>
                          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                            {u.kycStatus==='PENDING'&&<><button className="btn btn-primary" style={{ padding:'4px 8px', fontSize:'11px' }} onClick={()=>updateKyc(u.id,'APPROVED')}>✓ KYC</button><button className="btn btn-danger" style={{ padding:'4px 8px', fontSize:'11px' }} onClick={()=>updateKyc(u.id,'REJECTED')}>✕</button></>}
                            <button className={`btn ${u.isActive?'btn-danger':'btn-ghost'}`} style={{ padding:'4px 8px', fontSize:'11px' }} onClick={()=>toggleUser(u.id,!u.isActive)}>{u.isActive?'Suspend':'Activate'}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length===0&&<div style={{ textAlign:'center', padding:'40px', color:'#6b7280' }}>No users found</div>}
              </div>
            </div>
          </div>
        )}

        {tab==='transactions' && (
          <div>
            <h1 style={{ fontSize:'22px', fontWeight:700, marginBottom:'4px' }}>Transactions</h1>
            <p style={{ color:'#6b7280', marginBottom:'24px', fontSize:'13px' }}>All platform transactions</p>
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table>
                  <thead><tr><th>User</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {transactions.map((tx:any)=>(
                      <tr key={tx.id}>
                        <td style={{ color:'#a0aec0', fontSize:'12px' }}>{tx.user?.email}</td>
                        <td><span className="badge badge-info">{tx.type.replace('_',' ')}</span></td>
                        <td style={{ fontFamily:'monospace', fontWeight:600 }}>${Number(tx.amount).toFixed(2)}</td>
                        <td><span className={`badge ${tx.status==='COMPLETED'?'badge-success':tx.status==='PENDING'?'badge-pending':'badge-danger'}`}>{tx.status}</span></td>
                        <td style={{ color:'#6b7280' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td>{tx.status==='PENDING'&&<button className="btn btn-primary" style={{ padding:'4px 10px', fontSize:'11px' }} onClick={()=>approveTransaction(tx.id)}>Approve</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length===0&&<div style={{ textAlign:'center', padding:'40px', color:'#6b7280' }}>No transactions</div>}
              </div>
            </div>
          </div>
        )}

        {tab==='kyc' && (
          <div>
            <h1 style={{ fontSize:'22px', fontWeight:700, marginBottom:'4px' }}>KYC Queue</h1>
            <p style={{ color:'#6b7280', marginBottom:'24px', fontSize:'13px' }}>{kycDocs.length} pending documents</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {kycDocs.length===0&&<div className="card" style={{ textAlign:'center', padding:'40px', color:'#6b7280' }}>✅ No pending KYC documents</div>}
              {kycDocs.map((doc:any)=>(
                <div key={doc.id} className="card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
                  <div>
                    <div style={{ fontWeight:600 }}>{doc.user?.firstName} {doc.user?.lastName}</div>
                    <div style={{ color:'#6b7280', fontSize:'12px' }}>{doc.user?.email}</div>
                    <div style={{ marginTop:'6px' }}><span className="badge badge-info">{doc.type}</span></div>
                  </div>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <button className="btn btn-primary" onClick={()=>updateKyc(doc.userId,'APPROVED')}>✓ Approve</button>
                    <button className="btn btn-danger" onClick={()=>updateKyc(doc.userId,'REJECTED')}>✕ Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
