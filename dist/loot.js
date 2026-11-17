import {EQUIPMENT,TRAITS,CHARACTERS,CLASSIC_ROSTER,BENCH_CAPACITY,resolveEquipment} from './data.js?v=6.4.1';

export const LOOT_QUALITIES=['white','blue','gold','prismatic'];
const consumables={
  // Old client text: the Precision wrench can be used any number of times and is what base ranks
  // start with; the plain one disappears after a single use.
  'precision-wrench':{name:'精密拆装扳手',description:'拖到一名角色身上使用，取下该角色穿戴的所有装备，可无限次使用。持有时再获得拆装扳手，改为获得1金币。',requiresTarget:true,reusable:true,icon:'✚'},
  wrench:{name:'拆装扳手',description:'拖到一名角色身上使用，取下该角色穿戴的所有装备。使用后消失。',requiresTarget:true,icon:'✚'},
  projector:{name:'员工投影仪',description:'选择一名1～3费角色，获得其1星复制体。装备和星级不会复制。',requiresTarget:true,icon:'◇'},
  'perfect-projector':{name:'完美员工投影仪',description:'选择任意费用角色，获得其1星复制体。',requiresTarget:true,icon:'◈'},
  'privilege-card':{name:'特权赋予卡',description:'将所选角色第一件普通进阶装备升级为同名特权装备。',requiresTarget:true,icon:'✦'},
  'reroll-dice':{name:'装备重铸骰',description:'重铸所选角色第一件普通进阶装备，保持装备品级。',requiresTarget:true,icon:'⚄'},
  'privilege-dice':{name:'特权重铸骰',description:'重铸所选角色第一件特权装备，保持特权品级。',requiresTarget:true,icon:'⚅'},
  smelter:{name:'冶金炉',description:'取下所选角色的全部装备，各自重铸为同类型随机装备并放回物品栏。',requiresTarget:true,icon:'♜'},
  'wealth-gem':{name:'财富宝钻',description:'拥有时团队规模上限+1；每3个备战阶段产出1金币。无需使用。',requiresTarget:false,passive:true,icon:'◆'},
  // New rewards arrive as 聘用书 on the bench (see makeRoleChest); these entries only finish old saves.
  'hire-3':{name:'3费聘用书',description:'获得一名随机3费1星角色。',requiresTarget:false,icon:'Ⅲ'},
  'hire-4':{name:'4费聘用书',description:'获得一名随机4费1星角色。',requiresTarget:false,icon:'Ⅳ'},
  'hire-5':{name:'5费聘用书',description:'获得一名随机5费1星角色。',requiresTarget:false,icon:'Ⅴ'},
};
export function getConsumable(id) {
  if(consumables[id])return {id,...consumables[id]};
  if(id?.startsWith('trait-')) {
    const trait=TRAITS.find(t=>t.id===id.slice(6));
    if(trait)return {id,name:`${trait.name}星徽`,description:`使选中的角色额外拥有「${trait.name}」羁绊；同名角色仍只计算一次。`,requiresTarget:true,icon:'✧',trait:trait.id};
  }
  return undefined;
}
export function lootRandom(state) {
  let x=state.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.rng=x>>>0;
  return state.rng/4294967296;
}
// Old client forge table (GridFightForge): every 武装箱 and 聘用书 offers four choices. They are grid
// items that sit in a bench slot until opened (see the engine's bench slots).
export const FORGE_CHOICES=4;
export function makeChest(state,quality='basic',options) {
  if(quality==='privilege')quality='privileged';
  const tier=['advanced','gold','prismatic','privileged'].includes(quality)?2:1;
  if(!options) {
    const pool=EQUIPMENT.filter(e=>e.tier===tier).map(e=>e.id);options=[];
    while(options.length<FORGE_CHOICES&&pool.length)options.push(pool.splice(Math.floor(lootRandom(state)*pool.length),1)[0]);
    if(['prismatic','privileged'].includes(quality))options=options.map(id=>`privileged:${id}`);
  }
  return {uid:`chest-${state.nextLootUid++}`,kind:'equipment',quality,options:[...options]};
}
// 聘用书: "点击后进行角色招募，从四名N费角色中选择一名获得。"
export function makeRoleChest(state,cost,options) {
  if(!options) {
    const pool=CLASSIC_ROSTER.filter(c=>c.cost===cost).map(c=>c.id);options=[];
    while(options.length<FORGE_CHOICES&&pool.length)options.push(pool.splice(Math.floor(lootRandom(state)*pool.length),1)[0]);
  }
  return {uid:`chest-${state.nextLootUid++}`,kind:'role',quality:'basic',cost,options:[...options]};
}
export function queueRewards(state,rewards,source='战利品') {
  for(const reward of rewards||[]) {
    if(!reward)continue;
    if(reward.kind==='chest'&&(reward.amount||1)>1) {
      for(let n=0;n<reward.amount;n++)queueRewards(state,[{...reward,amount:1}],source);
      continue;
    }
    const contents=JSON.parse(JSON.stringify(reward.contents||[reward]));
    for(const r of contents)if(r.kind==='chest')r.chest=makeChest(state,r.quality||'basic',r.options);
    const quality=LOOT_QUALITIES.includes(reward.orbQuality)?reward.orbQuality:
      reward.kind==='gold'||reward.kind==='xp'||reward.kind==='hp'||reward.kind==='refresh'?'white':
      ['privilege','privileged','prismatic'].includes(reward.quality)||reward.kind==='item'&&['perfect-projector','wealth-gem'].includes(reward.id)?'prismatic':
      reward.quality==='advanced'||reward.quality==='gold'||reward.kind==='item'&&(resolveEquipment(reward.id)?.tier||0)>1?'gold':'blue';
    state.loot.push({uid:`loot-${state.nextLootUid++}`,quality,source,contents});
  }
}
export function initializeLoot(state,starter=false) {
  state.loot??=[];state.chests??=[];state.consumables??=[];state.activeChest??=null;state.nextLootUid??=1;state.bonusMaxHp??=0;
  if(starter)queueRewards(state,['knife','flower','battery'].map(id=>({kind:'item',id})),'初始补给');
}
export function validReward(r) {
  if(!r||!['gold','item','character','chest','xp','refresh','hp'].includes(r.kind))return false;
  if(r.amount!==undefined&&(!Number.isInteger(r.amount)||r.amount<0||r.amount>1000000))return false;
  if(r.kind==='item'&&!resolveEquipment(r.id)&&!getConsumable(r.id))return false;
  if(r.kind==='character'&&(typeof r.id!=='string'||r.star!==undefined&&![1,2,3].includes(r.star)))return false;
  if(r.kind==='character'&&!CHARACTERS.some(c=>c.id===r.id))return false;
  if(r.cost!==undefined&&(!Number.isInteger(r.cost)||r.cost<1||r.cost>5))return false;
  if(r.kind==='chest'&&!validChest(r.chest))return false;
  if(r.maxHp!==undefined&&(!Number.isInteger(r.maxHp)||r.maxHp<0))return false;
  return true;
}
export function validChest(c) {
  if(!c||typeof c.uid!=='string'||!Array.isArray(c.options)||c.options.length<3||c.options.length>FORGE_CHOICES)return false;
  if(c.slot!==undefined&&(!Number.isInteger(c.slot)||c.slot<0||c.slot>=BENCH_CAPACITY))return false;
  if(c.kind==='role')return Number.isInteger(c.cost)&&c.cost>=1&&c.cost<=5&&c.options.every(id=>CHARACTERS.some(ch=>ch.id===id));
  return c.kind==='equipment'&&c.options.every(id=>resolveEquipment(id));
}
export function validateLoot(state) {
  if(!Number.isInteger(state.nextLootUid)||state.nextLootUid<1||!Number.isInteger(state.bonusMaxHp)||state.bonusMaxHp<0)return false;
  if(!Array.isArray(state.loot)||!Array.isArray(state.chests)||!Array.isArray(state.consumables))return false;
  const ids=new Set(),unique=uid=>typeof uid==='string'&&!ids.has(uid)&&!!ids.add(uid);
  if(!state.loot.every(o=>o&&unique(o.uid)&&LOOT_QUALITIES.includes(o.quality)&&Array.isArray(o.contents)&&o.contents.length>0&&o.contents.every(validReward)))return false;
  if(!state.chests.every(c=>validChest(c)&&unique(c.uid)))return false;
  if(!state.consumables.every(c=>c&&unique(c.uid)&&getConsumable(c.id)))return false;
  return state.activeChest===null||state.phase==='prep'&&state.chests.some(c=>c.uid===state.activeChest);
}
