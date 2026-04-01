import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Beranda', icon: '🏠' },
    { id: 'talent', label: 'Direktori', icon: '👥' },
    { id: 'projects', label: 'Loker & Project', icon: '💼' },
    { id: 'register', label: 'Daftar Talent', icon: '➕' },
    { id: 'analytics', label: 'Statistik', icon: '📊' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>🕌</div>
          <div>
            <div className={styles.title}>
              Jamaah <span>Talent</span> Hub
            </div>
            <div className={styles.sub}>EPM DPW LDII Jawa Timur</div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className={styles.tabs}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
              onClick={() => onTabChange?.(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* User */}
        <div className={styles.user}>
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || ''}
              width={32} height={32}
              className={styles.avatar}
            />
          )}
          <span className={styles.userName}>{session?.user?.name?.split(' ')[0]}</span>
          <button
            className={`btn btn-ghost btn-sm ${styles.signOut}`}
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            Keluar
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`${styles.mobileTab} ${activeTab === t.id ? styles.mobileTabActive : ''}`}
              onClick={() => { onTabChange?.(t.id); setMenuOpen(false); }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
          <hr className="divider" style={{ margin: '8px 0' }} />
          <button
            className={styles.mobileTab}
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            <span>🚪</span> Keluar
          </button>
        </div>
      )}
    </nav>
  );
}
