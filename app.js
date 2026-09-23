const WEEKS = window.WEEKS;
const weeksEl = document.getElementById("weeks");
const meta = document.getElementById("weekmeta");
const body = document.getElementById("weekbody");
const START = new Date(2026, 8, 21);
function locToday(){
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
function todayISO(){
  const n = locToday();
  const m = String(n.getMonth()+1).padStart(2,"0");
  const d = String(n.getDate()).padStart(2,"0");
  return n.getFullYear() + "-" + m + "-" + d;
}
function todayPos(){
  const diff = Math.round((locToday() - START) / 86400000);
  if (diff < 0) return {w:0, d:0};
  if (diff > 69) return {w:9, d:null};
  return {w: Math.floor(diff/7), d: diff % 7};
}
const pos = todayPos();
let cur = pos.w;
let dayIdx = pos.d;

WEEKS.forEach((w,i)=>{
  const b = document.createElement("button");
  b.className = "wkbtn" + (i===cur?" on":"");
  b.textContent = "W"+w.n;
  b.onclick = ()=>{
    document.querySelectorAll("#weeks .wkbtn").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    cur=i;
    dayIdx = (pos.w===i && pos.d!=null) ? pos.d : null;
    render();
  };
  weeksEl.appendChild(b);
});

function renderDay(d, showToday){
  const badge = showToday ? `<div class="kicker">TODAY</div>` : "";
  if (typeof d[1] === "string") {
    return `<div class="card day">${badge}<div class="kicker">${d[0]}</div><p>${d[1]||"—"}</p></div>`;
  }
  const rows = d[1].map(r=>`<tr><td>${r[0]}</td><td>${r[1]||""}</td><td>${r[2]||""}</td></tr>`).join("");
  return `<div class="card day">${badge}<h3>${d[0]}</h3><table><tr><th>Move</th><th>Work</th><th></th></tr>${rows}</table></div>`;
}

function render(){
  const w = WEEKS[cur];
  const isToday = (pos.w===cur && pos.d===dayIdx && dayIdx!=null);
  meta.textContent = w.dates + " · " + w.tag + (isToday ? " · TODAY" : " · " + w.note);
  if (dayIdx == null){
    body.innerHTML = `<div class="grid">` + w.days.map((d,i)=>{
      const preview = typeof d[1]==="string" ? d[1] : (d[1][0] ? d[1][0][0] : "");
      const on = (pos.w===cur && pos.d===i) ? " today" : "";
      return `<button class="daypick${on}" data-i="${i}"><div class="kicker">${on?"Today":"Open"}</div><strong>${d[0]}</strong><p class="dim">${preview}</p></button>`;
    }).join("") + `</div>`;
    body.querySelectorAll(".daypick").forEach(b=> b.onclick = ()=>{ dayIdx = +b.dataset.i; render(); });
    return;
  }
  const d = w.days[dayIdx];
  body.innerHTML = `<div class="daybar"><button class="wkbtn" id="backWeek">← Week ${w.n}</button>
    <button class="wkbtn" id="prevDay">Prev</button><button class="wkbtn" id="nextDay">Next</button></div>` + renderDay(d, pos.w===cur && pos.d===dayIdx);
  document.getElementById("backWeek").onclick = ()=>{ dayIdx=null; render(); };
  document.getElementById("prevDay").onclick = ()=>{ dayIdx = (dayIdx - 1 + w.days.length) % w.days.length; render(); };
  document.getElementById("nextDay").onclick = ()=>{ dayIdx = (dayIdx + 1) % w.days.length; render(); };
}
render();

(function paintQuote(){
  const q = window.quoteForDay && window.quoteForDay(todayISO());
  if (!q) return;
  const te = document.getElementById("quoteText");
  const ae = document.getElementById("quoteBy");
  if (te) te.textContent = "\u201C" + q.t + "\u201D";
  if (ae) ae.textContent = "\u2014 " + q.a;
})();

document.getElementById("tabs").addEventListener("click", e=>{
  if (e.target.tagName !== "BUTTON") return;
  document.querySelectorAll("#tabs button").forEach(b=>b.classList.remove("on"));
  e.target.classList.add("on");
  ["week","food","cardio","abs","sleep","log"].forEach(id=>{
    document.getElementById(id).classList.toggle("hidden", id !== e.target.dataset.tab);
  });
});

const KEY = "overhaul-log-v1";
const $ = id => document.getElementById(id);
function loadAll(){ try { return JSON.parse(localStorage.getItem(KEY)||"[]"); } catch(e){ return []; } }
function saveAll(rows){ localStorage.setItem(KEY, JSON.stringify(rows)); }
function fillForm(row){
  $("logDate").value = row?.date || todayISO();
  $("logWt").value = row?.wt || "";
  $("logWaist").value = row?.waist || "";
  $("cBench").checked = !!row?.bench;
  $("cSquat").checked = !!row?.squat;
  $("cDl").checked = !!row?.dl;
  $("cKb").checked = !!row?.kb;
  $("cWalk").checked = !!row?.walk;
  $("cRun").checked = !!row?.run;
  $("cSleep").checked = !!row?.sleep;
  $("topBench").value = row?.topBench || "";
  $("topSquat").value = row?.topSquat || "";
  $("topDl").value = row?.topDl || "";
  $("logNote").value = row?.note || "";
}
function readForm(){
  return {
    date: $("logDate").value || todayISO(),
    wt: $("logWt").value, waist: $("logWaist").value,
    bench: $("cBench").checked, squat: $("cSquat").checked, dl: $("cDl").checked,
    kb: $("cKb").checked, walk: $("cWalk").checked, run: $("cRun").checked, sleep: $("cSleep").checked,
    topBench: $("topBench").value, topSquat: $("topSquat").value, topDl: $("topDl").value,
    note: $("logNote").value
  };
}
function renderHist(){
  const rows = loadAll().slice().sort((a,b)=> b.date.localeCompare(a.date));
  if (!rows.length){ $("hist").innerHTML = '<p class="dim">Nothing saved yet.</p>'; return; }
  const marks = r => [r.bench&&"B",r.squat&&"S",r.dl&&"D",r.kb&&"K",r.walk&&"W",r.run&&"R",r.sleep&&"Z"].filter(Boolean).join(" ");
  $("hist").innerHTML = `<table class="hist"><tr><th>Date</th><th>Wt</th><th>Waist</th><th>Done</th><th>Top sets</th></tr>` +
    rows.map(r=>`<tr><td>${r.date}</td><td>${r.wt||"—"}</td><td>${r.waist||"—"}</td><td>${marks(r)||"—"}</td>
    <td>${[r.topBench&&("B "+r.topBench),r.topSquat&&("S "+r.topSquat),r.topDl&&("D "+r.topDl)].filter(Boolean).join(" · ")||"—"}</td></tr>`).join("") + "</table>";
}
$("logDate").value = todayISO();
$("logDate").addEventListener("change", ()=>{
  const hit = loadAll().find(r=>r.date===$("logDate").value);
  fillForm(hit || { date: $("logDate").value });
});
$("saveLog").addEventListener("click", ()=>{
  const row = readForm();
  const all = loadAll().filter(r=>r.date!==row.date);
  all.push(row);
  saveAll(all);
  renderHist();
  $("logMsg").textContent = "Saved " + row.date;
});
renderHist();

let clockOn = false, clockMode = "up", clockLeft = 0, clockStart = 0, clockAcc = 0, clockIv = null;
function fmt(ms){
  const s = Math.max(0, Math.floor(ms/1000));
  return Math.floor(s/60) + ":" + String(s%60).padStart(2,"0");
}
function clockPaint(){
  if (clockMode === "up") $("clock").textContent = fmt(clockAcc + (clockOn ? Date.now()-clockStart : 0));
  else $("clock").textContent = fmt(clockLeft - (clockOn ? Date.now()-clockStart : 0));
}
function clockTick(){
  if (clockMode !== "up") {
    const left = clockLeft - (Date.now()-clockStart);
    if (left <= 0){
      clockOn = false; clockLeft = 0; clearInterval(clockIv); clockIv = null;
      $("clockGo").textContent = "Start";
      $("clock").textContent = "0:00";
      try { navigator.vibrate(200); } catch(e){}
      return;
    }
  }
  clockPaint();
}
function clockSetMode(sec){
  clockOn = false; clearInterval(clockIv); clockIv = null;
  $("clockGo").textContent = "Start";
  if (!sec){ clockMode = "up"; clockAcc = 0; $("clockMode").textContent = "Stopwatch"; $("clock").textContent = "0:00"; }
  else { clockMode = "dn"; clockLeft = sec*1000; $("clockMode").textContent = "Down · "+sec+"s"; $("clock").textContent = fmt(clockLeft); }
}
$("clockGo").onclick = ()=>{
  if (clockOn){
    if (clockMode==="up") clockAcc += Date.now()-clockStart;
    else clockLeft = Math.max(0, clockLeft - (Date.now()-clockStart));
    clockOn = false; clearInterval(clockIv); clockIv = null;
    $("clockGo").textContent = "Start";
    clockPaint();
    return;
  }
  clockStart = Date.now(); clockOn = true;
  $("clockGo").textContent = "Pause";
  clockIv = setInterval(clockTick, 200);
};
$("clockReset").onclick = ()=> clockSetMode(clockMode==="up" ? 0 : Math.round(clockLeft/1000) || 40);
document.querySelectorAll("[data-cd]").forEach(b=>{
  b.onclick = ()=> clockSetMode(+b.dataset.cd);
});
