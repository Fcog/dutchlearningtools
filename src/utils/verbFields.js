// Generated field mappings for compressed verb data
export const VERB_FIELDS = {
  "dutch_verbs": "v",
  "infinitive": "i",
  "english": "e",
  "stem": "s",
  "level": "l",
  "is_separable": "sp",
  "is_irregular": "ir",
  "tenses": "t",
  "present": "pr",
  "past": "pa",
  "perfect": "pe",
  "future": "fu",
  "conjugations": "c",
  "ik": "ik",
  "jij": "jij",
  "hij/zij": "hij/zij",
  "wij": "wij",
  "jullie": "jullie",
  "zij": "zij"
};

export const VERB_FIELDS_REVERSE = {
  "v": "dutch_verbs",
  "i": "infinitive",
  "e": "english",
  "s": "stem",
  "l": "level",
  "sp": "is_separable",
  "ir": "is_irregular",
  "t": "tenses",
  "pr": "present",
  "pa": "past",
  "pe": "perfect",
  "fu": "future",
  "c": "conjugations",
  "ik": "ik",
  "jij": "jij",
  "hij/zij": "hij/zij",
  "wij": "wij",
  "jullie": "jullie",
  "zij": "zij"
};

// Utility functions to work with compressed data
export function getVerbField(verb, field) {
  const compressedField = VERB_FIELDS[field] || field;
  return verb[compressedField];
}

export function getVerbTense(verb, tense) {
  const compressedTense = VERB_FIELDS[tense] || tense;
  return verb[VERB_FIELDS.tenses]?.[compressedTense];
}

export function getVerbConjugation(verb, tense, pronoun) {
  const tenseData = getVerbTense(verb, tense);
  return tenseData?.[VERB_FIELDS.conjugations]?.[pronoun];
}
