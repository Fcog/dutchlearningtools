import type { SupportedLang } from '../types';

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
  translations?: Partial<Record<SupportedLang, string>>;
  answer: string;
  context: SeparableContext;
}

export interface SeparableVerbSet {
  infinitive: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  exercises: [SeparableExercise, SeparableExercise, SeparableExercise, SeparableExercise];
}

export const separableVerbSets: SeparableVerbSet[] = [
  {
    infinitive: 'uitleggen',
    english: 'to explain',
    translations: { es: 'explicar' },
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ de grammaticaregel stap voor stap uit.',
        english: 'She explains the grammar rule step by step.',
        translations: { es: 'Ella explica la regla gramatical paso a paso.' },
        answer: 'legt',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft de grammaticaregel stap voor stap ___.',
        english: 'She has explained the grammar rule step by step.',
        translations: { es: 'Ella ha explicado la regla gramatical paso a paso.' },
        answer: 'uitgelegd',
      },
      {
        context: 'subordinate',
        dutch: 'Ik hoop dat ze de grammaticaregel goed ___.',
        english: 'I hope she explains the grammar rule well.',
        translations: { es: 'Espero que ella explique bien la regla gramatical.' },
        answer: 'uitlegt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil de grammaticaregel stap voor stap ___.',
        english: 'She wants to explain the grammar rule step by step.',
        translations: { es: 'Ella quiere explicar la regla gramatical paso a paso.' },
        answer: 'uitleggen',
      },
    ],
  },
  {
    infinitive: 'opbellen',
    english: 'to call (by phone)',
    translations: { es: 'llamar por teléfono' },
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ zijn moeder elke zondag op.',
        english: 'He calls his mother every Sunday.',
        translations: { es: 'Él llama a su madre todos los domingos.' },
        answer: 'belt',
      },
      {
        context: 'perfect',
        dutch: 'Hij heeft zijn moeder gisteren ___.',
        english: 'He called his mother yesterday.',
        translations: { es: 'Él llamó a su madre ayer.' },
        answer: 'opgebeld',
      },
      {
        context: 'subordinate',
        dutch: 'Ze weet dat hij zijn moeder elke zondag ___.',
        english: 'She knows that he calls his mother every Sunday.',
        translations: { es: 'Ella sabe que él llama a su madre todos los domingos.' },
        answer: 'opbelt',
      },
      {
        context: 'modal',
        dutch: 'Hij moet zijn moeder nog ___.',
        english: 'He still has to call his mother.',
        translations: { es: 'Él todavía tiene que llamar a su madre.' },
        answer: 'opbellen',
      },
    ],
  },
  {
    infinitive: 'meenemen',
    english: 'to take along',
    translations: { es: 'llevarse' },
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ haar laptop altijd mee.',
        english: 'She always takes her laptop along.',
        translations: { es: 'Ella siempre se lleva el portátil.' },
        answer: 'neemt',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft haar laptop ___.',
        english: 'She has taken her laptop along.',
        translations: { es: 'Ella se ha llevado el portátil.' },
        answer: 'meegenomen',
      },
      {
        context: 'subordinate',
        dutch: 'Ik weet dat ze haar laptop altijd ___.',
        english: 'I know that she always takes her laptop along.',
        translations: { es: 'Sé que ella siempre se lleva el portátil.' },
        answer: 'meeneemt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil haar laptop ook ___.',
        english: 'She wants to take her laptop along too.',
        translations: { es: 'Ella también quiere llevarse el portátil.' },
        answer: 'meenemen',
      },
    ],
  },
  {
    infinitive: 'ophalen',
    english: 'to pick up',
    translations: { es: 'recoger' },
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ zijn vriendin om acht uur op.',
        english: 'He picks up his girlfriend at eight o\'clock.',
        translations: { es: 'Él recoge a su novia a las ocho.' },
        answer: 'haalt',
      },
      {
        context: 'perfect',
        dutch: 'Hij heeft zijn vriendin om acht uur ___.',
        english: 'He has picked up his girlfriend at eight o\'clock.',
        translations: { es: 'Él ha recogido a su novia a las ocho.' },
        answer: 'opgehaald',
      },
      {
        context: 'subordinate',
        dutch: 'Ze hoopt dat hij haar om acht uur ___.',
        english: 'She hopes that he picks her up at eight o\'clock.',
        translations: { es: 'Ella espera que él la recoja a las ocho.' },
        answer: 'ophaalt',
      },
      {
        context: 'modal',
        dutch: 'Hij gaat zijn vriendin later ___.',
        english: 'He is going to pick up his girlfriend later.',
        translations: { es: 'Él va a recoger a su novia más tarde.' },
        answer: 'ophalen',
      },
    ],
  },
  {
    infinitive: 'aanzetten',
    english: 'to turn on',
    translations: { es: 'encender' },
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ de televisie aan.',
        english: 'She turns on the television.',
        translations: { es: 'Ella enciende el televisor.' },
        answer: 'zet',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft de televisie ___.',
        english: 'She has turned on the television.',
        translations: { es: 'Ella ha encendido el televisor.' },
        answer: 'aangezet',
      },
      {
        context: 'subordinate',
        dutch: 'Ik zie dat ze de televisie ___.',
        english: 'I see that she turns on the television.',
        translations: { es: 'Veo que ella enciende el televisor.' },
        answer: 'aanzet',
      },
      {
        context: 'modal',
        dutch: 'Ze wil de televisie ___.',
        english: 'She wants to turn on the television.',
        translations: { es: 'Ella quiere encender el televisor.' },
        answer: 'aanzetten',
      },
    ],
  },
  {
    infinitive: 'uitzetten',
    english: 'to turn off',
    translations: { es: 'apagar' },
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ het licht uit.',
        english: 'He turns off the light.',
        translations: { es: 'Él apaga la luz.' },
        answer: 'zet',
      },
      {
        context: 'perfect',
        dutch: 'Hij heeft het licht ___.',
        english: 'He has turned off the light.',
        translations: { es: 'Él ha apagado la luz.' },
        answer: 'uitgezet',
      },
      {
        context: 'subordinate',
        dutch: 'Ze vraagt of hij het licht ___.',
        english: 'She asks whether he turns off the light.',
        translations: { es: 'Ella pregunta si él apaga la luz.' },
        answer: 'uitzet',
      },
      {
        context: 'modal',
        dutch: 'Hij moet het licht ___.',
        english: 'He has to turn off the light.',
        translations: { es: 'Él tiene que apagar la luz.' },
        answer: 'uitzetten',
      },
    ],
  },
  {
    infinitive: 'voorstellen',
    english: 'to introduce / to suggest',
    translations: { es: 'presentar / sugerir' },
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ haar vriend aan de groep voor.',
        english: 'She introduces her friend to the group.',
        translations: { es: 'Ella presenta a su amigo al grupo.' },
        answer: 'stelt',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft haar vriend aan de groep ___.',
        english: 'She has introduced her friend to the group.',
        translations: { es: 'Ella ha presentado a su amigo al grupo.' },
        answer: 'voorgesteld',
      },
      {
        context: 'subordinate',
        dutch: 'Iedereen hoopt dat ze haar vriend ___.',
        english: 'Everyone hopes she introduces her friend.',
        translations: { es: 'Todos esperan que ella presente a su amigo.' },
        answer: 'voorstelt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil haar vriend aan iedereen ___.',
        english: 'She wants to introduce her friend to everyone.',
        translations: { es: 'Ella quiere presentar a su amigo a todos.' },
        answer: 'voorstellen',
      },
    ],
  },
  {
    infinitive: 'opstaan',
    english: 'to get up',
    translations: { es: 'levantarse' },
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ elke dag om zeven uur op.',
        english: 'He gets up at seven o\'clock every day.',
        translations: { es: 'Él se levanta a las siete todos los días.' },
        answer: 'staat',
      },
      {
        context: 'perfect',
        dutch: 'Hij is gisteren heel laat ___.',
        english: 'He got up very late yesterday.',
        translations: { es: 'Él se levantó muy tarde ayer.' },
        answer: 'opgestaan',
      },
      {
        context: 'subordinate',
        dutch: 'Ze weet dat hij elke dag vroeg ___.',
        english: 'She knows that he gets up early every day.',
        translations: { es: 'Ella sabe que él se levanta temprano todos los días.' },
        answer: 'opstaat',
      },
      {
        context: 'modal',
        dutch: 'Hij wil morgen vroeger ___.',
        english: 'He wants to get up earlier tomorrow.',
        translations: { es: 'Él quiere levantarse más temprano mañana.' },
        answer: 'opstaan',
      },
    ],
  },
  {
    infinitive: 'meedoen',
    english: 'to join / to participate',
    translations: { es: 'participar' },
    exercises: [
      {
        context: 'main',
        dutch: 'Iedereen ___ aan het spel mee.',
        english: 'Everyone joins the game.',
        translations: { es: 'Todos participan en el juego.' },
        answer: 'doet',
      },
      {
        context: 'perfect',
        dutch: 'Iedereen heeft aan het spel ___.',
        english: 'Everyone has joined the game.',
        translations: { es: 'Todos han participado en el juego.' },
        answer: 'meegedaan',
      },
      {
        context: 'subordinate',
        dutch: 'Ze hoopt dat iedereen aan het spel ___.',
        english: 'She hopes that everyone joins the game.',
        translations: { es: 'Ella espera que todos participen en el juego.' },
        answer: 'meedoet',
      },
      {
        context: 'modal',
        dutch: 'Iedereen wil aan het spel ___.',
        english: 'Everyone wants to join the game.',
        translations: { es: 'Todos quieren participar en el juego.' },
        answer: 'meedoen',
      },
    ],
  },
  {
    infinitive: 'uitnodigen',
    english: 'to invite',
    translations: { es: 'invitar' },
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ al haar vrienden uit.',
        english: 'She invites all her friends.',
        translations: { es: 'Ella invita a todos sus amigos.' },
        answer: 'nodigt',
      },
      {
        context: 'perfect',
        dutch: 'Ze heeft al haar vrienden ___.',
        english: 'She has invited all her friends.',
        translations: { es: 'Ella ha invitado a todos sus amigos.' },
        answer: 'uitgenodigd',
      },
      {
        context: 'subordinate',
        dutch: 'Hij hoopt dat ze hem ook ___.',
        english: 'He hopes she invites him too.',
        translations: { es: 'Él espera que ella también lo invite.' },
        answer: 'uitnodigt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil al haar vrienden ___.',
        english: 'She wants to invite all her friends.',
        translations: { es: 'Ella quiere invitar a todos sus amigos.' },
        answer: 'uitnodigen',
      },
    ],
  },
  {
    infinitive: 'terugkomen',
    english: 'to come back',
    translations: { es: 'volver' },
    exercises: [
      {
        context: 'main',
        dutch: 'Ze ___ morgen terug.',
        english: 'She comes back tomorrow.',
        translations: { es: 'Ella vuelve mañana.' },
        answer: 'komt',
      },
      {
        context: 'perfect',
        dutch: 'Ze is gisteren ___.',
        english: 'She came back yesterday.',
        translations: { es: 'Ella volvió ayer.' },
        answer: 'teruggekomen',
      },
      {
        context: 'subordinate',
        dutch: 'Hij weet dat ze morgen ___.',
        english: 'He knows that she comes back tomorrow.',
        translations: { es: 'Él sabe que ella vuelve mañana.' },
        answer: 'terugkomt',
      },
      {
        context: 'modal',
        dutch: 'Ze wil volgende week ___.',
        english: 'She wants to come back next week.',
        translations: { es: 'Ella quiere volver la semana que viene.' },
        answer: 'terugkomen',
      },
    ],
  },
  {
    infinitive: 'bijdragen',
    english: 'to contribute',
    translations: { es: 'contribuir' },
    exercises: [
      {
        context: 'main',
        dutch: 'Iedereen ___ aan het project bij.',
        english: 'Everyone contributes to the project.',
        translations: { es: 'Todos contribuyen al proyecto.' },
        answer: 'draagt',
      },
      {
        context: 'perfect',
        dutch: 'Iedereen heeft aan het project ___.',
        english: 'Everyone has contributed to the project.',
        translations: { es: 'Todos han contribuido al proyecto.' },
        answer: 'bijgedragen',
      },
      {
        context: 'subordinate',
        dutch: 'Ze hoopt dat iedereen aan het project ___.',
        english: 'She hopes that everyone contributes to the project.',
        translations: { es: 'Ella espera que todos contribuyan al proyecto.' },
        answer: 'bijdraagt',
      },
      {
        context: 'modal',
        dutch: 'Iedereen wil graag aan het project ___.',
        english: 'Everyone wants to contribute to the project.',
        translations: { es: 'Todos quieren contribuir al proyecto.' },
        answer: 'bijdragen',
      },
    ],
  },
  {
    infinitive: 'opzetten',
    english: 'to set up',
    translations: { es: 'crear / montar' },
    exercises: [
      {
        context: 'main',
        dutch: 'Hij ___ een nieuw bedrijf op.',
        english: 'He sets up a new company.',
        translations: { es: 'Él crea una nueva empresa.' },
        answer: 'zet',
      },
      {
        context: 'perfect',
        dutch: 'Hij heeft een nieuw bedrijf ___.',
        english: 'He has set up a new company.',
        translations: { es: 'Él ha creado una nueva empresa.' },
        answer: 'opgezet',
      },
      {
        context: 'subordinate',
        dutch: 'Ze hoopt dat hij een nieuw bedrijf ___.',
        english: 'She hopes that he sets up a new company.',
        translations: { es: 'Ella espera que él cree una nueva empresa.' },
        answer: 'opzet',
      },
      {
        context: 'modal',
        dutch: 'Hij wil een nieuw bedrijf ___.',
        english: 'He wants to set up a new company.',
        translations: { es: 'Él quiere crear una nueva empresa.' },
        answer: 'opzetten',
      },
    ],
  },
  {
    infinitive: 'afleveren',
    english: 'to deliver',
    translations: { es: 'entregar' },
    exercises: [
      {
        context: 'main',
        dutch: 'De koerier ___ het pakket af.',
        english: 'The courier delivers the package.',
        translations: { es: 'El repartidor entrega el paquete.' },
        answer: 'levert',
      },
      {
        context: 'perfect',
        dutch: 'De koerier heeft het pakket ___.',
        english: 'The courier has delivered the package.',
        translations: { es: 'El repartidor ha entregado el paquete.' },
        answer: 'afgeleverd',
      },
      {
        context: 'subordinate',
        dutch: 'Ze wacht totdat de koerier het pakket ___.',
        english: 'She waits until the courier delivers the package.',
        translations: { es: 'Ella espera hasta que el repartidor entregue el paquete.' },
        answer: 'aflevert',
      },
      {
        context: 'modal',
        dutch: 'De koerier moet het pakket morgen ___.',
        english: 'The courier has to deliver the package tomorrow.',
        translations: { es: 'El repartidor tiene que entregar el paquete mañana.' },
        answer: 'afleveren',
      },
    ],
  },
  {
    infinitive: 'inleveren',
    english: 'to hand in / to submit',
    translations: { es: 'entregar / presentar' },
    exercises: [
      {
        context: 'main',
        dutch: 'De studenten ___ hun werkstuk op vrijdag in.',
        english: 'The students hand in their assignment on Friday.',
        translations: { es: 'Los estudiantes entregan su trabajo el viernes.' },
        answer: 'leveren',
      },
      {
        context: 'perfect',
        dutch: 'De studenten hebben hun werkstuk ___.',
        english: 'The students have handed in their assignment.',
        translations: { es: 'Los estudiantes han entregado su trabajo.' },
        answer: 'ingeleverd',
      },
      {
        context: 'subordinate',
        dutch: 'De docent hoopt dat de studenten hun werkstuk ___.',
        english: 'The teacher hopes the students hand in their assignment.',
        translations: { es: 'El profesor espera que los estudiantes entreguen su trabajo.' },
        answer: 'inleveren',
      },
      {
        context: 'modal',
        dutch: 'De studenten moeten hun werkstuk morgen ___.',
        english: 'The students have to hand in their assignment tomorrow.',
        translations: { es: 'Los estudiantes tienen que entregar su trabajo mañana.' },
        answer: 'inleveren',
      },
    ],
  },
];
