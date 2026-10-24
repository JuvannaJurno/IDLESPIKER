(function(){'use strict';
const data=window.SpikerIconData;data.wifi={viewBox:'0 0 24 24',d:'M2 7Q12-1 22 7L20 9Q12 3 4 9ZM6 11Q12 6 18 11L16 13Q12 10 8 13ZM10 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0Z'};
function markup(name){const icon=data[name];return icon?'<svg class="spiker-icon" data-icon="'+name+'" viewBox="'+icon.viewBox+'" aria-hidden="true" focusable="false"><path fill="currentColor" d="'+icon.d+'"/></svg>':'';}
window.SpikerIcons={markup};
const blocks={warmup:'up',fast_internet:'wifi',crit_smash:'star',echo:'cycle',assistant:'person',steady:'cycle',meal:'basket',energy_drink:'flag',sugar_boost:'star',collect:'search',coordinate:'diamond',rhythm:'medal',bal_coach:'person',bal_plan:'archive',bal_position:'up',bal_video:'film',bal_recovery:'plus',bal_sponsor:'diamond',bal_shop:'cart',bal_fans:'team',bal_scout:'search',bal_personal:'edit',bal_archive:'archive',bal_search:'search',bal_contacts:'share',bal_talent:'star',pro_coach:'person',pro_repeat:'cycle',pro_analysis:'tools',pro_coordinator:'settings',pro_camp:'medal',pro_sponsor:'diamond',pro_shop:'cart',pro_tickets:'award',pro_search:'search',pro_negotiator:'share',pro_scout:'team','media-0':'film','media-1':'edit','media-2':'diamond'};
function blockIcon(node){const card=node.closest('[data-id],[data-block]'),id=card?.dataset.id||card?.dataset.block;if(id)return blocks[id];return node.closest('.unlock-room,.empty-room')?'plus':null;}
function achievementIcon(node){const id=node.closest('[data-achievement]')?.dataset.achievement||'';return id.startsWith('followers')?'team':id.startsWith('instructions')?'tap':id==='assistant'?'person':id==='upgrade'||id.startsWith('level-')?'up':id.startsWith('camp')?'medal':id==='transfer'?'share':id==='bal'||id==='prolog'?'flag':'trophy';}
const rules=[
 ['.mobile-nav a[href="#clubPanel"]>span','home'],['#teamTab>span','team'],['#calendarTab>span','league'],
 ['#settingsButton','settings'],['#achievementsButton,.achievement-notice-icon,.season-trophy','trophy'],['.achievement-icon',achievementIcon],
 ['#energyButton>.bolt',node=>document.getElementById('energyButton').dataset.matchReady==='true'?'play':'right'],['.profile-track-preview','play'],
 ['button.close-dialog,#closeSettings,#closeCamp,#closeProfile,#closeAchievements','close'],
 ['#previousMonth,#previousRound,.journey-back','left'],['#nextMonth,#nextRound','right'],
 ['.slot-icon',blockIcon],['.bonus-lock-icon','lock'],['.name-pencil','edit'],
 ['.journey-entry-mark','diamond'],['.journey-reward-art[data-kind="cash"]>b','basket'],['.journey-reward-art[data-kind="music"]>b','music'],
 ['.follower-heading>svg:not(.spiker-icon)','team'],['.foundation-toggle>b','right']
];
const selector=rules.map(rule=>rule[0]).join(',');
function applyNode(node){const rule=rules.find(([selector])=>node.matches(selector));if(!rule)return;const name=typeof rule[1]==='function'?rule[1](node):rule[1];if(!name)return;if(name==='close'&&node.textContent.trim().length>2)return;if(node.querySelector(':scope > .spiker-icon[data-icon="'+name+'"]'))return;if(node.tagName.toLowerCase()==='svg'){node.outerHTML=markup(name);return;}node.innerHTML=markup(name);node.classList.add('spiker-icon-host');}
function apply(root){if(!(root instanceof Element||root instanceof Document))return;if(root.matches?.(selector))applyNode(root);for(const node of root.querySelectorAll(selector))applyNode(node);}
apply(document);
// Process only new UI fragments and icon holders whose text has been refreshed.
const observer=new MutationObserver(records=>{const roots=new Set(),targets=new Set();for(const record of records){if(record.target instanceof Element&&record.target.matches(selector))targets.add(record.target);for(const node of record.addedNodes)if(node instanceof Element&&node.tagName.toLowerCase()!=='svg'&&node.tagName.toLowerCase()!=='path')roots.add(node);}for(const root of roots)if(root.isConnected)apply(root);for(const target of targets)if(target.isConnected)applyNode(target);});
observer.observe(document.body,{childList:true,subtree:true});
})();
