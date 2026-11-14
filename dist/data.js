import { CHARACTERS as OLD_CHARACTERS, STRATEGIES as OLD_STRATEGIES, TRAITS as LEGACY_TRAITS } from './legacy-data.js?v=4.0.2';
export { LEGACY_TRAITS };
import { CLASSIC_CHARACTERS, CLASSIC_TRAITS, CLASSIC_SOURCE_SEASON } from './classic-roster.js?v=4.0.2';
import { CLASSIC_EQUIPMENT, CLASSIC_RECIPES, CLASSIC_STRATEGIES } from './classic-items.js?v=4.0.2';
export { LEVEL_XP, SHOP_ODDS, MAX_LEVEL, BENCH_CAPACITY, FRONT_CAPACITY, ROUND_COUNT } from './classic-rules.js?v=4.0.2';
export { CLASSIC_SOURCE_SEASON };

const oldCharacters = new Map(OLD_CHARACTERS.map(c => [c.id,c]));
const firstSkill = c => c.empowerments.flatMap(e => e.skills).find(s => s.type === '战技');
export const CLASSIC_ROSTER = CLASSIC_CHARACTERS.map(c => {
  const old=oldCharacters.get(c.id), skill=firstSkill(c);
  return {
    ...old, ...c,
    // A common trial sheet keeps this standalone game independent of account relics / Eidolons.
    attack:old?.attack ?? 80+c.cost*26,
    hp:old?.hp ?? 650+c.cost*135,
    skill:skill?.name || old?.skill || c.empowerments[0]?.name || '战技',
    ultimate:old?.ultimate || c.empowerments.flatMap(e=>e.skills).find(s=>s.type==='终结技')?.name || '终结技',
    description:c.empowerments.map(e=>`${e.zone==='back'?'后台':'前台'}：${e.description}`).join('\n'),
    referenceDescription:c.empowerments.map(e=>`${e.zone==='back'?'后台':'前台'}赋能「${e.name}」：${e.description}`).join('\n'),
    simulationDescription:'独立回合模拟：保留赋能的触发方向；面板与固定伤害按网页战斗规模统一换算。',
    legacy:false,
  };
});
const classicIds=new Set(CLASSIC_ROSTER.map(c=>c.id));
// Existing runs retain their old, now out-of-pool units instead of losing saved progress.
export const CHARACTERS = [...CLASSIC_ROSTER, ...OLD_CHARACTERS.filter(c=>!classicIds.has(c.id)).map(c=>({...c,legacy:true,allowedZones:['front','back'],empowerments:[],portrait:`assets/portraits/${c.id}.png`,simulationDescription:'旧存档保留角色；不再出现在经典商店中。'}))];
export const TRAITS = CLASSIC_TRAITS;
export const getTraitArtPath = id => ['grail','gamer','mentor','elation','navigator'].includes(id)||!TRAITS.some(t=>t.id===id)?`assets/traits/${id}.svg`:`assets/traits/classic-${id}.png`;
export const EQUIPMENT = CLASSIC_EQUIPMENT;
export const RECIPES = CLASSIC_RECIPES;
const strategyIds=new Set(CLASSIC_STRATEGIES.map(s=>s.id));
export const STRATEGIES = [...CLASSIC_STRATEGIES,...OLD_STRATEGIES.filter(s=>!strategyIds.has(s.id)).map(s=>({...s,legacy:true}))];
