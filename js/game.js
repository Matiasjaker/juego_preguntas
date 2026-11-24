let game=null,timerInterval=null,advanceTimeout=null;
const MODE_NAMES={classic:"MODO CLÁSICO",timed:"CONTRARRELOJ",survival:"SUPERVIVENCIA",infinite:"MODO INFINITO",daily:"DESAFÍO DIARIO"};
function allQuestions(){return [...window.TRIVIA_QUESTIONS,...playerState.customQuestions]}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function drawQuestions(category,limit){
 const pool=allQuestions().filter(q=>!category||q.category===category);
 const recent=[...(playerState.recent||[])];
 const recentSet=new Set(recent);
 const rank=new Map(recent.map((id,i)=>[id,i]));
 const fresh=pool.filter(q=>!recentSet.has(q.id));
 const seen=pool.filter(q=>recentSet.has(q.id)).sort((a,b)=>rank.get(a.id)-rank.get(b.id));
 return [...shuffle(fresh),...seen].slice(0,limit);
}
function rememberQuestions(ids){const used=new Set(ids);const keep=(playerState.recent||[]).filter(id=>!used.has(id));playerState.recent=[...keep,...used].slice(-300);saveState()}
function startGame(mode,category=null){
 if(mode==="daily"&&playerState.dailyDone){showToast("Ya completaste el desafío de hoy. ¡Vuelve mañana!");return}
 if(mode==="daily"){const today=new Date().toISOString().slice(0,10);if(playerState.dailyDate!==today){playerState.dailyDate=today;playerState.dailyDone=false}}
 const limit=mode==="classic"||mode==="daily"?10:999;
 const pool=drawQuestions(mode==="daily"?null:category,limit);
 game={mode,category,questions:pool,index:0,score:0,correct:0,answered:0,lives:3,timeLeft:60,locked:false,finished:false};
 if(!game.questions.length){showToast("No hay preguntas en esta categoría todavía.");return}
 rememberQuestions(pool.map(q=>q.id));
 showView("game");$("game-mode-label").textContent=MODE_NAMES[mode];renderQuestion();
 if(mode==="timed")startTimer();
}
function startTimer(){clearInterval(timerInterval);timerInterval=setInterval(()=>{if(!game||game.finished)return;game.timeLeft--;$("timer").innerHTML=icon("stopwatch")+" <b>"+game.timeLeft+"</b>";if(game.timeLeft<=10)$("timer").classList.add("urgent");if(game.timeLeft<=0)finishGame()},1000)}
function stopTimers(){clearInterval(timerInterval);clearTimeout(advanceTimeout);$("timer").classList.remove("urgent")}
function renderQuestion(){
 if(!game||game.finished)return;
 if(game.index>=game.questions.length){finishGame();return}
 const q=game.questions[game.index];game.locked=false;
 $("game-counter").textContent=game.mode==="timed"||game.mode==="infinite"||game.mode==="survival"?`${game.index+1} respondidas`:`${game.index+1} / ${game.questions.length}`;
 $("game-progress-bar").style.width=(game.mode==="classic"||game.mode==="daily"?game.index/game.questions.length*100:Math.min(95,game.index*5))+"%";
 $("question-number").textContent="PREGUNTA "+String(game.index+1).padStart(2,"0");
 $("question-category").textContent=window.TRIVIA_CATEGORIES.find(c=>c.id===q.category)?.name||"Personalizada";
 $("question-text").textContent=q.question;
 $("timer").innerHTML=game.mode==="timed"?icon("stopwatch")+" <b>"+game.timeLeft+"</b>":icon("stopwatch")+" Sin límite";
 $("lives").innerHTML=game.mode==="survival"?icon("heart").repeat(game.lives):"";
 $("feedback").textContent="";$("feedback").className="feedback";$("next-question").disabled=true;
 const answers=shuffle(q.options);
 $("answers").innerHTML="";
 answers.forEach((answer,i)=>{const b=document.createElement("button");b.className="answer-btn";b.innerHTML=`<span class="answer-letter">${String.fromCharCode(65+i)}</span>`;b.append(document.createTextNode(answer));b.addEventListener("click",()=>chooseAnswer(answer,b));$("answers").append(b)});
}
function chooseAnswer(answer,button){
 if(!game||game.locked)return;game.locked=true;game.answered++;
 const q=game.questions[game.index],correct=answer===q.correct;
 document.querySelectorAll(".answer-btn").forEach(b=>{b.disabled=true;if(b.textContent.trim().slice(1).trim()===q.correct)b.classList.add("correct")});
 if(correct){game.correct++;game.score+=game.mode==="timed"?150:100;$("feedback").textContent="¡Correcto! +"+(game.mode==="timed"?150:100)+" puntos";$("feedback").className="feedback good"}
 else{button.classList.add("wrong");$("feedback").textContent="No era esa. La respuesta correcta es: "+q.correct;$("feedback").className="feedback bad";if(game.mode==="survival"){game.lives--;$("lives").innerHTML=icon("heart").repeat(game.lives)}}
 $("next-question").disabled=false;
 if(game.mode==="survival"&&game.lives<=0){$("next-question").textContent="Ver resultados";return}
 $("next-question").textContent=game.index===game.questions.length-1&&["classic","daily"].includes(game.mode)?"Ver resultados":"Siguiente pregunta →";
}
function nextQuestion(){if(!game||!game.locked)return;if(game.mode==="survival"&&game.lives<=0){finishGame();return}game.index++;if(["classic","daily"].includes(game.mode)&&game.index>=game.questions.length){finishGame();return}if(game.index>=game.questions.length&&["timed","survival","infinite"].includes(game.mode)){const used=new Set(game.questions.map(q=>q.id));let extra=drawQuestions(game.category,999).filter(q=>!used.has(q.id));if(!extra.length)extra=drawQuestions(game.category,999);game.questions.push(...extra);rememberQuestions(extra.map(q=>q.id))}renderQuestion()}
function finishGame(){
 if(!game||game.finished)return;game.finished=true;stopTimers();
 const accuracy=game.answered?Math.round(game.correct/game.answered*100):0;
 const earned=awardProgress({score:game.score,correct:game.correct,answered:game.answered,mode:MODE_NAMES[game.mode]});
 if(game.mode==="daily"){playerState.dailyDone=true;saveState()}
 $("result-icon").innerHTML=accuracy>=80?icon("trophy","icon-xl"):accuracy>=50?icon("star","icon-xl"):icon("medal","icon-xl");
 $("result-title").textContent=accuracy>=80?"¡Excelente trabajo!":accuracy>=50?"¡Buen esfuerzo!":"¡Sigue practicando!";
 $("result-message").textContent=accuracy>=80?"Tienes un gran dominio. ¡Sigue así!":"Cada pregunta es una oportunidad para aprender algo nuevo.";
 $("result-score").textContent=game.score;$("result-correct").textContent=game.correct+" / "+game.answered;$("result-accuracy").textContent=accuracy+"%";$("result-xp").textContent="+"+earned.xp;
 $("new-achievements").textContent=earned.fresh.length?"🏅 Nuevo logro desbloqueado: "+earned.fresh.map(id=>ACHIEVEMENTS.find(a=>a.id===id)?.name).filter(Boolean).join(", "):"";
 showView("result");updateHeader();
}
