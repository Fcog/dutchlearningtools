export type SeparableContext = 'main' | 'perfect' | 'subordinate' | 'modal';

export const CONTEXT_LABEL: Record<SeparableContext, string> = {
  main: 'Main clause',
  perfect: 'Present perfect',
  subordinate: 'Subordinate clause',
  modal: 'Modal verb',
};

export interface SeparableExercise {
  dutch: string;
  english: string;
  answer: string;
  context: SeparableContext;
}

export interface SeparableVerbSet {
  infinitive: string;
  english: string;
  exercises: [SeparableExercise, SeparableExercise, SeparableExercise, SeparableExercise];
}

export const separableVerbSets: SeparableVerbSet[] = [
  {
    infinitive: 'uitleggen',
    english: 'to explain',
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ de grammaticaregel stap voor stap uit.',
        english: 'She explains the grammar rule step by step.',
        answer: 'legt',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft de grammaticaregel stap voor stap ___.',
        english: 'She has explained the grammar rule step by step.',
        answer: 'uitgelegd',
      },
      {
        context: 'subordinate',
        dutch: 'Ik hoop dat ze de grammaticaregel goed ___.',
        english: 'I hope she explains the grammar rule well.',
        answer: 'uitlegt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil de grammaticaregel stap voor stap ___.',
        english: 'She wants to explain the grammar rule step by step.',
        answer: 'uitleggen',
      },
    ],
  },
  {
    infinitive: 'opbellen',
    english: 'to call (by phone)',
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ zijn moeder elke zondag op.',
        english: 'He calls his mother every Sunday.',
        answer: 'belt',
      },
      {
        context: 'perfect',
        dutch: 'Hij heeft zijn moeder gisteren ___.',
        english: 'He called his mother yesterday.',
        answer: 'opgebeld',
      },
      {
        context: 'subordinate',
        dutch: 'Ze weet dat hij zijn moeder elke zondag ___.',
        english: 'She knows that he calls his mother every Sunday.',
        answer: 'opbelt',
      },
      {
        context: 'modal',
        dutch: 'Hij moet zijn moeder nog ___.',
        english: 'He still has to call his mother.',
        answer: 'opbellen',
      },
    ],
  },
  {
    infinitive: 'meenemen',
    english: 'to take along',
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ haar laptop altijd mee.',
        english: 'She always takes her laptop along.',
        answer: 'neemt',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft haar laptop ___.',
        english: 'She has taken her laptop along.',
        answer: 'meegenomen',
      },
      {
        context: 'subordinate',
        dutch: 'Ik weet dat ze haar laptop altijd ___.',
        english: 'I know that she always takes her laptop along.',
        answer: 'meeneemt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil haar laptop ook ___.',
        english: 'She wants to take her laptop along too.',
        answer: 'meenemen',
      },
    ],
  },
  {
    infinitive: 'ophalen',
    english: 'to pick up',
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ zijn vriendin om acht uur op.',
        english: 'He picks up his girlfriend at eight o\'clock.',
        answer: 'haalt',
      },
      {
        context: 'perfect',
        dutch: 'Hij heeft zijn vriendin om acht uur ___.',
        english: 'He has picked up his girlfriend at eight o\'clock.',
        answer: 'opgehaald',
      },
      {
        context: 'subordinate',
        dutch: 'Ze hoopt dat hij haar om acht uur ___.',
        english: 'She hopes that he picks her up at eight o\'clock.',
        answer: 'ophaalt',
      },
      {
        context: 'modal',
        dutch: 'Hij gaat zijn vriendin later ___.',
        english: 'He is going to pick up his girlfriend later.',
        answer: 'ophalen',
      },
    ],
  },
  {
    infinitive: 'aanzetten',
    english: 'to turn on',
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ de televisie aan.',
        english: 'She turns on the television.',
        answer: 'zet',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft de televisie ___.',
        english: 'She has turned on the television.',
        answer: 'aangezet',
      },
      {
        context: 'subordinate',
        dutch: 'Ik zie dat ze de televisie ___.',
        english: 'I see that she turns on the television.',
        answer: 'aanzet',
      },
      {
        context: 'modal',
        dutch: 'Ze wil de televisie ___.',
        english: 'She wants to turn on the television.',
        answer: 'aanzetten',
      },
    ],
  },
  {
    infinitive: 'uitzetten',
    english: 'to turn off',
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ het licht uit.',
        english: 'He turns off the light.',
        answer: 'zet',
      },
      {
        context: 'perfect',
        dutch: 'Hij heeft het licht ___.',
        english: 'He has turned off the light.',
        answer: 'uitgezet',
      },
      {
        context: 'subordinate',
        dutch: 'Ze vraagt of hij het licht ___.',
        english: 'She asks whether he turns off the light.',
        answer: 'uitzet',
      },
      {
        context: 'modal',
        dutch: 'Hij moet het licht ___.',
        english: 'He has to turn off the light.',
        answer: 'uitzetten',
      },
    ],
  },
  {
    infinitive: 'voorstellen',
    english: 'to introduce / to suggest',
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ haar vriend aan de groep voor.',
        english: 'She introduces her friend to the group.',
        answer: 'stelt',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft haar vriend aan de groep ___.',
        english: 'She has introduced her friend to the group.',
        answer: 'voorgesteld',
      },
      {
        context: 'subordinate',
        dutch: 'Iedereen hoopt dat ze haar vriend ___.',
        english: 'Everyone hopes she introduces her friend.',
        answer: 'voorstelt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil haar vriend aan iedereen ___.',
        english: 'She wants to introduce her friend to everyone.',
        answer: 'voorstellen',
      },
    ],
  },
  {
    infinitive: 'opstaan',
    english: 'to get up',
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ elke dag om zeven uur op.',
        english: 'He gets up at seven o\'clock every day.',
        answer: 'staat',
      },
      {
        context: 'perfect',
        dutch: 'Hij is gisteren heel laat ___.',
        english: 'He got up very late yesterday.',
        answer: 'opgestaan',
      },
      {
        context: 'subordinate',
        dutch: 'Ze weet dat hij elke dag vroeg ___.',
        english: 'She knows that he gets up early every day.',
        answer: 'opstaat',
      },
      {
        context: 'modal',
        dutch: 'Hij wil morgen vroeger ___.',
        english: 'He wants to get up earlier tomorrow.',
        answer: 'opstaan',
      },
    ],
  },
  {
    infinitive: 'meedoen',
    english: 'to join / to participate',
    exercises: [
      {
        context: 'main',
        dutch: 'Iedereen ___ aan het spel mee.',
        english: 'Everyone joins the game.',
        answer: 'doet',
      },
      {
        context: 'perfect',
        dutch: 'Iedereen heeft aan het spel ___.',
        english: 'Everyone has joined the game.',
        answer: 'meegedaan',
      },
      {
        context: 'subordinate',
        dutch: 'Ze hoopt dat iedereen aan het spel ___.',
        english: 'She hopes that everyone joins the game.',
        answer: 'meedoet',
      },
      {
        context: 'modal',
        dutch: 'Iedereen wil aan het spel ___.',
        english: 'Everyone wants to join the game.',
        answer: 'meedoen',
      },
    ],
  },
  {
    infinitive: 'uitnodigen',
    english: 'to invite',
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ al haar vrienden uit.',
        english: 'She invites all her friends.',
        answer: 'nodigt',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft al haar vrienden ___.',
        english: 'She has invited all her friends.',
        answer: 'uitgenodigd',
      },
      {
        context: 'subordinate',
        dutch: 'Hij hoopt dat ze hem ook ___.',
        english: 'He hopes she invites him too.',
        answer: 'uitnodigt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil al haar vrienden ___.',
        english: 'She wants to invite all her friends.',
        answer: 'uitnodigen',
      },
    ],
  },
  {
    infinitive: 'terugkomen',
    english: 'to come back',
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ morgen terug.',
        english: 'She comes back tomorrow.',
        answer: 'komt',
      },
      {
        context: 'perfect',
        dutch: 'Ze is gisteren ___.',
        english: 'She came back yesterday.',
        answer: 'teruggekomen',
      },
      {
        context: 'subordinate',
        dutch: 'Hij weet dat ze morgen ___.',
        english: 'He knows that she comes back tomorrow.',
        answer: 'terugkomt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil volgende week ___.',
        english: 'She wants to come back next week.',
        answer: 'terugkomen',
      },
    ],
  },
  {
    infinitive: 'bijdragen',
    english: 'to contribute',
    exercises: [
      {
        context: 'main',
        dutch: 'Iedereen ___ aan het project bij.',
        english: 'Everyone contributes to the project.',
        answer: 'draagt',
      },
      {
        context: 'perfect',
        dutch: 'Iedereen heeft aan het project ___.',
        english: 'Everyone has contributed to the project.',
        answer: 'bijgedragen',
      },
      {
        context: 'subordinate',
        dutch: 'Ze hoopt dat iedereen aan het project ___.',
        english: 'She hopes that everyone contributes to the project.',
        answer: 'bijdraagt',
      },
      {
        context: 'modal',
        dutch: 'Iedereen wil graag aan het project ___.',
        english: 'Everyone wants to contribute to the project.',
        answer: 'bijdragen',
      },
    ],
  },
  {
    infinitive: 'opzetten',
    english: 'to set up',
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ een nieuw bedrijf op.',
        english: 'He sets up a new company.',
        answer: 'zet',
      },
      {
        context: 'perfect',
        dutch: 'Hij heeft een nieuw bedrijf ___.',
        english: 'He has set up a new company.',
        answer: 'opgezet',
      },
      {
        context: 'subordinate',
        dutch: 'Ze hoopt dat hij een nieuw bedrijf ___.',
        english: 'She hopes that he sets up a new company.',
        answer: 'opzet',
      },
      {
        context: 'modal',
        dutch: 'Hij wil een nieuw bedrijf ___.',
        english: 'He wants to set up a new company.',
        answer: 'opzetten',
      },
    ],
  },
  {
    infinitive: 'afleveren',
    english: 'to deliver',
    exercises: [
      {
        context: 'main',
        dutch: 'De koerier ___ het pakket af.',
        english: 'The courier delivers the package.',
        answer: 'levert',
      },
      {
        context: 'perfect',
        dutch: 'De koerier heeft het pakket ___.',
        english: 'The courier has delivered the package.',
        answer: 'afgeleverd',
      },
      {
        context: 'subordinate',
        dutch: 'Ze wacht totdat de koerier het pakket ___.',
        english: 'She waits until the courier delivers the package.',
        answer: 'aflevert',
      },
      {
        context: 'modal',
        dutch: 'De koerier moet het pakket morgen ___.',
        english: 'The courier has to deliver the package tomorrow.',
        answer: 'afleveren',
      },
    ],
  },
  {
    infinitive: 'inleveren',
    english: 'to hand in / to submit',
    exercises: [
      {
        context: 'main',
        dutch: 'De studenten ___ hun werkstuk op vrijdag in.',
        english: 'The students hand in their assignment on Friday.',
        answer: 'leveren',
      },
      {
        context: 'perfect',
        dutch: 'De studenten hebben hun werkstuk ___.',
        english: 'The students have handed in their assignment.',
        answer: 'ingeleverd',
      },
      {
        context: 'subordinate',
        dutch: 'De docent hoopt dat de studenten hun werkstuk ___.',
        english: 'The teacher hopes the students hand in their assignment.',
        answer: 'inleveren',
      },
      {
        context: 'modal',
        dutch: 'De studenten moeten hun werkstuk morgen ___.',
        english: 'The students have to hand in their assignment tomorrow.',
        answer: 'inleveren',
      },
    ],
  },
];
