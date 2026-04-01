# 🕌 Jamaah Talent Hub — Panduan Setup & Deploy

## Stack yang Digunakan
- **Framework**: Next.js 14 (Pages Router)
- **Auth**: NextAuth.js + Google OAuth
- **Database**: Firestore (Firebase)
- **Deploy**: Vercel
- **Gate**: Quiz 2 soal wajib benar semua

---

## LANGKAH 1 — Setup Firebase

### 1.1 Buat Project Firebase
1. Buka https://console.firebase.google.com
2. Klik **"Add project"** → beri nama: `jamaah-talent-hub`
3. Nonaktifkan Google Analytics (opsional) → klik **"Create project"**

### 1.2 Aktifkan Firestore
1. Di sidebar kiri → **Build → Firestore Database**
2. Klik **"Create database"**
3. Pilih **"Start in production mode"**
4. Pilih region: **`asia-southeast2` (Jakarta)** → klik **"Enable"**

### 1.3 Deploy Firestore Rules
Upload file `firestore.rules` ini ke Firebase Console:
- Di Firestore → tab **"Rules"** → paste isi file `firestore.rules` → **"Publish"**

### 1.4 Ambil Firebase Config (untuk .env.local)
1. Di Firebase Console → ⚙️ **Project Settings → General**
2. Scroll ke bawah → **"Your apps"** → klik ikon **Web (`</>`)**
3. Register app dengan nama `jamaah-talent-hub-web`
4. Copy nilai-nilai berikut ke `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

### 1.5 Buat Service Account (untuk Server/Admin SDK)
1. Di Firebase Console → ⚙️ **Project Settings → Service accounts**
2. Pastikan **"Firebase Admin SDK"** dipilih
3. Klik **"Generate new private key"** → download file JSON
4. Buka file JSON tersebut, copy nilai berikut ke `.env.local`:
   ```
   FIREBASE_PROJECT_ID=        ← ambil dari "project_id"
   FIREBASE_CLIENT_EMAIL=      ← ambil dari "client_email"
   FIREBASE_PRIVATE_KEY=       ← ambil dari "private_key" (sertakan tanda kutip)
   ```

   ⚠️ **Penting:** Untuk `FIREBASE_PRIVATE_KEY`, salin nilai lengkap termasuk
   `-----BEGIN PRIVATE KEY-----` dan `-----END PRIVATE KEY-----`.
   Di file `.env.local`, letakkan dalam tanda kutip ganda:
   ```
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXX\n-----END PRIVATE KEY-----\n"
   ```

---

## LANGKAH 2 — Setup Google OAuth

### 2.1 Buat OAuth Credentials
1. Buka https://console.cloud.google.com
2. Pastikan project yang aktif = project Firebase kamu
3. Di sidebar → **APIs & Services → Credentials**
4. Klik **"+ Create Credentials" → "OAuth client ID"**
5. Pilih **"Web application"**
6. Beri nama: `Jamaah Talent Hub`
7. Di **"Authorized redirect URIs"**, tambahkan:
   - `http://localhost:3000/api/auth/callback/google` ← untuk development
   - `https://NAMA-APP-KAMU.vercel.app/api/auth/callback/google` ← untuk production
8. Klik **"Create"** → copy **Client ID** dan **Client Secret** ke `.env.local`:
   ```
   GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
   ```

### 2.2 Aktifkan Google+ API (jika belum)
1. Di Google Cloud Console → **APIs & Services → Library**
2. Cari **"Google+ API"** atau **"Google Identity"** → Enable

---

## LANGKAH 3 — Setup Local Development

### 3.1 Install Dependencies
```bash
cd jamaah-talent-hub
npm install
```

### 3.2 Buat File .env.local
```bash
cp .env.example .env.local
```
Lalu isi semua nilai sesuai langkah 1 dan 2 di atas.

### 3.3 Generate NEXTAUTH_SECRET
Jalankan perintah ini di terminal:
```bash
openssl rand -base64 32
```
Copy hasilnya ke `.env.local`:
```
NEXTAUTH_SECRET=hasil_openssl_di_sini
```

### 3.4 Jalankan Development Server
```bash
npm run dev
```
Buka http://localhost:3000

---

## LANGKAH 4 — Deploy ke Vercel

### 4.1 Push ke GitHub
```bash
git init
git add .
git commit -m "initial: jamaah talent hub"
git branch -M main
git remote add origin https://github.com/USERNAME/jamaah-talent-hub.git
git push -u origin main
```

### 4.2 Import ke Vercel
1. Buka https://vercel.com/new
2. Klik **"Import Git Repository"** → pilih repo kamu
3. Framework preset: **Next.js** (auto-detect)
4. Klik **"Environment Variables"**
5. Tambahkan **SEMUA** variabel dari `.env.local` satu per satu:

   | Key | Value |
   |-----|-------|
   | `NEXTAUTH_URL` | `https://NAMA-APP.vercel.app` |
   | `NEXTAUTH_SECRET` | hasil openssl tadi |
   | `GOOGLE_CLIENT_ID` | dari Google Cloud |
   | `GOOGLE_CLIENT_SECRET` | dari Google Cloud |
   | `FIREBASE_PROJECT_ID` | dari Firebase |
   | `FIREBASE_CLIENT_EMAIL` | dari Firebase |
   | `FIREBASE_PRIVATE_KEY` | dari Firebase (dengan tanda kutip) |
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | dari Firebase |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | dari Firebase |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | dari Firebase |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | dari Firebase |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | dari Firebase |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | dari Firebase |

6. Klik **"Deploy"**

### 4.3 Update Google OAuth Redirect URI
Setelah deploy sukses, kamu punya URL production seperti `https://jamaah-talent-hub.vercel.app`.

1. Kembali ke Google Cloud Console → Credentials → OAuth Client
2. Tambahkan redirect URI: `https://jamaah-talent-hub.vercel.app/api/auth/callback/google`
3. Klik Save

---

## LANGKAH 5 — Verifikasi Flow

Setelah deploy, test urutan ini:

1. ✅ Buka URL Vercel → halaman login tampil
2. ✅ Klik "Masuk dengan Google" → pilih akun Google
3. ✅ Redirect ke `/quiz` → 2 pertanyaan tampil
4. ✅ Jawab semua dengan benar → redirect ke `/` (dashboard)
5. ✅ Coba jawab salah → muncul pesan gagal + cooldown 30 detik
6. ✅ Di dashboard: bisa lihat talent, posting project, daftar sebagai talent

---

## Struktur Firestore

```
firestore/
├── users/          ← key: email
│   └── {email}
│       ├── uid
│       ├── name
│       ├── email
│       ├── photoURL
│       ├── status         ← "pending_quiz" | "active"
│       ├── quizPassedAt
│       ├── talentId       ← link ke talent profile
│       └── createdAt
│
├── talents/        ← auto-id
│   └── {docId}
│       ├── userId (email)
│       ├── name, wa, email, photoURL
│       ├── loc, cat
│       ├── skills[]
│       ├── bio, portfolio
│       ├── status         ← "open" | "busy" | "employed"
│       └── createdAt
│
└── projects/       ← auto-id
    └── {docId}
        ├── userId (email)
        ├── title, type, desc
        ├── budget, wa
        ├── postedBy
        └── createdAt
```

---

## Fitur Keamanan

| Fitur | Implementasi |
|-------|-------------|
| Login wajib | NextAuth middleware redirect |
| Quiz gate | API `/api/quiz/submit` — correct answer di server only |
| Kunci jawaban | Tidak dikirim ke client (hanya pertanyaan) |
| Cooldown retry | 30 detik setelah jawaban salah |
| API protection | Semua endpoint cek `session + status === 'active'` |
| Firestore rules | Semua akses hanya lewat Admin SDK (server-side) |
| Edit/delete | Hanya bisa oleh owner (`userId === session.email`) |

---

## Pengembangan Selanjutnya

- [ ] Admin panel untuk verifikasi manual user
- [ ] Notifikasi WA blast ke admin saat talent baru daftar
- [ ] Search full-text dengan Algolia
- [ ] Upload foto portofolio ke Firebase Storage
- [ ] Halaman profil publik per talent (`/talent/[id]`)
- [ ] Filter multi-skill
- [ ] Fitur "Simpan / Bookmark" talent

---

## Troubleshooting

**Error: FIREBASE_PRIVATE_KEY is not defined**
→ Pastikan private key di env Vercel pakai tanda kutip ganda dan `\n` (bukan newline asli)

**Error: OAuth redirect URI mismatch**
→ Pastikan URL di Google Cloud Console PERSIS sama dengan `NEXTAUTH_URL` di env

**Quiz tidak muncul / loop redirect**
→ Clear cookies browser, coba ulang sign in

---

*Dibuat untuk komunitas IT jamaah LDII Jawa Timur • Amal jariyah para ahli IT*
