import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, Copy, Star, ChevronDown, ChevronUp, Sparkles, X, Check, Download, Wand2, RefreshCw, Zap, Globe, Music, Skull, Crown, Flame, TreePine, Cpu, Rocket, Scroll, Heart, Volume2 } from 'lucide-react';

// ============================================================================
// LINGUISTICALLY AUTHENTIC PHONOTACTIC DATA
// Each language family follows real-world constraints
// ============================================================================

const linguisticData = {
  western: {
    onsets: {
      simple: ['b', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'],
      clusters: ['br', 'bl', 'cr', 'cl', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sl', 'sp', 'st', 'sw', 'tr', 'th', 'sh']
    },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['ae', 'ai', 'ea', 'ei', 'ie', 'oa', 'ou'] },
    codas: {
      simple: ['d', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'th'],
      clusters: ['ld', 'lf', 'lm', 'lt', 'nd', 'ng', 'nk', 'nt', 'rd', 'rk', 'rm', 'rn', 'rt', 'sk', 'st']
    },
    patterns: [{ type: 'CV', weight: 40 }, { type: 'CVC', weight: 35 }, { type: 'V', weight: 10 }, { type: 'VC', weight: 10 }, { type: 'CCV', weight: 5 }],
    elements: { starts: ['Ald', 'Ber', 'Ed', 'Fre', 'Gar', 'Har', 'Nor', 'Os', 'Ral', 'Sig', 'Wal', 'Wil'], ends: ['ald', 'ard', 'bert', 'fred', 'gard', 'helm', 'mund', 'ric', 'ward', 'win', 'wyn'] },
    endings: ['a', 'an', 'ar', 'en', 'er', 'ia', 'in', 'on', 'or', 'us']
  },

  latin: {
    onsets: {
      simple: ['b', 'c', 'd', 'f', 'g', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v'],
      clusters: ['br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sc', 'sp', 'st', 'tr']
    },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['ae', 'au'] },
    codas: { simple: ['m', 'n', 'r', 's', 't', 'x'], clusters: ['ns', 'nt', 'rs', 'rt'] },
    patterns: [{ type: 'CV', weight: 55 }, { type: 'CVC', weight: 25 }, { type: 'V', weight: 10 }, { type: 'CCV', weight: 10 }],
    elements: { starts: ['Aur', 'Cae', 'Cor', 'Fla', 'Jul', 'Luc', 'Mar', 'Max', 'Oct', 'Pub', 'Ser', 'Val'], ends: ['ius', 'ia', 'us', 'a', 'um', 'is', 'or', 'ix', 'ax', 'ex'] },
    endings: ['us', 'a', 'um', 'is', 'ius', 'ia', 'or', 'ax', 'ix', 'ex']
  },

  celtic: {
    onsets: {
      simple: ['b', 'c', 'd', 'f', 'g', 'l', 'm', 'n', 'p', 'r', 's', 't', 'ch', 'th', 'sh'],
      clusters: ['br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'bl', 'cl', 'fl', 'gl', 'gw', 'rh']
    },
    vowels: { short: ['a', 'e', 'i', 'o', 'u', 'y'], long: ['ae', 'ai', 'ao', 'ea', 'ei', 'ia', 'io', 'oi', 'ua', 'wy'] },
    codas: { simple: ['ch', 'd', 'g', 'l', 'll', 'm', 'n', 'nn', 'r', 's', 'th'], clusters: ['ld', 'nd', 'ng', 'rn', 'rd', 'nt'] },
    patterns: [{ type: 'CV', weight: 40 }, { type: 'CVC', weight: 35 }, { type: 'V', weight: 15 }, { type: 'VC', weight: 10 }],
    elements: { starts: ['Aed', 'Bran', 'Cael', 'Conn', 'Der', 'Fionn', 'Gwen', 'Lugh', 'Mael', 'Niamh', 'Rhi', 'Tal'], ends: ['an', 'wen', 'wyn', 'ach', 'een', 'in', 'aid', 'aith', 'on'] },
    endings: ['an', 'en', 'in', 'on', 'wen', 'wyn', 'ach', 'aith', 'id', 'a']
  },

  norse: {
    onsets: {
      simple: ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'r', 's', 't', 'v', 'y'],
      clusters: ['br', 'dr', 'fr', 'gr', 'kr', 'pr', 'tr', 'bl', 'fl', 'gl', 'kl', 'sk', 'sn', 'sp', 'st', 'sv', 'hj', 'kn']
    },
    vowels: { short: ['a', 'e', 'i', 'o', 'u', 'y'], long: ['ei', 'au'] },
    codas: { simple: ['d', 'f', 'g', 'k', 'l', 'm', 'n', 'r', 's', 't'], clusters: ['ld', 'lf', 'lk', 'lm', 'nd', 'ng', 'nk', 'nn', 'rd', 'rg', 'rk', 'rm', 'rn', 'rt', 'sk', 'st'] },
    patterns: [{ type: 'CVC', weight: 40 }, { type: 'CV', weight: 35 }, { type: 'CVCC', weight: 15 }, { type: 'CCV', weight: 10 }],
    elements: { starts: ['Arn', 'Bjorn', 'Dag', 'Ei', 'Frey', 'Gunn', 'Har', 'Ing', 'Odd', 'Rag', 'Sig', 'Thor', 'Ulf', 'Val'], ends: ['ar', 'ir', 'or', 'ald', 'ulf', 'ard', 'mund', 'leif', 'geir', 'dis', 'hild', 'run', 'stein'] },
    endings: ['ar', 'ir', 'ur', 'or', 'ald', 'ulf', 'ard', 'mund', 'leif', 'geir', 'a', 'i']
  },

  slavic: {
    onsets: {
      simple: ['b', 'd', 'g', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z', 'ch', 'sh', 'zh'],
      clusters: ['br', 'dr', 'gr', 'kr', 'pr', 'tr', 'bl', 'gl', 'kl', 'pl', 'sl', 'sm', 'sn', 'sp', 'st', 'str', 'sv', 'vl', 'vr', 'zd', 'zl', 'zn']
    },
    vowels: { short: ['a', 'e', 'i', 'o', 'u', 'y'], long: ['ia', 'ie', 'io', 'iu'] },
    codas: { simple: ['b', 'd', 'g', 'k', 'l', 'm', 'n', 'r', 's', 't', 'v', 'z', 'ch', 'sh'], clusters: ['sk', 'st', 'nd', 'nk', 'rk', 'rd', 'rn', 'rt'] },
    patterns: [{ type: 'CV', weight: 35 }, { type: 'CVC', weight: 35 }, { type: 'CCV', weight: 20 }, { type: 'CCVC', weight: 10 }],
    elements: { starts: ['Bog', 'Bor', 'Dob', 'Drag', 'Jar', 'Mir', 'Rad', 'Ros', 'Slav', 'Stan', 'Vlad', 'Vol', 'Yar', 'Zor'], ends: ['mir', 'slav', 'mil', 'rad', 'vid', 'bor', 'gor', 'dan', 'ko', 'ka', 'ov', 'ev'] },
    endings: ['a', 'ya', 'mir', 'slav', 'rad', 'ov', 'ev', 'ko', 'ka', 'an', 'in', 'il']
  },

  arabic: {
    onsets: { simple: ['b', 'd', 'f', 'h', 'j', 'k', 'l', 'm', 'n', 'q', 'r', 's', 'sh', 't', 'th', 'w', 'y', 'z', 'kh', 'gh'], clusters: [] },
    vowels: { short: ['a', 'i', 'u'], long: ['aa', 'ii', 'uu', 'ai', 'au'] },
    codas: { simple: ['b', 'd', 'f', 'h', 'k', 'l', 'm', 'n', 'r', 's', 't', 'z'], clusters: [] },
    patterns: [{ type: 'CV', weight: 50 }, { type: 'CVC', weight: 45 }, { type: 'V', weight: 5 }],
    elements: { starts: ['Abd', 'Ah', 'Al', 'Am', 'As', 'Fah', 'Far', 'Has', 'Jab', 'Jam', 'Kar', 'Khal', 'Mah', 'Nas', 'Nur', 'Sal', 'Sul', 'Tar', 'Zah'], ends: ['a', 'ah', 'an', 'ar', 'i', 'id', 'il', 'im', 'in', 'ir', 'ud', 'ul', 'um', 'un', 'ur'] },
    endings: ['a', 'ah', 'an', 'ar', 'i', 'id', 'im', 'in', 'ir', 'ud', 'ul', 'um', 'un']
  },

  eastasian: {
    onsets: { simple: ['b', 'ch', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 'sh', 't', 'w', 'y', 'z'], clusters: [] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['ai', 'ao', 'ei', 'ia', 'ie', 'iu', 'ou', 'ua', 'ue', 'ui', 'uo'] },
    codas: { simple: ['n', 'ng'], clusters: [] },
    patterns: [{ type: 'CV', weight: 65 }, { type: 'V', weight: 20 }, { type: 'CVN', weight: 15 }],
    elements: { starts: ['Chi', 'Fei', 'Hai', 'Hiro', 'Jin', 'Kai', 'Ken', 'Lei', 'Lin', 'Mei', 'Min', 'Rei', 'Ren', 'Ryu', 'Shen', 'Shin', 'Tai', 'Wei', 'Yan', 'Yu'], ends: ['ko', 'ki', 'mi', 'ri', 'chi', 'ka', 'na', 'no', 'shi', 'ta', 'to', 'ya', 'ro', 'ru'] },
    endings: ['a', 'e', 'i', 'o', 'u', 'n', 'ng', 'ko', 'ki', 'mi', 'ri', 'ya', 'no', 'ta']
  },

  southasian: {
    onsets: { simple: ['b', 'bh', 'ch', 'd', 'dh', 'g', 'gh', 'h', 'j', 'k', 'kh', 'l', 'm', 'n', 'p', 'ph', 'r', 's', 'sh', 't', 'th', 'v', 'y'], clusters: ['br', 'dr', 'gr', 'kr', 'pr', 'tr', 'shr'] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['aa', 'ee', 'ii', 'oo', 'uu', 'ai', 'au'] },
    codas: { simple: ['h', 'k', 'l', 'm', 'n', 'r', 's', 't'], clusters: ['nd', 'nt', 'rm', 'rn', 'rt'] },
    patterns: [{ type: 'CV', weight: 50 }, { type: 'CVC', weight: 35 }, { type: 'V', weight: 10 }, { type: 'CCV', weight: 5 }],
    elements: { starts: ['Adi', 'Anu', 'Aru', 'Bha', 'Dev', 'Dha', 'Gan', 'Hari', 'Ind', 'Jay', 'Kam', 'Kar', 'Mah', 'Nar', 'Pad', 'Pra', 'Raj', 'Ram', 'San', 'Shan', 'Sur', 'Vik', 'Vish'], ends: ['a', 'an', 'ana', 'endra', 'esh', 'i', 'ika', 'in', 'ini', 'ish', 'ita', 'na', 'raj', 'ya'] },
    endings: ['a', 'i', 'u', 'an', 'in', 'am', 'ya', 'na', 'ta', 'endra', 'esh', 'ika', 'ini']
  },

  african: {
    onsets: { simple: ['b', 'ch', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'ny', 'p', 'r', 's', 'sh', 't', 'w', 'y', 'z'], clusters: ['mb', 'nd', 'ng', 'nj', 'nk', 'mp', 'nt', 'nz', 'kw', 'gw', 'bw', 'tw', 'sw'] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['aa', 'ee', 'ii', 'oo', 'uu'] },
    codas: { simple: ['m', 'n', 'ng'], clusters: [] },
    patterns: [{ type: 'CV', weight: 70 }, { type: 'V', weight: 15 }, { type: 'NCV', weight: 15 }],
    elements: { starts: ['Aba', 'Ade', 'Ama', 'Ami', 'Ayo', 'Chi', 'Ife', 'Kem', 'Kwa', 'Lun', 'Mba', 'Ndi', 'Ngu', 'Oba', 'Obi', 'Olu', 'San', 'Tem', 'Uku', 'Zol', 'Zul'], ends: ['a', 'i', 'u', 'e', 'o', 'wa', 'we', 'wi', 'ya', 'yo', 'ka', 'ki', 'la', 'li', 'na', 'ni', 'ra', 'ri', 'ta', 'ti'] },
    endings: ['a', 'i', 'u', 'e', 'o', 'wa', 'we', 'ya', 'ka', 'la', 'na', 'ra', 'ta']
  },

  mesoamerican: {
    onsets: { simple: ['ch', 'h', 'k', 'l', 'm', 'n', 'p', 's', 't', 'tl', 'ts', 'w', 'x', 'y'], clusters: [] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['aa', 'ee', 'ii', 'oo'] },
    codas: { simple: ['h', 'l', 'n', 's', 'tl', 'ts', 'k', 'x'], clusters: [] },
    patterns: [{ type: 'CV', weight: 55 }, { type: 'CVC', weight: 35 }, { type: 'V', weight: 10 }],
    elements: { starts: ['Ah', 'Chak', 'Chi', 'Cit', 'Cuauh', 'Etz', 'Itz', 'Ix', 'Kin', 'Kuk', 'Metz', 'Quet', 'Tek', 'Tep', 'Tla', 'Ton', 'Xal', 'Xip', 'Xoch', 'Yax', 'Yol'], ends: ['al', 'an', 'atl', 'il', 'in', 'itl', 'ol', 'otl', 'tli', 'tl', 'tzin'] },
    endings: ['a', 'i', 'e', 'o', 'tl', 'tli', 'atl', 'in', 'an', 'il', 'al', 'tzin']
  },

  // NEW REGION: Greek
  greek: {
    onsets: {
      simple: ['b', 'd', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'th', 'ph', 'ch', 'z', 'x'],
      clusters: ['br', 'dr', 'gr', 'kr', 'pr', 'tr', 'bl', 'gl', 'kl', 'pl', 'pn', 'ps', 'pt', 'st', 'sp', 'sk', 'sm', 'sph']
    },
    vowels: { short: ['a', 'e', 'i', 'o', 'u', 'y'], long: ['ai', 'ei', 'oi', 'au', 'eu', 'ou', 'ae', 'oe'] },
    codas: { simple: ['n', 's', 'r', 'x', 'ps'], clusters: ['ns', 'rs', 'ks'] },
    patterns: [{ type: 'CV', weight: 45 }, { type: 'CVC', weight: 30 }, { type: 'CCV', weight: 15 }, { type: 'V', weight: 10 }],
    elements: { starts: ['Alex', 'Andr', 'Apo', 'Ari', 'Dem', 'Dio', 'Hel', 'Her', 'Hip', 'Leo', 'Nik', 'Phil', 'Soph', 'The', 'Xen', 'Zen'], ends: ['os', 'es', 'is', 'as', 'on', 'eus', 'ios', 'ias', 'ides', 'anes', 'enes'] },
    endings: ['os', 'es', 'is', 'as', 'on', 'eus', 'ios', 'ia', 'a', 'ides']
  },

  // NEW REGION: Egyptian
  egyptian: {
    onsets: { simple: ['b', 'd', 'f', 'g', 'h', 'k', 'kh', 'm', 'n', 'p', 'r', 's', 'sh', 't', 'th', 'w', 'y'], clusters: [] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['aa', 'ee', 'ii'] },
    codas: { simple: ['b', 'f', 'k', 'm', 'n', 'p', 'r', 's', 't'], clusters: [] },
    patterns: [{ type: 'CV', weight: 50 }, { type: 'CVC', weight: 40 }, { type: 'V', weight: 10 }],
    elements: { starts: ['Akh', 'Am', 'An', 'Aten', 'Hor', 'Isis', 'Khe', 'Men', 'Mer', 'Nef', 'Nub', 'Ptah', 'Ra', 'Sat', 'Sek', 'Set', 'Tut', 'User'], ends: ['is', 'it', 'et', 'en', 'un', 'at', 'hotep', 'mose', 'ankh', 'amun', 'aten'] },
    endings: ['is', 'it', 'et', 'en', 'un', 'at', 'hotep', 'mose', 'ankh', 'amun']
  },

  // NEW REGION: Persian
  persian: {
    onsets: {
      simple: ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'kh', 'l', 'm', 'n', 'p', 'r', 's', 'sh', 't', 'v', 'y', 'z', 'zh'],
      clusters: ['br', 'dr', 'fr', 'gr', 'kr', 'pr', 'tr']
    },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['aa', 'ee', 'oo', 'ai', 'ei', 'ou'] },
    codas: { simple: ['b', 'd', 'f', 'g', 'k', 'kh', 'l', 'm', 'n', 'r', 's', 'sh', 't', 'z'], clusters: ['rd', 'rz', 'st', 'nd', 'ng'] },
    patterns: [{ type: 'CV', weight: 40 }, { type: 'CVC', weight: 40 }, { type: 'CVCC', weight: 15 }, { type: 'V', weight: 5 }],
    elements: { starts: ['Ar', 'Az', 'Bah', 'Cy', 'Dar', 'Far', 'Jas', 'Kav', 'Khor', 'Mah', 'Meh', 'Mir', 'Nav', 'Par', 'Ros', 'Shah', 'Sor', 'Zar'], ends: ['an', 'ar', 'ash', 'esh', 'in', 'ir', 'ush', 'yar', 'zad', 'var', 'ban', 'dan'] },
    endings: ['an', 'ar', 'ash', 'esh', 'in', 'ir', 'ush', 'yar', 'zad', 'var']
  },

  // NEW REGION: Polynesian
  polynesian: {
    onsets: { simple: ['h', 'k', 'l', 'm', 'n', 'p', 'r', 't', 'w', 'f', 'v', 'ng'], clusters: [] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['aa', 'ee', 'ii', 'oo', 'uu', 'ae', 'ai', 'ao', 'au', 'ei', 'ou'] },
    codas: { simple: [], clusters: [] },
    patterns: [{ type: 'CV', weight: 60 }, { type: 'V', weight: 30 }, { type: 'CVV', weight: 10 }],
    elements: { starts: ['Ka', 'Ke', 'Ki', 'Ko', 'Ku', 'La', 'Ma', 'Mo', 'Na', 'Pa', 'Ta', 'Te', 'Ti', 'To', 'Wa', 'Ha', 'Ho'], ends: ['na', 'ni', 'no', 'ka', 'ki', 'ko', 'la', 'li', 'lo', 'ma', 'mi', 'mo', 'ra', 'ri', 'ro', 'ta', 'ti', 'to', 'a', 'i', 'o'] },
    endings: ['a', 'i', 'o', 'u', 'e', 'na', 'ni', 'ka', 'ki', 'la', 'li', 'ma', 'ta']
  },

  spaceopera: {
    onsets: { simple: ['b', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x', 'z', 'th'], clusters: ['kr', 'tr', 'dr', 'gr', 'pr', 'br', 'str', 'thr', 'vr', 'zr'] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['ae', 'ai', 'au', 'ei', 'ia', 'io', 'oa', 'oi', 'ua'] },
    codas: { simple: ['k', 'n', 'r', 's', 't', 'x', 'z', 'th'], clusters: ['ks', 'nk', 'ns', 'nt', 'rk', 'rs', 'rt', 'rx', 'st', 'xt'] },
    patterns: [{ type: 'CV', weight: 30 }, { type: 'CVC', weight: 40 }, { type: 'CCVC', weight: 20 }, { type: 'CVCC', weight: 10 }],
    elements: { starts: ['Ax', 'Bel', 'Cor', 'Dax', 'Ex', 'Gal', 'Hex', 'Ion', 'Jax', 'Kir', 'Lex', 'Mor', 'Nex', 'Ori', 'Pax', 'Rex', 'Sol', 'Tor', 'Vex', 'Xan', 'Zed', 'Zor'], ends: ['ax', 'ex', 'ix', 'ox', 'ux', 'ar', 'er', 'ir', 'or', 'ur', 'an', 'en', 'in', 'on', 'ion', 'ius', 'rix', 'xis', 'zar'] },
    endings: ['ax', 'ex', 'ix', 'ox', 'ar', 'or', 'on', 'ion', 'ius', 'rix', 'xis', 'zar', 'an', 'os']
  },

  cyberpunk: {
    onsets: { simple: ['b', 'ch', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 'sh', 't', 'v', 'w', 'y', 'z'], clusters: ['bl', 'br', 'chr', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'kr', 'pl', 'pr', 'sc', 'sk', 'sl', 'sp', 'st', 'str', 'tr', 'vr'] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u', 'y'], long: ['ai', 'ei', 'ou', 'io'] },
    codas: { simple: ['b', 'd', 'f', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'x', 'z'], clusters: ['ck', 'ft', 'ks', 'kt', 'nk', 'nt', 'pt', 'rk', 'rt', 'sk', 'st', 'xt'] },
    patterns: [{ type: 'CV', weight: 35 }, { type: 'CVC', weight: 45 }, { type: 'CVCC', weight: 15 }, { type: 'CCV', weight: 5 }],
    elements: { starts: ['Ace', 'Ax', 'Blade', 'Byte', 'Cid', 'Cyber', 'Dex', 'Echo', 'Flux', 'Hex', 'Jin', 'Jolt', 'Kai', 'Kat', 'Kira', 'Max', 'Neo', 'Nix', 'Razor', 'Rex', 'Riko', 'Syn', 'Vec', 'Volt', 'Zero', 'Zik'], ends: ['a', 'ax', 'ex', 'i', 'ik', 'ix', 'o', 'ok', 'ox', 'on', 'or', 'tek', 'syn', 'net'] },
    endings: ['a', 'ax', 'ex', 'i', 'ik', 'ix', 'o', 'ok', 'on', 'or', 'tek', 'syn', 'net']
  },

  neutral: {
    onsets: { simple: ['b', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z'], clusters: ['bl', 'br', 'dr', 'fl', 'fr', 'gl', 'gr', 'kl', 'kr', 'pl', 'pr', 'sl', 'sp', 'st', 'tr'] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['ae', 'ai', 'ea', 'ei', 'ia', 'ie', 'oa', 'ou', 'ua', 'ue'] },
    codas: { simple: ['d', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't'], clusters: ['ld', 'lm', 'lt', 'nd', 'nk', 'nt', 'rd', 'rk', 'rm', 'rn', 'rt', 'sk', 'st'] },
    patterns: [{ type: 'CV', weight: 45 }, { type: 'CVC', weight: 35 }, { type: 'V', weight: 10 }, { type: 'VC', weight: 5 }, { type: 'CCV', weight: 5 }],
    elements: { starts: ['Al', 'Ar', 'Bel', 'Cal', 'Dar', 'El', 'Fal', 'Gar', 'Hal', 'Kal', 'Lan', 'Mar', 'Nor', 'Or', 'Pal', 'Ral', 'Sal', 'Tal', 'Val', 'Zan'], ends: ['a', 'an', 'ar', 'el', 'en', 'er', 'ia', 'iel', 'in', 'ion', 'ir', 'is', 'on', 'or', 'us'] },
    endings: ['a', 'an', 'ar', 'el', 'en', 'er', 'ia', 'in', 'on', 'or', 'us', 'is']
  }
};

// ============================================================================
// TONE MODIFIERS
// ============================================================================

const toneModifiers = {
  heroic: { preferSounds: ['r', 'l', 'n', 'm', 'v', 'd', 'g'], avoidSounds: ['x', 'z', 'k'], preferLong: true, prefixes: ['Val', 'Gal', 'Lor', 'Her', 'Trium', 'Vic', 'Sol', 'Brav'], suffixes: ['or', 'orn', 'ard', 'ald', 'and', 'ius', 'ion', 'eon'] },
  dark: { preferSounds: ['k', 'g', 'th', 'sh', 'z', 'v', 'r', 'x'], avoidSounds: ['l', 'w', 'y'], preferLong: false, prefixes: ['Mor', 'Noc', 'Shad', 'Dread', 'Grim', 'Mal', 'Vor', 'Kra'], suffixes: ['oth', 'ath', 'uk', 'ak', 'ex', 'ax', 'us', 'or'] },
  ancient: { preferSounds: ['th', 'r', 'l', 'n', 'm', 's'], avoidSounds: ['j', 'ch', 'sh'], preferLong: true, prefixes: ['Eld', 'Prim', 'Arch', 'Aeon', 'Ur', 'Anc', 'Eter'], suffixes: ['orn', 'oth', 'ion', 'ius', 'ael', 'iel', 'os'] },
  arcane: { preferSounds: ['th', 'r', 'n', 'l', 's', 'z', 'v'], avoidSounds: ['p', 'b', 'g', 'k'], preferLong: true, prefixes: ['Myst', 'Aeth', 'Sor', 'Run', 'Mag', 'Veil', 'Eso'], suffixes: ['ith', 'ael', 'iel', 'ion', 'ius', 'or', 'yn'] },
  noble: { preferSounds: ['l', 'r', 'n', 'm', 's', 'v', 'th'], avoidSounds: ['k', 'g', 'z', 'x'], preferLong: true, prefixes: ['Aur', 'Cel', 'Lum', 'Sil', 'Clar', 'Nob', 'Reg', 'Lux'], suffixes: ['iel', 'ius', 'ian', 'ine', 'elle', 'is', 'or', 'a'] },
  brutal: { preferSounds: ['k', 'g', 'r', 'd', 'b', 'z', 'x'], avoidSounds: ['l', 'w', 'y', 'th'], preferLong: false, prefixes: ['Krag', 'Grok', 'Brak', 'Drog', 'Zug', 'Gor', 'Kur', 'Grath'], suffixes: ['ak', 'uk', 'og', 'ug', 'rak', 'gor', 'dak', 'grom'] },
  whimsical: { preferSounds: ['l', 'p', 'b', 'n', 'm', 'w', 'y'], avoidSounds: ['k', 'g', 'z', 'x', 'th'], preferLong: false, prefixes: ['Pip', 'Lil', 'Twi', 'Fli', 'Bub', 'Tin', 'Whi', 'Fae'], suffixes: ['in', 'le', 'kin', 'bell', 'ette', 'ling', 'by'] },
  alien: { preferSounds: ['x', 'z', 'v', 'th', 'k'], avoidSounds: ['w', 'y'], preferLong: true, prefixes: ['Xor', 'Zyx', 'Qua', 'Vex', 'Neth', 'Kir', 'Zal', 'Vor'], suffixes: ['ix', 'ax', 'ox', 'yx', 'eth', 'oth', 'zar', 'xis'] },
  tech: { preferSounds: ['k', 't', 's', 'n', 'r', 'x', 'z'], avoidSounds: ['th', 'w'], preferLong: false, prefixes: ['Cy', 'Tek', 'Syn', 'Neo', 'Hex', 'Bit', 'Net', 'Vox'], suffixes: ['ek', 'ex', 'ix', 'on', 'os', 'is', 'net', 'tek'] },
  rustic: { preferSounds: ['r', 'n', 'm', 'l', 'd', 'b', 'w'], avoidSounds: ['x', 'z', 'th'], preferLong: false, prefixes: ['Oak', 'Elm', 'Ash', 'Bram', 'Thorn', 'Moss', 'Haw', 'Ald'], suffixes: ['wood', 'dell', 'ford', 'wick', 'ham', 'ton', 'by', 'ley'] }
};

// ============================================================================
// TIME PERIOD MODIFIERS - NEW FEATURE
// ============================================================================

const timePeriodModifiers = {
  ancient: { prefixes: ['Ur', 'Prim', 'Arch', 'Proto', 'Eld'], suffixes: ['oth', 'orn', 'iel', 'ael', 'um'] },
  medieval: { prefixes: ['Ser', 'Lord', 'Saint', 'Fitz', 'Von'], suffixes: ['ric', 'helm', 'mund', 'ward', 'gard', 'wyn'] },
  renaissance: { prefixes: ['Don', 'Donna', 'Signor', 'Conte', 'Duc'], suffixes: ['ello', 'ini', 'etti', 'iano', 'esca'] },
  industrial: { prefixes: ['Steel', 'Iron', 'Coal', 'Brass', 'Copper'], suffixes: ['ton', 'worth', 'ford', 'wick', 'ham'] },
  modern: { prefixes: ['Max', 'Alex', 'Kai', 'Zoe', 'Nova'], suffixes: ['son', 'ton', 'ley', 'er', 'en'] },
  futuristic: { prefixes: ['Neo', 'Cyber', 'Quantum', 'Stellar', 'Nexus'], suffixes: ['ix', 'ax', 'on', 'ex', 'ius', 'tek'] }
};

// ============================================================================
// NAME TYPE ELEMENTS
// ============================================================================

const nameTypeElements = {
  character: { prefixes: [], suffixes: [] },
  location: {
    prefixes: ['Fort', 'Port', 'Mount', 'Lake', 'River', 'Shadow', 'Storm', 'Crystal', 'Iron', 'Golden', 'Silver', 'Black', 'White', 'Red', 'Dawn', 'Dusk', 'Moon', 'Sun', 'Star', 'Mist'],
    suffixes: ['haven', 'hold', 'fell', 'vale', 'dale', 'mere', 'moor', 'peak', 'reach', 'watch', 'guard', 'gate', 'keep', 'spire', 'hollow', 'grove', 'wood', 'ford', 'port', 'heim', 'grad', 'burg', 'ton', 'ville']
  },
  faction: {
    prefixes: ['Order', 'House', 'Clan', 'Guild', 'Legion', 'Circle', 'Court', 'Crown', 'Iron', 'Shadow', 'Storm', 'Blood', 'Silver', 'Golden', 'Crimson', 'Azure', 'Onyx', 'Ivory'],
    suffixes: ['guard', 'sworn', 'blade', 'hand', 'born', 'blood', 'heart', 'soul', 'watch', 'ward', 'veil', 'pact', 'oath', 'crown', 'throne', 'council', 'covenant', 'syndicate']
  },
  item: {
    prefixes: ['Storm', 'Shadow', 'Doom', 'Soul', 'Spirit', 'Void', 'Star', 'Moon', 'Sun', 'Blood', 'Bone', 'Iron', 'Silver', 'Golden', 'Crystal', 'Frost', 'Flame', 'Thunder', 'Night', 'Dawn', 'Fate', 'Dread', 'Wrath', 'Hope', 'Glory'],
    suffixes: ['bane', 'bringer', 'slayer', 'reaver', 'render', 'cleaver', 'striker', 'piercer', 'breaker', 'shatter', 'edge', 'fang', 'claw', 'thorn', 'shard', 'spark', 'flame', 'frost', 'song', 'whisper', 'scream', 'fury', 'wrath', 'heart', 'soul', 'caller', 'weaver', 'forged']
  },
  starship: {
    prefixes: ['Star', 'Nova', 'Void', 'Solar', 'Lunar', 'Cosmic', 'Nebula', 'Astral', 'Quantum', 'Hyper', 'Warp', 'Ion', 'Plasma', 'Dark', 'Light', 'Silent', 'Swift', 'Iron', 'Steel', 'Titan'],
    suffixes: ['runner', 'dancer', 'seeker', 'hunter', 'hawk', 'wing', 'blade', 'storm', 'strike', 'fall', 'rise', 'dawn', 'dusk', 'fury', 'dream', 'spirit', 'phantom', 'specter', 'voyager', 'wanderer', 'herald', 'sentinel']
  },
  species: {
    prefixes: ['Xeno', 'Proto', 'Neo', 'Meta', 'Para', 'Endo', 'Exo', 'Cryo', 'Pyro', 'Hydro', 'Aero', 'Geo', 'Bio', 'Techno', 'Astro', 'Cosmo'],
    suffixes: ['morph', 'vore', 'pod', 'zoid', 'form', 'kin', 'born', 'spawn', 'oid', 'ian', 'ite', 'ax', 'ex', 'ix', 'oni', 'ari', 'eni', 'oth', 'eth']
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const weightedRandom = (items, weights) => {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const countSyllables = (str) => {
  const lower = str.toLowerCase().replace(/[^a-z]/g, '');
  const matches = lower.match(/[aeiouy]+/g);
  return matches ? matches.length : 1;
};

const generateSyllable = (lang, patternType, tone = null) => {
  let onset = '';
  let vowel = '';
  let coda = '';

  if (patternType.startsWith('CC')) {
    onset = lang.onsets.clusters.length > 0 ? random(lang.onsets.clusters) : random(lang.onsets.simple);
  } else if (patternType.startsWith('C') || patternType.startsWith('N')) {
    const useCluster = lang.onsets.clusters.length > 0 && Math.random() < 0.15;
    onset = useCluster ? random(lang.onsets.clusters) : random(lang.onsets.simple);
  }

  if (tone && tone.preferSounds && onset && Math.random() < 0.3) {
    const matches = lang.onsets.simple.filter(s => tone.preferSounds.some(p => s.includes(p)));
    if (matches.length > 0) onset = random(matches);
  }

  const useLong = tone?.preferLong ? Math.random() < 0.35 : Math.random() < 0.2;
  vowel = useLong && lang.vowels.long.length > 0 ? random(lang.vowels.long) : random(lang.vowels.short);

  if (patternType.endsWith('CC')) {
    coda = lang.codas.clusters.length > 0 ? random(lang.codas.clusters) : random(lang.codas.simple);
  } else if (['CVC', 'CCVC', 'VC', 'CVCC'].includes(patternType)) {
    const useCluster = lang.codas.clusters.length > 0 && Math.random() < 0.1;
    coda = useCluster ? random(lang.codas.clusters) : random(lang.codas.simple);
  } else if (patternType === 'CVN') {
    const nasals = lang.codas.simple.filter(c => ['n', 'ng', 'm'].includes(c));
    coda = nasals.length > 0 ? random(nasals) : 'n';
  }

  return onset + vowel + coda;
};
// ============================================================================
// NAME GENERATION
// ============================================================================

const generateName = (config) => {
  const { nameType, regions, tones, timePeriod, minSyllables, maxSyllables, mustStartWith, mustContain, mustNotContain, seedWord, allowApostrophes, allowHyphens, allowAccents } = config;

  const regionList = regions.length > 0 ? regions : ['neutral'];
  const primaryLang = linguisticData[regionList[0]] || linguisticData.neutral;
  const primaryTone = tones.length > 0 ? toneModifiers[tones[0]] : null;
  const periodMod = timePeriod && timePeriod !== 'any' ? timePeriodModifiers[timePeriod] : null;
  const typeElements = nameTypeElements[nameType] || nameTypeElements.character;

  const targetSyllables = Math.floor(Math.random() * (maxSyllables - minSyllables + 1)) + minSyllables;

  let name = '';
  let attempts = 0;

  while (attempts < 50) {
    attempts++;
    name = '';

    // For non-character types, use type-specific elements
    if (nameType !== 'character' && typeElements.prefixes.length > 0 && Math.random() < 0.7) {
      const prefix = random(typeElements.prefixes);
      const suffix = random(typeElements.suffixes);
      name = prefix + suffix;
    }
    // Use time period elements
    else if (periodMod && Math.random() < 0.3) {
      const prefix = random(periodMod.prefixes);
      for (let i = 0; i < targetSyllables; i++) {
        const lang = linguisticData[random(regionList)] || primaryLang;
        const pattern = weightedRandom(lang.patterns.map(p => p.type), lang.patterns.map(p => p.weight));
        name += generateSyllable(lang, pattern, primaryTone);
      }
      name = prefix + name;
    }
    // Use language elements
    else if (Math.random() < 0.35 && primaryLang.elements) {
      if (Math.random() < 0.5) {
        const prefix = primaryTone?.prefixes 
          ? random([...primaryLang.elements.starts, ...primaryTone.prefixes])
          : random(primaryLang.elements.starts);
        const suffix = primaryTone?.suffixes
          ? random([...primaryLang.elements.ends, ...primaryTone.suffixes])
          : random(primaryLang.elements.ends);
        name = prefix + suffix;
      } else {
        name = random(primaryLang.elements.starts);
        const remaining = Math.max(1, targetSyllables - countSyllables(name));
        for (let i = 0; i < remaining; i++) {
          const lang = linguisticData[random(regionList)] || primaryLang;
          const pattern = weightedRandom(lang.patterns.map(p => p.type), lang.patterns.map(p => p.weight));
          name += generateSyllable(lang, pattern, primaryTone);
        }
      }
    }
    // Pure syllable generation
    else {
      for (let i = 0; i < targetSyllables; i++) {
        const lang = linguisticData[random(regionList)] || primaryLang;
        const pattern = weightedRandom(lang.patterns.map(p => p.type), lang.patterns.map(p => p.weight));
        name += generateSyllable(lang, pattern, primaryTone);
      }

      if (Math.random() < 0.25 && primaryLang.endings) {
        const ending = random(primaryLang.endings);
        if (!name.endsWith(ending.charAt(0))) {
          name = name.slice(0, -1) + ending;
        }
      }
    }

    // Apply seed word
    if (seedWord && seedWord.length > 1) {
      const seed = seedWord.toLowerCase();
      if (Math.random() < 0.5) {
        name = seed.slice(0, Math.min(3, seed.length)) + name.slice(2);
      } else {
        const pos = Math.floor(name.length / 2);
        name = name.slice(0, pos) + seed.slice(0, 2) + name.slice(pos + 1);
      }
    }

    // Check syllable count - strict enforcement
    const syllables = countSyllables(name);
    if (syllables < minSyllables || syllables > maxSyllables) continue;

    // Apply filters
    if (mustStartWith && !name.toLowerCase().startsWith(mustStartWith.toLowerCase())) {
      name = mustStartWith + name.slice(mustStartWith.length);
    }
    if (mustContain && !name.toLowerCase().includes(mustContain.toLowerCase())) {
      const pos = Math.floor(name.length / 2);
      name = name.slice(0, pos) + mustContain + name.slice(pos);
    }
    if (mustNotContain && name.toLowerCase().includes(mustNotContain.toLowerCase())) continue;

    // Check for bad clusters
    if (/[bcdfghjklmnpqrstvwxz]{4,}/i.test(name)) continue;
    if (/[aeiou]{4,}/i.test(name)) continue;

    break;
  }

  // Finalize
  name = capitalize(name.toLowerCase());

  // Orthographic features - 100% when enabled
  if (allowApostrophes && name.length > 4) {
    const vowelMatches = [...name.slice(2, -1).matchAll(/[aeiou]/gi)];
    if (vowelMatches.length > 0) {
      const match = vowelMatches[Math.floor(Math.random() * vowelMatches.length)];
      const pos = match.index + 2;
      name = name.slice(0, pos) + "'" + name.slice(pos);
    }
  }

  if (allowHyphens && name.length > 5) {
    const mid = Math.floor(name.length / 2);
    let splitPos = mid;
    for (let i = mid - 1; i <= mid + 1; i++) {
      if (i > 1 && i < name.length - 2 && /[bcdfghjklmnpqrstvwxyz]/i.test(name[i])) {
        splitPos = i;
        break;
      }
    }
    name = capitalize(name.slice(0, splitPos)) + '-' + capitalize(name.slice(splitPos));
  }

  if (allowAccents) {
    const accents = { 
      a: ['á', 'à', 'â', 'ä'], 
      e: ['é', 'è', 'ê', 'ë'], 
      i: ['í', 'ì', 'î', 'ï'], 
      o: ['ó', 'ò', 'ô', 'ö'], 
      u: ['ú', 'ù', 'û', 'ü'] 
    };
    const chars = name.split('');
    const vowelIndices = [];
    for (let i = 1; i < chars.length - 1; i++) {
      if (accents[chars[i].toLowerCase()]) vowelIndices.push(i);
    }
    if (vowelIndices.length > 0) {
      const idx = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
      chars[idx] = random(accents[chars[idx].toLowerCase()]);
      name = chars.join('');
    }
  }

  return name;
};

// ============================================================================
// ANIMATED BACKGROUND
// ============================================================================

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-purple-950/30" />
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full mix-blend-screen filter blur-xl opacity-30 animate-pulse"
        style={{
          width: Math.random() * 300 + 100,
          height: Math.random() * 300 + 100,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `radial-gradient(circle, ${['#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#06b6d4'][Math.floor(Math.random() * 5)]}40 0%, transparent 70%)`,
          animationDuration: `${Math.random() * 10 + 10}s`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
  </div>
);

// ============================================================================
// UI COMPONENTS
// ============================================================================

const GlowButton = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
    secondary: 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50',
    ghost: 'bg-transparent hover:bg-slate-800/50',
    donate: 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-400 hover:via-red-400 hover:to-orange-400 shadow-lg shadow-red-500/25 hover:shadow-red-500/40'
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {(variant === 'primary' || variant === 'donate') && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
      )}
      <span className="relative flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

const Tooltip = ({ content, children }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0, strategy: 'side' });
  const triggerRef = useRef(null);

  const handleInteraction = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      
      let left = rect.right + 10;
      let top = rect.top;
      let strategy = 'side';

      if (screenWidth < 768 || left + 250 > screenWidth) {
        strategy = 'bottom';
        left = 16;
        top = rect.bottom + 10;
      }

      setCoords({ left, top, strategy });
      setShow((prev) => !prev);
    }
  };

  return (
    <>
      <div 
        ref={triggerRef}
        onClick={handleInteraction}
        onMouseEnter={handleInteraction} 
        onMouseLeave={() => setShow(false)} 
        className="relative inline-block cursor-help active:scale-95 transition-transform"
      >
        {children}
      </div>
      {show && createPortal(
        <div 
          className="fixed p-3 text-sm bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl text-slate-300 animate-in fade-in zoom-in-95 duration-200" 
          style={{ 
            zIndex: 99999,
            left: coords.left,
            top: coords.top,
            width: coords.strategy === 'bottom' ? 'calc(100vw - 32px)' : 'max-content',
            maxWidth: '20rem',
            pointerEvents: 'none' 
          }}
        >
          <div 
            className={`absolute w-3 h-3 bg-slate-900 border-l border-b border-slate-700/50 transform rotate-45 ${
              coords.strategy === 'bottom' 
                ? '-top-1.5 left-6 border-l-0 border-b-0 border-t border-l bg-slate-900'
                : '-left-1.5 top-3'
            }`} 
          />
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

const SectionHeader = ({ title, helpText, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-3">
    {Icon && <Icon className="w-4 h-4 text-indigo-400" />}
    <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">{title}</h3>
    {helpText && (
      <Tooltip content={helpText}>
        <HelpCircle className="w-4 h-4 text-slate-500 hover:text-indigo-400 transition-colors" />
      </Tooltip>
    )}
  </div>
);

const SelectionChip = ({ selected, onClick, children, color = 'indigo' }) => {
  const colors = {
    indigo: selected ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300',
    purple: selected ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/10' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300',
    teal: selected ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-lg shadow-teal-500/10' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300',
    amber: selected ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300',
    pink: selected ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-lg shadow-pink-500/10' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300',
    emerald: selected ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
  };
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${colors[color]}`}>
      {children}
    </button>
  );
};

const NameCard = ({ name, syllables, isFavorite, onCopy, onFavorite, copied }) => {
  const speakName = () => {
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="group relative p-4 bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onFavorite} className={`transition-all duration-200 ${isFavorite ? 'text-yellow-400 scale-110' : 'text-slate-600 hover:text-yellow-400 hover:scale-110'}`}>
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button onClick={speakName} className="text-slate-600 hover:text-cyan-400 hover:scale-110 transition-all duration-200">
            <Volume2 className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xl font-semibold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">{name}</span>
            <span className="ml-2 text-xs text-slate-500 font-mono">({syllables} syl)</span>
          </div>
        </div>
        <button onClick={onCopy} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}`}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};
// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AetherNames() {
  const [config, setConfig] = useState({
    nameType: 'character',
    genre: 'fantasy',
    tones: [],
    regions: [],
    timePeriod: 'any',
    minSyllables: 2,
    maxSyllables: 3,
    allowApostrophes: false,
    allowHyphens: false,
    allowAccents: false,
    mustStartWith: '',
    mustContain: '',
    mustNotContain: '',
    seedWord: '',
    nameCount: 10
  });

  const [generatedNames, setGeneratedNames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copiedName, setCopiedName] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);

  useEffect(() => { setAnimateHeader(true); }, []);

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));
  const toggleArray = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value]
    }));
  };

  const generate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const names = [];
      let attempts = 0;
      while (names.length < config.nameCount && attempts < config.nameCount * 20) {
        attempts++;
        const name = generateName(config);
        if (!names.some(n => n.name.toLowerCase() === name.toLowerCase()) && name.length >= 3 && name.length <= 20) {
          names.push({ id: Date.now() + Math.random(), name, syllables: countSyllables(name) });
        }
      }
      setGeneratedNames(names);
      setIsGenerating(false);
    }, 100);
  }, [config]);

  const copyToClipboard = async (name) => {
    await navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
  };

  const [copyFormat, setCopyFormat] = useState('plain');

  const copyAll = async () => {
    let text;
    switch (copyFormat) {
      case 'bullets':
        text = generatedNames.map(n => `• ${n.name}`).join('\n');
        break;
      case 'numbered':
        text = generatedNames.map((n, i) => `${i + 1}. ${n.name}`).join('\n');
        break;
      case 'comma':
        text = generatedNames.map(n => n.name).join(', ');
        break;
      default:
        text = generatedNames.map(n => n.name).join('\n');
    }
    await navigator.clipboard.writeText(text);
    setCopiedName('all');
    setTimeout(() => setCopiedName(null), 1500);
  };

  const toggleFavorite = (nameObj) => {
    setFavorites(prev => prev.some(f => f.name === nameObj.name) ? prev.filter(f => f.name !== nameObj.name) : [...prev, nameObj]);
  };

  const isFavorite = (name) => favorites.some(f => f.name === name);

  const exportFavorites = () => {
    const blob = new Blob([favorites.map(f => f.name).join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'aethernames.txt';
    a.click();
  };

  // DONATE FUNCTION - Your Ko-fi link
  const openDonation = () => {
    window.open('https://ko-fi.com/kylecarmichael', '_blank');
  };

  const helpTexts = {
    nameType: "What you're naming. Each type uses different construction patterns and suffixes.",
    genre: "Overall aesthetic. Fantasy = melodic and archaic. Sci-Fi = technical and sharp.",
    tone: "Emotional flavor through sound. Heroic uses resonant sounds. Dark uses harsh gutturals. Select multiple to blend.",
    region: "Linguistic rules from real languages. Each follows authentic phonotactics.",
    timePeriod: "Historical era influences name style. Ancient uses archaic patterns, Futuristic uses tech-inspired sounds.",
    structure: "Target syllable count. Actual may vary ±1.",
    orthographic: "Visual styling. Apostrophes and accents add exotic flair.",
    filters: "Constrain results. Seed words subtly influence without being obvious.",
    output: "Number of names to generate."
  };

  const toneIcons = { heroic: Zap, dark: Skull, ancient: Scroll, arcane: Sparkles, noble: Crown, brutal: Flame, whimsical: Music, alien: Globe, tech: Cpu, rustic: TreePine };

  const nameTypes = [
    { value: 'character', label: 'Character', icon: '👤' },
    { value: 'location', label: 'Location', icon: '🏰' },
    { value: 'faction', label: 'Faction', icon: '⚔️' },
    { value: 'item', label: 'Item', icon: '💎' },
    { value: 'starship', label: 'Starship', icon: '🚀' },
    { value: 'species', label: 'Species', icon: '👽' }
  ];

  const genres = [
    { value: 'fantasy', label: 'Fantasy', icon: '🗡️' },
    { value: 'scifi', label: 'Sci-Fi', icon: '🔮' },
    { value: 'mixed', label: 'Mixed', icon: '⚡' }
  ];

  const tones = [
    { value: 'heroic', label: 'Heroic' },
    { value: 'dark', label: 'Dark' },
    { value: 'ancient', label: 'Ancient' },
    { value: 'arcane', label: 'Arcane' },
    { value: 'noble', label: 'Noble' },
    { value: 'brutal', label: 'Brutal' },
    { value: 'whimsical', label: 'Whimsical' },
    { value: 'alien', label: 'Alien' },
    { value: 'tech', label: 'Tech' },
    { value: 'rustic', label: 'Rustic' }
  ];

  const regions = [
    { value: 'western', label: 'Western', desc: 'English/French/German', flag: '🇬🇧' },
    { value: 'latin', label: 'Latin', desc: 'Classical Roman', flag: '🏛️' },
    { value: 'greek', label: 'Greek', desc: 'Hellenic', flag: '🇬🇷' },
    { value: 'celtic', label: 'Celtic', desc: 'Irish/Welsh', flag: '☘️' },
    { value: 'norse', label: 'Norse', desc: 'Viking/Icelandic', flag: '⚔️' },
    { value: 'slavic', label: 'Slavic', desc: 'Russian/Polish', flag: '🪆' },
    { value: 'arabic', label: 'Arabic', desc: 'Semitic CV', flag: '🕌' },
    { value: 'persian', label: 'Persian', desc: 'Iranian', flag: '🇮🇷' },
    { value: 'egyptian', label: 'Egyptian', desc: 'Ancient Nile', flag: '🏺' },
    { value: 'eastasian', label: 'East Asian', desc: 'Chinese/Japanese', flag: '🏯' },
    { value: 'southasian', label: 'South Asian', desc: 'Sanskrit/Hindi', flag: '🕉️' },
    { value: 'african', label: 'African', desc: 'Bantu/Swahili', flag: '🌍' },
    { value: 'polynesian', label: 'Polynesian', desc: 'Pacific Islands', flag: '🌺' },
    { value: 'mesoamerican', label: 'Mesoamerican', desc: 'Nahuatl/Maya', flag: '🗿' },
    { value: 'spaceopera', label: 'Space Opera', desc: 'Classic Alien', flag: '🌌' },
    { value: 'cyberpunk', label: 'Cyberpunk', desc: 'Tech-Noir', flag: '🤖' },
    { value: 'neutral', label: 'Neutral', desc: 'Universal', flag: '🌐' }
  ];

  const timePeriods = [
    { value: 'any', label: 'Any Era' },
    { value: 'ancient', label: 'Ancient' },
    { value: 'medieval', label: 'Medieval' },
    { value: 'renaissance', label: 'Renaissance' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'modern', label: 'Modern' },
    { value: 'futuristic', label: 'Futuristic' }
  ];

  return (
    <div className="min-h-screen text-slate-100 relative">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 pb-32">
        {/* Header */}
        <header className={`text-center py-8 mb-8 transition-all duration-1000 ${animateHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/30">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              AetherName
            </h1>
          </div>
          
          <p className="text-slate-400 text-lg font-light mb-4">Linguistically Authentic Fantasy & Sci-Fi Name Forge</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 mb-4 backdrop-blur-md">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-xs md:text-sm font-medium text-slate-300">
              <span className="text-indigo-400 font-bold">No AI / LLMs.</span> 100% algorithmic phonotactics.
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Phonotactically Accurate', 'Cross-Linguistic', 'Customizable'].map((tag, i) => (
              <span key={i} className="px-3 py-1 text-xs font-medium bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400">
                {tag}
              </span>
            ))}
          </div>

          <GlowButton variant="donate" onClick={openDonation} className="px-8">
            <Heart className="w-5 h-5" />
            Support the Creator
          </GlowButton>
        </header>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Config Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-400" /> Configuration
              </h2>

              {/* Name Type */}
              <div className="mb-6">
                <SectionHeader title="Name Type" helpText={helpTexts.nameType} icon={Sparkles} />
                <div className="grid grid-cols-3 gap-2">
                  {nameTypes.map(t => (
                    <SelectionChip key={t.value} selected={config.nameType === t.value} onClick={() => updateConfig('nameType', t.value)}>
                      <span className="mr-1">{t.icon}</span> {t.label}
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div className="mb-6">
                <SectionHeader title="Genre" helpText={helpTexts.genre} icon={Globe} />
                <div className="grid grid-cols-3 gap-2">
                  {genres.map(g => (
                    <SelectionChip key={g.value} selected={config.genre === g.value} onClick={() => updateConfig('genre', g.value)}>
                      <span className="mr-1">{g.icon}</span> {g.label}
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Time Period */}
              <div className="mb-6">
                <SectionHeader title="Time Period" helpText={helpTexts.timePeriod} icon={Scroll} />
                <div className="flex flex-wrap gap-2">
                  {timePeriods.map(t => (
                    <SelectionChip key={t.value} selected={config.timePeriod === t.value} onClick={() => updateConfig('timePeriod', t.value)} color="emerald">
                      {t.label}
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="mb-6">
                <SectionHeader title="Tone" helpText={helpTexts.tone} icon={Music} />
                <div className="grid grid-cols-5 gap-2">
                  {tones.map(t => {
                    const Icon = toneIcons[t.value];
                    return (
                      <SelectionChip key={t.value} selected={config.tones.includes(t.value)} onClick={() => toggleArray('tones', t.value)} color="purple">
                        <div className="flex flex-col items-center gap-1">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs">{t.label}</span>
                        </div>
                      </SelectionChip>
                    );
                  })}
                </div>
              </div>

              {/* Region */}
              <div className="mb-6">
                <SectionHeader title="Linguistic Influence" helpText={helpTexts.region} icon={Globe} />
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                  {regions.map(r => (
                    <SelectionChip key={r.value} selected={config.regions.includes(r.value)} onClick={() => toggleArray('regions', r.value)} color="teal">
                      <div className="flex items-center gap-2 w-full">
                        <span>{r.flag}</span>
                        <div className="text-left">
                          <div className="font-medium">{r.label}</div>
                          <div className="text-xs opacity-60">{r.desc}</div>
                        </div>
                      </div>
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Structure */}
              <div className="mb-6">
                <SectionHeader title="Structure" helpText={helpTexts.structure} />
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Short', min: 1, max: 2 },
                    { label: 'Medium', min: 2, max: 3 },
                    { label: 'Long', min: 3, max: 4 },
                    { label: 'Epic', min: 4, max: 5 }
                  ].map(preset => (
                    <SelectionChip
                      key={preset.label}
                      selected={config.minSyllables === preset.min && config.maxSyllables === preset.max}
                      onClick={() => {
                        updateConfig('minSyllables', preset.min);
                        updateConfig('maxSyllables', preset.max);
                      }}
                      color="pink"
                    >
                      {preset.label} ({preset.min}-{preset.max})
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="mb-6">
                <SectionHeader title="Style" helpText={helpTexts.orthographic} />
                <div className="flex gap-2">
                  {[
                    { key: 'allowApostrophes', label: "Ka'ri", example: "apostrophes" },
                    { key: 'allowHyphens', label: 'Val-Kir', example: "hyphens" },
                    { key: 'allowAccents', label: 'Élara', example: "accents" }
                  ].map(o => (
                    <SelectionChip key={o.key} selected={config[o.key]} onClick={() => updateConfig(o.key, !config[o.key])} color="amber">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{o.label}</span>
                        <span className="text-xs opacity-60">{o.example}</span>
                      </div>
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="mb-6">
                <SectionHeader title="Filters" helpText={helpTexts.filters} />
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'mustStartWith', placeholder: 'Starts with...' },
                    { key: 'mustContain', placeholder: 'Contains...' },
                    { key: 'mustNotContain', placeholder: 'Excludes...' },
                    { key: 'seedWord', placeholder: 'Seed word...' }
                  ].map(f => (
                    <input
                      key={f.key}
                      value={config[f.key]}
                      onChange={e => updateConfig(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  ))}
                </div>
              </div>

              {/* Output */}
              <div className="mb-6">
                <SectionHeader title="Output" helpText={helpTexts.output} />
                <div className="flex gap-2">
                  {[5, 10, 20, 50].map(n => (
                    <SelectionChip key={n} selected={config.nameCount === n} onClick={() => updateConfig('nameCount', n)}>
                      {n}
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex gap-3">
                <GlowButton onClick={generate} disabled={isGenerating} className="flex-1">
                  <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Forging...' : 'Generate Names'}
                </GlowButton>
                <GlowButton variant="secondary" onClick={() => setGeneratedNames([])}>
                  <X className="w-5 h-5" />
                </GlowButton>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-400" /> Generated Names
                </h2>
                {generatedNames.length > 0 && (
                  <div className="flex items-center gap-3">
                    <select
                      value={copyFormat}
                      onChange={e => setCopyFormat(e.target.value)}
                      className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="plain" className="bg-slate-800">Plain</option>
                      <option value="bullets" className="bg-slate-800">• Bullets</option>
                      <option value="numbered" className="bg-slate-800">1. Numbered</option>
                      <option value="comma" className="bg-slate-800">Comma</option>
                    </select>
                    <button onClick={copyAll} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                      {copiedName === 'all' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      Copy All
                    </button>
                  </div>
                )}
              </div>

              {generatedNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-md">{generatedNames.length} names</span>
                  {config.regions.length > 0 && (
                    <span className="px-2 py-1 text-xs bg-teal-500/20 text-teal-300 rounded-md">
                      {config.regions.slice(0, 3).join(', ')}{config.regions.length > 3 ? ` +${config.regions.length - 3}` : ''}
                    </span>
                  )}
                  {config.tones.length > 0 && (
                    <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-md">{config.tones.join(', ')}</span>
                  )}
                  {config.timePeriod !== 'any' && (
                    <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded-md">{config.timePeriod}</span>
                  )}
                </div>
              )}

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {generatedNames.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex p-6 rounded-full bg-slate-800/50 mb-4">
                      <Wand2 className="w-12 h-12 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-lg">Configure your settings and generate names</p>
                    <p className="text-slate-600 text-sm mt-2">Each name follows authentic linguistic rules</p>
                  </div>
                ) : (
                  generatedNames.map(n => (
                    <NameCard
                      key={n.id}
                      name={n.name}
                      syllables={n.syllables}
                      isFavorite={isFavorite(n.name)}
                      onCopy={() => copyToClipboard(n.name)}
                      onFavorite={() => toggleFavorite(n)}
                      copied={copiedName === n.name}
                    />
                  ))
                )}
              </div>

              {/* Favorites */}
              {favorites.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-yellow-400 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" /> Favorites ({favorites.length})
                    </h3>
                    <button onClick={exportFavorites} className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Export
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favorites.map(f => (
                      <div key={f.name} className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-sm text-yellow-300">
                        {f.name}
                        <button onClick={() => toggleFavorite(f)} className="text-yellow-500/50 hover:text-red-400 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* How It Works */}
            <div className="mt-6">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex items-center gap-2 w-full bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 border border-slate-800/50 rounded-2xl p-4 text-left transition-all"
              >
                {showInstructions ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-indigo-400" />}
                <span className="font-semibold text-indigo-400">How It Works</span>
              </button>

              {showInstructions && (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-t-0 border-slate-800/50 rounded-b-2xl p-6 -mt-2">
                  <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-400">
                    <div>
                      <h4 className="font-bold text-indigo-400 mb-2">Phonotactics</h4>
                      <p>Each language follows real linguistic constraints. Arabic uses only CV syllables. Norse allows complex clusters like "Bjorn".</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-400 mb-2">Tone System</h4>
                      <p>Tones influence sounds. Heroic uses resonant sounds (L, R, N). Dark uses harsh gutturals (K, G, TH).</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-400 mb-2">Time Periods</h4>
                      <p>Ancient names use archaic prefixes. Medieval adds titles. Futuristic uses tech-inspired sounds.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-slate-600 text-sm">
              <p>Made with ❤️ for writers, game masters, and worldbuilders</p>
              <button onClick={openDonation} className="mt-2 text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1 mx-auto">
                <Heart className="w-4 h-4" /> Support this project on Ko-fi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
