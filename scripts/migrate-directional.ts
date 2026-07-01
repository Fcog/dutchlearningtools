import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

// Directional / positional adverbs. Distractors are same-prefix siblings so the
// learner has to pick by the suffix's meaning, not just front (voor-) vs back (achter-).
const rows = [
  // ── -aan: static position ────────────────────────────────────────────────
  { id: 'dir-vooraan-klas', dutch: 'De kleine kinderen zitten ___ in de klas, vlak bij het bord.', english: 'The little children sit at the front of the class, right by the board.', answer: 'vooraan', options: ['vooraan', 'vooruit', 'voorop', 'naar voren'], explanation: '“-aan” marks a static position: vooraan = at the front of a space or row.', explanation_es: '“-aan” indica una posición estática: vooraan = delante del todo en un espacio o fila.', translation_es: 'Los niños pequeños se sientan delante en clase, justo al lado de la pizarra.', level: 'A1' },
  { id: 'dir-vooraan-bus', dutch: 'In de bus ga ik het liefst ___ zitten, naast de chauffeur.', english: 'On the bus I prefer to sit at the front, next to the driver.', answer: 'vooraan', options: ['vooraan', 'vooruit', 'voorop', 'naar voren'], explanation: 'vooraan = the static position at the front of the space.', explanation_es: 'vooraan = la posición estática delante del todo en el espacio.', translation_es: 'En el autobús prefiero sentarme delante, al lado del conductor.', level: 'A1' },
  { id: 'dir-achteraan-rij', dutch: 'Wie te laat komt, moet ___ in de rij aansluiten.', english: 'Whoever comes late has to join at the back of the queue.', answer: 'achteraan', options: ['achteraan', 'achteruit', 'achterop', 'achterom'], explanation: '“-aan” = static position: achteraan = at the back of a row or line.', explanation_es: '“-aan” = posición estática: achteraan = al final de una fila.', translation_es: 'Quien llega tarde tiene que ponerse al final de la fila.', level: 'A1' },
  { id: 'dir-achteraan-stoet', dutch: 'De jongste leerlingen lopen ___ in de stoet.', english: 'The youngest pupils walk at the back of the procession.', answer: 'achteraan', options: ['achteraan', 'achteruit', 'achterop', 'achterom'], explanation: 'achteraan = the back position of a line or procession.', explanation_es: 'achteraan = la posición trasera de una fila o desfile.', translation_es: 'Los alumnos más jóvenes van al final del desfile.', level: 'A2' },

  // ── -uit: movement direction ───────────────────────────────────────────────
  { id: 'dir-vooruit-wagen', dutch: 'Duw de kinderwagen voorzichtig ___.', english: 'Push the stroller forward carefully.', answer: 'vooruit', options: ['vooruit', 'vooraan', 'voorop', 'naar voren'], explanation: '“-uit” marks movement: vooruit = forwards.', explanation_es: '“-uit” indica movimiento: vooruit = hacia adelante.', translation_es: 'Empuja el cochecito con cuidado hacia adelante.', level: 'A1' },
  { id: 'dir-vooruit-fiets', dutch: 'Trap stevig door, dan kom je sneller ___.', english: 'Pedal hard and you will move forward faster.', answer: 'vooruit', options: ['vooruit', 'vooraan', 'voorop', 'naar voren'], explanation: 'vooruit = forward movement.', explanation_es: 'vooruit = movimiento hacia adelante.', translation_es: 'Pedalea con fuerza y avanzarás más rápido.', level: 'A2' },
  { id: 'dir-achteruit-auto', dutch: 'De vrachtwagen rijdt piepend ___ de straat in.', english: 'The truck beeps as it reverses into the street.', answer: 'achteruit', options: ['achteruit', 'achteraan', 'achterop', 'achterom'], explanation: '“-uit” = movement direction: achteruit = backwards / in reverse.', explanation_es: '“-uit” = dirección del movimiento: achteruit = hacia atrás / marcha atrás.', translation_es: 'El camión retrocede pitando hacia la calle.', level: 'A2' },
  { id: 'dir-achteruit-stap', dutch: 'Doe een stap ___, anders sta je op mijn tenen.', english: "Take a step back, or you'll be standing on my toes.", answer: 'achteruit', options: ['achteruit', 'achteraan', 'achterop', 'achterom'], explanation: 'achteruit = a backward step or movement.', explanation_es: 'achteruit = un paso o movimiento hacia atrás.', translation_es: 'Da un paso atrás, o me pisarás los dedos.', level: 'A2' },

  // ── -op: on the front/back surface, or leading / on the rear ────────────────
  { id: 'dir-voorop-optocht', dutch: 'Tijdens de optocht loopt de fanfare ___.', english: 'During the parade the brass band walks out front.', answer: 'voorop', options: ['voorop', 'vooraan', 'vooruit', 'naar voren'], explanation: 'voorop = in the lead, at the very head of a group.', explanation_es: 'voorop = a la cabeza, al frente de un grupo.', translation_es: 'Durante el desfile, la banda va al frente.', level: 'A2' },
  { id: 'dir-voorop-race', dutch: 'In de race lag onze ploeg de hele tijd ___.', english: 'In the race our team was in the lead the whole time.', answer: 'voorop', options: ['voorop', 'vooraan', 'vooruit', 'naar voren'], explanation: 'voorop liggen / lopen = to be in the lead, ahead of the rest.', explanation_es: 'voorop liggen / lopen = ir en cabeza, por delante de los demás.', translation_es: 'En la carrera nuestro equipo fue en cabeza todo el tiempo.', level: 'B1' },
  { id: 'dir-achterop-fiets', dutch: 'Mijn zusje zit ___ de fiets.', english: 'My little sister rides on the back of the bike.', answer: 'achterop', options: ['achterop', 'achteraan', 'achteruit', 'achterom'], explanation: '“-op” = on the rear surface: achterop = on the back (e.g. of a bike).', explanation_es: '“-op” = sobre la parte trasera: achterop = detrás/encima atrás (p. ej. de la bici).', translation_es: 'Mi hermanita va detrás en la bici.', level: 'A2' },
  { id: 'dir-achterop-naam', dutch: 'Schrijf je naam maar ___, op de achterkant van het blad.', english: 'Just write your name on the back, on the reverse of the sheet.', answer: 'achterop', options: ['achterop', 'achteraan', 'achteruit', 'achterom'], explanation: 'achterop = on the back surface of something (e.g. the back of a sheet).', explanation_es: 'achterop = en la cara trasera de algo (p. ej. el dorso de la hoja).', translation_es: 'Escribe tu nombre detrás, en el dorso de la hoja.', level: 'A2' },

  // ── -om: the route around the back (no "voorom") ───────────────────────────
  { id: 'dir-achterom-deur', dutch: 'De voordeur zit op slot, loop maar ___ naar de achterdeur.', english: 'The front door is locked, just go around the back to the back door.', answer: 'achterom', options: ['achterom', 'achteraan', 'achteruit', 'achterop'], explanation: '“-om” = the route around: achterom = round the back. There is no “voorom” — to go in front you just go straight in.', explanation_es: '“-om” = la ruta rodeando: achterom = por detrás, rodeando. No existe “voorom”: por delante entras directamente.', translation_es: 'La puerta de delante está cerrada, ve por detrás hasta la puerta trasera.', level: 'B1' },
  { id: 'dir-achterom-tuin', dutch: 'Je hoeft niet aan te bellen, loop gerust ___ de tuin in.', english: "You don't have to ring the bell, just go around the back into the garden.", answer: 'achterom', options: ['achterom', 'achteraan', 'achteruit', 'achterop'], explanation: 'achterom = via the route around the back of the house.', explanation_es: 'achterom = por la ruta que rodea la parte de atrás de la casa.', translation_es: 'No hace falta que llames, entra por detrás al jardín.', level: 'B1' },

  // ── naar voren / naar achteren: directional shift (also figurative) ─────────
  { id: 'dir-naar-voren-versta', dutch: 'Kun je iets ___ komen? Ik kan je niet goed verstaan.', english: "Can you come forward a bit? I can't hear you well.", answer: 'naar voren', options: ['naar voren', 'vooraan', 'vooruit', 'voorop'], explanation: 'naar voren = a directional shift toward the front (move / come forward).', explanation_es: 'naar voren = un desplazamiento hacia la parte delantera (acércate, ven adelante).', translation_es: '¿Puedes acercarte un poco? No te oigo bien.', level: 'A2' },
  { id: 'dir-naar-voren-idee', dutch: 'Tijdens de vergadering bracht zij een goed idee ___.', english: 'During the meeting she put forward a good idea.', answer: 'naar voren', options: ['naar voren', 'vooraan', 'vooruit', 'voorop'], explanation: '“naar voren brengen” = to put forward / raise an idea — a figurative use of naar voren.', explanation_es: '“naar voren brengen” = plantear / proponer una idea — uso figurado de naar voren.', translation_es: 'Durante la reunión ella planteó una buena idea.', level: 'B1' },
  { id: 'dir-naar-achteren-leun', dutch: 'Leun maar rustig ___ in je stoel en ontspan.', english: 'Just lean back in your chair and relax.', answer: 'naar achteren', options: ['naar achteren', 'achteraan', 'achteruit', 'achterop'], explanation: 'naar achteren = a directional shift toward the back (lean / move back).', explanation_es: 'naar achteren = un desplazamiento hacia atrás (recostarse, echarse atrás).', translation_es: 'Recuéstate tranquilamente hacia atrás en tu silla y relájate.', level: 'A2' },
  { id: 'dir-naar-achteren-schuif', dutch: 'Kun je je stoel iets ___ schuiven? Ik wil erlangs.', english: 'Can you slide your chair back a bit? I want to get past.', answer: 'naar achteren', options: ['naar achteren', 'achteraan', 'achteruit', 'achterop'], explanation: 'naar achteren = move / slide toward the back.', explanation_es: 'naar achteren = mover / deslizar hacia atrás.', translation_es: '¿Puedes correr la silla un poco hacia atrás? Quiero pasar.', level: 'A2' },
];

async function main() {
  console.log(`Inserting ${rows.length} directional adverb exercises…`);
  const { error } = await supabase.from('directional_exercises').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
