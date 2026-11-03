# Patch deployment Vercel

Paket ini memperbaiki tiga error ESLint dari log Vercel:
- Menghapus `riskSummary` dan import `useMemo` yang tidak digunakan.
- Menghapus parameter `i` yang tidak digunakan pada map rekomendasi.
- Menghindari destructuring variabel `_` yang tidak digunakan pada planner.

Dependensi juga diperbarui ke Next.js 15.5.28 dan React 19.0.9. Next.js 15.5.28 adalah versi patched yang diumumkan pada 14 Oktober 2026 untuk lini Next.js 15.

## Terapkan ke GitHub
1. Ekstrak ZIP ini.
2. Salin/replace isi folder project di repository GitHub dengan isi ZIP ini (jangan menghapus `.git` jika menggunakan folder clone lokal).
3. Jika menggunakan terminal lokal, jalankan `npm install` untuk memperbarui `package-lock.json`.
4. Jalankan `npm run build`.
5. Commit dan push `package.json` serta `package-lock.json` ke branch `main`.
6. Vercel akan menjalankan deployment baru.

Jika mengedit langsung di GitHub, hapus `package-lock.json` lama bila ada sebelum commit agar Vercel membuat lockfile baru berdasarkan `package.json` yang telah diperbarui. Lebih disarankan melakukan `npm install` secara lokal sehingga lockfile ikut tersimpan.
