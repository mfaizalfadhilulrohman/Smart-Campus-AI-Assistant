"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BrainCircuit, CalendarDays, CheckCircle2, ChevronRight, Clock3, Database, Gauge, History, Lightbulb, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { initialCases } from "@/data/cases";
import { StudentInput, AnalysisResult } from "@/types";
import { runAnalysis } from "@/lib/ai";
import { studentSchema } from "@/lib/validation";

const defaults:StudentInput={ipk:3.1,sks:22,activeTasks:7,studyHours:2,difficulty:"Sulit",attendance:85,daysToExam:5};
type Saved={input:StudentInput;result:AnalysisResult};
const riskClass=(risk:string)=>risk==="Tinggi"?"high":risk==="Sedang"?"medium":"low";

export default function Home() {
  const [form,setForm]=useState<StudentInput>(defaults);
  const [result,setResult]=useState<AnalysisResult|null>(null);
  const [history,setHistory]=useState<Saved[]>([]);
  const [error,setError]=useState("");
  const [ready,setReady]=useState(false);
  useEffect(()=>{try{const raw=localStorage.getItem("smart-campus-history");if(raw)setHistory(JSON.parse(raw));}catch{setHistory([]);}setReady(true);},[]);
  const update=<K extends keyof StudentInput>(key:K,value:StudentInput[K])=>setForm(prev=>({...prev,[key]:value}));
  const riskSummary=useMemo(()=>({Tinggi:history.filter(x=>x.result.risk==="Tinggi").length,Sedang:history.filter(x=>x.result.risk==="Sedang").length,Rendah:history.filter(x=>x.result.risk==="Rendah").length}),[history]);
  function analyze(){
    const parsed=studentSchema.safeParse(form);
    if(!parsed.success){setError("Periksa kembali nilai input. Pastikan semua nilai berada pada rentang yang benar.");return;}
    setError("");
    const output=runAnalysis(parsed.data,initialCases);
    setResult(output);
    const next=[{input:parsed.data,result:output},...history].slice(0,10);
    setHistory(next);
    localStorage.setItem("smart-campus-history",JSON.stringify(next));
  }
  function clearHistory(){setHistory([]);localStorage.removeItem("smart-campus-history");}
  function restore(item:Saved){setForm(item.input);setResult(item.result);window.scrollTo({top:0,behavior:"smooth"});}
  return <main className="shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-icon"><BrainCircuit size={22}/></span><span>Smart Campus <b>AI</b><small>ACADEMIC ASSISTANT</small></span></a>
      <div className="top-status"><span className="live-dot"/> Prototype UTS <span className="status-divider"/> <span>Web application</span></div>
    </header>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> SMART ACADEMIC ANALYTICS</div>
        <h1>Kenali kondisi akademik.<br/><em>Rencanakan langkah berikutnya.</em></h1>
        <p>Analisis kondisi perkuliahan dengan kombinasi Fuzzy Logic, Rule-Based System, Case-Based Reasoning, dan A* Planner.</p>
      </div>
      <div className="hero-mark"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-brain"><BrainCircuit size={58}/></div><span className="orbit-tag tag-a">FUZZY</span><span className="orbit-tag tag-b">CBR</span><span className="orbit-tag tag-c">A*</span></div>
    </section>
    <div className="metrics">
      <div className="metric"><span className="metric-icon purple"><Gauge size={18}/></span><div><small>METODE ANALISIS</small><b>4 Engine AI</b></div></div>
      <div className="metric"><span className="metric-icon blue"><Database size={18}/></span><div><small>BASIS KASUS AWAL</small><b>{initialCases.length} Kasus</b></div></div>
      <div className="metric"><span className="metric-icon green"><History size={18}/></span><div><small>RIWAYAT TERSIMPAN</small><b>{ready?history.length:0} Analisis</b></div></div>
    </div>
    <div className="workspace">
      <section className="panel input-panel">
        <div className="section-heading"><div><span className="step">01 / INPUT</span><h2>Profil akademik</h2><p>Masukkan kondisi akademik saat ini.</p></div><span className="heading-icon"><Activity size={19}/></span></div>
        <div className="form-grid">
          <label>IPK saat ini <span className="unit">0–4,00</span><input type="number" min="0" max="4" step=".01" value={form.ipk} onChange={e=>update("ipk",Number(e.target.value))}/></label>
          <label>Jumlah SKS <span className="unit">SKS</span><input type="number" min="1" max="30" value={form.sks} onChange={e=>update("sks",Number(e.target.value))}/></label>
          <label>Tugas aktif <span className="unit">Tugas</span><input type="number" min="0" max="30" value={form.activeTasks} onChange={e=>update("activeTasks",Number(e.target.value))}/></label>
          <label>Waktu belajar per hari <span className="unit">Jam</span><input type="number" min="0" max="16" step=".5" value={form.studyHours} onChange={e=>update("studyHours",Number(e.target.value))}/></label>
          <label className="full">Tingkat kesulitan mata kuliah<select value={form.difficulty} onChange={e=>update("difficulty",e.target.value as StudentInput["difficulty"])}><option>Mudah</option><option>Sedang</option><option>Sulit</option></select></label>
          <label>Kehadiran <span className="unit">Persen</span><input type="number" min="0" max="100" value={form.attendance} onChange={e=>update("attendance",Number(e.target.value))}/></label>
          <label>Hari menuju UTS <span className="unit">Hari</span><input type="number" min="1" max="365" value={form.daysToExam} onChange={e=>update("daysToExam",Number(e.target.value))}/></label>
        </div>
        {error&&<p className="error">{error}</p>}
        <div className="form-actions"><button className="secondary-btn" onClick={()=>{setForm(defaults);setError("");}}><RotateCcw size={15}/> Reset</button><button className="primary-btn" onClick={analyze}>Analisis kondisi <ChevronRight size={17}/></button></div>
        <div className="privacy-note"><span/> Data diproses di browser ini dan disimpan secara lokal.</div>
      </section>
      <section className="panel result-panel">
        <div className="section-heading"><div><span className="step">02 / HASIL ANALISIS</span><h2>Insight akademik</h2><p>Hasil dari empat komponen sistem cerdas.</p></div><span className="heading-icon"><Sparkles size={19}/></span></div>
        {!result?<div className="empty-state"><div className="empty-art"><BrainCircuit size={40}/></div><b>Belum ada hasil analisis</b><p>Lengkapi profil akademik, lalu jalankan analisis untuk melihat tingkat risiko dan rekomendasi.</p><span className="empty-hint"><Lightbulb size={14}/> Coba data contoh yang sudah terisi.</span></div>:
        <div className="results">
          <div className={`risk-card ${riskClass(result.risk)}`}><div><small>TINGKAT RISIKO AKADEMIK</small><h3>{result.risk}</h3><p>{result.risk==="Tinggi"?"Perlu perhatian dan tindak lanjut terencana.":result.risk==="Sedang"?"Pantau progres dan perbaiki konsistensi belajar.":"Kondisi relatif terkendali; pertahankan kebiasaan baik."}</p></div><div className="risk-symbol"><Gauge size={30}/></div></div>
          <div className="score-grid"><Score title="Beban akademik" value={result.loadScore} color="purple"/><Score title="Kesiapan belajar" value={result.readinessScore} color="blue"/></div>
          <div className="subsection"><h3><Lightbulb size={16}/> Rekomendasi sistem</h3><ul className="recommendations">{result.recommendations.map((r,i)=><li key={i}><CheckCircle2 size={16}/><span>{r}</span></li>)}</ul></div>
          <div className="subsection"><h3><Database size={16}/> Kasus paling mirip</h3><div className="case-match"><div><b>{result.nearestCase.item.id}</b><small>Kasus referensi · {result.nearestCase.item.risk}</small></div><div className="distance"><b>{result.nearestCase.distance.toFixed(3)}</b><small>Jarak Euclidean</small></div></div></div>
        </div>}
      </section>
    </div>
    {result&&<section className="panel lower-panel">
      <div className="section-heading"><div><span className="step">03 / PERENCANAAN</span><h2>Rencana aktivitas belajar</h2><p>A* Planner memilih aktivitas berdasarkan urgensi dan kapasitas waktu.</p></div><span className="heading-icon"><CalendarDays size={19}/></span></div>
      <div className="planner-summary"><div><small>TOTAL WAKTU</small><b>{result.totalHours} jam</b></div><div><small>SKOR URGENSI</small><b>{result.totalUrgency}</b></div><div><small>AKTIVITAS DIPILIH</small><b>{result.schedule.length}</b></div></div>
      <div className="schedule-list">{result.schedule.length?result.schedule.map((a,i)=><div className="schedule-row" key={a.id}><span className="activity-letter">{a.id}</span><div className="activity-name"><b>{a.name}</b><small>Hari ke-{a.day}</small></div><span className="activity-urgency">Urgensi {a.urgency}/5</span><span className="activity-time"><Clock3 size={14}/>{a.hours} jam</span></div>):<p className="muted">Belum ada aktivitas yang dapat dijadwalkan pada kapasitas yang tersedia.</p>}</div>
      {result.excluded.length>0&&<p className="excluded">Belum terpilih: {result.excluded.map(a=>a.name).join(", ")}.</p>}
      <div className="explain"><h3><BrainCircuit size={16}/> Mengapa sistem menghasilkan rekomendasi ini?</h3>{result.explanation.map((x,i)=><p key={i}><span>{String(i+1).padStart(2,"0")}</span>{x}</p>)}</div>
      <div className="rule-list"><h3>Aturan yang aktif</h3>{result.rules.map((r,i)=><p key={i}>{r}</p>)}</div>
    </section>}
    <section className="panel history-panel">
      <div className="section-heading"><div><span className="step">04 / AKTIVITAS</span><h2>Riwayat analisis</h2><p>Riwayat disimpan pada browser/perangkat ini.</p></div><button className="clear-btn" onClick={clearHistory} disabled={!history.length}><Trash2 size={14}/> Hapus riwayat</button></div>
      {!history.length?<p className="muted history-empty">Belum ada riwayat. Hasil analisis berikutnya akan muncul di sini.</p>:history.map((item,i)=><button className="history-row" key={item.result.createdAt+i} onClick={()=>restore(item)}><span className={`history-dot ${riskClass(item.result.risk)}`}/><span className="history-main"><b>Analisis {new Date(item.result.createdAt).toLocaleString("id-ID")}</b><small>IPK {item.input.ipk.toFixed(2)} · {item.input.activeTasks} tugas aktif · {item.input.daysToExam} hari menuju UTS</small></span><span className={`risk-pill ${riskClass(item.result.risk)}`}>{item.result.risk}</span><ChevronRight size={16}/></button>)}
    </section>
    <footer><span>SMART CAMPUS AI ASSISTANT</span><span>Prototype akademik · Bukan pengganti konsultasi dosen PA</span></footer>
  </main>;
}
function Score({title,value,color}:{title:string;value:number;color:string}){
  return <div className="score-card"><div className="score-top"><span>{title}</span><b>{value}<small>/100</small></b></div><div className="bar"><span className={color} style={{width:`${value}%`}}/></div><small className="score-caption">{value>=70?"Tinggi":value>=40?"Sedang":"Rendah"}</small></div>;
}
