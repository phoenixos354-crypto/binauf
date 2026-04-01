import { useState, KeyboardEvent } from 'react';

const PRESET_CATEGORIES = [
  'Web Developer',
  'Mobile Developer',
  'UI/UX Designer',
  'Digital Marketing',
  'UMKM / Wirausaha',
  'Data / AI',
  'Graphic Designer',
  'Content Creator',
  'Network / IT Support',
  'Videografi / Fotografi',
  'Akuntansi / Keuangan',
  'Copywriting',
];

interface CategoryInputProps {
  value: string[];
  onChange: (cats: string[]) => void;
}

export default function CategoryInput({ value, onChange }: CategoryInputProps) {
  const [input, setInput] = useState('');

  function addCat(cat: string) {
    const trimmed = cat.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInput('');
  }

  function removeCat(cat: string) {
    onChange(value.filter(c => c !== cat));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) addCat(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeCat(value[value.length - 1]);
    }
  }

  // Preset yang belum dipilih, filter by input text
  const filtered = PRESET_CATEGORIES.filter(
    c => !value.includes(c) && c.toLowerCase().includes(input.toLowerCase())
  );

  // Tampilkan opsi "Tambah: ..." jika input tidak cocok exact dengan preset
  const isCustom = input.trim() !== '' && !PRESET_CATEGORIES.some(
    c => c.toLowerCase() === input.trim().toLowerCase()
  );

  return (
    <div>
      {/* Input ketik custom */}
      <input
        className="form-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Pilih dari daftar atau ketik kategori sendiri, lalu Enter..."
      />

      {/* Preset suggestions */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {filtered.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => addCat(c)}
              style={{
                padding: '4px 11px', borderRadius: 6,
                border: '1px dashed var(--border)',
                background: 'none', color: 'var(--text-dim)',
                fontSize: 12, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--emerald)';
                el.style.color = 'var(--emerald)';
                el.style.background = 'var(--emerald-glow)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--border)';
                el.style.color = 'var(--text-dim)';
                el.style.background = 'none';
              }}
            >
              + {c}
            </button>
          ))}
        </div>
      )}

      {/* Opsi tambah custom jika tidak ada di preset */}
      {isCustom && (
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            onClick={() => addCat(input)}
            style={{
              padding: '6px 14px', borderRadius: 6,
              border: '1px solid var(--emerald)',
              background: 'var(--emerald-glow)', color: 'var(--emerald)',
              fontSize: 12, cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}
          >
            ✚ Tambah &ldquo;{input.trim()}&rdquo; sebagai kategori baru
          </button>
        </div>
      )}

      {/* Selected chips */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {value.map(c => (
            <span
              key={c}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 11px', borderRadius: 7,
                background: 'var(--emerald-glow)',
                border: '1px solid rgba(16,185,122,0.3)',
                fontSize: 13, color: 'var(--emerald)',
                fontWeight: 500,
              }}
            >
              {c}
              <button
                type="button"
                onClick={() => removeCat(c)}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--emerald)', cursor: 'pointer',
                  fontSize: 15, lineHeight: 1, padding: 0, opacity: 0.7,
                }}
              >×</button>
            </span>
          ))}
        </div>
      )}

      <p className="form-hint" style={{ marginTop: 8 }}>
        Pilih semua kategori yang sesuai keahlianmu. Bisa lebih dari satu.
      </p>
    </div>
  );
}
