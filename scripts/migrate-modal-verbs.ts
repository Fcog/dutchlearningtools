import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

// Modal auxiliary verbs (modale hulpwerkwoorden): moeten (obligation), mogen
// (permission), willen (wish), zullen (future/suggestion), hoeven (no necessity,
// with niet/geen), kunnen (ability/possibility). The blank is the conjugated
// modal; every option is conjugated to the SAME subject & tense, so the learner
// must pick by MEANING. Distractors are always other real modals.
const rows = [
  // ── present tense ───────────────────────────────────────────────────────────
  { id: 'modal-ziek-moet', dutch: 'Ik ben ziek. Ik ___ naar de dokter.', english: "I'm ill. I have to go to the doctor.", translation_es: 'Estoy enfermo. Tengo que ir al médico.', answer: 'moet', options: ['moet', 'mag', 'wil', 'kan'], tense: 'present', explanation: 'moeten = to have to / must (obligation).', explanation_es: 'moeten = tener que / deber (obligación).', level: 'A2' },
  { id: 'modal-18-mag', dutch: 'Je bent 18. Je ___ nu autorijden.', english: "You're 18. You may drive now.", translation_es: 'Tienes 18. Ahora puedes conducir.', answer: 'mag', options: ['mag', 'moet', 'hoeft', 'kan'], tense: 'present', explanation: 'mogen = to be allowed to / may (permission).', explanation_es: 'mogen = poder / tener permiso (permiso).', level: 'A2' },
  { id: 'modal-honger-wil', dutch: 'Ik heb honger. Ik ___ een broodje.', english: "I'm hungry. I want a sandwich.", translation_es: 'Tengo hambre. Quiero un bocadillo.', answer: 'wil', options: ['wil', 'mag', 'moet', 'zal'], tense: 'present', explanation: 'willen = to want (wish/desire).', explanation_es: 'willen = querer (deseo).', level: 'A2' },
  { id: 'modal-zwemmen-kan', dutch: 'Zij heeft goed geleerd. Zij ___ heel goed zwemmen.', english: 'She learned well. She can swim very well.', translation_es: 'Aprendió bien. Sabe nadar muy bien.', answer: 'kan', options: ['kan', 'moet', 'mag', 'wil'], tense: 'present', explanation: 'kunnen = to be able to / can (ability).', explanation_es: 'kunnen = poder / saber (capacidad).', level: 'A2' },
  { id: 'modal-bellen-zal', dutch: 'Ik ___ je morgen bellen.', english: "I'll call you tomorrow.", translation_es: 'Te llamaré mañana.', answer: 'zal', options: ['zal', 'wil', 'moet', 'kan'], tense: 'present', explanation: 'zullen = shall / will (future, promise).', explanation_es: 'zullen = ir a / futuro (promesa).', level: 'B1' },
  { id: 'modal-gratis-hoeft', dutch: 'Het is gratis. Je ___ niet te betalen.', english: "It's free. You don't have to pay.", translation_es: 'Es gratis. No tienes que pagar.', answer: 'hoeft', options: ['hoeft', 'moet', 'mag', 'kan'], tense: 'present', explanation: 'hoeven (niet) = not to have to; used with niet/geen + te.', explanation_es: 'hoeven (niet) = no tener que; se usa con niet/geen + te.', level: 'B1' },
  { id: 'modal-regenen-kan', dutch: 'Neem een jas mee. Het ___ morgen regenen.', english: 'Take a coat. It may rain tomorrow.', translation_es: 'Lleva un abrigo. Puede que llueva mañana.', answer: 'kan', options: ['kan', 'mag', 'moet', 'zal'], tense: 'present', explanation: 'kunnen = can / may (possibility).', explanation_es: 'kunnen = poder (posibilidad).', level: 'B1' },
  { id: 'modal-opschieten-moet', dutch: 'De les begint om negen uur. Hij ___ opschieten.', english: 'The lesson starts at nine. He has to hurry.', translation_es: 'La clase empieza a las nueve. Tiene que darse prisa.', answer: 'moet', options: ['moet', 'mag', 'wil', 'kan'], tense: 'present', explanation: 'moeten = to have to / must (obligation).', explanation_es: 'moeten = tener que / deber (obligación).', level: 'A2' },
  { id: 'modal-roken-mag', dutch: 'Hier ___ je niet roken.', english: "You may not smoke here.", translation_es: 'Aquí no puedes fumar.', answer: 'mag', options: ['mag', 'hoeft', 'kan', 'wil'], tense: 'present', explanation: 'mogen (niet) = not to be allowed to (prohibition).', explanation_es: 'mogen (niet) = no estar permitido (prohibición).', level: 'A2' },
  { id: 'modal-ijs-willen', dutch: 'De kinderen ___ een ijsje.', english: 'The children want an ice cream.', translation_es: 'Los niños quieren un helado.', answer: 'willen', options: ['willen', 'mogen', 'moeten', 'kunnen'], tense: 'present', explanation: 'willen = to want (plural: willen).', explanation_es: 'willen = querer (plural: willen).', level: 'A2' },
  { id: 'modal-nederlands-kunnen', dutch: 'Wij ___ al een beetje Nederlands spreken.', english: 'We can already speak a little Dutch.', translation_es: 'Ya sabemos hablar un poco de neerlandés.', answer: 'kunnen', options: ['kunnen', 'moeten', 'mogen', 'willen'], tense: 'present', explanation: 'kunnen = to be able to (plural: kunnen).', explanation_es: 'kunnen = poder / saber (plural: kunnen).', level: 'A2' },
  { id: 'modal-later-zullen', dutch: 'We weten het nog niet. We ___ het later zien.', english: "We don't know yet. We'll see later.", translation_es: 'Aún no lo sabemos. Ya lo veremos.', answer: 'zullen', options: ['zullen', 'willen', 'moeten', 'kunnen'], tense: 'present', explanation: 'zullen = shall / will (plural: zullen).', explanation_es: 'zullen = futuro (plural: zullen).', level: 'B1' },
  { id: 'modal-paraplu-moeten', dutch: 'Het regent hard. We ___ een paraplu meenemen.', english: "It's raining hard. We have to take an umbrella.", translation_es: 'Llueve mucho. Tenemos que llevar un paraguas.', answer: 'moeten', options: ['moeten', 'mogen', 'kunnen', 'willen'], tense: 'present', explanation: 'moeten = to have to (plural: moeten).', explanation_es: 'moeten = tener que (plural: moeten).', level: 'A2' },
  { id: 'modal-parkeren-mag', dutch: 'Ik ___ hier parkeren, toch?', english: 'I may park here, right?', translation_es: 'Puedo aparcar aquí, ¿verdad?', answer: 'mag', options: ['mag', 'moet', 'kan', 'wil'], tense: 'present', explanation: 'mogen = to be allowed to (permission).', explanation_es: 'mogen = tener permiso / poder (permiso).', level: 'A2' },
  { id: 'modal-komen-hoeven', dutch: 'Jullie ___ niet te komen als jullie moe zijn.', english: "You don't have to come if you're tired.", translation_es: 'No tenéis que venir si estáis cansados.', answer: 'hoeven', options: ['hoeven', 'moeten', 'mogen', 'kunnen'], tense: 'present', explanation: 'hoeven (niet) = not to have to (plural: hoeven).', explanation_es: 'hoeven (niet) = no tener que (plural: hoeven).', level: 'B1' },

  // ── simple past ───────────────────────────────────────────────────────────
  { id: 'modal-past-dokter-moest', dutch: 'Gisteren was ik ziek. Ik ___ naar de dokter.', english: 'Yesterday I was ill. I had to go to the doctor.', translation_es: 'Ayer estaba enfermo. Tuve que ir al médico.', answer: 'moest', options: ['moest', 'mocht', 'wilde', 'kon'], tense: 'past', explanation: 'moeten → moest (past of obligation).', explanation_es: 'moeten → moest (pasado de obligación).', level: 'B1' },
  { id: 'modal-past-zwemmen-kon', dutch: 'Vroeger ___ hij niet zwemmen.', english: "He couldn't swim in the past.", translation_es: 'Antes no sabía nadar.', answer: 'kon', options: ['kon', 'mocht', 'moest', 'wilde'], tense: 'past', explanation: 'kunnen → kon (past of ability).', explanation_es: 'kunnen → kon (pasado de capacidad).', level: 'B1' },
  { id: 'modal-past-opblijven-mocht', dutch: 'Als kind ___ ik niet laat opblijven.', english: "As a child I wasn't allowed to stay up late.", translation_es: 'De niño no me dejaban quedarme despierto hasta tarde.', answer: 'mocht', options: ['mocht', 'moest', 'kon', 'wilde'], tense: 'past', explanation: 'mogen → mocht (past of permission).', explanation_es: 'mogen → mocht (pasado de permiso).', level: 'B1' },
  { id: 'modal-past-komen-wilde', dutch: 'Ik ___ gisteren komen, maar ik was ziek.', english: 'I wanted to come yesterday, but I was ill.', translation_es: 'Quería venir ayer, pero estaba enfermo.', answer: 'wilde', options: ['wilde', 'moest', 'mocht', 'kon'], tense: 'past', explanation: 'willen → wilde (past of wish).', explanation_es: 'willen → wilde (pasado de deseo).', level: 'B1' },
  { id: 'modal-past-later-zou', dutch: 'Hij zei dat hij later ___ komen.', english: 'He said he would come later.', translation_es: 'Dijo que vendría más tarde.', answer: 'zou', options: ['zou', 'wilde', 'moest', 'kon'], tense: 'past', explanation: 'zullen → zou (conditional / future-in-the-past).', explanation_es: 'zullen → zou (condicional / futuro del pasado).', level: 'B1' },
  { id: 'modal-past-betalen-hoefde', dutch: 'Het was gratis; ik ___ niet te betalen.', english: "It was free; I didn't have to pay.", translation_es: 'Era gratis; no tuve que pagar.', answer: 'hoefde', options: ['hoefde', 'moest', 'mocht', 'kon'], tense: 'past', explanation: 'hoeven → hoefde (past, with niet + te).', explanation_es: 'hoeven → hoefde (pasado, con niet + te).', level: 'B1' },
  { id: 'modal-past-werken-moesten', dutch: 'We ___ vorig jaar heel hard werken.', english: 'We had to work very hard last year.', translation_es: 'El año pasado tuvimos que trabajar muy duro.', answer: 'moesten', options: ['moesten', 'konden', 'mochten', 'wilden'], tense: 'past', explanation: 'moeten → moesten (past plural).', explanation_es: 'moeten → moesten (pasado plural).', level: 'B1' },
  { id: 'modal-past-storm-konden', dutch: 'Ze ___ niet komen door de storm.', english: "They couldn't come because of the storm.", translation_es: 'No pudieron venir por la tormenta.', answer: 'konden', options: ['konden', 'moesten', 'mochten', 'wilden'], tense: 'past', explanation: 'kunnen → konden (past plural of ability).', explanation_es: 'kunnen → konden (pasado plural de capacidad).', level: 'B1' },
  { id: 'modal-past-helpen-zouden', dutch: 'Ze beloofden dat ze ___ helpen.', english: 'They promised they would help.', translation_es: 'Prometieron que ayudarían.', answer: 'zouden', options: ['zouden', 'wilden', 'moesten', 'konden'], tense: 'past', explanation: 'zullen → zouden (conditional plural).', explanation_es: 'zullen → zouden (condicional plural).', level: 'B1' },
];

async function main() {
  console.log(`Inserting ${rows.length} modal verb exercises…`);
  const { error } = await supabase.from('modal_exercises').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
