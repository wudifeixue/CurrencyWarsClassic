import {getEnvironmentUnitModifiers} from './classic-environments.js?v=6.7.0';
import {getProgressionBattleModifiers, getProgressionUnitTraits, getProgressionTraitCounts, getProgressionNavigatorPartner, getEffectiveCharacterCost} from './classic-progression.js?v=6.7.0';
import {createCombatMetrics, finishCombatMetrics} from './classic-combat-metrics.js?v=6.7.0';
export {getClassicSimulationDescription, CLASSIC_SIMULATION_DESCRIPTIONS, getClassicTraitSimulationDescription, CLASSIC_TRAIT_SIMULATION_DESCRIPTIONS} from './classic-simulation-notes.js?v=6.7.0';
import {classicAction, CLASSIC_SIMULATION_NOTE} from './classic-actions.js?v=6.7.0';
export {CLASSIC_SIMULATION_NOTE};
import {CHARACTERS, TRAITS, EQUIPMENT, STRATEGIES, resolveEquipment} from './data.js?v=6.7.0';

const characterMap = new Map(CHARACTERS.map(c => [c.id, c]));
const equipmentEntries=u=>(u.items||[]).map(resolveEquipment).filter(Boolean);
const passiveAmount=(u,p,normal,privileged=normal*2,stack=true)=>equipmentEntries(u).filter(e=>e.passive===p).reduce((value,e)=>stack?value+(e.privileged?privileged:normal):Math.max(value,e.privileged?privileged:normal),0);
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const characterSpeeds = {'1001':101,'1002':112,'1003':96,'1004':102,'1005':104,'1006':107,'1008':102,'1009':110,'1013':100,'1101':108,'1102':122,'1103':104,'1104':92,'1105':99,'1106':105,'1107':90,'1108':108,'1109':101,'1201':98,'1202':112,'1204':99,'1205':103,'1203':106,'1208':100};

export function getUnitBattleTraits(state,unit){
  const c=characterMap.get(unit.characterId),traits=new Set(c?.legacy?[...(c.traits||[]),...(unit.extraTraits||[])]:getProgressionUnitTraits(state,unit));
  for(const id of unit.items||[]){const item=resolveEquipment(id);if(item?.trait)traits.add(item.trait);for(const t of item?.traits||[])traits.add(t);}
  return [...traits].filter(t=>TRAITS.some(x=>x.id===t));
}
export function getBattleSynergies(state) {
  const members={};
  for(const u of state.units.filter(u=>u.zone!=='bench'))for(const id of getUnitBattleTraits(state,u))(members[id]??=new Set()).add(u.characterId);
  const progressionCounts=getProgressionTraitCounts(state);
  for(const id of ['hunters','elation'])if((progressionCounts[id]||0)>(members[id]?.size||0))(members[id]??=new Set()).add(`accessory:${id}`);
  return TRAITS.filter(t=>members[t.id]?.size).map(t=>{const count=members[t.id].size;return {...t,count,level:t.thresholds.filter(n=>count>=n).length,active:count>=t.thresholds[0],next:t.thresholds.find(n=>n>count)??null};}).sort((a,b)=>Number(b.active)-Number(a.active)||b.count-a.count);
}

const tierValue=(values,level)=>values[Math.min(values.length-1,Math.max(0,level-1))]||0;
const starValue=(values,unit)=>tierValue(values,unit.star);
const belongs=(unit,id)=>[...(unit.traits||characterMap.get(unit.characterId)?.traits||[]),...(unit.extraTraits||[])].includes(id);
const isClassic=unit=>Boolean(characterMap.get(unit.characterId)?.sourceVersion);
const battleStrategy=(state)=>(state.strategies||[]).map(id=>STRATEGIES.find(s=>s.id===id)?.effect?.battle||{});

// Original percentages operate on a shared trial-stat baseline. Fixed original HP/DEF
// amounts are scaled by 0.1 because this 2D battle has no relic/light-cone account stats.
export const CLASSIC_FLAT_SCALE=.1;
function withNavigatorEquipment(state,unit){
  if(unit._navigatorCopied||unit.zone==='bench'||unit.characterId!=='1510')return unit;
  const target=getProgressionNavigatorPartner(state,unit);
  const item=target?.items?.[0];if(!resolveEquipment(item))return unit;
  return {...unit,items:[...unit.items,item],_navigatorCopied:item};
}
function occupiedEquipmentSlots(unit){
  const items=unit.items.slice(0,Math.max(0,unit.items.length-(unit._projectedCount||0)));
  if(unit._navigatorCopied){const index=items.lastIndexOf(unit._navigatorCopied);if(index>=0)items.splice(index,1);}
  return items.some(id=>resolveEquipment(id)?.exclusiveSlots)?3:items.length;
}
function dayEquipment(state,unit,day){
  if(!day||unit.zone==='bench'||!getUnitBattleTraits(state,unit).includes('day'))return [];
  const occupied=occupiedEquipmentSlots(unit),assigned=Object.entries(day.assignments||{}).filter(([,uid])=>uid===unit.uid).map(([id])=>id).slice(0,Math.max(0,3-occupied));
  if(day.enhanced){const pool=['day-propeller','day-hybrid','day-execution'];let index=0;while(assigned.length+occupied<3){const candidate=pool[index++%pool.length];if(!assigned.includes(candidate)||index>6)assigned.push(candidate);}}
  return assigned;
}
export function getBattleStats(state, unit, options={}) {
  if(!options.prepared){const prepared={...state,units:state.units.map(u=>withNavigatorEquipment(state,u))};return getBattleStats(prepared,withNavigatorEquipment(state,unit),{...options,prepared:true});}
  const c=characterMap.get(unit.characterId);
  if(!c)return {attack:0,hp:0,speed:100,crit:0,breakBonus:0};
  const progression=getProgressionBattleModifiers(state),rules=progression.ruleFlags||{};
  const synergies=getBattleSynergies(state), level=id=>synergies.find(t=>t.id===id)?.level||0;
  const unitTraits=getUnitBattleTraits(state,unit);
  const inherited=new Set(state.units.filter(u=>u.zone==='front').flatMap(u=>getUnitBattleTraits(state,u)).filter(id=>level(id)>0&&TRAITS.find(t=>t.id===id)?.type!=='独立羁绊'));
  const has=id=>unitTraits.includes(id)||(unitTraits.includes('savior')&&inherited.has(id));
  const effectiveCost=getEffectiveCharacterCost(state,c.id,unit);
  const gamerPanel={3:{front:[150,240,330],hp:[.3,.69,1.08],speed:[.2,.32,.44]},4:{front:[200,320,600],hp:[.45,.88,1.32],speed:[.3,.43,.56]},5:{front:[240,400,2500],hp:[.6,1.08,5],speed:[.45,.6,3]}}[effectiveCost],gamerStar=c.id==='1506'&&gamerPanel?{frontStrength:starValue(gamerPanel.front,unit),hpAmplification:starValue(gamerPanel.hp,unit),speedAmplification:starValue(gamerPanel.speed,unit)}:null;
  const classic=Boolean(c.sourceVersion), referenceBase=c.referenceStars?.[0],referenceStar=gamerStar||c.referenceStars?.find(s=>s.stars===unit.star),strengthKey=unit.zone==='back'?'backStrength':'frontStrength';
  const attackFactor=classic?(referenceBase?.[strengthKey]&&referenceStar?.[strengthKey]?referenceStar[strengthKey]/referenceBase[strengthKey]:starValue([1,1.6,2.2,2.8],unit)):starValue([1,1.85,3.5,5],unit);
  const hpFactor=classic&&referenceBase&&referenceStar?(1+(referenceStar.hpAmplification||0))/(1+(referenceBase.hpAmplification||0)):classic?starValue([1,1.3,1.6,1.9],unit):attackFactor;
  const speedFactor=classic&&referenceBase&&referenceStar?(1+(referenceStar.speedAmplification||0))/(1+(referenceBase.speedAmplification||0)):classic?starValue([1,1.1,1.2,1.3],unit):1;
  const out={attack:c.attack*attackFactor,hp:c.hp*hpFactor,speed:(c.speed||characterSpeeds[c.id]||100)*speedFactor,crit:.08,critDamage:.5,breakBonus:0,breakEffect:0,frontPower:0,backPower:0,hpPct:0,speedPct:0,damageAmp:0,damageReduction:0,healAmp:referenceBase?.healingStrength&&referenceStar?.healingStrength?referenceStar.healingStrength/referenceBase.healingStrength-1:0,shieldAmp:referenceBase?.shieldStrength&&referenceStar?.shieldStrength?referenceStar.shieldStrength/referenceBase.shieldStrength-1:0,startEnergy:0,followAmp:0,dotAmp:0,ultimateAmp:0,basicSkillDamage:0};
  for(const id of unit.items){const e=resolveEquipment(id);if(!e)continue;out.attack+=e.attack||0;out.hp+=e.hp||0;out.speed+=e.speed||0;for(const key of ['frontPower','backPower','hpPct','speedPct','damageAmp','damageReduction','crit','critDamage','startEnergy','breakEffect','shieldAmp','healAmp'])out[key]+=e[key]||0;out.breakBonus+=e.breakEfficiency||0;}
  for(const t of synergies){if(!t.active)continue;const l=t.level,member=has(t.id);
    if(t.id==='express'){const p=tierValue([.2,.4,.6],l)*(member&&l>=2?2:1);out.frontPower+=p;out.backPower+=p;}
    if(t.id==='heal'){out.hpPct+=.12;if(member)out.healAmp+=tierValue([.2,.4,.6],l);if(l>=3)out.damageAmp+=.6;}
    if(t.id==='shield'){out.damageAmp+=tierValue([.12,.4],l);if(member)out.shieldAmp+=tierValue([.2,.4],l);}
    if(t.id==='sp')out.speedPct+=tierValue([.12,.24,.4,.8],l);
    if(!member)continue;
    const powers={scholar:[.3,.8,2],night:[.3,.6,1.2,2.4],grail:[.25,.5,1,1.8],debuff:[.2,.6,1.2,2.5],break:[.2,.6,1.5,3.2],wolfpack:[.15,.3,.5,.9],luofu:[.2,.4,.8,2],day:[.1,.18,.36,.6]};
    if(powers[t.id]){out.frontPower+=tierValue(powers[t.id],l);out.backPower+=tierValue(powers[t.id],l);}
    if(t.id==='luofu')out.speedPct+=tierValue([.08,.16,.32,.6],l);
    if(t.id==='day')out.speedPct+=tierValue([.05,.09,.18,.3],l);
    if(t.id==='hunters'){out.damageAmp+=tierValue([.24,.48,.8],l);out.hpPct+=tierValue([.12,.24,.36],l);}
    if(t.id==='belobog')out.damageAmp+=tierValue([.36,.72],l);
    if(t.id==='blood'){out.hpPct+=tierValue([.1,.2,.3,.45],l);out.damageAmp+=tierValue([.1,.25,.4,.6],l);}
    if(t.id==='follow')out.followAmp+=tierValue([.2,.5,.8,1.2],l);
    if(t.id==='dot')out.dotAmp+=tierValue([.3,.8,2],l);
    if(t.id==='energy')out.ultimateAmp+=tierValue([.2,.4,.8,2.4],l);
    if(t.id==='aoe'){out.crit+=tierValue([.12,.24,.36,.6],l);out.critDamage+=tierValue([.12,.24,.36,.6],l);}
    if(t.id==='elation')out.crit+=tierValue([.08,.16,.24,.4],l);
    if(t.id==='ipc'){out.backPower+=tierValue([.3,1],l);out.shieldAmp+=tierValue([.1,.25],l);}
    if(t.id==='ranger'){const p=tierValue([.08,.16,.28,.3],l),back=state.units.filter(u=>u.zone==='back'&&getUnitBattleTraits(state,u).includes('ranger')).reduce((n,u)=>n+starValue([1,3,6,12],u),0);out.damageAmp+=p*(1+(unit.zone==='front'?back:0));out.speedPct+=p*(1+(unit.zone==='front'?back:0));}
  }
  if(level('wanderer')){const scale=tierValue([1,1.2,1.45,1.75,2.1,2.5,3],level('wanderer'))*(has('wanderer')?2:1),ids=new Set(state.units.filter(u=>u.zone!=='bench').map(u=>u.characterId));if(ids.has('1108'))out.damageReduction+=.1*scale;if(ids.has('1302'))out.frontPower+=.2*scale;if(ids.has('1305'))out.speedPct+=.1*scale;if(ids.has('1203'))out.backPower+=.2*scale;if(ids.has('1004'))out.crit+=.1*scale;if(ids.has('1505'))out.startEnergy+=15*scale;}
  const deployed=state.units.filter(u=>u.zone!=='bench'), positionAllowed=!c.allowedZones||c.allowedZones.includes(unit.zone);
  for(const owner of deployed){const p=passiveAmount(owner,'team-power-25',.25);out.frontPower+=p;out.backPower+=p;out.hpPct+=passiveAmount(owner,'team-health-15',.15);out.damageReduction+=passiveAmount(owner,'team-reduction-18',.18);out.crit+=passiveAmount(owner,'team-luck-control',.12);}
  for(const id of unit.items){const e=resolveEquipment(id),p=e?.passive,m=e?.privileged?2:1;
    if(p==='front-crit-damage'&&unit.zone==='front')out.critDamage+=.1*m;
    if(p==='back-crit-damage'&&unit.zone==='back')out.critDamage+=.1*m;
    if(p==='adaptive-position'){if(unit.zone==='front')out.damageReduction+=.25*m;else{out.backPower+=.2*m;out.speedPct+=.2*m;}}
    if(p==='star-scaling'){out.speedPct+=unit.star*.1*m;out.damageAmp+=unit.star*.1*m;}
  }
  const nonIndependent=synergies.filter(t=>t.active&&t.type!=='独立羁绊').length;
  for(const b of battleStrategy(state)){
    for(const key of Object.keys(out))if(typeof b[key]==='number')out[key]+=b[key];
    const firstFront=deployed.filter(u=>u.zone==='front').sort((a,b)=>(a.slot||0)-(b.slot||0))[0];
    if(firstFront?.uid===unit.uid){out.damageAmp+=b.firstFrontDamage||0;out.hpPct+=b.firstFrontHp||0;}
    if(deployed.filter(u=>u.zone==='back').length>=(b.backlineRequired||Infinity))out.speedPct+=b.backlineSpeed||0;
    out.frontPower+=(b.powerPerTrait||0)*nonIndependent;out.backPower+=(b.powerPerTrait||0)*nonIndependent;out.hpPct+=(b.hpPerTrait||0)*nonIndependent;
    const oneCosts=deployed.filter(u=>characterMap.get(u.characterId)?.cost===1).reduce((sum,u)=>sum+(u.star>=3?(b.threeStarMultiplier||1):1),0);
    out.speedPct+=(b.oneCostSpeed||0)*oneCosts;out.damageReduction+=(b.oneCostReduction||0)*oneCosts;
    const twoStars=deployed.filter(u=>u.star===2).length;out.frontPower+=(b.powerPerTwoStar||0)*twoStars;out.backPower+=(b.powerPerTwoStar||0)*twoStars;out.damageReduction+=(b.reductionPerTwoStar||0)*twoStars;
    const triples=Number(unit.star===3)+Number(c.cost===3)+Number(unit.items.length===3);out.speedPct+=(b.tripleThreeSpeed||0)*triples;out.frontPower+=(b.tripleThreePower||0)*triples;out.backPower+=(b.tripleThreePower||0)*triples;
    out.speedPct+=(b.speedPerNode||0)*(state.strategyState?.['supply-chain']?.nodes||0);
  }
  if(state.strategies.includes('vanguard')&&unit.zone==='front')out.frontPower+=.22;
  if(state.strategies.includes('recovery'))out.damageAmp+=.08;
  if(state.strategies.includes('momentum'))out.damageAmp+=.1;
  if(state.strategies.includes('fortress'))out.hpPct+=.25;
  for(const extra of [progression.team,progression.units?.[unit.uid],getEnvironmentUnitModifiers(state,unit)])for(const [key,value]of Object.entries(extra||{}))if(typeof value==='number'&&Number.isFinite(value)){if(key==='breakEfficiency')out.breakBonus+=value;else out[key]=(out[key]||0)+value;}
  const day=rules.day,ownedDay=dayEquipment(state,unit,day);
  if(day){
    for(const owner of deployed)for(const id of dayEquipment(state,owner,day))if(id==='day-hybrid'){out.frontPower+=day.enhanced?.5:.25;out.backPower+=day.enhanced?.5:.25;if(day.enhanced)out.damageAmp+=.1;}
    for(const id of ownedDay){
      if(id==='day-propeller'){out.speedPct+=.1;out.breakBonus+=.25;}
      if(id==='day-hybrid'){out.frontPower+=day.enhanced?.4:.2;out.backPower+=day.enhanced?.4:.2;}
      if(id==='day-execution'){out.frontPower+=day.enhanced?.2:.1;out.backPower+=day.enhanced?.4:.2;out.speedPct+=day.enhanced?.4:.2;out.breakBonus+=day.enhanced?.5:.25;out.eliteDamage=(out.eliteDamage||0)+(day.enhanced?1:.4);out.eliteBreak=(out.eliteBreak||0)+(day.enhanced?.75:.25);}
    }
  }
  if(!options.skipMentor&&level('mentor')&&unitTraits.includes('mentor')){
    const shared=deployed.filter(u=>u.uid!==unit.uid&&getUnitBattleTraits(state,u).includes('mentor')).reduce((sum,u)=>{const donor=getBattleStats(state,u,{skipMentor:true}),record=characterMap.get(u.characterId)?.referenceStars?.find(r=>r.stars===u.star);return sum+Math.max(donor.frontPower+(record?.frontStrength||0)/100,donor.backPower+(record?.backStrength||0)/100);},0);
    out.frontPower+=shared;out.backPower+=shared;
  }
  const empowerment=positionAllowed&&c.empowerments?.find(e=>e.zone===unit.zone),speedText=empowerment?.skills?.map(s=>s.condition).join(' ')||'';
  const speedMatch=speedText.match(/以([\d%/.]+)的速度/);if(speedMatch){const values=speedMatch[1].split('/').map(v=>parseFloat(v)/100);out.speed*=starValue(values,unit);}
  for(const id of unit.items)if(resolveEquipment(id)?.passive==='speed-to-power'){const speed=out.speed*(1+out.speedPct),m=resolveEquipment(id)?.privileged?2:1;out.frontPower+=speed/10*.02*m;out.backPower+=speed/10*.01*m;}
  if(ownedDay.includes('day-propeller')){const speed=out.speed*(1+out.speedPct);out.frontPower+=speed/10*(day.enhanced?.04:.02);out.backPower+=speed/10*(day.enhanced?.02:.01);if(day.enhanced)out.damageAmp+=speed/10*.01;}
  out.dayEquipment=ownedDay;out.gamerAdmin=rules.gamer?.uid===unit.uid&&rules.gamer.admin;
  out.attack=Math.round(out.attack*(1+(unit.zone==='back'?out.backPower:out.frontPower)));
  out.hp=Math.round(out.hp*(1+out.hpPct));out.speed=Math.max(35,Math.round(out.speed*(1+out.speedPct)));out.crit=clamp(out.crit,0,1);out.damageReduction=clamp(out.damageReduction,0,.99);
  for(const e of equipmentEntries(unit).filter(e=>e.passive==='health-to-crit')){const m=e.privileged?2:1;out.crit=Math.min(1,out.crit+Math.min(.4*m,Math.max(0,out.hp-5000*CLASSIC_FLAT_SCALE)/(1000*CLASSIC_FLAT_SCALE)*.02*m));}
  out.defense=out.hp*.15; // Trial DEF proxy; displayed as an explicit 2D approximation.
  out.positionAllowed=positionAllowed;
  return out;
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
  // Dice chooses two derived items for this encounter, never mutating the save.
  const carriedItems=new Map(state.units.map(u=>[u.uid,[...(u.items||[])]]));
  state=clone(state);
  state.units=state.units.map(u=>withNavigatorEquipment(state,u));
  const progression=getProgressionBattleModifiers(state),rules=progression.ruleFlags||{};
  for(const u of state.units)if(u.items.some(id=>resolveEquipment(id)?.baseId==='comet'||id==='comet')){
    // A copied dice is a modification, not permission to replace real equipment.
    // Generated gear only fills vacant ordinary slots; assigned daylight gear stays.
    const carried=carriedItems.get(u.uid)||[],daySlots=dayEquipment(state,u,rules.day).length;
    const vacancies=Math.min(2,Math.max(0,3-carried.length-daySlots));
    const prefix=u.items.includes('privileged:comet')?'privileged:':'';
    const pool=EQUIPMENT.filter(e=>e.tier===2&&e.id!=='comet'&&(!e.unique||!equipmentEntries(u).some(owned=>(owned.baseId||owned.id)===e.id)));
    u._diceDerived=[];
    for(let i=0;i<vacancies&&pool.length;i++){const item=pool.splice(Math.floor(random()*pool.length),1)[0];const id=prefix+item.id;u.items.push(id);u._diceDerived.push(id);}
  }
  const synergies=getBattleSynergies(state), trait=id=>synergies.find(t=>t.id===id)?.level||0;
  const inherited=new Set(state.units.filter(u=>u.zone==='front').flatMap(u=>getUnitBattleTraits(state,u)).filter(id=>trait(id)>0&&TRAITS.find(t=>t.id===id)?.type!=='独立羁绊'));
  const member=(u,id)=>belongs(u,id)||(belongs(u,'savior')&&inherited.has(id));
  const battleEffects=battleStrategy(state);
  const strategy=id=>state.strategies.includes(id);
  const allies=state.units.filter(u=>u.zone!=='bench').map(u=>{
    const c=characterMap.get(u.characterId), s=getBattleStats(state,u);
    return {...s,id:u.uid,characterId:c.id,name:c.name,side:'ally',zone:u.zone,navigatorCopied:u._navigatorCopied||null,temporaryItems:[...(u._diceDerived||[])],maxHp:s.hp,hp:s.hp,traits:getUnitBattleTraits(state,u),extraTraits:[...(u.extraTraits||[])],element:c.element,role:c.role,items:[...u.items],star:u.star,shield:0,energy:20,toughness:0,maxToughness:0,statuses:[],weaknesses:[],archetype:'character'};
  });
  const enemies=clone(options.enemyLineup||getEnemyLineup(state.round)).map((e,i)=>({shield:0,energy:20,toughness:60,maxToughness:60,statuses:[],weaknesses:[],zone:'front',...e,id:e.id||`enemy-${i}`,side:'enemy',maxHp:e.maxHp||e.hp,hp:e.hp??e.maxHp,crit:.04,items:[],element:'物理',archetype:e.archetype||'raider'}));
  const units=[...allies,...enemies];
  const metrics=createCombatMetrics(units);
  for(const [id,row] of Object.entries(metrics.byUnit))row.items=carriedItems.get(id)||row.items;
  const metric=(u,key,value=1)=>{if(u?.side!=='ally'||!Number.isFinite(value))return;if(metrics.byUnit[u.id])metrics.byUnit[u.id][key]=(metrics.byUnit[u.id][key]||0)+value;if(typeof metrics[key]==='number')metrics[key]+=value;};
  for(const u of units){u.next=10000/u.speed;u.acted=0;u.counters=0;u.charges=0;u.autoHeal=0;u.revives=0;u.seeleReset=false;u.hertaTriggered=new Set();u.jingStacks=5;u.itemCharges=0;u.lastProcTurn=-1;u.ultimateCount=0;u.controlResists=0;u.totalAttackHits=0;u.field=0;u.damage=0;u.healing=0;u.shielding=0;u.kills=0;}
  const maxSp=5+(trait('sp')?tierValue([2,3,4,5],trait('sp')):0)+allies.filter(a=>a.positionAllowed&&a.characterId==='1306').reduce((n,a)=>n+starValue([2,3,4,5],a),0)+(allies.some(a=>a.positionAllowed&&a.zone==='back'&&a.characterId==='1508')?2:0);
  let time=0, turn=0, allySp=3, enemySp=5, context=null, reactions=[], winner=null, energyConsumed=0, belobogCharge=6, breakCharge=0, consecutiveAllies=0, bloodPool=0;
  // Countdown battles (rules revision 4): the old client never knocks a character down. A fatal blow
  // brings the character back at full HP (Fandom's node page) and takes reviveLoss points off the
  // remaining countdown; one point is 100 of this simulator's action value.
  const countdown=options.countdown&&Number.isFinite(options.countdown.turns)&&options.countdown.turns>0?options.countdown:null;
  let limit=countdown?countdown.turns*100:Infinity, revives=0;
  const REVIVE_HP=1, RECORD_CAP=249;
  let lastEnergyTime=0;
  const passive=(u,p)=>u.items.some(id=>resolveEquipment(id)?.passive===p);
  const valid=(u,id)=>u.hp>0&&u.characterId===id&&u.positionAllowed!==false;
  const passiveBack=new Set(['1013','1205','1208','1223','1202','1217','1306','1314','1221','1403']);
  const ability=actor=>characterMap.get(actor.characterId)?.empowerments?.find(e=>e.zone===actor.zone)||characterMap.get(actor.characterId)?.empowerments?.[0];
  function skillPoints(amount){const before=allySp;allySp=clamp(allySp+amount,0,maxSp);const actor=context?.actor;const changed=allySp-before;if(changed<0){metrics.skillPointsSpent-=changed;if(actor&&metrics.byUnit[actor.id])metrics.byUnit[actor.id].skillPointsSpent-=changed;}if(changed>0){metrics.skillPointsRestored+=changed;if(actor&&metrics.byUnit[actor.id])metrics.byUnit[actor.id].skillPointsRestored+=changed;}for(const rin of allies.filter(a=>valid(a,'1508')))rin.gems=(rin.gems||0)+Math.abs(allySp-before);if(changed<0&&actor&&passive(actor,'skill-point-refund')&&(actor.pointRefunds||0)<passiveAmount(actor,'skill-point-refund',3,6,false)){actor.pointRefunds=(actor.pointRefunds||0)+1;skillPoints(1);}return changed;}

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
  const snapshot=()=>units.map(u=>({id:u.id,name:u.name,side:u.side,characterId:u.characterId,zone:u.zone,maxHp:u.maxHp,hp:Math.round(u.hp),shield:Math.round(u.shield),energy:Math.round(u.energy),speed:Math.round(effectiveSpeed(u)),attack:Math.round(effectiveAttack(u)),toughness:u.toughness,maxToughness:u.maxToughness,weaknesses:[...u.weaknesses],temporaryItems:[...(u.temporaryItems||[])],statuses:u.statuses.map(s=>({type:s.type,label:s.label,stacks:s.stacks||1,turns:s.turns})),nextAction:Math.round(Math.max(0,u.next-time))}));
  function effectiveAttack(u){return Math.max(1,(u.attack+(status(u,'attackFlat')?.value||0))*(1+(status(u,'attackUp')?.value||0)-(status(u,'attackDown')?.value||0)));}
  function effectiveSpeed(u){return Math.max(35,u.speed*(1+(status(u,'haste')?.value||0)-(status(u,'slow')?.value||0)));}
  function addStatus(u,type,label,value,turns=2,source=null,stack=false){
    if(!u||u.hp<=0)return;
    if(['frozen','slow'].includes(type)&&(u.characterId==='1204'&&u.positionAllowed!==false))return;
    if(type==='frozen'&&u.controlResists>0){u.controlResists--;note(`${u.name}抵抗控制`);return;}
    if(u.side==='enemy'&&source?.side==='ally'&&['exposed','slow','frozen','burn','shock','wind','arcana','implanted','attackDown'].includes(type)){
      for(const acheron of allies.filter(a=>valid(a,'1308')))if(u.markTurn!==turn){u.markTurn=turn;const mark=status(u,'acheron');if(mark)mark.stacks=Math.min(9,mark.stacks+1);else u.statuses.push({type:'acheron',label:'飞雷紫',value:0,turns:99,stacks:1,sourceId:acheron.id,appliedTurn:turn});energy(acheron,10);}
    }
    if(u.side==='enemy'&&source?.side==='ally'&&['exposed','slow','frozen','burn','shock','wind','arcana','ocean','implanted','attackDown','lihuo','bait'].includes(type))metric(source,'negativeApplications');
    const existing=status(u,type);
    if(existing){existing.turns=Math.max(existing.turns,turns);existing.value=Math.max(existing.value,value);if(stack)existing.stacks=Math.min(type==='arcana'?50+(rules.seer?.arcanaExtraCap||0):type==='ocean'?99:5,(existing.stacks||1)+1);if(source)existing.sourceId=source.id;existing.appliedTurn=turn;}
    else u.statuses.push({type,label,value,turns,stacks:1,sourceId:source?.id,appliedTurn:turn});
    if(source?.side==='ally'&&u.side==='ally'&&source!==u)targetChange(u,'buff',1);
  }
  function targetChange(u,key,value){if(!context)return;let t=context.targets.find(t=>t.id===u.id);if(!t){t={id:u.id};context.targets.push(t);}t[key]=(t[key]||0)+Math.round(value);}
  function note(text){if(context)context.notes.push(text);}
  function energy(u,amount){if(u.hp<=0)return;const gain=clamp(u.energy+amount,0,100)-u.energy;u.energy+=gain;targetChange(u,'energy',gain);}
  function supportEffects(source,target){
    if(passive(source,'protective-support'))addStatus(target,'guard','痛觉阻断',passiveAmount(source,'protective-support',.15,.3,false),2,source);
    if(passive(source,'ally-skill-confidence')){addStatus(target,'attackUp','信心注入',passiveAmount(source,'ally-skill-confidence',.3,.6,false),2,source);addStatus(target,'guard','信心减伤',passiveAmount(source,'ally-skill-confidence',.1,.2,false),2,source);}
  }
  function heal(source,target,amount){if(!target||target.hp<=0||amount<=0)return 0;const gain=Math.min(target.maxHp-target.hp,Math.round(amount*(1+(source.healAmp||0))));target.hp+=gain;source.healing+=gain;metric(source,'healing',gain);targetChange(target,'heal',gain);supportEffects(source,target);return gain;}
  function shield(source,target,amount,duration=3){if(!target||target.hp<=0)return;
    if(target.side==='ally'&&trait('blood')&&member(target,'blood')){heal(source,target,target.maxHp*.02+1000*CLASSIC_FLAT_SCALE);note('燃血：护盾转化为治疗');return;}
    const gain=Math.max(0,Math.min(target.maxHp-target.shield,Math.round(amount*(1+(source.shieldAmp||0)))));target.shield+=gain;if(gain>0)(target.shieldLayers??=[]).push({amount:gain,expires:target.acted+duration});source.shielding+=gain;metric(source,'shielding',gain);targetChange(target,'shield',gain);supportEffects(source,target);
  }
  function consumeHp(actor,amount){const loss=Math.max(0,Math.min(actor.hp-1,Math.round(amount)));actor.hp-=loss;metric(actor,'hpLost',loss);metrics.allyHpLost+=loss;targetChange(actor,'damage',loss);bloodPool+=loss;triggerBlood(actor,loss);return loss;}
  function triggerBlood(target,loss){
    if(!loss||target.side!=='ally')return;
    if(target.characterId==='1404')target.charges=Math.min(200,target.charges+loss/target.maxHp*300);
    for(const blade of allies.filter(a=>valid(a,'1205')&&a.zone==='back'&&target.zone==='front'))if(blade.bloodTurn!==turn){blade.bloodTurn=turn;const damage=Math.min(blade.hp-1,Math.round(blade.maxHp*.15));blade.hp-=damage;metric(blade,'hpLost',damage);metrics.allyHpLost+=damage;targetChange(blade,'damage',damage);blade.charges++;if(blade.charges>=5){blade.charges=0;reactions.push({type:'blade',sourceId:blade.id});}}
    for(const f of allies.filter(a=>valid(a,'1208')&&a.zone==='back'))if(target.hp/target.maxHp<.3&&f.revives>0){f.revives--;for(const a of front('ally'))heal(f,a,(a.maxHp-a.hp)*starValue([.6,.8,1],f));}
  }
  function event(actor,kind,skill,fn,text=''){
    // Without a countdown the replay cap also ends the fight. With one, the fight keeps running past
    // the cap so the result is complete; only the replay stops recording (the end is always kept).
    const record=events.length<RECORD_CAP||kind==='end'&&countdown;
    if(!record&&!countdown)return;
    const before=context;context={targets:[],notes:[],kind,actor,explicitAttacks:0};fn();if(actor&&passive(actor,'ally-skill-confidence')&&['skill','support','ultimate'].includes(kind))for(const t of [...context.targets]){const ally=units.find(u=>u.id===t.id);if(ally?.side===actor.side)supportEffects(actor,ally);}if(actor&&['basic','skill','support','ultimate','followup'].includes(kind))afterAttack(actor,kind);
    if(!record){context=before;return;}
    const current=context;
    const effects=current.targets.map(t=>{const target=units.find(u=>u.id===t.id);const list=[];if(t.damage)list.push(`${t.damage} 伤害`);if(t.absorbed)list.push(`护盾吸收 ${t.absorbed}`);if(t.heal)list.push(`治疗 ${t.heal}`);if(t.shield)list.push(`护盾 +${t.shield}`);if(t.energy>0)list.push(`能量 +${t.energy}`);return list.length?`${target.name}：${list.join('，')}`:'';}).filter(Boolean);
    events.push({index:events.length,time:Math.round(time),turn,actorId:actor?.id||null,actorName:actor?.name||'战场',kind,skill,text:[text||`${actor?.name||'战场'}${actor?.zone==='back'?'从后台协同，':''}施放「${skill}」`,...effects,...current.notes].filter(Boolean).join('；'),targets:current.targets,snapshot:snapshot(),skillPoints:allySp,...(countdown?{countdown:Math.max(0,Math.round(limit-time))/100}:{})});context=before;
  }
  function rawDamage(source,target,amount,{dot=false,follow=false,breakHit=false,toughness=20,canReact=true,trueDamage=false,nonlethal=false,guaranteedCrit=false}={}){
    if(!target||target.hp<=0||(!dot&&source.hp<=0)||!Number.isFinite(amount))return 0;
    const preRatio=target.hp/target.maxHp, beforeHp=target.hp,beforeShield=target.shield;
    let modifier=trueDamage?1:1+(source.damageAmp||0)+(status(source,'damageUp')?.value||0)+(status(source,'mentorDamage')?.value||0)+(rules.enemyVulnerability&&source.side==='ally'?rules.enemyVulnerability:0)+(status(target,'exposed')?.value||0)+(status(target,'broken')?.value||0);
    if(!trueDamage){
      if(source.side==='ally'&&trait('quantum'))modifier+=tierValue([.15,.3,.6,1],trait('quantum'));
      if(dot)modifier*=1+(source.dotAmp||0)+(status(target,'dotExposed')?.value||0);
      if(['basic','skill'].includes(context?.kind))modifier*=1+(source.basicSkillDamage||0);
      if(target.boss||target.archetype==='guard')modifier+=source.eliteDamage||0;
      if(follow)modifier*=1+(source.followAmp||0)+(status(source,'followUp')?.value||0);
      if(context?.kind==='ultimate')modifier*=1+(source.ultimateAmp||0)+(status(target,'ultExposed')?.value||0);
      if(source.side==='ally'&&['basic','skill'].includes(context?.kind)&&trait('sp'))modifier*=1+tierValue([.12,.24,.48,.8],trait('sp'))*(member(source,'sp')?2:1);
      if(source.zone==='front')for(const e of equipmentEntries(source).filter(e=>e.passive==='healthy-frontline'))if(source.hp/source.maxHp>(e.privileged?.5:.7))modifier+=e.privileged?.6:.3;
      if(passive(source,'elite-execution')&&(target.boss||['guard','aurumaton','svarog','doomsday'].includes(target.archetype)))modifier+=passiveAmount(source,'elite-execution',.4);
      if(!dot&&!breakHit&&(guaranteedCrit||random()<Math.min(1,(source.crit||0)+(status(source,'critUp')?.value||0)))){modifier*=1+(source.critDamage??.5)+(status(source,'critDamageUp')?.value||0);note('幸运一击');}
      modifier*=1-clamp((target.damageReduction||0)+(status(target,'guard')?.value||0),0,.99);
    }
    let hit=Math.max(1,Math.round(amount*modifier));
    const yunli=target.side==='ally'&&canReact&&!dot&&allies.find(a=>valid(a,'1221')&&a.zone==='back'&&a.charges>0&&a.protectTurn!==turn);
    if(yunli){yunli.charges--;yunli.protectTurn=turn;hit=0;note('云璃剑盾抵挡本次攻击');reactions.push({type:'yunli',sourceId:yunli.id,targetId:source.id});}
    const absorbed=Math.min(target.shield,hit);target.shield-=absorbed;hit-=absorbed;let drain=absorbed;for(const layer of target.shieldLayers||[]){const used=Math.min(layer.amount,drain);layer.amount-=used;drain-=used;}if(target.shieldLayers)target.shieldLayers=target.shieldLayers.filter(l=>l.amount>0);
    const hpDamage=Math.max(0,Math.min(nonlethal?target.hp-1:target.hp,hit));target.hp-=hpDamage;source.damage+=hpDamage+absorbed;metric(source,'damage',hpDamage+absorbed);metric(source,'hpDamage',hpDamage);metric(source,'overkillDamage',Math.max(0,hit-beforeHp));metric(target,'damageTaken',hpDamage);metric(target,'shieldAbsorbed',absorbed);if(target.side==='ally'){metric(target,'hpLost',hpDamage);metrics.allyHpLost+=hpDamage;}
    targetChange(target,'damage',hpDamage);if(absorbed)targetChange(target,'absorbed',absorbed);
    if(!dot&&!breakHit)energy(target,8);
    if(target.side==='ally'&&hpDamage>0){bloodPool+=hpDamage;triggerBlood(target,hpDamage);}
    if(!dot&&!breakHit&&passive(source,'vulnerability-35'))addStatus(target,'exposed','装备易伤',passiveAmount(source,'vulnerability-35',.35,.7,false),2,source);
    if(target.hp<=0&&countdown&&target.side==='ally'){
      target.hp=Math.max(1,Math.round(target.maxHp*REVIVE_HP));revives++;limit-=countdown.reviveLoss*100;metric(target,'revives');
      note(`${target.name}受到致命攻击，战斗倒计时减少！`);
    }
    else if(target.hp<=0){target.hp=0;target.shield=0;target.statuses=[];source.kills++;metric(source,'kills');note(`${target.name}退场`);
      if(passive(source,'kill-damage-25')&&!source.killGearTriggered){source.killGearTriggered=true;source.damageAmp=(source.damageAmp||0)+passiveAmount(source,'kill-damage-25',.25);}
      if(source.characterId==='1102'&&!source.seeleReset){source.seeleReset=true;source.next=Math.min(source.next,time+1);note('希儿「再现」：立即追加行动');}
      for(const h of allies.filter(a=>valid(a,'1013'))){h.attack*=1.01;}
    }
    if(!dot&&!breakHit&&target.hp>0&&target.maxToughness>0&&!status(target,'broken')&&(target.weaknesses.includes(source.element)||status(target,'implanted'))){
      const elite=passive(source,'elite-execution')&&(target.boss||target.archetype==='guard')?passiveAmount(source,'elite-execution',.25):0;
      target.toughness=Math.max(0,target.toughness-Math.round(toughness*(1+(source.breakBonus||0)+elite+((target.boss||target.archetype==='guard')?(source.eliteBreak||0):0))));
      if(target.toughness===0){metric(source,'toughnessBroken');addStatus(target,'broken','弱点击破',.2,1,source);target.next+=35;note(`${target.name}被弱点击破，行动延后`);reactions.push({type:'break',sourceId:source.id,targetId:target.id});}
    }
    if(canReact&&!dot&&!breakHit){
      if(source.side==='ally'&&trait('break')&&member(source,'break')&&status(target,'broken'))rawDamage(source,target,source.attack*(toughness/20)*tierValue([1.2,1.8,3,5],trait('break'))*(1+(source.breakEffect||0)),{breakHit:true,canReact:false,toughness:0});
      if(source.characterId==='1310'&&source.positionAllowed!==false)rawDamage(source,target,source.attack*(toughness/20)*starValue([.5,1,2.5],source)*(1+(source.breakEffect||0)),{breakHit:true,canReact:false,toughness:0});
      if(passive(target,'shield-retaliation')&&beforeShield>0&&source.hp>1)rawDamage(target,source,beforeShield*passiveAmount(target,'shield-retaliation',2.5),{trueDamage:true,nonlethal:true,canReact:false,toughness:0});
      if(target.characterId==='1107'&&target.hp>0)reactions.push({type:'counter',sourceId:target.id,targetId:source.id});
      if(!follow&&target.side==='ally'&&target.hp>0){
        for(const healer of allies.filter(a=>valid(a,'1203')&&a.autoHeal<=0))if(target.hp/target.maxHp<.5){healer.autoHeal=2;reactions.push({type:'autoheal',sourceId:healer.id,targetId:target.id});}
        for(const shielder of allies.filter(a=>a.hp>0&&passive(a,'emergency-shield')&&a.itemCharges<passiveAmount(a,'emergency-shield',5,10,false)))if(target.zone==='front'&&target.hp/target.maxHp<.5){shielder.itemCharges++;shield(shielder,target,shielder.defense*passiveAmount(shielder,'emergency-shield',3,6,false),2);}
      }
    }
    if(!isClassic(target)&&target.characterId==='1205'&&hpDamage>0){target.charges++;if(target.charges>=5){target.charges=0;reactions.push({type:'blade',sourceId:target.id});}}
    if(target.side==='enemy')for(const herta of allies.filter(u=>valid(u,'1013')))for(const threshold of target.boss?[.75,.5,.25]:[.5])if(preRatio>threshold&&target.hp/target.maxHp<=threshold&&!herta.hertaTriggered.has(`${target.id}:${threshold}`)){herta.hertaTriggered.add(`${target.id}:${threshold}`);reactions.push({type:'herta',sourceId:herta.id});}
    return hpDamage+absorbed;
  }
  function hit(actor,target,mult,opts={}){rawDamage(actor,target,effectiveAttack(actor)*mult*(isClassic(actor)?1:actor.zone==='back'?(strategy('backline')?1:.72):1),opts);}
  function aoe(actor,mult,opts={}){for(const target of damageTargets(actor))hit(actor,target,mult,opts);}
  function buffAll(actor,type,label,value,turns=2){for(const a of alive(actor.side))addStatus(a,type,label,value,turns,actor);note(`${label}生效`);}
  function applyDot(actor,target,type,label,mult,turns=3,stack=false){if(target&&target.hp>0){addStatus(target,type,label,effectiveAttack(actor)*mult*(isClassic(actor)?1:actor.zone==='back'?(strategy('backline')?1:.72):1),turns,actor,stack);note(`${target.name}获得${label}${stack?'层数':''}`);}}
  function dotDamage(owner,d){return d.type==='arcana'?d.value+effectiveAttack(owner)*starValue([.2,.25,1],owner)*(rules.seer?.arcanaMultiplier||1)*Math.max(0,(d.stacks||1)-1):d.value*(d.stacks||1);}
  function detonate(actor,target,factor=1){if(!target||target.hp<=0)return;for(const d of [...target.statuses].filter(s=>['burn','shock','wind','arcana','ocean','activation'].includes(s.type))){const owner=units.find(u=>u.id===d.sourceId)||actor;rawDamage(owner,target,dotDamage(owner,d)*factor,{dot:true,canReact:false,toughness:0});}note('引爆已有持续伤害');}
  function allySkill(actor,ultimate=false,back=false){
    const c=actor.characterId,target=livingTarget(actor),weak=lowAlly(actor),carry=strongest(actor),self=actor;
    const scale=back?(strategy('backline')?1:.72):1;
    if(actor.positionAllowed===false){if(!back){hit(actor,target,1,{toughness:20});note('站位未激活赋能，仅普通攻击');}return;}
    if(ultimate&&actor.characterId==='1209'&&state.strategies.includes('feiguang-sword')&&rules.mentor){const jing=allies.find(a=>a.characterId==='1204');if(jing?.damage>0){for(const enemy of damageTargets(actor))rawDamage(actor,enemy,jing.damage*rules.mentor.swordEchoRatio,{trueDamage:true,canReact:false,toughness:0});note(`飞光·传剑附加景元累计伤害的${Math.round(rules.mentor.swordEchoRatio*100)}%`);}}
    if(isClassic(actor)&&classicAction(actor,{ultimate,back,c:characterMap.get(c),target,weak,carry,hit,aoe,rawDamage,heal,shield,energy,buffAll,addStatus,applyDot,detonate,alive:alive(actor.side),front:front(actor.side),targets:damageTargets(actor),livingTarget,random,consumeHp,skillPoints,note,advance:(u,p)=>u.next=Math.max(time+1,u.next-(10000/effectiveSpeed(u))*p),trait,time,sourceSkills:ability(actor)?.skills||[],sp:()=>allySp,recordAttack:()=>recordAttack(actor),rules}))return;
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
  function applyRuntimeEquipment(target,id,reason='临时装备'){
    const equipment=resolveEquipment(id);if(!equipment)return false;
    if(equipment.unique&&target.items.includes(id))return false;
    const runtimeState=()=>({...state,units:state.units.map(u=>{const a=allies.find(a=>a.id===u.uid);return a?{...u,items:[...a.items],_projectedCount:a.projectedCount||0}:u;})});
    const beforeState=runtimeState(),before=new Map(allies.map(a=>[a.id,getBattleStats(beforeState,beforeState.units.find(u=>u.uid===a.id))]));
    target.items.push(id);target.projectedCount=(target.projectedCount||0)+1;(target.temporaryItems??=[]).push(id);
    const afterState=runtimeState();
    for(const a of alive('ally')){
      const prior=before.get(a.id),next=getBattleStats(afterState,afterState.units.find(u=>u.uid===a.id));
      a.attack*=next.attack/Math.max(1,prior.attack);a.speed*=next.speed/Math.max(1,prior.speed);
      const hpBefore=a.maxHp;a.maxHp=Math.round(a.maxHp*next.hp/Math.max(1,prior.hp));a.hp=clamp(a.hp+a.maxHp-hpBefore,1,a.maxHp);a.defense=a.maxHp*.15;
      for(const key of ['crit','critDamage','breakBonus','breakEffect','damageAmp','damageReduction','healAmp','shieldAmp','followAmp','dotAmp','ultimateAmp'])a[key]=(a[key]||0)+(next[key]||0)-(prior[key]||0);
    }
    metrics.projectedEquipment.push({turn,time:Math.round(time),uid:target.id,characterId:target.characterId,itemId:id,reason});
    note(`${target.name}获得${reason}「${equipment.name}」，战后消失`);return true;
  }
  function projectEquipment(actor){
    const choices=[...alive('ally')];for(let i=choices.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
    for(const a of choices.slice(0,3)){
      let pool=a.zone==='back'?['orbital','catapult','electric']:['blade','firestorm','boots'];
      if(a.role==='守护')pool=['cover-gun','revenge-armor','hard-armor'];else if(a.role==='治疗')pool=['bastion','garden','absolute-heat'];else if(member(a,'break'))pool=['wormhole-drill','cannon','boots'];
      const eligible=pool.filter(id=>!resolveEquipment(id)?.unique||!a.items.includes(id));
      if(eligible.length)applyRuntimeEquipment(a,eligible[Math.floor(random()*eligible.length)],'魔术师投影');
    }
  }
  function recordAttack(actor){
    metric(actor,'attacks');if(context)context.explicitAttacks++;
    if(valid(actor,'1015')&&trait('magician')){actor.projectionCharge=(actor.projectionCharge||0)+1;if(actor.projectionCharge>=6){actor.projectionCharge-=6;projectEquipment(actor);}}
  }
  function afterAttack(actor,kind){
    if(actor.side!=='ally'||!context)return;
    const attacked=context.targets.filter(t=>(t.damage||0)+(t.absorbed||0)>0).map(t=>units.find(u=>u.id===t.id)).filter(t=>t?.side==='enemy');
    if(!attacked.length)return;
    actor.totalAttackHits++;if(!context.explicitAttacks)recordAttack(actor);if(kind==='followup')metric(actor,'followups');
    const first=attacked.find(t=>t.hp>0)||livingTarget(actor),regular=kind!=='followup';
    if(passive(actor,'firestorm'))addStatus(actor,'attackUp','火力风暴潮',passiveAmount(actor,'firestorm',.08)*actor.totalAttackHits,99,actor);
    if(passive(actor,'percent-true-damage')&&actor.dissolverTurn!==turn){actor.dissolverTurn=turn;const t=attacked[Math.floor(random()*attacked.length)];rawDamage(actor,t,t.maxHp*passiveAmount(actor,'percent-true-damage',.03,.06,false),{trueDamage:true,canReact:false,toughness:0});}
    if(status(actor,'epic'))for(const t of attacked){const recorded=context.targets.find(x=>x.id===t.id);rawDamage(actor,t,(recorded?.damage||0)*status(actor,'epic').value,{trueDamage:true,canReact:false,toughness:0});}
    if(regular&&trait('follow')&&member(actor,'follow')){reactions.push({type:'trait-follow',sourceId:actor.id,targetId:first?.id});addStatus(actor,'followUp','连续行动',Math.min(tierValue([.2,.4,.6,1.2],trait('follow')),consecutiveAllies*tierValue([.05,.1,.15,.3],trait('follow'))),1,actor);}
    if(trait('debuff')&&member(actor,'debuff'))for(const t of attacked.filter(t=>t.hp>0&&t.statuses.some(s=>['exposed','slow','frozen','burn','shock','wind','arcana','ocean','implanted'].includes(s.type)))){addStatus(t,'lihuo','离火',tierValue([.1,.2,.3,.5],trait('debuff')),99,actor,true);addStatus(t,'attackDown','离火削弱',tierValue([.03,.04,.05,.06],trait('debuff'))*(status(t,'lihuo')?.stacks||1),99,actor);}
    for(const t of attacked.filter(t=>t.hp>0&&status(t,'lihuo')))rawDamage(actor,t,actor.attack*status(t,'lihuo').value*status(t,'lihuo').stacks,{trueDamage:true,canReact:false,toughness:0});
    for(const unit of alive('ally')){
      if(valid(unit,'1306'))energy(unit,5);
      if(valid(unit,'1406')&&actor.zone==='back')unit.recordedDamage=(unit.recordedDamage||0)+context.targets.reduce((sum,t)=>sum+(t.damage||0),0)*.5;
      if(valid(unit,'1504')&&unit!==actor&&actor.zone==='front'&&unit.charges>0){energy(unit,8);unit.charges--;rawDamage(unit,first,unit.attack*starValue(unit.zone==='back'?[2.4,3,4.32,6.72]:[1.75,2.18,3.15,4.9],unit),{follow:true,canReact:false});}
      if(valid(unit,'1412')&&unit.collector===actor.id){unit.charges++;rawDamage(unit,first,unit.attack*starValue([1.2,1.8,3.6],unit),{canReact:false});if(unit.charges>=6&&kind==='skill'){unit.charges-=6;const original=context.targets.filter(t=>t.damage).map(t=>({...t}));for(const t of original)rawDamage(actor,units.find(u=>u.id===t.id),t.damage,{trueDamage:true,canReact:false});note('爵位奇袭：复制本次伤害结算，不复制资源消耗');}}
      if(valid(unit,'1507')&&unit.field>0&&unit!==actor){unit.charges+=actor.zone==='front'?1:.5;if(unit.charges>=9){unit.charges-=9;reactions.push({type:'new-blade',sourceId:unit.id});}}
      if(valid(unit,'1102')&&unit!==actor&&regular&&unit.followTurn!==turn&&first?.hp/first?.maxHp<=.7){unit.followTurn=turn;reactions.push({type:'seele',sourceId:unit.id,targetId:first?.id});}

      if(valid(unit,'1218'))heal(unit,lowAlly(unit),unit.attack*starValue([.12,.18,.24],unit));
      if(valid(unit,'1301')&&unit.zone==='back'&&actor.zone==='front')heal(unit,actor,starValue([64,96,128,160],unit));
      if(valid(unit,'1203')&&unit.zone==='back'&&actor.zone==='front'){heal(unit,actor,unit.attack*starValue([.32,.48,.64],unit)+starValue([40,60,80],unit));for(const t of front('ally').filter(t=>t!==actor))heal(unit,t,unit.attack*starValue([.16,.24,.32],unit)+starValue([20,30,40],unit));}
      if(valid(unit,'1307')&&random()<.65)for(const t of attacked)applyDot(unit,t,'arcana','奥迹',starValue([3,3.75,15],unit),99,true);
      if(valid(unit,'1220')&&unit!==actor&&actor.zone==='front'&&unit.followTurn!==turn){unit.followTurn=turn;reactions.push({type:'feixiao',sourceId:unit.id,targetId:first?.id});}
      if(valid(unit,'1223')&&actor.zone==='front'){rawDamage(unit,first,unit.attack*starValue([.3,.37,.54,.84],unit),{canReact:false,toughness:0});unit.charges++;if(unit.charges>=10){unit.charges-=10;reactions.push({type:'moze',sourceId:unit.id,targetId:first?.id});}}
      if(valid(unit,'1314')&&unit.collector===actor.id){consumeHp(actor,actor.maxHp*.02);for(const t of attacked)rawDamage(unit,t,unit.attack*.25,{canReact:false,toughness:0});unit.charges+=attacked.length;if(unit.charges>=8){unit.charges-=8;reactions.push({type:'jade',sourceId:unit.id});}}
      if(valid(unit,'1309')&&unit.field>0&&unit!==actor){for(let i=0;i<2;i++)rawDamage(unit,first,unit.attack*starValue([1.2,1.5,2.16],unit),{follow:true,guaranteedCrit:true,canReact:false,toughness:0});}
      if(valid(unit,'1403')&&unit.field>0&&unit!==actor)rawDamage(unit,first,unit.maxHp*starValue(unit.zone==='back'?[.12,.15,.216,.336]:[.105,.131,.189,.294],unit)*attacked.length,{canReact:false,toughness:0});
      if(valid(unit,'1112')&&unit!==actor)unit.next=Math.max(time+1,unit.next-(10000/effectiveSpeed(unit))*starValue(kind==='followup'?[.12,.12,.5]:[.08,.08,.5],unit));
      if(valid(unit,'1321')&&unit!==actor&&regular&&unit.followTurn!==turn&&member(actor,'break')){unit.followTurn=turn;reactions.push({type:'dahlia',sourceId:unit.id});}
    }
  }
  function afterAction(actor,kind,artificialUltimate=false){
    if(actor.side!=='ally'){consecutiveAllies=0;for(const a of allies){if(valid(a,'1105')&&a.zone==='back')energy(a,10);if(valid(a,'1221'))energy(a,10);if(valid(a,'1104')){a.charges++;if(a.charges>=4){a.charges-=4;reactions.push({type:'gepard',sourceId:a.id});}}}return;}
    consecutiveAllies++;metric(actor,'actions');
    if(kind==='ultimate'){metric(actor,'ultimates');if(!actor.perpetualFree&&!artificialUltimate)metric(actor,'naturalUltimates');
      if(!actor.perpetualFree&&!artificialUltimate){actor.ultimateCount++;energyConsumed+=100;}actor.perpetualFree=false;
      for(const saber of allies.filter(a=>valid(a,'1014')&&a!==actor)){saber.saberBounces=Math.min(starValue(saber.zone==='back'?[4,6,8]:[4,8,12],saber),(saber.saberBounces||0)+starValue(saber.zone==='back'?[1,1,1]:[1,2,3],saber));saber.charges+=starValue([5,6,7],saber);}
      for(const gil of allies.filter(a=>valid(a,'1509')&&a!==actor)){energy(gil,30);gil.ultimateAmp+=starValue([.25,.3,.35,.4],gil);}

      if(passive(actor,'ultimate-team-speed')){skillPoints(passiveAmount(actor,'ultimate-team-speed',1));buffAll(actor,'haste','流星飞翼',passiveAmount(actor,'ultimate-team-speed',.15),2);}
      if(passive(actor,'ultimate-luck'))actor.crit=Math.min(1,actor.crit+passiveAmount(actor,'ultimate-luck',.1)*((actor.itemUltimateCount=(actor.itemUltimateCount||0)+1)<=5?1:0));
      if(passive(actor,'team-action-heal'))energy(actor,passiveAmount(actor,'team-action-heal',10,20,false));
      if(!artificialUltimate&&passive(actor,'perpetual-ultimate')&&actor.ultimateCount>0&&actor.ultimateCount%3===0)reactions.push({type:'item-ultimate',sourceId:actor.id});
    if(trait('energy'))for(const a of front('ally').slice(0,1))energy(a,3);
      if(energyConsumed>=500&&trait('energy')>=2){energyConsumed-=500;reactions.push({type:'energy-wave',sourceId:actor.id});}
      for(const u of allies.filter(a=>valid(a,'1403'))){energy(u,20);u.charges++;if(u.charges>=2){u.charges=0;reactions.push({type:'tribbie',sourceId:u.id});}}
    }
    for(const u of alive('ally'))if(passive(u,'team-action-heal'))heal(u,u,u.maxHp*passiveAmount(u,'team-action-heal',.2,.4,false));
    if(trait('mentor')>=2&&member(actor,'mentor')&&['skill','ultimate'].includes(kind))for(const a of alive('ally').filter(a=>a!==actor&&member(a,'mentor'))){a.next=Math.max(time+1,a.next-10000/effectiveSpeed(a)*.3);a.inheritance=Math.min(99,(a.inheritance||0)+(kind==='ultimate'?3:2));addStatus(a,'mentorDamage','师徒·传承',a.inheritance*.1,99,actor);note(`${a.name}获得${kind==='ultimate'?3:2}层传承，行动提前30%`);}
    if(trait('belobog')&&member(actor,'belobog')){belobogCharge++;if(belobogCharge>=10){belobogCharge=0;reactions.push({type:'engine',sourceId:actor.id});}}
    if(trait('hunters')&&member(actor,'hunters')){
      const leaders=allies.filter(a=>a.hp>0&&member(a,'hunters')).sort((a,b)=>b.items.length-a.items.length).slice(0,trait('hunters')>=3?2:1);
      for(const lead of leaders){lead.hunterCharge=(lead.hunterCharge||0)+1;const needed=({'1205':4,'1005':4,'1006':5,'1310':6,'1506':7,'1507':6}[lead.characterId]||5);if(lead.hunterCharge>=needed){lead.hunterCharge=0;lead.next=Math.min(lead.next,time+1);note(`${lead.name}通缉令充能完成，行动提前`);}}
    }
    if(trait('guardian')&&actor.zone==='front'){const bronya=allies.find(a=>valid(a,'1101'));if(bronya){bronya.guardianCharge=(bronya.guardianCharge??rules.guardian?.initialCharge??4)+1;if(bronya.guardianCharge>=(rules.guardian?.chargeThreshold||8)){bronya.guardianCharge=0;reactions.push({type:'guardian',sourceId:bronya.id});}}}
    for(const b of battleEffects)if(b.damageAfterTime&&time>=b.damageAfterTime)for(const a of alive('ally'))addStatus(a,'damageUp','延迟收益',b.delayedDamage,99,a);
  }
  function setBattleTime(next){time=Math.max(time,next);for(const u of alive('ally'))if(passive(u,'action-value-energy'))energy(u,(time-lastEnergyTime)*passiveAmount(u,'action-value-energy',2,4,false));lastEnergyTime=time;}
  function beforeAction(actor){
    if(actor.shieldLayers){const expired=actor.shieldLayers.filter(l=>l.expires<=actor.acted).reduce((n,l)=>n+l.amount,0);actor.shield=Math.max(0,actor.shield-expired);actor.shieldLayers=actor.shieldLayers.filter(l=>l.expires>actor.acted);if(expired)note('到期护盾消失');}
    if(actor.side==='ally'){
      if(passive(actor,'accelerating-boots'))addStatus(actor,'haste','反重力加速',actor.acted*passiveAmount(actor,'accelerating-boots',.15),99,actor);
      if(passive(actor,'energy-each-turn'))energy(actor,passiveAmount(actor,'energy-each-turn',10,20,false));
      actor.pointRefunds=0;if(passive(actor,'skill-point-refund')){skillPoints(1);actor.pointRefunds++;}
      if(passive(actor,'turn-team-shield'))for(const a of front('ally'))shield(actor,a,actor.maxHp*passiveAmount(actor,'turn-team-shield',.3),2);
      if(actor.zone==='front'&&rules.scholar){const source=allies.find(a=>a.hp>0&&member(a,'scholar'));if(source){heal(source,actor,actor.maxHp*rules.scholar.frontHealRatio);note(`猫猫糕 Lv.${rules.scholar.level} 回合治疗`);}}
      if(actor.zone==='front')for(const unit of allies){
        if(valid(unit,'1202'))energy(unit,10);
        if(valid(unit,'1217')){energy(unit,8);const amount=unit.maxHp*starValue([.045,.051,.058,.065],unit)+starValue([12,13.8,15.6,17.4],unit);heal(unit,actor,amount);heal(unit,lowAlly(unit),amount);}
      }
    }else if(trait('dot')){
      const owner=allies.filter(a=>a.hp>0&&member(a,'dot')).sort((a,b)=>b.attack-a.attack)[0];
      if(owner){const mult=tierValue([2.4,4.8,9.6],trait('dot')),count=tierValue([2,3,6],trait('dot'));for(let i=0;i<count;i++){const t=livingTarget(owner);applyDot(owner,t,'activation','超活化',mult,2);detonate(owner,t,2.5);}note('持续伤害羁绊：超活化与引爆');}
    }
  }
  function delayAction(target,amount){if(!target)return;if(target.side==='ally'&&target.shield>0&&allies.some(a=>a.hp>0&&passive(a,'emergency-shield'))){note('光能盾牌抵抗行动延后');return;}target.next+=amount;}
  function enemyAction(actor,ultimate){
    const target=livingTarget(actor), mult=ultimate?1.4:1;
    switch(actor.archetype){
      case 'medic':heal(actor,lowAlly(actor),actor.maxHp*.25);if(ultimate)for(const a of front(actor.side))shield(actor,a,actor.maxHp*.1);break;
      case 'guard':shield(actor,actor,actor.maxHp*.15);hit(actor,target,1.05*mult,{toughness:0});break;
      case 'caster':aoe(actor,(ultimate?.95:.68),{toughness:0});if(ultimate&&target)applyDot(actor,target,'shock','触电',.35,2);break;
      case 'aurumaton':if(ultimate){aoe(actor,1.15,{toughness:0});addStatus(actor,'guard','惩戒模式',.2,2,actor);}else {hit(actor,target,1.65,{toughness:0});if(target)delayAction(target,15);}break;
      case 'svarog':if(ultimate)aoe(actor,1.35,{toughness:0});else {hit(actor,target,1.75,{toughness:0});if(target){addStatus(target,'slow','机械禁锢',.2,2,actor);delayAction(target,20);}}break;
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
        event(source,'break','弱点击破',()=>{rawDamage(source,target,source.attack*.65*(1+(source.breakEffect||0)),{breakHit:true,canReact:false});if(source.side==='ally'&&trait('break')){breakCharge+=target.boss?6:target.archetype==='guard'?3:1;if(breakCharge>=12&&trait('break')>=2){breakCharge-=12;reactions.push({type:'break-wave',sourceId:source.id});}}},`${source.name}击破${target.name}的韧性`);
        const himeko=alive(source.side).find(u=>valid(u,'1003')&&u.zone==='back');if(himeko){himeko.charges+=target.boss?3:1;if(himeko.charges>=3){himeko.charges=0;reactions.push({type:'himeko',sourceId:himeko.id});}}
      }else if(r.type==='counter'||r.type==='march')event(source,'followup',r.type==='march'?'少女的特权':'史瓦罗反击',()=>{hit(source,target,r.type==='march'?.75:source.charges>0?2:1.3,{follow:true,canReact:false,toughness:15});if(source.charges>0)source.charges--;energy(source,10);});
      else if(r.type==='herta'||r.type==='himeko')event(source,'followup',r.type==='herta'?'还是转圈圈':'乘胜追击',()=>{aoe(source,r.type==='herta'?starValue(source.zone==='back'?[.8,1,1.44,2.24]:[.36,.45,.65,1.01],source):starValue([2,2.5,3.6],source),{follow:true,canReact:false,toughness:15});energy(source,10);});
      else if(r.type==='blade')event(source,'followup','倏忽恩赐',()=>{for(const t of damageTargets(source))rawDamage(source,t,source.maxHp*starValue([1.8,2.25,3.24,5.04],source),{follow:true,canReact:false,toughness:20});heal(source,source,source.maxHp);});
      else if(r.type==='autoheal')event(source,'heal','怜愍愚人',()=>heal(source,target,source.attack*starValue([.64,.96,1.28],source)+starValue([40,60,80],source)));
      else if(r.type==='fuxuan')event(source,'heal','否极泰来',()=>heal(source,source,source.maxHp*.4));
      else if(r.type==='lightning')event(source,'followup','神君·奔腾',()=>{const stacks=source.jingStacks;source.jingStacks=5;for(let i=0;i<stacks;i++)hit(source,livingTarget(source),starValue([1.75,2.18,8.75],source),{follow:true,canReact:false,toughness:8});source.next=Math.max(time+1,source.next-(10000/effectiveSpeed(source))*starValue([.5,.5,.8],source));skillPoints(1);note(`神君发动 ${stacks} 段攻击`);});
      else if(r.type==='gepard')event(source,'followup','凛冬反攻',()=>{const shields=allies.reduce((sum,u)=>sum+u.shield,0);for(const t of front('enemy'))rawDamage(source,t,source.defense*starValue([6,9.6,18],source)+shields*starValue([2,2.5,3],source),{follow:true,canReact:false});});
      else if(r.type==='seele')event(source,'followup','归刃·自动追击',()=>{hit(source,target||livingTarget(source),3.6+starValue([1.2,2.4,6],source),{canReact:false});});
      else if(r.type==='new-blade')event(source,'followup','因果尽偿',()=>{for(const t of front('enemy'))rawDamage(source,t,source.maxHp*starValue([.8,1,1.44,2.24],source),{follow:true,canReact:false});});
      else if(r.type==='trait-follow')event(source,'followup','追击羁绊·协同打击',()=>hit(source,target||livingTarget(source),3,{follow:true,canReact:false}));
      else if(r.type==='feixiao')event(source,'followup','雷狩',()=>{hit(source,target||livingTarget(source),starValue([.96,1.34,2.69,2.88],source),{follow:true,canReact:false});source.followAmp+=.06;addStatus(source,'damageUp','雷狩增伤',.52,2,source);if(random()<starValue([.25,.3,.35,.4],source))hit(source,livingTarget(source),starValue([.96,1.34,2.69,2.88],source),{follow:true,canReact:false});});
      else if(r.type==='moze')event(source,'followup','雷霆一击',()=>{aoe(source,starValue([3.6,4.5,6.48,10.08],source),{follow:true,canReact:false});for(const t of damageTargets(source))addStatus(t,'exposed','貊泽追猎',starValue([.25,.3,.35,.4],source),2,source);});
      else if(r.type==='jade')event(source,'followup','剔烁之牙',()=>aoe(source,starValue([3.2,4,5.76,8.96],source),{follow:true,canReact:false}));
      else if(r.type==='tribbie')event(source,'followup','好忙好忙的缇宝',()=>{for(const t of damageTargets(source))rawDamage(source,t,source.maxHp*starValue([.18,.225,.324,.504],source),{follow:true,canReact:false});});
      else if(r.type==='yunli')event(source,'followup','勘破·斩',()=>hit(source,target||livingTarget(source),starValue([3.2,4,16],source),{follow:true,canReact:false}));
      else if(r.type==='dahlia')event(source,'followup','共舞者·超击破',()=>{for(let i=0;i<5;i++)hit(source,livingTarget(source),starValue([.3,.36,.45,.54],source),{follow:true,canReact:false,toughness:10});});
      else if(r.type==='engine')event(source,'followup','贝洛伯格·创世引擎',()=>{const accumulated=allies.filter(a=>member(a,'belobog')).reduce((sum,a)=>sum+a.damage,0);for(const t of front('enemy'))rawDamage(source,t,source.attack*tierValue([6,12],trait('belobog'))+accumulated*tierValue([.25,.4],trait('belobog')),{trueDamage:true,canReact:false});const leader=allies.filter(a=>a.hp>0&&member(a,'belobog')).sort((a,b)=>b.damage-a.damage)[0];if(leader)leader.next=Math.min(leader.next,time+1);});
      else if(r.type==='energy-wave')event(source,'followup','能量·过载放电',()=>aoe(source,tierValue([0,8,18,120],trait('energy')),{breakHit:true,canReact:false}));
      else if(r.type==='break-wave')event(source,'break','击破·冲击波',()=>{for(const t of front('enemy')){rawDamage(source,t,tierValue([0,600,1500,3000],trait('break'))*CLASSIC_FLAT_SCALE,{trueDamage:true,canReact:false});addStatus(t,'exposed','冲击波',.5,2,source);}});
      else if(r.type==='guardian')event(source,'followup','大守护者·集结',()=>{for(const t of front('enemy'))rawDamage(source,t,(source.attack*12+source.maxHp*2.4)*(rules.guardian?.damageMultiplier||starValue([1,1.5,10],source)),{follow:true,guaranteedCrit:true,canReact:false});});
      else if(r.type==='item-ultimate')event(source,'ultimate','永动机·终结技激活',()=>{allySkill(source,true,source.zone==='back');afterAction(source,'ultimate',true);note('此终结技不计入永动机自然次数');});
      checkWinner();if(winner)break;
    }
    reactions=[];
  }
  function checkWinner(){if(!front('ally').length)winner='enemy';else if(!front('enemy').length)winner='ally';return winner;}
  const schedules=[];
  function applyOpening(){
    if(rules.festival?.initialSP){skillPoints(rules.festival.initialSP);note('盛会巨星·花火：初始战技点增加');}
    for(const a of allies){
      energy(a,a.startEnergy||0);if(a.navigatorCopied){(a.temporaryItems??=[]).push(a.navigatorCopied);note(`${a.name}复制领航伙伴首件装备`);}if(a.dayEquipment?.length)note(`${a.name}穿戴${a.dayEquipment.length}件${rules.day?.enhanced?'强化':''}白昼装备`);
      if(passive(a,'perpetual-ultimate')){a.energy=100;a.perpetualFree=true;note(`${a.name}：永动机开场激活终结技`);}
      if(passive(a,'backline-catapult')&&a.zone==='back')a.next*=.5;
      if(passive(a,'adaptive-position')&&a.zone==='front')addStatus(a,'taunt','自适应外骨骼',1,99,a);
      if(passive(a,'shield-retaliation'))for(const t of front('ally'))shield(a,t,a.defense*passiveAmount(a,'shield-retaliation',3),2);
      if(passive(a,'team-luck-control'))for(const t of allies)t.controlResists+=passiveAmount(a,'team-luck-control',4);
      if(passive(a,'enemy-weaken-20'))for(const t of enemies)addStatus(t,'attackDown','闪光手榴弹',passiveAmount(a,'enemy-weaken-20',.2,.4,false),99,a);
      if(trait('ranger')>=4&&member(a,'ranger'))a.next=1;
      if(trait('break')&&a.zone==='front')a.breakEffect+=trait('break')>=3?.3:0;
      if(!a.positionAllowed)continue;
      const star=values=>starValue(values,a);
      if(a.characterId==='1001')for(const t of allies)t.damageAmp+=star([.4,.5,.6,.7]);
      if(a.characterId==='1203'){a.field=99;for(const t of allies)t.damageAmp+=star([.3,.6,1.2]);}
      if(a.characterId==='1304')for(const t of allies)t.damageAmp+=star([.3,.45,.6,.75]);
      if(a.characterId==='1307'){for(const t of allies)t.damageAmp+=star([.72,.9,1.2]);for(const t of enemies){applyDot(a,t,'arcana','奥迹',star([3,3.75,15]),99,true);const d=status(t,'arcana');if(d)d.stacks=Math.max(d.stacks,rules.seer?.arcanaInitialStacks||1);}if(rules.seer?.assertionHpRatio){for(const t of enemies)rawDamage(a,t,t.maxHp*rules.seer.assertionHpRatio,{trueDamage:true,canReact:false});note('启示卡·断言：开场按敌人生命上限造成真实伤害');}}
      if(a.characterId==='1208'){a.revives=1;for(const t of front('ally'))t.damageReduction+=star([.1,.15,.2]);for(const t of allies)t.critDamage+=star([.18,.24,.3])+star([.06,.08,.1])*trait('quantum');}
      if(a.characterId==='1306')for(const t of enemies)addStatus(t,'exposed','虚构事实',star([.24,.32,.4,.48]),99,a);
      if(a.characterId==='1301'&&a.zone==='back')for(const t of enemies)addStatus(t,'exposed','酩酊',star([.08,.12,.16,.2]),99,a);
      if(a.characterId==='1112')for(const t of enemies)addStatus(t,'exposed','负债证明·改',.5,99,a);
      if(a.characterId==='1314'){allySkill(a,false,true);a.attack*=1+star([.25,.3,.35,.4]);a.critDamage+=star([1.2,1.4,1.6,1.8]);}
      if(a.characterId==='1303'||a.characterId==='1309')allySkill(a,false,true);
      if(a.characterId==='1209'){a.crit+=.8;a.critDamage+=star([.8,1,1.2]);}
      if(a.characterId==='1221'){a.attack*=1+star([.3,.4,.5]);a.critDamage+=star([1,1.2,1.4]);a.charges=2;}
      if(a.characterId==='1404'&&a.zone==='back'){a.maxHp*=1.5;a.hp=a.maxHp;a.crit+=.48;a.next=1;}
      if(a.characterId==='1413'){for(const t of allies)t.critDamage+=allies.length*star([.04,.07,.11]);if(a.zone==='back')a.hp=Math.max(1,Math.round(a.maxHp*.01));}
      if(a.characterId==='1508'){a.gems=star([20,25,30,35]);for(const t of allies)t.critDamage+=star([.6,.7,.8,.9]);if(a.zone==='back'){a.attack*=1+star([1.5,1.8,2.1,2.4]);a.speed*=1.2;}}
      if(a.characterId==='1104')for(const t of front('ally'))shield(a,t,a.defense*star([.4,.6,.8])+star([20,30,40]));
      if(a.characterId==='1003'){a.breakEffect+=star([1,1.5,2.5]);a.charges=1;}
      if(a.characterId==='1212'){a.crit+=.5;a.critDamage+=star([2.2,2.6,3]);}
      if(a.characterId==='1405'){a.critDamage+=star([1.4,1.8,2.4]);for(const t of allies)t.damageAmp+=star([.25,.3,.4]);}
      if(a.characterId==='1408')a.attack*=1+allies.filter(t=>t.zone==='front'&&t!==a).reduce((sum,t)=>sum+t.star,0)*star([.4,.8,1.2]);
      if(a.characterId==='1406')a.recordedDamage=star([4000,20000,100000,200000])*CLASSIC_FLAT_SCALE;
      if(a.characterId==='1509'){const count=allies.reduce((n,t)=>n+t.items.length,0);for(const t of allies)t.critDamage+=count*.02*(t===a?1+star([2,3,4,5]):1);}
      if(a.characterId==='1504')a.charges=2;
      if(a.characterId==='1218')energy(a,50);
      if(a.characterId==='1321')energy(a,35);
      if(a.characterId==='1217'||a.characterId==='1403'||a.characterId==='1306')energy(a,30);
      if(a.characterId==='1204')schedules.push({type:'jing',sourceId:a.id,next:10000/star([300,300,500]),interval:10000/star([300,300,500])});
      if(a.characterId==='1220')a.followAmp+=0;
    }
    if(rules.wolfpack){const owner=allies.find(a=>member(a,'wolfpack'));if(owner){schedules.push({type:'wolfpack',sourceId:owner.id,next:10000/rules.wolfpack.speed,interval:10000/rules.wolfpack.speed,form:rules.wolfpack});metrics.summons.push({kind:'wolfpack',name:rules.wolfpack.name,level:rules.wolfpack.level,speed:rules.wolfpack.speed});if(rules.wolfpack.extraWolf)schedules.push({type:'wolfpack',sourceId:owner.id,next:10000/200,interval:10000/200,form:{name:'狼卒',speed:200,attackScale:10}});note(`狼狩召唤 ${rules.wolfpack.name} Lv.${rules.wolfpack.level}`);}}
    for(const b of battleEffects)if(b.fastestCount)for(const a of [...allies].sort((a,b)=>b.speed-a.speed).slice(0,b.fastestCount)){a.speed*=1+b.fastestSpeed;a.next/=1+b.fastestSpeed;}
    if(trait('energy'))for(const a of front('ally').slice(0,1))energy(a,30*(member(a,'energy')?2:1));
    if(trait('break'))for(const t of enemies){t.maxToughness=Math.max(1,Math.round(t.maxToughness*(1-tierValue([.1,.2,.3,.99],trait('break')))));t.toughness=t.maxToughness;}
    if(trait('express')){const source=allies.find(a=>member(a,'express'));for(const t of enemies)rawDamage(source,t,source.attack*2,{follow:true,canReact:false});if(trait('express')>=2)schedules.push({type:'train',sourceId:source.id,next:10000/300,interval:10000/300});}
    if(trait('luofu')){const source=allies.find(a=>member(a,'luofu'));schedules.push({type:'luofu',sourceId:source.id,next:trait('luofu')>=3?1:10000/150,interval:10000/150});}
    if(trait('blood')){const source=allies.find(a=>member(a,'blood'));schedules.push({type:'blood',sourceId:source.id,next:10000/300,interval:10000/300});}
    note(synergies.filter(t=>t.active).map(t=>`${t.name} ${t.count}`).join('、')||'没有激活羁绊');
    note('试用面板与独立召唤物使用二维适配；原版赋能见详情');
  }
  function scheduledAction(schedule){
    const source=units.find(u=>u.id===schedule.sourceId);schedule.next+=schedule.interval;
    if(!source||source.hp<=0)return;
    if(schedule.type==='jing'){reactions.push({type:'lightning',sourceId:source.id});flushReactions();return;}
    if(schedule.type==='wolfpack')event(source,'followup',`狼狩·${schedule.form.name}`,()=>{const form=schedule.form,oldElement=source.element;source.element=form.element==='thunder'?'雷':'物理';const target=livingTarget(source),victims=form.target==='all'?front('enemy'):[target].filter(Boolean);for(const t of victims)hit(source,t,form.attackScale,{follow:true,canReact:false});if(form.splashScale)for(const t of front('enemy').filter(t=>t!==target).slice(0,2))hit(source,t,form.splashScale,{follow:true,canReact:false});if(form.secondAttackScale)for(const t of form.target==='all'?front('enemy'):[livingTarget(source)].filter(Boolean))hit(source,t,form.secondAttackScale,{follow:true,canReact:false});if(form.vulnerability)for(const t of front('enemy'))addStatus(t,'exposed','狼王震慑',form.vulnerability,2,source);source.element=oldElement;note('狼灵使用持有者试用攻击面板，形态速度与倍率按原表');});
    if(schedule.type==='train')event(source,'followup','列车同行·轨道驰援',()=>aoe(source,2,{follow:true,canReact:false}));
    if(schedule.type==='luofu')event(source,'followup','仙舟·神君协战',()=>{aoe(source,tierValue([3,6,9,12],trait('luofu')),{follow:true,canReact:false});const hits=tierValue([3,6,8,10],trait('luofu'));for(let i=0;i<hits;i++)hit(source,livingTarget(source),.5,{follow:true,canReact:false,toughness:10});});
    if(schedule.type==='blood'&&bloodPool>0)event(source,'followup','燃血·生命洪流',()=>{const amount=Math.min(bloodPool*tierValue([5,10,20,40],trait('blood')),tierValue([40000,80000,160000,320000],trait('blood'))*CLASSIC_FLAT_SCALE);bloodPool=0;for(const t of front('enemy'))rawDamage(source,t,amount,{trueDamage:true,canReact:false});if(trait('blood')>=3)for(const t of front('ally'))heal(source,t,t.maxHp*tierValue([0,0,.3,.5],trait('blood')));});
  }
  const initial=snapshot();
  event(null,'start','开场准备',applyOpening,'双方进入战场，护盾、初始能量与羁绊生效');
  const maxActions=countdown?20000:clamp(options.maxActions||100,1,180);
  while(turn<maxActions&&(countdown||events.length<235)&&!checkWinner()){
    const activeAllies=alive('ally').filter(a=>a.zone==='front'||(a.positionAllowed!==false&&(!passiveBack.has(a.characterId)||(a.energy>=100&&(ability(a)?.skills||[]).some(s=>s.type==='终结技')))));
    const candidates=[...front('enemy'),...activeAllies].sort((a,b)=>a.next-b.next||a.id.localeCompare(b.id));
    const actor=candidates[0],scheduled=schedules.filter(s=>units.some(u=>u.id===s.sourceId&&u.hp>0)).sort((a,b)=>a.next-b.next)[0];
    if(!actor&&!scheduled)break;
    if(countdown&&Math.min(actor?.next??Infinity,scheduled?.next??Infinity)>limit){time=Math.max(time,limit);break;}
    if(scheduled&&scheduled.next<(actor?.next??Infinity)){setBattleTime(scheduled.next);turn++;scheduledAction(scheduled);continue;}
    setBattleTime(actor.next);turn++;actor.acted++;actor.seeleReset=false;actor.autoHeal=Math.max(0,actor.autoHeal-1);
    actor.next=time+10000/effectiveSpeed(actor);
    if(actor.side==='enemy'||actor.items.length||actor.zone==='front')event(actor,'prepare','回合开始',()=>beforeAction(actor));
    const dots=actor.statuses.filter(s=>['burn','shock','wind','arcana','ocean','activation'].includes(s.type));
    if(dots.length)event(actor,'dot','持续伤害结算',()=>{for(const d of dots){const source=units.find(u=>u.id===d.sourceId);if(source){rawDamage(source,actor,dotDamage(source,d),{dot:true,canReact:false,toughness:0});if(d.type==='arcana'&&!source.field)d.stacks=1;}}},`${actor.name}行动前结算持续伤害`);
    if(checkWinner())break;
    if(actor.hp<=0)continue;
    if(status(actor,'regen'))event(actor,'heal','持续治疗',()=>{const regen=status(actor,'regen');heal(units.find(u=>u.id===regen.sourceId)||actor,actor,regen.value);});
    if(status(actor,'frozen')){event(actor,'control','冻结',()=>{actor.statuses=actor.statuses.filter(s=>s.type!=='frozen');for(const s of actor.statuses)if(s.type!=='broken')s.turns--;actor.statuses=actor.statuses.filter(s=>s.turns>0);},`${actor.name}被冻结，跳过本次行动`);continue;}
    if(status(actor,'broken')){event(actor,'recover','韧性恢复',()=>{const ruan=allies.find(a=>valid(a,'1303')&&a.field>0);if(ruan&&!status(actor,'plum')){addStatus(actor,'plum','残梅绽',1,1,ruan);actor.next+=20;rawDamage(ruan,actor,ruan.attack*starValue([.5,1,1.5,2],ruan)*(1+(ruan.breakEffect||0)),{breakHit:true,canReact:false});note('残梅绽延长击破');}else{actor.toughness=actor.maxToughness;actor.statuses=actor.statuses.filter(s=>!['broken','plum'].includes(s.type));}},`${actor.name}尝试恢复韧性`);}
    const c=characterMap.get(actor.characterId),sourceSkills=ability(actor)?.skills||[],activeUltimate=actor.side==='enemy'||actor.zone==='front'||sourceSkills.some(s=>s.type==='终结技');
    const ultimate=actor.energy>=100&&activeUltimate&&actor.positionAllowed!==false;
    let kind=ultimate?'ultimate':actor.zone==='back'?'support':'skill';
    let useSkill=actor.side==='enemy'||actor.zone==='back'||allySp>0;
    if(actor.side==='ally'&&actor.positionAllowed===false)useSkill=false;
    if(actor.side==='ally'&&actor.zone==='front'&&!ultimate){
      if(['1105','1203'].includes(actor.characterId)&&front('ally').every(a=>a.hp/a.maxHp>.82))useSkill=false;
      if(['1101'].includes(actor.characterId)&&actor.acted%3===0)useSkill=false;
    }
    if(!useSkill&&!ultimate)kind='basic';
    const original=sourceSkills.find(s=>s.type===(ultimate?'终结技':kind==='basic'?'普攻':'战技'));
    const skill=kind==='basic'?'普通攻击':original?.name||(ultimate?(c?.ultimate||'终结技'):actor.zone==='back'?(c?.backlineSkill||'后台赋能'):(c?.skill||'战技'));
    event(actor,kind,skill,()=>{
      if(ultimate){actor.energy=0;if(actor.side==='ally')allySkill(actor,true,actor.zone==='back');else enemyAction(actor,true);}
      else if(kind==='basic'){hit(actor,livingTarget(actor),1,{toughness:20});skillPoints(1);energy(actor,20);note('战技点 +1');}
      else {if(actor.side==='ally'){
        if(actor.zone==='front'){skillPoints(-1);for(const a of allies.filter(a=>valid(a,'1306')))energy(a,3);}
        allySkill(actor,false,actor.zone==='back');
      }else enemyAction(actor,false);energy(actor,actor.zone==='back'?30:30);}
      afterAction(actor,kind);
    });
    if(actor.characterId==='1204'&&actor.positionAllowed){actor.jingStacks=Math.min(15,actor.jingStacks+starValue(kind==='ultimate'?[3,3,20]:[2,2,20],actor));if(actor.jingStacks>=15)reactions.push({type:'lightning',sourceId:actor.id});}
    if(actor.field>0&&actor.field<99)actor.field--;
    for(const s of actor.statuses)if(s.type!=='broken'&&s.appliedTurn!==turn)s.turns--;
    actor.statuses=actor.statuses.filter(s=>s.turns>0);
    if(actor.characterId==='1101'&&!status(actor,'guardianMarch'))for(const a of allies)if(a.guardianHpBoost){a.maxHp=Math.round(a.maxHp/(1+a.guardianHpBoost));a.hp=Math.min(a.hp,a.maxHp);a.defense=a.maxHp*.15;a.guardianHpBoost=0;}
    actor.next=Math.min(actor.next,time+10000/effectiveSpeed(actor));
    for(const a of allies)if(a!==actor&&a.zone==='back'&&a.energy>=100&&passiveBack.has(a.characterId))a.next=Math.max(time+1,Math.min(a.next,time+1));
    flushReactions();
  }
  const reason=checkWinner()?'elimination':'timeout';
  if(!winner)winner='enemy';
  event(null,'end','战斗结束',()=>{},winner==='ally'?'敌方全灭，本场战斗胜利。':reason==='timeout'?(countdown?'倒计时结束，未能击败全部敌人。':'行动达到上限，未能及时击败敌方，本场战斗失败。'):'前台全员退场，本场战斗失败。');
  if(events.length)events[events.length-1].winner=winner;
  return {...(countdown?{countdown:countdown.turns,countdownLeft:Math.max(0,Math.round(limit-time))/100,revives}:{}),metrics:finishCombatMetrics(metrics,units,winner,time),version:2,simulationNote:CLASSIC_SIMULATION_NOTE,initialSkillPoints:3,maxSkillPoints:maxSp,maxEnergy:100,units:initial,events,winner,turns:turn,reason,skillPoints:allySp,stats:units.map(u=>({id:u.id,name:u.name,side:u.side,damage:Math.round(u.damage),healing:Math.round(u.healing),shielding:Math.round(u.shielding),kills:u.kills})),final:snapshot()};
}
