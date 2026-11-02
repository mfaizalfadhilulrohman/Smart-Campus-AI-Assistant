export type Risk = "Rendah" | "Sedang" | "Tinggi";
export interface StudentInput {
  ipk: number;
  sks: number;
  activeTasks: number;
  studyHours: number;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  attendance: number;
  daysToExam: number;
}
export interface CaseRecord extends StudentInput {
  id: string;
  risk: Risk;
  recommendation: string;
}
export interface Activity {
  id: string;
  name: string;
  hours: number;
  urgency: number;
}
export interface ScheduledActivity extends Activity {
  day: number;
}
export interface AnalysisResult {
  risk: Risk;
  loadScore: number;
  readinessScore: number;
  fuzzyLabel: string;
  rules: string[];
  recommendations: string[];
  nearestCase: { item: CaseRecord; distance: number };
  selected: Activity[];
  schedule: ScheduledActivity[];
  totalHours: number;
  totalUrgency: number;
  excluded: Activity[];
  explanation: string[];
  createdAt: string;
}
