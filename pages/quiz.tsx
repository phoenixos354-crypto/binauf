import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Question {
  id: string;
  question: string;
  options: string[];
  category: string;
}

export default function QuizPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; message: string; correct?: number; total?: number } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if ((session?.user as any)?.status === 'active') {
      router.replace('/');
    }
  }, [session, router]);

  useEffect(() => {
    fetchQuestions();
  }, [retryCount]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function fetchQuestions() {
    setLoading(true);
    setAnswers({});
    setResult(null);
    try {
      const r = await fetch('/api/quiz/questions');
      const d = await r.json();
      setQuestions(d.questions || []);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitting(true);
    try {
      const payload = questions.map(q => ({ id: q.id, chosen: answers[q.id] }));
      const r = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await r.json();
      setResult(data);

      if (data.passed) {
        await update(); // refresh session
        setTimeout(() => router.replace('/'), 2000);
      } else {
        setCooldown(30); // 30s cooldown before retry
      }
    } catch {
      setResult({ passed: false, message: 'Terjadi kesalahan. Coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  }

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <>
      <Head>
        <title>Verifikasi Keanggotaan — Jamaah Talent Hub</title>
      </Head>

      <div className="grid-bg" />
      <div style={{
        position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(16,185,122,0.05)', filter: 'blur(80px)',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '32px 16px', position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: 560 }} className="animate-fadeUp">

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 10 }}>
              Verifikasi Keanggotaan
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
              Jawab <strong style={{ color: 'var(--text)' }}>2 pertanyaan</strong> seputar{' '}
              <strong style={{ color: 'var(--emerald)' }}>29 Karakter Luhur LDII</strong>.
              Semua pertanyaan harus dijawab dengan benar untuk dapat mengakses platform.
            </p>
          </div>

          {/* Quiz Card */}
          <div className="card" style={{ padding: '32px 28px' }}>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div className="spinner" style={{ width: 32, height: 32 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Memuat soal...</p>
              </div>
            ) : result ? (
              // Result
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                {result.passed ? (
                  <>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--emerald)', marginBottom: 10 }}>
                      Alhamdulillah!
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                      {result.message}<br />
                      Kamu akan diarahkan ke platform...
                    </p>
                    <div className="spinner" style={{ margin: '0 auto' }} />
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 10 }}>
                      Belum Tepat
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
                      {result.message}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 24 }}>
                      Pelajari kembali materi 29 Karakter Luhur LDII, khususnya pada kelompok-kelompok nilai yang ada.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => { setRetryCount(c => c + 1); }}
                      disabled={cooldown > 0}
                    >
                      {cooldown > 0 ? `Coba Lagi (${cooldown}s)` : '🔄 Coba Lagi'}
                    </button>
                  </>
                )}
              </div>
            ) : (
              // Questions
              <>
                {questions.map((q, qi) => (
                  <div key={q.id} style={{ marginBottom: qi < questions.length - 1 ? 32 : 0 }}>
                    {/* Question header */}
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,122,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: 'var(--emerald)',
                      }}>
                        {qi + 1}
                      </div>
                      <div>
                        <div style={{
                          fontSize: 10, color: 'var(--emerald)', fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6
                        }}>
                          {q.category}
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.6 }}>
                          {q.question}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 40 }}>
                      {q.options.map((opt, oi) => {
                        const isSelected = answers[q.id] === oi;
                        return (
                          <button
                            key={oi}
                            type="button"
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))}
                            style={{
                              display: 'flex', alignItems: 'flex-start', gap: 12,
                              padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                              border: `1.5px solid ${isSelected ? 'var(--emerald)' : 'var(--border)'}`,
                              background: isSelected ? 'var(--emerald-glow)' : 'var(--bg2)',
                              color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                              textAlign: 'left', fontFamily: 'var(--font-body)',
                              fontSize: 14, transition: 'all 0.15s', lineHeight: 1.5,
                            }}
                          >
                            <span style={{
                              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                              border: `2px solid ${isSelected ? 'var(--emerald)' : 'var(--border)'}`,
                              background: isSelected ? 'var(--emerald)' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, color: '#041209', fontWeight: 700,
                              marginTop: 1,
                            }}>
                              {isSelected ? '✓' : String.fromCharCode(65 + oi)}
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {qi < questions.length - 1 && (
                      <hr className="divider" style={{ marginTop: 28 }} />
                    )}
                  </div>
                ))}

                {/* Progress & Submit */}
                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 13, color: 'var(--text-muted)'
                  }}>
                    <span>Dijawab: {Object.keys(answers).length}/{questions.length}</span>
                    {!allAnswered && <span style={{ color: 'var(--text-dim)' }}>Jawab semua soal untuk melanjutkan</span>}
                  </div>
                  <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: 'var(--emerald)',
                      width: `${(Object.keys(answers).length / Math.max(questions.length, 1)) * 100}%`,
                      borderRadius: 2, transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <button
                    className="btn btn-primary btn-lg btn-full"
                    onClick={handleSubmit}
                    disabled={!allAnswered || submitting}
                    style={{ marginTop: 4 }}
                  >
                    {submitting ? (
                      <><div className="spinner" style={{ width: 16, height: 16 }} /> Memeriksa...</>
                    ) : '✅ Kirim Jawaban'}
                  </button>
                </div>
              </>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginTop: 20 }}>
            Soal diambil secara acak dari bank soal 29 Karakter Luhur LDII
          </p>
        </div>
      </div>
    </>
  );
}
