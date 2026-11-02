import { StudentInput, CaseRecord, AnalysisResult } from "@/types";
import { fuzzyAssessment } from "./fuzzy";
import { applyRules } from "./rules";
import { retrieveCase } from "./cbr";
import { planActivities } from "./planner";
import { activities } from "@/data/activities";

export function runAnalysis(input:StudentInput, cases:CaseRecord[]):AnalysisResult {
  const fuzzy=fuzzyAssessment(input);
  const rule=applyRules(input,fuzzy);
  const nearest=retrieveCase(input,cases);
  const plan=planActivities(activities,input.studyHours,input.daysToExam,8);
  const explanation=[
    `Skor beban ${fuzzy.loadScore}/100 dan kesiapan ${fuzzy.readinessScore}/100 (${fuzzy.label}).`,
    `Sistem aturan menetapkan risiko ${rule.risk.toLowerCase()} berdasarkan kondisi input dan aturan yang aktif.`,
    `Kasus terdekat adalah ${nearest.item.id} dengan jarak MinMax-Euclidean ${nearest.distance.toFixed(3)}.`,
    `Perencana memilih ${plan.schedule.length} aktivitas dengan total ${plan.totalHours} jam dan urgensi ${plan.totalUrgency}; kapasitas rencana ${plan.capacity} jam.`
  ];
  return {risk:rule.risk,loadScore:fuzzy.loadScore,readinessScore:fuzzy.readinessScore,fuzzyLabel:fuzzy.label,
    rules:rule.fired,recommendations:[...rule.recommendations,nearest.item.recommendation],
    nearestCase:nearest,selected:plan.selected,schedule:plan.schedule,totalHours:plan.totalHours,
    totalUrgency:plan.totalUrgency,excluded:plan.excluded,explanation,createdAt:new Date().toISOString()};
}
