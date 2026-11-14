import {CHARACTERS, TRAITS, EQUIPMENT} from './data.js?v=3.0.0';

const characterMap = new Map(CHARACTERS.map(c => [c.id, c]));
const equipmentMap = new Map(EQUIPMENT.map(e => [e.id, e]));
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const characterSpeeds = {'1001':101,'1002':112,'1003':96,'1004':102,'1005':104,'1006':107,'1008':102,'1009':110,'1013':100,'1101':108,'1102':122,'1103':104,'1104':92,'1105':99,'1106':105,'1107':90,'1108':108,'1109':101,'1201':98,'1202':112,'1204':99,'1205':103,'1203':106,'1208':100};

export function getBattleSynergies(state) {
  const unique = new Set(state.units.filter(u => u.zone !== 'bench').map(u => u.characterId));
  const counts = {};
  for (const id of unique) for (const t of characterMap.get(id)?.traits || []) counts[t] = (counts[t] || 0) + 1;
  return TRAITS.filter(t => counts[t.id]).map(t => ({...t, count:counts[t.id], level:t.thresholds.filter(n => counts[t.id] >= n).length, active:counts[t.id] >= t.thresholds[0], next:t.thresholds.find(n => n > counts[t.id]) ?? null})).sort((a,b) => Number(b.active)-Number(a.active) || b.count-a.count);
}

export function getBattleStats(state, unit) {
  const c = characterMap.get(unit.characterId);
  if (!c) return {attack:0,hp:0,speed:100,crit:0,breakBonus:0};
  const factor = [0,1,1.85,3.5][unit.star];
  let attack = c.attack * factor, hp = c.hp * factor, speed = characterSpeeds[c.id] || 100;
  let attackBonus=0,hpBonus=0,crit=.08,breakBonus=0;
  for (const id of unit.items) {const e=equipmentMap.get(id);attack+=e?.attack||0;hp+=e?.hp||0;speed+=e?.speed||0;if(id==='star')crit+=.1;if(id==='comet')crit+=.25;if(id==='drill')breakBonus+=.3;}
  for (const t of getBattleSynergies(state)) {
    if (!t.active) continue;
    const i=t.level-1;
    if(t.id==='express') attackBonus += [.08,.18][i];
    if(t.id==='station') speed += [8,16][i];
    if(t.id==='belobog') hpBonus += [.10,.20,.32][i];
    if(t.id==='hunters') attackBonus += [.12,.24][i];
    if(t.id==='luofu') speed += [6,14,24][i];
    if(t.id==='wildfire') hpBonus += [.12,.24][i];
    if(t.id==='shield') hpBonus += [.14,.28][i];
    if(t.id==='strike') attackBonus += [.10,.22][i];
    if(t.id==='follow') speed += [10,22][i];
    if(t.id==='support') {attackBonus += [.06,.14][i];hpBonus += [.06,.14][i];}
    if(t.id==='dot') attackBonus += [.12,.26][i];
    if(t.id==='heal') hpBonus += .18;
  }
  if(state.strategies.includes('vanguard')&&unit.zone==='front')attackBonus+=.22;
  if(state.strategies.includes('recovery'))attackBonus+=.08;
  if(state.strategies.includes('momentum'))attackBonus+=.10;
  if(state.strategies.includes('fortress'))hpBonus+=.25;
  return {attack:Math.round(attack*(1+attackBonus)),hp:Math.round(hp*(1+hpBonus)),speed:Math.round(speed),crit:Math.min(.8,crit),breakBonus};
}

const enemyStages = [
  ['裂界巡逻队', [['虚卒·掠夺者','raider',680,72,102,['冰','风']],['虚卒·篡改者','caster',600,65,98,['火','雷']],['虚卒·掠夺者','raider',680,72,102,['冰','风']]]],
  ['虚卒突袭小队',[['虚卒·掠夺者','raider',550,82,102,['冰','风']],['虚卒·篡改者','caster',480,73,98,['火','量子']],['虚卒·践踏者','guard',680,85,90,['物理','虚数']]]],
  ['永冬军团',[['永冬灾影','guard',800,94,92,['火','风']],['霜晶造物','caster',570,78,105,['火','雷']],['永冬灾影','raider',720,96,98,['物理','量子']]]],
  ['金人司阍',[['金人司阍','aurumaton',2200,135,96,['雷','风','量子']],['灯昼龙鱼','caster',580,77,103,['物理','雷']],['灯昼龙鱼','caster',580,77,103,['冰','虚数']]]],
  ['丰饶孽物',[['魔阴身士卒','guard',1000,118,94,['火','冰']],['药王秘传炼形者','medic',810,103,102,['风','虚数']],['丰饶灵兽','raider',930,124,108,['雷','量子']]]],
  ['银鬃铁卫精锐',[['银鬃尉官','guard',1350,139,91,['物理','冰']],['银鬃炮手','caster',970,112,102,['火','虚数']],['银鬃射手','raider',1060,135,107,['风','量子']]]],
  ['反物质军团',[['虚卒·践踏者','guard',1400,150,94,['物理','风']],['虚卒·掠夺者','raider',1120,152,111,['冰','雷']],['虚卒·篡改者','caster',1010,128,105,['火','量子']],['反重子','raider',650,101,113,['虚数','冰']]]],
  ['史瓦罗',[['史瓦罗','svarog',3400,190,99,['火','雷','风']],['自动机兵·战犬','raider',950,128,112,['物理','雷']],['自动机兵·蜘蛛','caster',820,114,107,['冰','量子']]]],
  ['药王秘传',[['药王秘传炼形者','medic',1400,145,105,['风','冰']],['魔阴身士卒','guard',1800,175,93,['火','量子']],['丰饶灵兽','raider',1450,184,114,['雷','虚数']],['药王秘传内丹士','caster',1250,151,108,['物理','冰']]]],
  ['虚卒·践踏者',[['虚卒·践踏者','guard',2200,205,96,['物理','风']],['灾虐的右手','raider',1700,197,110,['火','雷']],['黎明的左手','caster',1550,165,106,['冰','量子']]]],
  ['末日军团',[['反物质军团统领','guard',2400,218,97,['物理','虚数']],['虚卒·歼灭者','raider',1800,221,114,['风','冰']],['虚卒·篡改者','caster',1650,188,110,['雷','量子']],['反重子','raider',1050,151,116,['火','冰']]]],
  ['末日兽',[['末日兽','doomsday',5400,265,102,['火','冰','风','雷','量子','虚数','物理']],['灾虐的右手','raider',1650,180,107,['火','雷']],['黎明的左手','caster',1450,155,103,['冰','量子']]]],
];

export function getEnemyLineup(round) {
  const index=clamp(round-1,0,11), [stage,rows]=enemyStages[index];
  return rows.map(([name,archetype,maxHp,attack,speed,weaknesses],i)=>({id:`enemy-${i}`,name,stage,side:'enemy',zone:'front',archetype,maxHp,hp:maxHp,attack,speed,weaknesses,shield:0,energy:20,toughness:['aurumaton','svarog','doomsday'].includes(archetype)?150:60,maxToughness:['aurumaton','svarog','doomsday'].includes(archetype)?150:60,statuses:[],boss:['aurumaton','svarog','doomsday'].includes(archetype)}));
}

// Pure, seeded simulation. Only the returned replay is persisted; original save units never lose HP.
export function simulateCombat(state, options={}) {
  let rng=((state.seed>>>0)^Math.imul(state.round,2654435761))>>>0 || 1;
  const random=()=>{rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;rng>>>=0;return rng/4294967296;};
  const synergies=getBattleSynergies(state), trait=id=>synergies.find(t=>t.id===id)?.level||0;
  const strategy=id=>state.strategies.includes(id);
  const allies=state.units.filter(u=>u.zone!=='bench').map(u=>{
    const c=characterMap.get(u.characterId), s=getBattleStats(state,u);
    return {id:u.uid,characterId:c.id,name:c.name,side:'ally',zone:u.zone,maxHp:s.hp,hp:s.hp,attack:s.attack,speed:s.speed,crit:s.crit,breakBonus:s.breakBonus,element:c.element,role:c.role,items:[...u.items],star:u.star,shield:0,energy:20,toughness:0,maxToughness:0,statuses:[],weaknesses:[],archetype:'character'};
  });
  const enemies=clone(options.enemyLineup||getEnemyLineup(state.round)).map((e,i)=>({shield:0,energy:20,toughness:60,maxToughness:60,statuses:[],weaknesses:[],zone:'front',...e,id:e.id||`enemy-${i}`,side:'enemy',maxHp:e.maxHp||e.hp,hp:e.hp??e.maxHp,crit:.04,items:[],element:'物理',archetype:e.archetype||'raider'}));
  const units=[...allies,...enemies];
  for(const u of units){u.next=10000/u.speed;u.acted=0;u.counters=0;u.charges=0;u.autoHeal=0;u.revives=0;u.seeleReset=false;u.hertaTriggered=new Set();u.jingStacks=3;u.field=0;u.damage=0;u.healing=0;u.shielding=0;u.kills=0;}
  let time=0, turn=0, allySp=3, enemySp=5, context=null, reactions=[], winner=null;
  const events=[];
  const alive=side=>units.filter(u=>u.side===side&&u.hp>0);
  const front=side=>alive(side).filter(u=>u.zone==='front');
  const opponents=u=>u.side==='ally'?'enemy':'ally';
  const status=(u,type)=>u?.statuses?.find(s=>s.type===type);
  const item=(u,id)=>u.items.includes(id);
  const livingTarget=(u)=>{const list=front(opponents(u));if(!list.length)return null;const taunted=list.filter(t=>status(t,'taunt'));return (taunted.length?taunted:list)[Math.floor(random()*(taunted.length||list.length))];};
  const lowAlly=u=>front(u.side).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0]||alive(u.side)[0];
  const strongest=u=>front(u.side).filter(a=>a.id!==u.id).sort((a,b)=>b.attack-a.attack)[0]||front(u.side)[0]||u;
  const damageTargets=u=>front(opponents(u));
  const snapshot=()=>units.map(u=>({id:u.id,name:u.name,side:u.side,characterId:u.characterId,zone:u.zone,maxHp:u.maxHp,hp:Math.round(u.hp),shield:Math.round(u.shield),energy:Math.round(u.energy),speed:Math.round(effectiveSpeed(u)),attack:Math.round(effectiveAttack(u)),toughness:u.toughness,maxToughness:u.maxToughness,weaknesses:[...u.weaknesses],statuses:u.statuses.map(s=>({type:s.type,label:s.label,stacks:s.stacks||1,turns:s.turns})),nextAction:Math.round(Math.max(0,u.next-time))}));
  function effectiveAttack(u){return u.attack*(1+(status(u,'attackUp')?.value||0));}
  function effectiveSpeed(u){return Math.max(35,u.speed*(1+(status(u,'haste')?.value||0)-(status(u,'slow')?.value||0)));}
  function addStatus(u,type,label,value,turns=2,source=null,stack=false){
    if(!u||u.hp<=0)return;
    const existing=status(u,type);
    if(existing){existing.turns=Math.max(existing.turns,turns);existing.value=Math.max(existing.value,value);if(stack)existing.stacks=Math.min(5,(existing.stacks||1)+1);if(source)existing.sourceId=source.id;existing.appliedTurn=turn;}
    else u.statuses.push({type,label,value,turns,stacks:1,sourceId:source?.id,appliedTurn:turn});
  }
  function targetChange(u,key,value){if(!context)return;let t=context.targets.find(t=>t.id===u.id);if(!t){t={id:u.id};context.targets.push(t);}t[key]=(t[key]||0)+Math.round(value);}
  function note(text){if(context)context.notes.push(text);}
  function energy(u,amount){if(u.hp<=0)return;const gain=clamp(u.energy+amount,0,100)-u.energy;u.energy+=gain;targetChange(u,'energy',gain);}
  function heal(source,target,amount){if(!target||target.hp<=0||amount<=0)return 0;const healingBonus=source.side==='ally' && trait('heal') ? .2 : 0;const gain=Math.min(target.maxHp-target.hp,Math.round(amount*(1+healingBonus)));target.hp+=gain;source.healing+=gain;targetChange(target,'heal',gain);return gain;}
  function shield(source,target,amount){if(!target||target.hp<=0)return;const bonus=source.side==='ally'&&trait('shield')?[.15,.3][trait('shield')-1]:0;const gain=Math.min(target.maxHp-target.shield,Math.round(amount*(1+bonus)));target.shield+=gain;source.shielding+=gain;targetChange(target,'shield',gain);}
  function event(actor,kind,skill,fn,text=''){
    if(events.length>=249)return;
    const before=context;context={targets:[],notes:[]};fn();
    const current=context;
    const effects=current.targets.map(t=>{const target=units.find(u=>u.id===t.id);const list=[];if(t.damage)list.push(`${t.damage} 伤害`);if(t.absorbed)list.push(`护盾吸收 ${t.absorbed}`);if(t.heal)list.push(`治疗 ${t.heal}`);if(t.shield)list.push(`护盾 +${t.shield}`);if(t.energy>0)list.push(`能量 +${t.energy}`);return list.length?`${target.name}：${list.join('，')}`:'';}).filter(Boolean);
    events.push({index:events.length,time:Math.round(time),turn,actorId:actor?.id||null,actorName:actor?.name||'战场',kind,skill,text:[text||`${actor?.name||'战场'}${actor?.zone==='back'?'从后台协同，':''}施放「${skill}」`,...effects,...current.notes].filter(Boolean).join('；'),targets:current.targets,snapshot:snapshot(),skillPoints:allySp});context=before;
  }
  function rawDamage(source,target,amount,{dot=false,follow=false,breakHit=false,toughness=20,canReact=true}={}){
    if(!target||target.hp<=0||(!dot&&source.hp<=0))return;
    const preRatio=target.hp/target.maxHp;
    let modifier=1+(status(target,'exposed')?.value||0)+(status(target,'broken')?.value||0);
    if(dot){modifier*=1+(status(target,'dotExposed')?.value||0);if(source.side==='ally'&&trait('dot'))modifier*=1+[.25,.5][trait('dot')-1];}
    if(follow&&source.side==='ally'&&trait('follow'))modifier*=1+[.2,.4][trait('follow')-1];
    if(follow&&item(source,'comet'))modifier*=1.3;
    if(!dot&&!breakHit&&random()<Math.min(.9,(source.crit||0)+(status(source,'critUp')?.value||0))){modifier*=1.5;note('暴击');}
    modifier*=1-(status(target,'guard')?.value||0);
    let hit=Math.max(1,Math.round(amount*modifier));
    if(item(target,'armor'))hit=Math.round(hit*.95);
    const absorbed=Math.min(target.shield,hit);target.shield-=absorbed;hit-=absorbed;
    const hpDamage=Math.min(target.hp,hit);target.hp-=hpDamage;source.damage+=hpDamage+absorbed;
    targetChange(target,'damage',hpDamage);if(absorbed)targetChange(target,'absorbed',absorbed);
    if(!dot&&!breakHit)energy(target,8);
    if(item(source,'blade')&&!dot)heal(source,source,(hpDamage+absorbed)*.18);
    if(item(source,'cannon')&&!dot&&target.hp>0&&!status(target,'cannonMarked')){addStatus(target,'cannonMarked','破甲',.12,3,source);addStatus(target,'exposed','易伤',.12,3,source);note('以太重炮施加 12% 易伤');}
    if(target.hp<=0){target.hp=0;target.shield=0;target.statuses=[];source.kills++;note(`${target.name}退场`);if(source.characterId==='1102'&&!source.seeleReset){source.seeleReset=true;source.next=Math.min(source.next,time+8);note('希儿「再现」：下次行动提前');}if(source.side==='ally'&&trait('hunters'))energy(source,trait('hunters')===1?15:25);}
    if(!dot&&!breakHit&&target.hp>0&&target.maxToughness>0&&!status(target,'broken')&&(target.weaknesses.includes(source.element)||status(target,'implanted'))){
      target.toughness=Math.max(0,target.toughness-Math.round(toughness*(1+(source.breakBonus||0))));
      if(target.toughness===0){addStatus(target,'broken','弱点击破',.2,1,source);target.next+=35;note(`${target.name}被弱点击破，行动延后`);reactions.push({type:'break',sourceId:source.id,targetId:target.id});}
    }
    if(canReact&&!dot&&!breakHit&&!follow&&target.hp>0){
      if(target.characterId==='1107')reactions.push({type:'counter',sourceId:target.id,targetId:source.id});
      const march=alive(target.side).find(u=>u.characterId==='1001'&&u.zone==='front');
      if(march&&absorbed>0)reactions.push({type:'march',sourceId:march.id,targetId:source.id});
      const luocha=alive(target.side).find(u=>u.characterId==='1203'&&u.zone==='front'&&u.autoHeal<=0);
      if(luocha&&target.hp/target.maxHp<.45){luocha.autoHeal=2;reactions.push({type:'autoheal',sourceId:luocha.id,targetId:target.id});}
    }
    if(target.characterId==='1205'&&hpDamage>0){target.charges++;if(target.charges>=5){target.charges=0;reactions.push({type:'blade',sourceId:target.id});}}
    if(target.characterId==='1208'&&target.hp>0&&target.hp/target.maxHp<.4&&target.revives<2){target.revives++;reactions.push({type:'fuxuan',sourceId:target.id});}
    if(preRatio>.5&&target.hp/target.maxHp<=.5){
      for(const herta of alive(opponents(target)).filter(u=>u.characterId==='1013'&&u.zone==='front'))if(!herta.hertaTriggered.has(target.id)){herta.hertaTriggered.add(target.id);reactions.push({type:'herta',sourceId:herta.id});}
    }
  }
  function hit(actor,target,mult,opts={}){rawDamage(actor,target,effectiveAttack(actor)*mult*(actor.zone==='back'?(strategy('backline')?1:.72):1),opts);}
  function aoe(actor,mult,opts={}){for(const target of damageTargets(actor))hit(actor,target,mult,opts);}
  function buffAll(actor,type,label,value,turns=2){for(const a of alive(actor.side))addStatus(a,type,label,value,turns,actor);note(`${label}生效`);}
  function applyDot(actor,target,type,label,mult,turns=3,stack=false){if(target&&target.hp>0){addStatus(target,type,label,effectiveAttack(actor)*mult*(actor.zone==='back'?(strategy('backline')?1:.72):1),turns,actor,stack);note(`${target.name}获得${label}${stack?'层数':''}`);}}
  function detonate(actor,target,factor=1){if(!target||target.hp<=0)return;for(const d of [...target.statuses].filter(s=>['burn','shock','wind'].includes(s.type))){const owner=units.find(u=>u.id===d.sourceId)||actor;rawDamage(owner,target,d.value*(d.stacks||1)*factor,{dot:true,canReact:false,toughness:0});}note('引爆已有持续伤害');}
  function allySkill(actor,ultimate=false,back=false){
    const c=actor.characterId,target=livingTarget(actor),weak=lowAlly(actor),carry=strongest(actor),self=actor;
    const scale=back?(strategy('backline')?1:.72):1;
    if(ultimate){
      switch(c){
        case '1001':aoe(actor,1.15,{toughness:40});for(const t of damageTargets(actor))if(random()<.3)addStatus(t,'frozen','冻结',1,1,actor);break;
        case '1002':hit(actor,target,status(target||{},'slow')?4.2:3.4,{toughness:50});break;
        case '1003':aoe(actor,2,{toughness:45});break;
        case '1004':aoe(actor,1.35,{toughness:40});for(const t of damageTargets(actor)){addStatus(t,'slow','减速',.25,2,actor);t.next+=35;}note('禁锢使敌方行动延后');break;
        case '1005':for(const t of damageTargets(actor)){hit(actor,t,1.45,{toughness:40});applyDot(actor,t,'shock','触电',.65);detonate(actor,t,1);}break;
        case '1006':hit(actor,target,2.8,{toughness:60});addStatus(target,'exposed','弱点分析',.5,3,actor);addStatus(target,'implanted','弱点植入',1,3,actor);break;
        case '1008':hit(actor,target,3.4,{toughness:45});for(const t of damageTargets(actor).filter(t=>t!==target))hit(actor,t,1.3,{toughness:20});break;
        case '1009':buffAll(actor,'haste','加速',.28,3);note('全队行动间隔缩短');break;
        case '1013':aoe(actor,1.9,{toughness:40});break;
        case '1101':buffAll(actor,'attackUp','攻击提升',.38,3);buffAll(actor,'critUp','暴击提升',.15,3);break;
        case '1102':hit(actor,target,4,{toughness:60});break;
        case '1103':for(const t of damageTargets(actor)){hit(actor,t,1.4,{toughness:35});applyDot(actor,t,'shock','触电',.55,4);}break;
        case '1104':for(const a of front(actor.side))shield(actor,a,actor.maxHp*.32*scale);break;
        case '1105':for(const a of front(actor.side))heal(actor,a,(actor.maxHp*.22+90)*scale);break;
        case '1106':aoe(actor,.95,{toughness:40});for(const t of damageTargets(actor))addStatus(t,'exposed','领域压制',.35,3,actor);break;
        case '1107':addStatus(actor,'taunt','反击姿态',1,3,actor);addStatus(actor,'guard','减伤',.28,3,actor);actor.charges=3;note('强化反击准备完成');break;
        case '1108':aoe(actor,1.3,{toughness:35});for(const t of damageTargets(actor))addStatus(t,'dotExposed','持续伤害易伤',.4,3,actor);break;
        case '1109':hit(actor,target,3.1,{toughness:50});for(const t of damageTargets(actor).filter(t=>t!==target))hit(actor,t,1.15,{toughness:20});applyDot(actor,target,'burn','灼烧',.8);break;
        case '1201':aoe(actor,1.9,{toughness:40});actor.charges=1;note('下次战技必定形成暗杠');break;
        case '1202':energy(carry,50);addStatus(carry,'attackUp','赐福',.4,3,actor);break;
        case '1204':aoe(actor,1.6,{toughness:40});actor.jingStacks=Math.min(10,actor.jingStacks+3);break;
        case '1205':{const missing=actor.maxHp-actor.hp;actor.hp=Math.max(actor.hp,Math.round(actor.maxHp*.5));hit(actor,target,2.8+missing/actor.maxHp,{toughness:45});for(const t of damageTargets(actor).filter(t=>t!==target))hit(actor,t,1.4,{toughness:20});break;}
        case '1203':aoe(actor,1.5,{toughness:40});actor.field=3;note('生息结界展开：队友攻击后获得治疗');break;
        case '1208':aoe(actor,1.15,{toughness:40});for(const a of front(actor.side))heal(actor,a,actor.maxHp*.09*scale);break;
      }
      return;
    }
    if(back){
      // Backline uses speed-based support actions, never normal attacks or skill points.
      switch(c){
        case '1001':shield(actor,weak,actor.maxHp*.2*scale);return;
        case '1104':for(const a of front(actor.side))shield(actor,a,actor.maxHp*.12*scale);return;
        case '1105':case '1203':heal(actor,weak,(actor.maxHp*.18+60)*scale);return;
        case '1208':for(const a of front(actor.side)){addStatus(a,'guard','穷观协同',.12,2,actor);shield(actor,a,actor.maxHp*.07*scale);}return;
        case '1009':buffAll(actor,'haste','后台加速',.14,2);energy(carry,10);return;
        case '1202':energy(carry,25);addStatus(carry,'attackUp','后台赐福',.2,2,actor);return;
        case '1101':carry.next=Math.max(time+5,carry.next-35);addStatus(carry,'attackUp','行动支援',.22,2,actor);note(`${carry.name}行动提前`);return;
        case '1004':for(const t of damageTargets(actor)){addStatus(t,'slow','重力协同',.15,2,actor);t.next+=10;}return;
        case '1106':for(const t of damageTargets(actor))addStatus(t,'exposed','情报协同',.18,2,actor);return;
        case '1006':addStatus(target,'exposed','骇入协同',.25,2,actor);addStatus(target,'implanted','弱点植入',1,2,actor);return;
      }
    }
    switch(c){
      case '1001':shield(actor,weak,(actor.maxHp*.24+actor.attack*.6)*scale);addStatus(weak,'taunt','护盾嘲讽',1,2,actor);break;
      case '1002':hit(actor,target,2.1,{toughness:30});addStatus(target,'slow','减速',.25,2,actor);break;
      case '1003':aoe(actor,1.2,{toughness:30});break;
      case '1004':for(let i=0;i<3;i++){const t=livingTarget(actor);hit(actor,t,.72,{toughness:15});addStatus(t,'slow','减速',.18,2,actor);}break;
      case '1005':hit(actor,target,1.5,{toughness:30});applyDot(actor,target,'shock','触电',.5);detonate(actor,target,.85);break;
      case '1006':hit(actor,target,1.55,{toughness:35});addStatus(target,'exposed','弱点分析',.3,2,actor);addStatus(target,'implanted','弱点植入',1,3,actor);break;
      case '1008':{const loss=Math.min(actor.hp-1,Math.round(actor.maxHp*.08));actor.hp-=loss;targetChange(actor,'damage',loss);hit(actor,target,2.3+(1-actor.hp/actor.maxHp),{toughness:30});break;}
      case '1009':for(let i=0;i<3;i++)hit(actor,livingTarget(actor),.5,{toughness:15});buffAll(actor,'attackUp','蓄能',.15,2);break;
      case '1013':aoe(actor,1.1,{toughness:25});break;
      case '1101':carry.next=Math.max(time+5,carry.next-60);addStatus(carry,'attackUp','作战再部署',.35,2,actor);note(`${carry.name}行动提前`);break;
      case '1102':hit(actor,target,2.35,{toughness:35});addStatus(actor,'haste','高速行动',.25,2,actor);break;
      case '1103':for(const t of damageTargets(actor)){hit(actor,t,.8,{toughness:20});applyDot(actor,t,'shock','触电',.5);}break;
      case '1104':hit(actor,target,1.4,{toughness:30});if(target&&random()<.4)addStatus(target,'frozen','冻结',1,1,actor);shield(actor,actor,actor.maxHp*.12);break;
      case '1105':heal(actor,weak,(actor.maxHp*.3+100)*scale);addStatus(weak,'regen','持续治疗',actor.maxHp*.08*scale,2,actor);break;
      case '1106':hit(actor,target,1.1,{toughness:30});addStatus(target,'exposed','防御削弱',.22,2,actor);break;
      case '1107':aoe(actor,1.1,{toughness:25});addStatus(actor,'taunt','反击准备',1,2,actor);break;
      case '1108':for(let i=0;i<3;i++){const t=livingTarget(actor);hit(actor,t,.65,{toughness:15});applyDot(actor,t,'wind','风化',.27,3,true);}break;
      case '1109':hit(actor,target,status(target||{},'burn')?2.5:1.9,{toughness:30});applyDot(actor,target,'burn','灼烧',.6);break;
      case '1201':if(actor.charges||random()<.6){actor.charges=0;hit(actor,target,2.7,{toughness:35});for(const t of damageTargets(actor).filter(t=>t!==target))hit(actor,t,1.05,{toughness:20});note('暗杠：强化攻击');}else hit(actor,target,1.4,{toughness:25});break;
      case '1202':addStatus(carry,'attackUp','赐福',.28,3,actor);energy(carry,30);break;
      case '1204':aoe(actor,.95,{toughness:20});actor.jingStacks=Math.min(10,actor.jingStacks+2);break;
      case '1205':{const loss=Math.min(actor.hp-1,Math.round(actor.maxHp*.1));actor.hp-=loss;targetChange(actor,'damage',loss);actor.charges++;aoe(actor,1.35,{toughness:25});heal(actor,actor,actor.maxHp*.08);break;}
      case '1203':heal(actor,weak,(actor.maxHp*.35+100)*scale);weak.statuses=weak.statuses.filter(s=>!['burn','shock','wind','slow','frozen'].includes(s.type));note('净化负面状态');break;
      case '1208':buffAll(actor,'guard','穷观阵',.18,3);buffAll(actor,'critUp','鉴知',.12,3);heal(actor,actor,actor.maxHp*.12);break;
    }
  }
  function enemyAction(actor,ultimate){
    const target=livingTarget(actor), mult=ultimate?1.4:1;
    switch(actor.archetype){
      case 'medic':heal(actor,lowAlly(actor),actor.maxHp*.25);if(ultimate)for(const a of front(actor.side))shield(actor,a,actor.maxHp*.1);break;
      case 'guard':shield(actor,actor,actor.maxHp*.15);hit(actor,target,1.05*mult,{toughness:0});break;
      case 'caster':aoe(actor,(ultimate?.95:.68),{toughness:0});if(ultimate&&target)applyDot(actor,target,'shock','触电',.35,2);break;
      case 'aurumaton':if(ultimate){aoe(actor,1.15,{toughness:0});addStatus(actor,'guard','惩戒模式',.2,2,actor);}else {hit(actor,target,1.65,{toughness:0});if(target)target.next+=15;}break;
      case 'svarog':if(ultimate)aoe(actor,1.35,{toughness:0});else {hit(actor,target,1.75,{toughness:0});if(target){addStatus(target,'slow','机械禁锢',.2,2,actor);target.next+=20;}}break;
      case 'doomsday':if(actor.hp/actor.maxHp<.5)addStatus(actor,'attackUp','末日狂暴',.25,99,actor);if(ultimate)aoe(actor,1.65,{toughness:0});else {hit(actor,target,1.55,{toughness:0});for(const t of damageTargets(actor).filter(t=>t!==target))hit(actor,t,.45,{toughness:0});}break;
      default:hit(actor,target,(ultimate?2:1.2),{toughness:0});
    }
  }
  function flushReactions(){
    let handled=0;
    while(reactions.length&&handled<12&&events.length<245){
      const r=reactions.shift(),source=units.find(u=>u.id===r.sourceId),target=units.find(u=>u.id===r.targetId);handled++;
      if(!source||source.hp<=0)continue;
      if(['counter','march','break'].includes(r.type)&&(!target||target.hp<=0))continue;
      if(r.type==='break'){
        event(source,'break','弱点击破',()=>{rawDamage(source,target,source.attack*(.65+(source.breakBonus||0)),{breakHit:true,canReact:false});if(source.side==='ally'&&trait('express'))for(const a of allies)energy(a,trait('express')===1?6:12);},`${source.name}击破${target.name}的韧性`);
        const himeko=alive(source.side).find(u=>u.characterId==='1003'&&u.zone==='front');if(himeko){himeko.charges++;if(himeko.charges>=2){himeko.charges=0;reactions.push({type:'himeko',sourceId:himeko.id});}}
      }else if(r.type==='counter'||r.type==='march')event(source,'followup',r.type==='march'?'少女的特权':'史瓦罗反击',()=>{hit(source,target,r.type==='march'?.75:source.charges>0?2:1.3,{follow:true,canReact:false,toughness:15});if(source.charges>0)source.charges--;energy(source,10);});
      else if(r.type==='herta'||r.type==='himeko')event(source,'followup',r.type==='herta'?'还是转圈圈':'乘胜追击',()=>{aoe(source,r.type==='herta'?.85:1.35,{follow:true,canReact:false,toughness:15});energy(source,10);});
      else if(r.type==='blade')event(source,'followup','倏忽恩赐',()=>{aoe(source,1.45,{follow:true,canReact:false,toughness:20});heal(source,source,source.maxHp*.2);});
      else if(r.type==='autoheal')event(source,'heal','怜愍愚人',()=>heal(source,target,source.maxHp*.28));
      else if(r.type==='fuxuan')event(source,'heal','否极泰来',()=>heal(source,source,source.maxHp*.4));
      else if(r.type==='lightning')event(source,'followup','神君·奔腾',()=>{const stacks=source.jingStacks;source.jingStacks=3;for(let i=0;i<stacks;i++)hit(source,livingTarget(source),.38,{follow:true,canReact:false,toughness:8});note(`神君发动 ${stacks} 段攻击`);});
      checkWinner();if(winner)break;
    }
    reactions=[];
  }
  function checkWinner(){if(!front('ally').length)winner='enemy';else if(!front('enemy').length)winner='ally';return winner;}
  function applyOpening(){
    for(const a of allies){
      if(trait('station'))energy(a,trait('station')===1?10:20);
      if(trait('shield')&&a.zone==='front')shield(a,a,a.maxHp*(trait('shield')===1?.1:.18));
      if(trait('belobog')&&a.zone==='front')shield(a,a,a.maxHp*[.05,.1,.16][trait('belobog')-1]);
      if(trait('support'))energy(a,trait('support')===1?8:16);
      for(const id of a.items){
        if(id==='battery')energy(a,15);
        if(id==='electric')energy(a,25);
        if(id==='perpetual')energy(a,40);
        if(id==='armor')shield(a,a,a.maxHp*.08);
        if(id==='bastion')shield(a,a,a.maxHp*.3);
        if(id==='boots')a.next*=.75;
        if(id==='hybrid')shield(a,a,a.maxHp*.12);
      }
    }
    note(synergies.filter(t=>t.active).map(t=>`${t.name} ${t.count}`).join('、')||'没有激活羁绊');
    if(allies.some(a=>a.items.length))note('开场装备效果已生效');
  }
  const initial=snapshot();
  event(null,'start','开场准备',applyOpening,'双方进入战场，护盾、初始能量与羁绊生效');
  const maxActions=clamp(options.maxActions||100,1,180);
  while(turn<maxActions&&events.length<235&&!checkWinner()){
    const candidates=[...front('enemy'),...alive('ally')].sort((a,b)=>a.next-b.next||a.id.localeCompare(b.id));
    const actor=candidates[0];if(!actor)break;
    time=actor.next;turn++;actor.acted++;actor.seeleReset=false;actor.autoHeal=Math.max(0,actor.autoHeal-1);
    actor.next=time+10000/effectiveSpeed(actor);
    const dots=actor.statuses.filter(s=>['burn','shock','wind'].includes(s.type));
    if(dots.length)event(actor,'dot','持续伤害结算',()=>{for(const d of dots){const source=units.find(u=>u.id===d.sourceId);if(source)rawDamage(source,actor,d.value*(d.stacks||1),{dot:true,canReact:false,toughness:0});} },`${actor.name}行动前结算持续伤害`);
    if(checkWinner())break;
    if(actor.hp<=0)continue;
    if(status(actor,'regen')||item(actor,'garden'))event(actor,'heal',item(actor,'garden')?'不凋之花':'持续治疗',()=>{const regen=status(actor,'regen');if(regen)heal(units.find(u=>u.id===regen.sourceId)||actor,actor,regen.value);if(item(actor,'garden'))heal(actor,actor,actor.maxHp*.1);});
    if(status(actor,'frozen')){event(actor,'control','冻结',()=>{actor.statuses=actor.statuses.filter(s=>s.type!=='frozen');for(const s of actor.statuses)if(s.type!=='broken')s.turns--;actor.statuses=actor.statuses.filter(s=>s.turns>0);},`${actor.name}被冻结，跳过本次行动`);continue;}
    if(status(actor,'broken')){event(actor,'recover','韧性恢复',()=>{actor.toughness=actor.maxToughness;actor.statuses=actor.statuses.filter(s=>s.type!=='broken');},`${actor.name}恢复韧性`);}
    const ultimate=actor.energy>=100;
    let kind=ultimate?'ultimate':actor.zone==='back'?'support':'skill';
    let useSkill=actor.side==='enemy'||actor.zone==='back'||allySp>0;
    if(actor.side==='ally'&&actor.zone==='front'&&!ultimate){
      if(['1105','1203'].includes(actor.characterId)&&front('ally').every(a=>a.hp/a.maxHp>.82))useSkill=false;
      if(actor.characterId==='1001'&&front('ally').every(a=>a.shield>a.maxHp*.2))useSkill=false;
      if(['1009','1101','1202','1208'].includes(actor.characterId)&&actor.acted%3===0)useSkill=false;
    }
    if(!useSkill&&!ultimate)kind='basic';
    const c=characterMap.get(actor.characterId);
    const skill=ultimate?(c?.ultimate||'强化攻势'):actor.zone==='back'?(c?.backlineSkill||`${c?.skill||'协同'}·支援`):kind==='basic'?'普通攻击':c?.skill||({raider:'突袭',guard:'防御压制',caster:'能量扫射',medic:'复苏之术',aurumaton:'金人惩戒',svarog:'机械镇压',doomsday:'末日践踏'}[actor.archetype]||'进攻');
    event(actor,kind,skill,()=>{
      if(ultimate){actor.energy=0;if(actor.side==='ally')allySkill(actor,true,actor.zone==='back');else enemyAction(actor,true);}
      else if(kind==='basic'){hit(actor,livingTarget(actor),1,{toughness:20});allySp=Math.min(5,allySp+1);energy(actor,20);note('战技点 +1');}
      else {if(actor.side==='ally'){if(actor.zone==='front')allySp--;allySkill(actor,false,actor.zone==='back');}else enemyAction(actor,false);energy(actor,actor.zone==='back'?25:30);}
      if(item(actor,'perpetual')){energy(actor,12);note('永动机：额外恢复能量');}
      if(item(actor,'electric')&&kind==='ultimate')actor.next=Math.max(time+5,actor.next-25);
      if(actor.side==='ally'&&trait('luofu')&&actor.acted%2===0)energy(actor,[6,10,16][trait('luofu')-1]);
      if(actor.side==='ally'&&trait('wildfire')&&actor.hp/actor.maxHp<.5)heal(actor,actor,actor.maxHp*(trait('wildfire')===1?.05:.09));
      if(actor.side==='ally'&&trait('strike')&&kind==='basic'&&actor.acted%2===0){const t=livingTarget(actor);hit(actor,t,trait('strike')===1?.35:.65,{follow:true,canReact:false,toughness:10});note('强攻羁绊追加打击');}
      if(actor.side==='ally'&&kind!=='support'){const field=allies.find(a=>a.hp>0&&a.field>0);if(field)for(const a of front('ally'))heal(field,a,field.maxHp*.04);}
      if(item(actor,'bastion')&&actor.acted%3===0){shield(actor,lowAlly(actor),actor.maxHp*.12);note('星海壁垒：刷新前台护盾');}
    });
    if(actor.characterId==='1204'&&actor.acted%2===0)reactions.push({type:'lightning',sourceId:actor.id});
    if(actor.field>0)actor.field--;
    for(const s of actor.statuses)if(s.type!=='broken'&&s.appliedTurn!==turn)s.turns--;
    actor.statuses=actor.statuses.filter(s=>s.turns>0);
    // Recompute the interval after haste/slow changes, preserving explicit action advances.
    actor.next=Math.min(actor.next,time+10000/effectiveSpeed(actor));
    flushReactions();
  }
  const reason=checkWinner()?'elimination':'timeout';
  if(!winner)winner='enemy';
  event(null,'end','战斗结束',()=>{},winner==='ally'?'敌方全灭，本场战斗胜利。':reason==='timeout'?'行动达到上限，未能及时击败敌方，本场战斗失败。':'前台全员退场，本场战斗失败。');
  if(events.length)events[events.length-1].winner=winner;
  return {version:1,initialSkillPoints:3,maxSkillPoints:5,maxEnergy:100,units:initial,events,winner,turns:turn,reason,skillPoints:allySp,stats:units.map(u=>({id:u.id,name:u.name,side:u.side,damage:Math.round(u.damage),healing:Math.round(u.healing),shielding:Math.round(u.shielding),kills:u.kills})),final:snapshot()};
}
