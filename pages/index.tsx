import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import TalentCard from '@/components/TalentCard';
import SkillInput from '@/components/SkillInput';
import ToastContainer, { showToast } from '@/components/Toast';
import { Talent, Project } from '@/types';

// ─── CATEGORIES ───────────────────────────────────────────────
const CATEGORIES = ['Web Developer','Mobile Developer','UI/UX Designer','Digital Marketing','UMKM / Wirausaha','Data / AI','Lainnya'];
const PROJECT_TYPES = ['IT','UMKM','Training'] as const;
const TYPE_META = {
  IT:       { label: '💻 Project IT',       color: '#5eead4' },
  UMKM:     { label: '🛍️ Kebutuhan UMKM', color: 'var(--gold)' },
  Training: { label: '📚 Pelatihan',        color: '#a78bfa' },
};

// ─── STAT CARD ─────────────────────────────────────────────────
function StatCard({ num, label }: { num: number; label: string }) {
  return (
    <div className="card" style={{ padding: '22px 20px', textAlign: 'center', transition: 'border-color .2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--emerald)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--emerald)', lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
    </div>
  );
}

// ─── BAR CHART ──────────────────────────────────────────────────
function BarChart({ data, max }: { data: [string, number][]; max: number }) {
  return (
    <div style={{ marginTop: 8 }}>
      {data.map(([label, count]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', width: 88, flexShrink: 0, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
          <div style={{ flex: 1, height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--emerald)', borderRadius: 3, width: `${Math.round(count / max * 100)}%`, transition: 'width .8s ease' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', width: 20, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{count}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MODAL ──────────────────────────────────────────────────────
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        animation: 'fadeIn .2s ease',
      }}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16,
        padding: '32px 28px', width: '100%', maxWidth: 520, position: 'relative',
        animation: 'fadeUp .25s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
            width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, transition: 'all .15s',
          }}
        >✕</button>
        {children}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userStatus = (session?.user as any)?.status;
  const userEmail = session?.user?.email;
  const userTalentId = (session?.user as any)?.talentId;

  const [tab, setTab] = useState('home');
  const [talents, setTalents] = useState<Talent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Talent filter state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCat, setFilterCat] = useState('');

  // Register form
  const [regForm, setRegForm] = useState({ name: session?.user?.name || '', wa: '', loc: '', cat: '', skills: [] as string[], bio: '', portfolio: '', status: 'open' });
  const [regLoading, setRegLoading] = useState(false);

  // Edit form
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Talent> & { skills: string[] }>({ skills: [] });

  // Post project modal
  const [postOpen, setPostOpen] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', type: 'IT', desc: '', budget: '', wa: '' });
  const [postLoading, setPostLoading] = useState(false);

  // Auth redirect
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin');
    if (status === 'authenticated' && userStatus === 'pending_quiz') router.replace('/quiz');
  }, [status, userStatus, router]);

  const fetchData = useCallback(async () => {
    if (userStatus !== 'active') return;
    setLoadingData(true);
    try {
      const [tr, pr] = await Promise.all([
        fetch('/api/talent').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
      ]);
      setTalents(tr.talents || []);
      setProjects(pr.projects || []);
    } catch { /* silent */ }
    setLoadingData(false);
  }, [userStatus]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Pre-fill name from session
  useEffect(() => {
    if (session?.user?.name && !regForm.name) {
      setRegForm(f => ({ ...f, name: session.user!.name! }));
    }
  }, [session]);

  // ── FILTERED TALENTS ──
  const filteredTalents = talents.filter(t => {
    const q = search.toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.skills.join(' ').toLowerCase().includes(q) || t.loc.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
    const matchS = !filterStatus || t.status === filterStatus;
    const matchC = !filterCat || t.cat === filterCat;
    return matchQ && matchS && matchC;
  });

  // ── ANALYTICS DATA ──
  const catCounts = Object.entries(
    talents.reduce((acc, t) => { acc[t.cat] = (acc[t.cat] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const skillCounts = Object.entries(
    talents.flatMap(t => t.skills).reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // ── SUBMIT TALENT ──
  async function submitTalent() {
    if (!regForm.name || !regForm.wa || !regForm.loc || !regForm.cat) {
      showToast('Isi semua field yang wajib (*)', 'error'); return;
    }
    setRegLoading(true);
    try {
      const r = await fetch('/api/talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });
      if (!r.ok) { const e = await r.json(); showToast(e.error, 'error'); return; }
      showToast('Profil kamu berhasil ditambahkan! 🎉');
      await fetchData();
      setTab('talent');
    } finally { setRegLoading(false); }
  }

  // ── EDIT TALENT ──
  function openEdit() {
    const myTalent = talents.find(t => t.id === userTalentId);
    if (!myTalent) return;
    setEditForm({ ...myTalent });
    setEditOpen(true);
  }

  async function submitEdit() {
    if (!userTalentId) return;
    try {
      const r = await fetch(`/api/talent/${userTalentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!r.ok) { showToast('Gagal update', 'error'); return; }
      showToast('Profil berhasil diupdate ✅');
      setEditOpen(false);
      await fetchData();
    } catch { showToast('Error', 'error'); }
  }

  // ── POST PROJECT ──
  async function submitProject() {
    if (!postForm.title) { showToast('Judul wajib diisi', 'error'); return; }
    setPostLoading(true);
    try {
      const r = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm),
      });
      if (!r.ok) { showToast('Gagal posting', 'error'); return; }
      showToast('Project berhasil diposting! 📌');
      setPostOpen(false);
      setPostForm({ title: '', type: 'IT', desc: '', budget: '', wa: '' });
      await fetchData();
    } finally { setPostLoading(false); }
  }

  // ── LOADING ──
  if (status === 'loading' || (status === 'authenticated' && userStatus !== 'active')) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Memuat...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────
  return (
    <>
      <Head><title>Jamaah Talent Hub — EPM DPW LDII Jatim</title></Head>
      <div className="grid-bg" />
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', top: -120, right: -120, background: 'rgba(16,185,122,0.05)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', bottom: 80, left: -120, background: 'rgba(212,168,67,0.04)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar activeTab={tab} onTabChange={setTab} />

        {/* ══════════════ HOME ══════════════ */}
        {tab === 'home' && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 48 }} className="animate-fadeUp">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'var(--gold-dim)', border: '1px solid rgba(212,168,67,0.3)', fontSize: 12, fontWeight: 500, color: 'var(--gold)', letterSpacing: '0.05em', marginBottom: 24 }}>
                ◆ Ekosistem Digital Jamaah LDII Jatim
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,6vw,58px)', lineHeight: 1.1, marginBottom: 18 }}>
                Satu Platform,<br /><span style={{ color: 'var(--emerald)' }}>Banyak Potensi</span>
              </h1>
              <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
                Menghubungkan talent IT, UMKM, dan perusahaan besar dalam satu ekosistem jamaah yang terstruktur dan amanah.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-lg" onClick={() => setTab('talent')}>Lihat Direktori Talent</button>
                <button className="btn btn-outline btn-lg" onClick={() => setTab('projects')}>Cari Project / Loker</button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14, marginBottom: 48 }}>
              <StatCard num={talents.length} label="Talent Terdaftar" />
              <StatCard num={talents.filter(t => t.status === 'open').length} label="Siap Kerja" />
              <StatCard num={projects.length} label="Project Tersedia" />
              <StatCard num={new Set(talents.flatMap(t => t.skills)).size} label="Jenis Skill" />
            </div>

            {/* How it works */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, textAlign: 'center', marginBottom: 24 }}>Cara Kerja Platform</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14 }}>
              {[
                { icon: '📋', title: '1. Daftarkan Skill', desc: 'Anggota jamaah mendaftarkan skill, pengalaman, dan portofolio mereka.' },
                { icon: '🔍', title: '2. Ditemukan', desc: 'Perusahaan atau UMKM mencari talent berdasarkan skill yang dibutuhkan.' },
                { icon: '🤝', title: '3. Kolaborasi', desc: 'Hubungi langsung via WhatsApp. Platform sebagai fasilitator.' },
                { icon: '💰', title: '4. Berkah Bersama', desc: 'Pengangguran dapat kerja, UMKM dapat klien, jamaah semakin kuat.' },
              ].map(item => (
                <div key={item.title} className="card" style={{ padding: '24px 22px' }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ TALENT ══════════════ */}
        {tab === 'talent' && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Direktori Talent</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Semua anggota jamaah yang siap berkolaborasi</p>
              </div>
              {!userTalentId && (
                <button className="btn btn-primary" onClick={() => setTab('register')}>+ Daftar sebagai Talent</button>
              )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <input className="form-input" style={{ flex: '1', minWidth: 200 }} placeholder="🔍  Cari nama, skill, atau lokasi..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="form-select" style={{ minWidth: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Semua Status</option>
                <option value="open">✅ Siap Kerja</option>
                <option value="busy">🟡 Sedang Project</option>
                <option value="employed">⚪ Employed</option>
              </select>
              <select className="form-select" style={{ minWidth: 170 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="">Semua Kategori</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {loadingData ? (
              <div style={{ textAlign: 'center', padding: '64px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div className="spinner" style={{ width: 32, height: 32 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Memuat data...</p>
              </div>
            ) : filteredTalents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">Tidak ada talent yang sesuai</div>
                <div className="empty-state-desc">Coba ubah filter atau jadilah yang pertama mendaftar!</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 14 }}>
                {filteredTalents.map((t, i) => (
                  <TalentCard
                    key={t.id} talent={t} delay={i * 0.04}
                    isOwner={t.id === userTalentId}
                    onEdit={openEdit}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ PROJECTS ══════════════ */}
        {tab === 'projects' && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Loker & Project</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Kesempatan kerja dan kolaborasi dari jamaah & mitra</p>
              </div>
              <button className="btn btn-primary" onClick={() => setPostOpen(true)}>+ Posting Project</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
              {PROJECT_TYPES.map(type => {
                const meta = TYPE_META[type];
                const items = projects.filter(p => p.type === type);
                return (
                  <div key={type}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {meta.label}
                      <span style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 99, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{items.length}</span>
                    </div>
                    {items.length === 0 ? (
                      <p style={{ fontSize: 13, color: 'var(--text-dim)', padding: '12px 0' }}>Belum ada postingan</p>
                    ) : items.map(p => (
                      <div key={p.id} className="card card-hover" style={{ padding: 20, marginBottom: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: meta.color, marginBottom: 8 }}>{meta.label}</div>
                        <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 8 }}>{p.title}</div>
                        {p.desc && <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.desc}</p>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-muted)' }}>
                          {p.budget && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--emerald)', background: 'var(--emerald-glow)', padding: '3px 10px', borderRadius: 6 }}>{p.budget}</span>}
                          <span>oleh {p.postedBy.split(' ')[0]}</span>
                          {p.wa && (
                            <a href={`https://wa.me/62${p.wa.replace(/^0/, '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald)', fontWeight: 600, textDecoration: 'none' }}>💬 WA</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════ REGISTER ══════════════ */}
        {tab === 'register' && (
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
            {userTalentId ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>Kamu Sudah Terdaftar</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Profil talent kamu sudah ada di direktori. Kamu bisa edit profil dari halaman Direktori.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => setTab('talent')}>Lihat Profil Saya</button>
                  <button className="btn btn-outline" onClick={openEdit}>✏️ Edit Profil</button>
                </div>
              </div>
            ) : (
              <div className="card animate-fadeUp" style={{ padding: '36px 32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 6 }}>Daftar sebagai Talent</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>Isi data lengkap agar mudah ditemukan oleh perusahaan atau UMKM yang membutuhkan.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap <span>*</span></label>
                    <input className="form-input" value={regForm.name} onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama kamu" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">No. WhatsApp <span>*</span></label>
                    <input className="form-input" value={regForm.wa} onChange={e => setRegForm(f => ({ ...f, wa: e.target.value }))} placeholder="08xxxxxxxxxx" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lokasi <span>*</span></label>
                    <input className="form-input" value={regForm.loc} onChange={e => setRegForm(f => ({ ...f, loc: e.target.value }))} placeholder="Nganjuk, Jawa Timur" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kategori Utama <span>*</span></label>
                    <select className="form-select" value={regForm.cat} onChange={e => setRegForm(f => ({ ...f, cat: e.target.value }))}>
                      <option value="">Pilih kategori...</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Keahlian / Skill</label>
                    <SkillInput value={regForm.skills} onChange={skills => setRegForm(f => ({ ...f, skills }))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Pengalaman & Bio Singkat</label>
                    <textarea className="form-textarea" value={regForm.bio} onChange={e => setRegForm(f => ({ ...f, bio: e.target.value }))} placeholder="Ceritakan pengalaman dan skill unggulan kamu..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Link Portofolio / GitHub</label>
                    <input className="form-input" value={regForm.portfolio} onChange={e => setRegForm(f => ({ ...f, portfolio: e.target.value }))} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Ketersediaan</label>
                    <select className="form-select" value={regForm.status} onChange={e => setRegForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="open">✅ Siap Kerja / Freelance</option>
                      <option value="busy">🟡 Sedang Project</option>
                      <option value="employed">⚪ Sudah Bekerja Penuh</option>
                    </select>
                  </div>
                </div>

                <hr className="divider" />
                <button className="btn btn-primary btn-lg btn-full" onClick={submitTalent} disabled={regLoading}>
                  {regLoading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Menyimpan...</> : '🚀 Daftarkan Saya ke Direktori'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ ANALYTICS ══════════════ */}
        {tab === 'analytics' && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Statistik Platform</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Gambaran talent pool komunitas jamaah</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { icon: '👥', value: talents.length, label: 'Total Talent' },
                { icon: '✅', value: talents.filter(t => t.status === 'open').length, label: 'Siap Kerja' },
                { icon: '🟡', value: talents.filter(t => t.status === 'busy').length, label: 'Sedang Project' },
                { icon: '💼', value: projects.length, label: 'Total Loker/Project' },
              ].map(item => (
                <div key={item.label} className="card" style={{ padding: '22px 20px' }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--emerald)' }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>Talent per Kategori</div>
                <BarChart data={catCounts} max={catCounts[0]?.[1] || 1} />
              </div>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>Top 8 Skills</div>
                <BarChart data={skillCounts} max={skillCounts[0]?.[1] || 1} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════ MODAL: EDIT TALENT ══════════════ */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 6 }}>Edit Profil Talent</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Update data profil kamu di direktori.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Nama</label>
            <input className="form-input" value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">No. WhatsApp</label>
            <input className="form-input" value={editForm.wa || ''} onChange={e => setEditForm(f => ({ ...f, wa: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Lokasi</label>
            <input className="form-input" value={editForm.loc || ''} onChange={e => setEditForm(f => ({ ...f, loc: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select className="form-select" value={editForm.cat || ''} onChange={e => setEditForm(f => ({ ...f, cat: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Skills</label>
            <SkillInput value={editForm.skills} onChange={skills => setEditForm(f => ({ ...f, skills }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-textarea" value={editForm.bio || ''} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Portofolio</label>
            <input className="form-input" value={editForm.portfolio || ''} onChange={e => setEditForm(f => ({ ...f, portfolio: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={editForm.status || 'open'} onChange={e => setEditForm(f => ({ ...f, status: e.target.value as any }))}>
              <option value="open">✅ Siap Kerja</option>
              <option value="busy">🟡 Sedang Project</option>
              <option value="employed">⚪ Employed</option>
            </select>
          </div>
          <button className="btn btn-primary btn-full" onClick={submitEdit} style={{ marginTop: 8 }}>
            💾 Simpan Perubahan
          </button>
        </div>
      </Modal>

      {/* ══════════════ MODAL: POST PROJECT ══════════════ */}
      <Modal open={postOpen} onClose={() => setPostOpen(false)}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 6 }}>Posting Project / Loker</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Isi detail project atau lowongan yang kamu butuhkan.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Judul <span style={{ color: 'var(--emerald)' }}>*</span></label>
            <input className="form-input" value={postForm.title} onChange={e => setPostForm(f => ({ ...f, title: e.target.value }))} placeholder="Contoh: Butuh Web Developer PHP" />
          </div>
          <div className="form-group">
            <label className="form-label">Jenis</label>
            <select className="form-select" value={postForm.type} onChange={e => setPostForm(f => ({ ...f, type: e.target.value }))}>
              <option value="IT">💻 Project IT</option>
              <option value="UMKM">🛍️ Kebutuhan UMKM</option>
              <option value="Training">📚 Pelatihan / Training</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea className="form-textarea" value={postForm.desc} onChange={e => setPostForm(f => ({ ...f, desc: e.target.value }))} placeholder="Ceritakan kebutuhan kamu..." style={{ minHeight: 80 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Budget / Gaji</label>
              <input className="form-input" value={postForm.budget} onChange={e => setPostForm(f => ({ ...f, budget: e.target.value }))} placeholder="Rp 500rb – 2jt" />
            </div>
            <div className="form-group">
              <label className="form-label">No. WhatsApp</label>
              <input className="form-input" value={postForm.wa} onChange={e => setPostForm(f => ({ ...f, wa: e.target.value }))} placeholder="08xxxxxxxxxx" />
            </div>
          </div>
          <button className="btn btn-primary btn-full" onClick={submitProject} disabled={postLoading} style={{ marginTop: 8 }}>
            {postLoading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Posting...</> : '📌 Posting Sekarang'}
          </button>
        </div>
      </Modal>

      <ToastContainer />

      {/* Mobile bottom nav */}
      <div style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99,
        background: 'rgba(9,14,12,0.95)', borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
      }} className="mobile-bottom-nav">
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'talent', icon: '👥', label: 'Talent' },
          { id: 'projects', icon: '💼', label: 'Loker' },
          { id: 'register', icon: '➕', label: 'Daftar' },
          { id: 'analytics', icon: '📊', label: 'Statistik' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              flex: 1, padding: '10px 4px', border: 'none', background: 'none',
              color: tab === item.id ? 'var(--emerald)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)', cursor: 'pointer', fontSize: 20,
            }}
          >
            <div>{item.icon}</div>
            <div style={{ fontSize: 10, marginTop: 2 }}>{item.label}</div>
          </button>
        ))}
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .mobile-bottom-nav { display: flex !important; }
          body { padding-bottom: 68px; }
        }
      `}</style>
    </>
  );
}
