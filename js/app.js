const $=id=>document.getElementById(id);
const ACHIEVEMENTS=[
 {id:"first",name:"Primera partida",desc:"Completa tu primera partida.",icon:"🎮"},
 {id:"five",name:"En racha",desc:"Completa 5 partidas.",icon:"🔥"},
 {id:"ten",name:"Constancia",desc:"Completa 10 partidas.",icon:"🏅"},
 {id:"perfect",name:"¡Perfecto!",desc:"Termina una partida sin errores.",icon:"💎"},
 {id:"hundred",name:"Mente brillante",desc:"Acumula 100 respuestas correctas.",icon:"🧠"},
 {id:"rich",name:"Pequeño ahorrador",desc:"Acumula 100 monedas.",icon:"🪙"}
];
let toastTimer;
function showToast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
function showView(name){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));$(name+"-view").classList.add("active");document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===name));if(name==="progress")renderProgress();window.scrollTo({top:0,behavior:"smooth"})}
function updateHeader(){$("header-coins").textContent=playerState.coins;$("header-level").textContent=playerLevel()}
function renderCategories(target){
 const el=$(target);el.innerHTML="";
 TRIVIA_CATEGORIES.forEach(c=>{const count=allQuestions().filter(q=>q.category===c.id).length;const b=document.createElement("button");b.className="category-card";b.innerHTML=`<span class="category-icon">${c.icon}</span><span><strong>${c.name}</strong><small>${count} preguntas · ${c.description}</small></span><span class="cat-arrow">→</span>`;b.addEventListener("click",()=>startGame("classic",c.id));el.append(b)})
}
function renderProgress(){
 const level=playerLevel(),xp=xpIntoLevel(),accuracy=playerState.answered?Math.round(playerState.correct/playerState.answered*100):0;
 $("level-label").textContent=`Nivel ${level} · ${level===1?"Principiante":level<5?"Aprendiz":level<10?"Experto":"Maestro"}`;$("big-level").textContent=level;$("xp-bar").style.width=xp+"%";$("xp-label").textContent=`${xp} / 100 XP para el siguiente nivel`;
 $("stat-xp").textContent=playerState.xp;$("stat-coins").textContent=playerState.coins;$("stat-games").textContent=playerState.games;$("stat-accuracy").textContent=accuracy+"%";$("achievement-count").textContent=playerState.unlocked.length+" desbloqueados";
 $("achievements").innerHTML=ACHIEVEMENTS.map(a=>`<div class="achievement ${playerState.unlocked.includes(a.id)?"":"locked"}"><span class="achievement-icon">${a.icon}</span><span><strong>${a.name}</strong><small>${a.desc}</small></span>${playerState.unlocked.includes(a.id)?"<span>✓</span>":""}</div>`).join("");
 $("history").innerHTML=playerState.history.length?playerState.history.map(h=>`<div class="history-item"><span>${h.mode}<small>${h.date} · ${h.correct}/${h.answered} correctas</small></span><span class="history-score">${h.score} pts</span></div>`).join(""):'<p class="muted">Todavía no tienes partidas. ¡Anímate a jugar!</p>';
}
function initEditor(){
 $("new-category").innerHTML=TRIVIA_CATEGORIES.map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
 $("question-form").addEventListener("submit",e=>{e.preventDefault();const wrong=[...document.querySelectorAll(".wrong-answer")].map(x=>x.value.trim());playerState.customQuestions.push({id:"custom"+Date.now(),question:$("new-question").value.trim(),correct:$("new-correct").value.trim(),options:[$("new-correct").value.trim(),...wrong],category:$("new-category").value,difficulty:"normal"});saveState();e.target.reset();renderCategories("explore-categories");renderCategories("home-categories");showToast("¡Pregunta guardada correctamente!");showView("explore")});
}
document.addEventListener("click",e=>{
 const view=e.target.closest("[data-view]");if(view)showView(view.dataset.view);
 const mode=e.target.closest("[data-mode]");if(mode)startGame(mode.dataset.mode);
});
document.querySelector("[data-home]").addEventListener("click",e=>{e.preventDefault();showView("home")});
$("quick-play").addEventListener("click",()=>startGame("classic"));
$("next-question").addEventListener("click",nextQuestion);
$("quit-game").addEventListener("click",()=>{if(confirm("¿Seguro que quieres salir? Esta partida no se guardará.")){stopTimers();game=null;showView("home")}});
$("play-again").addEventListener("click",()=>startGame(game?.mode||"classic",game?.category||null));
$("open-editor").addEventListener("click",()=>showView("editor"));
$("reset-progress").addEventListener("click",()=>{if(confirm("¿Quieres borrar todos tus puntos, monedas, logros e historial? Esta acción no se puede deshacer.")){localStorage.removeItem(STORAGE_KEY);playerState=loadState();updateHeader();renderProgress();showToast("Progreso reiniciado.")}});
renderCategories("home-categories");renderCategories("explore-categories");initEditor();updateHeader();
