import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {CHARACTERS,TRAITS,LEGACY_TRAITS,EQUIPMENT,STRATEGIES,getTraitArtPath} from '../dist/data.js';
const exists=path=>assert.ok(existsSync(new URL('../dist/'+path,import.meta.url)),path);
test('every live and migrated character has a portrait, detail image and named trait art',()=>{
 for(const c of CHARACTERS){exists(c.image);exists(c.portrait||`assets/portraits/${c.id}.webp`);for(const id of c.traits){assert.ok([...TRAITS,...LEGACY_TRAITS].some(t=>t.id===id),id);exists(getTraitArtPath(id));}}
 for(const e of EQUIPMENT)exists(`assets/equipment/classic-${e.id}.png`);
 for(const s of STRATEGIES.filter(s=>!s.legacy))exists(`assets/strategies/classic-${s.id}.png`);
});
