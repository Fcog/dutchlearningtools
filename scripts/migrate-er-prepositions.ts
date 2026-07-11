import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

// er + preposition (voornaamwoordelijke bijwoorden). Two uses:
//  - place/direction: the er-word replaces a known location (erin, eruit…).
//  - prepositional object: the er-word replaces a preposition + its object
//    (denken aan → eraan). Sentences use the JOINED form (nothing between er
//    and the preposition) so a single blank is grammatically correct.
// Distractors are always other real er-words, so the learner must know it.
const rows = [
  // ── place / direction (erin, eruit, erop, eraf…) ───────────────────────────
  { id: 'erp-place-doos-in', dutch: 'De doos is leeg. Doe de spullen ___.', english: 'The box is empty. Put the things in it.', translation_es: 'La caja está vacía. Mete las cosas dentro.', answer: 'erin', options: ['erin', 'eruit', 'erop', 'eraf'], usage: 'place', explanation: 'erin = into it (a container/space).', explanation_es: 'erin = dentro (de un espacio).', level: 'A2' },
  { id: 'erp-place-giet-uit', dutch: 'De emmer zit vol. Giet het water ___.', english: 'The bucket is full. Pour the water out.', translation_es: 'El cubo está lleno. Vierte el agua fuera.', answer: 'eruit', options: ['eruit', 'erin', 'erop', 'erdoor'], usage: 'place', explanation: 'eruit = out of it.', explanation_es: 'eruit = fuera (de algo).', level: 'A2' },
  { id: 'erp-place-stoel-op', dutch: 'Daar staat een stoel. Ga ___ zitten.', english: "There's a chair there. Sit on it.", translation_es: 'Ahí hay una silla. Siéntate encima.', answer: 'erop', options: ['erop', 'erin', 'eronder', 'eraf'], usage: 'place', explanation: 'erop = onto it (a surface).', explanation_es: 'erop = encima (de eso).', level: 'A2' },
  { id: 'erp-place-stof-af', dutch: 'Er ligt stof op de tafel. Veeg het ___.', english: "There's dust on the table. Wipe it off.", translation_es: 'Hay polvo en la mesa. Límpialo.', answer: 'eraf', options: ['eraf', 'erop', 'erin', 'eruit'], usage: 'place', explanation: 'eraf = off it (away from a surface).', explanation_es: 'eraf = de encima / fuera.', level: 'A2' },
  { id: 'erp-place-kat-onder', dutch: 'De tafel is groot. De kat zit ___.', english: 'The table is big. The cat is under it.', translation_es: 'La mesa es grande. El gato está debajo.', answer: 'eronder', options: ['eronder', 'erop', 'erin', 'ernaast'], usage: 'place', explanation: 'eronder = under it.', explanation_es: 'eronder = debajo (de eso).', level: 'A2' },
  { id: 'erp-place-auto-naast', dutch: 'Dat is het huis. De auto staat ___.', english: "That's the house. The car is next to it.", translation_es: 'Esa es la casa. El coche está al lado.', answer: 'ernaast', options: ['ernaast', 'eronder', 'erop', 'erin'], usage: 'place', explanation: 'ernaast = next to it.', explanation_es: 'ernaast = al lado (de eso).', level: 'A2' },
  { id: 'erp-place-deur-door', dutch: 'De deur is open. Je kunt ___.', english: 'The door is open. You can get through it.', translation_es: 'La puerta está abierta. Puedes pasar por ahí.', answer: 'erdoor', options: ['erdoor', 'erin', 'erop', 'eruit'], usage: 'place', explanation: 'erdoor = through it.', explanation_es: 'erdoor = por / a través de eso.', level: 'B1' },
  { id: 'erp-place-bad-in', dutch: 'Het bad is vol. Stap ___.', english: 'The bath is full. Step into it.', translation_es: 'La bañera está llena. Métete dentro.', answer: 'erin', options: ['erin', 'erop', 'eruit', 'eronder'], usage: 'place', explanation: 'erin = into it.', explanation_es: 'erin = dentro (de eso).', level: 'A2' },
  { id: 'erp-place-trein-uit', dutch: 'De trein stopt. Iedereen stapt ___.', english: 'The train stops. Everyone gets out.', translation_es: 'El tren para. Todos se bajan.', answer: 'eruit', options: ['eruit', 'erin', 'erop', 'eraf'], usage: 'place', explanation: 'eruit = out of it.', explanation_es: 'eruit = fuera (de eso).', level: 'A2' },
  { id: 'erp-place-knop-op', dutch: 'Hier is de knop. Druk ___.', english: "Here's the button. Press it.", translation_es: 'Aquí está el botón. Púlsalo.', answer: 'erop', options: ['erop', 'erin', 'eraf', 'eruit'], usage: 'place', explanation: 'erop = onto it (press on it).', explanation_es: 'erop = encima / sobre eso.', level: 'A2' },
  { id: 'erp-place-lamp-in', dutch: 'Ik draai de lamp ___.', english: 'I screw the bulb in.', translation_es: 'Enrosco la bombilla en el casquillo.', answer: 'erin', options: ['erin', 'erop', 'eruit', 'eraf'], usage: 'place', explanation: 'erin = into it (the socket).', explanation_es: 'erin = dentro (del casquillo).', level: 'A2' },
  { id: 'erp-place-sticker-af', dutch: 'De sticker zit op de doos. Haal hem ___.', english: 'The sticker is on the box. Take it off.', translation_es: 'La pegatina está en la caja. Quítala.', answer: 'eraf', options: ['eraf', 'erop', 'erin', 'ernaast'], usage: 'place', explanation: 'eraf = off it.', explanation_es: 'eraf = de encima / fuera.', level: 'A2' },
  { id: 'erp-place-ladder-tegen', dutch: 'De muur is hoog. Zet de ladder ___.', english: 'The wall is high. Put the ladder against it.', translation_es: 'El muro es alto. Apoya la escalera contra él.', answer: 'ertegen', options: ['ertegen', 'eronder', 'ernaast', 'erop'], usage: 'place', explanation: 'ertegen = against it.', explanation_es: 'ertegen = contra eso.', level: 'B1' },
  { id: 'erp-place-hek-langs', dutch: 'Er staat een hek. Je kunt ___ lopen.', english: "There's a fence. You can walk alongside it.", translation_es: 'Hay una valla. Puedes caminar junto a ella.', answer: 'erlangs', options: ['erlangs', 'erdoor', 'eronder', 'erover'], usage: 'place', explanation: 'erlangs = along / past it.', explanation_es: 'erlangs = a lo largo de / junto a eso.', level: 'B1' },

  // ── object of a preposition (eraan denken, erop wachten…) ───────────────────
  { id: 'erp-obj-denken-aan', dutch: 'Ik denk ___.', english: 'I think about it.', translation_es: 'Pienso en eso.', answer: 'eraan', options: ['eraan', 'erop', 'ervoor', 'erover'], usage: 'prepositional', explanation: 'denken aan → eraan (to think about it).', explanation_es: 'denken aan → eraan (pensar en eso).', level: 'A2' },
  { id: 'erp-obj-wachten-op', dutch: 'De bus komt zo. We wachten ___.', english: "The bus is coming soon. We're waiting for it.", translation_es: 'El autobús viene pronto. Lo esperamos.', answer: 'erop', options: ['erop', 'eraan', 'ervan', 'ernaar'], usage: 'prepositional', explanation: 'wachten op → erop (to wait for it).', explanation_es: 'wachten op → erop (esperarlo).', level: 'A2' },
  { id: 'erp-obj-kijken-naar', dutch: 'Er is een mooie film. Ik kijk ___.', english: "There's a nice film. I'm watching it.", translation_es: 'Hay una buena película. La estoy viendo.', answer: 'ernaar', options: ['ernaar', 'eraan', 'erop', 'erover'], usage: 'prepositional', explanation: 'kijken naar → ernaar (to watch / look at it).', explanation_es: 'kijken naar → ernaar (mirarlo / verlo).', level: 'A2' },
  { id: 'erp-obj-praten-over', dutch: 'Het is een lastig onderwerp. We praten ___.', english: "It's a tricky topic. We talk about it.", translation_es: 'Es un tema difícil. Hablamos de ello.', answer: 'erover', options: ['erover', 'eraan', 'ervoor', 'ernaar'], usage: 'prepositional', explanation: 'praten over → erover (to talk about it).', explanation_es: 'praten over → erover (hablar de ello).', level: 'A2' },
  { id: 'erp-obj-kiezen-voor', dutch: 'Er waren twee opties. Ik kies ___.', english: 'There were two options. I choose it.', translation_es: 'Había dos opciones. Opto por ello.', answer: 'ervoor', options: ['ervoor', 'eraan', 'erop', 'ermee'], usage: 'prepositional', explanation: 'kiezen voor → ervoor (to opt for it).', explanation_es: 'kiezen voor → ervoor (optar por ello).', level: 'B1' },
  { id: 'erp-obj-geloven-in', dutch: 'Het plan is goed. Ik geloof ___.', english: 'The plan is good. I believe in it.', translation_es: 'El plan es bueno. Creo en él.', answer: 'erin', options: ['erin', 'eraan', 'ermee', 'erop'], usage: 'prepositional', explanation: 'geloven in → erin (to believe in it).', explanation_es: 'geloven in → erin (creer en ello).', level: 'B1' },
  { id: 'erp-obj-beginnen-met', dutch: 'De les start. We beginnen ___.', english: 'The lesson starts. We begin with it.', translation_es: 'La clase empieza. Empezamos con ello.', answer: 'ermee', options: ['ermee', 'eraan', 'erop', 'ervoor'], usage: 'prepositional', explanation: 'beginnen met → ermee (to begin with it).', explanation_es: 'beginnen met → ermee (empezar con ello).', level: 'A2' },
  { id: 'erp-obj-houden-van', dutch: 'Lekker eten! Ik houd ___.', english: 'Delicious food! I love it.', translation_es: '¡Qué rica comida! Me encanta.', answer: 'ervan', options: ['ervan', 'eraan', 'erop', 'erover'], usage: 'prepositional', explanation: 'houden van → ervan (to love it).', explanation_es: 'houden van → ervan (encantarle).', level: 'A2' },
  { id: 'erp-obj-twijfelen-aan', dutch: 'Klopt zijn verhaal? Ik twijfel ___.', english: 'Is his story true? I doubt it.', translation_es: '¿Es cierta su historia? Lo dudo.', answer: 'eraan', options: ['eraan', 'erover', 'erop', 'ervan'], usage: 'prepositional', explanation: 'twijfelen aan → eraan (to doubt it).', explanation_es: 'twijfelen aan → eraan (dudar de ello).', level: 'B1' },
  { id: 'erp-obj-lachen-om', dutch: 'De grap was goed. We lachten ___.', english: 'The joke was good. We laughed about it.', translation_es: 'El chiste fue bueno. Nos reímos de ello.', answer: 'erom', options: ['erom', 'erover', 'ernaar', 'eraan'], usage: 'prepositional', explanation: 'lachen om → erom (to laugh about it).', explanation_es: 'lachen om → erom (reírse de ello).', level: 'B1' },
  { id: 'erp-obj-luisteren-naar', dutch: 'Mooie muziek. Ik luister ___.', english: "Nice music. I'm listening to it.", translation_es: 'Buena música. La escucho.', answer: 'ernaar', options: ['ernaar', 'erop', 'eraan', 'ervan'], usage: 'prepositional', explanation: 'luisteren naar → ernaar (to listen to it).', explanation_es: 'luisteren naar → ernaar (escucharlo).', level: 'A2' },
  { id: 'erp-obj-rekenen-op', dutch: 'Je bent een goede vriend. Ik reken ___.', english: "You're a good friend. I count on it.", translation_es: 'Eres un buen amigo. Cuento con ello.', answer: 'erop', options: ['erop', 'eraan', 'ermee', 'ervoor'], usage: 'prepositional', explanation: 'rekenen op → erop (to count on it).', explanation_es: 'rekenen op → erop (contar con ello).', level: 'B1' },
  { id: 'erp-obj-vragen-naar', dutch: 'Hij wilde het weten. Hij vroeg ___.', english: 'He wanted to know. He asked about it.', translation_es: 'Quería saberlo. Preguntó por ello.', answer: 'ernaar', options: ['ernaar', 'erom', 'eraan', 'erover'], usage: 'prepositional', explanation: 'vragen naar → ernaar (to ask about it).', explanation_es: 'vragen naar → ernaar (preguntar por ello).', level: 'B1' },
  { id: 'erp-obj-stoppen-met', dutch: 'Roken is slecht. Hij stopt ___.', english: 'Smoking is bad. He is quitting it.', translation_es: 'Fumar es malo. Lo deja.', answer: 'ermee', options: ['ermee', 'eraan', 'erop', 'ervan'], usage: 'prepositional', explanation: 'stoppen met → ermee (to stop with it).', explanation_es: 'stoppen met → ermee (dejar / parar con ello).', level: 'A2' },
];

async function main() {
  console.log(`Inserting ${rows.length} er + preposition exercises…`);
  const { error } = await supabase.from('er_preposition_exercises').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
