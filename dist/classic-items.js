// Zero-Sum Game (the original Currency Wars season), including its 3.8 balance pass.
// Percentages are fractional modifiers. Never interpret these as flat RPG stat points.
// Provenance and version differences are documented in docs/classic-items-research.md.
const item = (id,name,art,description,stats={},passive=null) => ({id,name,art,icon:'◇',color:'#aab6ce',tier:1,description,...stats,...(passive?{passive}:{}),season:'zero-sum'});
const advanced = (id,name,art,description,stats={},passive=null) => ({...item(id,name,art,description,stats,passive),tier:2,color:'#d4b760'});
export const CLASSIC_EQUIPMENT = [
 item('knife','折叠小刀','knife','前台强度提高 10%。',{frontPower:.10}),
 item('pistol','和平手枪','pistol','后台强度提高 10%。',{backPower:.10}),
 item('star','幸运星','star','幸运一击率提高 5%。',{crit:.05}),
 item('flower','生命之花','flower','生命上限提高 5%。',{hpPct:.05}),
 item('skates','轮滑鞋','skates','速度提高 5%。',{speedPct:.05}),
 item('armor','量产型装甲','armor','受到的伤害降低 5%。',{damageReduction:.05}),
 item('drill','以太钻头','drill','弱点击破效率提高 10%。',{breakEfficiency:.10}),
 item('battery','光能电池','battery','进入战斗时额外获得 15 点能量。',{startEnergy:15}),
 advanced('boots','反重力皮靴','boots','速度提高 20%；自己的每个回合开始时，再叠加 15% 速度增幅。',{speedPct:.20},'accelerating-boots'),
 advanced('firestorm','火力风暴潮','blade','前后台强度提高 20%，速度提高 10%；每次攻击后叠加 8% 前后台强度。',{frontPower:.20,backPower:.20,speedPct:.10},'firestorm'),
 advanced('catapult','电磁弹射器','pistol','后台强度提高 30%，速度提高 20%；处于后台时，开战行动提前 50%。',{backPower:.30,speedPct:.20},'backline-catapult'),
 advanced('star-chase','追逐星辰','comet','幸运一击率与速度各提高 10%；攻击使目标受到伤害提高 35%，持续其 2 个回合。',{crit:.10,speedPct:.10},'vulnerability-35'),
 advanced('blossom','步步生花','garden','生命与速度各提高 10%，伤害提高 15%；前台且当前生命超过 70% 时，额外提高 30% 伤害。',{hpPct:.10,speedPct:.10,damageAmp:.15},'healthy-frontline'),
 advanced('meteor-wings','流星飞翼','electric','减伤提高 10%，速度提高 15%；终结技后恢复 1 战技点，并使全队获得 15% 速度增幅，持续 2 回合。',{damageReduction:.10,speedPct:.15},'ultimate-team-speed'),
 advanced('light-propeller','光速螺旋桨','drill','速度提高 10%；每 10 点速度提供 2% 前台强度与 1% 后台强度。',{speedPct:.10},'speed-to-power'),
 advanced('electric','电光履','electric','初始能量增加 30，速度提高 25%；自己的回合开始时恢复能量上限的 10%。（唯一装备）',{startEnergy:30,speedPct:.25,unique:true},'energy-each-turn'),
 advanced('blade','碎星斩舰刀','blade','前台强度提高 60%，伤害提高 15%。',{frontPower:.60,damageAmp:.15}),
 advanced('hybrid','武器大师','hybrid','自身前后台强度提高 20%；全队前后台强度额外提高 25%。',{frontPower:.20,backPower:.20},'team-power-25'),
 advanced('chainsaw','高周波电锯','blade','前台强度与幸运一击率各提高 30%；位于前台时，幸运一击伤害提高 10%。',{frontPower:.30,crit:.30},'front-crit-damage'),
 advanced('bloodshot','杀红眼','knife','生命提高 10%，前后台强度提高 30%；击败一名敌人后，伤害提高 25%。',{hpPct:.10,frontPower:.30,backPower:.30},'kill-damage-25'),
 advanced('confidence','信心注入器','battery','减伤提高 10%，前台强度提高 30%；对友方施放技能时，使其前台强度提高 30%、减伤提高 10%，持续 2 回合。',{damageReduction:.10,frontPower:.30},'ally-skill-confidence'),
 advanced('kinetic-sword','动能激发剑','blade','前台强度提高 40%；自己的回合开始恢复 1 战技点，消耗战技点后再恢复 1 点，每回合最多恢复 3 点。',{frontPower:.40},'skill-point-refund'),
 advanced('evolution','战场进化手册','hybrid','初始能量增加 20，前后台强度提高 20%；每个星级额外提供 10% 速度与 10% 伤害。',{startEnergy:20,frontPower:.20,backPower:.20},'star-scaling'),
 advanced('orbital','天基轨道炮','cannon','后台强度提高 60%，伤害提高 15%。',{backPower:.60,damageAmp:.15}),
 advanced('satellite-sniper','反卫星狙击枪','pistol','后台强度与幸运一击率各提高 30%；位于后台时，幸运一击伤害提高 10%。',{backPower:.30,crit:.30},'back-crit-damage'),
 advanced('cover-gun','掩体生成枪','cannon','生命提高 10%，前后台强度提高 20%；自己的回合开始时，为全体前台提供等于自身生命上限 30% 的护盾，持续 2 回合。',{hpPct:.10,frontPower:.20,backPower:.20},'turn-team-shield'),
 advanced('exoskeleton','自适应外骨骼','armor','减伤提高 10%，前后台强度提高 20%；前台时额外获得 25% 减伤并更易受攻击；后台时额外获得 20% 后台强度和 20% 速度。',{damageReduction:.10,frontPower:.20,backPower:.20},'adaptive-position'),
 advanced('cannon','斩首行动','cannon','前后台强度提高 20%，速度提高 10%；对精英和首领的伤害提高 40%、削韧效率提高 25%。',{frontPower:.20,backPower:.20,speedPct:.10},'elite-execution'),
 advanced('energy-sail','蓄能帆','battery','初始能量增加 20，前后台强度提高 30%；每经过 1 点行动值，恢复 2 点能量。（唯一装备）',{startEnergy:20,frontPower:.30,backPower:.30,unique:true},'action-value-energy'),
 advanced('comet','随便骰子','comet','减伤与幸运一击率各提高 20%；每个节点随机填充另外两个装备栏。只能在空装备栏角色上装备。',{damageReduction:.20,crit:.20,exclusiveSlots:true},'random-two-items'),
 advanced('blood-fist','热血沸腾拳','flower','幸运一击率与生命各提高 10%；生命上限超过 5000 时，超过部分每 1000 生命再提供 2% 幸运一击率，最多 40%。',{crit:.10,hpPct:.10},'health-to-crit'),
 advanced('revenge-armor','以牙还牙甲','bastion','减伤提高 10%，幸运一击率和护盾强度提高 20%；开战为全体前台提供自身防御力 300% 的护盾。受击后按受击前护盾的 250% 反伤，反伤不能击杀。',{damageReduction:.10,crit:.20,shieldAmp:.20},'shield-retaliation'),
 advanced('victory-flag','胜利之旗','star','自身幸运一击率提高 10%；全队幸运一击率提高 12%，并获得 4 次控制抵抗。',{crit:.10},'team-luck-control'),
 advanced('joke-engine','冷笑话引擎','perpetual','初始能量增加 60，幸运一击率提高 10%；每次终结技叠加 10% 幸运一击率，最多 5 层。',{startEnergy:60,crit:.10},'ultimate-luck'),
 advanced('garden','生命之环','garden','自身生命提高 15%；全队生命上限额外提高 15%。',{hpPct:.15},'team-health-15'),
 advanced('bastion','痛觉阻断芯片','bastion','生命提高 10%，护盾强度提高 20%；提供治疗或护盾后，使目标获得 15% 减伤，持续 2 回合。',{hpPct:.10,shieldAmp:.20},'protective-support'),
 advanced('dissolver','物质分解液','flower','生命提高 10%，速度提高 15%；自己的每回合首次攻击后，对其中随机一名目标追加其生命上限 3% 的真实伤害。',{hpPct:.10,speedPct:.15},'percent-true-damage'),
 advanced('absolute-heat','绝对热量','garden','初始能量增加 20，生命提高 15%；友方行动时恢复等于装备者生命上限 20% 的生命；装备者终结技后恢复 10 能量。（唯一装备）',{startEnergy:20,hpPct:.15,unique:true},'team-action-heal'),
 advanced('hard-armor','很硬的甲','armor','自身减伤提高 20%；全队额外获得 18% 减伤。',{damageReduction:.20},'team-reduction-18'),
 advanced('flashbang','闪光手榴弹','battery','减伤提高 10%，速度提高 15%；敌人登场后造成的伤害降低 20%。',{damageReduction:.10,speedPct:.15},'enemy-weaken-20'),
 advanced('light-shield','光能盾牌','bastion','初始能量增加 30，减伤提高 10%，护盾强度提高 20%；前台生命跌破一半时为其提供装备者防御力 300% 的护盾，持续 2 回合，每战至多 5 次。持盾前台免疫行动延后。',{startEnergy:30,damageReduction:.10,shieldAmp:.20},'emergency-shield'),
 advanced('wormhole-drill','虫洞掘进钻头','drill','击破效率提高 50%，击破特攻提高 250%。',{breakEfficiency:.50,breakEffect:2.50}),
 advanced('planetary-drill','行星钻地弹','drill','初始能量增加 15；攻击使目标受到伤害提高 35%，持续其 2 个回合。',{startEnergy:15},'vulnerability-35'),
 advanced('perpetual','永动机','perpetual','前后台强度提高 20%；开战激活终结技，每施放 3 次自然终结技再激活一次。由此装备激活的终结技不计数。',{frontPower:.20,backPower:.20},'perpetual-ultimate'),
];

// The complete unordered 8×8 recipe matrix: 8 identical pairs plus 28 mixed pairs.
const recipes = [
 ['skates','skates','boots'],['knife','skates','firestorm'],['pistol','skates','catapult'],['skates','star','star-chase'],['flower','skates','blossom'],['armor','skates','meteor-wings'],['drill','skates','light-propeller'],['battery','skates','electric'],
 ['knife','knife','blade'],['knife','pistol','hybrid'],['knife','star','chainsaw'],['flower','knife','bloodshot'],['armor','knife','confidence'],['drill','knife','kinetic-sword'],['battery','knife','evolution'],
 ['pistol','pistol','orbital'],['pistol','star','satellite-sniper'],['flower','pistol','cover-gun'],['armor','pistol','exoskeleton'],['drill','pistol','cannon'],['battery','pistol','energy-sail'],
 ['star','star','comet'],['flower','star','blood-fist'],['armor','star','revenge-armor'],['drill','star','victory-flag'],['battery','star','joke-engine'],
 ['flower','flower','garden'],['armor','flower','bastion'],['drill','flower','dissolver'],['battery','flower','absolute-heat'],['armor','armor','hard-armor'],['armor','drill','flashbang'],['armor','battery','light-shield'],['drill','drill','wormhole-drill'],['battery','drill','planetary-drill'],['battery','battery','perpetual'],
];
export const CLASSIC_RECIPES = Object.fromEntries(recipes.map(([a,b,id])=>[[a,b].sort().join('+'),id]));
export const CLASSIC_RECIPE_PARTS = Object.fromEntries(recipes.map(([a,b,id])=>[id,[a,b]]));

const strategy=(id,name,rarity,description,effect,planes=[1,2,3])=>({id,name,rarity,description,effect,planes,icon:rarity==='棱彩'?'✦':rarity==='黄金'?'◇':'✧',season:'zero-sum'});
export const CLASSIC_STRATEGIES = [
 strategy('experience-account','经验到账','白银','立即获得 10 经验。',{xp:10},[1]),
 strategy('free-lunch','免费午餐','白银','获得 11 次免费刷新。',{freeRefreshes:11},[2,3]),
 strategy('special-fund','特战资金','白银','每次进入首领节点时获得 7 金币。',{bossGold:7},[1]),
 strategy('savings-return','存款回报','白银','进入新节点时，若上个节点没有花费金币，获得 2 次免费刷新。',{unspentFreeRefreshes:2}),
 strategy('armed-refresh','武力刷新','白银','每合成一件装备，获得 2 次免费刷新。',{combineFreeRefreshes:2},[2]),
 strategy('health-charge','健康充值','白银','小队生命上限和当前生命各增加 30 点。',{maxHp:30,heal:30}),
 strategy('positive-energy','正能量','白银','开战时，全队恢复能量上限的 20%。',{battle:{startEnergy:20}}),
 strategy('team-hope','全队的希望','白银','前台 1 号位获得 15% 伤害增幅和 15% 生命增幅。',{battle:{firstFrontDamage:.15,firstFrontHp:.15}},[2,3]),
 strategy('cheer-squad','应援团','白银','后台至少有 4 名角色时，全队速度提高 15%。',{battle:{backlineRequired:4,backlineSpeed:.15}}),
 strategy('team-strength-silver','团队力量·银','白银','每激活一个非独立羁绊，全队前后台强度提高 3%。',{battle:{powerPerTrait:.03}}),
 strategy('efficient-employee','效率员工奖','白银','开战时，速度最高的 3 名角色获得 10% 速度增幅。',{battle:{fastestCount:3,fastestSpeed:.10}}),
 strategy('grassroots','基层贡献','白银','每名上场 1 费角色提供全队 3% 速度、2% 减伤；三星 1 费角色按三倍计算。',{battle:{oneCostSpeed:.03,oneCostReduction:.02,threeStarMultiplier:3}}),
 strategy('regular-benefit','定期福利','黄金','立即获得 4 金币；之后每次进入新节点获得 2 金币。',{gold:4,nodeGold:2},[1]),
 strategy('gas-station','加油站','黄金','立即获得 8 金币；现在及之后每个新节点各获得 1 次免费刷新。',{gold:8,freeRefreshes:1,nodeFreeRefreshes:1}),
 strategy('long-term','长期主义','黄金','现在和接下来 3 个新节点，各获得 7 金币。',{gold:7,nodeGold:7,nodeGoldLimit:3},[2]),
 strategy('fixed-finance','固定理财','黄金','现在和每个位面开始时，各获得 4 经验及 2 次免费刷新。',{xp:4,freeRefreshes:2,planeXp:4,planeFreeRefreshes:2},[1]),
 strategy('talent-vacancy','人才空洞','黄金','进入新节点时，若备战席不超过 4 人，获得 3 经验。',{benchMaxForXp:4,benchXp:3},[1]),
 strategy('twin-primes','孪生素数','黄金','获得后首次购买各费用角色，分别获得 2 / 3 / 5 / 7 / 11 经验。',{purchaseXp:[0,2,3,5,7,11]}),
 strategy('knife-blessing','折叠小刀祝福','黄金','获得折叠小刀；全队前台强度提高 30%，伤害提高 5%。',{items:['knife'],battle:{frontPower:.30,damageAmp:.05}}),
 strategy('pistol-blessing','和平手枪祝福','黄金','获得和平手枪；全队后台强度提高 30%，初始能量增加 15。',{items:['pistol'],battle:{backPower:.30,startEnergy:15}}),
 strategy('star-blessing','幸运星祝福','黄金','获得幸运星；全队幸运一击率提高 15%，速度提高 5%。',{items:['star'],battle:{crit:.15,speedPct:.05}}),
 strategy('flower-blessing','生命之花祝福','黄金','获得生命之花；全队生命提高 15%，治疗强度提高 5%。',{items:['flower'],battle:{hpPct:.15,healAmp:.05}}),
 strategy('armor-blessing','量产型装甲祝福','黄金','获得量产型装甲；全队减伤提高 15%，护盾强度提高 5%。',{items:['armor'],battle:{damageReduction:.15,shieldAmp:.05}}),
 strategy('supply-chain','打通上下游·金','黄金','全队速度提高 10%；每进入一个新节点，再提高 1%。',{battle:{speedPct:.10,speedPerNode:.01}}),
 strategy('delayed-return','延迟收益','黄金','开战经过 100 行动值后，全队伤害提高 40%。',{battle:{damageAfterTime:100,delayedDamage:.40}}),
 strategy('triple-three','三三三','黄金','三星、三费、穿戴三件装备各提供 10% 速度与 20% 前后台强度，满足多项时叠加。',{battle:{tripleThreeSpeed:.10,tripleThreePower:.20}}),
 strategy('middle-class','中产阶级','黄金','每名上场二星角色，使全队获得 15% 前后台强度和 5% 减伤。',{battle:{powerPerTwoStar:.15,reductionPerTwoStar:.05}}),
 strategy('team-strength-gold','团队力量·金','黄金','每激活一个非独立羁绊，全队前后台强度提高 6%，生命提高 4%。',{battle:{powerPerTrait:.06,hpPerTrait:.04}}),
 strategy('interest-raise','利息上调','棱彩','立即获得 25 金币，利息上限提高至 10。',{gold:25,interestCap:10},[1]),
 strategy('buyout','买断制','棱彩','立即获得 15 金币；不再获得利息，每个新节点获得 4 经验。',{gold:15,noInterest:true,nodeXp:4}),
 strategy('prospector','淘金客','棱彩','每次花费金币刷新商店，获得 2 经验。',{paidRefreshXp:2}),
 strategy('promotion','晋升名额','棱彩','购买经验时，将商店一名随机角色替换成高一费的随机角色，最高五费。',{expShopPromotion:true},[2,3]),
 strategy('peace-insurance','星际和平保险','棱彩','立即获得等于已损失小队生命的金币；之后每次战斗结束恢复 10 点小队生命。',{goldFromLostHp:true,battleHeal:10}),
 strategy('feiguang-moon','飞光•映月','棱彩','获得镜流和特殊1费景元，为二人增加师徒羁绊；镜流升至2/3星时，景元费用变为3/5费。',{progressionUnlock:'mentor'},[1]),
 strategy('feiguang-sword','飞光•传剑','棱彩','获得彦卿和景元，为二人增加师徒羁绊；彦卿天河泻附加神君与景元累计伤害的15%，二人每共同进入新节点再提高4%。',{progressionUnlock:'mentor'},[2]),
];

// Preserve saved v1-v3 inventory identifiers while replacing their former invented formulas.
export const LEGACY_STRATEGY_MAP = {
 compound:'interest-raise',dividend:'regular-benefit',growth:'experience-account',discount:'gas-station',
 vanguard:'knife-blessing',backline:'pistol-blessing',fortress:'armor-blessing',recovery:'peace-insurance',momentum:'star-blessing',
};

// Appearance planes are recorded separately from combat balance values.
const strategyPlanes = {"经验到账":[1],"免费午餐":[2,3],"存款回报":[1],"武力刷新":[2],"健康充值":[2,3],"正能量":[1,2,3],"全队的希望":[2,3],"应援团":[2,3],"团队力量·银":[2,3],"效率员工奖":[1,2,3],"基层贡献":[1],"定期福利":[1],"加油站":[1],"长期主义":[2],"固定理财":[1],"人才空洞":[1],"孪生素数":[2],"折叠小刀祝福":[1,2,3],"和平手枪祝福":[1,2,3],"幸运星祝福":[1,2,3],"生命之花祝福":[1,2,3],"量产型装甲祝福":[1,2,3],"打通上下游·金":[1],"延迟收益":[2,3],"三三三":[2,3],"中产阶级":[1],"团队力量·金":[1,2,3],"利息上调":[1],"买断制":[1],"淘金客":[1,2],"晋升名额":[2,3],"星际和平保险":[3]};
for (const choice of CLASSIC_STRATEGIES) choice.planes = strategyPlanes[choice.name] || choice.planes;
