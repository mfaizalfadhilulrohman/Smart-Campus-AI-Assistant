import { StudentInput, Risk } from "@/types";
export function applyRules(s:StudentInput, fuzzy:{loadScore:number;readinessScore:number}) {
  const fired:string[]=[];
  // Prioritas risiko akademik. Fuzzy dipakai sebagai sinyal pendukung, bukan satu-satunya dasar.
  let risk:Risk = "Rendah";
  if (s.ipk < 3 && s.activeTasks >= 7) { risk="Tinggi"; fired.push("R1: IPK < 3 dan tugas aktif ≥ 7 → risiko tinggi."); }
  if (s.ipk < 3 && (s.sks >= 22 || s.attendance < 80)) { risk="Tinggi"; fired.push("R2: IPK < 3 disertai SKS tinggi atau kehadiran < 80% → risiko tinggi."); }
  if (s.ipk >= 3 && s.ipk < 3.5 && s.activeTasks >= 5) { risk = risk==="Tinggi" ? risk : "Sedang"; fired.push("R3: IPK 3–<3,5 dan tugas aktif ≥ 5 → minimal risiko sedang."); }
  if (s.ipk >= 3.5 && s.activeTasks < 5 && s.attendance >= 85) { risk = risk==="Tinggi" ? risk : "Rendah"; fired.push("R4: IPK ≥ 3,5, tugas < 5, kehadiran ≥ 85% → risiko rendah."); }
  if (s.difficulty==="Sulit" && s.daysToExam <= 7) { risk = risk==="Rendah" ? "Sedang" : risk; fired.push("R5: Mata kuliah sulit dan UTS ≤ 7 hari → tingkatkan perhatian persiapan."); }
  if (s.attendance < 75) { risk = risk==="Rendah" ? "Sedang" : risk; fired.push("R6: Kehadiran < 75% → perlu tindak lanjut materi perkuliahan."); }
  if (fuzzy.loadScore >= 75 && fuzzy.readinessScore < 55) { risk="Tinggi"; fired.push("R7: Beban fuzzy tinggi dan kesiapan rendah → risiko tinggi."); }
  if (!fired.length) fired.push("R8: Tidak ada pemicu risiko khusus; tetap lakukan pemantauan rutin.");
  const recommendations:string[]=[];
  if (risk==="Tinggi") recommendations.push("Prioritaskan tugas dengan tenggat terdekat dan konsultasikan kondisi akademik dengan dosen PA.");
  if (risk==="Sedang") recommendations.push("Bagi tugas menjadi target harian dan evaluasi progres setiap akhir hari.");
  if (risk==="Rendah") recommendations.push("Pertahankan pola belajar dan tinjau kembali capaian mingguan.");
  if (s.studyHours < 2) recommendations.push("Tambahkan sesi belajar bertahap sesuai waktu yang tersedia; hindari menumpuk belajar menjelang ujian.");
  else recommendations.push("Pertahankan waktu belajar harian dan gunakan sesi fokus untuk materi yang paling sulit.");
  if (s.attendance < 85) recommendations.push("Lengkapi materi pertemuan yang terlewat melalui catatan kuliah atau diskusi dengan dosen/teman.");
  if (s.daysToExam <= 7) recommendations.push("Gunakan sisa hari menuju UTS untuk latihan soal dan mengulang konsep inti.");
  return {risk,fired,recommendations};
}
