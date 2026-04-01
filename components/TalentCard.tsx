import Image from 'next/image';
import { Talent } from '@/types';

const CAT_EMOJI: Record<string, string> = {
  'Web Developer': '👨‍💻',
  'Mobile Developer': '📱',
  'UI/UX Designer': '🎨',
  'Digital Marketing': '📢',
  'UMKM / Wirausaha': '🛍️',
  'Data / AI': '📊',
  'Lainnya': '💡',
};

const STATUS_CONFIG = {
  open: { label: '✅ Siap Kerja', cls: 'badge-emerald' },
  busy: { label: '🟡 Sedang Project', cls: 'badge-gold' },
  employed: { label: '⚪ Employed', cls: 'badge-muted' },
};

interface TalentCardProps {
  talent: Talent;
  delay?: number;
  isOwner?: boolean;
  onEdit?: () => void;
}

export default function TalentCard({ talent, delay = 0, isOwner, onEdit }: TalentCardProps) {
  const status = STATUS_CONFIG[talent.status] || STATUS_CONFIG.open;
  const emoji = CAT_EMOJI[talent.cat] || '👤';
  const waLink = `https://wa.me/62${talent.wa.replace(/^0/, '').replace(/\D/g, '')}`;

  return (
    <div
      className="card card-hover animate-fadeUp"
      style={{ padding: '22px', animationDelay: `${delay}s` }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        {talent.photoURL ? (
          <Image
            src={talent.photoURL}
            alt={talent.name}
            width={48} height={48}
            style={{ borderRadius: 10, flexShrink: 0, border: '1.5px solid var(--border)' }}
          />
        ) : (
          <div style={{
            width: 48, height: 48, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--emerald-dim), #0a6b44)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>
            {emoji}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            {talent.name}
            {isOwner && (
              <span style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 99,
                background: 'var(--gold-dim)', color: 'var(--gold)',
                border: '1px solid rgba(212,168,67,0.25)', fontWeight: 600
              }}>Kamu</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{talent.cat}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>📍 {talent.loc}</div>
        </div>
        <span className={`badge ${status.cls}`} style={{ flexShrink: 0, fontSize: 10 }}>
          {status.label}
        </span>
      </div>

      {/* Skills */}
      {talent.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
          {talent.skills.map(s => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
        </div>
      )}

      {/* Bio */}
      {talent.bio && (
        <p style={{
          fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65,
          borderTop: '1px solid var(--border)', paddingTop: 14,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {talent.bio}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
          style={{ flex: 1, textDecoration: 'none' }}
        >
          💬 Hubungi WA
        </a>
        {talent.portfolio && (
          <a
            href={talent.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ textDecoration: 'none' }}
          >
            🔗
          </a>
        )}
        {isOwner && onEdit && (
          <button className="btn btn-ghost btn-sm" onClick={onEdit}>
            ✏️
          </button>
        )}
      </div>
    </div>
  );
}
