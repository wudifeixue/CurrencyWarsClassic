# Character artwork sources

This non-official fan prototype uses character illustrations from **Honkai: Star Rail**. Character names and game artwork belong to their respective rights holders, HoYoverse / miHoYo.

The files were downloaded on 2026-11-13 from the public [Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes) resource repository, specifically [`image/character_preview`](https://github.com/Mar-7th/StarRailRes/tree/master/image/character_preview). The repository lists AGPL-3.0; that repository declaration is not a claim of ownership of the underlying game artwork.

Each local PNG is an unchanged transparent **376 × 512** source image. Total size: **6,513,733 bytes**. Filenames correspond to game character IDs.

Source URL pattern: `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/image/character_preview/<ID>.png`

## Square portrait cards

The matching 24 square portraits in `portraits/` were downloaded unchanged on 2026-11-13 from [`icon/character`](https://github.com/Mar-7th/StarRailRes/tree/master/icon/character) in the same resource repository. Each PNG is **256 × 256**, and the total size is **2,912,640 bytes**. They use the same character IDs and rights attribution as the previews below.

Source URL pattern: `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/character/<ID>.png`

## Interface illustrations

The 17 vector equipment illustrations in `equipment/`, 12 white trait symbols in `traits/`, and gold hexagonal currency token in `ui/coin.svg` were drawn specifically for this fan adaptation. These are original SVG interface assets, not extracted official Currency Wars equipment icons. The equipment and coin drawings use transparent 80 × 80 view boxes; trait symbols use 48 × 48 view boxes. Equipment and trait filenames match the IDs in `data.js`.

| Local file | Character |
| --- | --- |
| `characters/1001.png` | 三月七 |
| `characters/1002.png` | 丹恒 |
| `characters/1003.png` | 姬子 |
| `characters/1004.png` | 瓦尔特 |
| `characters/1005.png` | 卡芙卡 |
| `characters/1006.png` | 银狼 |
| `characters/1008.png` | 阿兰 |
| `characters/1009.png` | 艾丝妲 |
| `characters/1013.png` | 黑塔 |
| `characters/1101.png` | 布洛妮娅 |
| `characters/1102.png` | 希儿 |
| `characters/1103.png` | 希露瓦 |
| `characters/1104.png` | 杰帕德 |
| `characters/1105.png` | 娜塔莎 |
| `characters/1106.png` | 佩拉 |
| `characters/1107.png` | 克拉拉 |
| `characters/1108.png` | 桑博 |
| `characters/1109.png` | 虎克 |
| `characters/1201.png` | 青雀 |
| `characters/1202.png` | 停云 |
| `characters/1203.png` | 罗刹 |
| `characters/1204.png` | 景元 |
| `characters/1205.png` | 刃 |
| `characters/1208.png` | 符玄 |


## Classic roster expansion (2026-11-13)

The Zero-Sum Strategy roster now references 72 square portraits. The 53 newly needed portraits were downloaded unchanged from the same [StarRailRes character icon directory](https://github.com/Mar-7th/StarRailRes/tree/master/icon/character), using the verified game IDs in `classic-roster.js`. Existing full character previews are retained; newly added characters use their square portrait as their fallback illustration. No remote image dependency remains in the game.

The 44 `equipment/classic-<id>.png` images are unchanged original game equipment illustrations from the [BWIKI equipment reference](https://wiki.biligame.com/sr/装备一览). Every local path, Chinese name, original image URL and source page is recorded in `docs/classic-equipment-art-sources.json`.

The original game bond icons in `traits/classic-<id>.png` are attributed individually in `docs/classic-trait-art-sources.json`. The semantic white SVG symbols remain as local fallbacks. Their shapes were drawn for this project and are not claimed to be extracted original art.

BWIKI provides its contributed page content under CC BY-NC-SA 4.0; the game artwork remains the property of HoYoverse / miHoYo and the respective rights holders. Downloading these publicly available references is not a claim that the underlying game artwork is open source.

The 33 `strategies/classic-<id>.png` files are unchanged white transparent glyphs from the [BWIKI investment strategy reference](https://wiki.biligame.com/sr/投资策略一览). Their per-strategy source URLs are recorded in `docs/classic-strategy-art-sources.json`. This provides the original strategy symbols; card frames and color treatment remain implemented by this fan site's CSS.

Twenty-eight original bond glyphs were available from the public BWIKI file index. Five additional bonds (`grail`, `gamer`, `mentor`, `elation`, `navigator`) use the project's semantic SVG fallback because their original small-icon source download was unavailable during retrieval. Do not describe those five SVGs as original game art.
