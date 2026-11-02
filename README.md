# Smart Campus AI Assistant

Prototipe web untuk UTS: Next.js + TypeScript, tanpa backend/database/login. Data kasus dasar berada di `src/data/cases.ts`; riwayat analisis disimpan pada `localStorage` browser.

## Fitur
- Form 7 atribut akademik dengan validasi Zod.
- Fuzzy Logic: skor beban dan kesiapan dengan fungsi keanggotaan trapezoid.
- Rule-Based System: aturan R1–R8, risiko dan rekomendasi.
- CBR: normalisasi Min-Max dan jarak Euclidean.
- A* Planner: best-first branch-and-bound dengan fractional relaxation sebagai batas atas, kapasitas rencana maksimal 8 jam dan distribusi ke hari berdasarkan jam belajar harian.
- Dashboard, explainability, dan riwayat lokal.

## Persyaratan
- Node.js 20 LTS atau lebih baru
- npm
- Git (untuk deploy lewat GitHub)

## Menjalankan lokal
1. Ekstrak ZIP.
2. Buka terminal pada folder `smart-campus-ai`.
3. Jalankan:
   ```bash
   npm install
   npm run dev
   ```
4. Buka http://localhost:3000.
5. Untuk uji build produksi:
   ```bash
   npm run build
   npm run start
   ```

## Deploy ke Vercel
1. Buat repository baru di GitHub.
2. Upload/push seluruh isi folder project ke repository.
3. Login ke https://vercel.com menggunakan akun GitHub.
4. Pilih **Add New → Project**, lalu import repository.
5. Framework Preset akan terdeteksi sebagai **Next.js**. Biarkan Build Command `next build` dan Output Directory default.
6. Klik **Deploy**. Setelah build berhasil, Vercel memberikan URL publik.
7. Setiap push ke branch production (umumnya `main`) akan memicu deployment baru.

Tidak perlu Environment Variables untuk versi prototipe ini.

## Struktur folder
```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  data/
    activities.ts
    cases.ts
  lib/
    ai/
      cbr.ts
      fuzzy.ts
      index.ts
      planner.ts
      rules.ts
    validation.ts
  types/
    index.ts
```

## Catatan akademik dan batasan
- Angka skor fuzzy dan ambang aturan pada implementasi ini adalah rancangan prototipe yang perlu dijelaskan dan diuji; bukan hasil kalibrasi empiris.
- Basis kasus awal hanya 6 kasus contoh dari rancangan. Tambahkan/validasi kasus sebelum menyimpulkan performa.
- CBR menggunakan empat atribut numerik: IPK, SKS, tugas aktif, dan jam belajar.
- Aturan menggabungkan kondisi IPK, beban tugas/SKS, tingkat kesulitan, kehadiran, hari menuju UTS dan sinyal fuzzy.
- A* merencanakan aktivitas dengan kapasitas maksimum 8 jam untuk keseluruhan rencana. Jam belajar per hari membatasi distribusi aktivitas antarhari. Skor urgensi adalah nilai heuristik/input yang ditetapkan pada data aktivitas.
- `localStorage` hanya tersedia pada browser/perangkat yang sama. Menghapus data browser dapat menghapus riwayat. Tidak ada sinkronisasi multi-user.
- Hasil sistem adalah alat bantu perencanaan, bukan diagnosis atau keputusan akademik resmi.
