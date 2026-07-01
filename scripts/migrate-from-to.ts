import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

// Source vs goal of motion: vandaan (from) / heen (to, stands alone) /
// toe (to, needs "naar … toe"). The same three chips appear on every item; the
// sentence frame makes exactly one correct, which also teaches the grammar.
const OPTS = ['vandaan', 'heen', 'toe'];

const rows = [
  // ── vandaan: where FROM (origin) ───────────────────────────────────────────
  { id: 'ft-vandaan-kom-q', dutch: 'Waar kom je ___? Uit Nederland of uit België?', english: 'Where do you come from? From the Netherlands or from Belgium?', answer: 'vandaan', options: OPTS, explanation: 'vandaan = from (the origin you move away from); it pairs with komen and waar/er/daar.', explanation_es: 'vandaan = de dónde (el origen del que vienes); va con komen y waar/er/daar.', translation_es: '¿De dónde eres? ¿De los Países Bajos o de Bélgica?', level: 'A1' },
  { id: 'ft-vandaan-daar', dutch: 'Daar komt de trein net ___.', english: 'The train just came from there.', answer: 'vandaan', options: OPTS, explanation: 'vandaan marks the origin point of the movement (coming from there).', explanation_es: 'vandaan marca el punto de origen del movimiento (venir de ahí).', translation_es: 'El tren acaba de venir de ahí.', level: 'A2' },
  { id: 'ft-vandaan-hier', dutch: 'Ik ben hier niet ___; ik woon eigenlijk in Gent.', english: "I'm not from here; I actually live in Ghent.", answer: 'vandaan', options: OPTS, explanation: '“hier vandaan” = from here — origin.', explanation_es: '“hier vandaan” = de aquí — origen.', translation_es: 'No soy de aquí; en realidad vivo en Gante.', level: 'A2' },

  // ── heen: where TO (destination), no "naar" ─────────────────────────────────
  { id: 'ft-heen-ga-q', dutch: 'Waar ga je ___? Naar huis?', english: 'Where are you going? Home?', answer: 'heen', options: OPTS, explanation: 'heen = to (destination) and stands alone, without “naar”: Waar ga je heen?', explanation_es: 'heen = a dónde (destino) y va solo, sin “naar”: Waar ga je heen?', translation_es: '¿A dónde vas? ¿A casa?', level: 'A1' },
  { id: 'ft-heen-weet', dutch: 'Ik weet nog niet waar we dit weekend ___ gaan.', english: "I don't know yet where we're going this weekend.", answer: 'heen', options: OPTS, explanation: '“waar … heen gaan” = where to go. heen needs no “naar” (so bare “toe” is wrong here).', explanation_es: '“waar … heen gaan” = a dónde ir. heen no necesita “naar” (por eso “toe” a secas no vale aquí).', translation_es: 'Todavía no sé a dónde vamos este fin de semana.', level: 'A2' },
  { id: 'ft-heen-er', dutch: 'De dokter is ver weg, maar we moeten er toch ___.', english: 'The doctor is far away, but we still have to go there.', answer: 'heen', options: OPTS, explanation: '“erheen” = (to) there. With “er”, heen attaches directly; bare “toe” would need “naar” (ernaartoe).', explanation_es: '“erheen” = (hacia) allí. Con “er”, heen se une directamente; “toe” a secas necesitaría “naar” (ernaartoe).', translation_es: 'El médico está lejos, pero aun así tenemos que ir allí.', level: 'B1' },
  { id: 'ft-heen-enweer', dutch: 'De veerboot vaart de hele dag ___ en weer.', english: 'The ferry sails back and forth all day.', answer: 'heen', options: OPTS, explanation: 'Fixed expression “heen en weer” = back and forth.', explanation_es: 'Expresión fija “heen en weer” = de ida y vuelta / de un lado a otro.', translation_es: 'El ferry navega de un lado a otro todo el día.', level: 'B1' },

  // ── toe: where TO (destination), always "naar … toe" ────────────────────────
  { id: 'ft-toe-winkel', dutch: 'Ik loop even naar de winkel ___.', english: "I'm just walking over to the shop.", answer: 'toe', options: OPTS, explanation: 'toe completes the frame “naar … toe” = (going) to; it always needs “naar”.', explanation_es: 'toe completa el marco “naar … toe” = hacia; siempre necesita “naar”.', translation_es: 'Voy un momento a la tienda.', level: 'A1' },
  { id: 'ft-toe-concert', dutch: 'Ga je met ons mee naar het concert ___?', english: 'Are you coming along with us to the concert?', answer: 'toe', options: OPTS, explanation: '“naar het concert toe” — toe pairs with “naar” to mark the destination.', explanation_es: '“naar het concert toe” — toe se combina con “naar” para marcar el destino.', translation_es: '¿Vienes con nosotros al concierto?', level: 'A2' },
  { id: 'ft-toe-tandarts', dutch: 'Morgen moet ik naar de tandarts ___.', english: 'Tomorrow I have to go to the dentist.', answer: 'toe', options: OPTS, explanation: '“naar de tandarts toe” — destination with the “naar … toe” frame.', explanation_es: '“naar de tandarts toe” — destino con el marco “naar … toe”.', translation_es: 'Mañana tengo que ir al dentista.', level: 'A2' },
];

async function main() {
  console.log(`Inserting ${rows.length} from/to (vandaan / heen / toe) exercises…`);
  const { error } = await supabase.from('from_to_exercises').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
