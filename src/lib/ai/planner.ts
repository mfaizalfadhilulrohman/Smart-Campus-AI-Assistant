import { Activity, ScheduledActivity } from "@/types";

// Best-first branch-and-bound memakai fractional relaxation sebagai batas atas.
// Kapasitas 8 jam adalah anggaran seluruh rencana, bukan jatah satu hari.
export function planActivities(items:Activity[], dailyHours:number, days:number, capacity=8) {
  const totalCapacity=Math.min(capacity, Math.floor(dailyHours*days));
  const sorted=[...items].sort((a,b)=>(b.urgency/b.hours)-(a.urgency/a.hours));
  type Node={i:number; hours:number; value:number; chosen:Activity[]; bound:number};
  const bound=(i:number,h:number,v:number)=>{
    let rem=totalCapacity-h, upper=v;
    for(let j=i;j<sorted.length && rem>0;j++){
      const a=sorted[j];
      if(a.hours<=rem){upper+=a.urgency;rem-=a.hours;}
      else {upper+=a.urgency*(rem/a.hours);break;}
    }
    return upper;
  };
  const queue:Node[]=[{i:0,hours:0,value:0,chosen:[],bound:bound(0,0,0)}];
  let best:Node={i:0,hours:0,value:0,chosen:[],bound:0};
  while(queue.length){
    queue.sort((a,b)=>b.bound-a.bound);
    const n=queue.shift()!;
    if(n.bound < best.value || n.i>=sorted.length) { if(n.value>best.value) best=n; continue; }
    const a=sorted[n.i];
    const skip:Node={i:n.i+1,hours:n.hours,value:n.value,chosen:n.chosen,bound:bound(n.i+1,n.hours,n.value)};
    const next=[...n.chosen,a];
    const take:Node={i:n.i+1,hours:n.hours+a.hours,value:n.value+a.urgency,chosen:next,bound:bound(n.i+1,n.hours+a.hours,n.value+a.urgency)};
    queue.push(skip);
    if(take.hours<=totalCapacity) queue.push(take);
    if(take.value>best.value || (take.value===best.value && take.hours>best.hours)) best=take;
  }
  // Distribusikan tugas terpilih ke hari-hari dengan kapasitas harian.
  const schedule:ScheduledActivity[]=[];
  let day=1, used=0;
  for(const a of [...best.chosen].sort((x,y)=>y.urgency-x.urgency || x.hours-y.hours)){
    let remaining=a.hours;
    while(remaining>0 && day<=days){
      if(used>=dailyHours){day++;used=0;continue;}
      const chunk=Math.min(remaining,dailyHours-used);
      schedule.push({...a,hours:Number(chunk.toFixed(2)),day});
      remaining=Number((remaining-chunk).toFixed(2));
      used=Number((used+chunk).toFixed(2));
      if(used>=dailyHours){day++;used=0;}
    }
  }
  const selectedIds=new Set(schedule.map(a=>a.id));
  return {
    selected:schedule.map(({day:_,...a})=>a),
    schedule,
    excluded:items.filter(a=>!selectedIds.has(a.id)),
    totalHours:schedule.reduce((s,a)=>s+a.hours,0),
    totalUrgency:schedule.reduce((s,a)=>s+a.urgency,0),
    capacity:totalCapacity
  };
}
