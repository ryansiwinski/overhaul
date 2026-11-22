(function(){
  const $ = id => document.getElementById(id);
  const KEY = "overhaul-checkin-v1";
  const F = ["ciAvg","ciChg","ciWaist","ciBarrys","ciSleep","ciLogged","ciPro","ciSteps","ciEnergy","ciHunger","ciWin","ciFix"];
  function iso(d){
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  }
  function load(){ try { return JSON.parse(localStorage.getItem(KEY)||"[]"); } catch(e){ return []; } }
  function save(rows){ localStorage.setItem(KEY, JSON.stringify(rows)); }
  function lastWeek(endISO){
    const end = new Date(endISO + "T00:00:00");
    const start = new Date(end); start.setDate(end.getDate() - 6);
    const s = iso(start);
    const daily = window.loadDaily ? window.loadDaily() : [];
    return daily.filter(r => r.date >= s && r.date <= endISO);
  }
  function avg(nums){ return nums.length ? nums.reduce((a,b)=>a+b,0) / nums.length : null; }
  function fill(){
    const date = $("ciDate").value || iso(new Date());
    const rows = lastWeek(date);
    const wts = rows.map(r=>parseFloat(r.wt)).filter(n=>!isNaN(n));
    const steps = rows.map(r=>parseFloat(r.steps)).filter(n=>!isNaN(n));
    const a = avg(wts);
    if (a != null) $("ciAvg").value = a.toFixed(1);
    const prev = load().filter(r=>r.date < date).sort((x,y)=>y.date.localeCompare(x.date))[0];
    if (a != null && prev && prev.ciAvg) $("ciChg").value = (a - parseFloat(prev.ciAvg)).toFixed(1);
    $("ciSleep").value = rows.filter(r=>parseFloat(r.sleep) >= 7).length;
    $("ciLogged").value = rows.filter(r=>r.mfp).length;
    $("ciPro").value = rows.filter(r=>parseFloat(r.pro) >= 200).length;
    const s = avg(steps);
    if (s != null) $("ciSteps").value = Math.round(s);
    $("ciMsg").textContent = "Filled from " + rows.length + " logged day(s). Add waist, Barry's, energy, hunger, win and fix.";
  }
  function render(){
    const rows = load().sort((a,b)=>b.date.localeCompare(a.date));
    if (!rows.length){ $("ciHist").innerHTML = '<p class="dim">No check-ins yet.</p>'; return; }
    $("ciHist").innerHTML = `<table class="hist"><tr><th>Date</th><th>Avg wt</th><th>Chg</th><th>Waist</th><th>Barry's</th><th>Win / fix</th></tr>` +
      rows.map(r=>`<tr><td>${r.date}</td><td>${r.ciAvg||"—"}</td><td>${r.ciChg||"—"}</td><td>${r.ciWaist||"—"}</td><td>${r.ciBarrys||"—"}/4</td><td>${r.ciWin||"—"} / ${r.ciFix||"—"}</td></tr>`).join("") + "</table>";
  }
  $("ciDate").value = iso(new Date());
  $("ciFill").addEventListener("click", fill);
  $("ciSave").addEventListener("click", ()=>{
    const row = { date: $("ciDate").value || iso(new Date()) };
    F.forEach(id => row[id] = $(id).value);
    save(load().filter(r=>r.date!==row.date).concat([row]));
    render();
    $("ciMsg").textContent = "Saved check-in " + row.date;
  });
  render();
})();
