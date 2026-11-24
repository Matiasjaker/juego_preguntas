const STORAGE_KEY="triviaMasterSave_v1";
const DEFAULT_STATE={xp:0,coins:0,games:0,correct:0,answered:0,bestScore:0,history:[],unlocked:[],dailyDate:"",dailyDone:false,customQuestions:[],recent:[]};
function loadState(){try{return {...DEFAULT_STATE,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")}}catch{return {...DEFAULT_STATE}}}
let playerState=loadState();
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(playerState))}
function playerLevel(){return Math.floor(playerState.xp/100)+1}
function xpIntoLevel(){return playerState.xp%100}
function awardProgress(result){
 playerState.games++;playerState.correct+=result.correct;playerState.answered+=result.answered;
 const xp=Math.max(5,result.score>0?Math.round(result.score/10)+result.correct*2:5);
 const coins=Math.max(1,Math.floor(result.score/100)+Math.floor(result.correct/2));
 playerState.xp+=xp;playerState.coins+=coins;playerState.bestScore=Math.max(playerState.bestScore,result.score);
 playerState.history.unshift({date:new Date().toLocaleDateString("es-CL"),mode:result.mode,score:result.score,correct:result.correct,answered:result.answered});
 playerState.history=playerState.history.slice(0,8);
 const fresh=[];
 const checks=[
  ["first","Primera partida","Completa tu primera partida.","🎮",playerState.games>=1],
  ["five","En racha","Completa 5 partidas.","🔥",playerState.games>=5],
  ["ten","Constancia","Completa 10 partidas.","🏅",playerState.games>=10],
  ["perfect","¡Perfecto!","Responde correctamente todas las preguntas de una partida.","💎",result.answered>0&&result.correct===result.answered],
  ["hundred","Mente brillante","Acumula 100 respuestas correctas.","🧠",playerState.correct>=100],
  ["rich","Pequeño ahorrador","Acumula 100 monedas.","🪙",playerState.coins>=100]
 ];
 checks.forEach(a=>{if(a[4]&&!playerState.unlocked.includes(a[0])){playerState.unlocked.push(a[0]);fresh.push(a[0])}});
 saveState();return {xp,coins,fresh};
}
