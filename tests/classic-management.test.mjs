import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,act,getCharacter,getEquipment,getInterest,getRefreshCost,getMaxHp,migrateState,validateState} from '../dist/engine.js';
import {CLASSIC_ROSTER,STRATEGIES,EQUIPMENT,RECIPES,LEVEL_XP,SHOP_ODDS,MAX_LEVEL,BENCH_CAPACITY} from '../dist/data.js';

const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,r.message);assert.equal(validateState(s),true);return r;};
const reject=(s,a)=>{const before=structuredClone(s);assert.equal(act(s,a).ok,false);assert.deepEqual(s,before);};
const choose=(s,id)=>{
  s.phase='choice';s.choiceKind='strategy';s.choices=Array.from({length:3},()=>({kind:'strategy',id}));
  run(s,{type:'choose',index:0});return s;
};
const xpTotal=s=>s.xp+Object.entries(LEVEL_XP).reduce((sum,[level,xp])=>sum+(Number(level)<s.level?xp:0),0);
// Isolate management triggers from combat difficulty and the random reward selection.
const nextNode=(s,{dismiss=true}={})=>{
  s.phase='result';s.lastBattle={won:true,playerPower:1,enemyPower:1,damage:0,income:0,logs:[],rewards:[]};
  run(s,{type:'next'});
  if(dismiss&&s.phase==='choice'){s.phase='prep';s.choices=[];s.choiceKind=null;}
  return s;
};

test('classic recipes cover all 36 old-season pairs with the correct named products',()=>{
  const expected=[
    ['skates','skates','反重力皮靴'],['knife','skates','火力风暴潮'],['pistol','skates','电磁弹射器'],['skates','star','追逐星辰'],['flower','skates','步步生花'],['armor','skates','流星飞翼'],['drill','skates','光速螺旋桨'],['battery','skates','电光履'],
    ['knife','knife','碎星斩舰刀'],['knife','pistol','武器大师'],['knife','star','高周波电锯'],['flower','knife','杀红眼'],['armor','knife','信心注入器'],['drill','knife','动能激发剑'],['battery','knife','战场进化手册'],
    ['pistol','pistol','天基轨道炮'],['pistol','star','反卫星狙击枪'],['flower','pistol','掩体生成枪'],['armor','pistol','自适应外骨骼'],['drill','pistol','斩首行动'],['battery','pistol','蓄能帆'],
    ['star','star','随便骰子'],['flower','star','热血沸腾拳'],['armor','star','以牙还牙甲'],['drill','star','胜利之旗'],['battery','star','冷笑话引擎'],
    ['flower','flower','生命之环'],['armor','flower','痛觉阻断芯片'],['drill','flower','物质分解液'],['battery','flower','绝对热量'],['armor','armor','很硬的甲'],['armor','drill','闪光手榴弹'],['armor','battery','光能盾牌'],['drill','drill','虫洞掘进钻头'],['battery','drill','行星钻地弹'],['battery','battery','永动机'],
  ];
  assert.equal(EQUIPMENT.filter(e=>e.tier===1).length,8);
  assert.equal(EQUIPMENT.filter(e=>e.tier===2).length,36);
  assert.equal(Object.entries(RECIPES).filter(([,id])=>getEquipment(id).tier===2).length,36);
  const produced=new Set();
  for(const [a,b,name] of expected)for(const [first,second] of [[a,b],[b,a]]){
    const s=createGame(3);s.inventory=['star',first,'knife',second,'armor'];
    run(s,{type:'combine',indexA:3,indexB:1});
    assert.deepEqual([s.inventory[0],s.inventory[2],s.inventory[3]],['star','knife','armor'],'the result takes the target slot; nothing else moves');
    assert.equal(s.inventory.length,4);
    assert.equal(getEquipment(s.inventory[1]).name,name,`${first}+${second}`);
    assert.equal(getEquipment(s.inventory[1]).tier,2);produced.add(s.inventory[1]);
  }
  assert.equal(produced.size,36);
});

test('advanced equipment cannot be combined or consumed twice',()=>{
  const s=createGame(1);s.inventory=['blade','knife'];
  reject(s,{type:'combine',indexA:0,indexB:1});
  reject(s,{type:'combine',indexA:1,indexB:1});
  reject(s,{type:'combine',indexA:1,indexB:2});
});

test('unique items are unique per wearer, and dice reserve both remaining slots',()=>{
  for(const id of ['electric','energy-sail','absolute-heat']){
    const s=createGame(1);s.inventory=[id,id];
    run(s,{type:'equip',uid:s.units[0].uid,itemIndex:0});
    reject(s,{type:'equip',uid:s.units[0].uid,itemIndex:0});
    run(s,{type:'equip',uid:s.units[1].uid,itemIndex:0});
  }
  const s=createGame(1);s.inventory=['knife','comet'];
  run(s,{type:'equip',uid:s.units[0].uid,itemIndex:0});
  reject(s,{type:'equip',uid:s.units[0].uid,itemIndex:0});
  run(s,{type:'equip',uid:s.units[1].uid,itemIndex:0});
  s.inventory.push('flower');reject(s,{type:'equip',uid:s.units[1].uid,itemIndex:0});
  run(s,{type:'unequip',uid:s.units[1].uid,itemIndex:0});
  run(s,{type:'equip',uid:s.units[1].uid,itemIndex:0});
});

test('merging equipped copies returns unique or dice conflicts without losing items',()=>{
  for(const pair of [['electric','electric'],['comet','knife'],['knife','comet']]){
    const s=createGame(2);s.inventory=[...pair];const originalUid=s.units[0].uid;
    run(s,{type:'buy',index:0});const copy=s.units.find(u=>u.zone==='bench');
    run(s,{type:'equip',uid:originalUid,itemIndex:0});run(s,{type:'equip',uid:copy.uid,itemIndex:0});
    run(s,{type:'buy',index:2});
    const survivor=s.units.find(u=>u.uid===originalUid);
    assert.equal(survivor.star,2);assert.equal(survivor.items.length,1);
    assert.deepEqual([...survivor.items,...s.inventory].sort(),[...pair].sort());
  }
});

test('level ten and nine reserve slots are playable and enforce their boundaries',()=>{
  assert.equal(MAX_LEVEL,10);assert.equal(BENCH_CAPACITY,9);
  const s=createGame(2);s.gold=500;s.level=9;s.xp=LEVEL_XP[9]-4;
  run(s,{type:'exp'});assert.equal(s.level,10);assert.equal(s.xp,0);
  reject(s,{type:'exp'});
  for(let i=0;i<8;i++)s.units.push({uid:`reserve-${i}`,characterId:'1013',star:3,zone:'bench',items:[]});
  run(s,{type:'buy',index:1});assert.equal(s.units.filter(u=>u.zone==='bench').length,9);
  reject(s,{type:'buy',index:3});
  reject(s,{type:'move',uid:s.units[0].uid,zone:'bench'});
  run(s,{type:'move',uid:'reserve-0',zone:'front'});
  for(let i=1;i<6;i++)run(s,{type:'move',uid:`reserve-${i}`,zone:'back'});
  assert.equal(s.units.filter(u=>u.zone!=='bench').length,10);
  assert.equal(s.units.filter(u=>u.zone==='back').length,6);
  reject(s,{type:'move',uid:'reserve-6',zone:'back'});
});

test('full reserves still allow a purchase that immediately merges three copies',()=>{
  const s=createGame(2);
  for(let i=0;i<9;i++)s.units.push({uid:`reserve-${i}`,characterId:i===0?'1013':'1001',star:i===0?1:3,zone:'bench',items:[]});
  run(s,{type:'buy',index:0});
  assert.equal(s.units.filter(u=>u.zone==='bench').length,8);
  assert.equal(s.units.find(u=>u.characterId==='1013').star,2);
});

test('shop odds match the archived table and observed rolls stay in the classic pool',()=>{
  const expected={4:[65,25,10,0,0],5:[45,33,20,2,0],6:[30,40,25,5,0],7:[19,30,40,10,1],8:[18,25,32,22,3],9:[15,20,25,30,10],10:[5,10,20,40,25]};
  const classicIds=new Set(CLASSIC_ROSTER.map(c=>c.id));
  for(const [level,odds] of Object.entries(expected)){
    assert.deepEqual(SHOP_ODDS[level],odds);
    const s=createGame(20261113+Number(level));s.level=Number(level);s.gold=100000;
    const counts=[0,0,0,0,0];
    for(let n=0;n<400;n++){
      run(s,{type:'refresh'});
      for(const id of s.shop){assert.ok(classicIds.has(id));counts[getCharacter(id).cost-1]++;}
    }
    for(let i=0;i<5;i++){
      if(odds[i]===0)assert.equal(counts[i],0,`level ${level}, cost ${i+1}`);
      else assert.ok(Math.abs(counts[i]/2000-odds[i]/100)<.04,`level ${level}, cost ${i+1}: ${counts}`);
    }
  }
});

test('strategy rewards grant exact starting money, XP, equipment and free refreshes',()=>{
  const expected={
    'experience-account':{xp:10},'free-lunch':{free:11},'regular-benefit':{gold:4},
    'gas-station':{gold:8,free:1},'long-term':{gold:7},'fixed-finance':{xp:4,free:2},
    'interest-raise':{gold:25},buyout:{gold:15},
    'knife-blessing':{item:'knife'},'pistol-blessing':{item:'pistol'},'star-blessing':{item:'star'},
    'flower-blessing':{item:'flower'},'armor-blessing':{item:'armor'},
  };
  assert.equal(STRATEGIES.filter(s=>!s.legacy).length,59);
  for(const [id,e] of Object.entries(expected)){
    const s=choose(createGame(2),id);
    assert.equal(s.gold,16+(e.gold||0),id);assert.equal(xpTotal(s),e.xp||0,id);
    assert.equal(s.freeRefreshes,e.free||0,id);
    assert.deepEqual(s.inventory,[],id+' must wait for pickup');
    for(const orb of [...s.loot])run(s,{type:'collect-loot',uid:orb.uid});
    assert.deepEqual(s.inventory,['knife','flower','battery',...(e.item?[e.item]:[])],id);
  }
});

test('health-charge increases the maximum as well as current health',()=>{
  const s=createGame(1);s.hp=52;choose(s,'health-charge');
  assert.equal(getMaxHp(s),130);assert.equal(s.hp,82);
  const full=choose(createGame(1),'health-charge');assert.equal(full.hp,130);
});

test('free lunch consumes eleven free rolls before charging the classic two coins',()=>{
  const s=choose(createGame(9),'free-lunch');const gold=s.gold;
  for(let i=11;i>0;i--){assert.equal(getRefreshCost(s),0);run(s,{type:'refresh'});assert.equal(s.freeRefreshes,i-1);assert.equal(s.gold,gold);}
  assert.equal(getRefreshCost(s),2);run(s,{type:'refresh'});assert.equal(s.gold,gold-2);
});

test('regular income, gas-station refreshes and time-limited long-term grants trigger on nodes',()=>{
  const regular=choose(createGame(1),'regular-benefit');nextNode(regular);assert.equal(regular.gold,22);
  const gas=choose(createGame(1),'gas-station');run(gas,{type:'refresh'});nextNode(gas);
  assert.equal(gas.gold,24);assert.equal(gas.freeRefreshes,1);
  const long=choose(createGame(1),'long-term');
  for(let i=1;i<=4;i++){nextNode(long);assert.equal(long.gold,23+7*Math.min(i,3));}
});

test('special-fund pays on entering each boss node, not ordinary nodes',()=>{
  const s=choose(createGame(1),'special-fund');
  for(let round=2;round<=8;round++){nextNode(s);assert.equal(s.gold,16+7*Math.floor(round/4));}
});

test('savings-return checks actual gold spending and free rolls do not disqualify it',()=>{
  const s=choose(createGame(1),'savings-return');nextNode(s);assert.equal(s.freeRefreshes,2);
  run(s,{type:'refresh'});nextNode(s);assert.equal(s.freeRefreshes,3);
  run(s,{type:'exp'});nextNode(s);assert.equal(s.freeRefreshes,3);assert.equal(s.goldSpentThisNode,0);
  run(s,{type:'buy',index:0});run(s,{type:'sell',uid:s.units.find(u=>u.zone==='bench').uid});
  nextNode(s);assert.equal(s.freeRefreshes,3,'selling does not erase money spent earlier in the node');
});

test('armed-refresh rewards only successful item synthesis',()=>{
  const s=choose(createGame(1),'armed-refresh');s.inventory=['knife','knife','battery','battery'];
  run(s,{type:'combine',indexA:0,indexB:1});assert.equal(s.freeRefreshes,2);
  reject(s,{type:'combine',indexA:0,indexB:2});assert.equal(s.freeRefreshes,2);
  run(s,{type:'combine',indexA:1,indexB:2});assert.equal(s.freeRefreshes,4);
});

test('fixed-finance pays at acquisition and later plane boundaries only',()=>{
  const s=choose(createGame(1),'fixed-finance');
  for(let round=2;round<=9;round++){
    const before=xpTotal(s),free=s.freeRefreshes;nextNode(s);
    assert.equal(xpTotal(s)-before,2+([5,9].includes(round)?4:0));
    assert.equal(s.freeRefreshes-free,[5,9].includes(round)?2:0);
  }
});

test('talent-vacancy grants XP at four reserve units, but not at five',()=>{
  for(const count of [0,4,5]){
    const s=choose(createGame(1),'talent-vacancy');
    for(let i=0;i<count;i++)s.units.push({uid:`reserve-${i}`,characterId:'1013',star:3,zone:'bench',items:[]});
    nextNode(s);assert.equal(xpTotal(s),2+(count<=4?3:0));
  }
});

test('twin-primes grants 2/3/5/7/11 XP once per cost and remembers the purchase across reloads',()=>{
  for(let cost=1;cost<=5;cost++){
    let s=choose(createGame(1),'twin-primes');s.gold=100;
    const id=CLASSIC_ROSTER.find(c=>c.cost===cost).id;s.shop[0]=id;
    run(s,{type:'buy',index:0});assert.equal(xpTotal(s),[0,2,3,5,7,11][cost]);
    s=migrateState(JSON.parse(JSON.stringify(s)));s.shop[0]=id;
    run(s,{type:'buy',index:0});assert.equal(xpTotal(s),[0,2,3,5,7,11][cost]);
    assert.deepEqual(s.strategyState['twin-primes'].purchasedCosts,[cost]);
  }
});

test('interest-raise caps at ten, while buyout disables all interest and grants node XP',()=>{
  const s=createGame(1);s.gold=149;assert.equal(getInterest(s),5);
  choose(s,'interest-raise');assert.equal(s.gold,174);assert.equal(getInterest(s),10);
  s.gold=89;assert.equal(getInterest(s),8);
  choose(s,'buyout');assert.equal(s.gold,104);assert.equal(getInterest(s),0);
  nextNode(s);assert.equal(xpTotal(s),6);assert.equal(s.gold,104);
});

test('prospector rewards paid refreshes, excludes free refreshes and failed purchases',()=>{
  const s=choose(createGame(1),'prospector');s.freeRefreshes=1;
  run(s,{type:'refresh'});assert.equal(xpTotal(s),0);
  run(s,{type:'refresh'});assert.equal(xpTotal(s),2);assert.equal(s.gold,14);
  s.gold=0;reject(s,{type:'refresh'});assert.equal(xpTotal(s),2);
});

test('promotion upgrades exactly one available shop slot by one cost when buying XP',()=>{
  const s=choose(createGame(88),'promotion');const before=[...s.shop];run(s,{type:'exp'});
  const changed=s.shop.map((id,i)=>id!==before[i]?i:-1).filter(i=>i>=0);
  assert.equal(changed.length,1);const index=changed[0];
  assert.equal(getCharacter(s.shop[index]).cost,getCharacter(before[index]).cost+1);
  const five=CLASSIC_ROSTER.find(c=>c.cost===5).id;s.shop=[five,null,five,null,five];
  const capped=[...s.shop];run(s,{type:'exp'});assert.deepEqual(s.shop,capped);
});

test('peace-insurance refunds already-lost health and heals only surviving battles',()=>{
  const s=createGame(1);s.hp=61;choose(s,'peace-insurance');assert.equal(s.gold,55);
  run(s,{type:'battle'});assert.equal(s.hp,Math.min(100,61-s.lastBattle.damage+10));
  const lethal=createGame(55);lethal.units=lethal.units.slice(0,1);lethal.round=12;lethal.hp=1;
  choose(lethal,'peace-insurance');run(lethal,{type:'battle'});assert.equal(lethal.hp,0);
});

test('strategy choice pools exclude legacy effects and respect appearance planes',()=>{
  for(const target of [2,6,10]){
    const s=createGame(77);s.round=target-1;nextNode(s,{dismiss:false});
    assert.equal(s.phase,'choice');assert.equal(new Set(s.choices.map(c=>c.id)).size,3);
    for(const c of s.choices){const definition=STRATEGIES.find(s=>s.id===c.id);assert.equal(!!definition.legacy,false);assert.ok(definition.planes.includes(Math.ceil(target/4)));}
  }
});

test('v1 migration preserves old units, equipment, choices and earned resources without replaying grants',()=>{
  const old=createGame(1996);old.version=1;delete old.ruleset;delete old.freeRefreshes;delete old.goldSpentThisNode;delete old.strategyState;
  old.gold=83;old.xp=3;old.hp=62;old.strategies=['compound','dividend','growth'];
  old.units[0].characterId='1002';old.units[0].items=['blade','electric'];
  old.phase='choice';old.choiceKind='strategy';old.choices=['discount','recovery','fortress'].map(id=>({kind:'strategy',id}));
  const before=structuredClone(old),migrated=migrateState(old);
  assert.ok(migrated);assert.equal(migrated.version,3);assert.equal(validateState(migrated),true);
  for(const key of ['gold','xp','hp','units','inventory','shop','choices','strategies','history','rng'])assert.deepEqual(migrated[key],before[key],key);
  assert.deepEqual(old,before,'migration must not mutate the supplied stored value');
  assert.deepEqual(migrateState(migrated),migrated,'reload is idempotent');
  run(migrated,{type:'choose',index:0});assert.equal(migrated.gold,83);
  run(migrated,{type:'refresh'});assert.equal(migrated.gold,82,'old discount keeps its saved behavior');
});

test('migration rejects corrupt saves and v2 validation rejects invalid management counters',()=>{
  for(const value of [null,{}, {version:99}, {...createGame(1),gold:-1}, {...createGame(1),freeRefreshes:-1}])assert.equal(migrateState(value),null);
  const s=createGame(1);s.strategyState={x:{acquiredRound:2,nodes:0,purchasedCosts:[]}};assert.equal(validateState(s),false);
  s.strategyState={x:{acquiredRound:1,nodes:0,purchasedCosts:[6]}};assert.equal(validateState(s),false);
});

test('legacy saves with previously legal duplicate or dice equipment are normalized without item loss',()=>{
  for(const items of [['electric','electric'],['comet','knife','flower'],['knife','comet','battery']]){
    const old=createGame(12);old.version=1;old.units[0].items=[...items];old.inventory=[];
    delete old.ruleset;delete old.freeRefreshes;delete old.goldSpentThisNode;delete old.strategyState;
    const migrated=migrateState(old);assert.ok(migrated);assert.equal(validateState(migrated),true);
    const worn=migrated.units[0].items;
    if(worn.includes('comet'))assert.equal(worn.length,1);
    assert.ok(worn.filter(id=>id==='electric').length<=1);
    assert.deepEqual([...worn,...migrated.inventory].sort(),[...items].sort());
    assert.deepEqual(old.units[0].items,items);
  }
});

test('drag order determines front slot one without changing ownership or deployed counts',()=>{
  const s=createGame(97),front=s.units.filter(u=>u.zone==='front'),uid=front[2].uid;
  const originalIds=s.units.map(u=>u.uid).sort();
  assert.equal(act(s,{type:'move',uid,zone:'front',position:0}).ok,true);
  assert.equal(s.units.filter(u=>u.zone==='front')[0].uid,uid);
  assert.deepEqual(s.units.map(u=>u.uid).sort(),originalIds);
  assert.equal(validateState(s),true);
  const before=JSON.stringify(s);
  assert.equal(act(s,{type:'move',uid,zone:'front',position:-1}).ok,false);
  assert.equal(JSON.stringify(s),before);
});
