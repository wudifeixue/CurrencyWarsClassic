// Verified Zero-Sum Strategy roster and bond references; source-season data only.
// Facts and numeric rules from BWIKI; see docs/classic-roster-research.md for scope and attribution.
export const CLASSIC_SOURCE_SEASON = "零和博弈（4.7改版前）";
export const CLASSIC_TRAITS = [
  {
    "id": "luofu",
    "name": "仙舟",
    "type": "阵营羁绊",
    "thresholds": [
      3,
      5,
      7,
      10
    ],
    "icon": "☷",
    "description": "【仙舟】召唤【神君】，其行动时将攻击敌方全体目标。【仙舟】队员行动后为【神君】叠加攻击段数并使其行动提前。【仙舟】队员的前/后台强度和速度增幅提高。",
    "levels": [
      {
        "count": 3,
        "description": "20%前/后台强度，8%速度增幅。",
        "effects": {
          "memberStrength": 0.2,
          "memberSpeed": 0.08,
          "summonBaseDamage": 3,
          "summonAdvancePerMemberAction": 0.1,
          "summonInitialHits": null,
          "summonHitsPerMemberAction": 1,
          "summonBattleStartAction": false
        }
      },
      {
        "count": 5,
        "description": "40%前/后台强度，16%速度增幅。【神君】基础伤害段数增加至6。",
        "effects": {
          "memberStrength": 0.4,
          "memberSpeed": 0.16,
          "summonBaseDamage": 6,
          "summonAdvancePerMemberAction": 0.1,
          "summonInitialHits": 6,
          "summonHitsPerMemberAction": 1,
          "summonBattleStartAction": false
        }
      },
      {
        "count": 7,
        "description": "80%前/后台强度，32%速度增幅。【仙舟】队员行动后叠加的伤害段数提高至2，战斗开始时【神君】立即行动。",
        "effects": {
          "memberStrength": 0.8,
          "memberSpeed": 0.32,
          "summonBaseDamage": 9,
          "summonAdvancePerMemberAction": 0.1,
          "summonInitialHits": 6,
          "summonHitsPerMemberAction": 2,
          "summonBattleStartAction": true
        }
      },
      {
        "count": 10,
        "description": "200%前/后台强度，60%速度增幅。【神君】基础伤害段数增加至10，每段倍率提高至600%，并更频繁地发动攻击！",
        "effects": {
          "memberStrength": 2,
          "memberSpeed": 0.6,
          "summonBaseDamage": 12,
          "summonAdvancePerMemberAction": 0.25,
          "summonInitialHits": 10,
          "summonHitsPerMemberAction": 2,
          "summonBattleStartAction": true
        }
      }
    ],
    "notes": [
      "【神君】：以150速度行动，行动时对敌方全体目标造成300%/600%/900%/1200%基础伤害的雷属性伤害，并对随机敌方目标造成多段伤害。【仙舟】队员行动后为神君增加攻击段数，并使神君行动提前10%/10%/10%/25%。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E4%BB%99%E8%88%9F#零和博弈",
    "mechanics": {
      "kind": "lightningLord",
      "speed": 150,
      "element": "thunder",
      "target": "allEnemiesThenRandomHits",
      "maxTierPerHitCoefficient": 6,
      "baseHitCountStatus": "not stated below tier 5 in this bond reference"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "ipc",
    "name": "公司",
    "type": "阵营羁绊",
    "thresholds": [
      2,
      3
    ],
    "icon": "▥",
    "description": "【公司】队员的后台强度和护盾强度提高。",
    "levels": [
      {
        "count": 2,
        "description": "30%后台强度，10%护盾强度。普通战斗和遭遇节点开始时，获得1金币。",
        "effects": {
          "memberBackStrength": 0.3,
          "memberShield": 0.1,
          "goldPerNode": 1
        }
      },
      {
        "count": 3,
        "description": "100%后台强度，25%护盾强度。普通战斗和遭遇节点开始时，获得3金币。",
        "effects": {
          "memberBackStrength": 1,
          "memberShield": 0.25,
          "goldPerNode": 3
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%85%AC%E5%8F%B8#零和博弈",
    "mechanics": {
      "kind": "companyIncome",
      "trigger": "normalBattleOrEncounterNodeStart",
      "scope": "ipc members gain stats; coins go to player"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "debuff",
    "name": "减益",
    "type": "流派羁绊",
    "thresholds": [
      2,
      4,
      6,
      8
    ],
    "icon": "◎",
    "description": "【减益】队员的前/后台强度提高，行动时使敌方陷入负面效果时，为随机目标附加【离火】，使其造成的伤害降低，并且被攻击后受到额外真实伤害，单次行动内最多触发2次。",
    "levels": [
      {
        "count": 2,
        "description": "20%前/后台强度。每层造成的伤害降低3%，10%真实伤害，【离火】上限3层。",
        "effects": {
          "memberStrength": 0.2,
          "lireDamageReductionPerStack": 0.03,
          "lireTrueDamagePerStack": 0.1,
          "lireStackCap": 3
        }
      },
      {
        "count": 4,
        "description": "60%前/后台强度。每层造成的伤害降低4%，20%真实伤害。",
        "effects": {
          "memberStrength": 0.6,
          "lireDamageReductionPerStack": 0.04,
          "lireTrueDamagePerStack": 0.2,
          "lireStackCap": 3
        }
      },
      {
        "count": 6,
        "description": "120%前/后台强度。每层造成的伤害降低5%，30%真实伤害，【离火】上限提高到5层。",
        "effects": {
          "memberStrength": 1.2,
          "lireDamageReductionPerStack": 0.05,
          "lireTrueDamagePerStack": 0.3,
          "lireStackCap": 5
        }
      },
      {
        "count": 8,
        "description": "250%前/后台强度。每层造成的伤害降低6%，50%真实伤害。",
        "effects": {
          "memberStrength": 2.5,
          "lireDamageReductionPerStack": 0.06,
          "lireTrueDamagePerStack": 0.5,
          "lireStackCap": 5
        }
      }
    ],
    "notes": [
      "【离火】：目标造成的伤害降低，并且受到攻击后，根据层数额外受到基于原伤害的真实伤害。【离火】在目标被消灭时转移。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%87%8F%E7%9B%8A#零和博弈",
    "mechanics": {
      "kind": "lire",
      "trigger": "memberInflictsDebuff",
      "maximumTriggersPerAction": 2,
      "target": "randomEnemy",
      "onDefeat": "transfer stacks",
      "additionalDamageBase": "incoming attack damage"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "break",
    "name": "击破",
    "type": "流派羁绊",
    "thresholds": [
      2,
      4,
      6,
      9
    ],
    "icon": "✶",
    "description": "【击破】队员的前/后台强度提高，并在攻击处于弱点击破状态的敌方目标后造成超击破伤害。敌方目标的初始韧性和韧性恢复量降低。",
    "levels": [
      {
        "count": 2,
        "description": "20%前/后台强度。120%超击破伤害，10%初始韧性和韧性恢复量降低。",
        "effects": {
          "memberStrength": 0.2,
          "superBreakMultiplier": 1.2,
          "enemyToughnessReduction": 0.1,
          "shockwaveBaseDamage": 0,
          "shockwaveTeamEnergy": 0
        }
      },
      {
        "count": 4,
        "description": "60%前/后台强度。180%超击破伤害，20%初始韧性和韧性恢复量降低。击破敌人会充能【冲击波】。",
        "effects": {
          "memberStrength": 0.6,
          "superBreakMultiplier": 1.8,
          "enemyToughnessReduction": 0.2,
          "shockwaveBaseDamage": 6,
          "shockwaveTeamEnergy": 0
        }
      },
      {
        "count": 6,
        "description": "150%前/后台强度。300%超击破伤害，30%初始韧性和韧性恢复量降低。【冲击波】触发时，我方小队恢复等同于能量上限30%的能量。",
        "effects": {
          "memberStrength": 1.5,
          "superBreakMultiplier": 3,
          "enemyToughnessReduction": 0.3,
          "shockwaveBaseDamage": 15,
          "shockwaveTeamEnergy": 0.3
        }
      },
      {
        "count": 9,
        "description": "320%前/后台强度。500%超击破伤害，99%初始韧性和韧性恢复量降低。",
        "effects": {
          "memberStrength": 3.2,
          "superBreakMultiplier": 5,
          "enemyToughnessReduction": 0.99,
          "shockwaveBaseDamage": 30,
          "shockwaveTeamEnergy": 0.3
        }
      }
    ],
    "notes": [
      "【冲击波】：普通/精英/首领敌人被击破时，获得1/3/6点充能，累计获得12点充能后，消耗12点充能发动【冲击波】，击破敌方全体目标并触发随机弱点击破效果，使其受到的伤害提高50%，并对敌方全体造成等同于600%/1500%/3000%基础伤害的真实伤害。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%87%BB%E7%A0%B4#零和博弈",
    "mechanics": {
      "kind": "superBreak",
      "trigger": "memberAttackAgainstBrokenTarget",
      "shockwaveFromTier": 4,
      "chargePerBreak": {
        "normal": 1,
        "elite": 3,
        "boss": 6
      },
      "shockwaveChargeThreshold": 12,
      "shockwave": "break all enemies, random break effects, true AoE damage",
      "shockwaveVulnerability": 0.5
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "express",
    "name": "列车同行",
    "type": "阵营羁绊",
    "thresholds": [
      2,
      4,
      6
    ],
    "icon": "✦",
    "description": "召唤【星穹列车】撞击敌方全体目标，并在场上留下【光轨】，使我方小队的前/后台强度提高。",
    "levels": [
      {
        "count": 2,
        "description": "战斗开始时撞击并提供1层【光轨】，使我方小队前/后台强度提高20%。",
        "effects": {
          "teamStrengthPerTrack": 0.2,
          "maxTracks": 1,
          "memberMultiplier": 1,
          "enemyDefenseReductionPerTrack": 0
        }
      },
      {
        "count": 4,
        "description": "列车额外以300速度撞击，每层【光轨】提供的前/后台强度提高至40%，最多叠加2层。【列车同行】队员获得双倍收益。",
        "effects": {
          "teamStrengthPerTrack": 0.4,
          "maxTracks": 2,
          "memberMultiplier": 2,
          "enemyDefenseReductionPerTrack": 0
        }
      },
      {
        "count": 6,
        "description": "每层【光轨】提供的前/后台强度提高至60%，可叠加上限提高至3层，每层额外使敌方全体目标防御力降低10%。",
        "effects": {
          "teamStrengthPerTrack": 0.6,
          "maxTracks": 3,
          "memberMultiplier": 2,
          "enemyDefenseReductionPerTrack": 0.1
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%88%97%E8%BD%A6%E5%90%8C%E8%A1%8C#零和博弈",
    "mechanics": {
      "kind": "train",
      "initialTracks": 1,
      "trigger": "battleStartAndTrainAction",
      "repeatSpeedFromTier4": 300,
      "scope": "team; express members double from tier 4",
      "damageCoefficientStatus": "not stated in this bond reference"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "seer",
    "name": "命运卜者",
    "type": "独立羁绊",
    "thresholds": [
      1
    ],
    "icon": "✦",
    "description": "黑天鹅每累计参与2场战斗后可以打开占卜屋，并选择1张启示卡以获得对应强化。",
    "levels": [
      {
        "count": 1,
        "description": "黑天鹅参与战斗后可以打开占卜屋，并选择1张启示卡以获得对应强化。",
        "effects": {
          "divinationBattleInterval": 2
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%91%BD%E8%BF%90%E5%8D%9C%E8%80%85#零和博弈",
    "mechanics": {
      "kind": "divination",
      "selection": "one revelation card after Black Swan participates in 2 battles"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "grail",
    "name": "命运圣杯",
    "type": "阵营羁绊",
    "thresholds": [
      2,
      3,
      4,
      5
    ],
    "icon": "♜",
    "description": "【命运圣杯】提供祈愿试炼，完成试炼以获得各种奖励。祈愿试炼的难度和奖励随羁绊等级提升。【命运圣杯】成员的前/后台强度提高。",
    "levels": [
      {
        "count": 2,
        "description": "25%前/后台强度。开启首个祈愿试炼。",
        "effects": {
          "memberStrength": 0.25,
          "trialRank": 1
        }
      },
      {
        "count": 3,
        "description": "50%前/后台强度。第二个祈愿试炼，出现奖励更好、难度更高的诅咒试炼。",
        "effects": {
          "memberStrength": 0.5,
          "trialRank": 2
        }
      },
      {
        "count": 4,
        "description": "100%前/后台强度。第三个祈愿试炼。",
        "effects": {
          "memberStrength": 1,
          "trialRank": 3
        }
      },
      {
        "count": 5,
        "description": "180%前/后台强度。最终祈愿试炼。",
        "effects": {
          "memberStrength": 1.8,
          "trialRank": 4
        }
      }
    ],
    "notes": [],
    "sourceVersion": "4.4",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%91%BD%E8%BF%90%E5%9C%A3%E6%9D%AF#零和博弈",
    "mechanics": {
      "kind": "wishTrials",
      "rewards": "trial specific; cursed trials unlock from rank 2",
      "trialRulesStatus": "not stated in this bond reference"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "night",
    "name": "夜之半神",
    "type": "阵营羁绊",
    "thresholds": [
      2,
      4,
      7,
      9
    ],
    "icon": "☾",
    "description": "每个战斗阶段后生成【月光精华】，完胜后获得2倍【月光精华】。获得足够的【月光精华】后可以获取晶矿奖励。【夜之半神】队员的前/后台强度提高。",
    "levels": [
      {
        "count": 2,
        "description": "30%前/后台强度。2个【月光精华】。",
        "effects": {
          "memberStrength": 0.3,
          "essencePerBattle": 2
        }
      },
      {
        "count": 4,
        "description": "60%前/后台强度。5个【月光精华】。",
        "effects": {
          "memberStrength": 0.6,
          "essencePerBattle": 5
        }
      },
      {
        "count": 7,
        "description": "120%前/后台强度。9个【月光精华】。",
        "effects": {
          "memberStrength": 1.2,
          "essencePerBattle": 9
        }
      },
      {
        "count": 9,
        "description": "240%前/后台强度。30个【月光精华】。",
        "effects": {
          "memberStrength": 2.4,
          "essencePerBattle": 30
        }
      }
    ],
    "notes": [
      "【晶矿】 开启后可能获取金币、角色、装备或其它稀有物品！"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%A4%9C%E4%B9%8B%E5%8D%8A%E7%A5%9E#零和博弈",
    "mechanics": {
      "kind": "moonlightEssence",
      "perfectVictoryMultiplier": 2,
      "reward": "ore: coins, characters, equipment, or rare items",
      "oreThresholdsStatus": "not stated in this bond reference"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "guardian",
    "name": "大守护者",
    "type": "独立羁绊",
    "thresholds": [
      1
    ],
    "icon": "✦",
    "description": "布洛妮娅会基于小队中【贝洛伯格】和【燃血】角色的数量，加入人数更多的羁绊并获得相应技能。我方前台行动后布洛妮娅获得1点充能，充能满后布洛妮娅召唤可可利亚攻击敌方全体。",
    "levels": [
      {
        "count": 1,
        "description": "充能满8点后，可可利亚发动攻击对敌方全体造成布洛妮娅1200%攻击力+240%生命上限的虚数属性伤害，该次攻击必定暴击。羁绊效果随布洛妮娅的星级而提高：；1星：初始已计入4次行动。2星：造成的伤害为原伤害的150%，初始已计入4次行动。3星：造成的伤害为原伤害的1000%，充能满1点后可可利亚就会发动攻击。",
        "effects": {
          "cocoliaChargeThreshold": 8
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%A4%A7%E5%AE%88%E6%8A%A4%E8%80%85#零和博弈",
    "mechanics": {
      "kind": "supremeGuardian",
      "joinTrait": "larger of belobog and blood",
      "chargePerFrontAction": 1,
      "initialChargeByStar": [
        4,
        4,
        0
      ],
      "chargeThresholdByStar": [
        8,
        8,
        1
      ],
      "cocoliaAttackRatio": 12,
      "cocoliaMaxHPRatio": 2.4,
      "cocoliaDamageMultiplierByStar": [
        1,
        1.5,
        10
      ],
      "alwaysCrit": true,
      "element": "imaginary"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "gamer",
    "name": "头号玩家",
    "type": "独立羁绊",
    "thresholds": [
      1
    ],
    "icon": "✦",
    "description": "【银狼LV.999】并不满意货币战争为她设计的费用和技能。她在升至2星时开始骇入货币战争，可以在修改自身费用和获得妙妙小道具间进行选择。达到3星5费时，狼尊将会接管货币战争。",
    "levels": [
      {
        "count": 1,
        "description": "在每个费用首次达到2星时，【银狼LV.999】可以选择变为更高费用的1星【银狼LV.999】，或者获得一件不占用装备栏的【骇客改件】。",
        "effects": {
          "hackOnFirstTwoStarAtEachCost": true
        }
      }
    ],
    "notes": [],
    "sourceVersion": "4.2",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%A4%B4%E5%8F%B7%E7%8E%A9%E5%AE%B6#零和博弈",
    "mechanics": {
      "kind": "lv999Hack",
      "choices": [
        "promote cost and reset to one star",
        "gain hacker accessory without equipment slot"
      ],
      "costs": [
        3,
        4,
        5
      ],
      "maxForm": {
        "stars": 3,
        "cost": 5
      },
      "startingCost": 3
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "ranger",
    "name": "巡海游侠",
    "type": "阵营羁绊",
    "thresholds": [
      1,
      2,
      3,
      4
    ],
    "icon": "⌁",
    "description": "【巡海游侠】队员获得伤害增幅和速度增幅。若将【巡海游侠】放置于后台，则位于后台的【巡海游侠】的星级会使前台【巡海游侠】额外获得伤害增幅和速度增幅。",
    "levels": [
      {
        "count": 1,
        "description": "8%伤害增幅，8%速度增幅。",
        "effects": {
          "memberDamage": 0.08,
          "memberSpeed": 0.08,
          "initialActionAdvance": 0
        }
      },
      {
        "count": 2,
        "description": "16%伤害增幅，16%速度增幅。",
        "effects": {
          "memberDamage": 0.16,
          "memberSpeed": 0.16,
          "initialActionAdvance": 0
        }
      },
      {
        "count": 3,
        "description": "28%伤害增幅，28%速度增幅。",
        "effects": {
          "memberDamage": 0.28,
          "memberSpeed": 0.28,
          "initialActionAdvance": 0
        }
      },
      {
        "count": 4,
        "description": "30%伤害增幅，30%速度增幅。【巡海游侠】队员进入战斗时行动提前100%。",
        "effects": {
          "memberDamage": 0.3,
          "memberSpeed": 0.3,
          "initialActionAdvance": 1
        }
      }
    ],
    "notes": [
      "1/2/3/4星的后台【巡海游侠】，提供1/3/6/12倍 伤害增幅和速度增幅。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%B7%A1%E6%B5%B7%E6%B8%B8%E4%BE%A0#零和博弈",
    "mechanics": {
      "kind": "backlineRangerEmpowerment",
      "backMemberStarMultiplier": [
        1,
        3,
        6,
        12
      ],
      "scope": "backline ranger star level amplifies front ranger damage and speed"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "mentor",
    "name": "师徒",
    "type": "特殊羁绊",
    "thresholds": [
      2,
      3
    ],
    "icon": "✦",
    "description": "【飞光】映下开启的特殊羁绊。以此见证仙舟生生不灭的信念传承。",
    "levels": [
      {
        "count": 2,
        "description": "战斗中，为羁绊内其他成员提供前/后台强度，等同于自身前/后台强度较高项的100%。",
        "effects": {
          "crossMemberStrengthShare": 1,
          "advanceOthersAfterSkillOrUltimate": 0,
          "inheritanceDamagePerStack": 0,
          "inheritanceStackCap": 0
        }
      },
      {
        "count": 3,
        "description": "施放战技/终结技后，使其他羁绊成员行动提前30%，并叠加2/3层【传承】，每层【传承】提供10%伤害增幅，最多99层。",
        "effects": {
          "crossMemberStrengthShare": 1,
          "advanceOthersAfterSkillOrUltimate": 0.3,
          "inheritanceDamagePerStack": 0.1,
          "inheritanceStackCap": 99
        }
      }
    ],
    "notes": [],
    "sourceVersion": "4.4",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E5%B8%88%E5%BE%92#零和博弈",
    "mechanics": {
      "kind": "masterAndApprentice",
      "strengthBase": "higher of own front/back strength",
      "skillInheritanceStacks": 2,
      "ultimateInheritanceStacks": 3,
      "requires": "飞光 special bond"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "sp",
    "name": "战技点",
    "type": "流派羁绊",
    "thresholds": [
      2,
      4,
      6,
      8
    ],
    "icon": "✧",
    "description": "我方战技点上限提高，我方小队获得速度增幅，施放战技或普攻时获得伤害增幅，【战技点】队员获得双倍加成，持续至自身回合结束。【战技点】队员消耗战技点时，每个战技点进行1次抽奖，奖池效果可叠加。",
    "levels": [
      {
        "count": 2,
        "description": "12%速度增幅。获得12%伤害增幅，战技点上限提高2，可抽到小奖。",
        "effects": {
          "teamSpeed": 0.12,
          "teamBasicSkillDamage": 0.12,
          "spCapBonus": 2,
          "winsAndJackpotUnlocked": false,
          "specialPrizeChanceIncreased": false
        }
      },
      {
        "count": 4,
        "description": "24%速度增幅。获得24%伤害增幅，战技点上限提高3，可抽到中奖和大奖。",
        "effects": {
          "teamSpeed": 0.24,
          "teamBasicSkillDamage": 0.24,
          "spCapBonus": 3,
          "winsAndJackpotUnlocked": true,
          "specialPrizeChanceIncreased": false
        }
      },
      {
        "count": 6,
        "description": "40%速度增幅。获得48%伤害增幅，战技点上限提高4，抽奖时有概率额外获得1次特别奖，抽到更好奖励的概率提高。",
        "effects": {
          "teamSpeed": 0.4,
          "teamBasicSkillDamage": 0.48,
          "spCapBonus": 4,
          "winsAndJackpotUnlocked": true,
          "specialPrizeChanceIncreased": true
        }
      },
      {
        "count": 8,
        "description": "80%速度增幅。获得80%伤害增幅，战技点上限提高5，抽奖时有更高概率额外获得1次特别奖，抽到更好奖励的概率大幅提高。",
        "effects": {
          "teamSpeed": 0.8,
          "teamBasicSkillDamage": 0.8,
          "spCapBonus": 5,
          "winsAndJackpotUnlocked": true,
          "specialPrizeChanceIncreased": true
        }
      }
    ],
    "notes": [
      "【谢谢惠顾】 伤害增幅提高2%，持续至自身回合结束。【小奖】 恢复1个战技点。【中奖】 伤害增幅提高6%，持续至自身回合结束。【大奖】 获得1个额外回合，并恢复4个战技点。【特别奖】 获得1个金币！！！"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%88%98%E6%8A%80%E7%82%B9#零和博弈",
    "mechanics": {
      "kind": "spLottery",
      "memberMultiplier": 2,
      "trigger": "memberSpendsSP",
      "drawsPerSP": 1,
      "prizes": {
        "thanks": {
          "damageUntilSelfTurn": 0.02
        },
        "small": {
          "restoreSP": 1
        },
        "win": {
          "damageUntilSelfTurn": 0.06
        },
        "jackpot": {
          "extraTurn": 1,
          "restoreSP": 4
        },
        "special": {
          "gold": 1
        }
      },
      "probabilityStatus": "not specified in reference; simulator probability must be labelled adapted"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "shield",
    "name": "护盾",
    "type": "流派羁绊",
    "thresholds": [
      2,
      4
    ],
    "icon": "⬡",
    "description": "【护盾】队员的护盾强度提高。我方小队获得伤害增幅。我方前台获得特殊护盾，获得其他护盾时该护盾会增加等量的护盾量，上限随阶段而提高。",
    "levels": [
      {
        "count": 2,
        "description": "20%护盾强度，12%伤害增幅。我方小队持有的护盾可叠加，上限100%基础生命。",
        "effects": {
          "memberShield": 0.2,
          "teamDamage": 0.12,
          "specialShieldCapMaxHP": 1
        }
      },
      {
        "count": 4,
        "description": "40%护盾强度，40%伤害增幅。我方小队持有的护盾可叠加，上限100%基础生命。",
        "effects": {
          "memberShield": 0.4,
          "teamDamage": 0.4,
          "specialShieldCapMaxHP": 1
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%8A%A4%E7%9B%BE#零和博弈",
    "mechanics": {
      "kind": "stackingFrontShield",
      "trigger": "front receives any other shield",
      "copiedShieldRatio": 1,
      "scope": "all front allies; shield members gain shield strength"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "dot",
    "name": "持续伤害",
    "type": "流派羁绊",
    "thresholds": [
      2,
      4,
      6
    ],
    "icon": "◉",
    "description": "【持续伤害】队员的持续伤害增幅提高。敌方目标行动时，触发【超激发】，造成持续伤害并触发随机敌方目标的持续伤害效果。",
    "levels": [
      {
        "count": 2,
        "description": "30%持续伤害增幅。【超激发】触发2次。",
        "effects": {
          "memberDotDamage": 0.3,
          "overexcitationHits": 2,
          "overexcitationBaseDamage": 2.4,
          "overexcitationOnNonBossDeath": false
        }
      },
      {
        "count": 4,
        "description": "80%持续伤害增幅。【超激发】触发3次。基础伤害倍率提高至480%。非首领敌方目标被消灭时，额外触发【超激发】。",
        "effects": {
          "memberDotDamage": 0.8,
          "overexcitationHits": 3,
          "overexcitationBaseDamage": 4.8,
          "overexcitationOnNonBossDeath": true
        }
      },
      {
        "count": 6,
        "description": "200%持续伤害增幅。【超激发】触发6次。基础伤害倍率提高至960%。",
        "effects": {
          "memberDotDamage": 2,
          "overexcitationHits": 6,
          "overexcitationBaseDamage": 9.6,
          "overexcitationOnNonBossDeath": true
        }
      }
    ],
    "notes": [
      "【超激发】：对随机敌方目标造成240%基础伤害的持续伤害，并使其陷入的持续伤害状态立即产生相当于原伤害250%的伤害。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%8C%81%E7%BB%AD%E4%BC%A4%E5%AE%B3#零和博弈",
    "mechanics": {
      "kind": "overexcitation",
      "trigger": "enemyTurn",
      "target": "randomEnemy",
      "detonateDotRatio": 2.5
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "beloved",
    "name": "挚爱之人",
    "type": "独立羁绊",
    "thresholds": [
      1
    ],
    "icon": "✦",
    "description": "昔涟参与1场战斗后，昔涟的诗篇将在商店中刷新，并在被购买后提供各种强力增益。",
    "levels": [
      {
        "count": 1,
        "description": "昔涟的诗篇将在商店中刷新，每个节点内最多购买1张。",
        "effects": {
          "poemsPerNode": 1
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%8C%9A%E7%88%B1%E4%B9%8B%E4%BA%BA#零和博弈",
    "mechanics": {
      "kind": "cyrenePoems",
      "unlockAfterBattles": 1,
      "trigger": "purchase poem in shop",
      "benefits": "poem-specific"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "savior",
    "name": "救世主",
    "type": "独立羁绊",
    "thresholds": [
      1
    ],
    "icon": "✦",
    "description": "白厄和卡厄斯兰那获得所有前台角色已激活的非独立羁绊效果，该效果不会影响羁绊效果激活的人数。",
    "levels": [
      {
        "count": 1,
        "description": "白厄和卡厄斯兰那获得所有前台角色已激活的非独立羁绊效果。",
        "effects": {
          "inheritFrontBonds": true
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%95%91%E4%B8%96%E4%B8%BB#零和博弈",
    "mechanics": {
      "kind": "heirOfDeliverance",
      "scope": "Phainon and Khaslana receive every active non-independent bond represented on frontline",
      "countsForActivation": false
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "hunters",
    "name": "星核猎手",
    "type": "阵营羁绊",
    "thresholds": [
      2,
      3,
      4
    ],
    "icon": "◈",
    "description": "装备最多的【星核猎手】成为【猎星人】，【星核猎手】会协助【猎星人】作战。【星核猎手】的伤害增幅和生命增幅提高。",
    "levels": [
      {
        "count": 2,
        "description": "24%伤害增幅，12%生命增幅。",
        "effects": {
          "memberDamage": 0.24,
          "memberHP": 0.12,
          "hunterCount": 1
        }
      },
      {
        "count": 3,
        "description": "48%伤害增幅，24%生命增幅。",
        "effects": {
          "memberDamage": 0.48,
          "memberHP": 0.24,
          "hunterCount": 1
        }
      },
      {
        "count": 4,
        "description": "80%伤害增幅，36%生命增幅。额外激活一位【猎星人】。",
        "effects": {
          "memberDamage": 0.8,
          "memberHP": 0.36,
          "hunterCount": 2
        }
      }
    ],
    "notes": [
      "仅激活角色赋能的【星核猎手】可生效【猎星人】效果。【刃】：【星核猎手】每攻击4次，刃立即施放强化普攻攻击敌人。战斗开始时已记录2次攻击。【卡芙卡】：【星核猎手】每攻击4次，卡芙卡立即施放战技攻击敌人。战斗开始时已记录2次攻击。【银狼】：【星核猎手】每攻击5次，银狼立即施放战技攻击敌人。战斗开始时已记录3次攻击。【流萤】：【星核猎手】每攻击6次，流萤立即施放终结技攻击敌人。战斗开始时已记录3次攻击。【银狼LV.999】：【星核猎手】每攻击7次，银狼LV.999立即施放1次固定计入40笑点的欢愉技。战斗开始时已记录4次攻击。【千冶•刃】：【星核猎手】每攻击6次，千冶•刃立即施放终结技攻击敌人。战斗开始时已记录3次攻击。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%98%9F%E6%A0%B8%E7%8C%8E%E6%89%8B#零和博弈",
    "mechanics": {
      "kind": "stellarHunter",
      "selection": "most equipped empowered hunter member",
      "trigger": "hunterMemberAttack",
      "characterTriggers": {
        "1205": {
          "attacks": 4,
          "initial": 2,
          "attack": "enhancedBasic"
        },
        "1005": {
          "attacks": 4,
          "initial": 2,
          "attack": "skill"
        },
        "1006": {
          "attacks": 5,
          "initial": 3,
          "attack": "skill"
        },
        "1310": {
          "attacks": 6,
          "initial": 3,
          "attack": "ultimate"
        },
        "1506": {
          "attacks": 7,
          "initial": 4,
          "attack": "elation",
          "fixedPunchlines": 40
        },
        "1507": {
          "attacks": 6,
          "initial": 3,
          "attack": "ultimate"
        }
      }
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "wanderer",
    "name": "星间旅人",
    "type": "阵营羁绊",
    "thresholds": [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ],
    "icon": "✧",
    "description": "【星间旅人】角色会为你的小队提高特定属性，该效果会随着场上【星间旅人】角色数量而提升。【星间旅人】队员获得双倍收益。",
    "levels": [
      {
        "count": 1,
        "description": "100%加成。",
        "effects": {
          "travelerMultiplier": 1
        }
      },
      {
        "count": 2,
        "description": "120%加成。",
        "effects": {
          "travelerMultiplier": 1.2
        }
      },
      {
        "count": 3,
        "description": "145%加成。",
        "effects": {
          "travelerMultiplier": 1.45
        }
      },
      {
        "count": 4,
        "description": "175%加成。",
        "effects": {
          "travelerMultiplier": 1.75
        }
      },
      {
        "count": 5,
        "description": "210%加成。",
        "effects": {
          "travelerMultiplier": 2.1
        }
      },
      {
        "count": 6,
        "description": "250%加成。",
        "effects": {
          "travelerMultiplier": 2.5
        }
      },
      {
        "count": 7,
        "description": "300%加成。",
        "effects": {
          "travelerMultiplier": 3
        }
      }
    ],
    "notes": [
      "【桑博】伤害减免提高10%。【银枝】前台强度提高20%。【绯英】初始能量提高15。【真理医生】速度增幅提高10%。【罗刹】后台强度提高20%。【火花】伤害减免提高10%。每节点变化！；【火花】前台强度提高20%。每节点变化！；【火花】初始能量提高15。每节点变化！；【火花】速度增幅提高10%。每节点变化！；【火花】伤害增幅提高10%。每节点变化！；【火花】后台强度提高20%。每节点变化！；【火花】幸运一击率提高10%。每节点变化！；【火花】幸运一击伤害提高18%。每节点变化！；【火花】提供随机属性加成。每节点变化！；【瓦尔特】幸运一击率提高10%。【星徽】幸运一击伤害提高18%。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%98%9F%E9%97%B4%E6%97%85%E4%BA%BA#零和博弈",
    "mechanics": {
      "kind": "travelerBonuses",
      "scope": "team; wanderer members receive double benefit",
      "memberMultiplier": 2,
      "characterBonuses": {
        "1108": {
          "damageReduction": 0.1
        },
        "1302": {
          "frontStrength": 0.2
        },
        "1505": {
          "initialEnergy": 15
        },
        "1305": {
          "speed": 0.1
        },
        "1203": {
          "backStrength": 0.2
        },
        "1004": {
          "critRate": 0.1
        }
      },
      "fireworksBonus": "one random listed stat per node",
      "emblemBonus": {
        "critDamage": 0.18
      }
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "day",
    "name": "昼之半神",
    "type": "阵营羁绊",
    "thresholds": [
      3,
      4,
      6,
      9
    ],
    "icon": "☀",
    "description": "获得仅供【昼之半神】角色穿戴的白昼装备。【昼之半神】队员的前/后台强度和速度增幅提高。",
    "levels": [
      {
        "count": 3,
        "description": "10%前/后台强度，5%速度增幅。获得【白昼•光速螺旋桨】。",
        "effects": {
          "memberStrength": 0.1,
          "memberSpeed": 0.05,
          "dayEquipmentEnhanced": false
        }
      },
      {
        "count": 4,
        "description": "18%前/后台强度，9%速度增幅。获得【白昼•武器大师】。",
        "effects": {
          "memberStrength": 0.18,
          "memberSpeed": 0.09,
          "dayEquipmentEnhanced": false
        }
      },
      {
        "count": 6,
        "description": "36%前/后台强度，18%速度增幅。获得【白昼•斩首行动】。",
        "effects": {
          "memberStrength": 0.36,
          "memberSpeed": 0.18,
          "dayEquipmentEnhanced": false
        }
      },
      {
        "count": 9,
        "description": "60%前/后台强度，30%速度增幅。白昼装备的特殊效果获得增强。进入战斗时，为你的【昼之半神】角色们穿戴满强化后的白昼装备！",
        "effects": {
          "memberStrength": 0.6,
          "memberSpeed": 0.3,
          "dayEquipmentEnhanced": true
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%98%BC%E4%B9%8B%E5%8D%8A%E7%A5%9E#零和博弈",
    "mechanics": {
      "kind": "dayEquipment",
      "grantsAtThreshold": {
        "3": "白昼•光速螺旋桨",
        "4": "白昼•武器大师",
        "6": "白昼•斩首行动"
      },
      "restriction": "day members only",
      "maxTier": "fill day member equipment slots with enhanced day equipment at battle start"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "elation",
    "name": "欢愉",
    "type": "流派羁绊",
    "thresholds": [
      3,
      4,
      5,
      7
    ],
    "icon": "✦",
    "description": "【欢愉】队员的幸运一击率提高。备战阶段召唤【阿哈】为小队提供增益，【阿哈】拥有初始属性并穿戴3件随机简易装备，可将物品栏中简易装备拖拽给阿哈，与阿哈装备栏中的简易装备依次合成对应进阶装备。合成进阶装备后，本局该栏位将会被固定，无法合成其它进阶装备。",
    "levels": [
      {
        "count": 3,
        "description": "8%幸运一击率。",
        "effects": {
          "memberCritRate": 0.08,
          "ahaStars": 1,
          "ahaEquipmentSlots": 1,
          "ahaPrivilegeEquipment": false
        }
      },
      {
        "count": 4,
        "description": "16%幸运一击率。阿哈升至2星，解锁第2个装备栏。",
        "effects": {
          "memberCritRate": 0.16,
          "ahaStars": 2,
          "ahaEquipmentSlots": 2,
          "ahaPrivilegeEquipment": false
        }
      },
      {
        "count": 5,
        "description": "24%幸运一击率。阿哈升至3星，解锁第3个装备栏。",
        "effects": {
          "memberCritRate": 0.24,
          "ahaStars": 3,
          "ahaEquipmentSlots": 3,
          "ahaPrivilegeEquipment": false
        }
      },
      {
        "count": 7,
        "description": "40%幸运一击率。阿哈升至4星！阿哈的所有装备变成特权装备！",
        "effects": {
          "memberCritRate": 0.4,
          "ahaStars": 4,
          "ahaEquipmentSlots": 3,
          "ahaPrivilegeEquipment": true
        }
      }
    ],
    "notes": [
      "【阿哈】在阿哈时刻期间始终视为攻击者（因此可触发相应进阶装备效果），并向小队分享自己的攻击类属性。"
    ],
    "sourceVersion": "4.2",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%AC%A2%E6%84%89#零和博弈",
    "mechanics": {
      "kind": "aha",
      "initialEquipment": "3 random components",
      "combine": "component from inventory combines with Aha component; fixed for rest of run",
      "shares": "attack-related stats to team",
      "attackSource": "Aha counts as attacker during Aha Instant"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "heal",
    "name": "治疗",
    "type": "流派羁绊",
    "thresholds": [
      2,
      4,
      6
    ],
    "icon": "✚",
    "description": "我方小队的生命增幅提高12%。【治疗】队员的治疗强度提高。",
    "levels": [
      {
        "count": 2,
        "description": "20%治疗强度。",
        "effects": {
          "teamHP": 0.12,
          "memberHealing": 0.2,
          "teamDamage": 0
        }
      },
      {
        "count": 4,
        "description": "40%治疗强度。",
        "effects": {
          "teamHP": 0.12,
          "memberHealing": 0.4,
          "teamDamage": 0
        }
      },
      {
        "count": 6,
        "description": "60%治疗强度，我方小队获得60%伤害增幅。",
        "effects": {
          "teamHP": 0.12,
          "memberHealing": 0.6,
          "teamDamage": 0.6
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E6%B2%BB%E7%96%97#零和博弈",
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "blood",
    "name": "燃血",
    "type": "流派羁绊",
    "thresholds": [
      2,
      4,
      6,
      8
    ],
    "icon": "♥",
    "description": "【燃血】队员的生命增幅和伤害增幅提高。战斗开始时，激活会记录【燃血】队员消耗生命值并在行动时攻击敌方全体目标的【燃血角斗场】。【燃血】队员无法获得护盾，受到护盾时会回复2%生命上限+1000生命值。",
    "levels": [
      {
        "count": 2,
        "description": "10%生命增幅，10%伤害增幅。可记录40000点。",
        "effects": {
          "memberHP": 0.1,
          "memberDamage": 0.1,
          "bloodRecordCap": 40000,
          "arenaRecordedHPDamageRatio": 5,
          "arenaBaseDamage": 1,
          "bloodRefundRatio": 0
        }
      },
      {
        "count": 4,
        "description": "20%生命增幅，25%伤害增幅。可记录100000点，伤害倍率提高为1000%。",
        "effects": {
          "memberHP": 0.2,
          "memberDamage": 0.25,
          "bloodRecordCap": 100000,
          "arenaRecordedHPDamageRatio": 10,
          "arenaBaseDamage": 2,
          "bloodRefundRatio": 0
        }
      },
      {
        "count": 6,
        "description": "30%生命增幅，40%伤害增幅。可记录240000点，伤害倍率提高为2000%，行动后返还消耗量的30%。",
        "effects": {
          "memberHP": 0.3,
          "memberDamage": 0.4,
          "bloodRecordCap": 240000,
          "arenaRecordedHPDamageRatio": 20,
          "arenaBaseDamage": 3,
          "bloodRefundRatio": 0.3
        }
      },
      {
        "count": 8,
        "description": "45%生命增幅，60%伤害增幅。可记录720000点，伤害倍率提高为4000%，行动后返还消耗量的50%。",
        "effects": {
          "memberHP": 0.45,
          "memberDamage": 0.6,
          "bloodRecordCap": 720000,
          "arenaRecordedHPDamageRatio": 40,
          "arenaBaseDamage": 4,
          "bloodRefundRatio": 0.5
        }
      }
    ],
    "notes": [
      "【燃血角斗场】：记录【燃血】队员已损失的生命值，每10000点额外为【燃血】队员提供5%伤害增幅。并以300速度行动，行动时消耗所有记录值对敌方全体造成总量500%/1000%/2000%/4000%+100%/200%/300%/400%基础伤害的物理属性伤害。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E7%87%83%E8%A1%80#零和博弈",
    "mechanics": {
      "kind": "bloodArena",
      "memberShieldConversion": {
        "maxHPRatio": 0.02,
        "flatHealing": 1000
      },
      "speed": 300,
      "bonusDamagePer10000RecordedHP": 0.05,
      "target": "allEnemies",
      "element": "physical",
      "damageScale": "original HP units; simulator must declare HP normalization"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "wolfpack",
    "name": "狼狩",
    "type": "阵营羁绊",
    "thresholds": [
      3,
      5,
      6,
      8
    ],
    "icon": "♜",
    "description": "召唤【步离人】协同战斗，其在参与战斗后可以获得经验并升级。我方队员携带更多装备参与战斗会使其额外获得经验。【狼狩】队员的前/后台强度提高，【步离人】每次升级后使该加成提高50%。",
    "levels": [
      {
        "count": 3,
        "description": "15%前/后台强度。",
        "effects": {
          "memberStrength": 0.15,
          "companionXpMultiplier": 1
        }
      },
      {
        "count": 5,
        "description": "30%前/后台强度。2倍经验。",
        "effects": {
          "memberStrength": 0.3,
          "companionXpMultiplier": 2
        }
      },
      {
        "count": 6,
        "description": "50%前/后台强度。3倍经验。",
        "effects": {
          "memberStrength": 0.5,
          "companionXpMultiplier": 3
        }
      },
      {
        "count": 8,
        "description": "90%前/后台强度。6倍经验。",
        "effects": {
          "memberStrength": 0.9,
          "companionXpMultiplier": 6
        }
      }
    ],
    "notes": [
      "【步离人】：参与战斗后获得4点经验，我方队员每携带1件简易装备，就会在战斗后额外使其获得1点经验，获得足够的经验后【步离人】会升级，造成更多伤害并提供增益。进阶装备和特权装备算作2件简易装备。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E7%8B%BC%E7%8B%A9#零和博弈",
    "mechanics": {
      "kind": "borisinCompanion",
      "xpPerBattle": 4,
      "xpPerBasicEquipment": 1,
      "advancedAndPrivilegeEquipmentWeight": 2,
      "memberStrengthMultiplierPerCompanionLevel": 0.5,
      "levelXpThresholdsStatus": "not stated in this bond reference"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "festival",
    "name": "盛会之星",
    "type": "阵营羁绊",
    "thresholds": [
      2,
      3,
      4,
      5,
      6
    ],
    "icon": "♬",
    "description": "选择1名【盛会之星】角色作为【巨星】，使我方小队获得独特加成。",
    "levels": [
      {
        "count": 2,
        "description": "获得选定【巨星】的加成。",
        "effects": {
          "superstarRank": 1
        }
      },
      {
        "count": 3,
        "description": "加成提高。",
        "effects": {
          "superstarRank": 2
        }
      },
      {
        "count": 4,
        "description": "加成提高。",
        "effects": {
          "superstarRank": 3
        }
      },
      {
        "count": 5,
        "description": "加成提高。",
        "effects": {
          "superstarRank": 4
        }
      },
      {
        "count": 6,
        "description": "加成提高。",
        "effects": {
          "superstarRank": 5
        }
      }
    ],
    "notes": [
      "【大丽花】 击破伤害增幅提高，速度增幅提高。【花火】 进入战斗时获得战技点，伤害增幅普攻/战技伤害增幅提高。【星期日】 前台第一位角色前台强度提高，后台第一位角色后台强度提高。【知更鸟】 幸运一击率提高。【黑天鹅】 我方小队中每有1个5费角色，则伤害增幅提高，可叠加。【星徽】 我方小队每装备了1个星徽，则前/后台强度提高，可叠加。【加拉赫】 击破伤害增幅提高，治疗强度提高。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E7%9B%9B%E4%BC%9A%E4%B9%8B%E6%98%9F#零和博弈",
    "mechanics": {
      "kind": "superstar",
      "selection": "one festival member",
      "scope": "team",
      "characterBonusTypes": {
        "1321": [
          "breakDamage",
          "speed"
        ],
        "1306": [
          "initialSP",
          "basicSkillDamage"
        ],
        "1313": [
          "firstFrontStrength",
          "firstBackStrength"
        ],
        "1309": [
          "critRate"
        ],
        "1307": [
          "damagePerFiveCost"
        ],
        "1301": [
          "breakDamage",
          "healing"
        ]
      },
      "numericalBonusStatus": "not stated in bond reference; do not invent as original values"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "aoe",
    "name": "群攻",
    "type": "流派羁绊",
    "thresholds": [
      3,
      5,
      7,
      9
    ],
    "icon": "✹",
    "description": "【群攻】队员的幸运一击率提高，幸运一击伤害提高。进入战斗后在敌方场上生成2个可转移伤害的【借力球】。",
    "levels": [
      {
        "count": 3,
        "description": "12%幸运一击率，12%幸运一击伤害。将受到伤害的40%转移给其他敌方目标。",
        "effects": {
          "memberCritRate": 0.12,
          "memberCritDamage": 0.12,
          "orbTransferRatio": 0.4,
          "orbLaserHits": 0,
          "orbLaserBaseDamage": 0,
          "bossVulnerability": 0
        }
      },
      {
        "count": 5,
        "description": "24%幸运一击率，24%幸运一击伤害。将受到伤害的60%转移给其他敌方目标。累计受到6次攻击后，发射激光造成8次250%基础伤害的量子属性伤害，单次攻击内最多累计1次。",
        "effects": {
          "memberCritRate": 0.24,
          "memberCritDamage": 0.24,
          "orbTransferRatio": 0.6,
          "orbLaserHits": 8,
          "orbLaserBaseDamage": 2.5,
          "bossVulnerability": 0
        }
      },
      {
        "count": 7,
        "description": "36%幸运一击率，36%幸运一击伤害。将受到伤害的100%转移给其他敌方目标，并使首领敌人受到的伤害提高30%。累计受到6次攻击后，发射激光造成8次500%基础伤害的量子属性伤害，单次攻击内最多累计1次。",
        "effects": {
          "memberCritRate": 0.36,
          "memberCritDamage": 0.36,
          "orbTransferRatio": 1,
          "orbLaserHits": 8,
          "orbLaserBaseDamage": 5,
          "bossVulnerability": 0.3
        }
      },
      {
        "count": 9,
        "description": "60%幸运一击率，60%幸运一击伤害。将受到伤害的100%转移给其他敌方目标，并使首领敌人受到的伤害提高100%。累计受到6次攻击后，发射激光造成12次1500%基础伤害的量子属性伤害，单次攻击内最多累计1次。",
        "effects": {
          "memberCritRate": 0.6,
          "memberCritDamage": 0.6,
          "orbTransferRatio": 1,
          "orbLaserHits": 12,
          "orbLaserBaseDamage": 15,
          "bossVulnerability": 1
        }
      }
    ],
    "notes": [
      "【借力球】：受到攻击后，使攻击者对其他敌方目标造成真实伤害，数值等同于自身本次攻击内所受伤害的一定比例。【借力球】免疫控制类负面状态。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E7%BE%A4%E6%94%BB#零和博弈",
    "mechanics": {
      "kind": "leverageOrbs",
      "count": 2,
      "laserChargeThreshold": 6,
      "chargeMaximumPerAttack": 1,
      "laserElement": "quantum",
      "transferDamageType": "true",
      "orbControlImmunity": true
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "energy",
    "name": "能量",
    "type": "流派羁绊",
    "thresholds": [
      3,
      5,
      7,
      10
    ],
    "icon": "ϟ",
    "description": "【能量】队员的终结技伤害增幅提高。在场上生成【能量地块】，可提供伤害增幅和能量恢复。",
    "levels": [
      {
        "count": 3,
        "description": "20%终结技伤害增幅。",
        "effects": {
          "memberUltimateDamage": 0.2,
          "energyWaveBaseDamage": 0,
          "allTilesPowered": false
        }
      },
      {
        "count": 5,
        "description": "40%终结技伤害增幅。【能量】角色施放终结技时，记录消耗的能量值。累计500点后，消耗500点，并对敌方全体目标造成800%基础伤害的物理属性伤害。",
        "effects": {
          "memberUltimateDamage": 0.4,
          "energyWaveBaseDamage": 8,
          "allTilesPowered": false
        }
      },
      {
        "count": 7,
        "description": "80%终结技伤害增幅。累计值造成的伤害倍率提高至1800%。",
        "effects": {
          "memberUltimateDamage": 0.8,
          "energyWaveBaseDamage": 18,
          "allTilesPowered": false
        }
      },
      {
        "count": 10,
        "description": "240%终结技伤害增幅。场上所有地格变为【能量地块】，累计值造成的伤害倍率提高至12000%。",
        "effects": {
          "memberUltimateDamage": 2.4,
          "energyWaveBaseDamage": 120,
          "allTilesPowered": true
        }
      }
    ],
    "notes": [
      "【能量地块】：进入战斗时，此地格上的角色获得30%伤害增幅，【能量】角色获得双倍。任一【能量】角色施放终结技后，此地格上的角色固定恢复3%能量。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E8%83%BD%E9%87%8F#零和博弈",
    "mechanics": {
      "kind": "energyTiles",
      "tileDamageBonus": 0.3,
      "memberTileMultiplier": 2,
      "tileEnergyPerMemberUltimate": 0.03,
      "energyWaveFromTier": 5,
      "energyWaveThreshold": 500,
      "energyWaveTrigger": "energy spent by energy members",
      "energyWaveElement": "physical"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "belobog",
    "name": "贝洛伯格",
    "type": "阵营羁绊",
    "thresholds": [
      2,
      4
    ],
    "icon": "❄",
    "description": "【贝洛伯格】队员行动后为【造物引擎】充能，【造物引擎】的能量充满后立即攻击敌方目标，并让本场战斗中造成伤害最多的【贝洛伯格】角色立即行动。【贝洛伯格】队员和【造物引擎】的伤害增幅提高。",
    "levels": [
      {
        "count": 2,
        "description": "36%伤害增幅。【造物引擎】额外造成【贝洛伯格】队员已造成总伤害的25%伤害，攻击后清零。",
        "effects": {
          "memberDamage": 0.36,
          "engineBaseDamage": 6,
          "engineAccumulatedDamageRatio": 0.25
        }
      },
      {
        "count": 4,
        "description": "72%伤害增幅。额外伤害的转化比例提高至40%。",
        "effects": {
          "memberDamage": 0.72,
          "engineBaseDamage": 12,
          "engineAccumulatedDamageRatio": 0.4
        }
      }
    ],
    "notes": [
      "【造物引擎】：【贝洛伯格】队员行动后充能1点，上限10点，能量充满时消耗10点对敌方全体目标造成600%/1200%基础伤害的火属性伤害，并使战斗中造成伤害最多的【贝洛伯格】角色立即行动。初始拥有6点能量。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E8%B4%9D%E6%B4%9B%E4%BC%AF%E6%A0%BC#零和博弈",
    "mechanics": {
      "kind": "creationEngine",
      "initialEnergy": 6,
      "energyPerMemberAction": 1,
      "energyThreshold": 10,
      "target": "allEnemies",
      "element": "fire",
      "onAttack": "consume recorded member damage; advance highest damage Belobog member immediately"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "follow",
    "name": "追击",
    "type": "流派羁绊",
    "thresholds": [
      3,
      5,
      7,
      9
    ],
    "icon": "⌁",
    "description": "【追击】队员的追加攻击伤害增幅追加攻击伤害增幅提高，攻击后附加1次等同于攻击者300%攻击力的随机属性附加伤害，该伤害视为追加攻击伤害。我方小队连续行动会提高【追击】队员的追加攻击伤害增幅，持续至任意敌方目标回合开始。",
    "levels": [
      {
        "count": 3,
        "description": "20%追加攻击伤害增幅追加攻击伤害增幅。连续行动提供5%追加攻击伤害增幅，最多20%。",
        "effects": {
          "memberFollowDamage": 0.2,
          "consecutiveActionBonus": 0.05,
          "consecutiveActionCap": 0.2,
          "totalAssaultRatio": 0
        }
      },
      {
        "count": 5,
        "description": "50%追加攻击伤害增幅。连续行动提供10%追加攻击伤害增幅，最多40%。连续行动达到5次后：可发动【总攻击】，造成60%的真实伤害。",
        "effects": {
          "memberFollowDamage": 0.5,
          "consecutiveActionBonus": 0.1,
          "consecutiveActionCap": 0.4,
          "totalAssaultRatio": 0.6
        }
      },
      {
        "count": 7,
        "description": "80%追加攻击伤害增幅。连续行动提供15%追加攻击伤害增幅，最多60%。【总攻击】造成120%的真实伤害。",
        "effects": {
          "memberFollowDamage": 0.8,
          "consecutiveActionBonus": 0.15,
          "consecutiveActionCap": 0.6,
          "totalAssaultRatio": 1.2
        }
      },
      {
        "count": 9,
        "description": "120%追加攻击伤害增幅。连续行动提供30%追加攻击伤害增幅，最多120%。【总攻击】造成240%的真实伤害。",
        "effects": {
          "memberFollowDamage": 1.2,
          "consecutiveActionBonus": 0.3,
          "consecutiveActionCap": 1.2,
          "totalAssaultRatio": 2.4
        }
      }
    ],
    "notes": [
      "【总攻击】：连续行动多次后，在敌方目标回合开始时触发总攻击，基于触发前羁绊内队员累计的追击伤害造成一定比例的真实伤害，随后清空累计值。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E8%BF%BD%E5%87%BB#零和博弈",
    "mechanics": {
      "kind": "followUp",
      "appendAttackRatio": 3,
      "appendElement": "random",
      "trigger": "followMemberAttack",
      "streakReset": "enemyTurnStart",
      "totalAssaultFromTier": 5,
      "totalAssaultMinimumConsecutiveActions": 5,
      "totalAssaultTrigger": "enemyTurnStart",
      "totalAssaultBase": "accumulated follow member follow-up damage; reset after assault"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "quantum",
    "name": "量子同频",
    "type": "流派羁绊",
    "thresholds": [
      2,
      3,
      4,
      5
    ],
    "icon": "◇",
    "description": "敌人受到的伤害提高。【量子同频】角色获得可强化技能效果的【同频】。",
    "levels": [
      {
        "count": 2,
        "description": "获得1层【同频】，敌方目标受到的伤害提高15%。",
        "effects": {
          "resonanceStacks": 1,
          "enemyVulnerability": 0.15
        }
      },
      {
        "count": 3,
        "description": "获得2层【同频】，敌方目标受到的伤害提高30%。",
        "effects": {
          "resonanceStacks": 2,
          "enemyVulnerability": 0.3
        }
      },
      {
        "count": 4,
        "description": "获得3层【同频】，敌方目标受到的伤害提高60%。",
        "effects": {
          "resonanceStacks": 3,
          "enemyVulnerability": 0.6
        }
      },
      {
        "count": 5,
        "description": "获得4层【同频】，敌方目标受到的伤害提高100%。",
        "effects": {
          "resonanceStacks": 4,
          "enemyVulnerability": 1
        }
      }
    ],
    "notes": [
      "【同频】：每层都会强化【量子同频】角色的技能。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E9%87%8F%E5%AD%90%E5%90%8C%E9%A2%91#零和博弈",
    "mechanics": {
      "kind": "resonance",
      "scope": "all enemies vulnerable; quantum members gain skill-specific resonance amplification"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "scholar",
    "name": "银河学者",
    "type": "阵营羁绊",
    "thresholds": [
      2,
      4,
      6
    ],
    "icon": "⌘",
    "description": "战斗开始时，基于【银河学者】角色的星级叠加【猫猫糕】，并在战斗后根据层数获得额外奖励。",
    "levels": [
      {
        "count": 2,
        "description": "30%前/后台强度。",
        "effects": {
          "memberStrength": 0.3,
          "dnaMultiplier": 1
        }
      },
      {
        "count": 4,
        "description": "80%前/后台强度。获得1.5倍【DNA】。",
        "effects": {
          "memberStrength": 0.8,
          "dnaMultiplier": 1.5
        }
      },
      {
        "count": 6,
        "description": "200%前/后台强度。获得2倍【DNA】。",
        "effects": {
          "memberStrength": 2,
          "dnaMultiplier": 2
        }
      }
    ],
    "notes": [
      "每星级【银河学者】提供的【DNA】进度为2/4/8/20。",
      "【猫猫糕】：【银河学者】队员的前/后台强度提高，并在我方前台回合开始时为其回复等同于其生命增幅20%的生命，每层【猫猫糕】使该倍率提高5%。我方前台伤害减免提高15%，每层【猫猫糕】使该倍率提高3%。"
    ],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E9%93%B6%E6%B2%B3%E5%AD%A6%E8%80%85#零和博弈",
    "mechanics": {
      "kind": "catCake",
      "dnaByStar": [
        2,
        4,
        8,
        20
      ],
      "trigger": "frontTurnStart",
      "frontHealLifeAmplificationRatio": 0.2,
      "frontHealRatioPerCake": 0.05,
      "frontDamageReduction": 0.15,
      "frontDamageReductionPerCake": 0.03,
      "rewardTrigger": "afterBattle",
      "cakeStackRule": "based on scholar star levels; threshold table not supplied by this reference"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "navigator",
    "name": "领航员",
    "type": "独立羁绊",
    "thresholds": [
      1
    ],
    "icon": "✦",
    "description": "选择1名【列车同行】角色，姬子•启行获得该角色的流派羁绊，且复制其首件装备并作为改件佩戴。根据所选角色，姬子•启行强化自身和【列车同行】的【光轨】效果。",
    "levels": [
      {
        "count": 1,
        "description": "获得选定【领航员】的加成。",
        "effects": {
          "copyFirstEquipment": true
        }
      }
    ],
    "notes": [
      "【丹恒•饮月】：加入【战技点】羁绊，获得【战技】相关强化效果。【星期日】：加入【能量】羁绊，获得【终结技】相关强化效果。【瓦尔特】：加入【减益】羁绊，获得【负面状态】相关强化效果。【开拓者】：加入【欢愉】、【能量】羁绊，获得【欢愉技】，并获得欢愉相关强化效果。【姬子】：加入【击破】羁绊，获得【击破】相关强化效果。【三月七】：加入【护盾】羁绊，获得【护盾】与【反震】相关强化效果。【星徽】：加入对应流派羁绊。【列车同行】攻击后获得经验，我方小队幸运一击伤害提高。"
    ],
    "sourceVersion": "4.4",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E9%A2%86%E8%88%AA%E5%91%98#零和博弈",
    "mechanics": {
      "kind": "navigator",
      "selection": "one express member",
      "gain": "selected member archetype trait; strengthen self and train tracks",
      "copy": "first selected-member equipment as a modification"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  },
  {
    "id": "magician",
    "name": "魔术师",
    "type": "独立羁绊",
    "thresholds": [
      1
    ],
    "icon": "✦",
    "description": "Archer攻击后获得1点充能，充能满6点后，消耗6点充能立即进行投影，使我方小队中3名随机角色获得1件与其匹配的临时装备，临时装备在战斗结束后消失。",
    "levels": [
      {
        "count": 1,
        "description": "Archer攻击一定次数后，使我方角色获得临时装备。",
        "effects": {
          "projectionChargeThreshold": 6
        }
      }
    ],
    "notes": [],
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BE%81%E7%BB%8A/%E9%AD%94%E6%9C%AF%E5%B8%88#零和博弈",
    "mechanics": {
      "kind": "projection",
      "chargePerArcherAttack": 1,
      "targets": 3,
      "equipment": "one matching temporary item per random ally",
      "expires": "battleEnd"
    },
    "effectsStatus": "reference values; event simulation coverage is defined separately in combat.js"
  }
];
export const CLASSIC_CHARACTERS = [
  {
    "id": "1001",
    "name": "三月七",
    "cost": 1,
    "traits": [
      "express",
      "shield"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "护盾",
    "tags": [
      "护盾"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/characters/1001.png",
    "portrait": "assets/portraits/1001.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E4%B8%89%E6%9C%88%E4%B8%83#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "本姑娘保护你！",
        "description": "我方小队造成的伤害提高。行动时为我方低血量目标施加护盾，并使相邻目标也获得护盾。",
        "skills": [
          {
            "name": "可爱即是正义",
            "type": "战技",
            "condition": "行动时施放。三月七以200%/250%/300%/300%的速度行动。",
            "description": "为当前血量百分比最低的前台目标提供能够抵消等同于三月七81%/121%/162%/202%防御力+1080/1620/2160/2700伤害的护盾，并使相邻目标获得等同于该护盾值60%的护盾，持续3回合。若该目标当前生命值百分比大于等于30%，被敌方目标攻击的概率大幅提高。"
          },
          {
            "name": "无漏之诗",
            "type": "天赋",
            "condition": "",
            "description": "我方小队造成的伤害提高40%/50%/60%/70%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/70/80/80",
      "基础护盾强度": "60/70/80/80"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 70.0,
        "shieldStrength": 70.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 80.0,
        "shieldStrength": 80.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 80.0,
        "shieldStrength": 80.0
      }
    ]
  },
  {
    "id": "1009",
    "name": "艾丝妲",
    "cost": 1,
    "traits": [
      "scholar",
      "dot"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "辅助",
    "tags": [
      "辅助"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/characters/1009.png",
    "portrait": "assets/portraits/1009.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E8%89%BE%E4%B8%9D%E5%A6%B2#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "高能射线",
        "description": "战技可以弹射更多次数，并使目标陷入可叠加的灼烧。",
        "skills": [
          {
            "name": "流星群落",
            "type": "战技",
            "condition": "",
            "description": "对指定敌方单体造成等同于艾丝妲60%/75%/108%/168%攻击力的火属性伤害，并额外造成9次伤害。每次伤害对随机敌方单体造成等同于艾丝妲60%/75%/108%/168%攻击力的火属性伤害。"
          },
          {
            "name": "天火",
            "type": "天赋",
            "condition": "",
            "description": "艾丝妲造成伤害后有100%的基础概率使敌方目标陷入可叠加的灼烧状态，持续3回合，最多可叠加5层。灼烧状态下，敌方目标每回合开始时受到等同于艾丝妲40%/50%/72%/112%攻击力的火属性持续伤害。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 0.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1013",
    "name": "黑塔",
    "cost": 1,
    "traits": [
      "scholar",
      "aoe"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/characters/1013.png",
    "portrait": "assets/portraits/1013.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%BB%91%E5%A1%94#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "转圈圈",
        "description": "更容易发动追加攻击，并在敌人被消灭后永久提高前/后台强度。",
        "skills": [
          {
            "name": "还是我来吧",
            "type": "天赋",
            "condition": "",
            "description": "当敌方目标的当前生命值百分比小于等于50%时，黑塔发动追加攻击，对敌方全体造成等同于黑塔36%/45%/65%/101%攻击力的冰属性伤害。精英敌人当前生命值百分比小于等于25%和75%时，黑塔也会发动追加攻击。"
          },
          {
            "name": "大锤附魔",
            "type": "天赋",
            "condition": "",
            "description": "每有一个敌方目标被消灭，则黑塔的前台强度与后台强度永久提高1%。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "转圈圈",
        "description": "敌人生命值降低后发动追加攻击，并在敌人被消灭后永久提高前/后台强度。",
        "skills": [
          {
            "name": "还是我来吧",
            "type": "天赋",
            "condition": "",
            "description": "当敌方目标的当前生命值百分比小于等于50%时，黑塔发动追加攻击，对敌方全体造成等同于黑塔80%/100%/144%/224%攻击力的冰属性伤害。精英敌人当前生命值百分比小于等于25%和75%时，黑塔也会发动追加攻击。"
          },
          {
            "name": "大锤附魔",
            "type": "天赋",
            "condition": "",
            "description": "每有一个敌方目标被消灭，则黑塔的前台强度与后台强度永久提高1%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1108",
    "name": "桑博",
    "cost": 1,
    "traits": [
      "belobog",
      "wanderer",
      "dot"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/characters/1108.png",
    "portrait": "assets/portraits/1108.png",
    "expert": true,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%A1%91%E5%8D%9A#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "风刃连击",
        "description": "桑博战技的弹射次数增加，且可以额外触发满层的风化效果。",
        "skills": [
          {
            "name": "撕风的匕首",
            "type": "天赋",
            "condition": "",
            "description": "桑博的战技弹射次数提高2/3/4/5次。桑博击中敌方目标后有65%的基础概率使目标陷入风化状态，持续3回合。风化状态下，敌方目标每回合开始时受到等同于桑博40%攻击力的风属性持续伤害。风化状态最多叠加5层。"
          },
          {
            "name": "风暴眼",
            "type": "天赋",
            "condition": "",
            "description": "若攻击了风化状态层数达到上限的敌方目标，则攻击后立即使该目标承受的风化类持续伤害状态产生相当于原伤害40%/100%/180%的伤害。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "风刃连击",
        "description": "行动时施放战技攻击敌人，使其陷入风化并在满层后额外触发风化效果。",
        "skills": [
          {
            "name": "反复横跳的爱",
            "type": "战技",
            "condition": "行动时施放。桑博以200%/250%/300%/300%的速度行动。",
            "description": "对指定敌方单体造成等同于桑博56%攻击力的风属性伤害，并额外造成6/7/8/9次伤害，每次伤害对敌方随机单体造成等同于桑博56%攻击力的风属性伤害。"
          },
          {
            "name": "撕风的匕首",
            "type": "天赋",
            "condition": "",
            "description": "桑博击中敌方目标后有65%的基础概率使目标陷入风化状态，持续4回合。风化状态下，敌方目标每回合开始时受到等同于桑博60%/75%/108%/168%攻击力的风属性持续伤害。风化状态最多叠加5层。若攻击了风化状态层数达到上限的目标，则攻击后立即使目标承受的风化类持续伤害状态产生相当于原伤害50%/90%/160%/260%的伤害。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1201",
    "name": "青雀",
    "cost": 1,
    "traits": [
      "luofu",
      "sp"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/characters/1201.png",
    "portrait": "assets/portraits/1201.png",
    "expert": true,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%9D%92%E9%9B%80#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "雀神",
        "description": "「暗杠」后还可以继续抽牌，并基于战技施放的次数连续攻击。回合开始时获得临时战技点。",
        "skills": [
          {
            "name": "帝垣琼玉",
            "type": "天赋",
            "condition": "",
            "description": "我方目标回合开始时，青雀会从3种不同花色的琼玉牌中随机抽取1张，最多持有4张琼玉牌。青雀回合开始时，若持有的琼玉牌数为4且花色相同，青雀消耗所有琼玉牌进入【暗杠】状态。处于【暗杠】状态时可再次施放战技，若持有的琼玉牌数为4且花色相同则叠加【抬杠】状态，该效果最多叠加1/1/2/2层。普攻【门前清】强化为【杠上开花！】并使自身攻击力提高63%，攻击力提高不可叠加。【暗杠】状态会在施放【杠上开花！】后结束，并消耗所有的【抬杠】，每层都会使青雀额外发动1次追加攻击，对该目标造成等同于强化普攻伤害100%/120%/140%/160%的量子属性伤害，该次攻击造成的伤害视为普攻伤害。"
          },
          {
            "name": "借牌",
            "type": "天赋",
            "condition": "",
            "description": "回合开始时，获得1/2/3/4个临时战技点。消耗战技点时优先扣除临时战技点，回合结束时扣除未消耗的临时战技点。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 0.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1202",
    "name": "停云",
    "cost": 1,
    "traits": [
      "luofu",
      "energy"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助"
    ],
    "element": "雷",
    "color": "#c49ce8",
    "image": "assets/characters/1202.png",
    "portrait": "assets/portraits/1202.png",
    "expert": true,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%81%9C%E4%BA%91#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "佳音降祥瑞",
        "description": "终结技为前台单体角色恢复能量并提高造成的伤害。我方回合开始时为停云恢复能量。",
        "skills": [
          {
            "name": "庆云光覆仪祷",
            "type": "终结技",
            "condition": "满能量时施放。我方前台角色回合开始时，停云恢复10点能量。",
            "description": "该技能自动选择目标施放。为我方单体前台角色恢复50点能量，同时使目标造成的伤害提高20%/50%/80%/120%，持续2回合。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1205",
    "name": "刃",
    "cost": 1,
    "traits": [
      "hunters",
      "blood"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/characters/1205.png",
    "portrait": "assets/portraits/1205.png",
    "expert": true,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%88%83#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "玉石俱焚",
        "description": "我方前台损失生命时，刃可消耗生命积攒充能层数，以攻击全体敌人。",
        "skills": [
          {
            "name": "倏忽恩赐",
            "type": "天赋",
            "condition": "",
            "description": "我方前台目标受到伤害或消耗生命值时，刃消耗等同于生命上限15%的生命值并获得1层充能，最多叠加5层，该效果每次行动只可触发一次，任意单位行动后重置。当充能叠加至上限时，立即对敌方全体施放1次追加攻击，造成等同于刃180%/225%/324%/504%生命上限的风属性伤害并回复等同于刃生命上限100%的生命值，施放追加攻击后，消耗所有充能。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/20%/40%/60%",
      "基础前台强度": "100/140/180/220",
      "基础后台强度": "100/140/180/220",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "80/80/80/80",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.2,
        "frontStrength": 140.0,
        "backStrength": 140.0,
        "speedAmplification": 0.1,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.4,
        "frontStrength": 180.0,
        "backStrength": 180.0,
        "speedAmplification": 0.2,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.3,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1217",
    "name": "藿藿",
    "cost": 1,
    "traits": [
      "luofu",
      "energy",
      "heal"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "治疗",
    "tags": [
      "治疗",
      "辅助"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/portraits/1217.png",
    "portrait": "assets/portraits/1217.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E8%97%BF%E8%97%BF#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "遣神役鬼",
        "description": "终结技额外为我方全体后台恢复能量，并使其攻击力提高。",
        "skills": [
          {
            "name": "尾巴•遣神役鬼",
            "type": "终结技",
            "condition": "",
            "description": "为除自身以外的我方小队目标恢复等同于各自18.7%能量上限的能量，同时使其攻击力提高27.0%/36.0%/54.0%/72.0%，持续2回合。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "遣神役鬼",
        "description": "终结技为我方小队恢复能量并提高攻击力。我方前台回合开始时回复生命并为藿藿恢复能量。",
        "skills": [
          {
            "name": "尾巴•遣神役鬼",
            "type": "终结技",
            "condition": "满能量时施放。我方前台目标回合开始时，藿藿恢复8点能量。",
            "description": "为自身以外的我方小队目标恢复等同于其20.0%能量上限的能量，同时使其攻击力提高30.0%/40.0%/60.0%/80.0%，若目标能量上限大于等于160使其攻击力额外提高24.0%，持续2回合。"
          },
          {
            "name": "凭附•气通天真",
            "type": "天赋",
            "condition": "",
            "description": "战斗开始时藿藿获得【禳命】，持续至战斗结束。当藿藿拥有【禳命】时，我方前台目标回合开始或施放终结技时，回复自身和生命值百分比最低的我方前台目标等同于藿藿4.5%/5.1%/5.8%/6.5%生命上限+120/138/156/174的生命值，同时对每个当前生命值百分比小于等于50%的前台目标各产生1次回复效果。触发【禳命】为我方目标提供治疗时，解除该目标1个负面效果，该效果最多可触发6次，施放终结技后将重置可触发次数。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/20%/40%/60%",
      "基础前台强度": "100/130/160/190",
      "基础后台强度": "100/130/160/190",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "65/75/85/85",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 65.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.2,
        "frontStrength": 130.0,
        "backStrength": 130.0,
        "speedAmplification": 0.1,
        "healingStrength": 75.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.4,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.2,
        "healingStrength": 85.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.6,
        "frontStrength": 190.0,
        "backStrength": 190.0,
        "speedAmplification": 0.3,
        "healingStrength": 85.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1218",
    "name": "椒丘",
    "cost": 1,
    "traits": [
      "wolfpack",
      "debuff",
      "dot"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "治疗",
    "tags": [
      "治疗",
      "辅助"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1218.png",
    "portrait": "assets/portraits/1218.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%A4%92%E4%B8%98#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "燎烟古方",
        "description": "我方小队攻击或使敌人陷入负面状态后，治疗我方低生命目标。",
        "skills": [
          {
            "name": "鼎阵妙法，奇正相生",
            "type": "终结技",
            "condition": "",
            "description": "将敌方目标具有的【烬煨】层数统一设置为场上【烬煨】层数的最高值，随后开启结界并对敌方全体造成等同于椒丘100%攻击力的火属性伤害。处于结界中时，敌方目标受到的终结技伤害提高15.0%/20.0%/25.0%/30.0%，受到的持续伤害提高15.0%/20.0%/25.0%/30.0%，且行动时有60%的基础概率被施加1层【烬煨】，结界存在期间该效果最多触发6次，且每个敌方目标每回合只能触发1次。椒丘每次施放终结技时重置触发次数。结界持续3回合，自身每回合开始时结界持续回合数减1。当椒丘陷入无法战斗状态时，结界也会被解除。进入战斗时，椒丘恢复50点能量。"
          },
          {
            "name": "滋味食补",
            "type": "天赋",
            "condition": "",
            "description": "我方小队行动中使敌方目标陷入负面效果或施放攻击后，为我方前台生命值最低的目标回复等同于椒丘攻击力12%/18%/24%的生命值，单次行动最多触发2次该效果。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/70/80/80",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 0.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 70.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1220",
    "name": "飞霄",
    "cost": 1,
    "traits": [
      "wolfpack",
      "follow"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/portraits/1220.png",
    "portrait": "assets/portraits/1220.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%A3%9E%E9%9C%84#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "大捷！大捷！",
        "description": "追击后有概率额外追击1次，每次追击都会永久提高追击伤害。后台行动也提供【飞黄】。",
        "skills": [
          {
            "name": "雷狩",
            "type": "天赋",
            "condition": "",
            "description": "【飞黄】达到6点时可激活终结技，最多累计12点。我方前台目标每施放2次攻击，飞霄获得1点【飞黄】。我方后台目标每施放4次攻击，飞霄获得1点【飞黄】，飞霄的终结技攻击不计入次数。当飞霄的前台队友对敌方目标施放攻击后，飞霄立即对主目标发动追加攻击，造成等同于飞霄96%/134%/269%/288%攻击力的风属性伤害。若不存在可攻击的主目标，则攻击敌方随机单体。该效果每回合最多触发1次，飞霄回合开始时重置可触发次数。发动此攻击时使自身造成的伤害提高52%，持续2回合。"
          },
          {
            "name": "谁与争锋",
            "type": "天赋",
            "condition": "",
            "description": "自身发动天赋的追加攻击后，有25%/30%/35%/40%概率再对当前生命值最高的敌人额外发动1次天赋的追加攻击，该效果不会再次触发。每次发动天赋的追加攻击后永久获得1层【常胜】，每层使造成的追加攻击伤害提高6%。每场战斗最多获得40层【常胜】。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 0.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1223",
    "name": "貊泽",
    "cost": 1,
    "traits": [
      "wolfpack",
      "follow"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "雷",
    "color": "#c49ce8",
    "image": "assets/portraits/1223.png",
    "portrait": "assets/portraits/1223.png",
    "expert": true,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E8%B2%8A%E6%B3%BD#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "归于暗影",
        "description": "我方前台攻击后造成额外伤害并为貊泽计数，以使貊泽攻击敌人并附加易伤。",
        "skills": [
          {
            "name": "雷霆一击",
            "type": "天赋",
            "condition": "",
            "description": "我方前台目标发动攻击后，貊泽会额外造成1次等同于自身30%/37%/54%/84%攻击力的雷属性附加伤害，并积累1点充能。积累10点充能时，消耗10点，貊泽会对生命值最高的敌方目标发动1次追加攻击，对其和相邻目标造成等同于自身360%/450%/648%/1008%攻击力的雷属性伤害，并使受到的伤害提高25%/30%/35%/40%，持续2回合。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1301",
    "name": "加拉赫",
    "cost": 1,
    "traits": [
      "festival",
      "break",
      "heal"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "治疗",
    "tags": [
      "治疗"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1301.png",
    "portrait": "assets/portraits/1301.png",
    "expert": true,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%8A%A0%E6%8B%89%E8%B5%AB#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "酒花满溢",
        "description": "普攻永久获得强化，并获得群体治疗能力。",
        "skills": [
          {
            "name": "酒水免单",
            "type": "天赋",
            "condition": "",
            "description": "加拉赫的普攻始终强化为【酒花奔涌】，施放普攻后，为我方全体前台回复等同于加拉赫4%/4%/5%/5%生命上限+640/960/1280/1600的生命值。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "酒花满溢",
        "description": "行动时攻击敌人并治疗全体前台。敌人受到的伤害提高，且被攻击后会为攻击者回复生命。",
        "skills": [
          {
            "name": "酒花奔涌",
            "type": "普攻",
            "condition": "行动时施放。加拉赫以200%/250%/300%/300%的速度行动。",
            "description": "对敌方单体造成等同于加拉赫250%/312%/450%/700%攻击力的火属性伤害。并使目标攻击力降低15.0%，持续2回合。且为我方全体前台回复等同于加拉赫4%/4%/5%/5%生命上限+640/960/1280/1600的生命值。"
          },
          {
            "name": "酩酊大醉",
            "type": "天赋",
            "condition": "",
            "description": "进入战斗时使敌方全体陷入【酩酊】状态，持续至战斗结束。【酩酊】使目标受到的伤害提高8.0%/12.0%/16.0%/20.0%。陷入【酩酊】状态的目标每次受到我方前台攻击后，会回复攻击者640/960/1280/1600点生命值。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/70/80/80",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 70.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1314",
    "name": "翡翠",
    "cost": 1,
    "traits": [
      "ipc",
      "aoe"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/portraits/1314.png",
    "portrait": "assets/portraits/1314.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BF%A1%E7%BF%A0#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "利益交换",
        "description": "使前台角色成为【收债人】，速度与暴击伤害提高，并在击中目标时为翡翠计数，以发动追加攻击。",
        "skills": [
          {
            "name": "恣肆吞併的担保",
            "type": "战技",
            "condition": "战斗开始时施放。",
            "description": "该技能自动选择目标施放。指定我方单体前台角色成为【收债人】至战斗结束，使其速度提高30/45/60/75点，暴击伤害提高20%/30%/40%/50%。【收债人】施放攻击后，每个击中的敌方目标造成1次等同于翡翠25%攻击力的量子属性附加伤害，并消耗【收债人】生命上限2%的生命值，若当前生命值不足，当前生命值降至1点。"
          },
          {
            "name": "剔烁之牙",
            "type": "天赋",
            "condition": "",
            "description": "成为【收债人】的目标施放攻击后，每击中1名敌方目标翡翠均可获得1点充能。当充能达到8点时，消耗8点充能，发动1次追加攻击，对敌方全体目标造成等同于翡翠320%/400%/576%/896%攻击力的量子属性伤害。翡翠的攻击力提高25%/30%/35%/40%，暴击伤害提高120%/140%/160%/180%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1317",
    "name": "乱破",
    "cost": 1,
    "traits": [
      "ranger",
      "break"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "虚数",
    "color": "#d8c496",
    "image": "assets/portraits/1317.png",
    "portrait": "assets/portraits/1317.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E4%B9%B1%E7%A0%B4#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "忍•虚数•破界流",
        "description": "强化普攻的削韧量提高，敌人被击破后，乱破对其造成弹射伤害。",
        "skills": [
          {
            "name": "忍术•随动刃",
            "type": "天赋",
            "condition": "",
            "description": "敌方目标被击破后，乱破对随机敌方目标造成2次等同于乱破60%/120%/200%/300%虚数属性击破伤害的击破伤害。乱破的强化普攻可以额外对攻击目标削减2/4/7/10点韧性。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 0.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1321",
    "name": "大丽花",
    "cost": 1,
    "traits": [
      "festival",
      "break"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1321.png",
    "portrait": "assets/portraits/1321.png",
    "expert": false,
    "sourceVersion": "4.0",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%A4%A7%E4%B8%BD%E8%8A%B1#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "终将到来的葬礼",
        "description": "大丽花的追加攻击段数提高。",
        "skills": [
          {
            "name": "谁在害怕康士坦丝？",
            "type": "天赋",
            "condition": "",
            "description": "进入战斗时，大丽花恢复35点能量，并使自身和另一位击破特攻最高的队友共同成为【共舞者】。【共舞者】攻击处于弱点击破状态的敌方目标后，会将本次攻击的削韧值转化为1次60%/80%/120%/180%的超击破伤害。敌方目标受到另一位【共舞者】攻击后，大丽花发动追加攻击，造成5次伤害，每次对敌方随机单体目标造成等同于大丽花30%/36%/45%/54%攻击力的火属性伤害，我方小队角色数量超过3时，每超出1名角色则额外造成1/1/2/2次伤害。每次对处于弱点击破状态的敌方目标造成伤害后，会将本次伤害的削韧值转化为1次200%/240%/300%/360%的超击破伤害。该效果每回合最多触发1次，若追加攻击施放前目标被消灭则对敌方随机单体目标发动。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "终将到来的葬礼",
        "description": "敌人未处于弱点击破状态也可受到超击破伤害。大丽花和一名前台角色成为【共舞者】，削韧时可造成超击破伤害，且大丽花的追加攻击段数提高。",
        "skills": [
          {
            "name": "舔舐…背叛伸出火舌",
            "type": "战技",
            "condition": "战斗开始时施放。",
            "description": "持续开启结界。随后对随机敌方单体及其相邻目标造成等同于大丽花160%/200%/288%/448%攻击力的火属性伤害。结界持续期间，我方小队的弱点击破效率提高50%，敌方目标未处于弱点击破状态时承受的削韧值也能够转化为超击破伤害。"
          },
          {
            "name": "谁在害怕康士坦丝？",
            "type": "天赋",
            "condition": "行动时施放。大丽花以200%/250%/300%/300%的速度行动。",
            "description": "回合开始时大丽花发动追加攻击，造成5次伤害，每次对敌方随机单体目标造成等同于大丽花30%/36%/45%/54%攻击力的火属性伤害，我方小队角色数量超过4时，每超出1额外造成1次伤害。每次对处于弱点击破状态的敌方目标造成伤害后，会将本次伤害的削韧值转化为1次200%/240%/300%/360%的超击破伤害。进入战斗时，大丽花和击破特攻最高的前台角色共同成为【共舞者】。【共舞者】攻击处于弱点击破状态的敌方目标后，会将本次攻击的削韧值转化为1次60%/80%/120%/180%的超击破伤害"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1402",
    "name": "阿格莱雅",
    "cost": 1,
    "traits": [
      "day",
      "energy"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "雷",
    "color": "#c49ce8",
    "image": "assets/portraits/1402.png",
    "portrait": "assets/portraits/1402.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%98%BF%E6%A0%BC%E8%8E%B1%E9%9B%85#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "金织如梦",
        "description": "忆灵天赋的速度增益的层数上限提高，且每层额外提高伤害。强化普攻视为终结技伤害。",
        "skills": [
          {
            "name": "盛夏双人舞",
            "type": "天赋",
            "condition": "",
            "description": "阿格莱雅的强化普攻造成的伤害视为终结技伤害。忆灵衣匠天赋的速度提高效果上限提高2/3/4/5层，每层额外使造成的伤害提高4%/5%/6%/7%，阿格莱雅获得忆灵天赋的速度提高层数时，每层也会使阿格莱雅造成的伤害提高4%/5%/6%/7%。每场战斗中，阿格莱雅首次施放终结技后额外固定恢复60点能量。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 0.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1404",
    "name": "万敌",
    "cost": 1,
    "traits": [
      "night",
      "blood"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "虚数",
    "color": "#d8c496",
    "image": "assets/portraits/1404.png",
    "portrait": "assets/portraits/1404.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E4%B8%87%E6%95%8C#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "沐浴神血",
        "description": "施放【弑神登神】时生命上限永久提高，生命上限使受伤充能额外提高。",
        "skills": [
          {
            "name": "弑神登神",
            "type": "战技",
            "condition": "",
            "description": "消耗150点充能，对敌方单体造成等同于万敌245%/306%/441%/686%生命上限的虚数属性伤害，同时对其相邻目标造成等同于万敌147%/183%/264%/411%生命上限的虚数属性伤害，并使生命上限永久提高100点，每场战斗最多提高20次。该技能会自动施放。此技能期间无法积攒充能。"
          },
          {
            "name": "气血方刚",
            "type": "天赋",
            "condition": "",
            "description": "战斗开始时，若万敌的生命上限高于8000点，每1000点使万敌受到来自敌方目标伤害造成的充能比例提高15.0%，超出部分最多计入50000点生命值。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "沐浴神血",
        "description": "行动时施放战技进行攻击并积攒充能以施放【弑神登神】，且永久提高生命上限。我方前台回复生命时万敌也回复生命。",
        "skills": [
          {
            "name": "弑王成王",
            "type": "战技",
            "condition": "行动时施放，万敌以200%/250%/300%/300%的速度行动。",
            "description": "消耗等同于万敌当前生命值35%的生命值，对敌方单体造成等同于万敌200%/250%/360%/560%生命上限的虚数属性伤害，同时对其相邻目标造成等同于万敌100%/125%/180%/280%生命上限的虚数属性伤害。若当前生命值不足，施放战技时万敌的当前生命值降低至1点。该技能会自动施放。"
          },
          {
            "name": "弑神登神",
            "type": "战技",
            "condition": "",
            "description": "消耗150点充能，对敌方单体造成等同于万敌400%/500%/720%/1120%生命上限的虚数属性伤害，同时对其相邻目标造成等同于万敌240%/300%/432%/672%生命上限的虚数属性伤害，并使生命上限永久提高100点，每场战斗最多提高20次，且回复等同于生命上限20%的生命值。该技能会自动施放。此技能期间无法积攒充能。"
          },
          {
            "name": "以血还血",
            "type": "天赋",
            "condition": "",
            "description": "每损失1%生命值积攒3点充能，最多积攒200点。进入战斗时立刻进入【血仇】状态，同时行动提前100%。我方前台每回复2000点生命值，则万敌回复等同于生命上限1%的生命值。【血仇】状态下生命上限提高，数值等同于当前生命上限的50%，暴击率提高48%。自身回合开始时自动施放【弑王成王】。【血仇】状态期间充能达到150点时，万敌立即获得1个额外回合并自动施放【弑神登神】。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/20%/40%/60%",
      "基础前台强度": "100/140/180/220",
      "基础后台强度": "100/140/180/220",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "80/80/80/80",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.2,
        "frontStrength": 140.0,
        "backStrength": 140.0,
        "speedAmplification": 0.1,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.4,
        "frontStrength": 180.0,
        "backStrength": 180.0,
        "speedAmplification": 0.2,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.3,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1406",
    "name": "赛飞儿",
    "cost": 1,
    "traits": [
      "night",
      "follow",
      "debuff"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "辅助",
    "tags": [
      "辅助"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/portraits/1406.png",
    "portrait": "assets/portraits/1406.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E8%B5%9B%E9%A3%9E%E5%84%BF#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "好东西，偷了！",
        "description": "战斗开始时和攻击【老主顾】后额外记录伤害值，后台目标对【老主顾】的伤害也会被记录。",
        "skills": [
          {
            "name": "先偷为敬",
            "type": "天赋",
            "condition": "",
            "description": "战斗开始时赛飞儿拥有40000/200000/1000000/2000000点已记录的伤害，赛飞儿攻击【老主顾】后额外记录10000/50000/250000/500000点伤害。赛飞儿会记录我方后台目标对【老主顾】造成的非真实伤害的50%，不记录溢出伤害。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 0.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1502",
    "name": "爻光",
    "cost": 1,
    "traits": [
      "luofu",
      "elation"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/portraits/1502.png",
    "portrait": "assets/portraits/1502.png",
    "expert": false,
    "sourceVersion": "4.0",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%88%BB%E5%85%89#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "嬉变一爻，祸福自招",
        "description": "欢愉技可使神君行动提前。【好活当赏】使我方额外造成的欢愉伤害提高。",
        "skills": [
          {
            "name": "霓裳铁羽，六爻皆吉",
            "type": "终结技",
            "condition": "",
            "description": "获得5/8/11/14个笑点。使阿哈立即获得1个固定计入20/30/40/50笑点的额外回合，该回合不消耗笑点，并使我方小队全属性抗性穿透提高17.5%/21.0%/24.5%/28.0%，持续3回合。"
          },
          {
            "name": "屏开千光，遍观自在",
            "type": "天赋",
            "condition": "",
            "description": "持有【好活当赏】时，使我方小队施放攻击后触发【大吉大利】效果，对随机1个击中的目标额外造成1次基于该【好活当赏】计入笑点的26.2%/35.0%/43.7%/52.5%的对应属性欢愉伤害，若本次攻击消耗战技点，则额外触发1次【大吉大利】。触发【大吉大利】效果时若攻击者欢愉度低于爻光，则该次欢愉伤害基于爻光欢愉度来计算。触发【大吉大利】效果不视为1次攻击。爻光施放普攻攻击后可额外触发4/6/8/10次【大吉大利】效果。"
          },
          {
            "name": "赠君一卦，火树银花",
            "type": "欢愉技",
            "condition": "",
            "description": "使敌方全体陷入【凶星低语】状态，持续3回合。【凶星低语】状态下的敌方目标受到的伤害提高10.0%。对敌方全体造成105%/131%/189%/294%的物理属性欢愉伤害，随后对敌方随机单体造成5次26%/32%/47%/73%的物理属性欢愉伤害。并使【仙舟】羁绊的神君行动提前10%/15%/20%/25%。"
          },
          {
            "name": "华丽登场",
            "type": "天赋",
            "condition": "",
            "description": "阿哈的速度提高15/30/45/60点。"
          },
          {
            "name": "卜者笑语",
            "type": "天赋",
            "condition": "",
            "description": "爻光施放欢愉技期间可以获得阿哈100%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "嬉变一爻，祸福自招",
        "description": "终结技触发额外阿哈时刻，欢愉技可使神君行动提前。为我方提供欢愉增益并使敌人易伤。行动时攻击敌人，获得笑点。",
        "skills": [
          {
            "name": "雀翎鸣镝，过招有喜",
            "type": "普攻",
            "condition": "行动时施放。爻光以200%/250%/300%/300%的速度行动。",
            "description": "对指定敌方单体造成等同于爻光100%/125%/180%/280%攻击力的物理属性伤害，同时对其相邻目标造成等同于爻光40%/50%/72%/112%攻击力的物理属性伤害。"
          },
          {
            "name": "十方光映，万法皆明",
            "type": "战技",
            "condition": "战斗开始时施放。",
            "description": "展开结界。结界持续期间，我方小队欢愉度提高，提高数值等同于爻光欢愉度的20.0%，且爻光施放普攻、战技后获得3个笑点。"
          },
          {
            "name": "霓裳铁羽，六爻皆吉",
            "type": "终结技",
            "condition": "满能量时施放。普攻恢复20点能量。阿哈时刻结束后，爻光恢复20点能量。",
            "description": "获得5/8/11/14个笑点。使阿哈立即获得1个固定计入20/30/40/50笑点的额外回合，该回合不消耗笑点，并使我方小队全属性抗性穿透提高20.0%/24.0%/28.0%/32.0%，持续3回合。"
          },
          {
            "name": "屏开千光，遍观自在",
            "type": "天赋",
            "condition": "",
            "description": "持有【好活当赏】时，使我方小队施放攻击后触发【大吉大利】效果，对随机1个击中的目标额外造成1次等同于该【好活当赏】计入笑点30.0%/40.0%/50.0%/60.0%的对应属性欢愉伤害，若本次攻击消耗战技点，则额外触发1次【大吉大利】。触发【大吉大利】效果时若攻击者欢愉度低于爻光，则该次欢愉伤害使用爻光欢愉度来计算。触发【大吉大利】效果不视为1次攻击。爻光的暴击伤害提高100.0%，欢愉度提高120.0%/140.0%/160.0%/180.0%。爻光施放普攻攻击后可额外触发2/3/4/5次【大吉大利】。"
          },
          {
            "name": "赠君一卦，火树银花",
            "type": "欢愉技",
            "condition": "",
            "description": "使敌方全体陷入【凶星低语】状态，持续3回合，随后为我方恢复1个战技点。【凶星低语】状态下的敌方目标受到的伤害提高10.0%。对敌方全体造成120%/150%/216%/336%的物理属性欢愉伤害，随后对敌方随机单体造成5次30%/37%/54%/84%的物理属性欢愉伤害。并使【仙舟】羁绊的神君行动提前10%/15%/20%/25%。"
          },
          {
            "name": "华丽登场",
            "type": "天赋",
            "condition": "",
            "description": "阿哈的速度提高15/30/45/60点。"
          },
          {
            "name": "卜者笑语",
            "type": "天赋",
            "condition": "",
            "description": "爻光施放欢愉技期间可以获得阿哈100%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1508",
    "name": "远坂凛",
    "cost": 1,
    "traits": [
      "grail",
      "sp"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/portraits/1508.png",
    "portrait": "assets/portraits/1508.png",
    "expert": false,
    "sourceVersion": "4.4",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E8%BF%9C%E5%9D%82%E5%87%9B#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "宝石魔术师",
        "description": "获取【宝石能量】额外召唤【Archer】发动连携攻击，消耗【宝石能量】额外提高我方暴击伤害。",
        "skills": [
          {
            "name": "宝石魔术",
            "type": "天赋",
            "condition": "",
            "description": "进入战斗时，获得20/25/30/35点【宝石能量】。我方小队暴击伤害提高60%/70%/80%/90%，且每消耗或恢复1点战技点就使远坂凛获得1点【宝石能量】。若远坂凛持有的【宝石能量】大于等于15点或当前战技点大于等于7点，战技强化为【第二魔法实验】。"
          },
          {
            "name": "魔弹连发",
            "type": "天赋",
            "condition": "",
            "description": "每获得60点【宝石能量】，若Archer在场上，远坂凛和Archer对敌方全体发动连携追加攻击，分别造成等同于远坂凛150%/187%/270%/420%攻击力以及Archer150%/187%/270%/420%攻击力的量子属性伤害，若Archer不在场上，则召唤Archer一同攻击并造成等同于远坂凛225%/281%/405%/630%攻击力的量子属性伤害，并为我方恢复4个战技点。战斗开始时，视为获得了20点【宝石能量】。"
          },
          {
            "name": "五大元素使",
            "type": "天赋",
            "condition": "",
            "description": "远坂凛施放【第二魔法实验】后，每消耗1点【宝石能量】，使我方小队暴击伤害提高1.5%/2.0%/2.5%/3.0%，持续2回合。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "宝石魔术师",
        "description": "战技点变动时，获得【宝石能量】并可发动连携攻击。行动时消耗所有【宝石能量】，攻击敌方并为我方提供暴击伤害。",
        "skills": [
          {
            "name": "宝石剑•泽尔里奇",
            "type": "战技",
            "condition": "行动时施放。远坂凛以100%/125%/150%/150%的速度行动。",
            "description": "对指定敌方单体造成等同于远坂凛240%/300%/432%/672%攻击力的量子属性伤害。"
          },
          {
            "name": "第二魔法实验",
            "type": "战技",
            "condition": "",
            "description": "对敌方全体造成等同于远坂凛120%/150%/216%/336%攻击力的量子属性伤害。之后，消耗3点【宝石能量】对敌方随机单体目标额外造成等同于远坂凛120%/150%/216%/336%攻击力的量子属性伤害，重复直至【宝石能量】不足3点或无当前生命值大于0的敌方目标，最多重复33轮。"
          },
          {
            "name": "山脉震撼•明星之薪",
            "type": "终结技",
            "condition": "满能量时施放。战技恢复30点能量。",
            "description": "对指定敌方单体造成等同于远坂凛750%/937%/1350%/2100%攻击力的量子属性伤害，同时对其他敌方目标造成等同于远坂凛250%/312%/450%/700%攻击力的量子属性伤害。施放时，为我方恢复1个战技点，并使敌方全体受到的伤害提高20%，持续3回合。施放该技能后，获得12点【宝石能量】。"
          },
          {
            "name": "宝石魔术",
            "type": "天赋",
            "condition": "",
            "description": "进入战斗时，获得20/25/30/35点【宝石能量】。我方小队暴击伤害提高60%/70%/80%/90%，且每消耗或恢复1点战技点就使远坂凛获得1点【宝石能量】。若远坂凛持有的【宝石能量】大于等于15点，战技强化为【第二魔法实验】。远坂凛在场时，战技点上限额外增加2点。进入战斗时，远坂凛的攻击力提高150%/180%/210%/240%，量子属性抗性穿透提高15%，若Archer在队伍中，Archer也会获得该效果。远坂凛速度提高20%。"
          },
          {
            "name": "自在远坂流",
            "type": "天赋",
            "condition": "",
            "description": "Archer施放战技【伪•螺旋剑】攻击后，若战技点小于等于3点或本次【回路连接】状态已主动施放5次【伪•螺旋剑】，且未触发【自在远坂流】的连携追加攻击，远坂凛和Archer对敌方全体发动连携追加攻击，分别造成等同于远坂凛400%/500%/720%/1120%攻击力以及Archer400%/500%/720%/1120%攻击力的量子属性伤害，并为我方恢复4个战技点。该连携追加攻击仅可触发1次，远坂凛回合结束时重置可触发次数。"
          },
          {
            "name": "魔弹连发",
            "type": "天赋",
            "condition": "",
            "description": "每获得60点【宝石能量】，若Archer在场上，远坂凛和Archer对敌方全体发动连携追加攻击，分别造成等同于远坂凛400%/500%/720%/1120%攻击力以及Archer400%/500%/720%/1120%攻击力的量子属性伤害，若Archer不在场上，则召唤Archer一同攻击并造成等同于远坂凛600%/750%/1080%/1680%攻击力的量子属性伤害，并为我方恢复4个战技点。战斗开始时，视为获得了20点【宝石能量】。"
          },
          {
            "name": "五大元素使",
            "type": "天赋",
            "condition": "",
            "description": "远坂凛施放【第二魔法实验】后，每消耗1点【宝石能量】，使我方小队暴击伤害提高1.5%/2.0%/2.5%/3.0%，持续2回合。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "0%/30%/60%/90%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "100/160/220/280",
      "速度增幅": "0%/10%/20%/30%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.0,
        "frontStrength": 100.0,
        "backStrength": 100.0,
        "speedAmplification": 0.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.3,
        "frontStrength": 160.0,
        "backStrength": 160.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.6,
        "frontStrength": 220.0,
        "backStrength": 220.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.9,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1005",
    "name": "卡芙卡",
    "cost": 2,
    "traits": [
      "hunters",
      "dot"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "雷",
    "color": "#c49ce8",
    "image": "assets/characters/1005.png",
    "portrait": "assets/portraits/1005.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%8D%A1%E8%8A%99%E5%8D%A1#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "浓墨的夜",
        "description": "战技触发持续伤害的倍率提高，携带装备会使所有技能触发持续伤害的倍率额外提高。",
        "skills": [
          {
            "name": "必先利其器",
            "type": "天赋",
            "condition": "",
            "description": "每携带1件装备，卡芙卡战技、终结技和追加攻击使{所有持续伤害立即产生伤害的倍率提高原倍率的30%/40%/50%/60%。"
          },
          {
            "name": "月光摩挲连绵",
            "type": "战技",
            "condition": "",
            "description": "对指定敌方单体目标造成等同于卡芙卡140%攻击力的雷属性伤害，同时对其相邻目标造成等同于卡芙卡52%攻击力的雷属性伤害。若指定敌方单体或相邻目标处于持续伤害状态，其当前承受的所有持续伤害立即产生相当于原伤害85%/114%/142%/171%或57%/76%/95%/114%的伤害。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "浓墨的夜",
        "description": "施放战技和终结技触发敌人的持续伤害效果，携带装备会使所有技能触发持续伤害的倍率额外提高。",
        "skills": [
          {
            "name": "必先利其器",
            "type": "天赋",
            "condition": "",
            "description": "每携带1件装备，卡芙卡战技和终结技使所有持续伤害立即产生伤害的倍率提高原倍率的30%/40%/50%/60%。"
          },
          {
            "name": "月光摩挲连绵",
            "type": "战技",
            "condition": "行动时施放。卡芙卡以200%/250%/300%/300%的速度行动。",
            "description": "对指定敌方单体目标造成等同于卡芙卡160%攻击力的雷属性伤害，同时对其相邻目标造成等同于卡芙卡60%攻击力的雷属性伤害。若指定敌方单体或相邻目标处于持续伤害状态，其当前承受的所有持续伤害立即产生相当于原伤害90%/120%/150%/180%或60%/80%/100%/120%的伤害。"
          },
          {
            "name": "悲剧尽头的颤音",
            "type": "终结技",
            "condition": "满能量时施放。战技恢复30点能量。",
            "description": "对敌方全体造成等同于卡芙卡80%攻击力的雷属性伤害，有100%的基础概率使受到攻击的敌方目标陷入触电状态，并使其当前承受的持续伤害类负面状态立即产生相当于原伤害120%的伤害。触电状态持续2回合。触电状态下，敌方目标每回合开始时受到等同于卡芙卡290%攻击力的雷属性持续伤害。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "125/200/275/350",
      "基础后台强度": "125/200/275/350",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 125.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 200.0,
        "backStrength": 200.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 275.0,
        "backStrength": 275.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 350.0,
        "backStrength": 350.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1106",
    "name": "佩拉",
    "cost": 2,
    "traits": [
      "belobog",
      "debuff"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助",
      "输出"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/characters/1106.png",
    "portrait": "assets/portraits/1106.png",
    "expert": true,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E4%BD%A9%E6%8B%89#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "破甲弹头",
        "description": "行动时攻击敌人，施放终结技会降低敌人防御。",
        "skills": [
          {
            "name": "低温妨害",
            "type": "战技",
            "condition": "行动时施放。佩拉以200%/250%/300%/300%的速度行动。",
            "description": "行动时解除指定敌方单体的1个增益效果，同时造成等同于佩拉300%/375%/540%/840%攻击力的冰属性伤害。"
          },
          {
            "name": "领域压制",
            "type": "终结技",
            "condition": "满能量时施放。战技恢复30点能量，我方小队其他目标行动时若使敌方目标陷入了负面状态，则行动后佩拉恢复8点能量。",
            "description": "有100%的基础概率使敌方每个单体目标陷入【通解】状态，同时对敌方全体造成等同于佩拉200%/250%/360%/560%攻击力的冰属性伤害。【通解】状态下，敌方目标防御力降低30%/40%/50%/60%，持续2回合。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "125/200/275/350",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 100.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 160.0,
        "backStrength": 200.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 220.0,
        "backStrength": 275.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 280.0,
        "backStrength": 350.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1213",
    "name": "丹恒•饮月",
    "cost": 2,
    "traits": [
      "express",
      "luofu",
      "sp"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "虚数",
    "color": "#d8c496",
    "image": "assets/portraits/1213.png",
    "portrait": "assets/portraits/1213.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E4%B8%B9%E6%81%92%E2%80%A2%E9%A5%AE%E6%9C%88#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "苍龙战于深渊",
        "description": "队友消耗战技点后自身获得【逆鳞】，战技可以无上限消耗战技点进行强化。",
        "skills": [
          {
            "name": "龙有逆鳞",
            "type": "天赋",
            "condition": "",
            "description": "我方其他目标消耗战技点时，丹恒•饮月有12%/18%/24%/30%概率获得1个【逆鳞】。丹恒•饮月可以使用更多战技点强化普攻，并在超过3点后将普攻强化为对敌方全体造成伤害，且每额外消耗1点会使对主目标的伤害倍率提高90%/135%/180%/225%，对其他目标的伤害倍率提高45%/67%/90%/112%。丹恒•饮月施放终结技后额外获得1个【逆鳞】，【逆鳞】上限增加2个。"
          },
          {
            "name": "盘拏耀跃",
            "type": "普攻",
            "condition": "",
            "description": "消耗超过3个战技点后，施放7段攻击对指定敌方单体目标造成等同于丹恒•饮月600%攻击力的虚数属性伤害。从第4段攻击开始同时对其他所有目标造成等同于丹恒•饮月216%攻击力的虚数属性伤害。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "125/200/275/350",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 125.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 200.0,
        "backStrength": 0.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 275.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 350.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1222",
    "name": "灵砂",
    "cost": 2,
    "traits": [
      "wolfpack",
      "break",
      "heal"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "治疗",
    "tags": [
      "治疗",
      "输出"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1222.png",
    "portrait": "assets/portraits/1222.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%81%B5%E7%A0%82#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "浮元旌旗，蔽日遮天",
        "description": "战技和终结技可以召唤更多【浮元】，每只【浮元】提高我方小队的伤害增幅和伤害减免。【浮元】可自动治疗生命值较低的队员。",
        "skills": [
          {
            "name": "浮元一击，雷霆万钧",
            "type": "天赋",
            "condition": "",
            "description": "每有一只【浮元】，我方小队伤害增幅提高5%/6%/7%/8%，伤害减免提高5%/6%/7%/8%。敌方目标攻击后，若任意我方前台角色当前生命值百分比小于50%，则最多1/1/2/2只【浮元】立即行动，该效果每回合可以生效2次"
          },
          {
            "name": "烟斜雾横，氛氲化生",
            "type": "天赋",
            "condition": "",
            "description": "施放战技时召唤1只【浮元】，施放终结技时召唤1只【浮元】，上限3只。初始拥有150/200/300/400点速度以及2/3/4/4次行动次数。【浮元】行动时发动追加攻击，对敌方全体造成等同于灵砂87%/109%/157%/245%攻击力的火属性伤害。额外对随机敌方单体造成等同于灵砂87%/109%/157%/245%攻击力的火属性伤害，本次伤害优先选择韧性值大于0且有火属性弱点的目标。解除我方全体的2个负面效果，并回复等同于灵砂21.6%/32.4%/43.2%/43.2%攻击力+319/479/639/798的生命值。当次数为0或灵砂陷入无法战斗状态时【浮元】消失。【浮元】数量达到上限时，再次使用战技会刷新行动次数最少的1只【浮元】的行动次数。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "125/200/275/350",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "70/80/90/90",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 125.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 70.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 200.0,
        "backStrength": 0.0,
        "speedAmplification": 0.21,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 275.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 90.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 350.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 90.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1302",
    "name": "银枝",
    "cost": 2,
    "traits": [
      "wanderer",
      "aoe"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/portraits/1302.png",
    "portrait": "assets/portraits/1302.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%93%B6%E6%9E%9D#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "美美与共",
        "description": "命中目标后为我方小队叠加增益，两种终结技都会造成额外伤害。",
        "skills": [
          {
            "name": "驻于花庭，赐与尽美",
            "type": "终结技",
            "condition": "",
            "description": "消耗90点能量，对敌方全体目标造成等同于银枝144%/180%/259%/403%攻击力的物理属性伤害，场上每有1个可攻击的敌方目标，本次攻击的伤害倍率提高22%/28%/40%/63%。"
          },
          {
            "name": "驻「我」华庭，授予至勋",
            "type": "终结技",
            "condition": "",
            "description": "消耗180点能量，对敌方全体造成等同于银枝252%/315%/453%/705%攻击力的物理属性伤害，并额外造成6次伤害，每次伤害对敌方随机单体目标造成等同于银枝85%/106%/153%/239%攻击力的物理属性伤害。随后额外对生命值最高的敌方目标造成6次伤害。"
          },
          {
            "name": "崇高的客体",
            "type": "天赋",
            "condition": "",
            "description": "施放普攻、战技、终结技时，每击中1个敌方目标，为银枝恢复3点能量并使我方小队获得1层【升格】，使暴击率提高2.1%，攻击力提高4.2%/6.3%/8.5%/10.6%，该效果最多叠加10层。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "美美与共",
        "description": "行动时攻击敌人。施放终结技时，根据幸运一击率改为施放强化终结技。命中目标后为我方小队叠加增益。",
        "skills": [
          {
            "name": "公正，此处盛放",
            "type": "战技",
            "condition": "行动时施放。银枝以200%/250%/300%/350%的速度行动。",
            "description": "对敌方全体目标造成等同于银枝120%攻击力的物理属性伤害。"
          },
          {
            "name": "驻于花庭，赐与尽美",
            "type": "终结技",
            "condition": "满能量时施放。",
            "description": "对敌方全体目标造成等同于银枝120%攻击力的物理属性伤害。"
          },
          {
            "name": "驻「我」华庭，授予至勋",
            "type": "终结技",
            "condition": "施放【驻于花庭，赐与尽美】时，有幸运一击率*60%/80%/100%/100%的固定概率，改为施放强化终结技【驻「我」华庭，授予至勋】。",
            "description": "对敌方全体目标造成等同于银枝120%攻击力的物理属性伤害，并额外造成5次伤害，每次伤害对敌方随机单体目标造成等同于银枝100%攻击力的物理属性伤害。"
          },
          {
            "name": "崇高的客体",
            "type": "天赋",
            "condition": "",
            "description": "施放战技、终结技时，每击中1个敌方目标，为银枝恢复3点能量并使我方小队获得1层【升格】，使暴击率提高2.5%，攻击力提高5.0%/7.5%/10.0%/12.5%，该效果最多叠加10层。在敌方目标进入战斗时，自身立即恢复5点能量。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "125/200/275/350",
      "基础后台强度": "125/200/275/350",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 125.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 200.0,
        "backStrength": 200.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 275.0,
        "backStrength": 275.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 350.0,
        "backStrength": 350.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1303",
    "name": "阮•梅",
    "cost": 2,
    "traits": [
      "scholar",
      "break"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/portraits/1303.png",
    "portrait": "assets/portraits/1303.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%98%AE%E2%80%A2%E6%A2%85#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "残梅傲雪绽",
        "description": "终结技使我方小队全属性抗性穿透提高并在攻击后施加【残梅绽】，触发时可充能【击破】羁绊。我方小队伤害和击破效率提高。",
        "skills": [
          {
            "name": "慢捻抹复挑",
            "type": "战技",
            "condition": "战斗开始时施放。",
            "description": "使我方小队弱点击破效率提高50%，造成的伤害提高60%/75%/90%/105%，羁绊内队员造成的伤害提高双倍。"
          },
          {
            "name": "摇花缎水，沾衣不摘",
            "type": "终结技",
            "condition": "行动时施放。阮•梅以200%/250%/300%/300%的速度行动。",
            "description": "阮•梅展开结界，结界关闭前不会进入自己的回合且无法行动。处于结界中时我方小队全属性抗性穿透提高20.0%/25.0%/30.0%/35.0%，羁绊内队员提高双倍。且攻击后会对敌方目标施加【残梅绽】。【残梅绽】会在敌方目标尝试从弱点击破状态恢复时触发，延长目标的弱点击破状态并使其行动延后，延后数值等同于阮•梅20%的击破特攻+10%，并对其造成等同于阮•梅50%/100%/150%/200%冰属性击破伤害的击破伤害。【残梅绽】触发时，【击破】羁绊的【冲击波】会获得1点充能。敌方目标从弱点击破状态恢复前不可被再次附加【残梅绽】。行动序列上出现【绽放】倒计时，倒计时回合开始时阮梅关闭结界并恢复行动，倒计时固定拥有200点速度。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "125/200/275/350",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 100.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 160.0,
        "backStrength": 200.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 220.0,
        "backStrength": 275.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 280.0,
        "backStrength": 350.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1304",
    "name": "砂金",
    "cost": 2,
    "traits": [
      "ipc",
      "follow",
      "shield"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "护盾",
    "tags": [
      "护盾",
      "输出"
    ],
    "element": "虚数",
    "color": "#d8c496",
    "image": "assets/portraits/1304.png",
    "portrait": "assets/portraits/1304.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%A0%82%E9%87%91#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "博弈论",
        "description": "提供更多护盾并有机会获得额外的【盲注】。我方小队伤害提高。",
        "skills": [
          {
            "name": "金石存护",
            "type": "天赋",
            "condition": "",
            "description": "【坚垣筹码】可叠加的护盾量提高至不超过当前战技提供的护盾量的400%。我方目标每共计持有1000点护盾，砂金造成的追加攻击和终结技伤害提高15%/30%/45%/60%，最多300%/600%/900%/1200%。提供【坚垣筹码】时为每个目标随机计数1~6点，每个点数额外使目标获得的护盾量提高10%/15%/20%/25%，若为6点则砂金获得1点【盲注】。我方小队造成的伤害提高30%/45%/60%/75%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "125/200/275/350",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "65/85/105/105"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 125.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 65.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 200.0,
        "backStrength": 0.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 85.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 275.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 105.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 350.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 105.0
      }
    ]
  },
  {
    "id": "1306",
    "name": "花火",
    "cost": 2,
    "traits": [
      "festival",
      "quantum",
      "sp"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/portraits/1306.png",
    "portrait": "assets/portraits/1306.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E8%8A%B1%E7%81%AB#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "欺诈面具",
        "description": "战技点上限提高。终结技提高我方小队暴击伤害并恢复战技点，前台攻击或消耗战技点后为花火恢复能量。敌人受到的伤害提高。",
        "skills": [
          {
            "name": "一人千役",
            "type": "终结技",
            "condition": "满能量时施放。我方前台攻击后花火恢复5点能量。我方前台的回合内每消耗1个战技点，回合结束时花火恢复3点能量。",
            "description": "为我方恢复6/6/6/7个战技点，若恢复时战技点溢出，则记录溢出的战技点数，最多记录10点。我方小队回合结束后若战技点小于上限，花火消耗记录值为我方恢复战技点，直至恢复至上限。并使我方小队暴击伤害提高，提高数值等同于花火10.0%/12.0%/14.0%/16.0%暴击伤害+20.0%/26.0%/32.0%/38.0%+ 10.0%/13.0%/16.0%/19.0%*同频同频，羁绊内队员获得双倍暴击伤害提高，持续2回合。"
          },
          {
            "name": "虚构事实",
            "type": "天赋",
            "condition": "",
            "description": "我方战技点上限提高2/3/4/5点。敌方目标受到的伤害提高24%/32%/40%/48%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "125/200/275/350",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 100.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 160.0,
        "backStrength": 200.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 220.0,
        "backStrength": 275.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 280.0,
        "backStrength": 350.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1403",
    "name": "缇宝",
    "cost": 2,
    "traits": [
      "day",
      "aoe",
      "quantum"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助",
      "输出"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/portraits/1403.png",
    "portrait": "assets/portraits/1403.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BC%87%E5%AE%9D#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "一二三，火箭发射！",
        "description": "施放终结技和发动追加攻击后，缇宝的暴击伤害提高。",
        "skills": [
          {
            "name": "猜猜这里住着谁",
            "type": "终结技",
            "condition": "",
            "description": "开启结界，并对敌方全体造成等同于缇宝26%/32%/47%/73%生命上限的量子属性伤害。结界持续期间，敌方目标受到的伤害提高(30.0%/36.0%/42.0%/48.0%+10.0%/12.0%/14.0%/16.0%*同频同频)。受到我方目标攻击后，每有1名目标受到攻击，会对被攻击目标中当前生命值最高的目标造成1次等同于缇宝10.5%/13.1%/18.9%/29.4%生命上限的量子属性附加伤害。结界持续2回合，自身每回合开始时结界持续回合数减1。"
          },
          {
            "name": "收获满满元气",
            "type": "天赋",
            "condition": "",
            "description": "施放终结技和发动追加攻击后，缇宝的暴击伤害提高12%/24%/42%/60%，最多叠加10层。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "一二三，火箭发射！",
        "description": "战斗开始时立即施放终结技。我方小队每施放一定次数终结技后，缇宝发动追加攻击。",
        "skills": [
          {
            "name": "猜猜这里住着谁",
            "type": "终结技",
            "condition": "战斗开始时施放。",
            "description": "持续开启结界，并对敌方全体造成等同于缇宝30%/37%/54%/84%生命上限的量子属性伤害。结界持续期间，敌方目标受到的伤害提高(30.0%/36.0%/42.0%/48.0%+10.0%/12.0%/14.0%/16.0%*同频同频)。受到我方小队攻击后，每有1名目标受到攻击，会对被攻击目标中当前生命值最高的目标造成1次等同于缇宝12.0%/15.0%/21.6%/33.6%生命上限的量子属性附加伤害。"
          },
          {
            "name": "好忙好忙的缇宝",
            "type": "天赋",
            "condition": "",
            "description": "我方小队每施放2次终结技后，缇宝发动追加攻击，对敌方全体造成等同于缇宝18.0%/22.5%/32.4%/50.4%生命上限的量子属性伤害。我方小队全属性抗性穿透提高12%/15%/18%/21%，羁绊内队员获得双倍。缇宝造成的伤害提高216%/243%/270%/300%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "10%/32%/54%/76%",
      "基础前台强度": "125/175/225/275",
      "基础后台强度": "125/175/225/275",
      "速度增幅": "10%/21%/32%/44%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.1,
        "frontStrength": 125.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.32,
        "frontStrength": 175.0,
        "backStrength": 175.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.54,
        "frontStrength": 225.0,
        "backStrength": 225.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.76,
        "frontStrength": 275.0,
        "backStrength": 275.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1409",
    "name": "风堇",
    "cost": 2,
    "traits": [
      "day",
      "heal",
      "blood"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "治疗",
    "tags": [
      "治疗",
      "输出"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/portraits/1409.png",
    "portrait": "assets/portraits/1409.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%A3%8E%E5%A0%87#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "飞天神马小伊卡",
        "description": "小伊卡额外记录全队治疗量，并造成更多的伤害。",
        "skills": []
      }
    ],
    "referenceStarStats": {
      "生命增幅": "10%/32%/54%/76%",
      "基础前台强度": "125/175/225/275",
      "基础后台强度": "0/0/0/0",
      "速度增幅": "10%/21%/32%/44%",
      "基础治疗强度": "65/75/85/85",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.1,
        "frontStrength": 125.0,
        "backStrength": 0.0,
        "speedAmplification": 0.1,
        "healingStrength": 65.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.32,
        "frontStrength": 175.0,
        "backStrength": 0.0,
        "speedAmplification": 0.21,
        "healingStrength": 75.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.54,
        "frontStrength": 225.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 85.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.76,
        "frontStrength": 275.0,
        "backStrength": 0.0,
        "speedAmplification": 0.44,
        "healingStrength": 85.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1414",
    "name": "丹恒•腾荒",
    "cost": 2,
    "traits": [
      "night",
      "shield"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "护盾",
    "tags": [
      "护盾"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/portraits/1414.png",
    "portrait": "assets/portraits/1414.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E4%B8%B9%E6%81%92%E2%80%A2%E8%85%BE%E8%8D%92#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "龙灵在天",
        "description": "使队友获得【龙灵】，攻击力提高并为全体前台提供护盾，【龙灵】行动时也会提供护盾并攻击全体敌人。",
        "skills": [
          {
            "name": "渊渟岳峙，地载八荒",
            "type": "战技",
            "condition": "行动时施放。丹恒•腾荒以200%/250%/300%/300%的速度行动。",
            "description": "该技能自动选择目标施放。使指定我方单体前台角色成为【同袍】，成为【同袍】的目标攻击力提高，提高数值等同于丹恒•腾荒15%/20%/30%/40%攻击力，并为我方全体前台提供能够抵消等同于丹恒•腾荒44.0%/66.0%/88.0%/110.0%攻击力+600/900/1200/1500伤害的护盾，持续3回合。重复获得丹恒•腾荒的护盾时，护盾量可以叠加，最高不超过当前战技提供的护盾量的300%。【同袍】仅对丹恒•腾荒战技最新施放的目标生效。"
          },
          {
            "name": "生生之德，品物流形",
            "type": "天赋",
            "condition": "",
            "description": "我方目标成为【同袍】时，丹恒•腾荒会为其召唤【龙灵】，【龙灵】初始拥有220/280/340/400点速度。【龙灵】行动时，解除我方全体前台的1个负面效果，为我方全体前台提供能够抵消等同于丹恒•腾荒21.0%/31.5%/42.0%/52.5%攻击力+300/450/600/750伤害的护盾，持续3回合。丹恒•腾荒和【龙灵】的护盾量可以叠加，最高不超过丹恒•腾荒战技提供的护盾量的300%。并发动追加攻击，对敌方全体造成等同于丹恒•腾荒100%/200%/400%/600%攻击力的物理属性伤害和1次等同于【同袍】100.0%/200.0%/400.0%/600.0%攻击力的相应属性附加伤害。【同袍】陷入无法战斗状态时【龙灵】消失。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "100/160/220/280",
      "基础后台强度": "125/200/275/350",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "70/80/90/90"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 100.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 70.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 160.0,
        "backStrength": 200.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 80.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 220.0,
        "backStrength": 275.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 90.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 280.0,
        "backStrength": 350.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 90.0
      }
    ]
  },
  {
    "id": "1504",
    "name": "不死途",
    "cost": 2,
    "traits": [
      "ranger",
      "follow"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "雷",
    "color": "#c49ce8",
    "image": "assets/portraits/1504.png",
    "portrait": "assets/portraits/1504.png",
    "expert": false,
    "sourceVersion": "4.2",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E4%B8%8D%E6%AD%BB%E9%80%94#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "贪婪之手",
        "description": "可以按星级为前台【巡海游侠】提供羁绊的增益。",
        "skills": [
          {
            "name": "飨宴，自始无终",
            "type": "终结技",
            "condition": "",
            "description": "使指定敌方单体成为【饲饵】，对其造成等同于不死途350%/437%/630%/980%攻击力的雷属性伤害，随后立即对【饲饵】发动1次获得强化的天赋追加攻击，且不死途获得3点充能。强化天赋追加攻击不消耗充能，拥有【婪酣】时，每消耗4层【婪酣】可额外造成1次等同于不死途175%/218%/315%/490%攻击力的雷属性伤害，且本次追加攻击过程中对目标造成致命攻击时，会继续对新的【饲饵】造成伤害，直至【婪酣】小于4层。若当前场上的所有敌方目标都受到致命攻击后强化天赋追加攻击会立即结束。"
          },
          {
            "name": "宿怨，切齿奉还",
            "type": "天赋",
            "condition": "",
            "description": "不死途初始拥有2点充能，最多拥有3点充能。【饲饵】受到我方前台其他目标攻击后，不死途固定恢复8点能量，随后消耗1点充能对【饲饵】发动追加攻击，造成等同于不死途175%/218%/315%/490%攻击力的雷属性伤害，随后获得2层【婪酣】，最多叠加16层。我方小队其他目标消灭敌人或首领敌人转阶段时，不死途获得2层【婪酣】。"
          },
          {
            "name": "千万流星，汇聚一心",
            "type": "天赋",
            "condition": "",
            "description": "可以按星级为前台【巡海游侠】提供羁绊的伤害增幅和速度增幅效果。行迹【头狼】提供的暴击伤害提高效果可对我方小队生效。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "贪婪之手",
        "description": "行动时攻击敌人附加【饲饵】，我方攻击【饲饵】时不死途恢复能量。施放终结技后发动强化追击，并获得【充能】以发动追击。处于后台也可以获得【巡海游侠】按星级提供的羁绊增益。",
        "skills": [
          {
            "name": "鞭哨，逐尽恶兽",
            "type": "战技",
            "condition": "行动时施放。不死途以200%/250%/300%/300%的速度行动。",
            "description": "使指定敌方单体成为【饲饵】，对其造成等同于不死途200%/250%/360%/560%攻击力的雷属性伤害。若目标为【饲饵】，则额外对其造成等同于不死途100%/125%/180%/280%攻击力的雷属性伤害。当场上存在【饲饵】时，敌方全体防御力降低30%/40%/50%/60%。场上不存在【饲饵】时，不死途立即使当前场上生命值最低的敌方单体目标成为【饲饵】，【饲饵】状态仅对最新被施加的目标生效。"
          },
          {
            "name": "飨宴，自始无终",
            "type": "终结技",
            "condition": "满能量时施放。战技恢复20点能量，追加攻击恢复5点能量。",
            "description": "使指定敌方单体成为【饲饵】，对其造成等同于不死途400%/500%/720%/1120%攻击力的雷属性伤害，随后立即对【饲饵】发动1次获得强化的天赋追加攻击，且不死途获得3点充能。强化天赋追加攻击不消耗充能，拥有【婪酣】时，每消耗4层【婪酣】可额外造成1次等同于不死途240%/300%/432%/672%攻击力的雷属性伤害，且本次追加攻击过程中对目标造成致命攻击时，会继续对新的【饲饵】造成伤害，直至【婪酣】小于4层。若当前场上的所有敌方目标都受到致命攻击后强化天赋追加攻击会立即结束。"
          },
          {
            "name": "宿怨，切齿奉还",
            "type": "天赋",
            "condition": "",
            "description": "不死途初始拥有2点充能，最多拥有3点充能。【饲饵】受到我方前台目标攻击后，不死途固定恢复8点能量，随后消耗1点充能对【饲饵】发动追加攻击，造成等同于不死途240%/300%/432%/672%攻击力的雷属性伤害，随后获得2层【婪酣】，最多叠加16层。敌方目标被消灭或首领敌人转阶段时，不死途获得2层【婪酣】。不死途施放战技/终结技时，获得1/2层【婪酣】。"
          },
          {
            "name": "千万流星，汇聚一心",
            "type": "天赋",
            "condition": "",
            "description": "可以获得【巡海游侠】羁绊中所有后台【巡海游侠】为前台【巡海游侠】提供的伤害增幅和速度增幅效果。我方小队造成的暴击伤害提高40%/50%/60%/70%，我方小队追加攻击造成的暴击伤害额外提高80%/100%/120%/140%。不死途追加攻击造成的伤害提高80%/100%/120%/140%，且每有1层【婪酣】，造成的伤害额外提高10%/12%/15%/17%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "125/200/275/350",
      "基础后台强度": "125/200/275/350",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 125.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 200.0,
        "backStrength": 200.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 275.0,
        "backStrength": 275.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 350.0,
        "backStrength": 350.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1505",
    "name": "绯英",
    "cost": 2,
    "traits": [
      "wanderer",
      "elation"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/portraits/1505.png",
    "portrait": "assets/portraits/1505.png",
    "expert": false,
    "sourceVersion": "4.2",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BB%AF%E8%8B%B1#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "绯红踏英歌",
        "description": "施放终结技时获得【阿哈】的属性加成，并永久提高伤害增幅。",
        "skills": [
          {
            "name": "青春•韶华无限",
            "type": "天赋",
            "condition": "",
            "description": "绯英获得等同于暴击伤害20%的欢愉度。绯英获得能量时，将同步获得等值的【好活当赏】；绯英获得【好活当赏】时，将同步获得等值的能量，单次通过此方式计算的【好活当赏】不超过100点。累计获得240点能量时，消耗240点累计值，【狐狸老师】发动追加攻击对敌方全体造成等同于绯英87%/109%/157%/245%攻击力的物理属性伤害，为绯英恢复10点能量，单次获得能量时最多获得240点累计值。当绯英持有【好活当赏】时：；施放战技可对受到攻击的敌方目标造成14.0%/17.5%/25.2%/39.2%的物理属性欢愉伤害。施放终结技可对敌方全体造成21%/26%/37%/58%的物理属性欢愉伤害，并对终结技随机造成伤害的敌方目标造成24%/30%/44%/68%的物理属性欢愉伤害，终结技造成欢愉伤害时至少计入等同于能量上限的【好活当赏】。【狐狸老师】的追加攻击可对敌方全体造成25%/50%/75%/100%的物理属性欢愉伤害。通过行迹【瞰众乐】和【开不败】也可以从我方后台获得【好活当赏】。"
          },
          {
            "name": "狐面笑语",
            "type": "天赋",
            "condition": "",
            "description": "绯英施放欢愉技期间可以获得阿哈100%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。绯英施放终结技期间可以获得阿哈60%/70%/80%/90%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。"
          },
          {
            "name": "落英缤纷",
            "type": "天赋",
            "condition": "",
            "description": "绯英每次施放终结技后，伤害增幅永久提高2%，每场战斗最多提高20次。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "绯红踏英歌",
        "description": "绯英在我方获得【好活当赏】时，获得【好活当赏】和能量，施放终结技时额外获得【阿哈】的属性加成，并永久提高伤害增幅。",
        "skills": [
          {
            "name": "风纪•尺出缭判",
            "type": "战技",
            "condition": "行动时施放。绯英以200%/250%/300%/300%的速度行动。",
            "description": "对指定敌方单体造成等同于绯英400%/500%/720%/1120%攻击力的物理属性伤害，对相邻目标造成200%/250%/360%/560%的物理属性伤害，并额外获得5点笑点。"
          },
          {
            "name": "剑歌•神鬼无赦",
            "type": "终结技",
            "condition": "满能量时施放。战技恢复30点能量。",
            "description": "对敌方全体造成等同于绯英160%/200%/288%/448%攻击力的物理属性伤害，随后造成7次伤害，每次对随机的敌方目标造成等同于绯英120%/150%/216%/336%攻击力的物理属性伤害。"
          },
          {
            "name": "青春•韶华无限",
            "type": "天赋",
            "condition": "",
            "description": "绯英获得等同于暴击伤害20%的欢愉度。绯英获得能量时，将同步获得等值的【好活当赏】；绯英获得【好活当赏】时，将同步获得等值的能量，单次通过此方式计算的【好活当赏】不超过100点。累计获得240点能量时，消耗240点累计值，【狐狸老师】发动追加攻击对敌方全体造成等同于绯英100%/125%/180%/280%攻击力的物理属性伤害，为绯英恢复10/20/30/40点能量，单次获得能量时最多获得240点累计值。当绯英持有【好活当赏】时：；施放战技可对受到攻击的敌方目标造成19.0%/23.7%/34.2%/53.2%的物理属性欢愉伤害。施放终结技可对敌方全体造成28%/35%/50%/78%的物理属性欢愉伤害，并对终结技随机造成伤害的敌方目标造成33%/41%/59%/92%的物理属性欢愉伤害，终结技造成欢愉伤害时至少计入等同于能量上限的【好活当赏】。【狐狸老师】的追加攻击可对敌方全体造成30%/37%/54%/84%的物理属性欢愉伤害。当欢愉技的参演编号小于绯英的我方小队获得【好活当赏】时，绯英会将其中的50%变成自身的【好活当赏】。我方小队的【好活当赏】的时间耗尽时，绯英会将其中的50%变成自身的【好活当赏】。"
          },
          {
            "name": "绯色•不乐即斩",
            "type": "欢愉技",
            "condition": "",
            "description": "对敌方全体造成140%/175%/252%/392%的物理属性欢愉伤害并额外获得5点【好活当赏】。"
          },
          {
            "name": "狐面笑语",
            "type": "天赋",
            "condition": "",
            "description": "绯英施放欢愉技期间可以获得阿哈100%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。绯英施放终结技期间可以获得阿哈60%/70%/80%/90%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。"
          },
          {
            "name": "落英缤纷",
            "type": "天赋",
            "condition": "",
            "description": "绯英每次施放终结技后，伤害增幅永久提高2%，每场战斗最多提高20次。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "125/200/275/350",
      "基础后台强度": "125/200/275/350",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 125.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 200.0,
        "backStrength": 200.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 275.0,
        "backStrength": 275.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 350.0,
        "backStrength": 350.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1507",
    "name": "千冶•刃",
    "cost": 2,
    "traits": [
      "hunters",
      "blood",
      "debuff"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1507.png",
    "portrait": "assets/portraits/1507.png",
    "expert": false,
    "sourceVersion": "4.4",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%8D%83%E5%86%B6%E2%80%A2%E5%88%83#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "万般消磨，吾身为刃",
        "description": "进入战斗前为自己打造装备。\\n消耗生命值攻击敌人，施放终结技回复生命。展开结界削弱敌方并增益我方，全队攻击使千冶•刃额外施放战技。",
        "skills": [
          {
            "name": "刃下，归葬",
            "type": "战技",
            "condition": "行动时施放，消耗千冶•刃25%的最大生命值。千冶•刃以200%/250%/300%/300%的速度行动。",
            "description": "对敌方全体造成等同于千冶•刃80%/100%/144%/224%生命上限的火属性伤害，并额外造成4次伤害，每次伤害对敌方随机单体造成等同于千冶•刃30%/37%/54%/84%生命上限的火属性伤害。若当前生命值不足，施放战技时千冶•刃的当前生命值降低至1点。"
          },
          {
            "name": "骸骨当炉，血肉即薪",
            "type": "终结技",
            "condition": "战斗开始时施放。",
            "description": "使敌方全体陷入【煞火缠身】，【煞火缠身】状态下敌方目标的防御力降低30%，受到的伤害提高40%/50%/60%/70%。随后消耗等同于千冶•刃生命上限20%的生命值展开结界，结界持续期间，千冶•刃获得【无量忿怒】状态。【无量忿怒】状态下暴击率提高20%，暴击伤害提高60%/90%/120%/150%。若当前生命值不足，施放本技能时千冶•刃的当前生命值降低至1点。"
          },
          {
            "name": "千冶铸一，万劫烬灭",
            "type": "终结技",
            "condition": "生命值低于生命上限的5%时施放。",
            "description": "对敌方全体造成等同于千冶•刃400%/500%/720%/1120%生命上限的火属性伤害。回复自身全部生命值。"
          },
          {
            "name": "因果尽偿",
            "type": "天赋",
            "condition": "",
            "description": "结界持续期间，我方前台每次攻击敌方后，使对应敌方目标陷入【煞火缠身】状态并使千冶•刃获得1点充能，我方后台每次攻击敌方后，使对应敌方目标陷入【煞火缠身】状态，并且每攻击2次使千冶•刃获得1点充能。当充能达到9点时消耗9点，并使千冶•刃额外施放1次战技，本次战技不消耗生命值且视为追加攻击。结界持续期间，我方小队造成的伤害提高40%/50%/60%/70%，造成的终结技伤害提高60%/75%/90%/105%，千冶•刃造成的伤害额外提高60%/75%/90%/105%。"
          },
          {
            "name": "天工巧手",
            "type": "天赋",
            "condition": "",
            "description": "进入战斗前千冶•刃获得1件与其匹配的临时装备，临时装备在战斗结束后消失。若千冶•刃已经穿戴了3件装备，则随机将其中1件临时升级为特权装备，临时的特权装备在战斗结束后恢复为原本的装备。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "10%/32%/54%/76%",
      "基础前台强度": "100/140/180/220",
      "基础后台强度": "125/175/225/275",
      "速度增幅": "10%/21%/32%/44%",
      "基础治疗强度": "100/100/100/100",
      "基础护盾强度": "100/100/100/100"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.1,
        "frontStrength": 100.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 100.0,
        "shieldStrength": 100.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.32,
        "frontStrength": 140.0,
        "backStrength": 175.0,
        "speedAmplification": 0.21,
        "healingStrength": 100.0,
        "shieldStrength": 100.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.54,
        "frontStrength": 180.0,
        "backStrength": 225.0,
        "speedAmplification": 0.32,
        "healingStrength": 100.0,
        "shieldStrength": 100.0
      },
      {
        "stars": 4,
        "hpAmplification": 0.76,
        "frontStrength": 220.0,
        "backStrength": 275.0,
        "speedAmplification": 0.44,
        "healingStrength": 100.0,
        "shieldStrength": 100.0
      }
    ]
  },
  {
    "id": "1509",
    "name": "吉尔伽美什",
    "cost": 2,
    "traits": [
      "grail",
      "energy"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "雷",
    "color": "#c49ce8",
    "image": "assets/portraits/1509.png",
    "portrait": "assets/portraits/1509.png",
    "expert": false,
    "sourceVersion": "4.4",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%90%89%E5%B0%94%E4%BC%BD%E7%BE%8E%E4%BB%80#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "窃用宝物的贼人啊，本王准了！",
        "description": "根据小队装备数量，提高全体幸运一击伤害，自身获得更多。",
        "skills": [
          {
            "name": "王律键",
            "type": "天赋",
            "condition": "",
            "description": "全队每件装备给我方小队提供2%的幸运一击伤害，吉尔伽美什获得200%/300%/400%/500%的该效果增幅。进入战斗时，吉尔伽美什额外获得3/4/5/6点【兴致】。"
          },
          {
            "name": "「本王允许你进攻」",
            "type": "天赋",
            "condition": "",
            "description": "吉尔伽美什或Saber攻击时累计1点攻击计数，任意单位攻击后若累计攻击计数达到8，吉尔伽美什和Saber发动连携追加攻击，对敌方全体分别造成等同于吉尔伽美什350%/437%/630%/980%攻击力的雷属性伤害以及Saber525%/656%/945%/1470%攻击力的风属性伤害，随后吉尔伽美什获得3点【兴致】，Saber固定恢复120点能量并使自身下一次施放终结技时，造成的伤害为原伤害的180%/270%/360%/450%。施放连携追加攻击后清空累计攻击计数。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "窃用宝物的贼人啊，本王准了！",
        "description": "根据小队装备数量，提高全体幸运一击伤害，自身获得更多。基于小队行动进入强化状态，施放战技和终结技攻击敌方全体。",
        "skills": [
          {
            "name": "王之财宝",
            "type": "战技",
            "condition": "行动时施放。吉尔伽美什以200%/250%/300%/300%的速度行动。",
            "description": "获得【王来承认】，使自身造成伤害时无视目标30%的防御力，持续3回合。对指定敌方单体造成等同于吉尔伽美什300%/375%/540%/840%攻击力的雷属性伤害，对相邻目标造成等同于吉尔伽美什150%/187%/270%/420%攻击力的雷属性伤害。"
          },
          {
            "name": "天地乖离•开辟之星",
            "type": "终结技",
            "condition": "满能量时施放。普攻恢复20点能量。战技恢复30点能量。",
            "description": "对敌方全体造成等同于吉尔伽美什600%/750%/1080%/1680%攻击力的雷属性伤害。并额外造成10次伤害，每次对敌方随机单体造成等同于吉尔伽美什60%/75%/108%/168%攻击力的雷属性伤害。"
          },
          {
            "name": "王律键",
            "type": "天赋",
            "condition": "",
            "description": "全队每件装备给我方小队提供2%的幸运一击伤害，吉尔伽美什获得200%/300%/400%/500%的该效果增幅。进入战斗时，吉尔伽美什额外获得3/4/5/6点【兴致】。"
          },
          {
            "name": "漫不经心",
            "type": "普攻",
            "condition": "行动时施放。",
            "description": "对指定敌方单体造成等同于吉尔伽美什100%/125%/180%/280%攻击力的雷属性伤害。"
          },
          {
            "name": "「尽情取悦本王吧」",
            "type": "天赋",
            "condition": "",
            "description": "吉尔伽美什施放终结技时，获得2点【兴致】。我方小队其他队员施放终结技时，吉尔伽美什额外获得3点【兴致】，固定恢复等同于本次消耗能量值30%的能量，并获得【王来背负】，使自身造成的终结技伤害提高25%/30%/35%/40%，持续2回合。初始自身回合开始时自动施放普攻。我方小队其他队员行动时，吉尔伽美什获得1点【兴致】，每拥有1点【兴致】，使自身速度提高5%。当【兴致】首次达到10点时，进入【来兴致了！】状态，该状态下仅能施放战技，且持续整场战斗。施放战技后，清空自身【兴致】。本场战斗中，吉尔伽美什每获得1点【兴致】，暴击伤害提高20%/25%/30%/35%，该效果最多叠加6层。"
          },
          {
            "name": "「本王允许你进攻」",
            "type": "天赋",
            "condition": "",
            "description": "吉尔伽美什在场时，使我方小队成员攻击力提高30%，暴击伤害提高30%。若目标能量上限大于140，每超过1点能量上限使攻击力和暴击伤害额外提高1%，最多额外提高60%。Saber在场时，吉尔伽美什和Saber每累计施放8次攻击后，吉尔伽美什和Saber共同发动连携追加攻击，对敌方全体分别造成等同于吉尔伽美什600%/750%/1080%/1680%攻击力的雷属性伤害以及Saber900%/1125%/1620%/2520%攻击力的风属性伤害，随后吉尔伽美什获得3点【兴致】，Saber固定恢复120点能量并使自身下一次施放终结技时，造成的伤害为原伤害的200%/300%/400%/500%。施放连携追加攻击后清空累计攻击计数。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "15%/50%/84%/119%",
      "基础前台强度": "125/200/275/350",
      "基础后台强度": "125/200/275/350",
      "速度增幅": "10%/21%/32%/43%",
      "基础治疗强度": "60/60/60/60",
      "基础护盾强度": "60/60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.15,
        "frontStrength": 125.0,
        "backStrength": 125.0,
        "speedAmplification": 0.1,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.5,
        "frontStrength": 200.0,
        "backStrength": 200.0,
        "speedAmplification": 0.21,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.84,
        "frontStrength": 275.0,
        "backStrength": 275.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 4,
        "hpAmplification": 1.19,
        "frontStrength": 350.0,
        "backStrength": 350.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1003",
    "name": "姬子",
    "cost": 3,
    "traits": [
      "express",
      "break"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/characters/1003.png",
    "portrait": "assets/portraits/1003.png",
    "expert": true,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%A7%AC%E5%AD%90#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "天惊石破",
        "description": "战技攻击敌人并无视弱点削减韧性，敌人被击破后触发追击并使敌人受到的伤害提高。",
        "skills": [
          {
            "name": "乘胜追击",
            "type": "天赋",
            "condition": "",
            "description": "姬子的击破特攻提高100%/150%/250%。当有敌方目标的弱点被击破时，姬子获得充能。当我方小队施放攻击后，若姬子的充能达到3点则立即发动1次追加攻击，对敌方全体目标造成等同于姬子200%/250%/360%攻击力的火属性伤害，且使目标受到的伤害提高10%/15%/20%，持续2回合，并消耗3点充能。战斗开始时获得1点充能。"
          },
          {
            "name": "熔核爆裂",
            "type": "战技",
            "condition": "行动时施放。姬子以200%/250%/300%的速度行动。",
            "description": "对指定敌方单体目标造成等同于姬子320%/400%/576%攻击力的火属性伤害，同时对其相邻目标造成等同于姬子160%/200%/288%攻击力的火属性伤害，并无视弱点属性削减敌方韧性，击破弱点时，触发火属性的弱点击破效果。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "150/240/330",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 100.0,
        "backStrength": 150.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 160.0,
        "backStrength": 240.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 220.0,
        "backStrength": 330.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1014",
    "name": "Saber",
    "cost": 3,
    "traits": [
      "grail",
      "energy"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/portraits/1014.png",
    "portrait": "assets/portraits/1014.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/Saber#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "理想乡",
        "description": "我方小队其他目标施放终结技后，使Saber的终结技能弹射更多次数。",
        "skills": [
          {
            "name": "王之心",
            "type": "天赋",
            "condition": "",
            "description": "我方小队其他目标施放终结技后，Saber的终结技对随机敌方单体目标造成伤害的次数提高1/2/3次，最多提高4/8/12次。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "理想乡",
        "description": "我方小队其他目标施放终结技后，Saber叠加【炉心共鸣】并使终结技弹射次数提高，行动时基于其层数恢复能量。",
        "skills": [
          {
            "name": "誓约胜利之剑",
            "type": "终结技",
            "condition": "满能量时施放。每移除1层【炉心共鸣】，Saber恢复10点能量。",
            "description": "对敌方全体目标造成等同于Saber360%/450%/648%攻击力的风属性伤害。并额外造成10次伤害，每次伤害对随机敌方单体目标造成等同于Saber140%/175%/252%攻击力的风属性伤害。"
          },
          {
            "name": "解放的金色王权",
            "type": "普攻",
            "condition": "行动时施放。Saber以200%/250%/300%的速度行动。",
            "description": "对敌方全体目标造成等同于Saber200%/250%/360%攻击力的风属性伤害，若施放时敌方目标数量为2/1，额外对敌方全体目标造成等同于Saber200%/250%/360%/300%/375%/540%攻击力的风属性伤害，并移除所有【炉心共鸣】。"
          },
          {
            "name": "王之心",
            "type": "天赋",
            "condition": "",
            "description": "我方小队其他目标施放终结技后，Saber获得5/6/7层【炉心共鸣】，并使终结技对随机敌方单体造成伤害的次数提高1次，最多提高4/6/8次。Saber的暴击伤害提高88%/100%/120%。Saber可积攒最多120点溢出能量，施放终结技后清空并恢复相应的能量值。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "150/240/330",
      "基础后台强度": "150/240/330",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 150.0,
        "backStrength": 150.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 240.0,
        "backStrength": 240.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 330.0,
        "backStrength": 330.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1102",
    "name": "希儿",
    "cost": 3,
    "traits": [
      "belobog",
      "quantum"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/characters/1102.png",
    "portrait": "assets/portraits/1102.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%B8%8C%E5%84%BF#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "弱者斩杀",
        "description": "希儿的战技和终结技倍率提高，并可以处决低生命值的敌人。",
        "skills": [
          {
            "name": "归刃",
            "type": "战技",
            "condition": "",
            "description": "使希儿的速度提高25%，并对指定敌方单体目标造成等同于希儿360%攻击力的量子属性伤害，速度提高效果持续3回合。任意我方目标攻击后，若被攻击后的敌方目标生命值小于等于70%，则希儿自动对其施放1次战技，额外战技不消耗战技点且不恢复能量，该效果每个回合最多触发一次。"
          },
          {
            "name": "再现",
            "type": "天赋",
            "condition": "",
            "description": "希儿攻击敌人期间，若目标被消灭则立即获得1个额外回合并进入增幅状态，增幅状态下希儿施放攻击造成的伤害提高80%，持续3回合。若希儿在因天赋【再现】获得的额外回合中消灭敌方目标，此天赋不会生效。"
          },
          {
            "name": "迸发",
            "type": "天赋",
            "condition": "",
            "description": "希儿战技的伤害倍率提高120%/240%/600%，终结技的伤害倍率提高240%/480%/1200%。"
          },
          {
            "name": "斩决",
            "type": "天赋",
            "condition": "",
            "description": "希儿攻击敌方目标后，若敌方目标当前生命值低于生命上限的（9%/12%/15%+同频同频*3%/4%/5%），希儿对其造成等同于其当前生命值的固定数值的量子属性附加伤害。每次攻击内对每名敌方目标最多触发1次该效果。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "150/240/330",
      "基础后台强度": "0/0/0",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 150.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 240.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 330.0,
        "backStrength": 0.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1105",
    "name": "娜塔莎",
    "cost": 3,
    "traits": [
      "belobog",
      "heal"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "治疗",
    "tags": [
      "治疗"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/characters/1105.png",
    "portrait": "assets/portraits/1105.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%A8%9C%E5%A1%94%E8%8E%8E#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "爱的礼物",
        "description": "终结技会使目标获得【礼物】，造成的伤害提高并每回合回复生命值。",
        "skills": [
          {
            "name": "新生之礼",
            "type": "终结技",
            "condition": "",
            "description": "立即为我方全体前台目标回复等同于娜塔莎10.5%/12.2%/15.7%生命上限+210/245/315的生命值。对所有目标提供1~3个【礼物】：每层使造成的伤害提高20%/30%/40%，持续2回合，最多叠加5层，并在行动时回复等同于娜塔莎5.2%/6.1%/7.8%生命上限+105/122/157的生命值。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "爱的礼物",
        "description": "敌人攻击后娜塔莎恢复能量。终结技会使目标获得【礼物】，造成的伤害提高并每回合回复生命值。",
        "skills": [
          {
            "name": "新生之礼",
            "type": "终结技",
            "condition": "满能量时施放。敌人攻击后，娜塔莎恢复15(+5)点能量。",
            "description": "立即为我方全体前台目标回复等同于娜塔莎12.0%/14.0%/18.0%生命上限+240/280/360的生命值。并送出1~3个【礼物】，每层使造成的伤害提高20%/30%/40%，持续2回合，最多5层，并在行动时恢复娜塔莎6.0%/7.0%/9.0%生命上限+120/140/180的生命值。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "20%/44%/68%",
      "基础前台强度": "150/195/240",
      "基础后台强度": "150/195/240",
      "速度增幅": "20%/32%/43%",
      "基础治疗强度": "60/70/80",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.2,
        "frontStrength": 150.0,
        "backStrength": 150.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.44,
        "frontStrength": 195.0,
        "backStrength": 195.0,
        "speedAmplification": 0.32,
        "healingStrength": 70.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.68,
        "frontStrength": 240.0,
        "backStrength": 240.0,
        "speedAmplification": 0.43,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1212",
    "name": "镜流",
    "cost": 3,
    "traits": [
      "wolfpack",
      "blood"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/portraits/1212.png",
    "portrait": "assets/portraits/1212.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%95%9C%E6%B5%81#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "冷月寒光",
        "description": "消耗自身和全体前台目标的生命值攻击敌人，提高我方小队暴击伤害，生命值较低时施放终结技攻击敌人会回复生命值。",
        "skills": [
          {
            "name": "寒川映月",
            "type": "战技",
            "condition": "行动时施放。镜流以200%/250%/300%的速度行动。",
            "description": "消耗自身生命上限33%的生命值，使我方小队暴击伤害提高60%/80%/100%，持续3回合，我方小队中每有一个【燃血】羁绊内成员消耗全体前台目标生命上限2%的生命值。对指定敌方单体目标造成等同于镜流240%/300%/432%生命上限的冰属性伤害，并对其相邻目标造成等同于镜流120%/150%/216%生命上限的冰属性伤害。"
          },
          {
            "name": "昙华生灭，天河泻梦",
            "type": "终结技",
            "condition": "生命值低于生命上限的5%时施放。",
            "description": "对指定敌方单体目标造成等同于镜流600%/750%/1080%生命上限的冰属性伤害，并对其相邻目标造成等同于镜流300%/375%/540%生命上限的冰属性伤害。并使自身回复生命上限100%的生命值。"
          },
          {
            "name": "冰魄凝霜雪",
            "type": "天赋",
            "condition": "",
            "description": "每场战斗中，镜流首次行动时进入【冰魄】状态并在本场战斗中始终处于该状态，暴击率提高50%，暴击伤害提高220%/260%/300%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "20%/44%/68%",
      "基础前台强度": "100/140/180",
      "基础后台强度": "150/210/270",
      "速度增幅": "20%/32%/43%",
      "基础治疗强度": "80/80/80",
      "基础护盾强度": "80/80/80"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.2,
        "frontStrength": 100.0,
        "backStrength": 150.0,
        "speedAmplification": 0.2,
        "healingStrength": 80.0,
        "shieldStrength": 80.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.44,
        "frontStrength": 140.0,
        "backStrength": 210.0,
        "speedAmplification": 0.32,
        "healingStrength": 80.0,
        "shieldStrength": 80.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.68,
        "frontStrength": 180.0,
        "backStrength": 270.0,
        "speedAmplification": 0.43,
        "healingStrength": 80.0,
        "shieldStrength": 80.0
      }
    ]
  },
  {
    "id": "1225",
    "name": "忘归人",
    "cost": 3,
    "traits": [
      "luofu",
      "break"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助",
      "输出"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1225.png",
    "portrait": "assets/portraits/1225.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%BF%98%E5%BD%92%E4%BA%BA#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "燎火惊鸿舞",
        "description": "我方可无视属性削韧、多次造成击破伤害。敌人韧性降低后忘归人恢复能量，终结技攻击敌人可叠加易伤。",
        "skills": [
          {
            "name": "阳极照世，离火满缀",
            "type": "终结技",
            "condition": "满能量时施放。敌方目标韧性值累计降低10点后，恢复5点能量。",
            "description": "对敌方全体造成等同于忘归人200%/300%/400%攻击力的火属性伤害，并使所有敌方目标受到的伤害增加35%/45%/60%，持续2回合。本次攻击无视弱点属性削减敌方全体目标的韧性，击破弱点时，触发火属性的弱点击破效果。"
          },
          {
            "name": "善盈后福，德气流布",
            "type": "天赋",
            "condition": "",
            "description": "敌方目标会被额外附上等同于自身韧性上限50%的【云火昭】。我方攻击处于弱点击破状态的敌方目标后，会将本次攻击的削韧值转化为1次100%/160%/240%的超击破伤害。且我方小队的攻击无视弱点属性削减敌方的韧性，削韧值为弱点属性削韧值的50%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "150/240/330",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 100.0,
        "backStrength": 150.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 160.0,
        "backStrength": 240.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 220.0,
        "backStrength": 330.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1305",
    "name": "真理医生",
    "cost": 3,
    "traits": [
      "scholar",
      "wanderer",
      "follow"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "虚数",
    "color": "#d8c496",
    "image": "assets/portraits/1305.png",
    "portrait": "assets/portraits/1305.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%9C%9F%E7%90%86%E5%8C%BB%E7%94%9F#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "饱和式提问",
        "description": "施放战技可以使敌人易伤，并触发多次追加攻击。",
        "skills": [
          {
            "name": "我思故我在",
            "type": "天赋",
            "condition": "",
            "description": "对敌方目标施放战技时，使目标受到的伤害提高25%/35%/50%，持续2回合，并且有60%/120%/180%的固定概率对该目标发动1次追加攻击，造成等同于真理医生420%/525%/756%攻击力的虚数属性伤害。目标每有1个负面效果，追加攻击发动的固定概率提高40%，固定概率上限提高至180%/240%/300%，每超出100%的发动率能额外发动1次追加攻击。若追加攻击施放前目标被消灭则对敌方随机单体发动追加攻击。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "150/240/330",
      "基础后台强度": "0/0/0",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 150.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 240.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 330.0,
        "backStrength": 0.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1308",
    "name": "黄泉",
    "cost": 3,
    "traits": [
      "ranger",
      "debuff"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "雷",
    "color": "#c49ce8",
    "image": "assets/portraits/1308.png",
    "portrait": "assets/portraits/1308.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%BB%84%E6%B3%89#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "飞雷紫",
        "description": "对陷入负面状态的敌人额外施加标记，终结技消耗标记额外造成伤害。",
        "skills": [
          {
            "name": "紫电断空",
            "type": "天赋",
            "condition": "",
            "description": "敌方目标陷入负面状态时，同时陷入1层【飞雷紫】，每个目标最多持有9个【飞雷紫】。黄泉施放终结技进行攻击时会移除目标持有的【飞雷紫】，每层【飞雷紫】对目标造成等同于黄泉30%/45%/75%攻击力的雷属性伤害。终结技期间无法为敌方附上【飞雷紫】。行迹【奈落】所需要的「虚无」命途角色也会计算后台角色。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "150/240/330",
      "基础后台强度": "0/0/0",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 150.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 240.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 330.0,
        "backStrength": 0.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1313",
    "name": "星期日",
    "cost": 3,
    "traits": [
      "express",
      "festival",
      "energy"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助"
    ],
    "element": "虚数",
    "color": "#d8c496",
    "image": "assets/portraits/1313.png",
    "portrait": "assets/portraits/1313.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%98%9F%E6%9C%9F%E6%97%A5#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "福泽亲吻的大地",
        "description": "为全体前台恢复能量，额外使后台1号位角色恢复能量且成为【蒙福者】，全体后台造成的伤害提高。",
        "skills": [
          {
            "name": "光与我等同在",
            "type": "天赋",
            "condition": "",
            "description": "星期日施放终结技后，后台1号位角色也会成为【蒙福者】，并为其恢复与终结技相同数值能量上限的能量，以及提高暴击伤害。当场上存在【蒙福者】时，后台角色造成的伤害提高20%/40%/80%，羁绊内队员获得双倍伤害提高效果。"
          },
          {
            "name": "轻与伤痕的赞颂",
            "type": "终结技",
            "condition": "",
            "description": "为指定我方目标恢复等同于20.0%能量上限的能量，并使目标及其召唤物成为【蒙福者】，【蒙福者】的暴击伤害提高，提高数值等同于星期日25.5%/34.0%/42.5%暴击伤害+11.0%/15.0%/19.0%。同时为其他我方前台角色恢复10.0%能量上限的能量。星期日自身每回合开始时【蒙福者】状态持续回合减1，共持续3回合。且仅对除星期日自身外终结技最新的施放目标生效。当星期日陷入无法战斗状态时，【蒙福者】效果也会被解除。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "福泽亲吻的大地",
        "description": "行动时，使前台单体立即行动。为全体前台和后台1号位恢复能量，额外使后台1号位成为【蒙福者】，并使全体后台造成的伤害提高。",
        "skills": [
          {
            "name": "光与我等同在",
            "type": "天赋",
            "condition": "",
            "description": "星期日施放终结技后，后台1号位角色也会成为【蒙福者】，并为其恢复与终结技相同数值能量上限的能量，以及提高暴击伤害。当场上存在【蒙福者】时，后台角色造成的伤害提高30%/45%/60%，羁绊内队员获得双倍伤害提高效果。"
          },
          {
            "name": "倾诉之肉身",
            "type": "天赋",
            "condition": "",
            "description": "施放战技时，使目标的暴击率提高20.0%，持续3回合，并解除目标的1个负面效果。施放终结技时，若为目标恢复的能量不足40点，恢复的能量提高至40点。"
          },
          {
            "name": "纸与仪典的恩赐",
            "type": "战技",
            "condition": "行动时施放。星期日以100%/125%/150%的速度行动。",
            "description": "使我方单体角色及其召唤物立即行动，并使其造成的伤害提高30%，若目标拥有召唤物，则造成的伤害提高效果额外提高50%，持续2回合。对【蒙福者】施放战技后恢复1个战技点。当星期日对「同谐」命途的角色施放该技能时，无法触发立即行动效果。"
          },
          {
            "name": "轻与伤痕的赞颂",
            "type": "终结技",
            "condition": "满能量时施放。战技恢复30点能量。",
            "description": "为指定我方前台角色恢复等同于20.0%能量上限的能量，并使目标及其召唤物成为【蒙福者】，【蒙福者】的暴击伤害提高，提高数值等同于星期日30.0%/40.0%/50.0%暴击伤害+12.0%/16.0%/20.0%。同时为其他我方前台角色恢复10.0%能量上限的能量。星期日自身每回合开始时【蒙福者】状态持续回合减1，共持续3回合。且仅对终结技最新的施放目标生效。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "150/240/330",
      "基础后台强度": "150/240/330",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 150.0,
        "backStrength": 150.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 240.0,
        "backStrength": 240.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 330.0,
        "backStrength": 330.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1405",
    "name": "那刻夏",
    "cost": 3,
    "traits": [
      "day",
      "aoe"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/portraits/1405.png",
    "portrait": "assets/portraits/1405.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%82%A3%E5%88%BB%E5%A4%8F#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "研究的力量",
        "description": "行动时施放战技攻击敌人。那刻夏的暴击伤害提高，我方小队造成的伤害提高。",
        "skills": [
          {
            "name": "分形，驱逐虚知",
            "type": "战技",
            "condition": "行动时施放。那刻夏以200%/250%/300%的速度行动。",
            "description": "造成等同于那刻夏140%/175%/252%攻击力的风属性伤害，并额外造成4/5/6次伤害。每次伤害对敌方随机单体目标造成等同于那刻夏140%/175%/252%攻击力的风属性伤害，优先弹射本次战技尚未击中过的敌方目标。施放时场上每有1个可攻击的敌方目标，本次战技造成的伤害提高20%。"
          },
          {
            "name": "四分明哲，三重至高",
            "type": "天赋",
            "condition": "",
            "description": "每当那刻夏击中1次敌方目标后，为目标添加1个随机属性弱点，持续3回合，优先添加目标尚未拥有的弱点。那刻夏在场时，使拥有至少5个不同属性弱点的敌方目标陷入【质性揭露】状态。那刻夏对处于【质性揭露】状态的目标造成的伤害提高30%/45%/60%，此外对其施放普攻或战技后，对该目标额外施放1次战技。额外战技不消耗战技点且不会再次触发此效果。若额外战技施放前目标被消灭则对敌方随机单体施放。"
          },
          {
            "name": "启智讲堂",
            "type": "天赋",
            "condition": "",
            "description": "那刻夏的暴击伤害提高140%/180%/240%。我方小队造成的伤害提高25%/30%/40%，羁绊内队员获得双倍。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "150/240/330",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 100.0,
        "backStrength": 150.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 160.0,
        "backStrength": 240.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 220.0,
        "backStrength": 330.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1408",
    "name": "白厄",
    "cost": 3,
    "traits": [
      "savior"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/portraits/1408.png",
    "portrait": "assets/portraits/1408.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%99%BD%E5%8E%84#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "我独自战斗",
        "description": "获得前台队友的羁绊效果和属性，前台角色星级越高自身前台强度越高。",
        "skills": [
          {
            "name": "背负希望",
            "type": "天赋",
            "condition": "",
            "description": "战斗开始时，获得4点【火种】。变身期间，使卡厄斯兰那的额外回合的速度基于自身的速度增幅提高。其他我方前台角色的每个星级使白厄的前台强度提高40%/80%/120%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "150/240/330",
      "基础后台强度": "0/0/0",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "80/80/80",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 150.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 240.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 330.0,
        "backStrength": 0.0,
        "speedAmplification": 0.44,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1412",
    "name": "刻律德菈",
    "cost": 3,
    "traits": [
      "night",
      "sp"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/portraits/1412.png",
    "portrait": "assets/portraits/1412.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%88%BB%E5%BE%8B%E5%BE%B7%E8%8F%88#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "我来，我见，我征服！",
        "description": "回合开始时恢复战技点，复制角色战技并额外施放的效率提高，可复制【战技点】羁绊内原有队员的普攻。",
        "skills": [
          {
            "name": "升变，士皆可帅",
            "type": "战技",
            "condition": "",
            "description": "使指定我方单体角色获得【军功】并使刻律德菈获得1点充能。充能上限10点。若目标已持有【军功】，则额外为刻律德菈充能1/2/3点。当充能达到6点时，自动使角色的【军功】升级为【爵位】并解除其控制类负面状态。持有【爵位】的角色被视为同时持有【军功】。持有【爵位】的角色造成的战技伤害的暴击伤害提高63%/84%/105%、全属性抗性穿透提高9.5%，对敌方目标施放战技时触发奇袭。奇袭结束后，消耗6点充能使【爵位】变回【军功】。"
          },
          {
            "name": "君主威严",
            "type": "天赋",
            "condition": "",
            "description": "刻律德菈的回合开始时恢复1/1/2个战技点。【战技点】羁绊内原有队员持有【爵位】时，对敌方目标施放普攻也可触发奇袭。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "我来，我见，我征服！",
        "description": "行动后恢复战技点，强化前台单体角色并复制其战技以额外施放，可复制【战技点】羁绊内原有队员的普攻。",
        "skills": [
          {
            "name": "升变，士皆可帅",
            "type": "战技",
            "condition": "行动时施放，刻律德菈以200%/250%/300%的速度行动。",
            "description": "该技能自动选择目标施放。使指定我方单体前台角色获得【军功】并使刻律德菈获得1点充能。充能上限10点。若目标已持有【军功】，则额外为刻律德菈充能1/2/3点。当充能达到6点时，自动使角色的【军功】升级为【爵位】并解除其控制类负面状态。持有【爵位】的角色被视为同时持有【军功】。持有【爵位】的角色造成的战技伤害的暴击伤害提高72%/96%/120%、全属性抗性穿透提高10.0%，对敌方目标施放战技时触发奇袭。奇袭结束后，消耗6点充能使【爵位】变回【军功】。"
          },
          {
            "name": "荣光属于凯撒",
            "type": "天赋",
            "condition": "",
            "description": "持有【军功】的角色攻击力提高，提高数值等同于刻律德菈攻击力的18.0%/24.0%/30.0%，施放普攻或战技时使刻律德菈获得1点充能，奇袭期间无法使刻律德菈获得充能。持有【军功】的角色施放攻击后刻律德菈额外造成1次等同于刻律德菈120%/180%/360%攻击力的风属性附加伤害。【军功】仅对最新被施加的目标生效，目标改变时使刻律德菈充能重置为0点。"
          },
          {
            "name": "君主威严",
            "type": "天赋",
            "condition": "",
            "description": "刻律德菈的暴击率提高100%，暴击伤害提高360%/400%/440%，行动后恢复1/2/4个战技点。【战技点】羁绊内原有队员持有【爵位】时，对敌方目标施放普攻也可触发奇袭。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "150/240/330",
      "基础后台强度": "150/240/330",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 150.0,
        "backStrength": 150.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 240.0,
        "backStrength": 240.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 330.0,
        "backStrength": 330.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1506",
    "name": "银狼LV.999",
    "cost": 3,
    "costVariants": [
      3,
      4,
      5
    ],
    "costNote": "头号玩家关联可变费用；基础费用采用3，进阶形态见原版资料。",
    "traits": [
      "hunters",
      "elation",
      "gamer"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "虚数",
    "color": "#d8c496",
    "image": "assets/portraits/1506.png",
    "portrait": "assets/portraits/1506.png",
    "expert": false,
    "sourceVersion": "4.2",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%93%B6%E7%8B%BCLV.999#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "键盘攻击",
        "description": "【隐藏分】档位上限额外提高1阶，普攻获得【阿哈】的属性加成。",
        "skills": [
          {
            "name": "骇客笑语",
            "type": "天赋",
            "condition": "",
            "description": "银狼LV.999施放欢愉技期间可以获得阿哈100%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。银狼LV.999施放普通攻击期间可以获得阿哈60%/70%/80%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。"
          },
          {
            "name": "隐藏关卡",
            "type": "天赋",
            "condition": "",
            "description": "【隐藏分】在变身期间达到180点后，银狼的伤害增幅提高40%。进入战斗时获得20/40/60点【隐藏分】。"
          }
        ]
      },
      {
        "zone": "4费",
        "name": "键盘攻击",
        "description": "【隐藏分】档位上限额外提高2阶，普攻获得【阿哈】的属性加成。",
        "skills": [
          {
            "name": "骇客笑语",
            "type": "天赋",
            "condition": "",
            "description": "银狼LV.999施放欢愉技期间可以获得阿哈100%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。银狼LV.999施放普通攻击期间可以获得阿哈60%/70%/80%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。"
          },
          {
            "name": "隐藏关卡",
            "type": "天赋",
            "condition": "",
            "description": "【隐藏分】在变身期间达到180/240点后，银狼的伤害增幅提高40%/80%。进入战斗时获得40/40/60点【隐藏分】。"
          }
        ]
      },
      {
        "zone": "front",
        "name": "键盘攻击",
        "description": "【隐藏分】档位上限额外提高3阶，普攻获得【阿哈】的属性加成。",
        "skills": [
          {
            "name": "骇客笑语",
            "type": "天赋",
            "condition": "",
            "description": "银狼LV.999施放欢愉技期间可以获得阿哈100%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。银狼LV.999施放普通攻击期间可以获得阿哈60%/70%/99%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。"
          },
          {
            "name": "隐藏关卡",
            "type": "天赋",
            "condition": "",
            "description": "【隐藏分】在变身期间达到180/240/300点后，银狼的伤害增幅提高40%/80%/120%/100%/200%/300%。进入战斗时获得60/60/120点【隐藏分】。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "150/240/330",
      "基础后台强度": "0/0/0",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 150.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 240.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 330.0,
        "backStrength": 0.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1510",
    "name": "姬子•启行",
    "cost": 3,
    "traits": [
      "express",
      "navigator"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1510.png",
    "portrait": "assets/portraits/1510.png",
    "expert": false,
    "sourceVersion": "4.4",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%A7%AC%E5%AD%90%E2%80%A2%E5%90%AF%E8%A1%8C#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "领航的星炬",
        "description": "选择伙伴并强化【列车同行】羁绊效果，后台角色也可以施放助战技。姬子•启行在升星时，获得更多的基础前台强度。",
        "skills": [
          {
            "name": "升起领航的烽火",
            "type": "战技",
            "condition": "",
            "description": "施放战技后立即恢复所有助战技施放次数，姬子•启行获得【领航旗语】，持续3回合，姬子•启行每回合开始时持续回合数减1。当姬子•启行拥有【领航旗语】时，我方小队造成的伤害提高100%/150%/200%，姬子•启行造成的伤害额外提高100%/150%/200%。每个回合开始时，立即恢复1次助战技施放次数。"
          },
          {
            "name": "银轨同行",
            "type": "天赋",
            "condition": "",
            "description": "后台开拓同行角色也可以在行动时施放助战技。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/69%/108%",
      "基础前台强度": "150/300/600",
      "基础后台强度": "0/0/0",
      "速度增幅": "20%/32%/44%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 150.0,
        "backStrength": 0.0,
        "speedAmplification": 0.2,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.69,
        "frontStrength": 300.0,
        "backStrength": 0.0,
        "speedAmplification": 0.32,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.08,
        "frontStrength": 600.0,
        "backStrength": 0.0,
        "speedAmplification": 0.44,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1006",
    "name": "银狼",
    "cost": 4,
    "traits": [
      "hunters",
      "quantum"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助",
      "输出"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/characters/1006.png",
    "portrait": "assets/portraits/1006.png",
    "expert": true,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%93%B6%E7%8B%BC#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "全域封禁",
        "description": "战技强化为攻击敌方全体目标，且每层【缺陷】都会使敌人受到的伤害提高。",
        "skills": [
          {
            "name": "是否允许更改？",
            "type": "战技",
            "condition": "",
            "description": "有110%的基础概率为敌方全体目标添加1个场上我方目标持有属性的弱点（优先添加我方编队中的第一位角色持有属性的弱点），且该弱点对应属性的抗性降低20%，持续3回合。若添加的是敌方目标原有属性的弱点，则不会触发对应属性的抗性降低效果。单个敌方目标仅能被银狼添加1个弱点，当银狼对其再次添加弱点时，仅保留最新添加的弱点。有100%的基础概率额外使该目标的全属性抗性降低12.3%/16.5%/27.5%，持续2回合。对敌方全体目标造成等同于银狼262%/328%/472%攻击力的量子属性伤害。"
          },
          {
            "name": "算法漏洞",
            "type": "天赋",
            "condition": "",
            "description": "植入【缺陷】时会额外植入【致命缺陷】，每层使敌方目标受到的伤害提高(3%/6%/9%+1%/2%/3%*同频同频)。当【缺陷】移除时，【致命缺陷】效果也会被移除。"
          }
        ]
      },
      {
        "zone": "back",
        "name": "全域封禁",
        "description": "敌人防御力降低，银狼行动时攻击敌方全体并添加弱点和【缺陷】。每层【缺陷】都会使敌人受到的伤害提高。",
        "skills": [
          {
            "name": "是否允许更改？",
            "type": "战技",
            "condition": "行动时施放。银狼以200%/250%/300%的速度行动。",
            "description": "有120%的基础概率为指定敌方目标添加1个场上我方目标持有属性的弱点（优先添加我方编队中的第一位角色持有属性的弱点），且该弱点对应属性的抗性降低20%，持续3回合。若添加的是敌方目标原有属性的弱点，则不会触发对应属性的抗性降低效果。单个敌方目标仅能被银狼添加1个弱点，当银狼对其再次添加弱点时，仅保留最新添加的弱点。有100%的基础概率额外使该目标的全属性抗性降低13.0%/18.0%/30.0%，持续2回合。对敌方全体目标造成等同于银狼480%/600%/864%攻击力的量子属性伤害。"
          },
          {
            "name": "等待程序响应…",
            "type": "天赋",
            "condition": "",
            "description": "银狼能够制造：攻击力降低10.0%/12.0%/15.0%、防御力降低8.0%/10.0%/12.0%、速度降低6.0%/7.0%/8.0%3种【缺陷】，植入【缺陷】时会额外植入【致命缺陷】，每层使敌方目标受到的伤害提高(3%/6%/9%+1%/2%/3%*同频同频)。银狼每次施放攻击后有100%的基础概率给受到攻击的敌方目标植入1个随机【缺陷】，持续3回合。敌方目标被消灭时，银狼对其添加的弱点会转移给场上存活的未被银狼添加弱点的敌人，优先转移给精英级别及以上的目标。敌方目标防御力降低30%/40%/60%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/89%/132%",
      "基础前台强度": "175/280/500",
      "基础后台强度": "175/280/500",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 175.0,
        "backStrength": 175.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.89,
        "frontStrength": 280.0,
        "backStrength": 280.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 500.0,
        "backStrength": 500.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1104",
    "name": "杰帕德",
    "cost": 4,
    "traits": [
      "belobog",
      "shield"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "护盾",
    "tags": [
      "护盾",
      "输出"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/characters/1104.png",
    "portrait": "assets/portraits/1104.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%9D%B0%E5%B8%95%E5%BE%B7#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "筑城之志",
        "description": "杰帕德会提供更多护盾，并提高拥有大量护盾目标的攻击力。且在我方受到数次攻击后反击敌人。",
        "skills": [
          {
            "name": "凛冬反攻",
            "type": "天赋",
            "condition": "",
            "description": "每个波次开始或首领敌人转阶段时，为全体前台目标提供等同于杰帕德40%/60%/80%防御力+200/300/400点的护盾，持续3回合。敌方目标攻击后，杰帕德获得1点充能，拥有4点充能后，立即消耗4点充能发动反击，对敌方全体目标造成杰帕德600%/960%/1800%防御力+200%/250%/300%我方小队持有护盾总量的伤害。"
          },
          {
            "name": "傲然之姿",
            "type": "天赋",
            "condition": "",
            "description": "我方目标持有的护盾值超过其生命上限时，攻击力提高40%/80%/120%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/89%/132%",
      "基础前台强度": "175/280/500",
      "基础后台强度": "0/0/0",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "90/105/120"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 175.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 90.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.89,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 105.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 500.0,
        "backStrength": 0.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 120.0
      }
    ]
  },
  {
    "id": "1203",
    "name": "罗刹",
    "cost": 4,
    "traits": [
      "wanderer",
      "heal"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "治疗",
    "tags": [
      "治疗",
      "辅助"
    ],
    "element": "虚数",
    "color": "#d8c496",
    "image": "assets/characters/1203.png",
    "portrait": "assets/portraits/1203.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%BD%97%E5%88%B9#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "生生不息",
        "description": "开启治疗结界使我方发动攻击后恢复生命。战技治疗我方单体目标并积攒【急救】，可自动治疗生命值较低的队友。",
        "skills": [
          {
            "name": "白花的祈望",
            "type": "战技",
            "condition": "行动时施放。罗刹以200%/250%/300%的速度行动。",
            "description": "为当前生命百分比最低的我方前台回复等同于罗刹64%/96%/128%攻击力+400/600/800的生命值，解除1个负面效果并使罗刹获得1层【急救】，上限4层。当任意我方前台当前生命值百分比小于等于50%时，罗刹会立即消耗1层【急救】对其触发1次等同于战技效果的治疗和解除负面效果。"
          },
          {
            "name": "生息的轮转",
            "type": "天赋",
            "condition": "",
            "description": "战斗开始时展开结界，使我方小队造成的伤害提高30%/60%/120%。处于结界中的任意敌方目标受到我方前台攻击后，施放攻击的我方前台立即回复等同于罗刹32.0%/48.0%/64.0%攻击力+400/600/800的生命值，并为其他我方前台回复等同于罗刹16%/24%/32%攻击力+200/300/400的生命值。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/89%/132%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "175/280/500",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "75/85/100",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 100.0,
        "backStrength": 175.0,
        "speedAmplification": 0.3,
        "healingStrength": 75.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.89,
        "frontStrength": 160.0,
        "backStrength": 280.0,
        "speedAmplification": 0.43,
        "healingStrength": 85.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 220.0,
        "backStrength": 500.0,
        "speedAmplification": 0.56,
        "healingStrength": 100.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1208",
    "name": "符玄",
    "cost": 4,
    "traits": [
      "luofu",
      "heal",
      "quantum"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "治疗",
    "tags": [
      "治疗",
      "辅助"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/characters/1208.png",
    "portrait": "assets/portraits/1208.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%AC%A6%E7%8E%84#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "大穷观阵",
        "description": "前台角色分摊受到的伤害，我方小队幸运一击伤害提高。消灭敌人获得【翻转】，使我方角色不会受到致命伤害并在生命值较低时自动治疗。",
        "skills": [
          {
            "name": "寰宇穷观",
            "type": "天赋",
            "condition": "",
            "description": "战斗开始时开启【大穷观阵】，使前台角色受到的伤害降低10%/15%/20%，并由全体前台角色分摊。我方小队幸运一击伤害提高(18%/24%/30%+6%/8%/10%*同频同频)。"
          },
          {
            "name": "反者道之动",
            "type": "天赋",
            "condition": "",
            "description": "每有5/3/1个敌方目标被消灭，或首领敌人转阶段时，符玄获得1次【翻转】，拥有【翻转】时，我方角色不会受到致命伤害，最多拥有3次【翻转】。当前台角色的生命值降低至生命上限的30%以下时，符玄消耗1次【翻转】，使全体前台角色回复等同于已损失生命值60%/80%/100%的生命值。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/56%/82%",
      "基础前台强度": "100/130/160",
      "基础后台强度": "175/227.5/360",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "100/100/100",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 100.0,
        "backStrength": 175.0,
        "speedAmplification": 0.3,
        "healingStrength": 100.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.56,
        "frontStrength": 130.0,
        "backStrength": 227.5,
        "speedAmplification": 0.43,
        "healingStrength": 100.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.82,
        "frontStrength": 160.0,
        "backStrength": 360.0,
        "speedAmplification": 0.56,
        "healingStrength": 100.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1209",
    "name": "彦卿",
    "cost": 4,
    "traits": [
      "luofu",
      "wolfpack",
      "debuff"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/portraits/1209.png",
    "portrait": "assets/portraits/1209.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%BD%A6%E5%8D%BF#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "天河奔怒涛",
        "description": "行动时攻击并使敌人陷入冰冻状态。彦卿在我方对敌人施加减益时恢复能量，满能量后施放终结技攻击所有敌人。",
        "skills": [
          {
            "name": "遥击三尺水",
            "type": "战技",
            "condition": "行动时施放。彦卿以200%/250%/300%的速度行动。",
            "description": "对敌方单体造成等同于彦卿600%/750%/1080%攻击力的冰属性伤害，有120%的基础概率使受到攻击的敌方目标陷入冰冻状态，持续1回合。"
          },
          {
            "name": "天河泻",
            "type": "终结技",
            "condition": "满能量时施放。战技恢复30点能量，我方小队其他目标行动时如果使敌方目标陷入负面状态，则使彦卿恢复15点能量。",
            "description": "对敌方全体造成等同于彦卿1600%/2000%/2880%攻击力的冰属性伤害。"
          },
          {
            "name": "剑心通明",
            "type": "天赋",
            "condition": "",
            "description": "彦卿获得【智剑连心】，暴击率提高80%，暴击伤害提高80%/100%/120%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/89%/132%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "175/280/500",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 100.0,
        "backStrength": 175.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.89,
        "frontStrength": 160.0,
        "backStrength": 280.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 220.0,
        "backStrength": 500.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1309",
    "name": "知更鸟",
    "cost": 4,
    "traits": [
      "festival",
      "follow"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "辅助",
    "tags": [
      "辅助",
      "输出"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/portraits/1309.png",
    "portrait": "assets/portraits/1309.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%9F%A5%E6%9B%B4%E9%B8%9F#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "银河歌姬",
        "description": "使我方小队造成的伤害提高。行动时，使我方全体前台目标立即行动且在攻击后附加多次伤害。",
        "skills": [
          {
            "name": "翎之咏叹调",
            "type": "战技",
            "condition": "战斗开始时施放。",
            "description": "使我方小队造成的伤害提高30%/45%/60%，羁绊内队员获得双倍提高，持续至战斗结束。"
          },
          {
            "name": "千音迭奏，群星赋格",
            "type": "终结技",
            "condition": "行动时施放。知更鸟以100%/125%/150%的速度行动。",
            "description": "知更鸟进入【协奏】状态，使我方全体前台立即行动。处于【协奏】状态时，我方小队攻击力提高，提高数值等同于知更鸟攻击力的16.0%/20.0%/26.0%+150/200/250点，羁绊内成员获得双倍提高。我方小队每次施放攻击后，知更鸟会额外造成2次等同于其自身120%/150%/216%攻击力的物理属性附加伤害，该伤害视为追加攻击伤害，暴击率固定为100%，暴击伤害固定为150%/200%/250%。行动序列上出现【协奏】倒计时，倒计时回合开始时知更鸟退出【协奏】状态，倒计时固定拥有200点速度。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/89%/132%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "175/280/500",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 100.0,
        "backStrength": 175.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.89,
        "frontStrength": 160.0,
        "backStrength": 280.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 220.0,
        "backStrength": 500.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1315",
    "name": "波提欧",
    "cost": 4,
    "traits": [
      "ranger",
      "break"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/portraits/1315.png",
    "portrait": "assets/portraits/1315.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%B3%A2%E6%8F%90%E6%AC%A7#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "清空弹匣",
        "description": "波提欧的强化普攻可以为指定目标添加物理弱点，并攻击多个目标，终结技削韧值提高。",
        "skills": [
          {
            "name": "击锤连弩",
            "type": "普攻",
            "condition": "",
            "description": "为指定敌方单体目标添加物理弱点，持续2回合。对敌方单体造成等同于波提欧264%攻击力的物理属性伤害，并额外造成2/3/5次伤害。每次对敌方随机单体造成等同于原伤害倍率60%/75%/100%的物理属性伤害和等同于原削韧值60%/75%/100%的韧性削减，优先弹射本次攻击尚未击中过的敌方目标。强化普攻无法恢复战技点，且仅能以处于【绝命对峙】的敌方目标为主目标。"
          },
          {
            "name": "优势开局",
            "type": "天赋",
            "condition": "",
            "description": "战斗开始时获得1层【优势口袋】，施放终结技时额外削减目标20/40/60点韧性值。"
          },
          {
            "name": "轮中五豆",
            "type": "天赋",
            "condition": "",
            "description": "每层【优势口袋】使强化普攻的削韧值提高50%，最多叠加3层。施放强化普攻期间，若处于【绝命对峙】的敌方目标处于弱点击破状态，基于【优势口袋】层数，对所有处于弱点击破状态的目标造成等同于波提欧61%/105%/148%物理属性击破伤害的击破伤害，该伤害计入的韧性上限不超过普攻【蹄铁裂颅】基础削韧值的16倍。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/89%/132%",
      "基础前台强度": "175/280/500",
      "基础后台强度": "0/0/0",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 175.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.89,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 500.0,
        "backStrength": 0.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1401",
    "name": "大黑塔",
    "cost": 4,
    "traits": [
      "scholar",
      "aoe"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/portraits/1401.png",
    "portrait": "assets/portraits/1401.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%A4%A7%E9%BB%91%E5%A1%94#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "双塔奇兵",
        "description": "施放强化战技后生成【黑塔人偶】进行追击。我方小队中存在黑塔时，该次追击的攻击次数增加。",
        "skills": [
          {
            "name": "人偶大作战",
            "type": "天赋",
            "condition": "",
            "description": "大黑塔施放强化战技后，触发1次由1/2/5个【黑塔人偶】发动的追加攻击，参与追加攻击的每个【黑塔人偶】会造成等同于大黑塔攻击力50%/60%/100%的冰属性伤害，重复2次。若我方小队中存在黑塔，则黑塔的每个星级提高1次重复次数。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/89%/132%",
      "基础前台强度": "175/280/500",
      "基础后台强度": "0/0/0",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 175.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.89,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 500.0,
        "backStrength": 0.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1407",
    "name": "遐蝶",
    "cost": 4,
    "traits": [
      "night",
      "blood"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/portraits/1407.png",
    "portrait": "assets/portraits/1407.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%81%90%E8%9D%B6#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "荒芜流淌",
        "description": "连携攻击消耗更多生命值并造成更高伤害，死龙消灭敌人可回复生命，溢出的生命值在自身消失后转化为【新蕊】。",
        "skills": [
          {
            "name": "掌心淌过的荒芜",
            "type": "天赋",
            "condition": "",
            "description": "我方全体目标每损失1点生命值遐蝶获得1点【新蕊】，当【新蕊】达到上限时可激活终结技。我方损失生命值时，遐蝶与死龙造成的伤害提高17%/26%/35%，该效果最多叠加3层，持续3回合。【新蕊】上限固定为150000，死龙消灭敌方目标时恢复15000点生命，且死龙溢出生命值的50%会被记录，并在自身消失后使遐蝶获得等量的【新蕊】。队伍中当前在场的我方小队角色数量等于4以下/5/6/7时，遐蝶额外获得200%/120%/70%/30%的【新蕊】。死龙在场时无法通过天赋获得【新蕊】，除死龙以外我方全体目标每损失1点生命值会转化为死龙同等的生命值。"
          },
          {
            "name": "骸爪，冥龙之环拥",
            "type": "战技",
            "condition": "",
            "description": "消耗除死龙以外的我方全体目标当前50%的生命值，遐蝶与死龙向目标发起连携攻击，对敌方全体目标造成等同于遐蝶35.0%/52.5%/105.0%和52.5%/78.7%/157.5%生命上限的量子属性伤害。若当前生命值不足，最多使当前生命值降至1点。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/56%/82%",
      "基础前台强度": "175/245/400",
      "基础后台强度": "0/0/0",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 175.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.56,
        "frontStrength": 245.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.82,
        "frontStrength": 400.0,
        "backStrength": 0.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1410",
    "name": "海瑟音",
    "cost": 4,
    "traits": [
      "day",
      "dot"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/portraits/1410.png",
    "portrait": "assets/portraits/1410.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%B5%B7%E7%91%9F%E9%9F%B3#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "深海回响",
        "description": "海瑟音攻击后为目标叠加持续伤害【深海回响】，并使其在被攻击后对自身和相邻敌人额外造成持续伤害。",
        "skills": [
          {
            "name": "海之歌",
            "type": "天赋",
            "condition": "",
            "description": "海瑟音攻击后使目标陷入1层【深海回响】。【深海回响】状态下，敌方目标每回合开始时，每层受到等同于海瑟音攻击力60%/100%/200%的物理属性持续伤害，且受到攻击后，使其当前承受的【深海回响】立即对自身与相邻敌方目标产生相当于原伤害40%的伤害，并使当前承受的1个其他随机持续伤害状态立即产生相当于原伤害80%/120%/240%的伤害。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/89%/132%",
      "基础前台强度": "175/280/500",
      "基础后台强度": "0/0/0",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 175.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.89,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 500.0,
        "backStrength": 0.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1413",
    "name": "长夜月",
    "cost": 4,
    "traits": [
      "night",
      "blood"
    ],
    "allowedZones": [
      "front",
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/portraits/1413.png",
    "portrait": "assets/portraits/1413.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%95%BF%E5%A4%9C%E6%9C%88#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "长夜漫漫",
        "description": "我方小队目标越多，全队暴击伤害、幸运一击伤害越高。",
        "skills": [
          {
            "name": "众人的美梦",
            "type": "天赋",
            "condition": "",
            "description": "我方小队当前每有1个目标，则我方小队暴击伤害提高3%/5%/8%，幸运一击伤害提高1%/2%/3%"
          }
        ]
      },
      {
        "zone": "back",
        "name": "长夜漫漫",
        "description": "召唤忆灵使其行动时攻击敌人并获得【忆质】，充能满后立即攻击敌方全体并获得强化。我方小队目标越多，全队暴击伤害、幸运一击伤害越高。",
        "skills": [
          {
            "name": "今夜与我同行",
            "type": "天赋",
            "condition": "",
            "description": "进入战斗时召唤忆灵「长夜」。忆灵「长夜」初始拥有长夜月200%/250%/300%的速度，生命上限为长夜月的50%。忆灵「长夜」与长夜月进入战斗时生命值为生命上限的1%，暴击率提高35%。忆灵「长夜」回合结束时回复自身与长夜月等同于50%生命上限的生命值，并使长夜月获得8点【忆质】。长夜月持有的【忆质】大于等于16点时，立即使忆灵「长夜」获得1个额外回合并施放【迷梦，流失，如露】。"
          },
          {
            "name": "与忆海深潜",
            "type": "天赋",
            "condition": "",
            "description": "我方小队其他角色的忆灵施放技能后长夜月获得2点【忆质】，并使自身和忆灵「长夜」回复等同于各自5%生命上限的生命值。我方前台受到伤害或消耗生命值时长夜月获得2点【忆质】，并使自身和忆灵「长夜」回复等同于各自5%生命上限的生命值，该效果单次行动内最多触发1次。我方小队当前每有1个目标，则我方小队暴击伤害提高3%/5%/8%，幸运一击伤害提高1%/2%/3%。"
          },
          {
            "name": "追忆，蹁跹，如雨",
            "type": "忆灵技",
            "condition": "忆灵行动时施放。",
            "description": "该技能自动选择目标施放。对敌方单体造成等同于「长夜」100%/125%/180%生命上限的冰属性伤害，长夜月当前每有4点【忆质】，则额外造成等同于「长夜」20.0%/25.0%/36.0%生命上限的冰属性伤害。"
          },
          {
            "name": "迷梦，流失，如露",
            "type": "忆灵技",
            "condition": "",
            "description": "消耗所有【忆质】发动攻击，每消耗1点【忆质】则对主目标造成等同于「长夜」24.0%/30.0%/43.2%生命上限的冰属性伤害，对其他敌方目标造成等同于「长夜」12.0%/15.0%/21.6%生命上限的冰属性伤害。施放后，长夜月和「长夜」生命值降低至1点，且长夜月在本场战斗中永远进入【至暗之谜】状态，期间敌方全体受到的伤害提高30%/35%/40%，长夜月和「长夜」造成的伤害提高60%/80%/100%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "30%/56%/82%",
      "基础前台强度": "175/245/400",
      "基础后台强度": "175/245/400",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "80/80/80",
      "基础护盾强度": "80/80/80"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.3,
        "frontStrength": 175.0,
        "backStrength": 175.0,
        "speedAmplification": 0.3,
        "healingStrength": 80.0,
        "shieldStrength": 80.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.56,
        "frontStrength": 245.0,
        "backStrength": 245.0,
        "speedAmplification": 0.43,
        "healingStrength": 80.0,
        "shieldStrength": 80.0
      },
      {
        "stars": 3,
        "hpAmplification": 0.82,
        "frontStrength": 400.0,
        "backStrength": 400.0,
        "speedAmplification": 0.56,
        "healingStrength": 80.0,
        "shieldStrength": 80.0
      }
    ]
  },
  {
    "id": "1501",
    "name": "火花",
    "cost": 4,
    "traits": [
      "wanderer",
      "sp",
      "elation"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1501.png",
    "portrait": "assets/portraits/1501.png",
    "expert": false,
    "sourceVersion": "4.0",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%81%AB%E8%8A%B1#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "流量为王",
        "description": "阿哈时刻时可以额外施放欢愉技【顶级流量】，开启晶矿可以提升【顶级流量】的等级。【顶级流量】攻击后有概率获得晶矿。",
        "skills": [
          {
            "name": "爆款代表作",
            "type": "天赋",
            "condition": "",
            "description": "本局中每开启过1个白/蓝/金/棱彩晶矿可以获得1/2/8/40点【流量】，当达到30/90/180点【流量】时，【顶级流量】的等级从【纯白新秀】升级为【湛蓝潮流】/【闪金梦雨】/【炫彩神阶】。当火花升至2/3星时，立即获得40/100点【流量】。"
          },
          {
            "name": "顶级流量",
            "type": "欢愉技",
            "condition": "",
            "description": "【顶级流量】的等级为【纯白新秀】时：火花会对敌方随机单体目标造成6次80%/90%/120%火属性欢愉伤害。当等级达到【湛蓝潮流】时：火花会额外对敌方全体目标造成120%/135%/180%火属性欢愉伤害。当等级达到【闪金梦雨】时：火花会额外对敌方随机单体目标造成6次80%/90%/120%火属性欢愉伤害。当等级达到【炫彩神阶】时：火花会额外对敌方全体目标造成240%/270%/360%火属性欢愉伤害。该攻击后有4%/4%/20%概率获得1个对应品质的晶矿，每次战斗最多获得1个。"
          },
          {
            "name": "自媒体团队",
            "type": "天赋",
            "condition": "",
            "description": "火花每消耗1个战技点，在阿哈回合开始时火花获得1层【涨粉】：在阿哈时刻期间伤害增幅提高3%，该效果可以叠加50层，持续至下次阿哈回合开始。进入战斗时火花获得20层【涨粉】。行迹【炫目！人设万花筒】所需要的「欢愉」命途角色也会计算后台角色。"
          },
          {
            "name": "愚者笑语",
            "type": "天赋",
            "condition": "",
            "description": "火花施放欢愉技期间可以获得阿哈100%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。火花施放普攻期间可以获得阿哈60%/70%/80%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/89%/132%",
      "基础前台强度": "175/280/500",
      "基础后台强度": "0/0/0",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 175.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.89,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 500.0,
        "backStrength": 0.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "8007",
    "name": "开拓者•记忆",
    "cost": 4,
    "traits": [
      "express",
      "energy"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "辅助",
    "tags": [
      "辅助",
      "输出"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/portraits/8007.png",
    "portrait": "assets/portraits/8007.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%BC%80%E6%8B%93%E8%80%85%E2%80%A2%E8%AE%B0%E5%BF%86#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "欧拉！",
        "description": "迷迷发动攻击后造成真实伤害，普通攻击有概率触发连击，并使敌人防御力降低。",
        "skills": [
          {
            "name": "坏人！麻烦！",
            "type": "忆灵技",
            "condition": "",
            "description": "造成4次伤害，每次对敌方随机单体目标造成等同于迷迷300.0%/360.0%/540.0%攻击力的冰属性伤害，有50%/65%/75%概率连续触发，最多触发5次，每次触发后使自身恢复5点能量。最后对敌方全体目标造成等同于迷迷450%/540%/810%攻击力的冰属性伤害，并使敌方目标防御力降低25%/35%/50%。"
          },
          {
            "name": "最强声援",
            "type": "忆灵天赋",
            "condition": "",
            "description": "迷迷永久持有【迷迷的声援】。我方后台目标每累计恢复20%/20%/10点能量，迷迷都会获得1%充能。迷迷施放【我会！帮你！】后，自身立即行动。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/88%/132%",
      "基础前台强度": "175/280/500",
      "基础后台强度": "0/0/0",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 175.0,
        "backStrength": 0.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.88,
        "frontStrength": 280.0,
        "backStrength": 0.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 500.0,
        "backStrength": 0.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "8009",
    "name": "开拓者•欢愉",
    "cost": 4,
    "traits": [
      "express",
      "energy",
      "elation"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "雷",
    "color": "#c49ce8",
    "image": "assets/portraits/8009.png",
    "portrait": "assets/portraits/8009.png",
    "expert": false,
    "sourceVersion": "4.2",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%BC%80%E6%8B%93%E8%80%85%E2%80%A2%E6%AC%A2%E6%84%89#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "喜剧开场",
        "description": "装备最多的【欢愉】队员在阿哈时刻的欢愉技会立即重复施放一次。终结技可使目标立即施放欢愉技。",
        "skills": [
          {
            "name": "风暴甚是喧嚣",
            "type": "战技",
            "condition": "",
            "description": "对敌方全体造成等同于开拓者60%/75%/108%攻击力的雷属性伤害，获得20/30/50点【好活当赏】。行动时施放，开拓者以200%/250%/300%的速度行动。"
          },
          {
            "name": "放心飞，开拓永相随！",
            "type": "终结技",
            "condition": "",
            "description": "获得5个笑点，使指定我方单体暴击伤害提高60%/80%/120%，持续3回合，并解除该目标的控制类负面状态。若目标拥有欢愉技，目标额外获得10/15/25点【好活当赏】，并使其立即施放1次固定计入20/30/50笑点的欢愉技。若目标不拥有欢愉技，使其行动提前50%。满能量时施放。战技恢复30点能量。"
          },
          {
            "name": "英雄一笑，生死难料",
            "type": "天赋",
            "condition": "",
            "description": "施放攻击后，固定恢复10点能量并获得10/15/25个笑点。开拓者持有【好活当赏】时，战技对敌方全体额外造成100%/125%/180%的雷属性欢愉伤害，此伤害使用我方最高的【好活当赏】数值计算。开拓者的欢愉度提高60%/80%/120%。"
          },
          {
            "name": "我说欢愉，你耳朵聋吗？",
            "type": "欢愉技",
            "condition": "",
            "description": "造成8次伤害，每次对敌方随机单体造成100%/125%/180%的雷属性欢愉伤害。最后造成200%/250%/360%的雷属性欢愉伤害，由敌方全体均分。"
          },
          {
            "name": "好戏连轴转",
            "type": "天赋",
            "condition": "",
            "description": "装备最多的【欢愉】羁绊角色成为【人气主播】，【人气主播】在阿哈时刻期间施放欢愉技会复制1次该技能并立即施放。"
          },
          {
            "name": "无名笑语",
            "type": "天赋",
            "condition": "",
            "description": "开拓者施放欢愉技期间可以获得阿哈100%的前后台强度提高、伤害增幅、幸运一击率、幸运一击伤害、击破效率、击破特攻。"
          },
          {
            "name": "命途相变",
            "type": "天赋",
            "condition": "",
            "description": "开拓者处于前台时切换为【记忆】命途，处于后台时切换为【欢愉】命途，并获得相应技能。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "45%/88%/132%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "175/280/500",
      "速度增幅": "30%/43%/56%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.45,
        "frontStrength": 100.0,
        "backStrength": 175.0,
        "speedAmplification": 0.3,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.88,
        "frontStrength": 160.0,
        "backStrength": 280.0,
        "speedAmplification": 0.43,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 1.32,
        "frontStrength": 220.0,
        "backStrength": 500.0,
        "speedAmplification": 0.56,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1004",
    "name": "瓦尔特",
    "cost": 5,
    "traits": [
      "express",
      "wanderer",
      "debuff"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "虚数",
    "color": "#d8c496",
    "image": "assets/characters/1004.png",
    "portrait": "assets/portraits/1004.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E7%93%A6%E5%B0%94%E7%89%B9#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "黑洞领域",
        "description": "终结技会延后战斗结束倒计时，战技段数增加。若我方小队使敌人陷入负面状态，敌人会受到附加伤害，并叠加减速与易伤。",
        "skills": [
          {
            "name": "无法逃脱",
            "type": "天赋",
            "condition": "",
            "description": "我方任意目标攻击中若使敌人陷入了负面状态，则攻击后瓦尔特会额外对目标造成150%/187%/750%攻击力的虚数附加伤害并附加1层【无法逃脱】。【无法逃脱】：每层使速度降低4%/5%/6%，受到的伤害提高4%/6%/8%，受到来自瓦尔特的伤害额外提高4%/6%/8%，可叠加5层。"
          },
          {
            "name": "虚空断界",
            "type": "战技",
            "condition": "",
            "description": "对指定敌方单体造成等同于瓦尔特210%/262%/1050%攻击力的虚数属性伤害，并额外造成4次伤害。每有1个陷入【无法逃脱】的敌人则额外造成1次伤害。每次伤害对敌方随机单体造成等同于瓦尔特210%/262%/1050%攻击力的虚数属性伤害。攻击命中时有72%的基础概率使受到攻击的敌方目标速度降低10%，持续2回合。"
          },
          {
            "name": "拟似黑洞",
            "type": "终结技",
            "condition": "",
            "description": "对敌方全体造成等同于瓦尔特450%/562%/2250%攻击力的虚数属性伤害，使敌方全体陷入3层【无法逃脱】，并使战斗结束的倒计时延后20/20/100行动值，单次战斗内最多使倒计时延后100/100/999行动值。有100%的基础概率使受到攻击的敌方目标陷入禁锢状态，持续1回合。禁锢状态下，敌方目标行动延后38.0%，速度降低10%。施放终结技后使敌方全体陷入【失重】状态，【失重】状态下的敌方目标受到攻击时行动延后4.0%，该效果每个目标每回合内最多触发8次，【失重】状态持续2回合。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "60%/108%/500%",
      "基础前台强度": "200/320/2000",
      "基础后台强度": "0/0/0",
      "速度增幅": "45%/60%/300%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.6,
        "frontStrength": 200.0,
        "backStrength": 0.0,
        "speedAmplification": 0.45,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 1.08,
        "frontStrength": 320.0,
        "backStrength": 0.0,
        "speedAmplification": 0.6,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 5.0,
        "frontStrength": 2000.0,
        "backStrength": 0.0,
        "speedAmplification": 3.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1015",
    "name": "Archer",
    "cost": 5,
    "traits": [
      "grail",
      "sp",
      "magician"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "量子",
    "color": "#9e9ce3",
    "image": "assets/portraits/1015.png",
    "portrait": "assets/portraits/1015.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/Archer#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "幻想崩坏",
        "description": "连续施放的第5次战技会消耗所有战技点并额外造成大量伤害，终结技可攻击敌方全体。",
        "skills": [
          {
            "name": "伪•螺旋剑",
            "type": "战技",
            "condition": "",
            "description": "进入【回路连接】状态。对指定敌方单体造成等同于Archer315%/393%/1575%攻击力的量子属性伤害。【回路连接】状态下施放战技后，本回合不会结束，并使Archer战技造成的伤害提高90%，该效果可以叠加2层，持续至退出【回路连接】状态。主动施放5/5/10次战技后或战技点不足以再次施放战技则退出【回路连接】状态。每个波次中的所有敌方目标被消灭后会退出【回路连接】状态。主动施放第5/5/10次战技时，消耗剩余我方所有战技点，每个被消耗的战技点额外使该次战技的倍率提高210%/262%/420%。"
          },
          {
            "name": "无限剑制",
            "type": "终结技",
            "condition": "",
            "description": "对指定敌方单体造成等同于Archer900%/1125%/4500%攻击力的量子属性伤害，对其余敌方目标造成等同于Archer450%/562%/2250%攻击力的量子属性伤害。并获得2点充能，最多可拥有4点充能。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "60%/108%/500%",
      "基础前台强度": "200/320/2000",
      "基础后台强度": "0/0/0",
      "速度增幅": "45%/60%/300%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.6,
        "frontStrength": 200.0,
        "backStrength": 0.0,
        "speedAmplification": 0.45,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 1.08,
        "frontStrength": 320.0,
        "backStrength": 0.0,
        "speedAmplification": 0.6,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 5.0,
        "frontStrength": 2000.0,
        "backStrength": 0.0,
        "speedAmplification": 3.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1101",
    "name": "布洛妮娅",
    "cost": 5,
    "traits": [
      "belobog",
      "guardian",
      "blood"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "辅助",
    "tags": [
      "辅助",
      "输出"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/characters/1101.png",
    "portrait": "assets/portraits/1101.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E5%B8%83%E6%B4%9B%E5%A6%AE%E5%A8%85#零和博弈",
    "empowerments": [
      {
        "zone": "贝洛伯格",
        "name": "领军之旗",
        "description": "战技使目标和自身的属性额外提高，终结技可持续为我方小队提供增益。",
        "skills": [
          {
            "name": "作战再部署",
            "type": "战技",
            "condition": "",
            "description": "解除指定我方单体的1个负面效果，并使该目标立即行动，造成的伤害提高57%，持续1回合。使目标和自身前台强度提高60%/75%/100%，幸运一击率提高20%/25%/35%，持续2回合。对自身施放该技能时，无法触发立即行动效果。"
          },
          {
            "name": "贝洛伯格进行曲",
            "type": "终结技",
            "condition": "",
            "description": "为自身施加【集结进行曲】，持续2回合。当布洛妮娅持有该效果时，我方小队攻击力提高49%，同时提高等同于布洛妮娅15.0%暴击伤害+18.0%的暴击伤害。"
          }
        ]
      },
      {
        "zone": "燃血",
        "name": "冲锋之号",
        "description": "战技消耗自身和目标生命值并额外提高双方属性，终结技可持续为我方小队提供增益。",
        "skills": [
          {
            "name": "作战再部署",
            "type": "战技",
            "condition": "",
            "description": "解除指定我方单体的1个负面效果，并使该目标立即行动，造成的伤害提高57%，持续1回合。同时使目标和自身消耗等同于生命上限50%的生命值，并获得【协同作战】。持有【协同作战】的角色及其忆灵的前台强度提高40%/50%/80%，造成的伤害提高20%/25%/35%，持续2回合。对自身施放该技能时，无法触发立即行动效果，仅触发1次生命消耗效果。若当前生命值不足，最多使当前生命值降至1点。"
          },
          {
            "name": "贝洛伯格进行曲",
            "type": "终结技",
            "condition": "",
            "description": "为自身施加【冲锋进行曲】，持续2回合。当布洛妮娅持有该效果时，我方小队攻击力提高49%，生命上限提高5%/10%/15%，同时提高等同于布洛妮娅15.0%暴击伤害+18.0%的暴击伤害。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "60%/108%/500%",
      "基础前台强度": "200/320/2000",
      "基础后台强度": "0/0/0",
      "速度增幅": "45%/60%/300%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.6,
        "frontStrength": 200.0,
        "backStrength": 0.0,
        "speedAmplification": 0.45,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 1.08,
        "frontStrength": 320.0,
        "backStrength": 0.0,
        "speedAmplification": 0.6,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 5.0,
        "frontStrength": 2000.0,
        "backStrength": 0.0,
        "speedAmplification": 3.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1112",
    "name": "托帕&账账",
    "cost": 5,
    "traits": [
      "ipc",
      "follow"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1112.png",
    "portrait": "assets/portraits/1112.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%89%98%E5%B8%95%26%E8%B4%A6%E8%B4%A6#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "猪市",
        "description": "行动时攻击敌方全体并有概率获得金币。我方小队攻击后使托帕&账账行动提前。敌人受到的伤害提高。",
        "skills": [
          {
            "name": "支付困难？",
            "type": "战技",
            "condition": "行动时施放。托帕&账账以200%/250%/300%的速度行动。",
            "description": "使账账对敌方全体造成等同于托帕1100%/1375%/5500%攻击力的火属性伤害。施放此战技造成伤害时，被视为发动了追加攻击。每击中1个目标，都有30%/50%/100%概率获得1/1/5枚金币。每场战斗中最多通过此方式获得3/5/99枚金币。"
          },
          {
            "name": "利滚利",
            "type": "天赋",
            "condition": "",
            "description": "我方小队其他目标发动攻击后托帕&账账行动提前8%/8%/50%，若该次攻击为追加攻击则行动提前12%/12%/50%。所有敌方目标进入战斗时会陷入【负债证明•改】，使受到的所有伤害提高50%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "60%/108%/500%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "200/320/2000",
      "速度增幅": "45%/60%/300%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.6,
        "frontStrength": 100.0,
        "backStrength": 200.0,
        "speedAmplification": 0.45,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 1.08,
        "frontStrength": 160.0,
        "backStrength": 320.0,
        "speedAmplification": 0.6,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 5.0,
        "frontStrength": 220.0,
        "backStrength": 2000.0,
        "speedAmplification": 3.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1204",
    "name": "景元",
    "cost": 5,
    "traits": [
      "luofu",
      "aoe"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "雷",
    "color": "#c49ce8",
    "image": "assets/characters/1204.png",
    "portrait": "assets/portraits/1204.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%99%AF%E5%85%83#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "煌煌神威",
        "description": "神君的段数叠加上限和叠加速度提升，且会在叠加一定层数后立即行动，并使景元行动提前。",
        "skills": [
          {
            "name": "斩勘神形",
            "type": "天赋",
            "condition": "",
            "description": "战斗开始时召唤【神君】。【神君】初始拥有300/300/500点速度以及5段攻击段数，行动时发动追加攻击，每段攻击对随机敌方单体造成等同于景元攻击力175%/218%/875%的雷属性伤害，同时对其相邻目标造成等同于主目标50%的雷属性伤害。【神君】每增加1段攻击段数，速度提高50点。【神君】在累计15段攻击段数后立即行动，行动结束后速度和攻击段数恢复至初始状态。当景元陷入无法战斗状态时，【神君】消失。当景元无法行动时【神君】也无法行动。"
          },
          {
            "name": "天人感应",
            "type": "天赋",
            "condition": "",
            "description": "景元免疫控制类负面状态，施放战技/终结技后，额外增加【神君】2/2/20/3/3/20段下回合的攻击段数。神君行动后，使景元行动提前50%/50%/80%，并恢复1个战技点。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "60%/108%/500%",
      "基础前台强度": "200/320/2000",
      "基础后台强度": "0/0/0",
      "速度增幅": "45%/60%/300%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.6,
        "frontStrength": 200.0,
        "backStrength": 0.0,
        "speedAmplification": 0.45,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 1.08,
        "frontStrength": 320.0,
        "backStrength": 0.0,
        "speedAmplification": 0.6,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 5.0,
        "frontStrength": 2000.0,
        "backStrength": 0.0,
        "speedAmplification": 3.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1221",
    "name": "云璃",
    "cost": 5,
    "traits": [
      "wolfpack",
      "energy"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "物理",
    "color": "#d1bbbd",
    "image": "assets/portraits/1221.png",
    "portrait": "assets/portraits/1221.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E4%BA%91%E7%92%83#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "以剑为盾",
        "description": "我方攻击或受到攻击后为云璃恢复能量，施放终结技攻击敌人后获得【剑盾】以保护我方前台并发动反击。",
        "skills": [
          {
            "name": "剑为地纪，刃惊天宗",
            "type": "终结技",
            "condition": "满能量时施放。我方前台目标/我方其他后台目标/敌方目标发动攻击后，云璃恢复(12/12/60)/(12/12/60)/(20/20/120)点能量。",
            "description": "立刻发动【勘破•灭】并获得2层【剑盾】，最多持有3层【剑盾】。【勘破•灭】：对目标造成等同于云璃480%/600%/2400%攻击力的物理属性伤害，对其相邻目标造成等同于云璃240%/300%/1200%攻击力的物理属性伤害，随后额外造成6次伤害，每次伤害对随机敌方单体造成等同于云璃200%/250%/1000%攻击力的物理伤害。此技能为反击，云璃通过此技能造成伤害时，被视为造成了终结技伤害。"
          },
          {
            "name": "闪烁",
            "type": "天赋",
            "condition": "",
            "description": "我方前台角色受到敌方目标攻击时，若云璃持有【剑盾】层数，则立即消耗1层并使受击目标中首个目标不受伤害。随后立即向攻击者发动反击【勘破•斩】。云璃的攻击力提高30%/40%/50%，暴击伤害提高100%/120%/140%。【勘破•斩】：对目标造成等同于云璃320%/400%/1600%攻击力的物理属性伤害，对其相邻目标造成等同于云璃160%/200%/800%攻击力的物理属性伤害。若不存在可反击的目标，则反击敌方随机目标。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "60%/108%/500%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "200/320/2000",
      "速度增幅": "45%/60%/300%",
      "基础治疗强度": "80/80/80",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.6,
        "frontStrength": 100.0,
        "backStrength": 200.0,
        "speedAmplification": 0.45,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 1.08,
        "frontStrength": 160.0,
        "backStrength": 320.0,
        "speedAmplification": 0.6,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 5.0,
        "frontStrength": 220.0,
        "backStrength": 2000.0,
        "speedAmplification": 3.0,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1307",
    "name": "黑天鹅",
    "cost": 5,
    "traits": [
      "festival",
      "dot",
      "seer"
    ],
    "allowedZones": [
      "back"
    ],
    "role": "输出",
    "tags": [
      "输出",
      "辅助"
    ],
    "element": "风",
    "color": "#7bcbb2",
    "image": "assets/portraits/1307.png",
    "portrait": "assets/portraits/1307.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E9%BB%91%E5%A4%A9%E9%B9%85#零和博弈",
    "empowerments": [
      {
        "zone": "back",
        "name": "窥视奥迹",
        "description": "为敌人添加可叠加层数的持续伤害【奥迹】，敌人回合触发【奥迹】时自身恢复能量，终结技可维持【奥迹】层数。【奥迹】的可叠加层数能超过上限。",
        "skills": [
          {
            "name": "失坠，伪神的黄昏",
            "type": "战技",
            "condition": "行动时施放。黑天鹅以200%/250%/300%的速度行动。",
            "description": "对指定敌方单体及其相邻目标造成等同于黑天鹅300%/375%/1500%攻击力的风属性伤害，同时有100%的基础概率使目标与相邻目标防御力降低20.0%/30.0%/40.0%，持续3回合。"
          },
          {
            "name": "沉醉于彼界的臂湾",
            "type": "终结技",
            "condition": "满能量时施放。\\n战技恢复30点能量，敌方目标回合开始【奥迹】造成伤害时，每层【奥迹】使黑天鹅恢复0.5点能量。",
            "description": "使敌方全体目标陷入【揭露】状态，持续2回合。随后对敌方全体目标造成等同于黑天鹅500%/625%/2500%攻击力的风属性伤害。【揭露】状态下，敌方目标受到的伤害提高25%/35%/50%。每陷入1层【奥迹】时，有100%的固定概率使本次叠加层数额外提高1层，并且【奥迹】回合开始造成伤害后层数不会减半。"
          },
          {
            "name": "无端命运的机杼",
            "type": "天赋",
            "condition": "",
            "description": "敌方目标在进入战斗时或每受到1次持续伤害时，有65%的基础概率陷入1层【奥迹】。我方小队发动攻击后，有65%的基础概率为目标叠加1层【奥迹】。敌方目标处于【奥迹】状态时，也会被视为同时陷入了风化、裂伤、灼烧、触电状态，每回合开始时受到等同于黑天鹅300%/375%/1500%攻击力的风属性持续伤害，随后层数减半。每层【奥迹】使此伤害倍率提高20.0%/25.0%/100.0%。【奥迹】可以叠加50层，层数达到上限后可继续叠加，产生伤害后移除超出上限的层数。【奥迹】造成的伤害无视目标20%的防御力。仅在敌方目标回合开始【奥迹】造成伤害时，相邻目标额外受到1次等同于黑天鹅300%/375%/1500%攻击力的风属性持续伤害。我方小队造成的伤害提高72%/90%/120%。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "60%/108%/500%",
      "基础前台强度": "100/160/220",
      "基础后台强度": "200/320/2000",
      "速度增幅": "45%/60%/300%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.6,
        "frontStrength": 100.0,
        "backStrength": 200.0,
        "speedAmplification": 0.45,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 1.08,
        "frontStrength": 160.0,
        "backStrength": 320.0,
        "speedAmplification": 0.6,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 5.0,
        "frontStrength": 220.0,
        "backStrength": 2000.0,
        "speedAmplification": 3.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1310",
    "name": "流萤",
    "cost": 5,
    "traits": [
      "hunters",
      "break"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "输出",
    "tags": [
      "输出"
    ],
    "element": "火",
    "color": "#e9a087",
    "image": "assets/portraits/1310.png",
    "portrait": "assets/portraits/1310.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%B5%81%E8%90%A4#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "点燃大海",
        "description": "始终处于「完全燃烧」状态，获得可攻击敌方全体的新终结技。攻击非击破状态的敌人也能触入画奇航发超击破。",
        "skills": [
          {
            "name": "超新星过载",
            "type": "终结技",
            "condition": "",
            "description": "为敌方全体添加火属性弱点，持续2回合。回复等同于自身50%生命上限的生命值，对敌方全体造成等同于装甲「萨姆」（0.4*击破特攻+400.0%）攻击力的火属性伤害，使敌方目标的全属性抗性降低30%/40%/50%，持续2回合。在攻击后额外将本次攻击的削韧值转化为1次100%/120%/500%的超击破伤害。"
          },
          {
            "name": "完全燃烧",
            "type": "天赋",
            "condition": "",
            "description": "始终处于「完全燃烧」状态，行迹【β模组-自限装甲】造成的超击破伤害倍率额外提高50%/100%/250%，并且攻击处于非弱点击破状态的敌方目标后也能触发超击破伤害。普攻、战技额外固定恢复40/40/120/60/60/120点能量，终结技替换为【超新星过载】。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "60%/108%/500%",
      "基础前台强度": "200/320/2000",
      "基础后台强度": "0/0/0",
      "速度增幅": "45%/60%/300%",
      "基础治疗强度": "80/80/80",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.6,
        "frontStrength": 200.0,
        "backStrength": 0.0,
        "speedAmplification": 0.45,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 1.08,
        "frontStrength": 320.0,
        "backStrength": 0.0,
        "speedAmplification": 0.6,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 5.0,
        "frontStrength": 2000.0,
        "backStrength": 0.0,
        "speedAmplification": 3.0,
        "healingStrength": 80.0,
        "shieldStrength": 60.0
      }
    ]
  },
  {
    "id": "1415",
    "name": "昔涟",
    "cost": 5,
    "traits": [
      "day",
      "night",
      "beloved"
    ],
    "allowedZones": [
      "front"
    ],
    "role": "辅助",
    "tags": [
      "辅助",
      "输出"
    ],
    "element": "冰",
    "color": "#8ddaf3",
    "image": "assets/portraits/1415.png",
    "portrait": "assets/portraits/1415.png",
    "expert": false,
    "sourceVersion": "3.7",
    "sourceSeason": "零和博弈",
    "sourceUrl": "https://wiki.biligame.com/sr/%E8%B4%A7%E5%B8%81%E6%88%98%E4%BA%89/%E6%98%94%E6%B6%9F#零和博弈",
    "empowerments": [
      {
        "zone": "front",
        "name": "爱与黄金",
        "description": "进入战斗时获得【追忆】，并强化所有黄金裔角色获得的角色赋能效果。",
        "skills": [
          {
            "name": "黄金铸成的史诗",
            "type": "天赋",
            "condition": "",
            "description": "使我方小队内的黄金裔角色获得【黄金铸成的史诗】，初始为1/2/99层。黄金裔角色获得的角色赋能效果基于【黄金铸成的史诗】的层数而提高。昔涟在战斗开始时获得9/9/27点【追忆】，每场战斗中首次施放终结技时，同时激活我方全体后台的终结技。昔涟在场时，天赋提供的伤害提高效果可以对我方全体后台生效。"
          },
          {
            "name": "盛放吧，来世的乐土",
            "type": "战技",
            "condition": "",
            "description": "获得3点【追忆】并展开结界，持续2回合，昔涟每回合开始时持续回合数减1。结界持续期间，我方小队每造成1次伤害，都会再额外造成1次等同于原伤害21%/26%/31%的真实伤害。"
          }
        ]
      }
    ],
    "referenceStarStats": {
      "生命增幅": "40%/68%/400%",
      "基础前台强度": "200/320/2000",
      "基础后台强度": "0/0/0",
      "速度增幅": "45%/60%/300%",
      "基础治疗强度": "60/60/60",
      "基础护盾强度": "60/60/60"
    },
    "referenceStars": [
      {
        "stars": 1,
        "hpAmplification": 0.4,
        "frontStrength": 200.0,
        "backStrength": 0.0,
        "speedAmplification": 0.45,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 2,
        "hpAmplification": 0.68,
        "frontStrength": 320.0,
        "backStrength": 0.0,
        "speedAmplification": 0.6,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      },
      {
        "stars": 3,
        "hpAmplification": 4.0,
        "frontStrength": 2000.0,
        "backStrength": 0.0,
        "speedAmplification": 3.0,
        "healingStrength": 60.0,
        "shieldStrength": 60.0
      }
    ]
  }
];
