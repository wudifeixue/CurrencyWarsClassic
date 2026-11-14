// Shop rates: archived Zero-Sum Game table, not the 4.7 season.
// https://honkai-star-rail.fandom.com/wiki/Currency_Wars:_Zero-Sum_Game#Gold_Coins,_Level,_and_Store
export const SHOP_ODDS = Object.freeze({
  1:[100,0,0,0,0],2:[100,0,0,0,0],3:[100,0,0,0,0],
  4:[65,25,10,0,0],5:[45,33,20,2,0],6:[30,40,25,5,0],
  7:[19,30,40,10,1],8:[18,25,32,22,3],9:[15,20,25,30,10],10:[5,10,20,40,25],
});
export const MAX_LEVEL = 10;
export const BENCH_CAPACITY = 9;
export const FRONT_CAPACITY = 4;
export const ROUND_COUNT = 12;
// Kept short for this twelve-battle browser adaptation; these are NOT claimed as original XP requirements.
export const LEVEL_XP = Object.freeze({4:8,5:12,6:20,7:28,8:40,9:52});
export const SHOP_REFRESH_COST = 2;
export const EXPERIENCE_COST = 4;
export const EXPERIENCE_GAIN = 4;
export const INTEREST_CAP = 5;
