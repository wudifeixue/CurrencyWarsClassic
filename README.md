# 货币战争 · 经典回响

一个受《崩坏：星穹铁道》3.7 版本「货币战争·零和博弈」启发的非官方浏览器策略小游戏。把体验集中在刷商店、选角色、追三星、配装备和选投资策略上，战斗采用轻量自动结算。

当前版本包含 **24 名角色、12 个关卡、阵容羁绊、装备合成、投资策略选择和本地自动存档**。纯 HTML、CSS 和 JavaScript，无需安装前端依赖或连接游戏账号。

## 怎么玩

1. 从商店招募角色，再把备战席中的角色安排到前台或后台。
2. 观察羁绊计数，把金币用于补齐阵容、刷新商店或购买经验扩大团队。
3. 收集三张同星同角色自动升星；两件简易装备可以合成一件进阶装备。
4. 在投资策略选择中决定经济、输出或生存方向，再为主力分配装备。
5. 准备完成后开始战斗，查看结算并继续挑战，完成全部 12 关。

保留金币可以获得利息。商店锁定、角色出售与装备调整，能帮助你在当前强度和后续收益之间取舍。

进度保存在当前浏览器的 `localStorage` 中，重新打开同一网址可继续。存档不会跨浏览器、跨设备或在本地地址与 GitHub Pages 之间同步；清除网站数据会删除进度。

## 本地运行

需要 Python 3。在仓库根目录运行：

```sh
python3 -m http.server 4173 --directory dist
```

打开 [http://localhost:4173](http://localhost:4173)。也可以使用 `npm start` 启动相同服务。页面使用 JavaScript 模块，请通过 HTTP 服务访问。

使用 Node.js 22 或更新版本运行规则测试：

```sh
node --test tests/*.test.mjs
```

或运行 `npm test`。本项目没有需要 `npm install` 的运行依赖，也没有额外构建步骤；`dist/` 就是可部署的网站。

## 与经典版的关系

3.7 原版的主要机制包括：五格角色商店、1–5 费角色、2 金币刷新、锁店、购买经验提升人口、同星角色三合一、前后台站位、羁绊、装备合成、投资环境与投资策略，以及三个不同位面的挑战。机制参考：[3.7 入门介绍与操作技巧](https://www.miyoushe.com/zzz/article/70549693)、[货币战争玩法说明](https://wiki.biligame.com/sr/货币战争)。

本项目保留其中的构筑和经济循环，并做了以下改编：

| 内容 | 本项目的处理 |
| --- | --- |
| 角色与卡池 | 选取 24 名熟悉的角色；费用、属性、羁绊归属采用本项目设定。 |
| 羁绊 | 使用自定义门槛和加成，包括部分为简化构筑而设计的羁绊。 |
| 装备与策略 | 保留简易装备合成、策略三选一等交互；数值、部分名称、配方和效果为自制。 |
| 战斗 | 依据阵容属性、站位、升星、装备和羁绊自动计算，未逐一复刻角色技能、战技点、能量与行动值系统。 |
| 关卡 | 压缩成 12 关的独立单局，不照搬原版节点流程与难度曲线。 |
| 角色养成 | 所有玩家使用统一基础数据，不读取游戏内星魂、遗器或光锥。 |

因此，这是一款寻找经典选卡乐趣的独立改编作品。页面中的技能名用于表现角色主题，不表示已完整实现原游戏技能；它也不能用于预测原版阵容强度。

## GitHub Pages

仓库为 [wudifeixue/CurrencyWarsClassic](https://github.com/wudifeixue/CurrencyWarsClassic)。部署成功后，默认访问地址为 [https://wudifeixue.github.io/CurrencyWarsClassic/](https://wudifeixue.github.io/CurrencyWarsClassic/)。

在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。推送到 `main` 或手动运行 `Deploy to GitHub Pages` 工作流后，会先执行规则测试，测试成功才上传 `dist/` 并部署。工作流仅发布静态文件，不需要服务器或额外密钥。

部署配置参考 GitHub 官方的 [自定义 Pages 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 项目结构

```text
dist/                       网站文件，可直接静态托管
  index.html                页面入口
  data.js                   角色、羁绊、装备和策略数据
  assets/characters/        角色图片
tests/                      Node.js 规则测试
.github/workflows/pages.yml 测试与 Pages 部署
```

## 资源来源与版权

角色图片来自社区整理的 [Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes)，保存在 `dist/assets/characters/`。该资源库标注 [AGPL-3.0 许可](https://github.com/Mar-7th/StarRailRes/blob/master/LICENSE)。图片及《崩坏：星穹铁道》角色、名称、商标等原作内容的权利属于 HoYoverse／米哈游及相应权利人；本项目不主张这些素材的所有权。

本项目为玩家自制体验，与 HoYoverse／米哈游无隶属关系，也未获得官方背书。程序界面与简化规则为本项目编写；第三方素材的来源和权利说明独立保留。

## 后续可以扩展

- 按明确的历史版本补充角色、原版羁绊与装备配方，并保留版本切换。
- 增加真正的角色专属效果、能量循环与可解释的战斗日志。
- 增加投资环境、事件节点、更多首领和不同难度。
- 增加存档导入导出、种子对局和阵容分享。

扩展内容应继续让选卡、组队和经济决策影响结果，避免只增加数值与界面上的条目。
