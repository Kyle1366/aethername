import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, Copy, Star, ChevronDown, ChevronUp, Sparkles, X, Check, Download, Wand2, RefreshCw, Zap, Globe, Music, Skull, Crown, Flame, TreePine, Cpu, Rocket, Scroll, Heart, Volume2, FlaskConical, Glasses } from 'lucide-react';

// ============================================================================
// LINGUISTICALLY AUTHENTIC PHONOTACTIC DATA
// Each language family follows real-world constraints
// ============================================================================

// ============================================================================
// THEME CONFIGURATIONS
// ============================================================================

const themeConfig = {
  fantasy: {
    background: 'from-amber-950 via-stone-900 to-stone-950',
    orbs: ['#d97706', '#b45309', '#a855f7', '#7c3aed'],
    accent: 'amber',
    glow: 'amber-500',
    font: "'Cinzel', serif",
    buttonGradient: 'from-amber-600 via-orange-600 to-red-600',
    buttonHover: 'from-amber-500 via-orange-500 to-red-500',
    buttonShadow: 'shadow-orange-500/25 hover:shadow-orange-500/40',
    cardBorder: 'border-amber-500/30 hover:border-amber-500/50',
    chipSelected: {
      indigo: 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10',
      purple: 'bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-lg shadow-orange-500/10',
      teal: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-lg shadow-yellow-500/10',
      amber: 'bg-red-500/20 border-red-500/50 text-red-300 shadow-lg shadow-red-500/10',
      pink: 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/10',
      emerald: 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10'
    }
  },
  scifi: {
    background: 'from-cyan-950 via-slate-900 to-black',
    orbs: ['#06b6d4', '#0891b2', '#3b82f6', '#6366f1'],
    accent: 'cyan',
    glow: 'cyan-500',
    font: "'Orbitron', sans-serif",
    buttonGradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    buttonHover: 'from-cyan-500 via-blue-500 to-indigo-500',
    buttonShadow: 'shadow-cyan-500/25 hover:shadow-cyan-500/40',
    cardBorder: 'border-cyan-500/30 hover:border-cyan-500/50',
    chipSelected: {
      indigo: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10',
      purple: 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/10',
      teal: 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-lg shadow-teal-500/10',
      amber: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10',
      pink: 'bg-violet-500/20 border-violet-500/50 text-violet-300 shadow-lg shadow-violet-500/10',
      emerald: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
    }
  },
  mixed: {
    background: 'from-slate-950 via-indigo-950/50 to-purple-950/30',
    orbs: ['#6366f1', '#8b5cf6', '#a855f7', '#3b82f6'],
    accent: 'indigo',
    glow: 'purple-500',
    font: "'Inter', sans-serif",
    buttonGradient: 'from-indigo-600 via-purple-600 to-pink-600',
    buttonHover: 'from-indigo-500 via-purple-500 to-pink-500',
    buttonShadow: 'shadow-purple-500/25 hover:shadow-purple-500/40',
    cardBorder: 'border-indigo-500/30 hover:border-indigo-500/50',
    chipSelected: {
      indigo: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10',
      purple: 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/10',
      teal: 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-lg shadow-teal-500/10',
      amber: 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10',
      pink: 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-lg shadow-pink-500/10',
      emerald: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
    }
  }
};

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
    patterns: [{ type: 'CVC', weight: 45 }, { type: 'CV', weight: 35 }, { type: 'CVCC', weight: 10 }, { type: 'CCV', weight: 10 }],
    elements: { starts: ['Arn', 'Bjorn', 'Dag', 'Ei', 'Frey', 'Gunn', 'Har', 'Ing', 'Odd', 'Rag', 'Sig', 'Thor', 'Ulf', 'Val'], ends: ['ar', 'ir', 'or', 'ald', 'ulf', 'ard', 'mund', 'leif', 'geir', 'dis', 'hild', 'run', 'stein'] },
    endings: ['ar', 'ir', 'ur', 'or', 'ald', 'ulf', 'ard', 'mund', 'leif', 'geir', 'a', 'i']
  },

  slavic: {
    onsets: {
      simple: ['b', 'd', 'g', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z'],
      clusters: ['br', 'dr', 'gr', 'kr', 'pr', 'tr', 'bl', 'gl', 'kl', 'pl', 'sl', 'sv', 'vl', 'zl']
    },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['ia', 'io'] },
    codas: { simple: ['d', 'k', 'l', 'm', 'n', 'r', 's', 't', 'v'], clusters: ['st', 'nd', 'rn'] },
    patterns: [{ type: 'CV', weight: 50 }, { type: 'CVC', weight: 35 }, { type: 'CCV', weight: 12 }, { type: 'CCVC', weight: 3 }],
    elements: { starts: ['Bel', 'Bog', 'Bor', 'Dob', 'Drag', 'Jar', 'Lad', 'Lub', 'Mil', 'Mir', 'Rad', 'Slav', 'Stan', 'Svet', 'Vlad', 'Vol', 'Yar', 'Zar', 'Zlat'], ends: ['mir', 'slav', 'mil', 'rad', 'vid', 'bor', 'gor', 'dan', 'yar', 'zar'] },
    endings: ['a', 'mir', 'slav', 'rad', 'ov', 'ko', 'ka', 'an', 'in', 'il', 'vid', 'yar']
  },

  arabic: {
    onsets: { simple: ['b', 'd', 'f', 'h', 'j', 'k', 'l', 'm', 'n', 'q', 'r', 's', 'sh', 't', 'w', 'y', 'z', 'kh', 'gh'], clusters: [] },
    vowels: { short: ['a', 'i', 'u'], long: ['aa', 'ii', 'uu', 'ai', 'au'] },
    codas: { simple: ['b', 'd', 'f', 'h', 'k', 'l', 'm', 'n', 'r', 's', 't'], clusters: [] },
    patterns: [{ type: 'CV', weight: 60 }, { type: 'CVC', weight: 35 }, { type: 'V', weight: 5 }],
    elements: { starts: ['Abd', 'Ah', 'Al', 'Am', 'As', 'Fah', 'Far', 'Has', 'Jab', 'Jam', 'Kar', 'Khal', 'Mah', 'Nas', 'Nur', 'Sal', 'Sul', 'Tar', 'Zah'], ends: ['a', 'ah', 'an', 'ar', 'i', 'id', 'il', 'im', 'in', 'ir', 'ud', 'ul', 'um', 'un', 'ur'] },
    endings: ['a', 'ah', 'an', 'ar', 'i', 'id', 'im', 'in', 'ir', 'ud', 'ul', 'um', 'un']
  },

  eastasian: {
    onsets: { simple: ['b', 'ch', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 'sh', 't', 'w', 'y', 'z'], clusters: [] },
    vowels: { short: ['a', 'e', 'i', 'o', 'u'], long: ['ai', 'ao', 'ei', 'ia', 'ie', 'ou', 'ue', 'ui'] },
    codas: { simple: ['n'], clusters: [] },
    patterns: [{ type: 'CV', weight: 75 }, { type: 'V', weight: 15 }, { type: 'CVN', weight: 10 }],
    elements: { starts: ['Chi', 'Fei', 'Hai', 'Hiro', 'Jin', 'Kai', 'Ken', 'Lei', 'Lin', 'Mei', 'Min', 'Rei', 'Ren', 'Ryu', 'Shen', 'Shin', 'Tai', 'Wei', 'Yan', 'Yu', 'Aki', 'Hana', 'Kazu', 'Miko', 'Nori', 'Saku', 'Taka', 'Yuki'], ends: ['ko', 'ki', 'mi', 'ri', 'chi', 'ka', 'na', 'no', 'shi', 'ta', 'to', 'ya', 'ro', 'ru', 'ke', 'ra', 'ma'] },
    endings: ['a', 'e', 'i', 'o', 'u', 'n', 'ko', 'ki', 'mi', 'ri', 'ya', 'no', 'ta', 'ka', 'ra']
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

const cleanConsonantClusters = (name, region) => {
  const maxClusters = {
    arabic: 1,
    eastasian: 1,
    polynesian: 1,
    african: 2,
    egyptian: 2,
    southasian: 2,
    latin: 2,
    greek: 2,
    celtic: 2,
    mesoamerican: 2,
    western: 3,
    norse: 3,
    slavic: 3,
    persian: 3,
    spaceopera: 3,
    cyberpunk: 3,
    neutral: 3
  };
  
  const max = maxClusters[region] || 3;
  const consonantRun = /[bcdfghjklmnpqrstvwxyz]{2,}/gi;
  
  return name.replace(consonantRun, (match) => {
    if (match.length <= max) return match;
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const midpoint = Math.floor(match.length / 2);
    const vowel = vowels[Math.floor(Math.random() * vowels.length)];
    return match.slice(0, midpoint) + vowel + match.slice(midpoint);
  });
};

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
  if (lower.length <= 3) return 1;
  
  // Count vowel groups
  let count = 0;
  let prevWasVowel = false;
  
  for (let i = 0; i < lower.length; i++) {
    const isVowel = /[aeiouy]/.test(lower[i]);
    if (isVowel && !prevWasVowel) {
      count++;
    }
    prevWasVowel = isVowel;
  }
  
  // Adjust for silent e at end
  if (lower.endsWith('e') && count > 1 && !/[aeiouy]/.test(lower[lower.length - 2])) {
    count--;
  }
  
  // Adjust for common endings that don't add syllables
  if (lower.endsWith('le') && lower.length > 2 && !/[aeiouy]/.test(lower[lower.length - 3])) {
    count++;
  }
  
  return Math.max(1, count);
};

const breakIntoSyllables = (str) => {
  const lower = str.toLowerCase().replace(/[^a-z-]/g, '');
  const syllables = [];
  let current = '';
  let prevWasVowel = false;
  
  for (let i = 0; i < lower.length; i++) {
    const char = lower[i];
    
    // Handle hyphens as natural breaks
    if (char === '-') {
      if (current) syllables.push(current);
      current = '';
      prevWasVowel = false;
      continue;
    }
    
    const isVowel = /[aeiouy]/.test(char);
    
    // Start new syllable on vowel after consonant (if we have content)
    if (isVowel && !prevWasVowel && current.length > 0 && syllables.length < 10) {
      // Check if we should split before or after
      const hasVowelInCurrent = /[aeiouy]/.test(current);
      if (hasVowelInCurrent) {
        // Split: move last consonant(s) to new syllable
        const match = current.match(/([^aeiouy]*)$/);
        if (match && match[1]) {
          const consonants = match[1];
          if (consonants.length > 0 && current.length > consonants.length) {
            syllables.push(current.slice(0, -consonants.length));
            current = consonants;
          }
        }
      }
    }
    
    current += char;
    prevWasVowel = isVowel;
  }
  
  if (current) {
    // Check if the final chunk has multiple vowel groups that should be split
    // e.g., "osen" should become "os" + "en"
    const finalVowelGroups = current.match(/[aeiouy]+/g);
    if (finalVowelGroups && finalVowelGroups.length > 1) {
      // Find the split point - after the first vowel group and its following consonants
      const firstVowelMatch = current.match(/^([^aeiouy]*[aeiouy]+[^aeiouy]?)(.+)$/);
      if (firstVowelMatch && firstVowelMatch[2] && /[aeiouy]/.test(firstVowelMatch[2])) {
        syllables.push(firstVowelMatch[1]);
        syllables.push(firstVowelMatch[2]);
      } else {
        syllables.push(current);
      }
    } else {
      syllables.push(current);
    }
  }
  
  return syllables.length > 0 ? syllables : [str];
};

const validateName = (name, region) => {
  const lower = name.toLowerCase().replace(/[^a-z]/g, '');
  
  // Universal rules - reject obviously bad names
  if (/[aeiou]{4,}/.test(lower)) return false; // 4+ vowels in a row
  if (/[bcdfghjklmnpqrstvwxz]{4,}/.test(lower)) return false; // 4+ consonants in a row
  
  // Count diphthongs (two-letter vowel combos)
  const diphthongs = (lower.match(/[aeiou]{2}/g) || []).length;
  
  // Region-specific validation
  const rules = {
    western: () => {
      if (diphthongs > 1) return false;
      // Should end in consonant or common Western endings
      if (!/(?:[bcdfgklmnprst]|a|ia|ea|en|er|or|us|is|an|on)$/.test(lower)) return false;
      return true;
    },
    latin: () => {
      if (diphthongs > 1) return false;
      // Latin endings
      if (!/(?:us|a|um|is|or|ix|ax|ex|ius|ia)$/.test(lower)) return false;
      return true;
    },
    celtic: () => {
      if (diphthongs > 2) return false; // Celtic allows more diphthongs
      if (!/(?:[dlnrth]|an|en|in|on|wen|wyn|ach|aith|id|a)$/.test(lower)) return false;
      return true;
    },
    norse: () => {
      if (diphthongs > 1) return false;
      // Norse is consonant-heavy, should end strong
      if (!/(?:[rndlkft]|ar|ir|ur|or|ald|ulf|mund|leif|geir)$/.test(lower)) return false;
      // Reject vowel-heavy names
      const vowelRatio = (lower.match(/[aeiou]/g) || []).length / lower.length;
      if (vowelRatio > 0.5) return false;
      return true;
    },
    slavic: () => {
      if (diphthongs > 1) return false;
      if (!/(?:[aeiou]|mir|slav|rad|ov|ev|ko|ka|an|in|il|vid|yar|zar)$/.test(lower)) return false;
      if (/[bcdfghjklmnpqrstvwxz]{4,}/.test(lower)) return false;
      if (/e$/.test(lower)) return false;
      return true;
    },
    arabic: () => {
      // Arabic: no consonant clusters allowed
      if (/[bcdfghjklmnpqrstvwxz]{2,}/.test(lower)) return false;
      if (diphthongs > 1) return false;
      if (!/(?:[aiu]|ah|an|ar|id|il|im|in|ir|ud|ul|um|un)$/.test(lower)) return false;
      return true;
    },
    eastasian: () => {
      // Must end in vowel or n/ng only
      if (!/(?:[aeiou]|n|ng)$/.test(lower)) return false;
      // No consonant clusters
      if (/[bcdfghjklmpqrstvwxz]{2,}/.test(lower)) return false;
      return true;
    },
    southasian: () => {
      if (diphthongs > 2) return false;
      if (!/(?:[aeiou]|an|in|am|ya|na|ta|esh|raj)$/.test(lower)) return false;
      return true;
    },
    african: () => {
      // Bantu: mostly CV patterns, ends in vowel
      if (!/[aeiou]$/.test(lower)) return false;
      // Only prenasalized clusters allowed (mb, nd, ng, etc)
      const invalidClusters = lower.match(/[bcdfghjklpqrstvwxz]{2,}/g) || [];
      for (const cluster of invalidClusters) {
        if (!/^(?:mb|nd|ng|nj|nk|mp|nt|nz|kw|gw|bw|tw|sw|ny)/.test(cluster)) return false;
      }
      return true;
    },
    mesoamerican: () => {
      if (diphthongs > 1) return false;
      // Allow tl, ts clusters
      if (!/(?:[aeiou]|tl|tli|atl|in|an|il|al|tzin)$/.test(lower)) return false;
      return true;
    },
    greek: () => {
      if (diphthongs > 2) return false; // Greek has many diphthongs
      if (!/(?:os|es|is|as|on|eus|ios|ia|a|ides)$/.test(lower)) return false;
      return true;
    },
    egyptian: () => {
      if (diphthongs > 1) return false;
      // No clusters
      if (/[bcdfghjklmnpqrstvwxz]{3,}/.test(lower)) return false;
      if (!/(?:[aeiou]|is|it|et|en|un|at|hotep|mose|ankh|amun)$/.test(lower)) return false;
      return true;
    },
    persian: () => {
      if (diphthongs > 1) return false;
      if (!/(?:[aeiou]|an|ar|ash|esh|in|ir|ush|yar|zad|var)$/.test(lower)) return false;
      return true;
    },
    polynesian: () => {
      // Must end in vowel - no exceptions
      if (!/[aeiou]$/.test(lower)) return false;
      // No consonant clusters at all
      if (/[bcdfghjklmnpqrstvwxz]{2,}/.test(lower)) return false;
      // High vowel ratio
      const vowelRatio = (lower.match(/[aeiou]/g) || []).length / lower.length;
      if (vowelRatio < 0.45) return false;
      return true;
    },
    spaceopera: () => {
      if (diphthongs > 1) return false;
      if (!/(?:[xzrkst]|ax|ex|ix|ox|ar|or|on|ion|ius|rix|xis|zar)$/.test(lower)) return false;
      return true;
    },
    cyberpunk: () => {
      if (diphthongs > 1) return false;
      // Tech feel - ends in hard sounds
      if (!/(?:[xkzt]|ax|ex|ix|ok|on|or|tek|syn|net)$/.test(lower)) return false;
      return true;
    },
    neutral: () => {
      if (diphthongs > 1) return false;
      // General pleasant endings
      if (!/(?:[aeiou]|[lnrst]|an|ar|el|en|er|ia|in|on|or|us|is)$/.test(lower)) return false;
      return true;
    }
  };

  // Run region-specific validation, default to neutral
  const validator = rules[region] || rules.neutral;
  return validator();
};

const classifyGender = (name) => {
  const lower = name.toLowerCase().replace(/[^a-z]/g, '');
  let femScore = 0;
  let mascScore = 0;

  // Feminine endings
  if (/(?:a|ia|ella|ette|ine|elle|ana|ina|ya|ie|lee|ley|ly|ri|mi|ki)$/.test(lower)) femScore += 3;
  if (/(?:i|e)$/.test(lower)) femScore += 1;

  // Masculine endings
  if (/(?:us|or|ar|ard|mund|ric|ulf|ak|ok|orn|ek|ox|ax|ur|ir|ius|os|on|er|an|im)$/.test(lower)) mascScore += 3;
  if (/(?:k|d|r|x|th)$/.test(lower)) mascScore += 1;

  // Sound balance
  const softSounds = (lower.match(/[lmn]/g) || []).length;
  const hardSounds = (lower.match(/[kgrdx]/g) || []).length;
  const vowelRatio = (lower.match(/[aeiou]/g) || []).length / lower.length;

  if (vowelRatio > 0.45) femScore += 1;
  if (vowelRatio < 0.35) mascScore += 1;
  if (softSounds > hardSounds) femScore += 1;
  if (hardSounds > softSounds) mascScore += 1;

  if (femScore > mascScore + 1) return 'feminine';
  if (mascScore > femScore + 1) return 'masculine';
  return 'neutral';
};

const analyzePatterns = (names) => {
  if (names.length === 0) return null;
  
  const patterns = {
    endings: {},
    startSounds: {},
    syllableCounts: {},
    avgLength: 0,
    vowelRatios: []
  };
  
  names.forEach(n => {
    const name = n.name.toLowerCase().replace(/[^a-z]/g, '');
    
    // Track endings (last 2-3 chars)
    if (name.length >= 2) {
      const end2 = name.slice(-2);
      const end3 = name.length >= 3 ? name.slice(-3) : null;
      patterns.endings[end2] = (patterns.endings[end2] || 0) + 1;
      if (end3) patterns.endings[end3] = (patterns.endings[end3] || 0) + 1;
    }
    
    // Track starting sounds (first 1-2 chars)
    const start1 = name.charAt(0);
    const start2 = name.slice(0, 2);
    patterns.startSounds[start1] = (patterns.startSounds[start1] || 0) + 1;
    patterns.startSounds[start2] = (patterns.startSounds[start2] || 0) + 1;
    
    // Track syllable counts
    const sylCount = countSyllables(name);
    patterns.syllableCounts[sylCount] = (patterns.syllableCounts[sylCount] || 0) + 1;
    
    // Track length and vowel ratio
    patterns.avgLength += name.length;
    const vowels = (name.match(/[aeiou]/g) || []).length;
    patterns.vowelRatios.push(vowels / name.length);
  });
  
  patterns.avgLength = Math.round(patterns.avgLength / names.length);
  patterns.avgVowelRatio = patterns.vowelRatios.reduce((a, b) => a + b, 0) / patterns.vowelRatios.length;
  
  // Get most common patterns
  const topEndings = Object.entries(patterns.endings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(e => e[0]);
  
  const topStarts = Object.entries(patterns.startSounds)
    .filter(s => s[0].length === 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(s => s[0]);
  
  const topSyllables = Object.entries(patterns.syllableCounts)
    .sort((a, b) => b[1] - a[1])
    .map(s => parseInt(s[0]));
  
  return {
    endings: topEndings,
    startSounds: topStarts,
    syllableRange: [Math.min(...topSyllables), Math.max(...topSyllables)],
    avgLength: patterns.avgLength,
    avgVowelRatio: patterns.avgVowelRatio
  };
};

const generateRefinedName = (config, patterns) => {
  const { regions, tones } = config;
  
  const regionList = regions.length > 0 ? regions.slice(0, 4) : ['neutral'];
  const selectedRegion = regionList[Math.floor(Math.random() * regionList.length)];
  const primaryLang = linguisticData[selectedRegion] || linguisticData.neutral;
  const primaryTone = tones.length > 0 ? toneModifiers[tones[0]] : null;
  
  const [minSyl, maxSyl] = patterns.syllableRange;
  const targetSyllables = Math.floor(Math.random() * (maxSyl - minSyl + 1)) + minSyl;
  
  let name = '';
  let attempts = 0;
  
  while (attempts < 100) {
    attempts++;
    name = '';
    // Reset per-attempt metadata
    metadata.syllables = [];
    metadata.elements = { start: null, end: null };
    metadata.method = '';
    metadata.modifications = [];
    
    // Favor starting with analyzed start sounds (70% chance)
    if (patterns.startSounds.length > 0 && Math.random() < 0.7) {
      const startSound = patterns.startSounds[Math.floor(Math.random() * patterns.startSounds.length)];
      // Find an onset that starts with this sound
      const matchingOnsets = primaryLang.onsets.simple.filter(o => o.startsWith(startSound));
      if (matchingOnsets.length > 0) {
        name += random(matchingOnsets);
        name += random(primaryLang.vowels.short);
      }
    }
    
    // Generate remaining syllables
    const currentSyllables = countSyllables(name);
    const remaining = Math.max(0, targetSyllables - currentSyllables);
    
    for (let i = 0; i < remaining; i++) {
      const pattern = weightedRandom(primaryLang.patterns.map(p => p.type), primaryLang.patterns.map(p => p.weight));
      name += generateSyllable(primaryLang, pattern, primaryTone);
    }
    
    // Apply analyzed ending (80% chance)
    if (patterns.endings.length > 0 && Math.random() < 0.8) {
      const ending = patterns.endings[Math.floor(Math.random() * patterns.endings.length)];
      // Remove last 1-2 chars and add the ending
      const charsToRemove = Math.min(ending.length, Math.floor(name.length / 3));
      name = name.slice(0, -charsToRemove) + ending;
    }
    
    // Check length is reasonable
    if (name.length < 3 || name.length > 15) continue;
    
    // Check syllable count
    const syllables = countSyllables(name);
    if (syllables < minSyl || syllables > maxSyl + 1) continue;
    
    break;
  }
  
  return capitalize(name.toLowerCase());
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

const generateName = (config, returnMetadata = false) => {
  const { nameType, regions, tones, timePeriod, minSyllables, maxSyllables, mustStartWith, mustContain, mustNotContain, seedWord, allowApostrophes, allowHyphens, allowAccents, nameStyle } = config;

  const regionList = regions.length > 0 ? regions.slice(0, 4) : ['neutral'];
  // Pick ONE region for this entire name based on equal probability
  const selectedRegion = regionList[Math.floor(Math.random() * regionList.length)];
  const primaryLang = linguisticData[selectedRegion] || linguisticData.neutral;
  
  // Track generation metadata
  const metadata = {
    selectedRegion: selectedRegion,
    allRegions: regionList,
    tones: tones.length > 0 ? tones : [],
    timePeriod: timePeriod || 'any',
    nameType: nameType,
    method: '',
    syllables: [],
    elements: { start: null, end: null },
    modifications: []
  };
  const primaryTone = tones.length > 0 ? toneModifiers[tones[0]] : null;
  const periodMod = timePeriod && timePeriod !== 'any' ? timePeriodModifiers[timePeriod] : null;
  const typeElements = nameTypeElements[nameType] || nameTypeElements.character;

  const targetSyllables = Math.floor(Math.random() * (maxSyllables - minSyllables + 1)) + minSyllables;

  let name = '';
  let attempts = 0;

  while (attempts < 100) {
    attempts++;
    name = '';
    // Reset per-attempt metadata
    metadata.syllables = [];
    metadata.elements = { start: null, end: null };
    metadata.method = '';
    metadata.modifications = [];

    // For non-character types, use type-specific elements
    // If nameStyle is set (not default), always use type elements for consistency
    const useTypeElements = nameType !== 'character' && typeElements.prefixes.length > 0;
    const forceTypeElements = nameStyle && nameStyle !== 'default';
    
    if (useTypeElements && (forceTypeElements || Math.random() < 0.7)) {
      const prefix = random(typeElements.prefixes);
      const suffix = random(typeElements.suffixes);
      
      // Apply name style
      if (nameStyle === 'spaced') {
        name = prefix + ' ' + capitalize(suffix);
      } else if (nameStyle === 'title') {
        name = 'The ' + prefix + ' ' + capitalize(suffix);
      } else {
        // compound or default - join directly
        name = prefix + suffix;
      }
      metadata.method = 'type-elements';
      metadata.elements = { start: prefix, end: suffix };
      metadata.skipClusterCleanup = true; // These are real English words, don't mangle them
    }
    // Use time period elements - ALWAYS apply if user selected one (characters only)
    else if (periodMod && nameType === 'character') {
      const usePrefix = Math.random() < 0.5;
      
      // Build a good base name using language elements
      if (primaryLang.elements && Math.random() < 0.7) {
        const start = random(primaryLang.elements.starts);
        const end = random(primaryLang.elements.ends);
        name = start + end;
      } else {
        for (let i = 0; i < targetSyllables; i++) {
          const lang = primaryLang;
          const pattern = weightedRandom(lang.patterns.map(p => p.type), lang.patterns.map(p => p.weight));
          name += generateSyllable(lang, pattern, primaryTone);
        }
        if (primaryLang.endings) {
          name = name.replace(/[aeiou]$/, '') + random(primaryLang.endings);
        }
      }
      
      // Apply time period modifier
      if (usePrefix) {
        const prefix = random(periodMod.prefixes);
        // Add space for title-style prefixes
        if (['Ser', 'Lord', 'Saint', 'Don', 'Donna', 'Signor', 'Conte', 'Duc'].includes(prefix)) {
          const baseName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
          name = prefix + ' ' + baseName;
        } else {
          name = prefix + name.toLowerCase();
          name = capitalize(name);
        }
      } else {
        name = capitalize(name);
        name = name.replace(/[aeiou]$/, '') + random(periodMod.suffixes);
      }
    }
    // Use language elements
    else if (Math.random() < 0.35 && primaryLang.elements) {
      if (Math.random() < 0.5) {
        metadata.method = 'elements';
        // Pick regions for start and end elements
        const startRegion = regionList[0];
        const endRegion = regionList.length > 1 ? regionList[1] : regionList[0];
        const startLang = linguisticData[startRegion] || primaryLang;
        const endLang = linguisticData[endRegion] || primaryLang;
        
        const prefix = primaryTone?.prefixes 
          ? random([...startLang.elements.starts, ...primaryTone.prefixes])
          : random(startLang.elements.starts);
        const suffix = primaryTone?.suffixes
          ? random([...endLang.elements.ends, ...primaryTone.suffixes])
          : random(endLang.elements.ends);
        metadata.elements = { start: prefix, startRegion: startRegion, end: suffix, endRegion: endRegion };
        name = prefix + suffix;
      } else {
        metadata.method = 'mixed';
        const startRegion = regionList[0];
        const startLang = linguisticData[startRegion] || primaryLang;
        const startElement = random(startLang.elements.starts);
        metadata.parts = [{ text: startElement, type: 'element', region: startRegion }];
        name = startElement;
        const remaining = Math.max(1, targetSyllables - countSyllables(name));
        for (let i = 0; i < remaining; i++) {
          const regionForSyllable = regionList[(i + 1) % regionList.length];
          const lang = linguisticData[regionForSyllable] || primaryLang;
          const pattern = weightedRandom(lang.patterns.map(p => p.type), lang.patterns.map(p => p.weight));
          const syllable = generateSyllable(lang, pattern, primaryTone);
          metadata.parts.push({ text: syllable, type: 'syllable', region: regionForSyllable, pattern: pattern });
          name += syllable;
        }
      }
    }
    // Pure syllable generation
    else {
      metadata.method = 'syllable';
      for (let i = 0; i < targetSyllables; i++) {
        // Rotate through regions - each syllable from a different region
        const regionForSyllable = regionList[i % regionList.length];
        const lang = linguisticData[regionForSyllable] || primaryLang;
        const pattern = weightedRandom(lang.patterns.map(p => p.type), lang.patterns.map(p => p.weight));
        const syllable = generateSyllable(lang, pattern, primaryTone);
        metadata.syllables.push({ text: syllable, pattern: pattern, region: regionForSyllable });
        name += syllable;
      }

      if (Math.random() < 0.25 && primaryLang.endings) {
        const ending = random(primaryLang.endings);
        const lastChar = name.slice(-1).toLowerCase();
        const endingFirstChar = ending.charAt(0).toLowerCase();
        const isLastCharVowel = /[aeiou]/.test(lastChar);
        const isEndingStartsVowel = /[aeiou]/.test(endingFirstChar);
        
        if (isLastCharVowel && !isEndingStartsVowel) {
          name = name + ending;
        } else if (!isLastCharVowel && isEndingStartsVowel) {
          name = name + ending;
        } else if (isLastCharVowel && isEndingStartsVowel) {
          name = name.slice(0, -1) + ending;
        } else {
          if (Math.random() < 0.5) {
            name = name + 'a' + ending;
          } else {
            name = name.slice(0, -1) + ending;
          }
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
    if (mustStartWith) {
      const prefix = mustStartWith.toLowerCase().slice(0, 3); // Limit to 3 chars max
      if (!name.toLowerCase().startsWith(prefix)) {
        // Replace the start of the name with the prefix, keeping natural flow
        const prefixEndsVowel = /[aeiou]$/.test(prefix);
        
        // Find where to splice in the rest of the name
        let splicePoint = 1;
        for (let i = 1; i < name.length; i++) {
          const isVowel = /[aeiou]/i.test(name[i]);
          if (prefixEndsVowel && !isVowel) {
            splicePoint = i;
            break;
          } else if (!prefixEndsVowel && isVowel) {
            splicePoint = i;
            break;
          }
          splicePoint = i + 1;
        }
        
        name = prefix + name.slice(splicePoint);
        
        // If result is too short or too long, skip this attempt
        if (name.length < 3 || name.length > 15) continue;
      }
    }
    if (mustNotContain && name.toLowerCase().includes(mustNotContain.toLowerCase())) continue;

    // Clean up consonant clusters based on region rules
    // Skip for type-element names since they use real English words
    const primaryRegion = regions.length > 0 ? regions[0] : 'neutral';
    if (!metadata.skipClusterCleanup) {
      const beforeCleanup = name;
      name = cleanConsonantClusters(name, primaryRegion);
      if (name !== beforeCleanup) {
        metadata.modifications.push('cluster-cleanup');
      }
    }

    // Validate name for the linguistic region (skip for time period names)
    if (!(periodMod && nameType === 'character')) {
      const regionsToCheck = regions.length > 0 ? regions : ['neutral'];
      const isValidForAnyRegion = regionsToCheck.some(r => validateName(name, r));
      if (!isValidForAnyRegion) continue;
    }

    break;
  }

  // Finalize - preserve titles with spaces
  if (name.includes(' ')) {
    const parts = name.split(' ');
    name = parts.map(p => capitalize(p.toLowerCase())).join(' ');
  } else {
    name = capitalize(name.toLowerCase());
  }

  // Orthographic features - 100% when enabled
  if (allowApostrophes && name.length > 4) {
    const vowelMatches = [...name.slice(2, -1).matchAll(/[aeiou]/gi)];
    if (vowelMatches.length > 0) {
      const match = vowelMatches[Math.floor(Math.random() * vowelMatches.length)];
      const pos = match.index + 2;
      name = name.slice(0, pos) + "'" + name.slice(pos);
      metadata.modifications.push('apostrophe');
    }
  }

  if (allowHyphens && name.length > 5) {
    let splitPos = -1;
    
    // If we have element data, try to split at element boundary
    if (metadata.elements?.start && metadata.elements?.end) {
      const startLen = metadata.elements.start.length;
      const nameLower = name.toLowerCase().replace(/[^a-z]/g, '');
      const startLower = metadata.elements.start.toLowerCase();
      if (nameLower.startsWith(startLower) && startLen >= 2 && startLen < name.length - 2) {
        splitPos = startLen;
      }
    }
    
    // Otherwise, find best natural break
    if (splitPos === -1) {
      const isVowel = (c) => /[aeiou]/i.test(c);
      const mid = Math.floor(name.length / 2);
      let bestScore = -999;
      
      for (let i = 2; i < name.length - 2; i++) {
        const before = name[i - 1];
        const after = name[i];
        let score = 0;
        
        if (isVowel(before) && !isVowel(after)) score += 10;
        else if (!isVowel(before) && isVowel(after)) score += 5;
        else if (isVowel(before) && isVowel(after)) score -= 5;
        else score -= 10;
        
        const distFromMid = Math.abs(i - mid);
        score -= distFromMid;
        
        const afterPart = name.slice(i).toLowerCase();
        if (/^[bcdfghjklmnpqrstvwxz]{2,}/.test(afterPart)) {
          score -= 20;
        }
        
        if (score > bestScore) {
          bestScore = score;
          splitPos = i;
        }
      }
      
      if (bestScore <= -5) {
        splitPos = -1;
      }
    }
    
    if (splitPos > 0) {
      const part1 = name.slice(0, splitPos);
      const part2 = name.slice(splitPos);
      name = capitalize(part1.toLowerCase()) + '-' + capitalize(part2.toLowerCase());
      metadata.modifications.push('hyphen');
    }
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
      metadata.modifications.push('accent');
    }
  }

  if (returnMetadata) {
    return { name, metadata };
  }
  return name;
};

// ============================================================================
// ANIMATED BACKGROUND
// ============================================================================

const AnimatedBackground = ({ theme }) => {
  const currentTheme = themeConfig[theme] || themeConfig.mixed;
  
  const backgroundImages = {
    fantasy: '/bg-fantasy.png',
    scifi: '/bg-scifi.png',
    mixed: '/bg-mixed.png'
  };

  const orbs = React.useMemo(() => 
    [...Array(6)].map((_, i) => ({
      width: 150 + (i * 50) % 200,
      height: 150 + (i * 50) % 200,
      left: `${(i * 17) % 100}%`,
      top: `${(i * 19) % 100}%`,
      color: currentTheme.orbs[i % 4]
    })), [currentTheme.orbs]
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.background}`} />
      
      {/* Pixel art background images */}
      {['fantasy', 'scifi', 'mixed'].map((t) => (
        <div
          key={t}
          className={`absolute inset-0 transition-opacity duration-1000 ${theme === t ? 'opacity-30 md:opacity-35' : 'opacity-0'}`}
          style={{ 
            backgroundImage: `url(${backgroundImages[t]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'auto'
          }}
        />
      ))}
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
      
      {/* Subtle floating orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10"
          style={{
            width: orb.width,
            height: orb.height,
            left: orb.left,
            top: orb.top,
            background: `radial-gradient(circle, ${orb.color}40 0%, transparent 70%)`,
            filter: 'blur(40px)'
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

const GlowButton = ({ children, onClick, disabled, variant = 'primary', className = '', theme = 'mixed' }) => {
  const currentTheme = themeConfig[theme] || themeConfig.mixed;
  
  const variants = {
    primary: `bg-gradient-to-r ${currentTheme.buttonGradient} hover:${currentTheme.buttonHover} shadow-lg ${currentTheme.buttonShadow}`,
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
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${currentTheme.buttonGradient} blur-lg opacity-30 transition-opacity pointer-events-none`} />
      )}
      <span className="relative flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

const Tooltip = ({ content, children }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0, strategy: 'side' });
  const triggerRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const updatePosition = () => {
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
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      updatePosition();
      setShow(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShow(false);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isMobile) {
      updatePosition();
      setShow(prev => !prev);
    }
  };

  // Close on outside click for mobile
  useEffect(() => {
    if (isMobile && show) {
      const handleOutsideClick = () => setShow(false);
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [isMobile, show]);

  return (
    <>
      <div 
        ref={triggerRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave} 
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

const SectionHeader = ({ title, helpText, icon: Icon, isLocked, onToggleLock, lockKey }) => (
  <div className="flex items-center gap-2 mb-3">
    {Icon && <Icon className="w-4 h-4 text-indigo-400" />}
    <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">{title}</h3>
    {helpText && (
      <Tooltip content={helpText}>
        <HelpCircle className="w-4 h-4 text-slate-500 hover:text-indigo-400 transition-colors" />
      </Tooltip>
    )}
    {onToggleLock && (
      <button 
        onClick={() => onToggleLock(lockKey)}
        className={`ml-auto p-1 rounded transition-all ${isLocked ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
        title={isLocked ? 'Unlock (will change on Surprise Me)' : 'Lock (won\'t change on Surprise Me)'}
      >
        {isLocked ? (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        )}
      </button>
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

const SkeletonCard = () => (
  <div className="relative p-4 bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded bg-slate-700/50 animate-pulse" />
        <div className="w-5 h-5 rounded bg-slate-700/50 animate-pulse" />
        <div className="w-5 h-5 rounded bg-slate-700/50 animate-pulse" />
        <div className="flex flex-col gap-1">
          <div className="h-6 w-32 rounded bg-slate-700/50 animate-pulse" />
        </div>
      </div>
      <div className="h-8 w-20 rounded-lg bg-slate-700/50 animate-pulse" />
    </div>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-700/10 to-transparent" />
  </div>
);

const TweakPopover = ({ name, metadata, onTweak, isOpen, setIsOpen }) => {
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  // Update position
  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 280;
      const popoverHeight = 220;
      
      // Position above the button, aligned to the right
      let left = rect.right - popoverWidth;
      let top = rect.top - popoverHeight - 8;
      
      // If too far left, align to left edge of button
      if (left < 16) {
        left = rect.left;
      }
      
      // If too high, show below instead
      if (top < 16) {
        top = rect.bottom + 8;
      }
      
      // Keep within viewport
      const maxLeft = window.innerWidth - popoverWidth - 16;
      if (left > maxLeft) left = maxLeft;
      
      setCoords({ left, top });
    }
  }, []);

  // Update position on scroll, close on outside click
  useEffect(() => {
    if (isOpen) {
      const handleOutsideClick = (e) => {
        if (triggerRef.current && triggerRef.current.contains(e.target)) return;
        if (popoverRef.current && popoverRef.current.contains(e.target)) return;
        setIsOpen(false);
        setSelectedIndices(new Set());
      };
      const handleScroll = () => {
        updatePosition();
      };
      document.addEventListener('mousedown', handleOutsideClick);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  const handleOpen = () => {
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setSelectedIndices(new Set());
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedIndices(new Set());
  };

  // Update position when opened or when name changes
  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, name, updatePosition]);

  // Parse the name into tweakable parts - updates when name/metadata changes
  const getParts = useCallback(() => {
    // Check if name has spaces (for spaced/title style)
    const hasSpaces = name.includes(' ');
    
    if (hasSpaces) {
      // Split by spaces and treat each word as a part
      const words = name.split(' ').filter(w => w.length > 0);
      return words.map((word, i) => ({
        id: `word-${i}`,
        text: word,
        type: 'word',
        region: metadata?.selectedRegion || 'neutral',
        isTitle: word.toLowerCase() === 'the'
      }));
    } else if (metadata?.method === 'syllable' && metadata.syllables?.length > 0) {
      return metadata.syllables.map((s, i) => ({
        id: `syl-${i}`,
        text: s.text,
        type: 'syllable',
        region: s.region
      }));
    } else if (metadata?.method === 'elements' && metadata.elements?.start) {
      return [
        { id: 'el-start', text: metadata.elements.start, type: 'element', region: metadata.elements.startRegion },
        { id: 'el-end', text: metadata.elements.end, type: 'element', region: metadata.elements.endRegion }
      ];
    } else if (metadata?.method === 'mixed' && metadata.parts?.length > 0) {
      return metadata.parts.map((p, i) => ({
        id: `mix-${i}`,
        text: p.text,
        type: p.type,
        region: p.region
      }));
    } else if (metadata?.method === 'type-elements' && metadata.elements?.start) {
      return [
        { id: 'type-start', text: metadata.elements.start, type: 'type-prefix', region: metadata?.selectedRegion },
        { id: 'type-end', text: metadata.elements.end, type: 'type-suffix', region: metadata?.selectedRegion }
      ];
    } else {
      // Fallback: break into syllables manually
      const syllables = breakIntoSyllables(name);
      return syllables.map((s, i) => ({
        id: `auto-${i}`,
        text: s,
        type: 'syllable',
        region: metadata?.selectedRegion || 'neutral'
      }));
    }
  }, [name, metadata]);

  const parts = getParts();

  const togglePart = (index) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIndices.size === parts.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(parts.map((_, i) => i)));
    }
  };

  const handleTweak = () => {
    const partsToChange = selectedIndices.size === 0 
      ? parts.map(p => p.id) // If none selected, tweak all
      : Array.from(selectedIndices).map(i => parts[i]?.id).filter(Boolean);
    onTweak(partsToChange, parts);
    // Keep popover open AND keep selection so user can keep tweaking the same parts
    // Selection indices are preserved - they'll map to the new parts at the same positions
  };

  return (
    <>
      <button 
        ref={triggerRef}
        onClick={handleOpen} 
        className={`p-1 transition-all duration-200 ${isOpen ? 'text-purple-400 scale-110' : 'text-slate-600 hover:text-purple-400 hover:scale-110'}`}
        title="Tweak this name"
      >
        <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      
      {isOpen && createPortal(
        <div 
          ref={popoverRef}
          className="fixed bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-3 min-w-[280px] animate-in fade-in zoom-in-95 duration-150"
          style={{ 
            left: coords.left, 
            top: coords.top,
            zIndex: 99999 
          }}
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-500 font-medium">Click parts to tweak:</div>
            <button 
              onClick={handleClose}
              className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Current name preview */}
          <div className="text-center mb-2 py-1.5 px-2 bg-slate-800/30 rounded-lg">
            <span className="text-sm font-semibold text-slate-200">{name}</span>
          </div>
          
          {/* Name parts */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
            {parts.map((part, i) => (
              <React.Fragment key={`part-${i}`}>
                <button
                  onClick={() => togglePart(i)}
                  className={`px-2.5 py-1.5 rounded-lg font-mono text-sm transition-all ${
                    selectedIndices.has(i)
                      ? 'bg-purple-500/30 border-purple-500/50 text-purple-300 border shadow-lg shadow-purple-500/10'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-300 border hover:border-purple-500/30 hover:text-purple-300'
                  }`}
                >
                  {part.text}
                </button>
                {i < parts.length - 1 && (
                  <span className="text-slate-600 text-xs">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="flex-1 px-2 py-1.5 text-xs rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-300 hover:border-slate-600 transition-colors"
            >
              {selectedIndices.size === parts.length ? 'Deselect All' : 'Select All'}
            </button>
            <button
              onClick={handleTweak}
              className="flex-1 px-2 py-1.5 text-xs rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 transition-colors font-medium"
            >
              <span className="flex items-center justify-center gap-1">
                <RefreshCw className="w-3 h-3" />
                Tweak {selectedIndices.size === 0 ? 'All' : `(${selectedIndices.size})`}
              </span>
            </button>
          </div>
          
          {/* Hint */}
          <div className="text-[10px] text-slate-600 mt-2 text-center">
            {selectedIndices.size === 0 ? 'No selection = tweak entire name' : `${selectedIndices.size} part${selectedIndices.size > 1 ? 's' : ''} selected`}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

const NameCard = ({ name, syllables, isFavorite, onCopy, onFavorite, copied, isSelectedForRefine, onRefineSelect, metadata, onRerollSiblings }) => {
  const [showStats, setShowStats] = useState(false);
  const [statsCopied, setStatsCopied] = useState(false);
  const [tweakPopoverOpen, setTweakPopoverOpen] = useState(false);
  
  const copyStats = () => {
    if (!metadata) return;
    const letterCount = name.replace(/[^a-zA-Z]/g, '').length;
    const vowelCount = (name.toLowerCase().match(/[aeiou]/g) || []).length;
    const stats = [
      `=== AetherNames Bug Report ===`,
      `Name: ${name}`,
      ``,
      `--- Settings ---`,
      `Language: ${metadata.selectedRegion}`,
      metadata.allRegions?.length > 1 ? `Region Pool: ${metadata.allRegions.join(', ')}` : null,
      metadata.tones?.length > 0 ? `Tone: ${metadata.tones.join(', ')}` : null,
      metadata.timePeriod !== 'any' ? `Era: ${metadata.timePeriod}` : null,
      ``,
      `--- Construction ---`,
      `Method: ${metadata.method || 'mixed'}`,
      metadata.elements?.start ? `Word parts: "${metadata.elements.start}" (${metadata.elements.startRegion || 'unknown'}) + "${metadata.elements.end}" (${metadata.elements.endRegion || 'unknown'})` : null,
      metadata.syllables?.length > 0 ? `Syllables: ${metadata.syllables.map(s => `"${s.text}" (${s.region || 'neutral'})`).join(' + ')}` : null,
      metadata.parts?.length > 0 ? `Parts: ${metadata.parts.map(p => `"${p.text}" (${p.region}, ${p.type})`).join(' + ')}` : null,
      ``,
      `--- Post-processing ---`,
      metadata.modifications?.length > 0 ? `Styling applied: ${metadata.modifications.join(', ')}` : 'Styling applied: none',
      ``,
      `--- Analysis ---`,
      `Syllable count: ${syllables}`,
      `Letter count: ${letterCount}`,
      `Vowel ratio: ${Math.round(vowelCount / letterCount * 100)}%`,
      `Gender lean: ${classifyGender(name)}`,
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(stats).then(() => {
      setStatsCopied(true);
      setTimeout(() => setStatsCopied(false), 1500);
    });
  };

  const speakName = () => {
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`group relative p-3 md:p-4 bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border rounded-xl hover:shadow-lg transition-all duration-300 overflow-visible ${isSelectedForRefine ? 'border-teal-500/50 shadow-teal-500/10' : 'border-slate-700/50 hover:border-indigo-500/30 hover:shadow-indigo-500/5'}`}>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={onFavorite} className={`p-1 transition-all duration-200 ${isFavorite ? 'text-yellow-400 scale-110' : 'text-slate-600 hover:text-yellow-400 hover:scale-110'}`}>
              <Star className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button onClick={onRefineSelect} className={`p-1 transition-all duration-200 ${isSelectedForRefine ? 'text-teal-400 scale-110' : 'text-slate-600 hover:text-teal-400 hover:scale-110'}`}>
              <FlaskConical className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button onClick={speakName} className="p-1 text-slate-600 hover:text-cyan-400 hover:scale-110 transition-all duration-200">
              <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button onClick={() => setShowStats(!showStats)} className={`p-1 transition-all duration-200 ${showStats ? 'text-amber-400 scale-110' : 'text-slate-600 hover:text-amber-400 hover:scale-110'}`}>
              <Glasses className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            {onRerollSiblings && (
              <TweakPopover 
                name={name} 
                metadata={metadata} 
                onTweak={onRerollSiblings} 
                isOpen={tweakPopoverOpen}
                setIsOpen={setTweakPopoverOpen}
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-base md:text-xl font-semibold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent break-all">{name}</span>
            <span className="ml-1 md:ml-2 text-[10px] md:text-xs text-slate-500 font-mono">({syllables})</span>
          </div>
        </div>
        <button onClick={onCopy} className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}`}>
          {copied ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      {/* Stats for Nerds Panel */}
      {showStats && metadata && (
        <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs space-y-3">
          {/* Section 1: What settings were used */}
          <div className="bg-slate-800/30 rounded-lg p-2">
            <div className="text-slate-500 font-semibold mb-1.5">⚙️ Settings Used</div>
            <div className="grid grid-cols-2 gap-1 text-slate-400">
              <div>Regions: <span className="text-indigo-300">{metadata.allRegions?.join(', ') || metadata.selectedRegion}</span></div>
              {metadata.tones?.length > 0 && (
                <div>Tone: <span className="text-pink-300">{metadata.tones.join(', ')}</span></div>
              )}
              {metadata.timePeriod !== 'any' && (
                <div>Era: <span className="text-emerald-300">{metadata.timePeriod}</span></div>
              )}
            </div>
          </div>

          {/* Section 2: How it was built */}
          <div className="bg-slate-800/30 rounded-lg p-2">
            <div className="text-slate-500 font-semibold mb-1.5">🔨 How It Was Built</div>
            <div className="text-slate-400 space-y-2">
              {metadata.method === 'elements' && metadata.elements?.start ? (
                <div>
                  <div className="text-slate-500 text-[10px] mb-1">Combined word elements:</div>
                  <div className="flex flex-wrap items-start gap-2">
                    <div className="flex flex-col items-center">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded font-mono">{metadata.elements.start}</span>
                      <span className="text-[9px] text-amber-500/70">{metadata.elements.startRegion || 'element'}</span>
                    </div>
                    <span className="text-slate-600 self-center">+</span>
                    <div className="flex flex-col items-center">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded font-mono">{metadata.elements.end}</span>
                      <span className="text-[9px] text-amber-500/70">{metadata.elements.endRegion || 'element'}</span>
                    </div>
                    <span className="text-slate-600 self-center">=</span>
                    <span className="text-white font-mono self-center">{name.replace(/[^a-zA-Z]/g, '')}</span>
                  </div>
                </div>
              ) : metadata.method === 'syllable' && metadata.syllables?.length > 0 ? (
                <div>
                  <div className="text-slate-500 text-[10px] mb-1">Generated from syllable patterns:</div>
                  <div className="flex flex-wrap items-start gap-2">
                    {metadata.syllables.map((s, i) => (
                      <React.Fragment key={i}>
                        <div className="flex flex-col items-center">
                          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded font-mono">{s.text}</span>
                          <span className="text-[9px] text-cyan-500/70">{s.region || 'neutral'}</span>
                        </div>
                        {i < metadata.syllables.length - 1 && <span className="text-slate-600 self-center">+</span>}
                      </React.Fragment>
                    ))}
                    <span className="text-slate-600 self-center">=</span>
                    <span className="text-white font-mono self-center">{metadata.syllables.map(s => s.text).join('')}</span>
                  </div>
                </div>
              ) : metadata.method === 'mixed' && metadata.parts?.length > 0 ? (
                <div>
                  <div className="text-slate-500 text-[10px] mb-1">Mixed element + syllables:</div>
                  <div className="flex flex-wrap items-start gap-2">
                    {metadata.parts.map((p, i) => (
                      <React.Fragment key={i}>
                        <div className="flex flex-col items-center">
                          <span className={`px-2 py-1 rounded font-mono ${p.type === 'element' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'}`}>{p.text}</span>
                          <span className={`text-[9px] ${p.type === 'element' ? 'text-amber-500/70' : 'text-cyan-500/70'}`}>{p.region}</span>
                        </div>
                        {i < metadata.parts.length - 1 && <span className="text-slate-600 self-center">+</span>}
                      </React.Fragment>
                    ))}
                    <span className="text-slate-600 self-center">=</span>
                    <span className="text-white font-mono self-center">{metadata.parts.map(p => p.text).join('')}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-slate-500 text-[10px] mb-1">Construction details unavailable</div>
                  <span className="text-white font-mono">{name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Post-processing */}
          {metadata.modifications?.length > 0 && (
            <div className="bg-slate-800/30 rounded-lg p-2">
              <div className="text-slate-500 font-semibold mb-1.5">✨ Styling Applied</div>
              <div className="text-slate-400 space-y-1">
                {metadata.modifications.map((mod, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-orange-400">•</span>
                    <span>
                      {mod === 'hyphen' && 'Added hyphen between parts'}
                      {mod === 'apostrophe' && 'Added apostrophe for exotic feel'}
                      {mod === 'accent' && 'Added accent mark on vowel'}
                      {mod === 'cluster-cleanup' && 'Simplified consonant cluster'}
                      {!['hyphen', 'apostrophe', 'accent', 'cluster-cleanup'].includes(mod) && mod}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Analysis */}
          <div className="bg-slate-800/30 rounded-lg p-2">
            <div className="text-slate-500 font-semibold mb-1.5">📊 Name Analysis</div>
            <div className="grid grid-cols-2 gap-1 text-slate-400">
              <div>Syllables: <span className="text-green-300">{syllables}</span></div>
              <div>Letters: <span className="text-green-300">{name.replace(/[^a-zA-Z]/g, '').length}</span></div>
              <div>Vowel %: <span className="text-green-300">{Math.round((name.toLowerCase().match(/[aeiou]/g) || []).length / name.replace(/[^a-zA-Z]/g, '').length * 100)}%</span></div>
              <div>Gender lean: <span className={`${classifyGender(name) === 'feminine' ? 'text-pink-300' : classifyGender(name) === 'masculine' ? 'text-blue-300' : 'text-slate-300'}`}>{classifyGender(name)}</span></div>
            </div>
          </div>

          {/* Copy button */}
          <button
            type="button"
            onClick={copyStats}
            className={`w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-[11px] transition-colors cursor-pointer ${statsCopied ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-300'}`}
          >
            {statsCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {statsCopied ? 'Copied!' : '📋 Copy Stats for Bug Report'}
          </button>
        </div>
      )}
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
    genderLean: 'any',
    nameStyle: 'default', // default, compound, spaced, title
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
  const [nameHistory, setNameHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lockedSettings, setLockedSettings] = useState({
    nameType: false,
    genre: false,
    timePeriod: false,
    genderLean: false,
    tones: false,
    regions: false,
    structure: false,
    style: false,
    filters: false,
    output: false
  });
  const [favorites, setFavorites] = useState([]);
  const [copiedName, setCopiedName] = useState(null);
  const [refineSelections, setRefineSelections] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const resultsRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);

  useEffect(() => { setAnimateHeader(true); }, []);

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));
  const toggleLock = (key) => setLockedSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleArray = (key, value) => {
    setConfig(prev => {
      const current = prev[key];
      if (current.includes(value)) {
        // Always allow removal
        return { ...prev, [key]: current.filter(v => v !== value) };
      } else {
        // For regions, limit to 4 max
        if (key === 'regions' && current.length >= 4) {
          return prev; // Don't add more
        }
        return { ...prev, [key]: [...current, value] };
      }
    });
  };

  const generate = useCallback(() => {
    setIsGenerating(true);
    setGeneratedNames([]); // Clear old names immediately
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    setTimeout(() => {
      const names = [];
      let attempts = 0;
      while (names.length < config.nameCount && attempts < config.nameCount * 100) {
        attempts++;
        const result = generateName(config, true);
        const name = result.name;
        const metadata = result.metadata;
        if (!names.some(n => n.name.toLowerCase() === name.toLowerCase()) && name.length >= 3 && name.length <= 20) {
          const gender = classifyGender(name);
          if (config.genderLean === 'any' || gender === config.genderLean || gender === 'neutral') {
            names.push({ id: Date.now() + Math.random(), name, syllables: countSyllables(name), gender, metadata });
          }
        }
      }
      // Save to history before updating
      setNameHistory(prev => {
        const newHistory = [...prev.slice(0, historyIndex + 1), names];
        // Keep only last 10 generations
        return newHistory.slice(-10);
      });
      setHistoryIndex(prev => Math.min(prev + 1, 9));
      
      setGeneratedNames(names);
      setIsGenerating(false);
    }, 100);
  }, [config, historyIndex]);

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to generate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isGenerating) {
          generate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generate, isGenerating]);

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
    setFavorites(prev => {
      if (prev.some(f => f.name === nameObj.name)) {
        return prev.filter(f => f.name !== nameObj.name);
      } else {
        return [...prev, { ...nameObj, id: Date.now() + Math.random() }];
      }
    });
  };

  const clearFavorites = () => setFavorites([]);

  const isFavorite = (name) => favorites.some(f => f.name === name);

  const exportFavorites = () => {
    const blob = new Blob([favorites.map(f => f.name).join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'aethernames.txt';
    a.click();
  };

  const toggleRefineSelection = (nameObj) => {
    setRefineSelections(prev => {
      if (prev.some(n => n.name === nameObj.name)) {
        return prev.filter(n => n.name !== nameObj.name);
      } else if (prev.length < 4) {
        return [...prev, nameObj];
      }
      return prev;
    });
  };

  const isSelectedForRefine = (name) => refineSelections.some(n => n.name === name);

  const generateRefined = useCallback(() => {
    if (refineSelections.length === 0) return;
    
    // Add refine selections to favorites before generating
    setFavorites(prev => {
      const newFavs = [...prev];
      refineSelections.forEach(sel => {
        if (!newFavs.some(f => f.name === sel.name)) {
          newFavs.push({ ...sel, id: Date.now() + Math.random() });
        }
      });
      return newFavs;
    });
    
    setIsGenerating(true);
    setTimeout(() => {
      const patterns = analyzePatterns(refineSelections);
      const names = [];
      let attempts = 0;
      
      while (names.length < config.nameCount && attempts < config.nameCount * 50) {
        attempts++;
        const name = generateRefinedName(config, patterns);
        if (!names.some(n => n.name.toLowerCase() === name.toLowerCase()) && 
            !refineSelections.some(n => n.name.toLowerCase() === name.toLowerCase()) &&
            name.length >= 3 && name.length <= 20) {
          const gender = classifyGender(name);
          if (config.genderLean === 'any' || gender === config.genderLean || gender === 'neutral') {
            names.push({ id: Date.now() + Math.random(), name, syllables: countSyllables(name), gender });
          }
        }
      }
      
      setGeneratedNames(names);
      setIsGenerating(false);
    }, 100);
  }, [config, refineSelections]);

  const clearRefineSelections = () => setRefineSelections([]);

  // History navigation
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < nameHistory.length - 1;

  const undo = () => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGeneratedNames(nameHistory[newIndex]);
    }
  };

  const redo = () => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGeneratedNames(nameHistory[newIndex]);
    }
  };

  // TWEAK NAME - Generate a variation based on which parts user selected
  const tweakName = useCallback((nameObj, nameIndex, selectedPartIds, allParts) => {
    if (!nameObj.metadata) return;
    
    const metadata = nameObj.metadata;
    const regions = metadata.allRegions || [metadata.selectedRegion];
    const primaryRegion = regions[0];
    const lang = linguisticData[primaryRegion] || linguisticData.neutral;
    const tone = metadata.tones?.[0] ? toneModifiers[metadata.tones[0]] : null;
    
    // If called with part selection info, use targeted tweaking
    if (selectedPartIds && allParts) {
      const partsToChange = new Set(selectedPartIds);
      const newParts = allParts.map(part => {
        if (!partsToChange.has(part.id)) {
          return part; // Keep unchanged
        }
        
        // Generate a new part based on type
        const partRegion = part.region || primaryRegion;
        const partLang = linguisticData[partRegion] || lang;
        
        if (part.isTitle) {
          // Don't change "The"
          return part;
        }
        
        if (part.type === 'type-prefix') {
          // Use type-specific prefixes
          const nameType = metadata.nameType || 'location';
          const typeElems = nameTypeElements[nameType] || nameTypeElements.location;
          if (typeElems.prefixes?.length > 0) {
            const newText = random(typeElems.prefixes.filter(p => p !== part.text));
            return { ...part, text: newText || random(typeElems.prefixes) };
          }
        }
        
        if (part.type === 'type-suffix') {
          // Use type-specific suffixes
          const nameType = metadata.nameType || 'location';
          const typeElems = nameTypeElements[nameType] || nameTypeElements.location;
          if (typeElems.suffixes?.length > 0) {
            const newText = random(typeElems.suffixes.filter(s => s !== part.text));
            return { ...part, text: newText || random(typeElems.suffixes) };
          }
        }
        
        if (part.type === 'word') {
          // For word parts (from spaced names), use type elements if available
          const nameType = metadata.nameType || 'location';
          const typeElems = nameTypeElements[nameType] || nameTypeElements.location;
          const isFirst = allParts.indexOf(part) === 0 || (allParts[0]?.isTitle && allParts.indexOf(part) === 1);
          
          if (isFirst && typeElems.prefixes?.length > 0) {
            const newText = random(typeElems.prefixes.filter(p => p.toLowerCase() !== part.text.toLowerCase()));
            return { ...part, text: newText || random(typeElems.prefixes) };
          } else if (typeElems.suffixes?.length > 0) {
            const newText = random(typeElems.suffixes.filter(s => s.toLowerCase() !== part.text.toLowerCase()));
            return { ...part, text: newText || random(typeElems.suffixes) };
          }
        }
        
        if (part.type === 'element') {
          // Determine if it's a start or end element
          const isStart = part.id.includes('start') || allParts.indexOf(part) === 0;
          if (isStart && partLang.elements?.starts) {
            const newText = random(partLang.elements.starts.filter(s => s !== part.text));
            return { ...part, text: newText || random(partLang.elements.starts) };
          } else if (partLang.elements?.ends) {
            const newText = random(partLang.elements.ends.filter(e => e !== part.text));
            return { ...part, text: newText || random(partLang.elements.ends) };
          }
        }
        
        // For syllables or fallback
        const pattern = weightedRandom(partLang.patterns.map(p => p.type), partLang.patterns.map(p => p.weight));
        const newSyllable = generateSyllable(partLang, pattern, tone);
        return { ...part, text: newSyllable };
      });
      
      // Build the new name
      let newName;
      const hasWordParts = newParts.some(p => p.type === 'word');
      const hasTypeParts = newParts.some(p => p.type === 'type-prefix' || p.type === 'type-suffix');
      
      if (hasWordParts) {
        // Join with spaces, preserve "The" at the start
        newName = newParts.map((p, i) => {
          if (p.isTitle) return p.text; // Keep "The" as-is
          return capitalize(p.text.toLowerCase());
        }).join(' ');
      } else if (hasTypeParts) {
        // Type-element names: check original name style
        const originalName = nameObj.name;
        const hadSpaces = originalName.includes(' ');
        const hadThe = originalName.toLowerCase().startsWith('the ');
        
        if (hadThe) {
          newName = 'The ' + capitalize(newParts[0].text) + ' ' + capitalize(newParts[1]?.text || '');
        } else if (hadSpaces) {
          newName = newParts.map(p => capitalize(p.text)).join(' ');
        } else {
          // Compound style - join directly
          newName = capitalize(newParts[0].text) + newParts[1]?.text.toLowerCase();
        }
      } else {
        newName = newParts.map(p => p.text).join('');
        newName = cleanConsonantClusters(newName, primaryRegion);
        newName = capitalize(newName.toLowerCase());
      }
      
      // Build new metadata
      const newMetadata = { ...metadata, modifications: [] };
      if (metadata.method === 'syllable') {
        newMetadata.syllables = newParts.map(p => ({ text: p.text, pattern: p.pattern, region: p.region }));
      } else if (metadata.method === 'elements') {
        newMetadata.elements = {
          start: newParts[0]?.text,
          startRegion: newParts[0]?.region,
          end: newParts[1]?.text,
          endRegion: newParts[1]?.region
        };
      } else if (metadata.method === 'mixed') {
        newMetadata.parts = newParts.map(p => ({ text: p.text, type: p.type, region: p.region }));
      } else if (metadata.method === 'type-elements') {
        newMetadata.elements = {
          start: newParts[0]?.text,
          end: newParts[1]?.text
        };
      }
      
      const tweakedName = {
        id: nameObj.id,
        name: newName,
        syllables: countSyllables(newName),
        gender: classifyGender(newName),
        metadata: newMetadata
      };
      
      setGeneratedNames(prev => {
        const newList = [...prev];
        newList[nameIndex] = tweakedName;
        return newList;
      });
      return;
    }
    
    // Fallback: old behavior for full name tweak
    const originalName = nameObj.name.toLowerCase().replace(/[^a-z]/g, '');
    let newName = '';
    let newMetadata = { ...metadata, modifications: [] };
    let attempts = 0;
    
    while (attempts < 50) {
      attempts++;
      newName = '';
      
      const tweakType = Math.random();
      
      if (tweakType < 0.3 && metadata.syllables?.length > 0) {
        // Replace random syllables
        const syllables = metadata.syllables.map(s => {
          if (Math.random() < 0.5) {
            const regionForNew = s.region || primaryRegion;
            const newLang = linguisticData[regionForNew] || lang;
            const pattern = weightedRandom(newLang.patterns.map(p => p.type), newLang.patterns.map(p => p.weight));
            return { ...s, text: generateSyllable(newLang, pattern, tone) };
          }
          return s;
        });
        newName = syllables.map(s => s.text).join('');
        newMetadata.method = 'syllable';
        newMetadata.syllables = syllables;
        
      } else if (tweakType < 0.5 && metadata.elements?.start) {
        const keepStart = Math.random() < 0.5;
        if (keepStart) {
          const endLang = linguisticData[metadata.elements.endRegion] || lang;
          const newEnd = random(endLang.elements?.ends || lang.endings);
          newName = metadata.elements.start + newEnd;
          newMetadata.elements = { ...metadata.elements, end: newEnd };
        } else {
          const startLang = linguisticData[metadata.elements.startRegion] || lang;
          const newStart = random(startLang.elements?.starts || ['Ar', 'El', 'Or']);
          newName = newStart + metadata.elements.end;
          newMetadata.elements = { ...metadata.elements, start: newStart };
        }
        newMetadata.method = 'elements';
        
      } else {
        // Change ending or vowels
        const chars = originalName.split('');
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const vowelIndices = chars.map((c, i) => vowels.includes(c) ? i : -1).filter(i => i > 0 && i < chars.length - 1);
        
        if (vowelIndices.length > 0) {
          const idx = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
          const otherVowels = vowels.filter(v => v !== chars[idx]);
          chars[idx] = otherVowels[Math.floor(Math.random() * otherVowels.length)];
        }
        
        // Also maybe change ending
        if (Math.random() < 0.5) {
          const endings = lang.endings || ['a', 'an', 'en', 'or', 'ia'];
          const newEnding = random(endings);
          const chopAmount = Math.min(2, Math.floor(chars.length / 3));
          newName = chars.slice(0, -chopAmount).join('') + newEnding;
        } else {
          newName = chars.join('');
        }
        newMetadata.method = metadata.method;
      }
      
      newName = cleanConsonantClusters(newName, primaryRegion);
      newName = capitalize(newName.toLowerCase());
      
      if (newName.length >= 3 && newName.length <= 15 && newName.toLowerCase() !== nameObj.name.toLowerCase()) {
        break;
      }
    }
    
    if (newName.toLowerCase() === nameObj.name.toLowerCase() || newName.length < 3) {
      const endings = lang.endings || ['a', 'an', 'en', 'or', 'ia'];
      newName = capitalize(originalName.slice(0, -1) + random(endings));
    }
    
    const tweakedName = {
      id: nameObj.id,
      name: newName,
      syllables: countSyllables(newName),
      gender: classifyGender(newName),
      metadata: newMetadata
    };
    
    setGeneratedNames(prev => {
      const newList = [...prev];
      newList[nameIndex] = tweakedName;
      return newList;
    });
  }, []);

  // SURPRISE ME - Random config and generate (respects locked settings)
  const surpriseMe = () => {
    const randomRegions = [...regions].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1).map(r => r.value);
    const randomTones = [...tones].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1).map(t => t.value);
    const randomGenre = genres[Math.floor(Math.random() * genres.length)].value;
    const randomType = nameTypes[Math.floor(Math.random() * nameTypes.length)].value;
    const randomTimePeriod = timePeriods[Math.floor(Math.random() * timePeriods.length)].value;
    const randomGender = ['any', 'feminine', 'masculine', 'neutral'][Math.floor(Math.random() * 4)];
    const randomStructure = [{ min: 1, max: 2 }, { min: 2, max: 3 }, { min: 3, max: 4 }][Math.floor(Math.random() * 3)];
    
    setConfig(prev => ({
      ...prev,
      genre: lockedSettings.genre ? prev.genre : randomGenre,
      nameType: lockedSettings.nameType ? prev.nameType : randomType,
      regions: lockedSettings.regions ? prev.regions : randomRegions,
      tones: lockedSettings.tones ? prev.tones : randomTones,
      timePeriod: lockedSettings.timePeriod ? prev.timePeriod : randomTimePeriod,
      genderLean: lockedSettings.genderLean ? prev.genderLean : randomGender,
      minSyllables: lockedSettings.structure ? prev.minSyllables : randomStructure.min,
      maxSyllables: lockedSettings.structure ? prev.maxSyllables : randomStructure.max
    }));
    
    // Generate after state updates
    setTimeout(() => generate(), 100);
  };

  // DONATE FUNCTION - Your Ko-fi link
  const openDonation = () => {
    window.open('https://ko-fi.com/aethernames', '_blank');
  };

  const helpTexts = {
    nameType: "What you're naming. Each type uses different construction patterns and suffixes.",
    genre: "Overall aesthetic. Fantasy = melodic and archaic. Sci-Fi = technical and sharp.",
    tone: "Emotional flavor through sound. Heroic uses resonant sounds. Dark uses harsh gutturals. Select multiple to blend.",
    region: "Linguistic rules from real languages. Each follows authentic phonotactics.",
    timePeriod: "Historical era influences name style. Ancient uses archaic patterns, Futuristic uses tech-inspired sounds.",
    structure: "Target syllable count. Actual may vary ±1.",
    orthographic: "Visual styling. Apostrophes and accents add exotic flair.",
    filters: "'Starts with' (1-3 chars) sets the beginning. 'Excludes' removes names with unwanted sounds. 'Seed' subtly influences the generated sounds.",
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

  const currentTheme = themeConfig[config.genre] || themeConfig.mixed;

  return (
    <div className="min-h-screen text-slate-100 relative" style={{ fontFamily: currentTheme.font }}>
      <AnimatedBackground theme={config.genre} />
      
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 pb-32">
        {/* Header */}
        <header className={`text-center py-8 mb-8 transition-all duration-1000 ${animateHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0">
              {/* Soft glow effect */}
              <div className="absolute inset-0 blur-2xl bg-purple-500/30 rounded-full scale-150 pointer-events-none" />
              
              {/* Animated twinkles - scattered around logo */}
              <div className="absolute inset-0 overflow-visible pointer-events-none">
                {[
                  { top: '-10%', left: '20%', size: 3, color: '#a855f7', duration: 3, delay: 0 },
                  { top: '5%', left: '85%', size: 2, color: '#22d3ee', duration: 4, delay: 0.5 },
                  { top: '30%', left: '-5%', size: 2.5, color: '#6366f1', duration: 3.5, delay: 1 },
                  { top: '70%', left: '0%', size: 2, color: '#f472b6', duration: 4.5, delay: 0.3 },
                  { top: '85%', left: '30%', size: 3, color: '#818cf8', duration: 3, delay: 0.8 },
                  { top: '90%', left: '75%', size: 2, color: '#2dd4bf', duration: 4, delay: 1.2 },
                  { top: '50%', left: '95%', size: 2.5, color: '#c084fc', duration: 3.5, delay: 0.6 },
                  { top: '15%', left: '50%', size: 2, color: '#67e8f9', duration: 5, delay: 1.5 },
                ].map((star, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-twinkle"
                    style={{
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      background: star.color,
                      top: star.top,
                      left: star.left,
                      animationDuration: `${star.duration}s`,
                      animationDelay: `${star.delay}s`,
                      boxShadow: `0 0 ${star.size * 3}px ${star.size}px ${star.color}40`
                    }}
                  />
                ))}
              </div>
              
              {/* Logo */}
              <img 
                src="/logo.png" 
                alt="AetherNames Logo" 
                className="absolute inset-0 w-full h-full drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              AetherNames
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

          <div className="flex flex-wrap justify-center gap-3">
            <GlowButton onClick={generate} disabled={isGenerating} className="px-8" theme={config.genre}>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Forging...' : 'Generate Names'}
                </span>
                <span className="text-[10px] opacity-60 font-normal mt-0.5">Ctrl+Enter</span>
              </div>
            </GlowButton>
            <GlowButton variant="secondary" onClick={surpriseMe} className="px-6" theme={config.genre}>
              <Zap className="w-5 h-5" />
              Surprise Me
            </GlowButton>
            <GlowButton variant="donate" onClick={openDonation} className="px-8" theme={config.genre}>
              <Heart className="w-5 h-5" />
              Support the Creator
            </GlowButton>
          </div>

          {/* Quick Guide Dropdown */}
          <div className="mt-6 max-w-2xl mx-auto">
            <details className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="font-semibold text-indigo-400 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" /> Quick Guide
                </span>
                <ChevronDown className="w-5 h-5 text-indigo-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-400 space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Getting Started</h4>
                  <p>Choose your settings on the left panel, then click "Generate Names". Each name is built using real linguistic rules from the regions you select.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Key Settings</h4>
                  <ul className="space-y-1 ml-4">
                    <li><span className="text-teal-400">Linguistic Influence</span> — The language family that shapes how your names sound. Select up to 4 for blended results.</li>
                    <li><span className="text-purple-400">Tone</span> — Adds emotional flavor. "Dark" uses harsh sounds, "Noble" uses elegant flowing sounds.</li>
                    <li><span className="text-emerald-400">Time Period</span> — Adds era-appropriate prefixes/suffixes. Medieval adds titles like "Ser" and "Lord".</li>
                    <li><span className="text-pink-400">Gender Lean</span> — Filters results by masculine/feminine sound patterns based on endings.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Name Card Icons</h4>
                  <ul className="space-y-1 ml-4">
                    <li><Star className="w-4 h-4 inline text-yellow-400" /> <span className="text-yellow-400">Star</span> — Add to favorites. Favorites are saved at the bottom and can be exported.</li>
                    <li><FlaskConical className="w-4 h-4 inline text-teal-400" /> <span className="text-teal-400">Flask</span> — Select for refinement. Pick 2-4 names you like, then generate similar ones.</li>
                    <li><Volume2 className="w-4 h-4 inline text-cyan-400" /> <span className="text-cyan-400">Speaker</span> — Hear an approximate pronunciation of the name.</li>
                    <li><Glasses className="w-4 h-4 inline text-amber-400" /> <span className="text-amber-400">Glasses</span> — Stats for nerds! See how the name was generated.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Tips</h4>
                  <ul className="space-y-1 ml-4">
                    <li>Use the "Refine" feature when you find names you almost like — it analyzes patterns and generates variations.</li>
                    <li>Combine multiple tones for unique blends (e.g., "Noble" + "Dark" for morally gray characters).</li>
                    <li>The copy format dropdown lets you export as plain text, bullets, numbered list, or comma-separated.</li>
                    <li><span className="text-amber-400">Lock settings</span> (🔒 icon) to keep them fixed when using "Surprise Me".</li>
                    <li>For locations/factions/items, use <span className="text-amber-400">Name Style</span> to control formatting (Ironhold vs Iron Hold vs The Iron Hold).</li>
                    <li>Click the <RefreshCw className="w-3 h-3 inline text-purple-400" /> icon on any name to tweak specific syllables while keeping others.</li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
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
                <SectionHeader title="Name Type" helpText={helpTexts.nameType} icon={Sparkles} isLocked={lockedSettings.nameType} onToggleLock={toggleLock} lockKey="nameType" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {nameTypes.map(t => (
                    <SelectionChip key={t.value} selected={config.nameType === t.value} onClick={() => updateConfig('nameType', t.value)}>
                      <span className="mr-1">{t.icon}</span> {t.label}
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Name Style - Only show for non-character types */}
              {config.nameType !== 'character' && (
                <div className="mb-6">
                  <SectionHeader title="Name Style" helpText="How names are formatted. Default mixes styles, Compound joins words (Ironhold), Spaced separates them (Iron Hold), Title adds 'The' (The Iron Hold)." />
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'default', label: 'Default', example: 'Mixed styles' },
                      { value: 'compound', label: 'Compound', example: 'Ironhold' },
                      { value: 'spaced', label: 'Spaced', example: 'Iron Hold' },
                      { value: 'title', label: 'Title', example: 'The Iron Hold' }
                    ].map(style => (
                      <SelectionChip 
                        key={style.value} 
                        selected={config.nameStyle === style.value} 
                        onClick={() => updateConfig('nameStyle', style.value)}
                        color="amber"
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{style.label}</span>
                          <span className="text-[10px] opacity-60">{style.example}</span>
                        </div>
                      </SelectionChip>
                    ))}
                  </div>
                </div>
              )}

              {/* Genre */}
              <div className="mb-6">
                <SectionHeader title="Genre" helpText={helpTexts.genre} icon={Globe} isLocked={lockedSettings.genre} onToggleLock={toggleLock} lockKey="genre" />
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
                <SectionHeader title="Time Period" helpText={helpTexts.timePeriod} icon={Scroll} isLocked={lockedSettings.timePeriod} onToggleLock={toggleLock} lockKey="timePeriod" />
                <div className="flex flex-wrap gap-2">
                  {timePeriods.map(t => (
                    <SelectionChip key={t.value} selected={config.timePeriod === t.value} onClick={() => updateConfig('timePeriod', t.value)} color="emerald">
                      {t.label}
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Gender Lean */}
              <div className="mb-6">
                <SectionHeader title="Gender Lean" helpText="Filter names by masculine/feminine sound patterns based on endings and phonetics. Does not change generation, only filters results." isLocked={lockedSettings.genderLean} onToggleLock={toggleLock} lockKey="genderLean" />
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'any', label: 'Any' },
                    { value: 'feminine', label: '♀ Feminine' },
                    { value: 'masculine', label: '♂ Masculine' },
                    { value: 'neutral', label: '⚖ Neutral' }
                  ].map(g => (
                    <SelectionChip key={g.value} selected={config.genderLean === g.value} onClick={() => updateConfig('genderLean', g.value)} color="pink">
                      {g.label}
                    </SelectionChip>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="mb-6">
                <SectionHeader title="Tone" helpText={helpTexts.tone} icon={Music} isLocked={lockedSettings.tones} onToggleLock={toggleLock} lockKey="tones" />
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
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
                <SectionHeader title="Linguistic Influence (max 4)" helpText={helpTexts.region} icon={Globe} isLocked={lockedSettings.regions} onToggleLock={toggleLock} lockKey="regions" />
                <p className="text-xs text-slate-500 mb-2 italic">Note: Regions approximate sound patterns for English-speaking writers, not culturally authentic names for native speakers.</p>
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
                <SectionHeader title="Structure" helpText={helpTexts.structure} isLocked={lockedSettings.structure} onToggleLock={toggleLock} lockKey="structure" />
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
                    { key: 'mustStartWith', placeholder: 'Starts with (1-3 chars)' },
                    { key: 'mustNotContain', placeholder: 'Excludes...' },
                    { key: 'seedWord', placeholder: 'Seed influence...' }
                  ].map(f => (
                    <input
                      key={f.key}
                      value={config[f.key]}
                      onChange={e => updateConfig(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 md:py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
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
                <GlowButton onClick={generate} disabled={isGenerating} className="flex-1" theme={config.genre}>
                  <div className="flex flex-col items-center">
                    <span className="flex items-center gap-2">
                      <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Forging...' : 'Generate Names'}
                    </span>
                    <span className="text-[10px] opacity-60 font-normal mt-0.5">Ctrl+Enter</span>
                  </div>
                </GlowButton>
                <GlowButton variant="secondary" onClick={() => setGeneratedNames([])} theme={config.genre}>
                  <X className="w-5 h-5" />
                </GlowButton>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3" ref={resultsRef}>
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-400" /> Generated Names
                </h2>
                {generatedNames.length > 0 && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Undo/Redo buttons */}
                    <div className="flex items-center gap-1 border-r border-slate-700 pr-3">
                      <button 
                        onClick={undo} 
                        disabled={!canUndo}
                        className={`p-1.5 rounded transition-colors ${canUndo ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800' : 'text-slate-700 cursor-not-allowed'}`}
                        title="Undo (previous generation)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      <button 
                        onClick={redo} 
                        disabled={!canRedo}
                        className={`p-1.5 rounded transition-colors ${canRedo ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800' : 'text-slate-700 cursor-not-allowed'}`}
                        title="Redo (next generation)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                        </svg>
                      </button>
                    </div>
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

              <div className="space-y-3 max-h-[calc(100vh-300px)] min-h-[400px] overflow-y-auto pr-2">
                {isGenerating ? (
                  [...Array(config.nameCount)].map((_, i) => <SkeletonCard key={i} />)
                ) : generatedNames.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex p-6 rounded-full bg-slate-800/50 mb-4">
                      <Wand2 className="w-12 h-12 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-lg">Configure your settings and generate names</p>
                    <p className="text-slate-600 text-sm mt-2">Each name follows authentic linguistic rules</p>
                  </div>
                ) : (
                  generatedNames.map((n, index) => (
                    <NameCard
                      key={n.id}
                      name={n.name}
                      syllables={n.syllables}
                      isFavorite={isFavorite(n.name)}
                      onCopy={() => copyToClipboard(n.name)}
                      onFavorite={() => toggleFavorite(n)}
                      copied={copiedName === n.name}
                      isSelectedForRefine={isSelectedForRefine(n.name)}
                      onRefineSelect={() => toggleRefineSelection(n)}
                      metadata={n.metadata}
                      onRerollSiblings={(selectedPartIds, allParts) => tweakName(n, index, selectedPartIds, allParts)}
                    />
                  ))
                )}
              </div>

              {/* Refine Section */}
              {refineSelections.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-teal-400 flex items-center gap-2">
                      <FlaskConical className="w-4 h-4" /> Refine Selection ({refineSelections.length}/4)
                    </h3>
                    <button onClick={clearRefineSelections} className="text-xs text-slate-400 hover:text-red-400 transition-colors">
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {refineSelections.map(n => (
                      <div key={n.name} className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-full text-sm text-teal-300 max-w-[200px]">
                        <span className="truncate">{n.name}</span>
                        <button onClick={() => toggleRefineSelection(n)} className="text-teal-500/50 hover:text-red-400 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <GlowButton onClick={generateRefined} disabled={isGenerating} className="w-full" theme={config.genre}>
                    <FlaskConical className="w-5 h-5" />
                    Generate Similar Names
                  </GlowButton>
                </div>
              )}

              {/* Favorites */}
              {favorites.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-yellow-400 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" /> Favorites ({favorites.length})
                    </h3>
                    <div className="flex items-center gap-3">
                      <button onClick={clearFavorites} className="text-xs text-slate-400 hover:text-red-400 transition-colors">
                        Clear
                      </button>
                      <button onClick={exportFavorites} className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Export
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favorites.map(f => (
                      <div key={f.id || f.name} className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-sm text-yellow-300 max-w-[200px]">
                        <span className="truncate">{f.name}</span>
                        <button onClick={() => setFavorites(prev => prev.filter(fav => fav.name !== f.name))} className="text-yellow-500/50 hover:text-red-400 transition-colors">
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
            <div className="mt-6 pb-20 lg:pb-0 text-center text-slate-600 text-sm">
              <p>Made with ❤️ for writers, game masters, and worldbuilders</p>
              <button onClick={openDonation} className="mt-2 text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1 mx-auto">
                <Heart className="w-4 h-4" /> Support this project on Ko-fi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Generate Button - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/50 z-50">
        <GlowButton onClick={generate} disabled={isGenerating} className="w-full" theme={config.genre}>
          <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Forging...' : 'Generate Names'}
        </GlowButton>
      </div>
    </div>
  );
}
