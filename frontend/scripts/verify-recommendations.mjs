/**
 * Destination-scoped recommendation smoke checks.
 * Run: npx tsx scripts/verify-recommendations.mjs
 */
import { nearbyUniversitiesForCity, recommendationSearchCities } from '../src/data/ghanaReference.ts';
import { buildDemoHomeRecommendations } from '../src/data/recommendations.ts';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function titles(rec, sectionId) {
  return (rec.sections.find((x) => x.id === sectionId)?.items ?? []).map((i) => i.title);
}

const damongo = buildDemoHomeRecommendations('STUDENT', 'Damongo');
const damongoInst = titles(damongo, 'institutions');
assert(damongoInst.every((t) => !/University of Ghana|\bAccra\b/i.test(t)), 'Damongo must not recommend UG/Accra');
assert(damongoInst.some((t) => /UDS|Tamale|Development/i.test(t)), 'Damongo should surface Tamale-hub institutions');
assert(recommendationSearchCities('Damongo').includes('Tamale'), 'Damongo cluster includes Tamale');
assert(nearbyUniversitiesForCity('Damongo').every((n) => !/University of Ghana/i.test(n)), 'Nearby hubs exclude UG');

const cape = buildDemoHomeRecommendations('TOURIST', 'Cape Coast');
const capeSites = titles(cape, 'attractions');
assert(capeSites.every((t) => !/Mole|Nkrumah Memorial/i.test(t)), 'Cape Coast must not show Accra/Mole sites');
assert(capeSites.some((t) => /Cape Coast|Kakum/i.test(t)), 'Cape Coast attractions are local');

const accra = buildDemoHomeRecommendations('TOURIST', 'Accra');
const accraSites = titles(accra, 'attractions');
assert(accraSites.every((t) => !/Mole|Cape Coast Castle/i.test(t)), 'Accra must not show Mole/Cape Coast Castle');

console.log('OK Damongo institutions:', damongoInst.slice(0, 3));
console.log('OK Cape Coast attractions:', capeSites.slice(0, 3));
console.log('OK Accra attractions:', accraSites.slice(0, 3));
console.log('verify-recommendations: passed');
