import {EQUIPMENT,TRAITS,RECIPES,resolveEquipment} from './data.js?v=6.4.2';

const fail=message=>({ok:false,message});
const baseId=id=>resolveEquipment(id)?.baseId||id;
const daySlots=(state,uid)=>Object.values(state.progression?.day?.assignments||{}).filter(id=>id===uid).length;
export const isCraftingMaterial=id=>!!resolveEquipment(id)&&(resolveEquipment(id).tier===1||resolveEquipment(id).craftingMaterial===true);
export const getCraftResult=(a,b)=>isCraftingMaterial(a)&&isCraftingMaterial(b)?RECIPES[[a,b].sort().join('+')]||null:null;

export function combineInventoryItems(state,indexA,indexB) {
  if(!Number.isInteger(indexA)||!Number.isInteger(indexB)||indexA<0||indexB<0||indexA===indexB)return fail('请选择两件不同的合成材料。');
  const a=state.inventory[indexA],b=state.inventory[indexB],result=getCraftResult(a,b);
  if(!resolveEquipment(a)||!resolveEquipment(b))return fail('请选择两件有效的合成材料。');
  if(!result)return fail('这两件装备没有合成配方。');
  // The result takes the target's place (the item dropped onto), so the rest of the 物品栏 keeps its order.
  state.inventory[indexB]=result;state.inventory.splice(indexA,1);
  return {ok:true,crafted:true,result,index:indexA<indexB?indexB-1:indexB,message:`合成成功：${resolveEquipment(result).name}`};
}

// Read-only preview shared with the UI. A second component combines on the
// wearer, even when all three physical slots are occupied; the result replaces
// the existing component rather than requesting a fourth slot.
export function getEquipCraftPreview(state,uid,itemIndex) {
  const unit=state.units.find(u=>u.uid===uid),incoming=state.inventory[itemIndex];
  if(!unit||!Number.isInteger(itemIndex)||!resolveEquipment(incoming))return fail('请选择角色和有效装备。');
  const componentIndex=unit.items.findIndex(id=>getCraftResult(id,incoming));
  const result=componentIndex>=0?getCraftResult(unit.items[componentIndex],incoming):incoming;
  const equipment=resolveEquipment(result),remaining=unit.items.filter((_,i)=>i!==componentIndex);
  if(equipment.unique&&remaining.some(id=>baseId(id)===baseId(result)))return fail(`不能合成或重复穿戴${equipment.name}：同一角色只能装备一件。`);
  if(equipment.exclusiveSlots&&(remaining.length||daySlots(state,uid))||remaining.some(id=>resolveEquipment(id)?.exclusiveSlots))return fail('随便骰子需要三个空装备栏，并占用另外两栏。');
  if(remaining.length+daySlots(state,uid)>=3)return fail('每位角色最多携带3件装备（包含白昼装备）。');
  return {ok:true,crafted:componentIndex>=0,result,componentIndex,incoming,message:componentIndex>=0?`合成并装备：${equipment.name}`:`装备：${equipment.name}`};
}

export function equipCraftingItem(state,uid,itemIndex) {
  const preview=getEquipCraftPreview(state,uid,itemIndex);
  if(!preview.ok)return preview;
  const unit=state.units.find(u=>u.uid===uid);
  if(preview.crafted)unit.items[preview.componentIndex]=preview.result;
  else unit.items.push(preview.result);
  state.inventory.splice(itemIndex,1);
  return preview;
}

// Keep the source equipment type. Diamonds swap color; emblems stay within
// their faction/style pool. There is no invented wealth-gem reroll outcome.
export function getSmeltingPool(id) {
  const original=resolveEquipment(id);
  if(!original||id==='wealth-gem'||id==='trash-bag')return [];
  if(id==='red-gem')return ['blue-gem'];
  if(id==='blue-gem')return ['red-gem'];
  if(original.trait){const type=TRAITS.find(t=>t.id===original.trait)?.type;return TRAITS.filter(t=>t.type===type).map(t=>`trait-${t.id}`).filter(candidate=>candidate!==id&&resolveEquipment(candidate));}
  return EQUIPMENT.filter(e=>e.tier===(original.privileged?2:original.tier)&&e.id!==(original.baseId||id)).map(e=>(original.privileged?'privileged:':'')+e.id);
}
