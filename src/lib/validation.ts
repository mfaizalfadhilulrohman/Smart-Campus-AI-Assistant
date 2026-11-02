import { z } from "zod";
export const studentSchema = z.object({
  ipk: z.number().min(0).max(4),
  sks: z.number().int().min(1).max(30),
  activeTasks: z.number().int().min(0).max(30),
  studyHours: z.number().min(0).max(16),
  difficulty: z.enum(["Mudah","Sedang","Sulit"]),
  attendance: z.number().min(0).max(100),
  daysToExam: z.number().int().min(1).max(365)
});
