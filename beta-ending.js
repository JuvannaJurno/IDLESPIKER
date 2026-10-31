(function(){
'use strict';
if(window.AcademyPreview)return;
const seenKey='idle-spiker-beta-ending-v1';let timer=0,showing=false,errorUI=null;
const eligible=()=>window.LeagueRules?.config?.division===3&&window.LeagueSeason?.progress().prologueComplete;
function season(){try{return JSON.parse(localStorage.getItem('idle-spiker-league-v1')||'{}');}catch{return {};}}
function identity(){const s=season();return [3,s.run||1,s.startDay||1].join(':');}
function seen(){try{return localStorage.getItem(seenKey)===identity();}catch{return false;}}
function codeError(error){if(!errorUI){errorUI=GameUI.selection({id:'betaCodeError',title:'Test kodunu yeniden deneyelim',eyebrow:'BETA TESTİ',content:'<p id="betaCodeErrorText" role="status"></p><button type="button" class="team-action" id="betaCodeRetry">Kodu yeniden hazırla</button>'});errorUI.dialog.querySelector('footer span').textContent='Oyun kaydın bu cihazda korunur.';document.getElementById('betaCodeRetry').onclick=()=>{errorUI.close();openCode();};}document.getElementById('betaCodeErrorText').textContent=error.message||'Test kodu hazırlanamadı. Ayarlardaki Oyun testi bölümünden de tekrar deneyebilirsin.';errorUI.open();}
async function openCode(){try{await PlaytestRecorder.openCode();}catch(error){codeError(error);}}
function open(){if(!eligible())return false;if(showing)return true;if(!window.ClubGuide?.betaEnding)return false;clearTimeout(timer);timer=0;showing=true;document.getElementById('seasonEndDialog')?.close();document.getElementById('firstLeaguePromotion')?.close();ClubGuide.betaEnding(()=>{showing=false;try{localStorage.setItem(seenKey,identity());}catch{}void openCode();});return true;}
function schedule(){if(timer||showing||!eligible()||seen())return;timer=setTimeout(attempt,300);}
function attempt(){timer=0;if(showing||!eligible()||seen())return;if(document.hidden||document.getElementById('bootScreen')||window.PlayerProfile?.needsCreation||window.MatchGateway?.active?.()||window.BalTransition?.active||window.GuidedTutorial?.active||document.querySelector('dialog[open]')){schedule();return;}if(!season().completionSeen){LeagueSeason.showCompletion();schedule();return;}open();}
window.BetaEnding={open};
for(const type of ['spiker-league-result','spiker-stage-changed','visibilitychange'])addEventListener(type,schedule);
document.getElementById('seasonEndDialog')?.addEventListener('close',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
