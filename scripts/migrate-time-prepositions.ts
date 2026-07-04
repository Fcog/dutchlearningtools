import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

// Time prepositions. The hard core is om (clock) vs op (day/date) vs in
// (month/season/year/part of day). Distractors are always other real time
// prepositions so the learner has to pick by the type of time expression.
const rows = [
  // ── om: clock time ─────────────────────────────────────────────────────────
  { id: 'time-om-acht', dutch: 'De film begint ___ acht uur.', english: 'The film starts at eight o’clock.', translation_es: 'La película empieza a las ocho.', answer: 'om', options: ['om', 'op', 'in', 'rond'], category: 'clock', explanation: 'om is used for clock times: om acht uur.', explanation_es: 'om se usa para las horas del reloj: om acht uur.', level: 'A1' },
  { id: 'time-om-halfdrie', dutch: 'We hebben ___ half drie een afspraak.', english: 'We have an appointment at half past two.', translation_es: 'Tenemos una cita a las dos y media.', answer: 'om', options: ['om', 'op', 'in', 'na'], category: 'clock', explanation: 'Exact clock times take om: om half drie.', explanation_es: 'Las horas exactas llevan om: om half drie.', level: 'A1' },
  { id: 'time-om-middernacht', dutch: 'Het feest eindigt pas ___ middernacht.', english: "The party doesn't end until midnight.", translation_es: 'La fiesta no termina hasta la medianoche.', answer: 'om', options: ['om', 'rond', 'op', 'in'], category: 'clock', explanation: 'A precise point on the clock (middernacht) takes om.', explanation_es: 'Un punto preciso del reloj (middernacht) lleva om.', level: 'A2' },

  // ── op: day / date ───────────────────────────────────────────────────────────
  { id: 'time-op-zondag', dutch: 'Ik werk niet ___ zondag.', english: "I don't work on Sunday.", translation_es: 'No trabajo el domingo.', answer: 'op', options: ['op', 'om', 'in', 'aan'], category: 'day', explanation: 'op is used for days of the week: op zondag.', explanation_es: 'op se usa para los días de la semana: op zondag.', level: 'A1' },
  { id: 'time-op-datum', dutch: 'Zij is jarig ___ 12 maart.', english: 'Her birthday is on 12 March.', translation_es: 'Su cumpleaños es el 12 de marzo.', answer: 'op', options: ['op', 'in', 'om', 'aan'], category: 'day', explanation: 'Full dates take op: op 12 maart.', explanation_es: 'Las fechas completas llevan op: op 12 maart.', level: 'A2' },
  { id: 'time-op-verjaardag', dutch: '___ mijn verjaardag geef ik een groot feest.', english: 'On my birthday I throw a big party.', translation_es: 'En mi cumpleaños hago una gran fiesta.', answer: 'Op', options: ['Op', 'In', 'Om', 'Aan'], category: 'day', explanation: 'A specific day like a birthday takes op: op mijn verjaardag.', explanation_es: 'Un día concreto como el cumpleaños lleva op: op mijn verjaardag.', level: 'A2' },
  { id: 'time-op-maandagochtend', dutch: 'De vergadering is ___ maandagochtend.', english: 'The meeting is on Monday morning.', translation_es: 'La reunión es el lunes por la mañana.', answer: 'op', options: ['op', 'in', 'om', 'aan'], category: 'day', explanation: 'A named day (even with a part of it) takes op: op maandagochtend.', explanation_es: 'Un día concreto (aunque incluya una parte) lleva op: op maandagochtend.', level: 'A2' },

  // ── in: month / season / year / part of day / period ────────────────────────
  { id: 'time-in-jaar', dutch: 'Mijn broer is ___ 1998 geboren.', english: 'My brother was born in 1998.', translation_es: 'Mi hermano nació en 1998.', answer: 'in', options: ['in', 'op', 'om', 'sinds'], category: 'period', explanation: 'Years take in: in 1998.', explanation_es: 'Los años llevan in: in 1998.', level: 'A1' },
  { id: 'time-in-zomer', dutch: '___ de zomer gaan we naar Spanje.', english: 'In the summer we go to Spain.', translation_es: 'En verano vamos a España.', answer: 'In', options: ['In', 'Op', 'Om', 'Na'], category: 'period', explanation: 'Seasons take in: in de zomer.', explanation_es: 'Las estaciones llevan in: in de zomer.', level: 'A1' },
  { id: 'time-in-januari', dutch: 'Het is vaak koud ___ januari.', english: "It's often cold in January.", translation_es: 'A menudo hace frío en enero.', answer: 'in', options: ['in', 'op', 'om', 'tijdens'], category: 'period', explanation: 'Months take in: in januari.', explanation_es: 'Los meses llevan in: in januari.', level: 'A2' },
  { id: 'time-in-ochtend', dutch: 'Ik drink alleen ___ de ochtend koffie.', english: 'I only drink coffee in the morning.', translation_es: 'Solo bebo café por la mañana.', answer: 'in', options: ['in', 'op', 'om', 'na'], category: 'period', explanation: 'Parts of the day take in de …: in de ochtend.', explanation_es: 'Las partes del día llevan in de …: in de ochtend.', level: 'A2' },
  { id: 'time-in-weekend', dutch: 'We gaan ___ het weekend fietsen.', english: "We're going cycling at the weekend.", translation_es: 'Vamos en bici el fin de semana.', answer: 'in', options: ['in', 'op', 'om', 'tijdens'], category: 'period', explanation: 'in het weekend = at the weekend.', explanation_es: 'in het weekend = el fin de semana.', level: 'A2' },

  // ── na / voor: sequence ──────────────────────────────────────────────────────
  { id: 'time-na-eten', dutch: '___ het eten doen we de afwas.', english: 'After dinner we do the dishes.', translation_es: 'Después de comer fregamos los platos.', answer: 'Na', options: ['Na', 'Voor', 'Tijdens', 'Sinds'], category: 'sequence', explanation: 'na = after (a later point in a sequence).', explanation_es: 'na = después de (un punto posterior).', level: 'A1' },
  { id: 'time-voor-slapen', dutch: 'Poets je tanden ___ het slapengaan.', english: 'Brush your teeth before going to sleep.', translation_es: 'Cepíllate los dientes antes de dormir.', answer: 'voor', options: ['voor', 'na', 'tijdens', 'tot'], category: 'sequence', explanation: 'voor = before (an earlier point in a sequence).', explanation_es: 'voor = antes de (un punto anterior).', level: 'A2' },
  { id: 'time-na-les', dutch: '___ de les ga ik meteen naar huis.', english: 'After class I go straight home.', translation_es: 'Después de clase me voy directo a casa.', answer: 'Na', options: ['Na', 'Voor', 'Om', 'In'], category: 'sequence', explanation: 'na het/de … = after the …', explanation_es: 'na het/de … = después de …', level: 'A1' },

  // ── duration / limits: tijdens / sinds / vanaf / tot / over / binnen ────────
  { id: 'time-tijdens-vakantie', dutch: '___ de vakantie hebben we veel gezwommen.', english: 'During the holiday we swam a lot.', translation_es: 'Durante las vacaciones nadamos mucho.', answer: 'Tijdens', options: ['Tijdens', 'Sinds', 'Voor', 'Om'], category: 'duration', explanation: 'tijdens = during (throughout a period).', explanation_es: 'tijdens = durante (a lo largo de un período).', level: 'A2' },
  { id: 'time-sinds-2015', dutch: 'Ik woon hier ___ 2015.', english: "I've lived here since 2015.", translation_es: 'Vivo aquí desde 2015.', answer: 'sinds', options: ['sinds', 'vanaf', 'tot', 'in'], category: 'duration', explanation: 'sinds = since (a past start that continues up to now).', explanation_es: 'sinds = desde (un inicio en el pasado que sigue hasta ahora).', level: 'B1' },
  { id: 'time-tot-zes', dutch: 'De winkel is open ___ zes uur.', english: "The shop is open until six o'clock.", translation_es: 'La tienda está abierta hasta las seis.', answer: 'tot', options: ['tot', 'om', 'na', 'sinds'], category: 'duration', explanation: 'tot = until (the end point).', explanation_es: 'tot = hasta (el punto final).', level: 'A2' },
  { id: 'time-vanaf-maandag', dutch: '___ maandag ben ik weer aan het werk.', english: "From Monday I'm back at work.", translation_es: 'A partir del lunes vuelvo al trabajo.', answer: 'Vanaf', options: ['Vanaf', 'Sinds', 'Tot', 'Na'], category: 'duration', explanation: 'vanaf = from … onwards (a start point, often future). sinds is only for the past.', explanation_es: 'vanaf = a partir de (un inicio, a menudo futuro). sinds es solo para el pasado.', level: 'B1' },
  { id: 'time-over-tien', dutch: 'De trein vertrekt ___ tien minuten.', english: 'The train leaves in ten minutes.', translation_es: 'El tren sale en diez minutos.', answer: 'over', options: ['over', 'in', 'na', 'binnen'], category: 'duration', explanation: 'over = in … (a moment in the future measured from now): over tien minuten.', explanation_es: 'over = dentro de … (un momento futuro contado desde ahora): over tien minuten.', level: 'B1' },
  { id: 'time-binnen-week', dutch: 'Je moet het formulier ___ een week inleveren.', english: 'You have to hand in the form within a week.', translation_es: 'Tienes que entregar el formulario dentro de una semana.', answer: 'binnen', options: ['binnen', 'over', 'tot', 'in'], category: 'duration', explanation: 'binnen = within (before a deadline elapses): binnen een week.', explanation_es: 'binnen = dentro de / antes de que pase (un plazo): binnen een week.', level: 'B1' },
  { id: 'time-tot-zondag', dutch: 'We blijven ___ zondag in Parijs.', english: 'We’re staying in Paris until Sunday.', translation_es: 'Nos quedamos en París hasta el domingo.', answer: 'tot', options: ['tot', 'sinds', 'vanaf', 'op'], category: 'duration', explanation: 'tot = until (up to an end point): tot zondag.', explanation_es: 'tot = hasta (un punto final): tot zondag.', level: 'A2' },
  { id: 'time-sinds-vorige-week', dutch: '___ vorige week voel ik me veel beter.', english: "Since last week I've felt much better.", translation_es: 'Desde la semana pasada me siento mucho mejor.', answer: 'Sinds', options: ['Sinds', 'Vanaf', 'Tot', 'Voor'], category: 'duration', explanation: 'sinds points back to a past start that still holds now.', explanation_es: 'sinds señala un inicio en el pasado que sigue vigente ahora.', level: 'B1' },

  // ── rond: approximate time / period ─────────────────────────────────────────
  { id: 'time-rond-kerst', dutch: '___ kerst is het hier altijd erg druk.', english: "Around Christmas it's always very busy here.", translation_es: 'Alrededor de Navidad siempre hay mucho ajetreo aquí.', answer: 'Rond', options: ['Rond', 'Om', 'Op', 'In'], category: 'period', explanation: 'rond = around (an approximate time or period): rond kerst.', explanation_es: 'rond = alrededor de (un momento o período aproximado): rond kerst.', level: 'B1' },
];

async function main() {
  console.log(`Inserting ${rows.length} time-preposition exercises…`);
  const { error } = await supabase.from('time_prep_exercises').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
