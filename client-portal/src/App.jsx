import { useState, useEffect } from 'react';
import { auth, orders, assets, jobs, payments } from './api';

const styles = {
  container: { maxWidth: 960, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'Inter, system-ui, sans-serif' },
  card: { background: '#1a1a1a', border: '1px solid #27272a', borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' },
  btn: { padding: '0.6rem 1.2rem', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  btnPrimary: { background: '#0099ff', color: '#fff' },
  btnSecondary: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid #27272a' },
  input: { padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #27272a', background: '#111', color: '#fff', width: '100%', marginBottom: '0.75rem', fontSize: '0.9rem' },
  label: { display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: '#a6a6a6' },
  heading: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' },
  subheading: { fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem', color: '#fff' },
  muted: { color: '#767d88', fontSize: '0.9rem' },
  badge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #27272a', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' },
};

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.me().then(r => setUser(r.data)).catch(() => { localStorage.removeItem('token'); }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);
  const login = async (email, password) => {
    const res = await auth.login(email, password);
    localStorage.setItem('token', res.data.access_token);
    const me = await auth.me();
    setUser(me.data);
    return me.data;
  };
  const register = async (email, name, password) => {
    const res = await auth.register(email, name, password);
    localStorage.setItem('token', res.data.access_token);
    const me = await auth.me();
    setUser(me.data);
    return me.data;
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return { user, loading, login, register, logout };
}

function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isLogin) await onAuth.login(email, password);
      else await onAuth.register(email, name, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ ...styles.container, maxWidth: 400, marginTop: '4rem' }}>
      <div style={styles.card}>
        <h1 style={{ ...styles.heading, textAlign: 'center' }}>Appy-UX Studio</h1>
        <p style={{ ...styles.muted, textAlign: 'center', marginBottom: '1.5rem' }}>
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </p>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (<><label style={styles.label}>Name</label><input style={styles.input} value={name} onChange={e => setName(e.target.value)} required /></>)}
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <p style={{ ...styles.muted, textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={{ color: '#0099ff', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}

const SERVICES = [
  { id: 'restore', name: 'Image Restoration', price: 2900, desc: 'Repair damage, revive faded photos' },
  { id: 'colorize', name: 'Photo Colorizing', price: 2500, desc: 'Add natural color to B&W photos' },
  { id: 'enhance', name: 'Overall Enhancement', price: 2000, desc: 'Improve clarity, lighting, detail' },
  { id: 'upscale', name: 'Image Upscaling', price: 1500, desc: 'Increase resolution for crisp detail' },
  { id: 'animate', name: 'Image Animation', price: 3900, desc: 'Turn still photos into moving clips' },
  { id: 'bundle', name: 'Memory Revival Bundle', price: 7900, desc: 'Full restore + colorize + enhance + upscale' },
  { id: 'short_video', name: 'Short-form Video', price: 14900, desc: '30-60s vertical social spots' },
  { id: 'long_video', name: 'Long-form Video', price: 19900, desc: 'Horizontal edits, 1080p/2K/4K' },
  { id: 'music', name: 'Music & Sound', price: 9900, desc: 'Jingles, themes, SFX packs' },
  { id: 'game_assets', name: 'Game Assets', price: 7900, desc: '3D models, textures, audio packs' },
];

const TIERS = [
  { id: 'basic', name: 'Basic', mult: 1 },
  { id: 'standard', name: 'Standard (3-pack)', mult: 2.5 },
  { id: 'premium', name: 'Premium (bundle)', mult: 4 },
];

function NewOrder({ onBack, onCreated }) {
  const [selectedService, setSelectedService] = useState(null);
  const [tier, setTier] = useState('basic');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) { setError('Please select a service'); return; }
    setLoading(true);
    setError('');
    try {
      const svc = SERVICES.find(s => s.id === selectedService);
      const price = Math.round(svc.price * TIERS.find(t => t.id === tier).mult);
      const res = await orders.create({ service_type: selectedService, package_tier: tier, price_cents: price, notes });
      const newOrderId = res.data.id;
      setOrderId(newOrderId);
      for (const file of files) { await assets.upload(newOrderId, file); }
      onCreated();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create order');
    } finally { setLoading(false); }
  };

  if (orderId) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.subheading}>Order #{orderId} Created!</h2>
          <p style={styles.muted}>Your order has been submitted. Proceed to payment to start processing.</p>
          <button style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '1rem' }} onClick={async () => {
            try {
              const res = await payments.createPayPal(orderId);
              if (res.data.approval_url) window.location.href = res.data.approval_url;
            } catch (e) { alert('Payment setup failed'); }
          }}>Pay with PayPal</button>
          <button style={{ ...styles.btn, ...styles.btnSecondary, marginTop: '1rem', marginLeft: '0.5rem' }} onClick={onBack}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button style={{ ...styles.btn, ...styles.btnSecondary, marginBottom: '1rem' }} onClick={onBack}>← Back</button>
      <h1 style={styles.heading}>New Order</h1>
      {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <h2 style={styles.subheading}>Select Service</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {SERVICES.map(svc => (
            <div key={svc.id} onClick={() => setSelectedService(svc.id)}
              style={{ ...styles.card, cursor: 'pointer', border: selectedService === svc.id ? '2px solid #0099ff' : '1px solid #27272a', marginBottom: 0 }}>
              <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{svc.name}</div>
              <div style={styles.muted}>{svc.desc}</div>
              <div style={{ color: '#0099ff', fontWeight: 600, marginTop: '0.5rem' }}>${(svc.price / 100).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <h2 style={styles.subheading}>Package Tier</h2>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {TIERS.map(t => (
            <button key={t.id} type="button" onClick={() => setTier(t.id)}
              style={{ ...styles.btn, ...(tier === t.id ? styles.btnPrimary : styles.btnSecondary) }}>
              {t.name}
            </button>
          ))}
        </div>
        <h2 style={styles.subheading}>Upload Files</h2>
        <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files))} style={{ marginBottom: '1rem', color: '#fff' }} />
        {files.length > 0 && <p style={styles.muted}>{files.length} file(s) selected</p>}
        <h2 style={styles.subheading}>Notes</h2>
        <textarea style={{ ...styles.input, minHeight: 80 }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions..." />
        <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '1rem' }} disabled={loading || !selectedService}>
          {loading ? 'Creating order...' : 'Create Order & Upload'}
        </button>
      </form>
    </div>
  );
}

function OrderDetail({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [assetsList, setAssetsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orders.get(orderId), assets.list(orderId), jobs.list(orderId)])
      .then(([o, a, j]) => { setOrder(o.data); setAssetsList(a.data); setJobsList(j.data); })
      .finally(() => setLoading(false));
  }, [orderId]);

  const refreshJobs = () => jobs.list(orderId).then(r => setJobsList(r.data));

  if (loading) return <div style={styles.container}><p style={styles.muted}>Loading...</p></div>;

  const statusColor = (s) => {
    const colors = { pending: '#ffcc66', paid: '#54e3a1', processing: '#35d0ff', review: '#7c5cff', delivered: '#54e3a1', cancelled: '#ff6b6b' };
    return colors[s] || '#a6a6a6';
  };

  return (
    <div style={styles.container}>
      <button style={{ ...styles.btn, ...styles.btnSecondary, marginBottom: '1rem' }} onClick={onBack}>← Back</button>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={styles.heading}>Order #{order.id}</h1>
          <span style={{ ...styles.badge, background: statusColor(order.status) + '22', color: statusColor(order.status) }}>{order.status}</span>
        </div>
        <p style={styles.muted}>{order.service_type.replace('_', ' ')} · {order.package_tier} · ${(order.price_cents / 100).toFixed(2)}</p>
        <p style={styles.muted}>Created: {order.created_at?.split('T')[0]}</p>
        {order.notes && <p style={{ color: '#fff', marginTop: '0.5rem' }}>Notes: {order.notes}</p>}
      </div>
      <div style={styles.card}>
        <h2 style={styles.subheading}>Files</h2>
        {assetsList.length === 0 ? <p style={styles.muted}>No files uploaded</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {assetsList.map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #27272a' }}>
                <span style={{ color: '#fff' }}>{a.filename} <span style={styles.muted}>({a.file_type}, {(a.size / 1024).toFixed(0)}KB, {a.role})</span></span>
                <a href={assets.downloadUrl(a.id)} style={{ ...styles.btn, ...styles.btnSecondary, padding: '0.3rem 0.6rem', textDecoration: 'none', fontSize: '0.8rem' }} download>Download</a>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={styles.subheading}>Processing Progress</h2>
          <button style={{ ...styles.btn, ...styles.btnSecondary, padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={refreshJobs}>Refresh</button>
        </div>
        {jobsList.length === 0 ? <p style={styles.muted}>No processing jobs yet</p> : (
          jobsList.map(j => (
            <div key={j.id} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#fff' }}>{j.workflow_name}</span>
                <span style={styles.muted}>{j.status} — {j.progress_pct}%</span>
              </div>
              <div style={{ background: '#111', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ background: '#0099ff', height: '100%', width: `${j.progress_pct}%`, transition: 'width 0.3s' }} />
              </div>
              {j.error_message && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem' }}>{j.error_message}</p>}
            </div>
          ))
        )}
      </div>
      {order.status === 'pending' && (
        <div style={styles.card}>
          <h2 style={styles.subheading}>Payment</h2>
          <p style={styles.muted}>Complete payment to start processing your order.</p>
          <button style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '0.75rem' }} onClick={async () => {
            try {
              const res = await payments.createPayPal(order.id);
              if (res.data.approval_url) window.location.href = res.data.approval_url;
            } catch (e) { alert('Payment setup failed: ' + (e.response?.data?.detail || e.message)); }
          }}>Pay with PayPal</button>
        </div>
      )}
    </div>
  );
}

function Dashboard({ user, onLogout, onNewOrder, onViewOrder }) {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orders.list().then(r => setOrderList(r.data)).finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => {
    const colors = { pending: '#ffcc66', paid: '#54e3a1', processing: '#35d0ff', review: '#7c5cff', delivered: '#54e3a1', cancelled: '#ff6b6b' };
    return colors[s] || '#a6a6a6';
  };

  return (
    <div>
      <nav style={styles.nav}>
        <span style={{ color: '#fff', fontWeight: 600 }}>Appy-UX Studio</span>
        <div>
          <span style={{ color: '#a6a6a6', marginRight: '1rem', fontSize: '0.9rem' }}>{user.name}</span>
          <button style={{ ...styles.btn, ...styles.btnSecondary, padding: '0.4rem 0.8rem' }} onClick={onLogout}>Sign Out</button>
        </div>
      </nav>
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={styles.heading}>My Orders</h1>
          <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={onNewOrder}>+ New Order</button>
        </div>
        {loading ? <p style={styles.muted}>Loading...</p> : orderList.length === 0 ? (
          <div style={styles.card}>
            <p style={styles.muted}>No orders yet. Start your first project!</p>
          </div>
        ) : (
          orderList.map(o => (
            <div key={o.id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>Order #{o.id} — {o.service_type.replace('_', ' ')}</span>
                <span style={{ ...styles.badge, background: statusColor(o.status) + '22', color: statusColor(o.status) }}>{o.status}</span>
              </div>
              <p style={styles.muted}>{o.package_tier} · ${(o.price_cents / 100).toFixed(2)} · {o.created_at?.split('T')[0]}</p>
              <div style={{ marginTop: '0.75rem' }}>
                <button style={{ ...styles.btn, ...styles.btnSecondary, padding: '0.4rem 0.8rem' }} onClick={() => onViewOrder(o.id)}>View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function App() {
  const authState = useAuth();
  const [page, setPage] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (authState.loading) return <div style={{ ...styles.container, textAlign: 'center', marginTop: '4rem' }}><p style={styles.muted}>Loading...</p></div>;
  if (!authState.user) return <AuthPage onAuth={authState} />;

  if (page === 'detail' && selectedOrder) {
    return <OrderDetail orderId={selectedOrder} onBack={() => { setPage('dashboard'); setSelectedOrder(null); }} />;
  }

  if (page === 'new') {
    return <NewOrder onBack={() => setPage('dashboard')} onCreated={() => setPage('dashboard')} />;
  }

  return <Dashboard user={authState.user} onLogout={authState.logout} onNewOrder={() => setPage('new')} onViewOrder={(id) => { setSelectedOrder(id); setPage('detail'); }} />;
}
