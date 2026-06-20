import type { Level } from '../types';

export type PositionalVerb = 'zijn' | 'zitten' | 'liggen' | 'staan';

export interface PositionalExercise {
  dutch: string;
  english: string;
  verb: PositionalVerb;
  answer: string;       // conjugated form used in the filled sentence
  explanation: string;
  level: Level;
}

export const positionalExercises: PositionalExercise[] = [
  // ── staan ────────────────────────────────────────────────────────────────
  {
    dutch: 'De leraar ___ voor de klas.',
    english: 'The teacher is standing in front of the class.',
    verb: 'staan', answer: 'staat',
    explanation: 'People who are upright use staan.',
    level: 'A1',
  },
  {
    dutch: 'De auto ___ voor de deur.',
    english: 'The car is parked in front of the door.',
    verb: 'staan', answer: 'staat',
    explanation: 'Parked vehicles use staan — they stand upright on their wheels.',
    level: 'A1',
  },
  {
    dutch: 'De fles ___ op de tafel.',
    english: 'The bottle is on the table.',
    verb: 'staan', answer: 'staat',
    explanation: 'Tall upright containers (bottles, glasses, vases) use staan.',
    level: 'A1',
  },
  {
    dutch: 'De kinderen ___ in de rij.',
    english: 'The children are standing in line.',
    verb: 'staan', answer: 'staan',
    explanation: 'People standing (in a line, queue) use staan.',
    level: 'A1',
  },
  {
    dutch: 'De boom ___ in de tuin.',
    english: 'The tree is in the garden.',
    verb: 'staan', answer: 'staat',
    explanation: 'Trees and plants use staan — they grow upright.',
    level: 'A2',
  },
  {
    dutch: 'Er ___ een fout in de brief.',
    english: 'There is a mistake in the letter.',
    verb: 'staan', answer: 'staat',
    explanation: 'Text and writing on paper or screens use staan.',
    level: 'A2',
  },
  {
    dutch: 'Zijn naam ___ op de lijst.',
    english: 'His name is on the list.',
    verb: 'staan', answer: 'staat',
    explanation: 'Written text — names, words, information — uses staan.',
    level: 'A2',
  },
  {
    dutch: 'De borden ___ in de kast.',
    english: 'The plates are in the cupboard.',
    verb: 'staan', answer: 'staan',
    explanation: 'Plates stored upright in a cupboard use staan.',
    level: 'A2',
  },
  {
    dutch: 'De fiets ___ tegen de muur.',
    english: 'The bicycle is leaning against the wall.',
    verb: 'staan', answer: 'staat',
    explanation: 'Bicycles and vehicles use staan — they are upright.',
    level: 'A2',
  },
  {
    dutch: 'Er ___ veel informatie op de website.',
    english: 'There is a lot of information on the website.',
    verb: 'staan', answer: 'staat',
    explanation: 'Text and information published anywhere (web, newspaper) uses staan.',
    level: 'B1',
  },
  {
    dutch: 'De soldaten ___ voor het paleis.',
    english: 'The soldiers are standing in front of the palace.',
    verb: 'staan', answer: 'staan',
    explanation: 'People standing on guard or in position use staan.',
    level: 'B1',
  },
  {
    dutch: 'De auto\'s ___ al uren in de file.',
    english: 'The cars have been stuck in traffic for hours.',
    verb: 'staan', answer: 'staan',
    explanation: 'Vehicles in traffic use staan, even when not moving.',
    level: 'B1',
  },

  // ── liggen ───────────────────────────────────────────────────────────────
  {
    dutch: 'Het boek ___ op de tafel.',
    english: 'The book is on the table.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'Flat objects resting on a surface use liggen.',
    level: 'A1',
  },
  {
    dutch: 'De hond ___ op de vloer.',
    english: 'The dog is lying on the floor.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'Animals and people in a horizontal position use liggen.',
    level: 'A1',
  },
  {
    dutch: 'Mijn jas ___ op de stoel.',
    english: 'My coat is on the chair.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'Clothing lying flat on a surface uses liggen.',
    level: 'A1',
  },
  {
    dutch: 'Het kind ___ in bed.',
    english: 'The child is in bed.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'A person lying in bed uses liggen.',
    level: 'A1',
  },
  {
    dutch: 'Nederland ___ in Noord-Europa.',
    english: 'The Netherlands is in Northern Europe.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'Geographic locations (countries, cities, regions) use liggen.',
    level: 'A2',
  },
  {
    dutch: 'De sleutels ___ op het bureau.',
    english: 'The keys are on the desk.',
    verb: 'liggen', answer: 'liggen',
    explanation: 'Small flat or loose objects on a surface use liggen.',
    level: 'A2',
  },
  {
    dutch: 'Amsterdam ___ aan het IJ.',
    english: 'Amsterdam is on the IJ river.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'Cities and places use liggen for their geographic position.',
    level: 'A2',
  },
  {
    dutch: 'De foto\'s ___ in een doos.',
    english: 'The photos are in a box.',
    verb: 'liggen', answer: 'liggen',
    explanation: 'Flat objects (photos, papers) stored in a box use liggen.',
    level: 'A2',
  },
  {
    dutch: 'De zieke man ___ in het ziekenhuis.',
    english: 'The sick man is in hospital.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'A patient in hospital (lying in a bed) uses liggen.',
    level: 'B1',
  },
  {
    dutch: 'Het dorp ___ in een dal.',
    english: 'The village is in a valley.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'Geographic position of places uses liggen.',
    level: 'B1',
  },
  {
    dutch: 'De oorzaak ___ in het verleden.',
    english: 'The cause lies in the past.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'Abstract causes or roots that "lie" somewhere use liggen.',
    level: 'B1',
  },
  {
    dutch: 'Er ___ een brief op de mat.',
    english: 'There is a letter on the mat.',
    verb: 'liggen', answer: 'ligt',
    explanation: 'A flat envelope or paper lying on the floor uses liggen.',
    level: 'B1',
  },

  // ── zitten ───────────────────────────────────────────────────────────────
  {
    dutch: 'De kat ___ op de bank.',
    english: 'The cat is sitting on the sofa.',
    verb: 'zitten', answer: 'zit',
    explanation: 'Animals and people in a seated position use zitten.',
    level: 'A1',
  },
  {
    dutch: 'Ik ___ op een stoel.',
    english: 'I am sitting on a chair.',
    verb: 'zitten', answer: 'zit',
    explanation: 'A person seated on a chair uses zitten.',
    level: 'A1',
  },
  {
    dutch: 'De kinderen ___ in de klas.',
    english: 'The children are in the classroom.',
    verb: 'zitten', answer: 'zitten',
    explanation: 'People inside an enclosed space (room, building) use zitten.',
    level: 'A1',
  },
  {
    dutch: 'De sleutel ___ in het slot.',
    english: 'The key is in the lock.',
    verb: 'zitten', answer: 'zit',
    explanation: 'An object inserted or enclosed in something uses zitten.',
    level: 'A2',
  },
  {
    dutch: 'Zijn telefoon ___ in zijn zak.',
    english: 'His phone is in his pocket.',
    verb: 'zitten', answer: 'zit',
    explanation: 'Objects inside a pocket, bag or container use zitten.',
    level: 'A2',
  },
  {
    dutch: 'Er ___ een fout in de rekening.',
    english: 'There is a mistake in the bill.',
    verb: 'zitten', answer: 'zit',
    explanation: 'An error or problem hidden inside something uses zitten.',
    level: 'A2',
  },
  {
    dutch: 'De studenten ___ al in de zaal.',
    english: 'The students are already in the hall.',
    verb: 'zitten', answer: 'zitten',
    explanation: 'People inside an enclosed space (hall, room, car) use zitten.',
    level: 'A2',
  },
  {
    dutch: 'De appels ___ in een mand.',
    english: 'The apples are in a basket.',
    verb: 'zitten', answer: 'zitten',
    explanation: 'Objects collected inside a container use zitten.',
    level: 'A2',
  },
  {
    dutch: 'Er ___ veel suiker in frisdrank.',
    english: 'There is a lot of sugar in soft drinks.',
    verb: 'zitten', answer: 'zit',
    explanation: 'An ingredient or substance inside food or drink uses zitten.',
    level: 'B1',
  },
  {
    dutch: 'Hij ___ al twee jaar in de gevangenis.',
    english: 'He has been in prison for two years already.',
    verb: 'zitten', answer: 'zit',
    explanation: 'Being confined or enclosed in a space (prison, hospital room) uses zitten.',
    level: 'B1',
  },
  {
    dutch: 'Er ___ een gat in mijn plan.',
    english: 'There is a hole in my plan.',
    verb: 'zitten', answer: 'zit',
    explanation: 'An abstract flaw or gap inside something uses zitten.',
    level: 'B1',
  },
  {
    dutch: 'Ze ___ in een moeilijke situatie.',
    english: 'She is in a difficult situation.',
    verb: 'zitten', answer: 'zit',
    explanation: 'Being "stuck" in an abstract situation uses zitten.',
    level: 'B1',
  },

  // ── zijn ─────────────────────────────────────────────────────────────────
  {
    dutch: 'Hij ___ ziek vandaag.',
    english: 'He is sick today.',
    verb: 'zijn', answer: 'is',
    explanation: 'States and conditions (sick, tired, happy) use zijn.',
    level: 'A1',
  },
  {
    dutch: 'Het water ___ koud.',
    english: 'The water is cold.',
    verb: 'zijn', answer: 'is',
    explanation: 'Properties and qualities of things use zijn.',
    level: 'A1',
  },
  {
    dutch: 'Ze ___ erg moe na het werk.',
    english: 'She is very tired after work.',
    verb: 'zijn', answer: 'is',
    explanation: 'Temporary states and feelings use zijn.',
    level: 'A1',
  },
  {
    dutch: 'De vergadering ___ morgen om tien uur.',
    english: 'The meeting is tomorrow at ten o\'clock.',
    verb: 'zijn', answer: 'is',
    explanation: 'Events and appointments with a time use zijn.',
    level: 'A2',
  },
  {
    dutch: 'Het concert ___ in het park.',
    english: 'The concert is in the park.',
    verb: 'zijn', answer: 'is',
    explanation: 'Events taking place somewhere use zijn (not a positional state).',
    level: 'A2',
  },
  {
    dutch: 'Hij ___ altijd eerlijk.',
    english: 'He is always honest.',
    verb: 'zijn', answer: 'is',
    explanation: 'Character traits and lasting qualities use zijn.',
    level: 'A2',
  },
  {
    dutch: 'De situatie ___ ernstig.',
    english: 'The situation is serious.',
    verb: 'zijn', answer: 'is',
    explanation: 'Abstract assessments and judgements use zijn.',
    level: 'B1',
  },
  {
    dutch: 'Het resultaat ___ beter dan verwacht.',
    english: 'The result is better than expected.',
    verb: 'zijn', answer: 'is',
    explanation: 'Evaluations and comparisons use zijn.',
    level: 'B1',
  },
  {
    dutch: 'De opdracht ___ erg moeilijk.',
    english: 'The assignment is very difficult.',
    verb: 'zijn', answer: 'is',
    explanation: 'Properties of abstract things use zijn.',
    level: 'B1',
  },
  {
    dutch: 'Het ___ een lange dag geweest.',
    english: 'It has been a long day.',
    verb: 'zijn', answer: 'is',
    explanation: 'General descriptions of days, situations, periods use zijn.',
    level: 'B1',
  },
];
