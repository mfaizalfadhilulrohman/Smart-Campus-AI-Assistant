import { CaseRecord, StudentInput } from "@/types";
const fields:(keyof Pick<StudentInput,"ipk"|"sks"|"activeTasks"|"studyHours">)[]=["ipk","sks","activeTasks","studyHours"];
export function retrieveCase(input:StudentInput, cases:CaseRecord[]) {
  if (!cases.length) throw new Error("Basis kasus kosong.");
  const mins:Record<string,number>={}, maxs:Record<string,number>={};
  fields.forEach(k=>{ const vals=cases.map(c=>c[k]); mins[k]=Math.min(...vals); maxs[k]=Math.max(...vals); });
  const ranked=cases.map(item=>{
    const sum=fields.reduce((acc,k)=>{
      const range=maxs[k]-mins[k];
      const q=range===0?0:(input[k]-mins[k])/range;
      const c=range===0?0:(item[k]-mins[k])/range;
      return acc+(q-c)**2;
    },0);
    return {item,distance:Math.sqrt(sum)};
  }).sort((a,b)=>a.distance-b.distance);
  return ranked[0];
}
