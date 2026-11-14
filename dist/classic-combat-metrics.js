// Battle facts, not inferred team ratings. Progression resolves these exactly once
// after a replay is complete; the simulator never mutates persistent progression.
export function createCombatMetrics(units){
 const byUnit={};
 for(const u of units.filter(u=>u.side==='ally'))byUnit[u.id]={uid:u.id,characterId:u.characterId,zone:u.zone,star:u.star,items:[...(u.items||[])],damage:0,hpDamage:0,overkillDamage:0,healing:0,shielding:0,kills:0,actions:0,attacks:0,ultimates:0,naturalUltimates:0,followups:0,hpLost:0,damageTaken:0,shieldAbsorbed:0,negativeApplications:0,toughnessBroken:0,skillPointsSpent:0,skillPointsRestored:0};
 return {version:1,byUnit,byCharacter:{},elapsedAV:0,actions:0,attacks:0,ultimates:0,naturalUltimates:0,followups:0,skillPointsSpent:0,skillPointsRestored:0,toughnessBroken:0,negativeApplications:0,allyHpLost:0,overkillDamage:0,projectedEquipment:[],summons:[],survivingAllies:0,fallenAllies:0,frontlineSurvivors:0,frontlineFallen:0,survivorUids:[],fallenUids:[],perfectVictory:false};
}
export function finishCombatMetrics(metrics,units,winner,time){
 metrics.elapsedAV=Math.round(time);metrics.result=winner;metrics.won=winner==='ally';
 const persistent=units.filter(u=>u.side==='ally'&&!u.summon);
 metrics.survivorUids=persistent.filter(u=>u.hp>0).map(u=>u.id);metrics.fallenUids=persistent.filter(u=>u.hp<=0).map(u=>u.id);
 metrics.survivingAllies=metrics.survivorUids.length;metrics.fallenAllies=metrics.fallenUids.length;
 metrics.frontlineSurvivors=persistent.filter(u=>u.zone==='front'&&u.hp>0).length;metrics.frontlineFallen=persistent.filter(u=>u.zone==='front'&&u.hp<=0).length;
 metrics.perfectVictory=metrics.won&&metrics.frontlineFallen===0;
 metrics.equipmentCount=Object.values(metrics.byUnit).reduce((n,u)=>n+u.items.length,0);
 metrics.byCharacter={};
 for(const u of Object.values(metrics.byUnit)){const c=metrics.byCharacter[u.characterId]??={characterId:u.characterId,unitUids:[]};c.unitUids.push(u.uid);for(const [key,value]of Object.entries(u))if(typeof value==='number'&&key!=='star')c[key]=(c[key]||0)+value;}
 return metrics;
}
