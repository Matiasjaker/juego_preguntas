let game=null,timerInterval=null,advanceTimeout=null;
const MODE_NAMES={classic:"MODO CLÁSICO",timed:"CONTRARRELOJ",survival:"SUPERVIVENCIA",infinite:"MODO INFINITO",daily:"DESAFÍO DIARIO"};
function allQuestions(){return [...window.TRIVIA_QUESTIONS,...playerState.customQuestions]}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function startGame(mode,category=null){
 if(mode==="daily"&&playerState.dailyDone){showToast("Ya completaste el desafío de hoy. ¡Vuelve mañana!");return}
 let pool=allQuestions().filter(q=>!category||q.category===category);
 if(mode==="daily"){const today=new Date().toISOString().slice(0,10);if(playerState.dailyDate!==today){playerState.dailyDate=today;playerState.dailyDone=false}pool=allQuestions()}
 pool=shuffle(pool);
 const limit=mode==="classic"||mode==="daily"?10:mode==="timed"?999:mode==="survival"?999:999;
 game={mode,category,questions:pool.slice(0,limit),index:0,score:0,correct:0,answered:0,lives:3,timeLeft:60,locked:false,finished:false};
 if(!game.questions.length){showToast("No hay preguntas en esta categoría todavía.");return}
 showView("game");$("game-mode-label").textContent=MODE_NAMES[mode];renderQuestion();
 if(mode==="timed")startTimer();
}
function startTimer(){clearInterval(timerInterval);timerInterval=setInterval(()=>{if(!game||game.finished)return;game.timeLeft--;$("timer").textContent="⏱ "+game.timeLeft;if(game.timeLeft<=10)$("timer").classList.add("urgent");if(game.timeLeft<=0)finishGame()},1000)}
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
 $("timer").textContent=game.mode==="timed"?"⏱ "+game.timeLeft:"⏱ Sin límite";
 $("lives").textContent=game.mode==="survival"?"❤️".repeat(game.lives):"";
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
 else{button.classList.add("wrong");$("feedback").textContent="No era esa. La respuesta correcta es: "+q.correct;$("feedback").className="feedback bad";if(game.mode==="survival"){game.lives--;$("lives").textContent="❤️".repeat(game.lives)}}
 $("next-question").disabled=false;
 if(game.mode==="survival"&&game.lives<=0){$("next-question").textContent="Ver resultados";return}
 $("next-question").textContent=game.index===game.questions.length-1&&["classic","daily"].includes(game.mode)?"Ver resultados":"Siguiente pregunta →";
}
function nextQuestion(){if(!game||!game.locked)return;if(game.mode==="survival"&&game.lives<=0){finishGame();return}game.index++;if(["classic","daily"].includes(game.mode)&&game.index>=game.questions.length){finishGame();return}if(game.index>=game.questions.length&&["timed","survival","infinite"].includes(game.mode)){game.questions.push(...shuffle(allQuestions().filter(q=>!game.category||q.category===game.category)))}renderQuestion()}
function finishGame(){
 if(!game||game.finished)return;game.finished=true;stopTimers();
 const accuracy=game.answered?Math.round(game.correct/game.answered*100):0;
 const earned=awardProgress({score:game.score,correct:game.correct,answered:game.answered,mode:MODE_NAMES[game.mode]});
 if(game.mode==="daily"){playerState.dailyDone=true;saveState()}
 $("result-icon").textContent=accuracy>=80?"🏆":accuracy>=50?"⭐":"💪";
 $("result-title").textContent=accuracy>=80?"¡Excelente trabajo!":accuracy>=50?"¡Buen esfuerzo!":"¡Sigue practicando!";
 $("result-message").textContent=accuracy>=80?"Tienes un gran dominio. ¡Sigue así!":"Cada pregunta es una oportunidad para aprender algo nuevo.";
 $("result-score").textContent=game.score;$("result-correct").textContent=game.correct+" / "+game.answered;$("result-accuracy").textContent=accuracy+"%";$("result-xp").textContent="+"+earned.xp;
 $("new-achievements").textContent=earned.fresh.length?"🏅 Nuevo logro desbloqueado: "+earned.fresh.map(id=>ACHIEVEMENTS.find(a=>a.id===id)?.name).filter(Boolean).join(", "):"";
 showView("result");updateHeader();
}
