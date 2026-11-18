import { useState, useEffect } from 'react';
import { auth, admin, orders, jobs } from './api';

const styles = {
  container: { maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'Inter, system-ui, sans-serif' },
  card: { background: '#1a1a1a', border: '1px solid #27272a', borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' },
  btn: { padding: '0.6rem 1.2rem', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  btnPrimary: { background: '#0099ff', color: '#fff' },
  btnSecondary: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid #27272a' },
  btnDanger: { background: '#ff6b6b', color: '#fff' },
  input: { padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #27272a', background: '#111', color: '#fff', width: '100%', marginBottom: '0.75rem', fontSize: '0.9rem' },
  label: { display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: '#a6a6a6' },
  heading: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' },
  subheading: { fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem', color: '#fff' },
  muted: { color: '#767d88', fontSize: '0.9rem' },
  badge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #27272a', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #27272a', color: '#a6a6a6', fontSize: '0.85rem', fontWeight: 600 },
  td: { padding: '0.75rem', borderBottom: '1px solid #1a1a1a', color: '#fff', fontSize: '0.9rem' },
  statCard: { background: '#1a1a1a', border: '1px solid #27272a', borderRadius: 12, padding: '1.25rem', textAlign: 'center' },
  statValue: { fontSize: '2rem', fontWeight: 700, color: '#fff' },
  statLabel: { fontSize: '0.8rem', color: '#767d88', marginTop: '0.25rem' },
};

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.me().then(r => { if (r.data.role === 'admin') setUser(r.data); else { localStorage.removeItem('token'); } }).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);
  const login = async (email, password) => {
    const res = await auth.login(email, password);
    localStorage.setItem('token', res.data.access_token);
    const me = await auth.me();
    if (me.data.role !== 'admin') throw new Error('Admin access required');
    setUser(me.data);
    return me.data;
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return { user, loading, login, logout };
}

function AuthPage({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await onAuth.login(email, password); }
    catch (err) { setError(err.response?.data?.detail || err.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ ...styles.container, maxWidth: 400, marginTop: '4rem' }}>
      <div style={styles.card}>
        <h1 style={{ ...styles.heading, textAlign: 'center' }}>Admin Dashboard</h1>
        <p style={{ ...styles.muted, textAlign: 'center', marginBottom: '1.5rem' }}>Appy-UX Studio Administration</p>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard Overview ──
function DashboardOverview({ stats, comfyuiStatus, onRefresh }) {
  const statusColor = (s) => {
    const colors = { pending: '#ffcc66', paid: '#54e3a1', processing: '#35d0ff', review: '#7c5cff', delivered: '#54e3a1', cancelled: '#ff6b6b' };
    return colors[s] || '#a6a6a6';
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats?.total_orders || 0}</div>
          <div style={styles.statLabel}>Total Orders</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats?.total_users || 0}</div>
          <div style={styles.statLabel}>Total Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>${((stats?.total_revenue_cents || 0) / 100).toFixed(2)}</div>
          <div style={styles.statLabel}>Total Revenue</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: comfyuiStatus?.status === 'online' ? '#54e3a1' : '#ff6b6b' }}>
            {comfyuiStatus?.status === 'online' ? 'Online' : 'Offline'}
          </div>
          <div style={styles.statLabel}>ComfyUI</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={styles.card}>
          <h3 style={styles.subheading}>Orders by Status</h3>
          {stats?.orders_by_status && Object.entries(stats.orders_by_status).map(([status, count]) => (
            <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #1a1a1a' }}>
              <span style={{ color: statusColor(status) }}>{status}</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{count}</span>
            </div>
          ))}
        </div>
        <div style={styles.card}>
          <h3 style={styles.subheading}>Orders by Service</h3>
          {stats?.orders_by_service && Object.entries(stats.orders_by_service).filter(([, c]) => c > 0).map(([svc, count]) => (
            <div key={svc} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #1a1a1a' }}>
              <span style={{ color: '#a6a6a6' }}>{svc.replace('_', ' ')}</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{count}</span>
            </div>
          ))}
          {(!stats?.orders_by_service || Object.values(stats.orders_by_service).every(c => c === 0)) && (
            <p style={styles.muted}>No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Orders Table ──
function OrdersTable({ orders, onAction }) {
  const statusColor = (s) => {
    const colors = { pending: '#ffcc66', paid: '#54e3a1', processing: '#35d0ff', review: '#7c5cff', delivered: '#54e3a1', cancelled: '#ff6b6b' };
    return colors[s] || '#a6a6a6';
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.subheading}>All Orders</h3>
      {orders.length === 0 ? <p style={styles.muted}>No orders</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Service</th>
                <th style={styles.th}>Tier</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={styles.td}>#{o.id}</td>
                  <td style={styles.td}>{o.user_email}</td>
                  <td style={styles.td}>{o.service_type.replace('_', ' ')}</td>
                  <td style={styles.td}>{o.package_tier}</td>
                  <td style={styles.td}>${(o.price_cents / 100).toFixed(2)}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: statusColor(o.status) + '22', color: statusColor(o.status) }}>{o.status}</span>
                  </td>
                  <td style={styles.td}>{o.created_at?.split('T')[0]}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {o.status === 'paid' && (
                        <button style={{ ...styles.btn, ...styles.btnSecondary, padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => onAction('approve-inputs', o.id)}>Approve Inputs</button>
                      )}
                      {o.status === 'paid' && o.inputs_approved && (
                        <button style={{ ...styles.btn, ...styles.btnPrimary, padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => onAction('approve', o.id)}>Start Processing</button>
                      )}
                      {o.status === 'review' && (
                        <button style={{ ...styles.btn, ...styles.btnPrimary, padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => onAction('deliver', o.id)}>Deliver</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Jobs Table ──
function JobsTable({ jobs }) {
  const statusColor = (s) => {
    const colors = { queued: '#ffcc66', running: '#35d0ff', completed: '#54e3a1', failed: '#ff6b6b' };
    return colors[s] || '#a6a6a6';
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.subheading}>Processing Jobs</h3>
      {jobs.length === 0 ? <p style={styles.muted}>No jobs</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Order</th>
                <th style={styles.th}>Workflow</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Progress</th>
                <th style={styles.th}>Error</th>
                <th style={styles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td style={styles.td}>#{j.id}</td>
                  <td style={styles.td}>#{j.order_id}</td>
                  <td style={styles.td}>{j.workflow}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: statusColor(j.status) + '22', color: statusColor(j.status) }}>{j.status}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ background: '#111', borderRadius: 4, height: 6, width: 80, overflow: 'hidden' }}>
                      <div style={{ background: '#0099ff', height: '100%', width: `${j.progress}%` }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#767d88' }}>{j.progress}%</span>
                  </td>
                  <td style={styles.td}>{j.error ? <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{j.error.substring(0, 40)}</span> : '-'}</td>
                  <td style={styles.td}>{j.created_at?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Users Table ──
function UsersTable({ users }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.subheading}>Users</h3>
      {users.length === 0 ? <p style={styles.muted}>No users</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Orders</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={styles.td}>#{u.id}</td>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: u.role === 'admin' ? '#0099ff22' : '#ffffff11', color: u.role === 'admin' ? '#0099ff' : '#a6a6a6' }}>{u.role}</span>
                  </td>
                  <td style={styles.td}>{u.order_count}</td>
                  <td style={styles.td}>{u.created_at?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Shop Tab ──
function ShopTab() {
  const [products, setProducts] = useState([]);
  const [shopStats, setShopStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([admin.products(), admin.shopStats()]).then(([p, s]) => {
      setProducts(p.data);
      setShopStats(s.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.muted}>Loading shop data...</p>;

  return (
    <div>
      {shopStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{shopStats.total_products}</div>
            <div style={styles.statLabel}>Products</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{shopStats.total_purchases}</div>
            <div style={styles.statLabel}>Purchases</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>${(shopStats.total_revenue_cents / 100).toFixed(2)}</div>
            <div style={styles.statLabel}>Revenue</div>
          </div>
        </div>
      )}
      <div style={styles.card}>
        <h3 style={styles.subheading}>Products</h3>
        {products.length === 0 ? <p style={styles.muted}>No products</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Downloads</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={styles.td}>#{p.id}</td>
                    <td style={styles.td}>{p.title}</td>
                    <td style={styles.td}>{p.category}</td>
                    <td style={styles.td}>${(p.price_cents / 100).toFixed(2)}</td>
                    <td style={styles.td}>{p.download_count}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: p.is_active ? '#54e3a122' : '#ff6b6b22', color: p.is_active ? '#54e3a1' : '#ff6b6b' }}>{p.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Channels Tab ──
function ChannelsTab() {
  const [channels, setChannels] = useState([]);
  const [channelStats, setChannelStats] = useState([]);
  const [platformOrders, setPlatformOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([admin.channels(), admin.channelStats(), admin.platformOrders()]).then(([c, s, p]) => {
      setChannels(c.data);
      setChannelStats(s.data);
      setPlatformOrders(p.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.muted}>Loading channel data...</p>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {channelStats.map(s => (
          <div key={s.channel_name} style={styles.statCard}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{s.display_name}</div>
            <div style={styles.statValue}>{s.total_orders}</div>
            <div style={styles.statLabel}>Orders • ${(s.total_revenue_cents / 100).toFixed(2)} revenue</div>
          </div>
        ))}
      </div>
      <div style={styles.card}>
        <h3 style={styles.subheading}>Platform Orders</h3>
        {platformOrders.length === 0 ? <p style={styles.muted}>No platform orders yet</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Channel</th>
                  <th style={styles.th}>Platform Order</th>
                  <th style={styles.th}>Buyer</th>
                  <th style={styles.th}>Sync Status</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {platformOrders.map(po => (
                  <tr key={po.id}>
                    <td style={styles.td}>#{po.id}</td>
                    <td style={styles.td}>{po.channel_name}</td>
                    <td style={styles.td}>{po.platform_order_id}</td>
                    <td style={styles.td}>{po.platform_buyer_name || '-'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: po.sync_status === 'synced' ? '#54e3a122' : '#ffcc6622', color: po.sync_status === 'synced' ? '#54e3a1' : '#ffcc66' }}>{po.sync_status}</span>
                    </td>
                    <td style={styles.td}>{po.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const authState = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [comfyuiStatus, setComfyuiStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterService, setFilterService] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [o, u, j, s, c] = await Promise.all([
        admin.orders(filterStatus || undefined, filterService || undefined),
        admin.users(),
        admin.jobs(),
        admin.stats(),
        admin.comfyuiStatus(),
      ]);
      setOrders(o.data);
      setUsers(u.data);
      setJobs(j.data);
      setStats(s.data);
      setComfyuiStatus(c.data);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (authState.user) loadData(); }, [authState.user, filterStatus, filterService]);

  const handleAction = async (action, orderId) => {
    try {
      if (action === 'approve-inputs') await admin.approveInputs(orderId);
      else if (action === 'approve') await admin.approve(orderId);
      else if (action === 'deliver') await admin.deliver(orderId);
      await loadData();
    } catch (e) {
      alert('Action failed: ' + (e.response?.data?.detail || e.message));
    }
  };

  if (authState.loading) return <div style={{ ...styles.container, textAlign: 'center', marginTop: '4rem' }}><p style={styles.muted}>Loading...</p></div>;
  if (!authState.user) return <AuthPage onAuth={authState} />;

  return (
    <div>
      <nav style={styles.nav}>
        <span style={{ color: '#fff', fontWeight: 600 }}>Appy-UX Admin</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {['dashboard', 'orders', 'jobs', 'users', 'shop', 'channels'].map(t => (
            <span key={t} onClick={() => setTab(t)} style={{ color: tab === t ? '#fff' : '#a6a6a6', cursor: 'pointer', fontSize: '0.9rem', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize' }}>
              {t}
            </span>
          ))}
          <button style={{ ...styles.btn, ...styles.btnSecondary, padding: '0.4rem 0.8rem' }} onClick={authState.logout}>Sign Out</button>
        </div>
      </nav>
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={styles.heading}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h1>
          <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={loadData}>Refresh</button>
        </div>

        {loading ? <p style={styles.muted}>Loading...</p> : (
          <>
            {tab === 'dashboard' && <DashboardOverview stats={stats} comfyuiStatus={comfyuiStatus} onRefresh={loadData} />}
            {tab === 'orders' && (
              <>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <select style={styles.input} value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto', marginBottom: 0 }}>
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="review">Review</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select style={styles.input} value={filterService} onChange={e => setFilterService(e.target.value)} style={{ width: 'auto', marginBottom: 0 }}>
                    <option value="">All services</option>
                    <option value="restore">Restore</option>
                    <option value="colorize">Colorize</option>
                    <option value="enhance">Enhance</option>
                    <option value="upscale">Upscale</option>
                    <option value="animate">Animate</option>
                    <option value="bundle">Bundle</option>
                    <option value="short_video">Short Video</option>
                    <option value="long_video">Long Video</option>
                    <option value="video_upscale">Video Upscale</option>
                    <option value="video_style_transfer">Style Transfer</option>
                    <option value="music">Music</option>
                    <option value="game_assets">Game Assets</option>
                  </select>
                </div>
                <OrdersTable orders={orders} onAction={handleAction} />
              </>
            )}
            {tab === 'jobs' && <JobsTable jobs={jobs} />}
            {tab === 'users' && <UsersTable users={users} />}
            {tab === 'shop' && <ShopTab />}
            {tab === 'channels' && <ChannelsTab />}
          </>
        )}
      </div>
    </div>
  );
}
