const PLAN = window.PLAN;
const $ = id => document.getElementById(id);
function todayISO(){
  const n = new Date();
  const m = String(n.getMonth()+1).padStart(2,"0");
  const d = String(n.getDate()).padStart(2,"0");
  return n.getFullYear() + "-" + m + "-" + d;
}
// Mon = 0 ... Sun = 6
const todayIdx = (new Date().getDay() + 6) % 7;

function renderWeek(){
  $("daily").textContent = PLAN.daily;
  $("weekbody").innerHTML = PLAN.days.map((day, i)=>{
    const on = i === todayIdx;
    const badge = on ? `<div class="kicker">TODAY</div>` : "";
    const style = on ? ` style="border-color:var(--accent)"` : "";
    const items = day.items.map(t=>`<div class="opt"><span class="plus">+</span> ${t}</div>`).join("");
    return `<div class="card day"${style}>${badge}<h3>${day.d} · ${day.t}</h3>${items}</div>`;
  }).join("");
  const el = $("weekbody").children[todayIdx];
  if (el) $("weekbody").prepend(el);
}
renderWeek();

if (window.showDailyQuotePopup) window.showDailyQuotePopup(todayISO());

const TABS = ["week","food","sleep","rules","track","checkin"];
$("tabs").addEventListener("click", e=>{
  if (e.target.tagName !== "BUTTON") return;
  document.querySelectorAll("#tabs button").forEach(b=>b.classList.remove("on"));
  e.target.classList.add("on");
  TABS.forEach(id=> $(id).classList.toggle("hidden", id !== e.target.dataset.tab));
});

const KEY = "overhaul-daily-v1";
function loadAll(){ try { return JSON.parse(localStorage.getItem(KEY)||"[]"); } catch(e){ return []; } }
function saveAll(rows){ localStorage.setItem(KEY, JSON.stringify(rows)); }
window.loadDaily = loadAll;
function fillForm(r){
  $("logDate").value = r?.date || todayISO();
  $("logWt").value = r?.wt || "";
  $("logPro").value = r?.pro || "";
  $("logSteps").value = r?.steps || "";
  $("logSleep").value = r?.sleep || "";
  $("cMfp").checked = !!r?.mfp;
  $("cTrained").checked = !!r?.trained;
}
function readForm(){
  return {
    date: $("logDate").value || todayISO(),
    wt: $("logWt").value, pro: $("logPro").value, steps: $("logSteps").value,
    sleep: $("logSleep").value, mfp: $("cMfp").checked, trained: $("cTrained").checked
  };
}
function renderHist(){
  const rows = loadAll().slice().sort((a,b)=> b.date.localeCompare(a.date)).slice(0, 28);
  if (!rows.length){ $("hist").innerHTML = '<p class="dim">Nothing saved yet.</p>'; return; }
  const yn = v => v ? "✓" : "—";
  $("hist").innerHTML = `<table class="hist"><tr><th>Date</th><th>Wt</th><th>Protein</th><th>Steps</th><th>Sleep</th><th>MFP</th><th>Trained</th></tr>` +
    rows.map(r=>`<tr><td>${r.date}</td><td>${r.wt||"—"}</td><td>${r.pro||"—"}</td><td>${r.steps||"—"}</td><td>${r.sleep||"—"}</td><td>${yn(r.mfp)}</td><td>${yn(r.trained)}</td></tr>`).join("") + "</table>";
}
fillForm(loadAll().find(r=>r.date===todayISO()));
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
