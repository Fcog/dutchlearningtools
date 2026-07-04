import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

// Fixed prepositions (vaste voorzetsels): verbs, adjectives and nouns that
// require a specific preposition. Distractors are always other real
// prepositions, so the learner has to know the collocation.
const rows = [
  // ── verb + preposition (A2) ────────────────────────────────────────────────
  { id: 'prep-wachten-op', dutch: 'Ik wacht al een uur ___ de bus.', english: "I've been waiting for the bus for an hour.", translation_es: 'Llevo una hora esperando el autobús.', answer: 'op', options: ['op', 'aan', 'naar', 'voor'], category: 'verb', explanation: 'wachten op = to wait for.', explanation_es: 'wachten op = esperar (a algo/alguien).', level: 'A2' },
  { id: 'prep-luisteren-naar', dutch: 'Zij luistert graag ___ klassieke muziek.', english: 'She likes listening to classical music.', translation_es: 'Le gusta escuchar música clásica.', answer: 'naar', options: ['naar', 'op', 'aan', 'van'], category: 'verb', explanation: 'luisteren naar = to listen to.', explanation_es: 'luisteren naar = escuchar.', level: 'A2' },
  { id: 'prep-denken-aan', dutch: 'Ik denk vaak ___ mijn vakantie in Spanje.', english: 'I often think of my holiday in Spain.', translation_es: 'A menudo pienso en mis vacaciones en España.', answer: 'aan', options: ['aan', 'op', 'over', 'van'], category: 'verb', explanation: 'denken aan = to think of / about (have in mind).', explanation_es: 'denken aan = pensar en (tener en mente).', level: 'A2' },
  { id: 'prep-houden-van', dutch: 'Wij houden ___ lekker eten.', english: 'We love good food.', translation_es: 'Nos encanta la buena comida.', answer: 'van', options: ['van', 'over', 'met', 'aan'], category: 'verb', explanation: 'houden van = to love / be fond of.', explanation_es: 'houden van = amar / gustar mucho.', level: 'A2' },
  { id: 'prep-kijken-naar', dutch: 'De kinderen kijken ___ een film.', english: 'The children are watching a film.', translation_es: 'Los niños ven una película.', answer: 'naar', options: ['naar', 'op', 'aan', 'over'], category: 'verb', explanation: 'kijken naar = to watch / look at.', explanation_es: 'kijken naar = mirar / ver.', level: 'A2' },
  { id: 'prep-zoeken-naar', dutch: 'De politie zoekt ___ de dief.', english: 'The police are searching for the thief.', translation_es: 'La policía busca al ladrón.', answer: 'naar', options: ['naar', 'op', 'om', 'achter'], category: 'verb', explanation: 'zoeken naar = to search for.', explanation_es: 'zoeken naar = buscar.', level: 'A2' },
  { id: 'prep-vragen-naar', dutch: 'Een toerist vroeg mij ___ de weg.', english: 'A tourist asked me for directions.', translation_es: 'Un turista me preguntó por el camino.', answer: 'naar', options: ['naar', 'om', 'op', 'aan'], category: 'verb', explanation: 'vragen naar = to ask for / about (vragen om = to request a thing).', explanation_es: 'vragen naar = preguntar por (vragen om = pedir algo).', level: 'B1' },
  { id: 'prep-praten-over', dutch: 'We praten vaak ___ politiek.', english: 'We often talk about politics.', translation_es: 'A menudo hablamos de política.', answer: 'over', options: ['over', 'van', 'met', 'op'], category: 'verb', explanation: 'praten over = to talk about (praten met = to talk to someone).', explanation_es: 'praten over = hablar de/sobre (praten met = hablar con alguien).', level: 'A2' },
  { id: 'prep-zorgen-voor', dutch: 'Zij zorgt goed ___ haar hond.', english: 'She takes good care of her dog.', translation_es: 'Ella cuida bien de su perro.', answer: 'voor', options: ['voor', 'om', 'over', 'aan'], category: 'verb', explanation: 'zorgen voor = to take care of.', explanation_es: 'zorgen voor = cuidar de.', level: 'A2' },
  { id: 'prep-beginnen-met', dutch: 'We beginnen ___ de les.', english: "We're starting the lesson.", translation_es: 'Empezamos la clase.', answer: 'met', options: ['met', 'aan', 'op', 'van'], category: 'verb', explanation: 'beginnen met = to start with / begin (an activity).', explanation_es: 'beginnen met = empezar con / comenzar (una actividad).', level: 'A2' },
  { id: 'prep-lijken-op', dutch: 'Hij lijkt sprekend ___ zijn vader.', english: 'He looks just like his father.', translation_es: 'Se parece muchísimo a su padre.', answer: 'op', options: ['op', 'naar', 'aan', 'van'], category: 'verb', explanation: 'lijken op = to resemble / look like.', explanation_es: 'lijken op = parecerse a.', level: 'B1' },
  { id: 'prep-rekenen-op', dutch: 'Je kunt altijd ___ mij rekenen.', english: 'You can always count on me.', translation_es: 'Siempre puedes contar conmigo.', answer: 'op', options: ['op', 'met', 'aan', 'voor'], category: 'verb', explanation: 'rekenen op = to count on / rely on.', explanation_es: 'rekenen op = contar con.', level: 'B1' },
  { id: 'prep-letten-op', dutch: 'Let goed ___ het verkeer!', english: 'Pay close attention to the traffic!', translation_es: '¡Presta atención al tráfico!', answer: 'op', options: ['op', 'naar', 'aan', 'voor'], category: 'verb', explanation: 'letten op = to pay attention to / watch out for.', explanation_es: 'letten op = prestar atención a.', level: 'B1' },
  { id: 'prep-reageren-op', dutch: 'Zij reageerde snel ___ mijn bericht.', english: 'She replied to my message quickly.', translation_es: 'Respondió rápido a mi mensaje.', answer: 'op', options: ['op', 'aan', 'naar', 'met'], category: 'verb', explanation: 'reageren op = to respond / react to.', explanation_es: 'reageren op = responder / reaccionar a.', level: 'B1' },
  { id: 'prep-deelnemen-aan', dutch: 'Veel studenten nemen deel ___ het project.', english: 'Many students take part in the project.', translation_es: 'Muchos estudiantes participan en el proyecto.', answer: 'aan', options: ['aan', 'op', 'met', 'in'], category: 'verb', explanation: 'deelnemen aan = to take part in / participate in.', explanation_es: 'deelnemen aan = participar en.', level: 'B1' },
  { id: 'prep-twijfelen-aan', dutch: 'Ik twijfel ___ zijn verhaal.', english: 'I doubt his story.', translation_es: 'Dudo de su historia.', answer: 'aan', options: ['aan', 'over', 'op', 'van'], category: 'verb', explanation: 'twijfelen aan = to doubt / have doubts about.', explanation_es: 'twijfelen aan = dudar de.', level: 'B1' },
  { id: 'prep-bestaan-uit', dutch: 'Het team bestaat ___ vijf mensen.', english: 'The team consists of five people.', translation_es: 'El equipo se compone de cinco personas.', answer: 'uit', options: ['uit', 'van', 'met', 'in'], category: 'verb', explanation: 'bestaan uit = to consist of / be made up of.', explanation_es: 'bestaan uit = componerse de / constar de.', level: 'B1' },

  // ── adjective + preposition (B1) ───────────────────────────────────────────
  { id: 'prep-bang-voor', dutch: 'Mijn zusje is bang ___ spinnen.', english: 'My little sister is afraid of spiders.', translation_es: 'Mi hermanita tiene miedo a las arañas.', answer: 'voor', options: ['voor', 'van', 'op', 'aan'], category: 'adjective', explanation: 'bang voor = afraid of.', explanation_es: 'bang voor = tener miedo a/de.', level: 'A2' },
  { id: 'prep-trots-op', dutch: 'Ze zijn erg trots ___ hun dochter.', english: 'They are very proud of their daughter.', translation_es: 'Están muy orgullosos de su hija.', answer: 'op', options: ['op', 'van', 'voor', 'met'], category: 'adjective', explanation: 'trots op = proud of.', explanation_es: 'trots op = orgulloso de.', level: 'B1' },
  { id: 'prep-tevreden-met', dutch: 'Ik ben heel tevreden ___ mijn nieuwe baan.', english: "I'm very happy with my new job.", translation_es: 'Estoy muy contento con mi nuevo trabajo.', answer: 'met', options: ['met', 'over', 'van', 'op'], category: 'adjective', explanation: 'tevreden met = satisfied / happy with.', explanation_es: 'tevreden met = satisfecho / contento con.', level: 'B1' },
  { id: 'prep-geinteresseerd-in', dutch: 'Hij is erg geïnteresseerd ___ geschiedenis.', english: "He's very interested in history.", translation_es: 'Está muy interesado en la historia.', answer: 'in', options: ['in', 'voor', 'op', 'aan'], category: 'adjective', explanation: 'geïnteresseerd in = interested in.', explanation_es: 'geïnteresseerd in = interesado en.', level: 'B1' },
  { id: 'prep-boos-op', dutch: 'De leraar was boos ___ de leerlingen.', english: 'The teacher was angry at the pupils.', translation_es: 'El profesor estaba enfadado con los alumnos.', answer: 'op', options: ['op', 'voor', 'aan', 'met'], category: 'adjective', explanation: 'boos op = angry at / with (a person).', explanation_es: 'boos op = enfadado con (una persona).', level: 'B1' },
  { id: 'prep-verliefd-op', dutch: 'Zij is verliefd ___ haar buurman.', english: "She's in love with her neighbour.", translation_es: 'Está enamorada de su vecino.', answer: 'op', options: ['op', 'van', 'met', 'aan'], category: 'adjective', explanation: 'verliefd op = in love with.', explanation_es: 'verliefd op = enamorado de.', level: 'B1' },
  { id: 'prep-afhankelijk-van', dutch: "Baby's zijn helemaal afhankelijk ___ hun ouders.", english: 'Babies are entirely dependent on their parents.', translation_es: 'Los bebés dependen totalmente de sus padres.', answer: 'van', options: ['van', 'aan', 'op', 'met'], category: 'adjective', explanation: 'afhankelijk van = dependent on.', explanation_es: 'afhankelijk van = dependiente de.', level: 'B1' },
  { id: 'prep-gek-op', dutch: 'Mijn dochter is gek ___ chocola.', english: 'My daughter is crazy about chocolate.', translation_es: 'Mi hija está loca por el chocolate.', answer: 'op', options: ['op', 'van', 'met', 'voor'], category: 'adjective', explanation: 'gek op = crazy about / mad about.', explanation_es: 'gek op = loco por.', level: 'B1' },

  // ── noun + preposition (B1) ────────────────────────────────────────────────
  { id: 'prep-behoefte-aan', dutch: 'Er is grote behoefte ___ verpleegkundigen.', english: "There's a great need for nurses.", translation_es: 'Hay una gran necesidad de enfermeros.', answer: 'aan', options: ['aan', 'van', 'naar', 'voor'], category: 'noun', explanation: 'behoefte aan = need for.', explanation_es: 'behoefte aan = necesidad de.', level: 'B1' },
  { id: 'prep-gebrek-aan', dutch: 'Door een gebrek ___ geld stopte het project.', english: 'The project stopped due to a lack of money.', translation_es: 'El proyecto se detuvo por falta de dinero.', answer: 'aan', options: ['aan', 'van', 'op', 'met'], category: 'noun', explanation: 'gebrek aan = lack of.', explanation_es: 'gebrek aan = falta de.', level: 'B1' },
  { id: 'prep-interesse-in', dutch: 'Ze heeft veel interesse ___ moderne kunst.', english: 'She has a lot of interest in modern art.', translation_es: 'Tiene mucho interés en el arte moderno.', answer: 'in', options: ['in', 'voor', 'aan', 'op'], category: 'noun', explanation: 'interesse in = interest in.', explanation_es: 'interesse in = interés en.', level: 'B1' },
];

async function main() {
  console.log(`Inserting ${rows.length} preposition exercises…`);
  const { error } = await supabase.from('preposition_exercises').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
