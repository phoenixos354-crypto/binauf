import { useState, KeyboardEvent } from 'react';

const SUGGESTIONS = [
  'React', 'Next.js', 'Laravel', 'WordPress', 'Vue.js',
  'Flutter', 'Android', 'iOS', 'Figma', 'Adobe XD',
  'Python', 'MySQL', 'PostgreSQL', 'Firebase', 'MongoDB',
  'TikTok Ads', 'Meta Ads', 'Canva', 'Copywriting', 'SEO',
  'Node.js', 'PHP', 'TypeScript', 'Tailwind CSS', 'Bootstrap',
];

interface SkillInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillInput({ value, onChange }: SkillInputProps) {
  const [input, setInput] = useState('');

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  }

  function removeSkill(skill: string) {
    onChange(value.filter(s => s !== skill));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) { addSkill(input); setInput(''); }
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  }

  const filtered = SUGGESTIONS.filter(
    s => !value.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 8);

  return (
    <div>
      <input
        className="form-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ketik lalu tekan Enter untuk tambah skill..."
      />

      {/* Quick suggestions */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {filtered.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => addSkill(s)}
              style={{
                padding: '3px 10px', borderRadius: 6,
                border: '1px dashed var(--border)',
                background: 'none', color: 'var(--text-dim)',
                fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-mono)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.borderColor = 'var(--emerald)';
                (e.target as HTMLButtonElement).style.color = 'var(--emerald)';
                (e.target as HTMLButtonElement).style.background = 'var(--emerald-glow)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.borderColor = 'var(--border)';
                (e.target as HTMLButtonElement).style.color = 'var(--text-dim)';
                (e.target as HTMLButtonElement).style.background = 'none';
              }}
            >
              + {s}
            </button>
          ))}
        </div>
      )}

      {/* Chips */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {value.map(s => (
            <span
              key={s}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 6,
                background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,122,0.25)',
                fontSize: 12, color: 'var(--emerald)', fontFamily: 'var(--font-mono)',
              }}
            >
              {s}
              <button
                type="button"
                onClick={() => removeSkill(s)}
                style={{
                  background: 'none', border: 'none', color: 'var(--emerald)',
                  cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0, opacity: 0.7
                }}
              >×</button>
            </span>
          ))}
        </div>
      )}

      <p className="form-hint">Ketik nama skill lalu tekan Enter. Atau klik saran di atas.</p>
    </div>
  );
}
