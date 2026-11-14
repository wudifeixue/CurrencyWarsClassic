import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,EQUIPMENT} from '../dist/data.js';
import {simulateCombat,getBattleStats,getBattleSynergies,getClassicSimulationDescription} from '../dist/combat.js';
const unit=(characterId,zone='front',items=[],star=1)=>({uid:`u-${characterId}-${zone}`,characterId,zone,items,star});
const state=(units,strategies=[])=>({units,strategies,round:6,seed:86753,strategyState:{}});
const dummy=(extra={})=>({id:'dummy',name:'训练守卫',hp:1000000,maxHp:1000000,attack:100,speed:100,weaknesses:[],toughness:0,maxToughness:0,...extra});
const run=(s,opts={})=>simulateCombat(s,{maxActions:35,enemyLineup:[dummy()],...opts});

test('classic traits count distinct deployed characters and restrict member bonuses',()=>{
 const sampo=unit('1108'),asta=unit('1009'),gepard=unit('1104');
 const s=state([sampo,asta,gepard,{...sampo,uid:'duplicate'}]);
 const dot=getBattleSynergies(s).find(t=>t.id==='dot');assert.equal(dot.count,2);assert.equal(dot.level,1);
 assert.equal(getBattleStats(s,sampo).dotAmp,.3);assert.equal(getBattleStats(s,gepard).dotAmp,0);
 s.units[1].zone='bench';assert.equal(getBattleSynergies(s).find(t=>t.id==='dot').active,false);
});

test('basic equipment preserves front/back strength rather than adding flat attack',()=>{
 const front=unit('1104'),back=unit('1001','back'),base=state([front,back]);
 const frontKnife={...front,items:['knife']},backKnife={...back,items:['knife']},backPistol={...back,items:['pistol']};
 assert.ok(getBattleStats(base,frontKnife).attack>getBattleStats(base,front).attack);
 assert.equal(getBattleStats(base,backKnife).attack,getBattleStats(base,back).attack);
 assert.ok(getBattleStats(base,backPistol).attack>getBattleStats(base,back).attack);
});

test('wrong placement disables the empowerment but retains its trait contribution',()=>{
 const good=state([unit('1104'),unit('1001','back')]),wrong=state([unit('1104'),unit('1001','front')]);
 assert.deepEqual(getBattleSynergies(good).map(t=>[t.id,t.count]),getBattleSynergies(wrong).map(t=>[t.id,t.count]));
 const a=run(good),b=run(wrong);
 assert.ok(a.stats.find(u=>u.id==='u-1001-back').shielding>0);
 assert.equal(b.stats.find(u=>u.id==='u-1001-front').shielding,0);
 assert.ok(b.events.filter(e=>e.actorId==='u-1001-front'&&['basic','skill','ultimate'].includes(e.kind)).every(e=>e.kind==='basic'));
});

test('Blade backline is triggered by frontline HP loss, not by shield absorption',()=>{
 const s=state([unit('1104'),unit('1205','back')]);
 const exposed=run(s,{maxActions:80,enemyLineup:[dummy({attack:180,speed:160})]});
 assert.ok(exposed.events.some(e=>e.skill==='倏忽恩赐'));
 const protectedState=state([unit('1104','front',['cover-gun']),unit('1001','back',['cover-gun']),unit('1205','back')]);
 const protectedReplay=run(protectedState,{maxActions:12,enemyLineup:[dummy({attack:1,speed:80})]});
 assert.equal(protectedReplay.events.some(e=>e.skill==='倏忽恩赐'),false);
});

test('blood trait converts shields for blood members into healing',()=>{
 const s=state([unit('1404'),unit('1205','back'),unit('1001','back')]);
 const r=run(s,{maxActions:25});
 assert.ok(r.events.some(e=>e.text.includes('护盾转化为治疗')));
 assert.equal(r.events.some(e=>e.targets.some(t=>t.id==='u-1404-front'&&t.shield>0)),false);
});

test('Kafka equipment count strengthens DOT detonations without inventing flat weapon stats',()=>{
 const normal=state([unit('1104'),unit('1108','back'),unit('1005','back')]);
 const equipped=structuredClone(normal);equipped.units[2].items=['knife'];
 const a=run(normal,{maxActions:12}),b=run(equipped,{maxActions:12});
 const kafkaDamage=r=>r.events.filter(e=>e.actorId==='u-1005-back').flatMap(e=>e.targets).reduce((n,t)=>n+(t.damage||0),0);
 assert.ok(kafkaDamage(b)>kafkaDamage(a));
});

test('Sparkle raises skill-point cap and her ultimate replenishes the shared pool',()=>{
 const s=state([unit('1015'),unit('1306','back',['perpetual'])]);
 const r=run(s,{maxActions:15});
 assert.ok(r.maxSkillPoints>=7);
 const ult=r.events.find(e=>e.actorId==='u-1306-back'&&e.kind==='ultimate');assert.ok(ult);assert.ok(ult.skillPoints>=5);
 for(const e of r.events)assert.ok(e.skillPoints>=0&&e.skillPoints<=r.maxSkillPoints);
});

test('boots accelerate every wearer turn and life ring grants a team HP aura',()=>{
 const plain=unit('1002'),ring=unit('1001','back',['garden']);
 const baseline=state([plain,{...ring,items:[]}]),boosted=state([plain,ring]);
 assert.ok(getBattleStats(boosted,plain).hp>getBattleStats(baseline,plain).hp);
 const boot=run(state([unit('1002','front',['boots'])]),{maxActions:12});
 const speeds=boot.events.filter(e=>e.actorId==='u-1002-front').map(e=>e.snapshot.find(u=>u.id==='u-1002-front').speed);
 assert.ok(speeds.at(-1)>speeds[0]);
});

test('conditional investment strategies use actual bench/front positions and acquisition age',()=>{
 const tank=unit('1104'),oneBack=unit('1001','back');
 const s=state([tank,oneBack],['cheer-squad']);
 const without=getBattleStats({...s,strategies:[]},tank);assert.equal(getBattleStats(s,tank).speed,without.speed);
 s.units.push(unit('1202','back'),unit('1205','back'),unit('1306','back'));
 assert.ok(getBattleStats(s,tank).speed>getBattleStats({...s,strategies:[]},tank).speed);
 const old=state([tank],['supply-chain']);old.strategyState={'supply-chain':{nodes:5}};
 const recent=state([tank],['supply-chain']);recent.strategyState={'supply-chain':{nodes:0}};
 assert.ok(getBattleStats(old,tank).speed>getBattleStats(recent,tank).speed);
});

test('all classic cards have explicit implementation notes and replay values stay finite with all equipment',()=>{
 const classics=CHARACTERS.filter(c=>!c.legacy);assert.equal(classics.length,72);
 for(const c of classics)assert.ok(!getClassicSimulationDescription(c.id).includes('旧存档兼容'),c.name);
 for(const e of EQUIPMENT){const s=state([unit('1104','front',[e.id]),unit('1001','back'),unit('1306','back')]),before=structuredClone(s),r=run(s,{maxActions:20});assert.deepEqual(s,before,e.name);for(const ev of r.events){assert.ok(Number.isFinite(ev.time),e.name);for(const u of ev.snapshot){assert.ok(Number.isFinite(u.hp)&&u.hp>=0&&u.hp<=u.maxHp,e.name);assert.ok(Number.isFinite(u.shield)&&u.shield>=0,e.name);assert.ok(Number.isFinite(u.attack)&&Number.isFinite(u.speed),e.name);}}}
});


test('reference healing and shield strength are normalized relative to one-star trial panels',()=>{
 for(const id of ['1001','1104','1105','1203']){
  const c=CHARACTERS.find(c=>c.id===id),u=unit(id,c.allowedZones[0]),s=state([u]);
  const one=getBattleStats(s,u);assert.ok(one.healAmp<1,`${c.name} does not multiply flat reference healing strength as a percent`);assert.ok(one.shieldAmp<1,`${c.name} does not multiply flat reference shield strength as a percent`);
  const two=getBattleStats(s,{...u,star:2});assert.ok(Number.isFinite(two.healAmp)&&two.healAmp<5);assert.ok(Number.isFinite(two.shieldAmp)&&two.shieldAmp<5);
 }
});


test('team strength counts one-member faction traits and excludes independent traits',()=>{
 const u=unit('1108'),normal=state([u]),boosted=state([u],['team-strength-silver']);
 assert.ok(getBattleSynergies(normal).some(t=>t.id==='wanderer'&&t.active&&t.type!=='独立羁绊'));
 const base=getBattleStats(normal,u),withStrategy=getBattleStats(boosted,u);
 assert.ok(Math.abs(withStrategy.frontPower-base.frontPower-.03)<1e-9,'one-member Wanderer faction provides one Team Strength increment');
 const guardian=unit('1101'),plainGuardian=state([guardian]),boostedGuardian=state([guardian],['team-strength-silver']);
 assert.ok(getBattleSynergies(plainGuardian).some(t=>t.active&&t.type==='独立羁绊'));
 assert.equal(getBattleStats(boostedGuardian,guardian).frontPower,getBattleStats(plainGuardian,guardian).frontPower,'independent Guardian does not count');
});
