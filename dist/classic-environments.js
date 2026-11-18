// Original Zero-Sum investment environments. Source and known numerical adaptations: docs/classic-environments-research.md.
import {CLASSIC_ROSTER,TRAITS} from "./data.js?v=6.4.2";
export const CLASSIC_ENVIRONMENTS = [
  {
    "id": "secondhand",
    "name": "二手市场",
    "description": "商店刷新20次后，获得30金币和【员工投影仪】。",
    "image": "assets/environments/classic-secondhand.png",
    "source": "https://wiki.biligame.com/sr/二手市场"
  },
  {
    "id": "talent-reserve",
    "name": "人才储备",
    "description": "开局补给替换为3个随机 3费角色 。 3费角色 升至2/3星时，获得11%/33%速度增幅、22%/66%伤害增幅。",
    "image": "assets/environments/classic-talent-reserve.png",
    "source": "https://wiki.biligame.com/sr/人才储备"
  },
  {
    "id": "talent-import",
    "name": "人才引进",
    "description": "开局拥有1个随机 4费角色 。",
    "image": "assets/environments/classic-talent-import.png",
    "source": "https://wiki.biligame.com/sr/人才引进"
  },
  {
    "id": "accident-insurance",
    "name": "人身意外险",
    "description": "所有首领节点前都加入一个额外补给阶段。",
    "image": "assets/environments/classic-accident-insurance.png",
    "source": "https://wiki.biligame.com/sr/人身意外险"
  },
  {
    "id": "company-contract",
    "name": "公司契约",
    "description": "获得 【翡翠】 和 【砂金】 ，累计获得40利息后，获得【托帕&账账】。",
    "image": "assets/environments/classic-company-contract.png",
    "source": "https://wiki.biligame.com/sr/公司契约"
  },
  {
    "id": "labor-contract",
    "name": "劳务派遣合同",
    "description": "获得随机星徽，每次进入首领节点时，获得对应羁绊的随机角色。",
    "image": "assets/environments/classic-labor-contract.png",
    "source": "https://wiki.biligame.com/sr/劳务派遣合同"
  },
  {
    "id": "grail-contract",
    "name": "命运圣杯契约",
    "description": "获得 【远坂凛】 、 【吉尔伽美什】 ，完成两次圣杯试炼后，获得 【Archer】 。",
    "image": "assets/environments/classic-grail-contract.png",
    "source": "https://wiki.biligame.com/sr/命运圣杯契约"
  },
  {
    "id": "currency-issue",
    "name": "增发货币",
    "description": "第一/二/三位面开始时，获得一个6/8/12金币的晶矿。",
    "image": "assets/environments/classic-currency-issue.png",
    "source": "https://wiki.biligame.com/sr/增发货币"
  },
  {
    "id": "first-prismatic",
    "name": "头彩",
    "description": "第一个投资策略是棱彩品质。",
    "image": "assets/environments/classic-first-prismatic.png",
    "source": "https://wiki.biligame.com/sr/头彩"
  },
  {
    "id": "last-prismatic",
    "name": "尾彩",
    "description": "第三个投资策略是棱彩品质。",
    "image": "assets/environments/classic-last-prismatic.png",
    "source": "https://wiki.biligame.com/sr/尾彩"
  },
  {
    "id": "rainbow",
    "name": "彩虹时代",
    "description": "这局的投资策略均为棱彩品质。",
    "image": "assets/environments/classic-rainbow.png",
    "source": "https://wiki.biligame.com/sr/彩虹时代"
  },
  {
    "id": "success-experience",
    "name": "成功经验",
    "description": "在你升到8级后，进入接下来3个节点时，获得12经验。",
    "image": "assets/environments/classic-success-experience.png",
    "source": "https://wiki.biligame.com/sr/成功经验"
  },
  {
    "id": "war-frontier",
    "name": "战争边疆",
    "description": "第三位面的所有战斗节点都替换为遭遇节点。",
    "image": "assets/environments/classic-war-frontier.png",
    "source": "https://wiki.biligame.com/sr/战争边疆"
  },
  {
    "id": "sp-contract",
    "name": "战技点契约",
    "description": "获得 【丹恒•饮月】 和花火。打开20个晶矿后，获得火花和1个随机战技点羁绊角色，之后每打开10个晶矿，都可重复获得一次角色奖励。",
    "image": "assets/environments/classic-sp-contract.png",
    "source": "https://wiki.biligame.com/sr/战技点契约"
  },
  {
    "id": "elation-contract",
    "name": "欢愉契约",
    "description": "获得【银狼LV.999】，她每次触发独立羁绊【头号玩家】选项时，获得 【火花】 或 【开拓者•欢愉】 。",
    "image": "assets/environments/classic-elation-contract.png",
    "source": "https://wiki.biligame.com/sr/欢愉契约"
  },
  {
    "id": "deepwell",
    "name": "深井角斗场",
    "description": "本局首次达成5连胜时，获得【财富宝钻】。",
    "image": "assets/environments/classic-deepwell.png",
    "source": "https://wiki.biligame.com/sr/深井角斗场"
  },
  {
    "id": "gunpowder",
    "name": "火药味",
    "description": "开局时获得2个简易武装箱。",
    "image": "assets/environments/classic-gunpowder.png",
    "source": "https://wiki.biligame.com/sr/火药味"
  },
  {
    "id": "privileged-class",
    "name": "特权阶级",
    "description": "第二位面开始时，获得1个特权武装箱。",
    "image": "assets/environments/classic-privileged-class.png",
    "source": "https://wiki.biligame.com/sr/特权阶级"
  },
  {
    "id": "silver-age",
    "name": "白银时代",
    "description": "这局的投资策略均为白银品质，因此敌人难度不会由于选择高品质投资策略而提高。",
    "image": "assets/environments/classic-silver-age.png",
    "source": "https://wiki.biligame.com/sr/白银时代"
  },
  {
    "id": "strategy-master",
    "name": "策略大师",
    "description": "获取投资策略时，获得（2*已拥有投资策略数）的金币。在3-5节点额外获得一个投资策略。",
    "image": "assets/environments/classic-strategy-master.png",
    "source": "https://wiki.biligame.com/sr/策略大师"
  },
  {
    "id": "red-nobility",
    "name": "红钻贵族",
    "description": "开局时拥有【红钻】和一个【简易武装箱】。",
    "image": "assets/environments/classic-red-nobility.png",
    "source": "https://wiki.biligame.com/sr/红钻贵族"
  },
  {
    "id": "joint-decision",
    "name": "联席决策",
    "description": "在2-6节点进行一次额外的投资策略三选一。",
    "image": "assets/environments/classic-joint-decision.png",
    "source": "https://wiki.biligame.com/sr/联席决策"
  },
  {
    "id": "blue-ocean",
    "name": "蓝海",
    "description": "进入到一个随机投资环境中，开局额外获得6金币。",
    "image": "assets/environments/classic-blue-ocean.png",
    "source": "https://wiki.biligame.com/sr/蓝海"
  },
  {
    "id": "blue-nobility",
    "name": "蓝钻贵族",
    "description": "开局时拥有【蓝钻】和一个【简易武装箱】。",
    "image": "assets/environments/classic-blue-nobility.png",
    "source": "https://wiki.biligame.com/sr/蓝钻贵族"
  },
  {
    "id": "rotation",
    "name": "轮岗",
    "description": "备战阶段开始时，使一个随机费用的刷新概率翻倍，每个备战阶段重新随机。",
    "image": "assets/environments/classic-rotation.png",
    "source": "https://wiki.biligame.com/sr/轮岗"
  },
  {
    "id": "excess-budget",
    "name": "过剩经费",
    "description": "补给阶段中，角色会携带两件装备。",
    "image": "assets/environments/classic-excess-budget.png",
    "source": "https://wiki.biligame.com/sr/过剩经费"
  },
  {
    "id": "evolution-algorithm",
    "name": "进化算法",
    "description": "进入新节点时，所有场上角色获得4%前后台强度和2%伤害减免，该效果可叠加。",
    "image": "assets/environments/classic-evolution-algorithm.png",
    "source": "https://wiki.biligame.com/sr/进化算法"
  },
  {
    "id": "quantum-contract",
    "name": "量子同频契约",
    "description": "花火和缇宝升星时，随机获得 【符玄】 或 【希儿】 。",
    "image": "assets/environments/classic-quantum-contract.png",
    "source": "https://wiki.biligame.com/sr/量子同频契约"
  },
  {
    "id": "silver-gold-prismatic",
    "name": "银•金•彩",
    "description": "本局在固定节点进行投资策略选择时，左、中、右的选项分别为银金彩品质，并且投资策略刷新次数+2。",
    "image": "assets/environments/classic-silver-gold-prismatic.png",
    "source": "https://wiki.biligame.com/sr/银•金•彩"
  },
  {
    "id": "long-positive",
    "name": "长线利好",
    "description": "花费金币进行30次刷新后，获得20金币，之后在本局游戏中，只需要1金币就能刷新。",
    "image": "assets/environments/classic-long-positive.png",
    "source": "https://wiki.biligame.com/sr/长线利好"
  },
  {
    "id": "gold-age",
    "name": "黄金时代",
    "description": "这局的投资策略均为黄金品质。",
    "image": "assets/environments/classic-gold-age.png",
    "source": "https://wiki.biligame.com/sr/黄金时代"
  },
  {
    "id": "invite-luofu",
    "name": "仙舟邀请",
    "description": "获得一个【仙舟星徽】。",
    "trait": "luofu",
    "items": [
      "trait-luofu"
    ],
    "image": "assets/environments/classic-invite-luofu.png",
    "source": "https://wiki.biligame.com/sr/仙舟邀请"
  },
  {
    "id": "concept-luofu",
    "name": "仙舟概念股",
    "description": "开局时获得【仙舟】角色和初始简易装备，【仙舟】角色的刷新概率提高。",
    "trait": "luofu",
    "characters": [
      "1217",
      "1213"
    ],
    "items": [
      "knife"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-luofu.png",
    "source": "https://wiki.biligame.com/sr/仙舟概念股"
  },
  {
    "id": "invite-debuff",
    "name": "减益邀请",
    "description": "获得一个【减益星徽】。",
    "trait": "debuff",
    "items": [
      "trait-debuff"
    ],
    "image": "assets/environments/classic-invite-debuff.png",
    "source": "https://wiki.biligame.com/sr/减益邀请"
  },
  {
    "id": "concept-debuff",
    "name": "减益概念股",
    "description": "开局时获得【减益】角色和初始简易装备，【减益】角色的刷新概率提高。",
    "trait": "debuff",
    "characters": [
      "1106",
      "1308"
    ],
    "items": [
      "pistol"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-debuff.png",
    "source": "https://wiki.biligame.com/sr/减益概念股"
  },
  {
    "id": "invite-break",
    "name": "击破邀请",
    "description": "获得一个【击破星徽】。",
    "trait": "break",
    "items": [
      "trait-break"
    ],
    "image": "assets/environments/classic-invite-break.png",
    "source": "https://wiki.biligame.com/sr/击破邀请"
  },
  {
    "id": "concept-break",
    "name": "击破概念股",
    "description": "开局时获得【击破】角色和初始简易装备，【击破】角色的刷新概率提高。",
    "trait": "break",
    "characters": [
      "1225",
      "1317"
    ],
    "items": [
      "drill"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-break.png",
    "source": "https://wiki.biligame.com/sr/击破概念股"
  },
  {
    "id": "invite-express",
    "name": "列车同行邀请",
    "description": "获得一个【列车同行星徽】。",
    "trait": "express",
    "items": [
      "trait-express"
    ],
    "image": "assets/environments/classic-invite-express.png",
    "source": "https://wiki.biligame.com/sr/列车同行邀请"
  },
  {
    "id": "concept-express",
    "name": "列车同行概念股",
    "description": "开局时获得【列车同行】角色和初始简易装备，【列车同行】角色的刷新概率提高。",
    "trait": "express",
    "characters": [
      "1001",
      "1003"
    ],
    "items": [
      "star"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-express.png",
    "source": "https://wiki.biligame.com/sr/列车同行概念股"
  },
  {
    "id": "invite-grail",
    "name": "命运圣杯邀请",
    "description": "获得1个【命运圣杯星徽】。",
    "trait": "grail",
    "items": [
      "trait-grail"
    ],
    "image": "assets/environments/classic-invite-grail.png",
    "source": "https://wiki.biligame.com/sr/命运圣杯邀请"
  },
  {
    "id": "invite-night",
    "name": "夜之半神邀请",
    "description": "获得一个【夜之半神星徽】。",
    "trait": "night",
    "items": [
      "trait-night"
    ],
    "image": "assets/environments/classic-invite-night.png",
    "source": "https://wiki.biligame.com/sr/夜之半神邀请"
  },
  {
    "id": "concept-night",
    "name": "夜之半神概念股",
    "description": "开局时获得【夜之半神】角色和初始简易装备，【夜之半神】角色的刷新概率提高。",
    "trait": "night",
    "characters": [
      "1406",
      "1413"
    ],
    "items": [
      "pistol"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-night.png",
    "source": "https://wiki.biligame.com/sr/夜之半神概念股"
  },
  {
    "id": "invite-sp",
    "name": "战技点邀请",
    "description": "获得一个【战技点星徽】。",
    "trait": "sp",
    "items": [
      "trait-sp"
    ],
    "image": "assets/environments/classic-invite-sp.png",
    "source": "https://wiki.biligame.com/sr/战技点邀请"
  },
  {
    "id": "invite-dot",
    "name": "持续伤害邀请",
    "description": "获得一个【持续伤害星徽】。",
    "trait": "dot",
    "items": [
      "trait-dot"
    ],
    "image": "assets/environments/classic-invite-dot.png",
    "source": "https://wiki.biligame.com/sr/持续伤害邀请"
  },
  {
    "id": "invite-wanderer",
    "name": "星间旅人邀请",
    "description": "获得一个【星间旅人星徽】。",
    "trait": "wanderer",
    "items": [
      "trait-wanderer"
    ],
    "image": "assets/environments/classic-invite-wanderer.png",
    "source": "https://wiki.biligame.com/sr/星间旅人邀请"
  },
  {
    "id": "concept-wanderer",
    "name": "星间旅人概念股",
    "description": "开局时获得【星间旅人】角色和初始简易装备，【星间旅人】角色的刷新概率提高。",
    "trait": "wanderer",
    "characters": [
      "1302",
      "1305"
    ],
    "items": [
      "drill"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-wanderer.png",
    "source": "https://wiki.biligame.com/sr/星间旅人概念股"
  },
  {
    "id": "invite-day",
    "name": "昼之半神邀请",
    "description": "获得一个【昼之半神星徽】。",
    "trait": "day",
    "items": [
      "trait-day"
    ],
    "image": "assets/environments/classic-invite-day.png",
    "source": "https://wiki.biligame.com/sr/昼之半神邀请"
  },
  {
    "id": "concept-day",
    "name": "昼之半神概念股",
    "description": "开局时获得【昼之半神】角色和初始简易装备，【昼之半神】角色的刷新概率提高。",
    "trait": "day",
    "characters": [
      "1402",
      "1403"
    ],
    "items": [
      "skates"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-day.png",
    "source": "https://wiki.biligame.com/sr/昼之半神概念股"
  },
  {
    "id": "invite-elation",
    "name": "欢愉邀请",
    "description": "获得一个【欢愉星徽】。",
    "trait": "elation",
    "items": [
      "trait-elation"
    ],
    "image": "assets/environments/classic-invite-elation.png",
    "source": "https://wiki.biligame.com/sr/欢愉邀请"
  },
  {
    "id": "invite-blood",
    "name": "燃血邀请",
    "description": "获得一个【燃血星徽】。",
    "trait": "blood",
    "items": [
      "trait-blood"
    ],
    "image": "assets/environments/classic-invite-blood.png",
    "source": "https://wiki.biligame.com/sr/燃血邀请"
  },
  {
    "id": "concept-blood",
    "name": "燃血概念股",
    "description": "开局时获得【燃血】角色和初始简易装备，【燃血】角色的刷新概率提高。",
    "trait": "blood",
    "characters": [
      "1409",
      "1205"
    ],
    "items": [
      "flower"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-blood.png",
    "source": "https://wiki.biligame.com/sr/燃血概念股"
  },
  {
    "id": "invite-wolfpack",
    "name": "狼狩邀请",
    "description": "获得一个【狼狩星徽】。",
    "trait": "wolfpack",
    "items": [
      "trait-wolfpack"
    ],
    "image": "assets/environments/classic-invite-wolfpack.png",
    "source": "https://wiki.biligame.com/sr/狼狩邀请"
  },
  {
    "id": "concept-wolfpack",
    "name": "狼狩概念股",
    "description": "开局时获得【狼狩】角色和初始简易装备，【狼狩】角色的刷新概率提高。",
    "trait": "wolfpack",
    "characters": [
      "1218",
      "1220"
    ],
    "items": [
      "flower"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-wolfpack.png",
    "source": "https://wiki.biligame.com/sr/狼狩概念股"
  },
  {
    "id": "invite-festival",
    "name": "盛会之星邀请",
    "description": "获得一个【盛会之星星徽】。",
    "trait": "festival",
    "items": [
      "trait-festival"
    ],
    "image": "assets/environments/classic-invite-festival.png",
    "source": "https://wiki.biligame.com/sr/盛会之星邀请"
  },
  {
    "id": "invite-aoe",
    "name": "群攻邀请",
    "description": "获得一个【群攻星徽】。",
    "trait": "aoe",
    "items": [
      "trait-aoe"
    ],
    "image": "assets/environments/classic-invite-aoe.png",
    "source": "https://wiki.biligame.com/sr/群攻邀请"
  },
  {
    "id": "concept-aoe",
    "name": "群攻概念股",
    "description": "开局时获得【群攻】角色和初始简易装备，【群攻】角色的刷新概率提高。",
    "trait": "aoe",
    "characters": [
      "1013",
      "1405"
    ],
    "items": [
      "drill"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-aoe.png",
    "source": "https://wiki.biligame.com/sr/群攻概念股"
  },
  {
    "id": "invite-energy",
    "name": "能量邀请",
    "description": "获得一个【能量星徽】。",
    "trait": "energy",
    "items": [
      "trait-energy"
    ],
    "image": "assets/environments/classic-invite-energy.png",
    "source": "https://wiki.biligame.com/sr/能量邀请"
  },
  {
    "id": "concept-energy",
    "name": "能量概念股",
    "description": "开局时获得【能量】角色和初始简易装备，【能量】角色的刷新概率提高。",
    "trait": "energy",
    "characters": [
      "1402",
      "1217"
    ],
    "items": [
      "battery"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-energy.png",
    "source": "https://wiki.biligame.com/sr/能量概念股"
  },
  {
    "id": "invite-belobog",
    "name": "贝洛伯格邀请",
    "description": "获得一个【贝洛伯格星徽】。",
    "trait": "belobog",
    "items": [
      "trait-belobog"
    ],
    "image": "assets/environments/classic-invite-belobog.png",
    "source": "https://wiki.biligame.com/sr/贝洛伯格邀请"
  },
  {
    "id": "concept-belobog",
    "name": "贝洛伯格概念股",
    "description": "开局时获得【贝洛伯格】角色和初始简易装备，【贝洛伯格】角色的刷新概率提高。",
    "trait": "belobog",
    "characters": [
      "1108",
      "1102"
    ],
    "items": [
      "armor"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-belobog.png",
    "source": "https://wiki.biligame.com/sr/贝洛伯格概念股"
  },
  {
    "id": "invite-follow",
    "name": "追击邀请",
    "description": "获得一个【追击星徽】。",
    "trait": "follow",
    "items": [
      "trait-follow"
    ],
    "image": "assets/environments/classic-invite-follow.png",
    "source": "https://wiki.biligame.com/sr/追击邀请"
  },
  {
    "id": "concept-follow",
    "name": "追击概念股",
    "description": "开局时获得【追击】角色和初始简易装备，【追击】角色的刷新概率提高。",
    "trait": "follow",
    "characters": [
      "1220",
      "1305"
    ],
    "items": [
      "skates"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-follow.png",
    "source": "https://wiki.biligame.com/sr/追击概念股"
  },
  {
    "id": "invite-quantum",
    "name": "量子同频邀请",
    "description": "获得一个【量子同频星徽】。",
    "trait": "quantum",
    "items": [
      "trait-quantum"
    ],
    "image": "assets/environments/classic-invite-quantum.png",
    "source": "https://wiki.biligame.com/sr/量子同频邀请"
  },
  {
    "id": "invite-scholar",
    "name": "银河学者邀请",
    "description": "获得一个【银河学者星徽】。",
    "trait": "scholar",
    "items": [
      "trait-scholar"
    ],
    "image": "assets/environments/classic-invite-scholar.png",
    "source": "https://wiki.biligame.com/sr/银河学者邀请"
  },
  {
    "id": "concept-scholar",
    "name": "银河学者概念股",
    "description": "开局时获得【银河学者】角色和初始简易装备，【银河学者】角色的刷新概率提高。",
    "trait": "scholar",
    "characters": [
      "1009",
      "1303"
    ],
    "items": [
      "battery"
    ],
    "note": "同费用内该羁绊角色抽取权重×2；原版未公开具体倍率。",
    "image": "assets/environments/classic-concept-scholar.png",
    "source": "https://wiki.biligame.com/sr/银河学者概念股"
  }
];
const byId=new Map(CLASSIC_ENVIRONMENTS.map(e=>[e.id,e]));
const clone=value=>JSON.parse(JSON.stringify(value));
const gold=amount=>({kind:'gold',amount}),item=id=>({kind:'item',id}),hero=id=>({kind:'character',id:String(id)}),chest=quality=>({kind:'chest',quality:quality||'basic'});
const fail=message=>({ok:false,message,rewards:[]});
function random(state){let x=state.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.rng=x>>>0;return state.rng/4294967296;}
const pick=(state,pool)=>pool[Math.floor(random(state)*pool.length)];
const sample=(state,pool,n)=>{pool=[...pool];const out=[];while(out.length<n&&pool.length)out.push(pool.splice(Math.floor(random(state)*pool.length),1)[0]);return out;};
const blank=()=>({id:null,choices:[],rerolls:1,selectedFrom:null,counters:{refreshes:0,paidRefreshes:0,interest:0,loot:0,experienceNodes:0,strategies:0},claimed:[],seenNodes:[],seenBattles:[],rotationCost:null,laborTrait:null,starSnapshot:{},seenHacks:[]});
export const getEnvironment=id=>byId.get(id);
export const getActiveEnvironment=state=>byId.get(state.environment?.id);
// These original environments require standard-only interest or node labels. Do not
// offer a visibly ineffective rule in the compressed overclock route.
export const getAvailableEnvironments=state=>CLASSIC_ENVIRONMENTS.filter(e=>state.flow?.mode!=='overclock'||!['company-contract','joint-decision','strategy-master','war-frontier'].includes(e.id));
export function initEnvironment(state,{enabled=false}={}){
 state.environment=blank();
 if(enabled)state.environment.choices=sample(state,getAvailableEnvironments(state).map(e=>e.id),3);
 return state.environment;
}
export function rerollEnvironments(state){
 const e=state.environment;
 if(!e||e.id||e.rerolls<1||e.choices.length!==3)return fail('没有剩余的投资环境刷新次数。');
 e.choices=sample(state,getAvailableEnvironments(state).filter(def=>!e.choices.includes(def.id)).map(def=>def.id),3);e.rerolls--;
 return {ok:true,message:'已刷新投资环境',rewards:[]};
}
export function chooseEnvironment(state,id){
 const e=state.environment,selected=byId.get(id);
 if(!e||e.id||!selected||!e.choices.includes(id))return fail('请选择本次提供的投资环境。');
 e.id=id;e.selectedFrom=id;e.choices=[];
 if(id==='blue-ocean'){e.id=pick(state,getAvailableEnvironments(state).filter(def=>def.id!==id)).id;}
 const def=byId.get(e.id),rewards=[];
 if(id==='blue-ocean')rewards.push(gold(6));
 let replaceStarter=false;
 if(def.id.startsWith('concept-')){replaceStarter=true;rewards.push(...def.characters.map(hero),...def.items.map(item));}
 if(def.id.startsWith('invite-'))rewards.push(...def.items.map(item));
 if(def.id==='company-contract'){replaceStarter=true;rewards.push(hero('1314'),hero('1304'));}
 if(def.id==='grail-contract'){replaceStarter=true;rewards.push(hero('1508'),hero('1509'));}
 if(def.id==='sp-contract'){replaceStarter=true;rewards.push(hero('1213'),hero('1306'));}
 if(def.id==='elation-contract')rewards.push(hero('1506'));
 if(def.id==='talent-import')rewards.push(hero(pick(state,CLASSIC_ROSTER.filter(c=>c.cost===4)).id));
 if(def.id==='talent-reserve'){replaceStarter=true;rewards.push(...sample(state,CLASSIC_ROSTER.filter(c=>c.cost===3),3).map(c=>hero(c.id)));}
 if(def.id==='gunpowder')rewards.push(chest(),chest());
 if(def.id==='red-nobility')rewards.push(item('red-gem'),chest());
 if(def.id==='blue-nobility')rewards.push(item('blue-gem'),chest());
 if(def.id==='labor-contract'){e.laborTrait=pick(state,CLASSIC_ENVIRONMENTS.filter(d=>d.id.startsWith('invite-'))).trait;rewards.push(item('trait-'+e.laborTrait));}
 if(def.id==='currency-issue'){rewards.push(gold(6));e.claimed.push('currency-plane-1');}
 if(def.id==='rotation')e.rotationCost=1+Math.floor(random(state)*5);
 for(const u of state.units||[])e.starSnapshot[u.uid]=u.star;
 return {ok:true,message:`投资环境：${def.name}`,rewards,replaceStarter};
}
const grantOnce=(record,key,rewards,out)=>{if(!record.claimed.includes(key)){record.claimed.push(key);out.push(...rewards);}};
// Called only after successful management / battle operations. The engine queues these
// rewards as clickable crystals; the module never assumes room on the bench.
export function onEnvironmentEvent(state,event={}){
 const e=state.environment,def=getActiveEnvironment(state);if(!e||!def)return [];
 const out=[],id=def.id,c=e.counters;
 if(event.type==='refresh'){c.refreshes++;if(event.paid)c.paidRefreshes++;}
 if(event.type==='interest')c.interest+=Math.max(0,Number(event.amount)||0);
 if(event.type==='collect-loot')c.loot++;
 if(event.type==='strategy'){
  c.strategies=Number.isInteger(event.count)?event.count:state.strategies.length;
  if(id==='strategy-master')grantOnce(e,`strategy-${c.strategies}`,[gold(2*c.strategies)],out);
 }
 if(event.type==='node'){
  const key=String(event.key??event.label??state.round);
  if(e.seenNodes.includes(key))return out;
  e.seenNodes.push(key);
  const plane=event.plane||1;
  if(id==='currency-issue')grantOnce(e,`currency-plane-${plane}`,[gold([0,6,8,12][Math.min(3,plane)])],out);
  if(id==='privileged-class'&&plane===2)grantOnce(e,'privileged-plane-2',[chest('privileged')],out);
  if(id==='success-experience'&&state.level>=8&&c.experienceNodes<3){c.experienceNodes++;out.push({kind:'xp',amount:12});}
  if(id==='rotation')e.rotationCost=1+Math.floor(random(state)*5);
  if(id==='labor-contract'&&event.boss){const pool=CLASSIC_ROSTER.filter(c=>c.traits.includes(e.laborTrait));if(pool.length)out.push(hero(pick(state,pool).id));}
  if(id==='evolution-algorithm')for(const u of state.units.filter(u=>u.zone!=='bench'))u.environmentStacks=(u.environmentStacks||0)+1;
 }
 if(event.type==='battle'){
  const b=event.battle||state.lastBattle||{},key=String(event.key??b.nodeLabel??b.round??state.round);
  if(!e.seenBattles.includes(key)){
   e.seenBattles.push(key);
   if(id==='deepwell'&&state.streak>=5)grantOnce(e,'deepwell-five',[item('wealth-gem')],out);
  }
 }
 if(id==='secondhand'&&c.refreshes>=20)grantOnce(e,'secondhand-20',[gold(30),item('projector')],out);
 if(id==='long-positive'&&c.paidRefreshes>=30)grantOnce(e,'long-positive-30',[gold(20)],out);
 if(id==='company-contract'&&c.interest>=40)grantOnce(e,'company-40',[hero('1112')],out);
 if(id==='grail-contract'&&(state.progression?.grail?.completed.length||0)>=2)grantOnce(e,'grail-two',[hero('1015')],out);
 if(id==='sp-contract'&&c.loot>=20){for(let threshold=20;threshold<=c.loot;threshold+=10){const key=`sp-loot-${threshold}`;if(!e.claimed.includes(key)){const pool=CLASSIC_ROSTER.filter(c=>c.traits.includes('sp'));grantOnce(e,key,[hero('1501'),hero(pick(state,pool).id)],out);}}}
 if(id==='elation-contract')for(const cost of state.progression?.gamer?.claimedCosts||[])if(!e.seenHacks.includes(cost)){e.seenHacks.push(cost);out.push(hero(pick(state,['1501','8009'])));}
 if(id==='quantum-contract'&&event.type==='roster')for(const u of state.units||[]){
  const previous=e.starSnapshot[u.uid]||1;
  if(['1306','1403'].includes(u.characterId)&&u.star>previous)for(let star=previous+1;star<=u.star;star++)out.push(hero(pick(state,['1208','1102'])));
  e.starSnapshot[u.uid]=u.star;
 }
 return out;
}
export function getEnvironmentShopWeight(state,character){const def=getActiveEnvironment(state);return def?.id.startsWith('concept-')&&character?.traits.includes(def.trait)?2:1;}
export function getEnvironmentShopOdds(state,baseOdds){
 const cost=state.environment?.id==='rotation'?state.environment.rotationCost:null;
 if(!cost)return [...baseOdds];
 const weights=baseOdds.map((n,i)=>n*(i===cost-1?2:1)),total=weights.reduce((a,b)=>a+b,0);
 return weights.map(n=>n/total*100);
}
export function getEnvironmentRefreshCost(state,normalCost){return normalCost>0&&state.environment?.id==='long-positive'&&state.environment.claimed.includes('long-positive-30')?1:normalCost;}
export function getEnvironmentStrategyRarity(state,ordinal,slot=0){
 const id=state.environment?.id;
 if(id==='silver-age')return '白银';if(id==='gold-age')return '黄金';if(id==='rainbow')return '棱彩';
 if(id==='first-prismatic'&&ordinal===1||id==='last-prismatic'&&ordinal===3)return '棱彩';
 if(id==='silver-gold-prismatic')return ['白银','黄金','棱彩'][slot%3];
 return null;
}
export function getEnvironmentRules(state){const id=state.environment?.id;return {
 extraBossSupply:id==='accident-insurance',extraStrategyLabels:id==='joint-decision'?['2-6']:id==='strategy-master'?['3-5']:[],
 supplyEquipmentCount:id==='excess-budget'?2:1,thirdPlaneEncounters:id==='war-frontier',strategyRerollsBonus:id==='silver-gold-prismatic'?2:0,
 };}
export function getEnvironmentUnitModifiers(state,unit){
 const id=state.environment?.id,out={};
 if(id==='evolution-algorithm'){out.frontPower=(unit.environmentStacks||0)*.04;out.backPower=out.frontPower;out.damageReduction=(unit.environmentStacks||0)*.02;}
 const character=CLASSIC_ROSTER.find(c=>c.id===unit.characterId),cost=unit.recruitCost||character?.cost;
 if(id==='talent-reserve'&&cost===3&&unit.star>=2){out.speedPct=unit.star>=3?.33:.11;out.damageAmp=unit.star>=3?.66:.22;}
 return out;
}
export function getEnvironmentProgress(state){
 const e=state.environment,def=getActiveEnvironment(state);if(!def)return '';
 const c=e.counters;
 if(def.id==='company-contract')return `累计利息 ${Math.min(40,c.interest)}/40${e.claimed.includes('company-40')?' · 契约完成':''}`;
 if(def.id==='secondhand')return `商店刷新 ${Math.min(20,c.refreshes)}/20${e.claimed.includes('secondhand-20')?' · 契约完成':''}`;
 if(def.id==='long-positive')return e.claimed.includes('long-positive-30')?'刷新费用已降至1金币':`付费刷新 ${Math.min(30,c.paidRefreshes)}/30`;
 if(def.id==='deepwell')return e.claimed.includes('deepwell-five')?'已获得财富宝钻':`连胜 ${Math.max(0,state.streak)}/5`;
 if(def.id==='success-experience')return state.level<8?'达到8级后开始派发经验':`经验晶矿 ${c.experienceNodes}/3`;
 if(def.id==='grail-contract')return `圣杯试炼 ${Math.min(2,state.progression?.grail?.completed.length||0)}/2`;
 if(def.id==='sp-contract')return `已打开 ${c.loot} 个晶矿 · 下次奖励 ${c.loot<20?20:Math.floor((c.loot-20)/10)*10+30}`;
 if(def.id==='rotation')return `本节点 ${e.rotationCost} 费概率权重翻倍`;
 if(def.id==='labor-contract')return `${TRAITS.find(t=>t.id===e.laborTrait)?.name||''} · 首领节点派遣`;
 return def.description;
}
export function validateEnvironment(state){
 const e=state.environment;if(e===undefined)return true; // Legacy runs have no environment.
 if(!e||typeof e!=='object'||Array.isArray(e)||(e.id!==null&&!byId.has(e.id)))return false;
 if(e.selectedFrom!==null&&!byId.has(e.selectedFrom))return false;
 if(!Array.isArray(e.choices)||![0,3].includes(e.choices.length)||new Set(e.choices).size!==e.choices.length||!e.choices.every(id=>byId.has(id)))return false;
 if(e.id&&e.choices.length||!Number.isInteger(e.rerolls)||e.rerolls<0||e.rerolls>1)return false;
 if(!e.counters||Object.keys(blank().counters).some(key=>!Number.isSafeInteger(e.counters[key])||e.counters[key]<0))return false;
 for(const key of ['claimed','seenNodes','seenBattles'])if(!Array.isArray(e[key])||e[key].some(v=>typeof v!=='string')||new Set(e[key]).size!==e[key].length)return false;
 if(!Array.isArray(e.seenHacks)||e.seenHacks.some(n=>![3,4,5].includes(n)))return false;
 if(e.rotationCost!==null&&(!Number.isInteger(e.rotationCost)||e.rotationCost<1||e.rotationCost>5))return false;
 if(e.laborTrait!==null&&!TRAITS.some(t=>t.id===e.laborTrait))return false;
 if(!e.starSnapshot||typeof e.starSnapshot!=='object'||Array.isArray(e.starSnapshot)||Object.values(e.starSnapshot).some(n=>![1,2,3].includes(n)))return false;
 if((state.units||[]).some(u=>u.environmentStacks!==undefined&&(!Number.isSafeInteger(u.environmentStacks)||u.environmentStacks<0)))return false;
 return true;
}
