// Classic Zero-Sum materials and diamond recipes. Source/version audit:
// docs/classic-crafting-research.md. These are not in the ordinary chest pool.
export const SPECIAL_CRAFTING_EQUIPMENT = [
  {id:'red-gem',name:'红钻',tier:3,category:'diamond',craftingMaterial:true,color:'#ef626c',icon:'◆',description:'用于合成阵营星徽。与另一颗红钻或蓝钻合成财富宝钻，持有宝钻可增加1个团队名额。'},
  {id:'blue-gem',name:'蓝钻',tier:3,category:'diamond',craftingMaterial:true,color:'#72c7ff',icon:'◆',description:'用于合成流派星徽。与另一颗红钻或蓝钻合成财富宝钻，持有宝钻可增加1个团队名额。'},
  {id:'trash-bag',name:'垃圾袋',tier:3,category:'trash',craftingMaterial:true,color:'#8882b5',icon:'♜',frontPower:.03,backPower:.03,crit:.03,critDamage:.03,speedPct:.03,damageAmp:.03,description:'前台强度、后台强度、幸运一击率、幸运一击伤害、速度增幅与伤害增幅各提高3%。与红钻或蓝钻合成欢愉星徽。'},
];
const recipeRows = [
  ['red-gem','skates','trait-day'],['red-gem','knife','trait-luofu'],
  ['red-gem','pistol','trait-night'],['red-gem','star','trait-festival'],
  ['red-gem','flower','trait-wolfpack'],['red-gem','armor','trait-belobog'],
  ['red-gem','drill','trait-wanderer'],['red-gem','battery','trait-scholar'],
  ['blue-gem','skates','trait-follow'],['blue-gem','knife','trait-sp'],
  ['blue-gem','pistol','trait-debuff'],['blue-gem','star','trait-aoe'],
  ['blue-gem','flower','trait-blood'],['blue-gem','armor','trait-dot'],
  ['blue-gem','drill','trait-break'],['blue-gem','battery','trait-energy'],
  ['red-gem','red-gem','wealth-gem'],['red-gem','blue-gem','wealth-gem'],['blue-gem','blue-gem','wealth-gem'],
  ['red-gem','trash-bag','trait-elation'],['blue-gem','trash-bag','trait-elation'],
];
export const SPECIAL_CRAFTING_RECIPES = Object.fromEntries(recipeRows.map(([a,b,id])=>[[a,b].sort().join('+'),id]));
