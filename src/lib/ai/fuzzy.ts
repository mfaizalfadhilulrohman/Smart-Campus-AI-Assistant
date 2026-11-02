import { StudentInput } from "@/types";

// Membership trapezoid sederhana dengan batas eksplisit 0..100.
function trap(x:number, a:number, b:number, c:number, d:number):number {
  if (x >= b && x <= c) return 1;
  if (x < a || x > d) return 0;
  if (x > a && x < b) return (x-a)/(b-a || 1);
  return (d-x)/(d-c || 1);
}
export function fuzzyAssessment(s:StudentInput) {
  // Skor beban: SKS (maks. 24) dan jumlah tugas (maks. 10).
  const load = Math.min(100, (s.sks/24)*55 + (s.activeTasks/10)*45);
  // Kesiapan: jam belajar, kehadiran, dan jarak ke ujian.
  const timeFactor = Math.min(1, s.studyHours/4)*40;
  const attendanceFactor = s.attendance*0.4;
  const timePressure = s.daysToExam <= 3 ? 0 : s.daysToExam <= 7 ? 8 : 20;
  const readiness = Math.max(0, Math.min(100, timeFactor + attendanceFactor + timePressure));
  const lowLoad = trap(load,0,0,25,50);
  const midLoad = trap(load,25,45,55,75);
  const highLoad = trap(load,50,75,100,100);
  const lowReady = trap(readiness,0,0,35,55);
  const midReady = trap(readiness,35,50,65,80);
  const highReady = trap(readiness,60,80,100,100);
  const high = Math.max(Math.min(highLoad,lowReady), Math.min(highLoad,midReady), Math.min(midLoad,lowReady));
  const medium = Math.max(Math.min(highLoad,highReady), Math.min(midLoad,midReady), Math.min(lowLoad,lowReady));
  const low = Math.max(Math.min(lowLoad,highReady), Math.min(midLoad,highReady));
  const label = high >= medium && high >= low ? "Beban tinggi" : medium >= low ? "Perlu perhatian" : "Relatif terkendali";
  return { loadScore:Math.round(load), readinessScore:Math.round(readiness), label, memberships:{ lowLoad,midLoad,highLoad,lowReady,midReady,highReady } };
}
