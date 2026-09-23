window.QUOTES=[
{t:"Who's gonna carry the boats?",a:"David Goggins"},
{t:"Stay hard.",a:"David Goggins"},
{t:"You are in danger of living a life so comfortable and soft that you will die without ever realizing your potential.",a:"David Goggins"},
{t:"It's not about how hard you hit. It's about how hard you can get hit and keep moving forward.",a:"Rocky Balboa"},
{t:"Going in one more round when you don't think you can — that's what makes all the difference.",a:"Rocky Balboa"},
{t:"There is no tomorrow!",a:"Rocky III"},
{t:"Keep hammering.",a:"Cam Hanes"},
{t:"Nobody cares. Work harder.",a:"Cam Hanes"},
{t:"Discipline equals freedom.",a:"Jocko Willink"},
{t:"Get after it.",a:"Jocko Willink"},
{t:"The only easy day was yesterday.",a:"U.S. Navy SEALs"},
{t:"Pain is weakness leaving the body.",a:"U.S. Marines"},
{t:"I hated every minute of training, but I said, don't quit. Suffer now and live the rest of your life as a champion.",a:"Muhammad Ali"},
{t:"I've failed over and over and over again in my life. And that is why I succeed.",a:"Michael Jordan"},
{t:"Hard work beats talent when talent doesn't work hard.",a:"Tim Notke"},
{t:"Don't count the days. Make the days count.",a:"Muhammad Ali"},
{t:"Far better it is to dare mighty things.",a:"Theodore Roosevelt"},
{t:"American by birth. Ranger by choice.",a:"U.S. Army Rangers"},
{t:"Champions keep playing until they get it right.",a:"Billie Jean King"},
{t:"You miss 100% of the shots you don't take.",a:"Wayne Gretzky"}
];
window.quoteForDay=function(iso){
  var s=0,i=0;
  for(i=0;i<iso.length;i++) s+=iso.charCodeAt(i)*(i+1);
  return window.QUOTES[Math.abs(s)%window.QUOTES.length];
};
window.showDailyQuotePopup=function(iso){
  var q=window.quoteForDay&&window.quoteForDay(iso);
  if(!q)return;
  var key="overhaul-quote-seen-"+iso;
  try{if(localStorage.getItem(key))return;}catch(e){}
  var te=document.getElementById("quoteText");
  var ae=document.getElementById("quoteBy");
  var modal=document.getElementById("quoteModal");
  var btn=document.getElementById("quoteDismiss");
  if(!te||!ae||!modal||!btn)return;
  te.textContent="\u201C"+q.t+"\u201D";
  ae.textContent="\u2014 "+q.a;
  function dismiss(){
    modal.classList.add("hidden");
    try{localStorage.setItem(key,"1");}catch(e){}
  }
  btn.onclick=dismiss;
  modal.addEventListener("click",function(e){if(e.target===modal)dismiss();});
  modal.classList.remove("hidden");
};
