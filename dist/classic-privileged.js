// Public BWIKI equipment table, original 3.7 privileged equipment. Static fields are overrides, not increments.
export const PRIVILEGED_EQUIPMENT = {
  "revenge-armor": {
    "stats": {
      "damageReduction": 0.2,
      "crit": 0.4,
      "shieldAmp": 0.4
    },
    "description": "伤害减免20%\n幸运一击率40%\n护盾强度40%；战斗开始时，我方全体前台获得等同于装备者600%防御力的护盾。装备者受到攻击后，对攻击者造成等同于500%受攻击前护盾量的物理属性伤害，该伤害无法消灭敌方目标。",
    "sourceUrl": "https://wiki.biligame.com/sr/以牙还牙甲•特权"
  },
  "confidence": {
    "stats": {
      "damageReduction": 0.2,
      "frontPower": 0.6
    },
    "description": "伤害减免20%\n前台强度60%；装备者对我方目标施放技能时，使其前台强度提高60%，获得20%伤害减免，持续2回合。",
    "sourceUrl": "https://wiki.biligame.com/sr/信心注入器•特权"
  },
  "light-shield": {
    "stats": {
      "damageReduction": 0.2,
      "shieldAmp": 0.4
    },
    "description": "伤害减免20%\n护盾强度40%；我方前台生命值降低至生命上限的50%以下时，装备者为目标提供等同于装备者600%防御力的护盾，持续2回合，该效果最多触发10次。我方前台持有护盾时，免疫行动延后效果。",
    "sourceUrl": "https://wiki.biligame.com/sr/光能盾牌•特权"
  },
  "light-propeller": {
    "stats": {
      "breakEfficiency": 0.5,
      "speedPct": 0.2
    },
    "description": "击破效率50%\n速度增幅20%；战斗中，装备者每有10点速度，获得4%前台强度，2%后台强度。",
    "sourceUrl": "https://wiki.biligame.com/sr/光速螺旋桨•特权"
  },
  "joke-engine": {
    "stats": {
      "startEnergy": 120.0,
      "crit": 0.2
    },
    "description": "初始能量120\n幸运一击率20%；装备者施放终结技时，使装备者幸运一击率提高20%，最多叠加5层。",
    "sourceUrl": "https://wiki.biligame.com/sr/冷笑话引擎•特权"
  },
  "kinetic-sword": {
    "stats": {
      "breakEfficiency": 0.5,
      "frontPower": 0.8
    },
    "description": "击破效率50%\n前台强度80%；装备者回合开始时恢复1个战技点，消耗战技点后，获得1个战技点，每回合最多恢复6点。",
    "sourceUrl": "https://wiki.biligame.com/sr/动能激发剑•特权"
  },
  "satellite-sniper": {
    "stats": {
      "backPower": 0.6,
      "crit": 0.6
    },
    "description": "后台强度60%\n幸运一击率60%；战斗开始时，装备者若位于后台，使装备者的幸运一击伤害提高20%。",
    "sourceUrl": "https://wiki.biligame.com/sr/反卫星狙击枪•特权"
  },
  "boots": {
    "stats": {
      "speedPct": 0.4
    },
    "description": "速度增幅40%；装备者的每个回合开始时，速度增幅提高30%，可叠加。",
    "sourceUrl": "https://wiki.biligame.com/sr/反重力皮靴•特权"
  },
  "orbital": {
    "stats": {
      "damageAmp": 0.3,
      "backPower": 1.2
    },
    "description": "伤害增幅30%\n后台强度120%；大幅度提高后台强度。\n\n「曾经在八百光年外一炮干掉了反物质军团的弓箭手」",
    "sourceUrl": "https://wiki.biligame.com/sr/天基轨道炮•特权"
  },
  "hard-armor": {
    "stats": {
      "damageReduction": 0.4
    },
    "description": "伤害减免40%；我方小队获得36%伤害减免。",
    "sourceUrl": "https://wiki.biligame.com/sr/很硬的甲•特权"
  },
  "evolution": {
    "stats": {
      "startEnergy": 40.0,
      "frontPower": 0.4,
      "backPower": 0.4
    },
    "description": "初始能量40\n前台强度40%\n后台强度40%；装备者的每个星级提供20%速度增幅和20%伤害增幅。",
    "sourceUrl": "https://wiki.biligame.com/sr/战场进化手册•特权"
  },
  "cover-gun": {
    "stats": {
      "frontPower": 0.4,
      "backPower": 0.4,
      "hpPct": 0.2
    },
    "description": "前台强度40%\n后台强度40%\n生命增幅20%；装备者回合开始时，为我方全体前台提供等同于装备者60%生命上限的护盾，持续2回合。",
    "sourceUrl": "https://wiki.biligame.com/sr/掩体生成枪•特权"
  },
  "cannon": {
    "stats": {
      "breakEfficiency": 0.5,
      "frontPower": 0.2,
      "backPower": 0.4,
      "speedPct": 0.4
    },
    "description": "击破效率50%\n前台强度20%\n后台强度40%\n速度增幅40%；装备者对精英和首领敌人的伤害增幅提高80%，弱点击破效率提高50%。",
    "sourceUrl": "https://wiki.biligame.com/sr/斩首行动•特权"
  },
  "bloodshot": {
    "stats": {
      "frontPower": 0.6,
      "backPower": 0.6,
      "hpPct": 0.2
    },
    "description": "前台强度60%\n后台强度60%\n生命增幅20%；装备者消灭1个敌人后，伤害增幅提高50%。",
    "sourceUrl": "https://wiki.biligame.com/sr/杀红眼•特权"
  },
  "blossom": {
    "stats": {
      "damageAmp": 0.3,
      "hpPct": 0.2,
      "speedPct": 0.2
    },
    "description": "伤害增幅30%\n生命增幅20%\n速度增幅20%；战斗中，装备者若位于前台，当前生命值高于生命上限的50%时，伤害增幅提高60%。",
    "sourceUrl": "https://wiki.biligame.com/sr/步步生花•特权"
  },
  "hybrid": {
    "stats": {
      "frontPower": 0.4,
      "backPower": 0.4
    },
    "description": "前台强度40%\n后台强度40%；我方小队前/后台强度提高50%。",
    "sourceUrl": "https://wiki.biligame.com/sr/武器大师•特权"
  },
  "perpetual": {
    "stats": {
      "frontPower": 0.4,
      "backPower": 0.4
    },
    "description": "前台强度40%\n后台强度40%；进入战斗时，装备者激活终结技。每施放3个终结技后，再次激活终结技，通过该装备激活的终结技不会计入施放次数。",
    "sourceUrl": "https://wiki.biligame.com/sr/永动机•特权"
  },
  "meteor-wings": {
    "stats": {
      "damageReduction": 0.2,
      "speedPct": 0.3
    },
    "description": "伤害减免20%\n速度增幅30%；装备者施放终结技后，恢复2个战技点，并使我方全体速度增幅提高30%，持续2回合。",
    "sourceUrl": "https://wiki.biligame.com/sr/流星飞翼•特权"
  },
  "firestorm": {
    "stats": {
      "frontPower": 0.4,
      "backPower": 0.4,
      "speedPct": 0.2
    },
    "description": "前台强度40%\n后台强度40%\n速度增幅20%；装备者每次攻击后，前/后台强度提高16%，可叠加。",
    "sourceUrl": "https://wiki.biligame.com/sr/火力风暴潮•特权"
  },
  "blood-fist": {
    "stats": {
      "crit": 0.2,
      "hpPct": 0.2
    },
    "description": "幸运一击率20%\n生命增幅20%；装备者生命上限大于5000后，每1000生命值提高4%幸运一击率，最多80%。",
    "sourceUrl": "https://wiki.biligame.com/sr/热血沸腾拳•特权"
  },
  "dissolver": {
    "stats": {
      "breakEfficiency": 0.5,
      "hpPct": 0.2,
      "speedPct": 0.3
    },
    "description": "击破效率50%\n生命增幅20%\n速度增幅30%；装备者每回合首次施放攻击后，对随机1个攻击目标造成等同于其6%最大生命值的真实伤害。",
    "sourceUrl": "https://wiki.biligame.com/sr/物质分解液•特权"
  },
  "garden": {
    "stats": {
      "healAmp": 0.4,
      "hpPct": 0.3
    },
    "description": "治疗强度40%\n生命增幅30%；我方小队生命上限提高30%。",
    "sourceUrl": "https://wiki.biligame.com/sr/生命之环•特权"
  },
  "electric": {
    "stats": {
      "startEnergy": 60.0,
      "speedPct": 0.5
    },
    "description": "初始能量60\n速度增幅50%；装备者的每个回合开始时，固定恢复等同于能量上限20%的能量。（唯一装备）",
    "sourceUrl": "https://wiki.biligame.com/sr/电光履•特权"
  },
  "catapult": {
    "stats": {
      "backPower": 0.6,
      "speedPct": 0.4
    },
    "description": "后台强度60%\n速度增幅40%；装备者若位于后台，战斗开始时行动提前50%。",
    "sourceUrl": "https://wiki.biligame.com/sr/电磁弹射器•特权"
  },
  "bastion": {
    "stats": {
      "shieldAmp": 0.4,
      "healAmp": 0.4,
      "hpPct": 0.2
    },
    "description": "护盾强度40%\n治疗强度40%\n生命增幅20%；装备者治疗我方目标或对其施加护盾后，使其获得30%伤害减免，持续2回合。",
    "sourceUrl": "https://wiki.biligame.com/sr/痛觉阻断芯片•特权"
  },
  "blade": {
    "stats": {
      "damageAmp": 0.3,
      "frontPower": 1.2
    },
    "description": "伤害增幅30%\n前台强度120%；大幅度提高前台强度。\n\n「我四十公里长的大刀早已饥渴难耐」",
    "sourceUrl": "https://wiki.biligame.com/sr/碎星斩舰刀•特权"
  },
  "absolute-heat": {
    "stats": {
      "startEnergy": 40.0,
      "hpPct": 0.3
    },
    "description": "初始能量40\n生命增幅30%；我方小队行动时回复等同于装备者40%生命上限的生命值，装备者施放终结技后，恢复20点能量。（唯一装备）",
    "sourceUrl": "https://wiki.biligame.com/sr/绝对热量•特权"
  },
  "victory-flag": {
    "stats": {
      "breakEfficiency": 0.5,
      "crit": 0.2
    },
    "description": "击破效率50%\n幸运一击率20%；我方小队幸运一击率提高24%，并可以抵抗8次控制类负面状态，该效果可叠加。",
    "sourceUrl": "https://wiki.biligame.com/sr/胜利之旗•特权"
  },
  "exoskeleton": {
    "stats": {
      "damageReduction": 0.2,
      "frontPower": 0.4,
      "backPower": 0.4
    },
    "description": "伤害减免20%\n前台强度40%\n后台强度40%；战斗开始时，装备者若位于前台，获得50%伤害减免且受到攻击的概率大幅提高。\n装备者若位于后台，后台强度提高40%，速度增幅提高40%。",
    "sourceUrl": "https://wiki.biligame.com/sr/自适应外骨骼•特权"
  },
  "energy-sail": {
    "stats": {
      "startEnergy": 40.0,
      "frontPower": 0.6,
      "backPower": 0.6
    },
    "description": "初始能量40\n前台强度60%\n后台强度60%；装备者经过的每点行动值，都会固定恢复4点能量。（唯一装备）",
    "sourceUrl": "https://wiki.biligame.com/sr/蓄能帆•特权"
  },
  "wormhole-drill": {
    "stats": {
      "breakEffect": 5,
      "breakEfficiency": 1.0
    },
    "description": "击破效率100%；大幅度提高弱点击破效率，击破特攻提高500%。\n\n「他的钻头可是能突破天际的钻头啊！」",
    "sourceUrl": "https://wiki.biligame.com/sr/虫洞掘进钻头•特权"
  },
  "planetary-drill": {
    "stats": {
      "breakEfficiency": 0.5,
      "startEnergy": 30.0
    },
    "description": "击破效率50%\n初始能量30；装备者施放攻击后，使攻击目标陷入【脆弱】：受到的伤害提高70%，持续2回合。",
    "sourceUrl": "https://wiki.biligame.com/sr/行星钻地弹•特权"
  },
  "star-chase": {
    "stats": {
      "crit": 0.2,
      "speedPct": 0.2
    },
    "description": "幸运一击率20%\n速度增幅20%；装备者施放攻击后，使攻击目标陷入【脆弱】：受到的伤害提高70%，持续2回合。",
    "sourceUrl": "https://wiki.biligame.com/sr/追逐星辰•特权"
  },
  "flashbang": {
    "stats": {
      "damageReduction": 0.2,
      "breakEfficiency": 0.2,
      "speedPct": 0.3
    },
    "description": "伤害减免20%\n击破效率20%\n速度增幅30%；敌人进入战斗后陷入【虚弱】：造成的伤害降低40%。",
    "sourceUrl": "https://wiki.biligame.com/sr/闪光手榴弹•特权"
  },
  "comet": {
    "stats": {
      "damageReduction": 0.2,
      "crit": 0.2
    },
    "description": "伤害减免20%\n幸运一击率20%；在每个节点中，随便骰子•特权都会随机为角色填充两件特权装备（需要空装备栏才能装备随便骰子•特权）。",
    "sourceUrl": "https://wiki.biligame.com/sr/随便骰子•特权"
  },
  "chainsaw": {
    "stats": {
      "frontPower": 0.6,
      "crit": 0.6
    },
    "description": "前台强度60%\n幸运一击率60%；战斗开始时，装备者若位于前台，使装备者的幸运一击伤害提高20%。",
    "sourceUrl": "https://wiki.biligame.com/sr/高周波电锯•特权"
  }
};
