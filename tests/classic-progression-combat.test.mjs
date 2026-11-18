import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,resolveEquipment} from '../dist/data.js';
import {PRIVILEGED_EQUIPMENT} from '../dist/classic-privileged.js';
import {simulateCombat,getBattleStats,getBattleSynergies} from '../dist/combat.js';
import {initProgression,onBattleResolved,onNodeEntry,onRosterChanged,applyProgressionAction} from '../dist/classic-progression.js';
const unit=(id,zone='front',items=[],star=1,extraTraits=[])=>({uid:`${id}-${zone}`,characterId:id,zone,items,star,extraTraits});
const state=(units)=>({units,strategies:[],round:1,phase:'prep',gold:100,level:8,seed:86753,strategyState:{},progression:initProgression()});
const dummy=(extra={})=>({id:'dummy',name:'训练守卫',hp:1e7,maxHp:1e7,attack:150,speed:120,weaknesses:[],toughness:0,maxToughness:0,...extra});
const run=(s,o={})=>simulateCombat(s,{maxActions:40,enemyLineup:[dummy()],...o});
const withTrait=(id,n,zone='back')=>CHARACTERS.filter(c=>!c.legacy&&c.traits.includes(id)).slice(0,n).map(c=>unit(c.id,c.allowedZones.includes(zone)?zone:c.allowedZones[0]));
const eventDamage=e=>e.targets.reduce((n,t)=>n+(t.damage||0)+(t.absorbed||0),0);

test('battle facts drive scholar and wolf growth once, then change actual next-battle output',()=>{
 const s=state([unit('1104'),...withTrait('scholar',2)]);onRosterChanged(s);
 const first=run(s);const oldReduction=getBattleStats(s,s.units[0]).damageReduction;
 const rewards=onBattleResolved(s,first);assert.ok(s.progression.scholar.dna>0);assert.deepEqual(onBattleResolved(s,first),[]);
 s.round=2;onNodeEntry(s);onBattleResolved(s,run(s));assert.ok(s.progression.scholar.level>=2);
 assert.ok(run(s).events.some(e=>e.text.includes('猫猫糕 Lv.2')));assert.ok(getBattleStats(s,s.units[0]).damageReduction>oldReduction);
 const w=state(withTrait('wolfpack',3));if(!w.units.some(u=>u.zone==='front'))w.units[0].zone='front';w.units[0].items=['blade','boots','battery'];onRosterChanged(w);
 const before=run(w);assert.ok(before.events.some(e=>e.skill==='狼狩·狼卒'));assert.equal(before.metrics.summons.length,1);
 onBattleResolved(w,before);w.round=2;onNodeEntry(w);onBattleResolved(w,run(w));assert.ok(w.progression.wolfpack.level>=2);
 const after=run(w);assert.ok(after.events.some(e=>e.skill==='狼狩·狼卒长'));assert.ok(after.metrics.summons[0].speed>before.metrics.summons[0].speed);
});

test('seer selections alter opening damage and arcana stacks; linear stacking avoids multiplying base DOT per layer',()=>{
 const s=state([unit('1104'),unit('1307','back')]);onRosterChanged(s);
 onBattleResolved(s,run(s,{maxActions:1}));s.round=2;onNodeEntry(s);onBattleResolved(s,run(s,{maxActions:1}));
 assert.equal(s.progression.seer.charges,1);assert.equal(applyProgressionAction(s,{kind:'seer-select',id:'assertion'}).ok,true);
 const assertion=run(s,{maxActions:1});assert.equal(assertion.events[0].targets.find(t=>t.id==='dummy').damage,1e6);
 const baseline=state([unit('1104'),unit('1307','back')]);const seven=structuredClone(baseline);seven.progression.seer.cards=['original-arcana'];
 const a=run(baseline,{maxActions:1,enemyLineup:[dummy({speed:1000})]}),b=run(seven,{maxActions:1,enemyLineup:[dummy({speed:1000})]});
 assert.equal(b.events[0].snapshot.find(u=>u.id==='dummy').statuses.find(x=>x.type==='arcana').stacks,7);
 const ad=a.events.find(e=>e.kind==='dot'),bd=b.events.find(e=>e.kind==='dot');assert.ok(ad&&bd);assert.ok(eventDamage(bd)>eventDamage(ad));assert.ok(eventDamage(bd)<eventDamage(ad)*3,'seven stacks add six per-stack increments, not seven copies of base DOT');
 const deep=structuredClone(seven);deep.progression.seer.cards.push('deep-arcana');assert.ok(eventDamage(run(deep,{maxActions:1,enemyLineup:[dummy({speed:1000})]}).events.find(e=>e.kind==='dot'))>eventDamage(bd));
});

test('magician counts each Archer attack and equips real temporary projections without changing saved items',()=>{
 const s=state([unit('1015','front',['kinetic-sword']),unit('1104'),unit('1306','back')]);onRosterChanged(s);const before=structuredClone(s),r=run(s,{maxActions:28});
 assert.ok(r.metrics.byUnit['1015-front'].attacks>=6);assert.ok(r.metrics.projectedEquipment.length>=3);
 assert.ok(r.metrics.projectedEquipment.every(e=>resolveEquipment(e.itemId)));
 assert.ok(r.events.some(e=>e.snapshot.some(u=>u.temporaryItems.length>0)));assert.deepEqual(s,before);
});

test('guardian chooses only the dominant faction, blood stance consumes HP, and three stars summon on every frontline action',()=>{
 const s=state([unit('1101'),unit('1404'),unit('1205','back')]);onRosterChanged(s);
 assert.equal(getBattleSynergies(s).find(t=>t.id==='blood').count,3);assert.equal(getBattleSynergies(s).some(t=>t.id==='belobog'),false);
 const r=run(s,{maxActions:15});assert.ok(r.events.some(e=>e.actorId==='1101-front'&&e.kind==='skill'&&e.targets.some(t=>t.id==='1101-front'&&t.damage>0)));
 const three=state([unit('1101','front',[],3),unit('1104')]);onRosterChanged(three);const high=run(three,{maxActions:3});assert.ok(high.events.some(e=>e.skill==='大守护者·集结'));
});

test('mentor transmits strength, advances allies and records capped inheritance after skills',()=>{
 const s=state([unit('1104'),unit('1212','back'),unit('1204'),unit('1209','back')]);onRosterChanged(s);
 const base=getBattleStats(s,s.units[1]);s.progression.mentor.characterIds=['1212','1204','1209'];
 assert.ok(getBattleStats(s,s.units[1]).attack>base.attack);
 const r=run(s,{maxActions:25});assert.ok(r.events.some(e=>e.text.includes('层传承')));assert.ok(r.events.some(e=>e.snapshot.some(u=>u.statuses.some(x=>x.type==='mentorDamage'))));
 const sword=structuredClone(s);sword.strategies=['feiguang-sword'];sword.progression.mentor.swordNodes=2;sword.units.find(u=>u.characterId==='1209').items=['energy-sail'];
 assert.ok(run(sword,{maxActions:35}).events.some(e=>e.text.includes('飞光·传剑附加景元累计伤害的23%')));
});

test('navigator copies selected partner traits and first item in battle, retaining original equipment in save',()=>{
 const s=state([unit('1510'),unit('1001','back',['privileged:hybrid'])]);onRosterChanged(s);const nav=s.units[0],baseline=getBattleStats(s,nav);
 assert.equal(applyProgressionAction(s,{kind:'navigator-select',uid:s.units[1].uid}).ok,true);
 const traits=getBattleSynergies(s);assert.equal(traits.find(t=>t.id==='shield').count,2);
 assert.ok(getBattleStats(s,nav).attack>baseline.attack);const before=structuredClone(s),r=run(s,{maxActions:8});
 assert.ok(r.events[0].text.includes('复制领航伙伴'));assert.ok(r.events[0].snapshot.find(u=>u.id===nav.uid).temporaryItems.includes('privileged:hybrid'));assert.deepEqual(s,before);
 const day=state([unit('1510','front',['trait-day','knife']),unit('1001','back',['battery']),unit('1402','back'),unit('1403','back')]);day.progression.day.unlocked=['day-propeller'];day.progression.day.assignments={'day-propeller':'1510-front'};const beforeDay=getBattleStats(day,day.units[0]);day.progression.navigator.targetUid='1001-back';assert.deepEqual(getBattleStats(day,day.units[0]).dayEquipment,beforeDay.dayEquipment,'copied navigator modification does not consume a normal slot');assert.equal(beforeDay.dayEquipment.length,1);
});

test('festival selection changes actual critical stats and Sparkle opening skill points',()=>{
 const s=state([unit('1104'),unit('1306','back'),unit('1309','back')]);onRosterChanged(s);
 assert.equal(applyProgressionAction(s,{kind:'festival-select',uid:'1309-back'}).ok,true);const robin=getBattleStats(s,s.units[0]);
 assert.equal(applyProgressionAction(s,{kind:'festival-select',uid:'1306-back'}).ok,true);const sparkle=getBattleStats(s,s.units[0]);assert.ok(robin.crit>sparkle.crit);assert.ok(sparkle.basicSkillDamage>robin.basicSkillDamage);
 assert.ok(run(s,{maxActions:1}).events[0].skillPoints>3);
});

test('gamer components alter distinct trait counts, damage and price while poem buffs affect later battles',()=>{
 const s=state([unit('1506','front',[],2),unit('1006','back')]);onRosterChanged(s);const base=getBattleStats(s,s.units[0]);
 assert.equal(applyProgressionAction(s,{kind:'gamer-hack',uid:'1506-front',choice:'component',id:'hunters-cassette'}).ok,true);
 assert.equal(getBattleSynergies(s).find(t=>t.id==='hunters').count,3);assert.ok(getBattleStats(s,s.units[0]).attack>base.attack);const duplicate={...unit('1506'),uid:'other-gamer'};s.units[0].zone='bench';s.units.push(duplicate);assert.equal(getBattleSynergies(s).find(t=>t.id==='hunters').count,2,'a duplicate cannot activate a benched owner cassette');
 const promoted=state([unit('1506','front',[],2)]);onRosterChanged(promoted);assert.equal(applyProgressionAction(promoted,{kind:'gamer-hack',uid:'1506-front',choice:'promote'}).ok,true);assert.equal(promoted.units[0].star,1);assert.equal(promoted.units[0].recruitCost,4);
 const costly=state([{...unit('1506','front',[],3),recruitCost:5}]),cheap=state([{...unit('1506','front',[],3),recruitCost:3}]);assert.ok(getBattleStats(costly,costly.units[0]).attack>getBattleStats(cheap,cheap.units[0]).attack*7,'five-cost three-star original 2500 strength is distinct from three-cost 330');
 const one=state([unit('1506')]);assert.ok(getBattleStats(promoted,promoted.units[0]).attack>getBattleStats(one,one.units[0]).attack);
 const poem=state([unit('1104'),unit('1415','back')]);onRosterChanged(poem);const pre=getBattleStats(poem,poem.units[0]);poem.progression.beloved.battles=1;poem.progression.beloved.offers=['strength'];assert.equal(applyProgressionAction(poem,{kind:'poem-buy',id:'strength'}).ok,true);assert.ok(getBattleStats(poem,poem.units[0]).damageAmp>pre.damageAmp);poem.progression.beloved.buffs.damageReduction=.99;assert.equal(getBattleStats(poem,poem.units[0]).damageReduction,.99,'three-star poem 99% mitigation is not truncated to the older generic cap');
});

test('day equipment respects three slots, persists when faction drops, and enhanced slots change stats',()=>{
 const s=state([...withTrait('day',9,'front'),unit('1104','front',[],1,['day']),unit('1001','back',[],1,['day']),unit('1009','back',[],1,['day'])]);onRosterChanged(s);const u=s.units[0];u.items=['blade','boots','electric'];
 assert.equal(getBattleStats(s,u).dayEquipment.length,0);u.items=['blade'];assert.equal(getBattleStats(s,u).dayEquipment.length,2);
 const enhanced=getBattleStats(s,u);const lower=structuredClone(s);lower.units=lower.units.slice(0,3);onRosterChanged(lower);
 lower.progression.day.assignments={'day-propeller':u.uid};assert.ok(getBattleStats(lower,lower.units[0]).dayEquipment.includes('day-propeller'));
 assert.ok(enhanced.damageAmp>=getBattleStats(lower,lower.units[0]).damageAmp);
 lower.units=lower.units.slice(0,1);assert.ok(!getBattleStats(lower,lower.units[0]).dayEquipment.includes('day-propeller'),'below three 昼之半神 the 白昼 item is gone, effect included');
});

test('savior inherits only active traits represented at the front without adding trait members',()=>{
 const s=state([unit('1408'),unit('1009','back'),unit('1108','back')]);const savior=s.units[0];
 assert.equal(getBattleSynergies(s).find(t=>t.id==='dot').count,2);assert.equal(getBattleStats(s,savior).dotAmp,0);
 s.units[1].zone='front';assert.equal(getBattleSynergies(s).find(t=>t.id==='dot').count,2);assert.equal(getBattleStats(s,savior).dotAmp,.3);
});

test('actual perfect-victory metric awards doubled night essence and completes a selected grail task once',()=>{
 const s=state([...withTrait('night',3,'front'),...withTrait('grail',2,'back')]);onRosterChanged(s);
 const r=run(s,{maxActions:40,enemyLineup:[dummy({hp:1,maxHp:1,attack:1})]});assert.equal(r.metrics.perfectVictory,true);assert.equal(r.metrics.frontlineFallen,0);
 s.progression.grail.active=[{id:'conquest',tier:4,progress:2,done:false}];s.progression.grail.unlockedTiers.push(4);
 const rewards=onBattleResolved(s,r);assert.equal(s.progression.night.essence,4);assert.ok(rewards.some(x=>x.id==='wealth-gem'));assert.deepEqual(onBattleResolved(s,r),[]);
 for(const stat of r.stats.filter(u=>u.side==='ally'))assert.equal(Math.round(r.metrics.byUnit[stat.id].damage),stat.damage);
});

test('all 36 privileged variants produce finite nonmutating combat and retain their actual exceptions',()=>{
 assert.equal(Object.keys(PRIVILEGED_EQUIPMENT).length,36);
 for(const id of Object.keys(PRIVILEGED_EQUIPMENT)){const s=state([unit('1104','front',['privileged:'+id]),unit('1001','back'),unit('1306','back')]),before=structuredClone(s),r=run(s,{maxActions:18});assert.deepEqual(s,before,id);for(const e of r.events)for(const u of e.snapshot){assert.ok(Number.isFinite(u.hp)&&u.hp>=0&&u.hp<=u.maxHp,id);assert.ok(Number.isFinite(u.shield)&&Number.isFinite(u.attack)&&Number.isFinite(u.speed),id);}}
 const normal=run(state([unit('1002','front',['boots'])]),{maxActions:15}),priv=run(state([unit('1002','front',['privileged:boots'])]),{maxActions:15});assert.ok(priv.final[0].speed>normal.final[0].speed);
 for(const gear of ['perpetual','privileged:perpetual']){const r=run(state([unit('1002','front',[gear,'energy-sail'])]),{maxActions:35});const natural=r.metrics.naturalUltimates;assert.ok(r.events.filter(e=>e.skill==='永动机·终结技激活').length<=Math.floor(natural/3));}
 const dice=run(state([unit('1104','front',['privileged:comet'])]),{maxActions:1});assert.ok(dice.metrics.byUnit['1104-front'].items.every(id=>id==='privileged:comet'));assert.equal(dice.units[0].temporaryItems.length,2);assert.ok(dice.units[0].temporaryItems.every(id=>id.startsWith('privileged:')&&resolveEquipment(id)));
});


test('copied dice retains navigator equipment and fills only empty slots without displacing daylight gear',()=>{
 for(const dice of ['comet','privileged:comet']){
  const make=(items,extra=[])=>{const s=state([unit('1510','front',items),unit('1001','back',[dice]),...extra]);s.seed=30;s.progression.navigator.targetUid='1001-back';return s;};
  for(const [items,expected]of [[[],2],[['knife'],2],[['trait-day','knife'],1],[['trait-day','knife','pistol'],0]]){
   const s=make(items),before=structuredClone(s),r=run(s,{maxActions:1}),nav=r.units.find(u=>u.id==='1510-front');
   assert.equal(nav.temporaryItems.length,expected,`${items} reserves its real slots`);assert.deepEqual(s,before);
   if(expected===0)assert.equal(nav.attack,getBattleStats(s,s.units[0]).attack,'a full navigator retains its own knife and emblem rather than receiving a replacement dice loadout');
  }
  const day=make(['trait-day','knife'],[unit('1402','back'),unit('1403','back')]);day.progression.day.unlocked=['day-propeller'];day.progression.day.assignments={'day-propeller':'1510-front'};
  const equipped=getBattleStats(day,day.units[0]);assert.deepEqual(equipped.dayEquipment,['day-propeller']);
  const replay=run(day,{maxActions:1}),nav=replay.units.find(u=>u.id==='1510-front');assert.equal(nav.temporaryItems.length,0,'the daylight item reserves the final ordinary slot');assert.equal(nav.attack,equipped.attack,'copied dice preserves the knife, emblem, and daylight strength');assert.equal(nav.speed,equipped.speed);
 }
});
