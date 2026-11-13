// An independently balanced, classic-inspired fan game. These are not official mode statistics.
export const TRAITS = [
  {id:'express',name:'星穹列车',thresholds:[2,4],description:'全队攻击提高 8% / 18%。',icon:'✦'},
  {id:'station',name:'空间站',thresholds:[2,3],description:'全队速度提高 8% / 16%。',icon:'⌘'},
  {id:'belobog',name:'贝洛伯格',thresholds:[2,4,6],description:'全队生命提高 10% / 20% / 32%。',icon:'❄'},
  {id:'hunters',name:'星核猎手',thresholds:[2,3],description:'全队攻击提高 12% / 24%。',icon:'◈'},
  {id:'luofu',name:'仙舟罗浮',thresholds:[2,4,6],description:'全队速度提高 6% / 14% / 24%。',icon:'☷'},
  {id:'wildfire',name:'地火',thresholds:[2,3],description:'全队生命提高 12% / 24%。',icon:'♨'},
  {id:'shield',name:'坚壁',thresholds:[2,3],description:'全队生命提高 14% / 28%。',icon:'⬡'},
  {id:'strike',name:'强攻',thresholds:[2,4],description:'全队攻击提高 10% / 22%。',icon:'⚔'},
  {id:'follow',name:'追击',thresholds:[2,4],description:'全队速度提高 10% / 22%。',icon:'⌁'},
  {id:'support',name:'协奏',thresholds:[2,4],description:'全队攻击与生命提高 6% / 14%。',icon:'✧'},
  {id:'dot',name:'持续伤害',thresholds:[2,3],description:'全队攻击提高 12% / 26%。',icon:'◉'},
  {id:'heal',name:'治愈',thresholds:[2],description:'全队生命提高 18%；每场结算恢复 4 点生命。',icon:'✚'},
];

const roster = [
  ['1001','三月七',1,'冰','守护',['express','shield'],82,920,'极寒的弓矢','为前排筑起坚实护盾，可靠的开局伙伴。','#8ddaf3'],
  ['1002','丹恒',1,'风','输出',['express','strike'],122,650,'云骑枪术','稳定的单体输出，升星后更具穿透力。','#79d1ba'],
  ['1003','姬子',4,'火','追击',['express','follow'],190,940,'乘胜追击','发动协同追击，让每次破绽都成为机会。','#e29d84'],
  ['1004','瓦尔特',4,'虚数','辅助',['express','support'],154,1120,'拟似黑洞','以重力控制战场，为队伍提供全面支援。','#cba77e'],
  ['1005','卡芙卡',5,'雷','持续伤害',['hunters','dot'],228,1040,'月光摩挲连绵','引爆持续伤害，星核猎手的核心输出。','#b580cf'],
  ['1006','银狼',4,'量子','辅助',['hunters','support'],178,940,'允许更改？','修改敌方弱点，让队伍输出更有效率。','#9b9bdf'],
  ['1008','阿兰',1,'雷','输出',['station','strike'],126,650,'禁锢解除','将危机化为力量的空间站防卫科员。','#a29acc'],
  ['1009','艾丝妲',1,'火','辅助',['station','support'],84,780,'星空祝言','加速全队行动，低费也能创造高回报。','#e9a2ae'],
  ['1013','黑塔',1,'冰','追击',['station','follow'],110,690,'转圈圈','连续追击，适合与其他追击角色搭配。','#b69ad9'],
  ['1101','布洛妮娅',4,'风','辅助',['belobog','support'],146,1050,'贝洛伯格进行曲','统领队伍，将主力的潜力充分释放。','#b9c8e9'],
  ['1102','希儿',4,'量子','输出',['wildfire','strike'],208,840,'乱蝶','高速出击，寻找战局中稍纵即逝的机会。','#a78ae6'],
  ['1103','希露瓦',2,'雷','持续伤害',['belobog','dot'],134,790,'机械热潮','用电流和节奏施加持续压力。','#c19ce7'],
  ['1104','杰帕德',3,'冰','守护',['belobog','shield'],104,1450,'永屹之壁','厚重的防线，让后排放心输出。','#a7caf1'],
  ['1105','娜塔莎',2,'物理','治疗',['wildfire','heal'],78,1130,'新生之礼','守护伙伴的医者，提供持久作战能力。','#91bfc8'],
  ['1106','佩拉',2,'冰','辅助',['belobog','support'],108,880,'领域压制','精准的情报支援，提升队伍整体效率。','#92aada'],
  ['1107','克拉拉',3,'物理','追击',['belobog','follow'],148,1260,'因为我们是家人','史瓦罗的反击同时兼顾伤害与生存。','#e6a9a9'],
  ['1108','桑博',2,'风','持续伤害',['wildfire','dot'],144,800,'惊喜礼盒','让风化蔓延，在持久战中积累优势。','#9fb59d'],
  ['1109','虎克',1,'火','输出',['belobog','strike'],118,740,'轰！飞来焰火！','漆黑的虎克大人，便宜又有活力的火力手。','#dfa978'],
  ['1201','青雀',2,'量子','追击',['luofu','follow'],148,760,'幺鱼暗杠','等待好牌，以高额追击改变局面。','#a6c9c1'],
  ['1202','停云',2,'雷','辅助',['luofu','support'],94,860,'庆云光覆仪祷','为主力补充能量，让全队运转更顺畅。','#d8ac89'],
  ['1204','景元',5,'雷','追击',['luofu','follow'],232,1150,'神君','强大的追加攻击，是追击阵容的终点。','#e0c998'],
  ['1205','刃',5,'风','输出',['hunters','strike'],206,1530,'大辟万死','以惊人的生命与攻击撑起前台。','#b78891'],
  ['1203','罗刹',4,'虚数','治疗',['luofu','heal'],120,1350,'生息回轮','持续治愈，帮助阵容稳稳穿过终局。','#c2d5aa'],
  ['1208','符玄',5,'量子','守护',['luofu','shield'],160,1750,'穷观阵','以穷观之阵承接伤害，构筑最终防线。','#d7a8d1'],
];
export const CHARACTERS = roster.map(([id,name,cost,element,role,traits,attack,hp,skill,description,color])=>({id,name,cost,element,role,traits,attack,hp,skill,description,color,image:`assets/characters/${id}.png`}));

export const EQUIPMENT = [
  {id:'knife',name:'折叠小刀',icon:'⚔',color:'#aab6ce',description:'攻击 +30。两件简易装备可以合成进阶装备。',attack:30,tier:1},
  {id:'pistol',name:'和平手枪',icon:'⌖',color:'#aab6ce',description:'攻击 +22，速度 +5。',attack:22,speed:5,tier:1},
  {id:'star',name:'幸运星',icon:'✦',color:'#aab6ce',description:'攻击 +18，生命 +100。',attack:18,hp:100,tier:1},
  {id:'flower',name:'生命之花',icon:'✿',color:'#aab6ce',description:'生命 +240。',hp:240,tier:1},
  {id:'skates',name:'轮滑鞋',icon:'➶',color:'#aab6ce',description:'速度 +12。',speed:12,tier:1},
  {id:'armor',name:'量产型装甲',icon:'⬡',color:'#aab6ce',description:'生命 +180，攻击 +8。',hp:180,attack:8,tier:1},
  {id:'drill',name:'以太钻头',icon:'◇',color:'#aab6ce',description:'攻击 +36。',attack:36,tier:1},
  {id:'battery',name:'光能电池',icon:'ϟ',color:'#aab6ce',description:'攻击 +15，速度 +8。',attack:15,speed:8,tier:1},
  {id:'boots',name:'反重力皮靴',icon:'➶',color:'#c6a4eb',description:'速度 +32。由两件轮滑鞋合成。',speed:32,tier:2},
  {id:'electric',name:'电光履',icon:'ϟ',color:'#c6a4eb',description:'攻击 +35，速度 +28。轮滑鞋 + 光能电池。',attack:35,speed:28,tier:2},
  {id:'perpetual',name:'永动机',icon:'∞',color:'#c6a4eb',description:'攻击 +50，速度 +24。两件光能电池合成。',attack:50,speed:24,tier:2},
  {id:'blade',name:'破阵长刃',icon:'⚔',color:'#c6a4eb',description:'攻击 +95。两件折叠小刀合成。',attack:95,tier:2},
  {id:'cannon',name:'以太重炮',icon:'⌖',color:'#c6a4eb',description:'攻击 +100。和平手枪 + 以太钻头。',attack:100,tier:2},
  {id:'garden',name:'不凋之花',icon:'✿',color:'#c6a4eb',description:'生命 +700。两件生命之花合成。',hp:700,tier:2},
  {id:'bastion',name:'星海壁垒',icon:'⬡',color:'#c6a4eb',description:'生命 +600，攻击 +25。生命之花 + 量产型装甲。',hp:600,attack:25,tier:2},
  {id:'comet',name:'幸运彗星',icon:'✦',color:'#c6a4eb',description:'攻击 +65，生命 +280。两件幸运星合成。',attack:65,hp:280,tier:2},
  {id:'hybrid',name:'复合式战斗模块',icon:'◈',color:'#c6a4eb',description:'攻击 +55，生命 +220，速度 +10。其他任意两件简易装备合成。',attack:55,hp:220,speed:10,tier:2},
];

export const STRATEGIES = [
  {id:'compound',name:'复利的魔法',rarity:'黄金',icon:'◉',description:'利息上限从 5 提高至 8；立即获得 8 金币。'},
  {id:'dividend',name:'稳定分红',rarity:'白银',icon:'▥',description:'每次战斗结算额外获得 3 金币。'},
  {id:'growth',name:'人才投资',rarity:'黄金',icon:'↗',description:'立即获得 8 经验；购买经验额外获得 2 经验。'},
  {id:'discount',name:'人脉网络',rarity:'白银',icon:'⌘',description:'刷新商店价格降低至 1 金币。'},
  {id:'vanguard',name:'先发优势',rarity:'黄金',icon:'⚔',description:'所有前台角色攻击提高 22%。'},
  {id:'backline',name:'幕后合伙人',rarity:'黄金',icon:'◇',description:'后台协同效率从 72% 提高至 100%。'},
  {id:'fortress',name:'风险对冲',rarity:'白银',icon:'⬡',description:'全队生命提高 25%；战败受到的伤害降低 4。'},
  {id:'recovery',name:'长期主义',rarity:'白银',icon:'✚',description:'每场结算恢复 5 点生命；全队攻击提高 8%。'},
  {id:'momentum',name:'乘胜追投',rarity:'黄金',icon:'✦',description:'全队攻击提高 10%；胜利额外获得 3 金币。'},
];

export const RECIPES = {
  'skates+skates':'boots','battery+skates':'electric','battery+battery':'perpetual',
  'knife+knife':'blade','drill+pistol':'cannon','flower+flower':'garden',
  'armor+flower':'bastion','star+star':'comet',
};
export const LEVEL_XP = {4:8,5:12,6:20,7:28};
