import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AuthError() {
  const router = useRouter();
  const error = router.query.error as string;

  const messages: Record<string, string> = {
    OAuthSignin: 'Terjadi error saat memulai proses login dengan Google.',
    OAuthCallback: 'Terjadi error pada callback OAuth.',
    OAuthCreateAccount: 'Tidak bisa membuat akun. Coba lagi.',
    EmailCreateAccount: 'Tidak bisa membuat akun dengan email ini.',
    Callback: 'Error pada proses callback.',
    Default: 'Terjadi kesalahan yang tidak diketahui.',
  };

  return (
    <>
      <Head><title>Error — Jamaah Talent Hub</title></Head>
      <div className="grid-bg" />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 12 }}>Terjadi Kesalahan</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            {messages[error] || messages.Default}
          </p>
          <Link href="/auth/signin" className="btn btn-primary">
            ← Coba Lagi
          </Link>
        </div>
      </div>
    </>
  );
}
