import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, Copy, Star, ChevronDown, ChevronUp, Sparkles, X, Check, Download, Wand2, RefreshCw, Zap, Globe, Music, Skull, Crown, Flame, TreePine, Cpu, Rocket, Scroll, Heart, Volume2, FlaskConical, Glasses, Menu, User, Sword, Search, Filter, ChevronLeft, ChevronRight, AlertCircle, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

const STORAGE_KEYS = {
  FAVORITES: 'aethername_favorites',
  HISTORY: 'aethername_history'
};

const LocalStorageUtil = {
  /**
   * Safely get item from localStorage with error handling
   */
  getItem(key, defaultValue = null) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return defaultValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      // Handle quota exceeded, private browsing, or JSON parse errors
      console.warn(`localStorage.getItem error for key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Safely set item in localStorage with error handling
   */
  setItem(key, value) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      // Handle quota exceeded, private browsing
      console.warn(`localStorage.setItem error for key "${key}":`, error);
      if (error.name === 'QuotaExceededError') {
        // Try to clear old data to make room
        try {
          const oldKey = STORAGE_KEYS.HISTORY;
          window.localStorage.removeItem(oldKey);
          window.localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (retryError) {
          console.error('Failed to save to localStorage even after cleanup:', retryError);
        }
      }
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`localStorage.removeItem error for key "${key}":`, error);
      return false;
    }
  }
};

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
    fontWeight: 'font-medium',
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
    if (isMobile) {
      e.stopPropagation();
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
        className="inline-block w-full cursor-help active:scale-95 transition-transform pointer-events-auto"
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
        className={`p-1.5 rounded transition-all duration-200 ${isOpen ? 'text-purple-400 scale-110 bg-purple-400/10' : 'text-slate-600 hover:text-purple-400 hover:scale-110 hover:bg-purple-400/10'}`}
        title="Tweak specific parts of this name"
      >
        <RefreshCw className="w-4 h-4" />
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

const NameCard = ({ name, syllables, isFavorite, onCopy, onFavorite, copied, metadata, onRerollSiblings, onSendToCharacter, onExplode }) => {
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
    <div className="group relative p-3 md:p-4 bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:shadow-lg hover:border-indigo-500/30 hover:shadow-indigo-500/5 transition-all duration-300 overflow-visible">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0">
            <div className="grid grid-cols-3 gap-1">
              {/* Row 1 */}
              <button 
                onClick={onFavorite} 
                className={`p-1.5 rounded transition-all duration-200 ${isFavorite ? 'text-yellow-400 scale-110 bg-yellow-400/10' : 'text-slate-600 hover:text-yellow-400 hover:scale-110 hover:bg-yellow-400/10'}`}
                title="Add to favorites"
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={onExplode} 
                className="p-1.5 rounded text-slate-600 hover:text-teal-400 hover:scale-110 hover:bg-teal-400/10 transition-all duration-200"
                title="Explode into variations - generate similar names based on this one"
              >
                <FlaskConical className="w-4 h-4" />
              </button>
              <button 
                onClick={speakName} 
                className="p-1.5 rounded text-slate-600 hover:text-cyan-400 hover:scale-110 hover:bg-cyan-400/10 transition-all duration-200"
                title="Hear pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              {/* Row 2 */}
              <button 
                onClick={() => setShowStats(!showStats)} 
                className={`p-1.5 rounded transition-all duration-200 ${showStats ? 'text-amber-400 scale-110 bg-amber-400/10' : 'text-slate-600 hover:text-amber-400 hover:scale-110 hover:bg-amber-400/10'}`}
                title="Stats for nerds - see how this name was built"
              >
                <Glasses className="w-4 h-4" />
              </button>
              {onRerollSiblings ? (
                <TweakPopover 
                  name={name} 
                  metadata={metadata} 
                  onTweak={onRerollSiblings} 
                  isOpen={tweakPopoverOpen}
                  setIsOpen={setTweakPopoverOpen}
                />
              ) : (
                <div className="p-1.5" /> 
              )}
              {onSendToCharacter ? (
                <button 
                  onClick={onSendToCharacter} 
                  className="p-1.5 rounded text-slate-600 hover:text-indigo-400 hover:scale-110 hover:bg-indigo-400/10 transition-all duration-200"
                  title="Send to Character Creator"
                >
                  <User className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-1.5" />
              )}
            </div>
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

// ============================================================================
// NAVIGATION COMPONENT
// ============================================================================

const Navigation = ({ currentPage, setCurrentPage, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentTheme = themeConfig[theme] || themeConfig.mixed;
  
  const pages = [
    { id: 'generator', label: 'Name Generator', icon: Sparkles, description: 'Create unique fantasy & sci-fi names' },
    { id: 'character', label: '5e-Compatible Character Creator', icon: User, description: 'Build your character sheet' }
  ];

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 transition-all"
      >
        <Menu className="w-5 h-5 text-indigo-400" />
        <span className="text-slate-200 font-medium">
          {pages.find(p => p.id === currentPage)?.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-[70] overflow-hidden">
            {pages.map((page) => {
              const Icon = page.icon;
              const isActive = currentPage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    setCurrentPage(page.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-4 text-left transition-all ${
                    isActive 
                      ? 'bg-indigo-500/20 border-l-2 border-indigo-500' 
                      : 'hover:bg-slate-800/50 border-l-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div>
                    <div className={`font-medium ${isActive ? 'text-indigo-300' : 'text-slate-200'}`}>
                      {page.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {page.description}
                    </div>
                  </div>
                  {isActive && (
                    <Check className="w-4 h-4 text-indigo-400 ml-auto mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// ABILITY SCORE STEP COMPONENT
// ============================================================================

const ABILITY_NAMES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const ABILITY_LABELS = {
  strength: { short: 'STR', name: 'Strength', desc: 'Physical power, melee attacks, carrying capacity' },
  dexterity: { short: 'DEX', name: 'Dexterity', desc: 'Agility, reflexes, ranged attacks, AC' },
  constitution: { short: 'CON', name: 'Constitution', desc: 'Health, stamina, hit points' },
  intelligence: { short: 'INT', name: 'Intelligence', desc: 'Memory, reasoning, arcane magic' },
  wisdom: { short: 'WIS', name: 'Wisdom', desc: 'Perception, insight, divine magic' },
  charisma: { short: 'CHA', name: 'Charisma', desc: 'Force of personality, leadership, sorcery' }
};

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const POINT_BUY_COSTS = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

const getModifier = (score) => Math.floor((score - 10) / 2);
const formatModifier = (mod) => mod >= 0 ? `+${mod}` : `${mod}`;

// ============================================================================
// RACE DATA + HELPERS (PHASE 3)
// ============================================================================

const RACE_ICONS = {
  human: '🧑',
  elf: '🧝',
  dwarf: '⛏️',
  halfling: '🍀',
  gnome: '⚙️',
  halfElf: '✨',
  halfOrc: '🪓',
  tiefling: '😈',
  dragonborn: '🐉'
};

// Note: This is a “PHB-style” baseline dataset (kept lightweight for UI + bonuses + traits).
// We’re not enforcing rules yet (that comes later in class/skills/proficiencies phases).
const RACES = {
  human: {
    name: 'Human',
    description: 'Versatile and ambitious, humans adapt quickly and thrive anywhere.',
    abilityBonuses: { all: 1 },
    speed: 30,
    traits: ['Extra Language (choice)'],
    languages: ['Common', 'One of your choice'],
    subraces: {
      standard: {
        name: 'Standard Human',
        description: 'The classic human, equally capable in all areas.',
        abilityBonuses: {}, // Uses parent +1 to all
        traits: []
      },
      variant: {
        name: 'Variant Human',
        description: 'More specialized, with a bonus feat and focused abilities.',
        abilityBonuses: { choice2: 1 }, // +1 to two abilities of choice (handled specially)
        traits: ['Bonus Skill Proficiency', 'Bonus Feat'],
        overrideParentBonuses: true // Flag to not use the +1 to all
      }
    }
  },
  elf: {
    name: 'Elf',
    description: 'Graceful and long-lived, elves are attuned to magic and the natural world.',
    abilityBonuses: { dexterity: 2 },
    speed: 30,
    traits: ['Darkvision', 'Keen Senses', 'Fey Ancestry', 'Trance'],
    languages: ['Common', 'Elvish'],
    subraces: {
      highElf: {
        name: 'High Elf',
        description: 'Scholarly and magical, high elves wield arcane cantrips and refined training.',
        abilityBonuses: { intelligence: 1 },
        traits: ['Elf Weapon Training', 'Cantrip', 'Extra Language (choice)']
      },
      woodElf: {
        name: 'Wood Elf',
        description: 'Swift and stealthy, wood elves move through forests like ghosts.',
        abilityBonuses: { wisdom: 1 },
        traits: ['Elf Weapon Training', 'Fleet of Foot', 'Mask of the Wild'],
        speed: 35
      },
      darkElf: {
        name: 'Dark Elf (Drow)',
        description: 'Drow are shadowed and dangerous, gifted with magic but burdened by sunlight.',
        abilityBonuses: { charisma: 1 },
        traits: ['Superior Darkvision', 'Sunlight Sensitivity', 'Drow Magic', 'Drow Weapon Training']
      }
    }
  },
  dwarf: {
    name: 'Dwarf',
    description: 'Stout and stubborn, dwarves are hardy folk with deep traditions and endurance.',
    abilityBonuses: { constitution: 2 },
    speed: 25,
    traits: ['Darkvision', 'Dwarven Resilience', 'Stonecunning'],
    languages: ['Common', 'Dwarvish'],
    subraces: {
      hillDwarf: {
        name: 'Hill Dwarf',
        description: 'Wise and tough, hill dwarves are known for resilience and strong instincts.',
        abilityBonuses: { wisdom: 1 },
        traits: ['Dwarven Toughness']
      },
      mountainDwarf: {
        name: 'Mountain Dwarf',
        description: 'Strong and martial, mountain dwarves are bred for battle and heavy armor.',
        abilityBonuses: { strength: 2 },
        traits: ['Dwarven Armor Training']
      }
    }
  },
  halfling: {
    name: 'Halfling',
    description: 'Cheerful and brave, halflings survive through luck, grit, and quick thinking.',
    abilityBonuses: { dexterity: 2 },
    speed: 25,
    traits: ['Lucky', 'Brave', 'Halfling Nimbleness'],
    languages: ['Common', 'Halfling'],
    subraces: {
      lightfoot: {
        name: 'Lightfoot Halfling',
        description: 'Friendly and sneaky, lightfoots vanish behind larger companions with ease.',
        abilityBonuses: { charisma: 1 },
        traits: ['Naturally Stealthy']
      },
      stout: {
        name: 'Stout Halfling',
        description: 'Sturdy and hardy, stouts shrug off poison and keep going.',
        abilityBonuses: { constitution: 1 },
        traits: ['Stout Resilience']
      }
    }
  },
  gnome: {
    name: 'Gnome',
    description: 'Clever and curious, gnomes blend invention with illusion and charm.',
    abilityBonuses: { intelligence: 2 },
    speed: 25,
    traits: ['Darkvision', 'Gnome Cunning'],
    languages: ['Common', 'Gnomish'],
    subraces: {
      forest: {
        name: 'Forest Gnome',
        description: 'Mischievous and nature-loving, forest gnomes speak with small beasts.',
        abilityBonuses: { dexterity: 1 },
        traits: ['Natural Illusionist', 'Speak with Small Beasts']
      },
      rock: {
        name: 'Rock Gnome',
        description: 'Tinkerers at heart, rock gnomes build small gadgets and clever devices.',
        abilityBonuses: { constitution: 1 },
        traits: ['Artificer’s Lore', 'Tinker']
      }
    }
  },
  halfElf: {
    name: 'Half-Elf',
    description: 'Walking between worlds, half-elves blend human drive with elven grace.',
    abilityBonuses: { charisma: 2, choice: { count: 2, value: 1 } }, // we’ll implement the “choice” UI later
    speed: 30,
    traits: ['Darkvision', 'Fey Ancestry', 'Skill Versatility'],
    languages: ['Common', 'Elvish', 'One of your choice'],
    subraces: null
  },
  halfOrc: {
    name: 'Half-Orc',
    description: 'Powerful and relentless, half-orcs are forged by hardship and strength.',
    abilityBonuses: { strength: 2, constitution: 1 },
    speed: 30,
    traits: ['Darkvision', 'Menacing', 'Relentless Endurance', 'Savage Attacks'],
    languages: ['Common', 'Orc'],
    subraces: null
  },
  tiefling: {
    name: 'Tiefling',
    description: 'Marked by infernal heritage, tieflings command strange magic and strong will.',
    abilityBonuses: { intelligence: 1, charisma: 2 },
    speed: 30,
    traits: ['Darkvision', 'Hellish Resistance', 'Infernal Legacy'],
    languages: ['Common', 'Infernal'],
    subraces: null
  },
  dragonborn: {
    name: 'Dragonborn',
    description: 'Proud and imposing, dragonborn channel draconic power through breath and presence.',
    abilityBonuses: { strength: 2, charisma: 1 },
    speed: 30,
    traits: ['Draconic Ancestry', 'Breath Weapon', 'Damage Resistance'],
    languages: ['Common', 'Draconic'],
    subraces: {
      black: { name: 'Black (Acid)', description: 'Acid breath and resistance.' },
      blue: { name: 'Blue (Lightning)', description: 'Lightning breath and resistance.' },
      brass: { name: 'Brass (Fire)', description: 'Fire breath and resistance.' },
      bronze: { name: 'Bronze (Lightning)', description: 'Lightning breath and resistance.' },
      copper: { name: 'Copper (Acid)', description: 'Acid breath and resistance.' },
      gold: { name: 'Gold (Fire)', description: 'Fire breath and resistance.' },
      green: { name: 'Green (Poison)', description: 'Poison breath and resistance.' },
      red: { name: 'Red (Fire)', description: 'Fire breath and resistance.' },
      silver: { name: 'Silver (Cold)', description: 'Cold breath and resistance.' },
      white: { name: 'White (Cold)', description: 'Cold breath and resistance.' }
    }
  }
};

// ============================================================================
// D&D 5E CLASSES
// ============================================================================

const CLASS_ICONS = {
  barbarian: '🪓',
  bard: '🎵',
  cleric: '⛪',
  druid: '🌿',
  fighter: '⚔️',
  monk: '👊',
  paladin: '🛡️',
  ranger: '🏹',
  rogue: '🗡️',
  sorcerer: '✨',
  warlock: '👁️',
  wizard: '📖'
};

const CLASSES = {
  barbarian: {
    name: 'Barbarian',
    description: 'A fierce warrior who can enter a battle rage, dealing devastating damage while shrugging off blows.',
    hitDie: 12,
    primaryAbility: ['strength'],
    savingThrows: ['strength', 'constitution'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
    features: ['Rage', 'Unarmored Defense'],
    spellcasting: null,
    subclassLevel: 3,
    subclassName: 'Primal Path'
  },
  bard: {
    name: 'Bard',
    description: 'An inspiring magician whose music and words weave magic, bolstering allies and hindering foes.',
    hitDie: 8,
    primaryAbility: ['charisma'],
    savingThrows: ['dexterity', 'charisma'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    skillChoices: { count: 3, from: 'any' },
    features: ['Spellcasting', 'Bardic Inspiration'],
    spellcasting: { ability: 'charisma', type: 'known', cantrips: 2, spellsKnown: 4 },
    subclassLevel: 3,
    subclassName: 'Bard College'
  },
  cleric: {
    name: 'Cleric',
    description: 'A priestly champion who wields divine magic in service of a higher power.',
    hitDie: 8,
    primaryAbility: ['wisdom'],
    savingThrows: ['wisdom', 'charisma'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
    features: ['Spellcasting', 'Divine Domain'],
    spellcasting: { ability: 'wisdom', type: 'prepared', cantrips: 3 },
    subclassLevel: 1,
    subclassName: 'Divine Domain'
  },
  druid: {
    name: 'Druid',
    description: 'A priest of the Old Faith, wielding nature\'s power and capable of transforming into beasts.',
    hitDie: 8,
    primaryAbility: ['wisdom'],
    savingThrows: ['intelligence', 'wisdom'],
    armorProficiencies: ['Light armor (nonmetal)', 'Medium armor (nonmetal)', 'Shields (nonmetal)'],
    weaponProficiencies: ['Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears'],
    skillChoices: { count: 2, from: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
    features: ['Druidic', 'Spellcasting'],
    spellcasting: { ability: 'wisdom', type: 'prepared', cantrips: 2 },
    subclassLevel: 2,
    subclassName: 'Druid Circle'
  },
  fighter: {
    name: 'Fighter',
    description: 'A master of martial combat, skilled with a variety of weapons and armor.',
    hitDie: 10,
    primaryAbility: ['strength', 'dexterity'],
    savingThrows: ['strength', 'constitution'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
    features: ['Fighting Style', 'Second Wind'],
    spellcasting: null,
    subclassLevel: 3,
    subclassName: 'Martial Archetype'
  },
  monk: {
    name: 'Monk',
    description: 'A martial artist pursuing physical and spiritual perfection, harnessing ki energy.',
    hitDie: 8,
    primaryAbility: ['dexterity', 'wisdom'],
    savingThrows: ['strength', 'dexterity'],
    armorProficiencies: [],
    weaponProficiencies: ['Simple weapons', 'Shortswords'],
    skillChoices: { count: 2, from: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
    features: ['Unarmored Defense', 'Martial Arts'],
    spellcasting: null,
    subclassLevel: 3,
    subclassName: 'Monastic Tradition'
  },
  paladin: {
    name: 'Paladin',
    description: 'A holy warrior bound to a sacred oath, smiting evil with divine power.',
    hitDie: 10,
    primaryAbility: ['strength', 'charisma'],
    savingThrows: ['wisdom', 'charisma'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 2, from: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
    features: ['Divine Sense', 'Lay on Hands'],
    spellcasting: { ability: 'charisma', type: 'prepared', cantrips: 0, startsAtLevel: 2 },
    subclassLevel: 3,
    subclassName: 'Sacred Oath'
  },
  ranger: {
    name: 'Ranger',
    description: 'A warrior who combats threats on the edges of civilization with martial and nature magic.',
    hitDie: 10,
    primaryAbility: ['dexterity', 'wisdom'],
    savingThrows: ['strength', 'dexterity'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: { count: 3, from: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
    features: ['Favored Enemy', 'Natural Explorer'],
    spellcasting: { ability: 'wisdom', type: 'known', cantrips: 0, spellsKnown: 2, startsAtLevel: 2 },
    subclassLevel: 3,
    subclassName: 'Ranger Archetype'
  },
  rogue: {
    name: 'Rogue',
    description: 'A scoundrel who uses stealth and trickery to overcome obstacles and strike foes.',
    hitDie: 8,
    primaryAbility: ['dexterity'],
    savingThrows: ['dexterity', 'intelligence'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    skillChoices: { count: 4, from: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
    features: ['Expertise', 'Sneak Attack', 'Thieves\' Cant'],
    spellcasting: null,
    subclassLevel: 3,
    subclassName: 'Roguish Archetype'
  },
  sorcerer: {
    name: 'Sorcerer',
    description: 'A spellcaster who draws on inherent magic from a bloodline or cosmic gift.',
    hitDie: 6,
    primaryAbility: ['charisma'],
    savingThrows: ['constitution', 'charisma'],
    armorProficiencies: [],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    skillChoices: { count: 2, from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
    features: ['Spellcasting', 'Sorcerous Origin'],
    spellcasting: { ability: 'charisma', type: 'known', cantrips: 4, spellsKnown: 2 },
    subclassLevel: 1,
    subclassName: 'Sorcerous Origin'
  },
  warlock: {
    name: 'Warlock',
    description: 'A wielder of magic derived from a bargain with an extraplanar entity.',
    hitDie: 8,
    primaryAbility: ['charisma'],
    savingThrows: ['wisdom', 'charisma'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: { count: 2, from: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
    features: ['Otherworldly Patron', 'Pact Magic'],
    spellcasting: { ability: 'charisma', type: 'pact', cantrips: 2, spellsKnown: 2 },
    subclassLevel: 1,
    subclassName: 'Otherworldly Patron'
  },
  wizard: {
    name: 'Wizard',
    description: 'A scholarly magic-user who commands arcane spells through intense study.',
    hitDie: 6,
    primaryAbility: ['intelligence'],
    savingThrows: ['intelligence', 'wisdom'],
    armorProficiencies: [],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    skillChoices: { count: 2, from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] },
    features: ['Spellcasting', 'Arcane Recovery'],
    spellcasting: { ability: 'intelligence', type: 'prepared', cantrips: 3, spellbook: true },
    subclassLevel: 2,
    subclassName: 'Arcane Tradition'
  }
};

// ============================================================================
// D&D 5E SUBCLASSES (PHB)
// ============================================================================

const SUBCLASSES = {
  barbarian: {
    berserker: { name: 'Path of the Berserker', description: 'A path of untrammeled fury, fighting with primal ferocity.' },
    totemWarrior: { name: 'Path of the Totem Warrior', description: 'A spiritual journey, accepting a spirit animal as guide and protector.' }
  },
  bard: {
    lore: { name: 'College of Lore', description: 'Collectors of knowledge from scholarly tomes and peasant tales alike.' },
    valor: { name: 'College of Valor', description: 'Daring skalds whose tales keep alive the memory of great heroes.' }
  },
  cleric: {
    knowledge: { name: 'Knowledge Domain', description: 'Gods of knowledge value learning and understanding above all.' },
    life: { name: 'Life Domain', description: 'Focus on the vibrant positive energy that sustains all life.' },
    light: { name: 'Light Domain', description: 'Gods of light promote rebirth, truth, vigilance, and beauty.' },
    nature: { name: 'Nature Domain', description: 'Gods of nature are as varied as the natural world itself.' },
    tempest: { name: 'Tempest Domain', description: 'Gods of the tempest govern storms, sea, and sky.' },
    trickery: { name: 'Trickery Domain', description: 'Gods of trickery are mischief-makers and instigators.' },
    war: { name: 'War Domain', description: 'War has many manifestations, making heroes of ordinary people.' }
  },
  druid: {
    land: { name: 'Circle of the Land', description: 'Mystics and sages who safeguard ancient knowledge and rites.' },
    moon: { name: 'Circle of the Moon', description: 'Fierce guardians who can assume powerful beast forms.' }
  },
  fighter: {
    champion: { name: 'Champion', description: 'Focus on raw physical power honed to deadly perfection.' },
    battleMaster: { name: 'Battle Master', description: 'Employ martial techniques passed down through generations.' },
    eldritchKnight: { name: 'Eldritch Knight', description: 'Combine martial mastery with careful study of magic.' }
  },
  monk: {
    openHand: { name: 'Way of the Open Hand', description: 'Ultimate masters of martial arts combat.' },
    shadow: { name: 'Way of Shadow', description: 'Follow a tradition that values stealth and subterfuge.' },
    fourElements: { name: 'Way of the Four Elements', description: 'Harness the power of the four elements.' }
  },
  paladin: {
    devotion: { name: 'Oath of Devotion', description: 'Bound to the loftiest ideals of justice, virtue, and order.' },
    ancients: { name: 'Oath of the Ancients', description: 'As old as elves and the rituals of the druids.' },
    vengeance: { name: 'Oath of Vengeance', description: 'A solemn commitment to punish those who have sinned.' }
  },
  ranger: {
    hunter: { name: 'Hunter', description: 'Accept your place as a bulwark between civilization and wilderness.' },
    beastMaster: { name: 'Beast Master', description: 'Embody friendship between civilized races and beasts.' }
  },
  rogue: {
    thief: { name: 'Thief', description: 'Hone skills in the larcenous arts of burglars and cutpurses.' },
    assassin: { name: 'Assassin', description: 'Focus on the grim art of death, eliminating foes swiftly.' },
    arcaneTrickster: { name: 'Arcane Trickster', description: 'Enhance stealth and agility with magic.' }
  },
  sorcerer: {
    draconicBloodline: { name: 'Draconic Bloodline', description: 'Innate magic from draconic ancestry.' },
    wildMagic: { name: 'Wild Magic', description: 'Innate magic from wild forces of chaos.' }
  },
  warlock: {
    archfey: { name: 'The Archfey', description: 'Patron is a lord or lady of the fey.' },
    fiend: { name: 'The Fiend', description: 'Pact with a fiend from the lower planes.' },
    greatOldOne: { name: 'The Great Old One', description: 'Patron is a mysterious entity beyond reality.' }
  },
  wizard: {
    abjuration: { name: 'School of Abjuration', description: 'Magic that blocks, banishes, or protects.' },
    conjuration: { name: 'School of Conjuration', description: 'Produce objects and creatures out of thin air.' },
    divination: { name: 'School of Divination', description: 'Sought by royalty and commoners alike for counsel.' },
    enchantment: { name: 'School of Enchantment', description: 'Magically entrance and beguile others.' },
    evocation: { name: 'School of Evocation', description: 'Create powerful elemental effects.' },
    illusion: { name: 'School of Illusion', description: 'Dazzle senses, befuddle minds, trick the wisest.' },
    necromancy: { name: 'School of Necromancy', description: 'Explore cosmic forces of life, death, and undeath.' },
    transmutation: { name: 'School of Transmutation', description: 'Spells that modify energy and matter.' }
  }
};

const SUBCLASS_ICONS = {
  // Barbarian
  berserker: '😤', totemWarrior: '🐺',
  // Bard
  lore: '📚', valor: '⚔️',
  // Cleric
  knowledge: '📖', life: '❤️', light: '☀️', nature: '🌿', tempest: '⛈️', trickery: '🎭', war: '⚔️',
  // Druid
  land: '🌍', moon: '🌙',
  // Fighter
  champion: '🏆', battleMaster: '📋', eldritchKnight: '🔮',
  // Monk
  openHand: '✋', shadow: '🌑', fourElements: '🌀',
  // Paladin
  devotion: '🛡️', ancients: '🌳', vengeance: '⚡',
  // Ranger
  hunter: '🎯', beastMaster: '🐾',
  // Rogue
  thief: '💰', assassin: '🗡️', arcaneTrickster: '✨',
  // Sorcerer
  draconicBloodline: '🐉', wildMagic: '🎲',
  // Warlock
  archfey: '🧚', fiend: '😈', greatOldOne: '👁️',
  // Wizard
  abjuration: '🛡️', conjuration: '🌀', divination: '🔮', enchantment: '💫',
  evocation: '🔥', illusion: '👻', necromancy: '💀', transmutation: '⚗️'
};

// ============================================================================
// SPELL SLOTS BY CLASS AND LEVEL
// ============================================================================

const SPELL_SLOTS = {
  full: {
    1: { 1: 2 }, 
    2: { 1: 3 }, 
    3: { 1: 4, 2: 2 }, 
    4: { 1: 4, 2: 3 }, 
    5: { 1: 4, 2: 3, 3: 2 },
    6: { 1: 4, 2: 3, 3: 3 }, 
    7: { 1: 4, 2: 3, 3: 3, 4: 1 }, 
    8: { 1: 4, 2: 3, 3: 3, 4: 2 },
    9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 }, 
    10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 }
  },
  half: {
    1: {}, 
    2: { 1: 2 }, 
    3: { 1: 3 }, 
    4: { 1: 3 }, 
    5: { 1: 4, 2: 2 },
    6: { 1: 4, 2: 2 }, 
    7: { 1: 4, 2: 3 }, 
    8: { 1: 4, 2: 3 }, 
    9: { 1: 4, 2: 3, 3: 2 }, 
    10: { 1: 4, 2: 3, 3: 2 },
    11: { 1: 4, 2: 3, 3: 3 },
    12: { 1: 4, 2: 3, 3: 3 },
    13: { 1: 4, 2: 3, 3: 3, 4: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 2 },
    16: { 1: 4, 2: 3, 3: 3, 4: 2 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 }
  },
  warlock: {
    1: { slots: 1, level: 1 }, 
    2: { slots: 2, level: 1 }, 
    3: { slots: 2, level: 2 }, 
    4: { slots: 2, level: 2 },
    5: { slots: 2, level: 3 }, 
    6: { slots: 2, level: 3 }, 
    7: { slots: 2, level: 4 }, 
    8: { slots: 2, level: 4 },
    9: { slots: 2, level: 5 }, 
    10: { slots: 2, level: 5 },
    11: { slots: 3, level: 5 },
    12: { slots: 3, level: 5 },
    13: { slots: 3, level: 5 },
    14: { slots: 3, level: 5 },
    15: { slots: 3, level: 5 },
    16: { slots: 3, level: 5 },
    17: { slots: 4, level: 5 },
    18: { slots: 4, level: 5 },
    19: { slots: 4, level: 5 },
    20: { slots: 4, level: 5 }
  }
};

const getSpellSlots = (classId, level) => {
  const fullCasters = ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'];
  const halfCasters = ['paladin', 'ranger'];
  const cappedLevel = Math.min(level, 20);
  
  if (classId === 'warlock') return SPELL_SLOTS.warlock[cappedLevel];
  if (fullCasters.includes(classId)) return SPELL_SLOTS.full[cappedLevel];
  if (halfCasters.includes(classId)) return SPELL_SLOTS.half[cappedLevel];
  return null;
};

// Multi-class spell slot calculation
const getMulticlassSpellSlots = (character) => {
  if (!character.multiclass || character.multiclass.length === 0) {
    // Single class - use normal calculation
    return getSpellSlots(character.class, character.level);
  }
  
  const fullCasters = ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'];
  const halfCasters = ['paladin', 'ranger'];
  
  // Calculate adjusted level for spell slot purposes
  let adjustedLevel = character.level;
  
  // Check if primary class and multiclasses have spellcasting
  const primaryCanCast = fullCasters.includes(character.class) || halfCasters.includes(character.class);
  
  // For multiclass, if primary class is a full caster:
  // - Calculate spell slots based on total character level, but each class counts differently
  if (fullCasters.includes(character.class)) {
    // Primary is full caster - combine levels for spell slots
    let totalCasterLevel = character.level;
    
    // Warlocks don't combine with other spellcasters (separate pact magic)
    const hasWarlock = character.multiclass.some(m => m.classId === 'warlock');
    
    if (hasWarlock) {
      // Warlock levels don't combine with other spell slots
      // But we still calculate spell slots for the full caster levels
      totalCasterLevel = character.level - character.multiclass.find(m => m.classId === 'warlock').level;
    }
    
    return getSpellSlots(character.class, Math.min(totalCasterLevel, 20));
  }
  
  // For multiclass, if primary class can't cast but multiclass has caster
  const multiClassCaster = character.multiclass.find(m => 
    fullCasters.includes(m.classId) || halfCasters.includes(m.classId)
  );
  
  if (multiClassCaster) {
    return getSpellSlots(multiClassCaster.classId, Math.min(character.level, 20));
  }
  
  return null;
};

// ============================================================================
// HP CALCULATION HELPER
// ============================================================================

const calculateHP = (classId, level, constitutionMod, hpMethod = 'average') => {
  const classData = CLASSES[classId];
  if (!classData) return 0;
  const hitDie = classData.hitDie;
  
  // Level 1: max hit die + CON
  let hp = hitDie + constitutionMod;
  
  // Levels 2+: average (rounded up) or max
  for (let i = 2; i <= level; i++) {
    const perLevel = hpMethod === 'average' ? Math.floor(hitDie / 2) + 1 : hitDie;
    hp += perLevel + constitutionMod;
  }
  
  return Math.max(hp, level);
};

// ============================================================================
// D&D 5E BACKGROUNDS
// ============================================================================

const BACKGROUND_ICONS = {
  acolyte: '🙏',
  charlatan: '🎭',
  criminal: '🗝️',
  entertainer: '🎪',
  folkHero: '🌾',
  guildArtisan: '🔨',
  hermit: '🏔️',
  noble: '👑',
  outlander: '🐺',
  sage: '📚',
  sailor: '⚓',
  soldier: '🎖️',
  urchin: '🐀'
};

const BACKGROUNDS = {
  acolyte: {
    name: 'Acolyte',
    description: 'You spent your life in service to a temple, learning sacred rites and providing sacrifices.',
    skillProficiencies: ['Insight', 'Religion'],
    toolProficiencies: [],
    languages: 2,
    equipment: ['Holy symbol', 'Prayer book or wheel', '5 sticks of incense', 'Vestments', '15 gp'],
    feature: 'Shelter of the Faithful',
    featureDesc: 'You and your companions can receive free healing at temples of your faith, and supporters will provide modest lifestyle.',
    personalityTraits: [
      'I idolize a particular hero of my faith and refer to that person\'s deeds in all things.',
      'I can find common ground between the fiercest enemies, empathizing with them.',
      'I see omens in every event and action. The gods speak to us; we just need to listen.',
      'Nothing can shake my optimistic attitude.',
      'I quote sacred texts and proverbs in almost every situation.',
      'I am tolerant of other faiths and respect their worship.',
      'I\'ve enjoyed fine food, drink, and high society among the elite. Rough living grates on me.',
      'I\'ve spent so long in the temple that I have little practical experience dealing with people.'
    ],
    ideals: [
      'Tradition: The ancient traditions of worship must be preserved.',
      'Charity: I always try to help those in need.',
      'Change: We must help bring about changes the gods are constantly working in the world.',
      'Power: I hope to one day rise to the top of my faith\'s religious hierarchy.',
      'Faith: I trust that my deity will guide my actions.',
      'Aspiration: I seek to prove myself worthy of my god\'s favor.'
    ],
    bonds: [
      'I would die to recover an ancient relic of my faith that was lost long ago.',
      'I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.',
      'I owe my life to the priest who took me in when my parents died.',
      'Everything I do is for the common people.',
      'I will do anything to protect the temple where I served.',
      'I seek to preserve a sacred text that my enemies seek to destroy.'
    ],
    flaws: [
      'I judge others harshly, and myself even more severely.',
      'I put too much trust in those who wield power within my temple\'s hierarchy.',
      'My piety sometimes leads me to blindly trust those that profess faith in my god.',
      'I am inflexible in my thinking.',
      'I am suspicious of strangers and expect the worst of them.',
      'Once I pick a goal, I become obsessed with it to the detriment of everything else.'
    ]
  },
  charlatan: {
    name: 'Charlatan',
    description: 'You have always had a way with people. You know what makes them tick and can tease out their desires.',
    skillProficiencies: ['Deception', 'Sleight of Hand'],
    toolProficiencies: ['Disguise kit', 'Forgery kit'],
    languages: 0,
    equipment: ['Fine clothes', 'Disguise kit', 'Con tools (weighted dice, marked cards)', '15 gp'],
    feature: 'False Identity',
    featureDesc: 'You have a second identity with documentation, acquaintances, and disguises. You can forge documents.'
  },
  criminal: {
    name: 'Criminal',
    description: 'You are an experienced criminal with a history of breaking the law and surviving by your wits.',
    skillProficiencies: ['Deception', 'Stealth'],
    toolProficiencies: ['One gaming set', 'Thieves\' tools'],
    languages: 0,
    equipment: ['Crowbar', 'Dark common clothes with hood', '15 gp'],
    feature: 'Criminal Contact',
    featureDesc: 'You have a reliable contact who acts as your liaison to a network of criminals.'
  },
  entertainer: {
    name: 'Entertainer',
    description: 'You thrive in front of an audience, knowing how to entrance, entertain, and inspire.',
    skillProficiencies: ['Acrobatics', 'Performance'],
    toolProficiencies: ['Disguise kit', 'One musical instrument'],
    languages: 0,
    equipment: ['Musical instrument', 'Favor from an admirer', 'Costume', '15 gp'],
    feature: 'By Popular Demand',
    featureDesc: 'You can find a place to perform where you receive free lodging and food of modest standard.'
  },
  folkHero: {
    name: 'Folk Hero',
    description: 'You come from humble origins but are destined for much more. Your people see you as their champion.',
    skillProficiencies: ['Animal Handling', 'Survival'],
    toolProficiencies: ['One artisan\'s tools', 'Vehicles (land)'],
    languages: 0,
    equipment: ['Artisan\'s tools', 'Shovel', 'Iron pot', 'Common clothes', '10 gp'],
    feature: 'Rustic Hospitality',
    featureDesc: 'Common folk will shelter you from the law or others searching for you, risking their lives if needed.'
  },
  guildArtisan: {
    name: 'Guild Artisan',
    description: 'You are a member of an artisan guild, skilled in a particular craft and connected to merchants.',
    skillProficiencies: ['Insight', 'Persuasion'],
    toolProficiencies: ['One artisan\'s tools'],
    languages: 1,
    equipment: ['Artisan\'s tools', 'Letter of introduction from guild', 'Traveler\'s clothes', '15 gp'],
    feature: 'Guild Membership',
    featureDesc: 'Your guild provides lodging, food, legal defense, and access to powerful patrons.'
  },
  hermit: {
    name: 'Hermit',
    description: 'You lived in seclusion for an extended time, studying, praying, or communing with nature.',
    skillProficiencies: ['Medicine', 'Religion'],
    toolProficiencies: ['Herbalism kit'],
    languages: 1,
    equipment: ['Scroll case with notes', 'Winter blanket', 'Common clothes', 'Herbalism kit', '5 gp'],
    feature: 'Discovery',
    featureDesc: 'You have discovered a unique truth about the cosmos, deities, or powerful beings—work with DM on details.'
  },
  noble: {
    name: 'Noble',
    description: 'You understand wealth, power, and privilege. You carry a noble title and your family owns land.',
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiencies: ['One gaming set'],
    languages: 1,
    equipment: ['Fine clothes', 'Signet ring', 'Scroll of pedigree', '25 gp'],
    feature: 'Position of Privilege',
    featureDesc: 'You are welcome in high society. Common folk try to accommodate you, and you can secure audiences with nobles.'
  },
  outlander: {
    name: 'Outlander',
    description: 'You grew up in the wilds, far from civilization and its comforts.',
    skillProficiencies: ['Athletics', 'Survival'],
    toolProficiencies: ['One musical instrument'],
    languages: 1,
    equipment: ['Staff', 'Hunting trap', 'Trophy from animal', 'Traveler\'s clothes', '10 gp'],
    feature: 'Wanderer',
    featureDesc: 'You have excellent memory for maps and geography. You can find food and water for yourself and five others daily.'
  },
  sage: {
    name: 'Sage',
    description: 'You spent years learning the lore of the multiverse, poring over manuscripts.',
    skillProficiencies: ['Arcana', 'History'],
    toolProficiencies: [],
    languages: 2,
    equipment: ['Bottle of black ink', 'Quill', 'Small knife', 'Letter with unanswered question', 'Common clothes', '10 gp'],
    feature: 'Researcher',
    featureDesc: 'When you don\'t know information, you often know where to find it—a library, sage, or other source.'
  },
  sailor: {
    name: 'Sailor',
    description: 'You sailed on a seagoing vessel for years, facing mighty storms, monsters, and the abyss.',
    skillProficiencies: ['Athletics', 'Perception'],
    toolProficiencies: ['Navigator\'s tools', 'Vehicles (water)'],
    languages: 0,
    equipment: ['Belaying pin (club)', '50 feet silk rope', 'Lucky charm', 'Common clothes', '10 gp'],
    feature: 'Ship\'s Passage',
    featureDesc: 'You can secure free passage on a sailing ship for yourself and companions in exchange for crew work.'
  },
  soldier: {
    name: 'Soldier',
    description: 'War has been your life. You trained as a youth, studied weapons, and served in a military.',
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiencies: ['One gaming set', 'Vehicles (land)'],
    languages: 0,
    equipment: ['Insignia of rank', 'Trophy from fallen enemy', 'Dice or cards', 'Common clothes', '10 gp'],
    feature: 'Military Rank',
    featureDesc: 'Soldiers loyal to your former organization recognize your rank. You can invoke authority to requisition supplies or gain access.'
  },
  urchin: {
    name: 'Urchin',
    description: 'You grew up on the streets alone, orphaned, and poor, learning to survive through quick wits.',
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiencies: ['Disguise kit', 'Thieves\' tools'],
    languages: 0,
    equipment: ['Small knife', 'Map of your home city', 'Pet mouse', 'Token of your parents', 'Common clothes', '10 gp'],
    feature: 'City Secrets',
    featureDesc: 'You know secret passages through urban areas, allowing you to travel twice as fast when not in combat.'
  }
};

// ============================================================================
// D&D 5E EQUIPMENT
// ============================================================================

const STARTING_EQUIPMENT = {
  barbarian: {
    choices: [
      { name: 'Primary Weapon', options: ['Greataxe', 'Any martial melee weapon'] },
      { name: 'Secondary Weapon', options: ['Two handaxes', 'Any simple weapon'] }
    ],
    fixed: ['Explorer\'s pack', '4 javelins']
  },
  bard: {
    choices: [
      { name: 'Weapon', options: ['Rapier', 'Longsword', 'Any simple weapon'] },
      { name: 'Pack', options: ['Diplomat\'s pack', 'Entertainer\'s pack'] },
      { name: 'Instrument', options: ['Lute', 'Any musical instrument'] }
    ],
    fixed: ['Leather armor', 'Dagger']
  },
  cleric: {
    choices: [
      { name: 'Weapon', options: ['Mace', 'Warhammer (if proficient)'] },
      { name: 'Armor', options: ['Scale mail', 'Leather armor', 'Chain mail (if proficient)'] },
      { name: 'Secondary', options: ['Light crossbow + 20 bolts', 'Any simple weapon'] },
      { name: 'Pack', options: ['Priest\'s pack', 'Explorer\'s pack'] }
    ],
    fixed: ['Shield', 'Holy symbol']
  },
  druid: {
    choices: [
      { name: 'Shield', options: ['Wooden shield', 'Any simple weapon'] },
      { name: 'Weapon', options: ['Scimitar', 'Any simple melee weapon'] },
      { name: 'Pack', options: ['Explorer\'s pack', 'Dungeoneer\'s pack'] }
    ],
    fixed: ['Leather armor', 'Druidic focus']
  },
  fighter: {
    choices: [
      { name: 'Armor', options: ['Chain mail', 'Leather armor + longbow + 20 arrows'] },
      { name: 'Weapons', options: ['Martial weapon + shield', 'Two martial weapons'] },
      { name: 'Secondary', options: ['Light crossbow + 20 bolts', 'Two handaxes'] },
      { name: 'Pack', options: ['Dungeoneer\'s pack', 'Explorer\'s pack'] }
    ],
    fixed: []
  },
  monk: {
    choices: [
      { name: 'Weapon', options: ['Shortsword', 'Any simple weapon'] },
      { name: 'Pack', options: ['Dungeoneer\'s pack', 'Explorer\'s pack'] }
    ],
    fixed: ['10 darts']
  },
  paladin: {
    choices: [
      { name: 'Weapons', options: ['Martial weapon + shield', 'Two martial weapons'] },
      { name: 'Secondary', options: ['5 javelins', 'Any simple melee weapon'] },
      { name: 'Pack', options: ['Priest\'s pack', 'Explorer\'s pack'] }
    ],
    fixed: ['Chain mail', 'Holy symbol']
  },
  ranger: {
    choices: [
      { name: 'Armor', options: ['Scale mail', 'Leather armor'] },
      { name: 'Weapons', options: ['Two shortswords', 'Two simple melee weapons'] },
      { name: 'Pack', options: ['Dungeoneer\'s pack', 'Explorer\'s pack'] }
    ],
    fixed: ['Longbow', '20 arrows']
  },
  rogue: {
    choices: [
      { name: 'Weapon', options: ['Rapier', 'Shortsword'] },
      { name: 'Secondary', options: ['Shortbow + 20 arrows', 'Shortsword'] },
      { name: 'Pack', options: ['Burglar\'s pack', 'Dungeoneer\'s pack', 'Explorer\'s pack'] }
    ],
    fixed: ['Leather armor', 'Two daggers', 'Thieves\' tools']
  },
  sorcerer: {
    choices: [
      { name: 'Weapon', options: ['Light crossbow + 20 bolts', 'Any simple weapon'] },
      { name: 'Focus', options: ['Component pouch', 'Arcane focus'] },
      { name: 'Pack', options: ['Dungeoneer\'s pack', 'Explorer\'s pack'] }
    ],
    fixed: ['Two daggers']
  },
  warlock: {
    choices: [
      { name: 'Weapon', options: ['Light crossbow + 20 bolts', 'Any simple weapon'] },
      { name: 'Focus', options: ['Component pouch', 'Arcane focus'] },
      { name: 'Pack', options: ['Scholar\'s pack', 'Dungeoneer\'s pack'] }
    ],
    fixed: ['Leather armor', 'Two daggers']
  },
  wizard: {
    choices: [
      { name: 'Weapon', options: ['Quarterstaff', 'Dagger'] },
      { name: 'Focus', options: ['Component pouch', 'Arcane focus'] },
      { name: 'Pack', options: ['Scholar\'s pack', 'Explorer\'s pack'] }
    ],
    fixed: ['Spellbook']
  }
};

const STARTING_GOLD = {
  barbarian: { dice: 2, sides: 4, multiplier: 10 },
  bard: { dice: 5, sides: 4, multiplier: 10 },
  cleric: { dice: 5, sides: 4, multiplier: 10 },
  druid: { dice: 2, sides: 4, multiplier: 10 },
  fighter: { dice: 5, sides: 4, multiplier: 10 },
  monk: { dice: 5, sides: 4, multiplier: 1 },
  paladin: { dice: 5, sides: 4, multiplier: 10 },
  ranger: { dice: 5, sides: 4, multiplier: 10 },
  rogue: { dice: 4, sides: 4, multiplier: 10 },
  sorcerer: { dice: 3, sides: 4, multiplier: 10 },
  warlock: { dice: 4, sides: 4, multiplier: 10 },
  wizard: { dice: 4, sides: 4, multiplier: 10 }
};

const EQUIPMENT_SHOP = {
  weapons: [
    { name: 'Club', cost: 0.1, damage: '1d4 bludgeoning', properties: 'Light' },
    { name: 'Dagger', cost: 2, damage: '1d4 piercing', properties: 'Finesse, light, thrown (20/60)' },
    { name: 'Handaxe', cost: 5, damage: '1d6 slashing', properties: 'Light, thrown (20/60)' },
    { name: 'Javelin', cost: 0.5, damage: '1d6 piercing', properties: 'Thrown (30/120)' },
    { name: 'Mace', cost: 5, damage: '1d6 bludgeoning', properties: '—' },
    { name: 'Quarterstaff', cost: 0.2, damage: '1d6 bludgeoning', properties: 'Versatile (1d8)' },
    { name: 'Shortbow', cost: 25, damage: '1d6 piercing', properties: 'Ammunition (80/320), two-handed' },
    { name: 'Shortsword', cost: 10, damage: '1d6 piercing', properties: 'Finesse, light' },
    { name: 'Longsword', cost: 15, damage: '1d8 slashing', properties: 'Versatile (1d10)' },
    { name: 'Rapier', cost: 25, damage: '1d8 piercing', properties: 'Finesse' },
    { name: 'Greataxe', cost: 30, damage: '1d12 slashing', properties: 'Heavy, two-handed' },
    { name: 'Greatsword', cost: 50, damage: '2d6 slashing', properties: 'Heavy, two-handed' },
    { name: 'Longbow', cost: 50, damage: '1d8 piercing', properties: 'Ammunition (150/600), heavy, two-handed' },
    { name: 'Light Crossbow', cost: 25, damage: '1d8 piercing', properties: 'Ammunition (80/320), loading, two-handed' }
  ],
  armor: [
    { name: 'Padded', cost: 5, ac: '11 + Dex', type: 'Light', stealth: 'Disadvantage' },
    { name: 'Leather', cost: 10, ac: '11 + Dex', type: 'Light', stealth: '—' },
    { name: 'Studded Leather', cost: 45, ac: '12 + Dex', type: 'Light', stealth: '—' },
    { name: 'Hide', cost: 10, ac: '12 + Dex (max 2)', type: 'Medium', stealth: '—' },
    { name: 'Chain Shirt', cost: 50, ac: '13 + Dex (max 2)', type: 'Medium', stealth: '—' },
    { name: 'Scale Mail', cost: 50, ac: '14 + Dex (max 2)', type: 'Medium', stealth: 'Disadvantage' },
    { name: 'Breastplate', cost: 400, ac: '14 + Dex (max 2)', type: 'Medium', stealth: '—' },
    { name: 'Chain Mail', cost: 75, ac: '16', type: 'Heavy', stealth: 'Disadvantage', strReq: 13 },
    { name: 'Plate', cost: 1500, ac: '18', type: 'Heavy', stealth: 'Disadvantage', strReq: 15 },
    { name: 'Shield', cost: 10, ac: '+2', type: 'Shield', stealth: '—' }
  ],
  gear: [
    { name: 'Backpack', cost: 2 },
    { name: 'Bedroll', cost: 1 },
    { name: 'Rope, 50 ft', cost: 1 },
    { name: 'Torch (10)', cost: 0.1 },
    { name: 'Rations (10 days)', cost: 5 },
    { name: 'Waterskin', cost: 0.2 },
    { name: 'Tinderbox', cost: 0.5 },
    { name: 'Arrows (20)', cost: 1 },
    { name: 'Bolts (20)', cost: 1 },
    { name: 'Component Pouch', cost: 25 },
    { name: 'Arcane Focus', cost: 10 },
    { name: 'Holy Symbol', cost: 5 },
    { name: 'Thieves\' Tools', cost: 25 },
    { name: 'Healer\'s Kit', cost: 5 }
  ],
  packs: [
    { name: 'Burglar\'s Pack', cost: 16, contents: 'Backpack, ball bearings, string, bell, 5 candles, crowbar, hammer, 10 pitons, lantern, 2 oil flasks, rations, tinderbox, waterskin, 50 ft rope' },
    { name: 'Diplomat\'s Pack', cost: 39, contents: 'Chest, 2 cases for maps, fine clothes, ink, pen, lamp, 2 oil flasks, 5 paper sheets, vial of perfume, sealing wax, soap' },
    { name: 'Dungeoneer\'s Pack', cost: 12, contents: 'Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days rations, waterskin, 50 ft rope' },
    { name: 'Entertainer\'s Pack', cost: 40, contents: 'Backpack, bedroll, 2 costumes, 5 candles, rations, waterskin, disguise kit' },
    { name: 'Explorer\'s Pack', cost: 10, contents: 'Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, 50 ft rope' },
    { name: 'Priest\'s Pack', cost: 19, contents: 'Backpack, blanket, 10 candles, tinderbox, alms box, 2 incense blocks, censer, vestments, rations, waterskin' },
    { name: 'Scholar\'s Pack', cost: 40, contents: 'Backpack, book of lore, ink, pen, 10 parchment sheets, little bag of sand, small knife' }
  ]
};

// ============================================================================
// D&D 5E SPELLS
// ============================================================================

const SPELL_SCHOOLS = {
  abjuration: { name: 'Abjuration', color: 'blue', icon: '🛡️' },
  conjuration: { name: 'Conjuration', color: 'yellow', icon: '✨' },
  divination: { name: 'Divination', color: 'cyan', icon: '👁️' },
  enchantment: { name: 'Enchantment', color: 'pink', icon: '💫' },
  evocation: { name: 'Evocation', color: 'red', icon: '🔥' },
  illusion: { name: 'Illusion', color: 'purple', icon: '🎭' },
  necromancy: { name: 'Necromancy', color: 'green', icon: '💀' },
  transmutation: { name: 'Transmutation', color: 'orange', icon: '🔄' }
};

// ============================================================================
// D&D 5E ALIGNMENTS
// ============================================================================

const ALIGNMENTS = {
  lawfulGood: { name: 'Lawful Good', short: 'LG', description: 'Creatures act with compassion and honor, with a strong sense of duty and respect for law.' },
  neutralGood: { name: 'Neutral Good', short: 'NG', description: 'Folk do the best they can to help others without bias for or against order.' },
  chaoticGood: { name: 'Chaotic Good', short: 'CG', description: 'Creatures act as their conscience directs with little regard for what others expect.' },
  lawfulNeutral: { name: 'Lawful Neutral', short: 'LN', description: 'Individuals act in accordance with law, tradition, or personal codes.' },
  trueNeutral: { name: 'True Neutral', short: 'N', description: 'The alignment of those who prefer to avoid moral questions and don\'t take sides.' },
  chaoticNeutral: { name: 'Chaotic Neutral', short: 'CN', description: 'Creatures follow their whims, holding personal freedom above all else.' },
  lawfulEvil: { name: 'Lawful Evil', short: 'LE', description: 'Creatures methodically take what they want within the limits of a code of conduct.' },
  neutralEvil: { name: 'Neutral Evil', short: 'NE', description: 'The alignment of those who do whatever they can get away with, without compassion or qualms.' },
  chaoticEvil: { name: 'Chaotic Evil', short: 'CE', description: 'Creatures act with arbitrary violence, spurred by greed, hatred, or bloodlust.' }
};

// ============================================================================
// D&D 5E FEATS (for Variant Human)
// ============================================================================

const FEATS = {
  alert: { name: 'Alert', description: '+5 bonus to initiative. You can\'t be surprised while conscious. Other creatures don\'t gain advantage on attack rolls against you as a result of being unseen.' },
  athlete: { name: 'Athlete', description: 'Increase Str or Dex by 1 (max 20). Climbing doesn\'t cost extra movement. Standing up uses only 5 feet. Running jumps only need 5-foot run.' },
  actor: { name: 'Actor', description: 'Increase Charisma by 1 (max 20). Advantage on Deception and Performance when impersonating. Mimic speech of others or sounds you\'ve heard.' },
  charger: { name: 'Charger', description: 'When you Dash, you can use a bonus action to make one melee weapon attack or shove. If you move 10+ feet, gain +5 to damage (attack) or push 10 feet (shove).' },
  crossbowExpert: { name: 'Crossbow Expert', description: 'Ignore loading property of crossbows. No disadvantage for ranged attacks within 5 feet. When you use Attack action with a one-handed weapon, bonus action to attack with loaded hand crossbow.' },
  defensiveDuelist: { name: 'Defensive Duelist', description: 'Prerequisite: Dex 13+. When wielding a finesse weapon and hit by melee attack, use reaction to add proficiency bonus to AC, potentially causing the attack to miss.' },
  dualWielder: { name: 'Dual Wielder', description: '+1 AC while wielding separate melee weapons in each hand. Can two-weapon fight with non-light weapons. Can draw or stow two weapons when you would normally draw/stow one.' },
  dungeonDelver: { name: 'Dungeon Delver', description: 'Advantage on Perception and Investigation for secret doors. Advantage on saves vs traps. Resistance to trap damage. Search for traps while traveling at normal pace.' },
  durable: { name: 'Durable', description: 'Increase Constitution by 1 (max 20). When you roll Hit Dice to regain HP, minimum amount equals 2× your Con modifier (minimum 2).' },
  elementalAdept: { name: 'Elemental Adept', description: 'Choose: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to that damage type. Treat any 1 on damage dice as a 2 for that damage type.' },
  grappler: { name: 'Grappler', description: 'Prerequisite: Str 13+. Advantage on attacks vs creatures you\'re grappling. Can use action to pin a grappled creature (both restrained). Can grapple creatures one size larger.' },
  greatWeaponMaster: { name: 'Great Weapon Master', description: 'On crit or reducing creature to 0 HP with melee weapon, bonus action for one melee weapon attack. Before melee attack with heavy weapon, take -5 to hit for +10 damage.' },
  healer: { name: 'Healer', description: 'When you use healer\'s kit to stabilize, creature regains 1 HP. As action, use kit (1 use) to restore 1d6+4 HP plus HP equal to creature\'s max Hit Dice. Can\'t do again until short/long rest.' },
  heavilyArmored: { name: 'Heavily Armored', description: 'Prerequisite: Medium armor proficiency. Increase Str by 1 (max 20). Gain proficiency with heavy armor.' },
  heavyArmorMaster: { name: 'Heavy Armor Master', description: 'Prerequisite: Heavy armor proficiency. Increase Str by 1 (max 20). While in heavy armor, reduce non-magical bludgeoning/piercing/slashing damage by 3.' },
  inspiringLeader: { name: 'Inspiring Leader', description: 'Prerequisite: Cha 13+. Spend 10 minutes inspiring up to 6 friendly creatures (including you) within 30 feet. Each gains temporary HP equal to your level + Cha modifier.' },
  keenMind: { name: 'Keen Mind', description: 'Increase Intelligence by 1 (max 20). Always know which way is north. Always know hours until sunrise/sunset. Accurately recall anything you\'ve seen or heard in the past month.' },
  lightlyArmored: { name: 'Lightly Armored', description: 'Increase Str or Dex by 1 (max 20). Gain proficiency with light armor.' },
  linguist: { name: 'Linguist', description: 'Increase Intelligence by 1 (max 20). Learn three languages. Can create written ciphers (DC = Int score + proficiency to decipher without the cipher).' },
  lucky: { name: 'Lucky', description: 'You have 3 luck points. Spend 1 to roll an extra d20 when making an attack/ability check/save (choose which to use after rolling). Or when attacked, spend 1 to roll d20 and choose which the attacker uses. Regain spent luck points after long rest.' },
  magicInitiate: { name: 'Magic Initiate', description: 'Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. Learn 2 cantrips and 1 first-level spell from that class. Cast the spell once per long rest. Spellcasting ability is that class\'s.' },
  martialAdept: { name: 'Martial Adept', description: 'Learn 2 maneuvers from Battle Master. Gain one d6 superiority die (d8 if you have superiority dice). Regain expended superiority die on short/long rest. Save DC = 8 + prof + Str or Dex mod.' },
  mediumArmorMaster: { name: 'Medium Armor Master', description: 'Prerequisite: Medium armor proficiency. Wearing medium armor doesn\'t impose disadvantage on Stealth. Max Dex bonus for AC increases to 3 instead of 2.' },
  mobile: { name: 'Mobile', description: 'Speed increases by 10 feet. When you Dash, difficult terrain doesn\'t cost extra. When you make melee attack against a creature, you don\'t provoke opportunity attacks from that creature for the rest of the turn (hit or miss).' },
  moderatelyArmored: { name: 'Moderately Armored', description: 'Prerequisite: Light armor proficiency. Increase Str or Dex by 1 (max 20). Gain proficiency with medium armor and shields.' },
  mountedCombatant: { name: 'Mounted Combatant', description: 'Advantage on melee attacks vs unmounted creatures smaller than your mount. Force attack targeting mount to target you instead. If mount hit by attack, you can use reaction to halve damage if mount succeeds on Dex save, or give it advantage on the save.' },
  observant: { name: 'Observant', description: 'Increase Int or Wis by 1 (max 20). If you can see a creature\'s mouth, you can lip read. +5 bonus to passive Perception and passive Investigation.' },
  polearmMaster: { name: 'Polearm Master', description: 'When you take Attack action with glaive, halberd, pike, quarterstaff, or spear, bonus action for melee attack with opposite end (d4 bludgeoning). While wielding glaive, halberd, pike, quarterstaff, or spear, creatures provoke opportunity attack when entering your reach.' },
  resilient: { name: 'Resilient', description: 'Choose one ability score. Increase that score by 1 (max 20). Gain proficiency in saving throws using that ability.' },
  ritualCaster: { name: 'Ritual Caster', description: 'Prerequisite: Int or Wis 13+. Choose a class. You acquire a ritual book with two 1st-level ritual spells from that class. Can cast spells in the book as rituals. Can copy ritual spells you find into the book (spell level ≤ half your level, rounded up). Spellcasting ability is that class\'s.' },
  savageAttacker: { name: 'Savage Attacker', description: 'Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total.' },
  sentinel: { name: 'Sentinel', description: 'When you hit a creature with opportunity attack, its speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks even if they Disengage. When a creature within 5 feet attacks a target other than you, you can use reaction to make melee weapon attack against that creature.' },
  sharpshooter: { name: 'Sharpshooter', description: 'Attacking at long range doesn\'t impose disadvantage. Ranged weapon attacks ignore half and three-quarters cover. Before ranged weapon attack, take -5 to hit for +10 damage.' },
  shieldMaster: { name: 'Shield Master', description: 'If you take Attack action, bonus action to shove with shield. If not incapacitated, add shield\'s AC bonus to Dex saves vs spells/harmful effects targeting only you. If you succeed on Dex save for half damage, use reaction to take no damage instead.' },
  skilled: { name: 'Skilled', description: 'Gain proficiency in any combination of 3 skills or tools.' },
  skulker: { name: 'Skulker', description: 'Prerequisite: Dex 13+. You can try to hide when lightly obscured. When hidden and you miss with a ranged weapon attack, making the attack doesn\'t reveal your position. Dim light doesn\'t impose disadvantage on Perception checks relying on sight.' },
  spellSniper: { name: 'Spell Sniper', description: 'Prerequisite: Ability to cast a spell. When you cast a spell that requires an attack roll, double the spell\'s range. Ranged spell attacks ignore half and three-quarters cover. Learn one cantrip that requires an attack roll from any class\'s spell list. Spellcasting ability is that class\'s.' },
  tavernBrawler: { name: 'Tavern Brawler', description: 'Increase Str or Con by 1 (max 20). Proficiency with improvised weapons and unarmed strikes. Unarmed strike uses d4 for damage. When you hit with unarmed strike or improvised weapon, bonus action to grapple.' },
  tough: { name: 'Tough', description: 'Your HP maximum increases by 2× your level, and increases by 2 every time you gain a level.' },
  warCaster: { name: 'War Caster', description: 'Prerequisite: Ability to cast a spell. Advantage on Con saves to maintain concentration. Can perform somatic components even with weapon/shield in hands. When hostile creature provokes opportunity attack, you can use reaction to cast a spell at it (instead of making opportunity attack). Spell must target only that creature and have casting time of 1 action.' },
  weaponMaster: { name: 'Weapon Master', description: 'Increase Str or Dex by 1 (max 20). Gain proficiency with 4 weapons of your choice. Each must be a simple or martial weapon.' }
};

const SPELLS = {
  // CANTRIPS (Level 0)
  acidSplash: { name: 'Acid Splash', level: 0, school: 'conjuration', castTime: '1 action', range: '60 ft', duration: 'Instantaneous', description: 'Hurl a bubble of acid at one or two creatures within 5 ft of each other. Dex save or 1d6 acid damage.', classes: ['sorcerer', 'wizard'] },
  bladeWard: { name: 'Blade Ward', level: 0, school: 'abjuration', castTime: '1 action', range: 'Self', duration: '1 round', description: 'Gain resistance to bludgeoning, piercing, and slashing damage from weapon attacks.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  chillTouch: { name: 'Chill Touch', level: 0, school: 'necromancy', castTime: '1 action', range: '120 ft', duration: '1 round', description: 'Ghostly skeletal hand deals 1d8 necrotic damage and prevents healing until your next turn.', classes: ['sorcerer', 'warlock', 'wizard'] },
  dancingLights: { name: 'Dancing Lights', level: 0, school: 'evocation', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Create up to four torch-sized lights that you can move and combine.', classes: ['bard', 'sorcerer', 'wizard'] },
  druidcraft: { name: 'Druidcraft', level: 0, school: 'transmutation', castTime: '1 action', range: '30 ft', duration: 'Instantaneous', description: 'Create minor nature effects: predict weather, bloom flower, sensory effect, or light/snuff flame.', classes: ['druid'] },
  eldritchBlast: { name: 'Eldritch Blast', level: 0, school: 'evocation', castTime: '1 action', range: '120 ft', duration: 'Instantaneous', description: 'Beam of crackling energy deals 1d10 force damage. Additional beams at higher levels.', classes: ['warlock'] },
  fireBolt: { name: 'Fire Bolt', level: 0, school: 'evocation', castTime: '1 action', range: '120 ft', duration: 'Instantaneous', description: 'Hurl a mote of fire. Ranged spell attack for 1d10 fire damage. Ignites flammable objects.', classes: ['sorcerer', 'wizard'] },
  friends: { name: 'Friends', level: 0, school: 'enchantment', castTime: '1 action', range: 'Self', duration: '1 minute', description: 'Gain advantage on Charisma checks against one creature, but it becomes hostile after.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  guidance: { name: 'Guidance', level: 0, school: 'divination', castTime: '1 action', range: 'Touch', duration: '1 minute', description: 'Target can add 1d4 to one ability check of its choice.', classes: ['cleric', 'druid'] },
  light: { name: 'Light', level: 0, school: 'evocation', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Object sheds bright light in 20-ft radius and dim light for additional 20 ft.', classes: ['bard', 'cleric', 'sorcerer', 'wizard'] },
  mageHand: { name: 'Mage Hand', level: 0, school: 'conjuration', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Spectral floating hand can manipulate objects, open doors, or retrieve items up to 10 lbs.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  mending: { name: 'Mending', level: 0, school: 'transmutation', castTime: '1 minute', range: 'Touch', duration: 'Instantaneous', description: 'Repair a single break or tear in an object (no larger than 1 ft).', classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'] },
  message: { name: 'Message', level: 0, school: 'transmutation', castTime: '1 action', range: '120 ft', duration: '1 round', description: 'Whisper a message to a creature within range. It can reply in a whisper.', classes: ['bard', 'sorcerer', 'wizard'] },
  minorIllusion: { name: 'Minor Illusion', level: 0, school: 'illusion', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Create a sound or image of an object. Investigation check to determine illusion.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  poisonSpray: { name: 'Poison Spray', level: 0, school: 'conjuration', castTime: '1 action', range: '10 ft', duration: 'Instantaneous', description: 'Puff of noxious gas. Con save or 1d12 poison damage.', classes: ['druid', 'sorcerer', 'warlock', 'wizard'] },
  prestidigitation: { name: 'Prestidigitation', level: 0, school: 'transmutation', castTime: '1 action', range: '10 ft', duration: '1 hour', description: 'Minor magical trick: sensory effect, light/snuff, clean/soil, warm/chill, flavor, symbol.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  produceFlame: { name: 'Produce Flame', level: 0, school: 'conjuration', castTime: '1 action', range: 'Self', duration: '10 minutes', description: 'Flickering flame provides light or can be hurled for 1d8 fire damage.', classes: ['druid'] },
  rayOfFrost: { name: 'Ray of Frost', level: 0, school: 'evocation', castTime: '1 action', range: '60 ft', duration: 'Instantaneous', description: 'Frigid beam deals 1d8 cold damage and reduces speed by 10 ft until your next turn.', classes: ['sorcerer', 'wizard'] },
  resistance: { name: 'Resistance', level: 0, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '1 minute', description: 'Target can add 1d4 to one saving throw of its choice.', classes: ['cleric', 'druid'] },
  sacredFlame: { name: 'Sacred Flame', level: 0, school: 'evocation', castTime: '1 action', range: '60 ft', duration: 'Instantaneous', description: 'Flame-like radiance. Dex save or 1d8 radiant damage. No benefit from cover.', classes: ['cleric'] },
  shillelagh: { name: 'Shillelagh', level: 0, school: 'transmutation', castTime: '1 bonus action', range: 'Touch', duration: '1 minute', description: 'Club or quarterstaff becomes magical, uses spellcasting ability, and deals 1d8 damage.', classes: ['druid'] },
  shockingGrasp: { name: 'Shocking Grasp', level: 0, school: 'evocation', castTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'Lightning springs from your hand. 1d8 lightning damage, target can\'t take reactions.', classes: ['sorcerer', 'wizard'] },
  spareTheDying: { name: 'Spare the Dying', level: 0, school: 'necromancy', castTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'Stabilize a creature at 0 HP.', classes: ['cleric'] },
  thaumaturgy: { name: 'Thaumaturgy', level: 0, school: 'transmutation', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Minor divine wonder: booming voice, flames flicker, tremors, sounds, doors open/close.', classes: ['cleric'] },
  thornWhip: { name: 'Thorn Whip', level: 0, school: 'transmutation', castTime: '1 action', range: '30 ft', duration: 'Instantaneous', description: 'Vine-like whip deals 1d6 piercing and pulls Large or smaller creature 10 ft closer.', classes: ['druid'] },
  trueStrike: { name: 'True Strike', level: 0, school: 'divination', castTime: '1 action', range: '30 ft', duration: '1 round', description: 'Gain advantage on your first attack roll against the target on your next turn.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  viciousMockery: { name: 'Vicious Mockery', level: 0, school: 'enchantment', castTime: '1 action', range: '60 ft', duration: 'Instantaneous', description: 'Psychic insults deal 1d4 psychic damage and impose disadvantage on next attack.', classes: ['bard'] },

  // 1ST LEVEL SPELLS
  alarm: { name: 'Alarm', level: 1, school: 'abjuration', castTime: '1 minute', range: '30 ft', duration: '8 hours', description: 'Set a ward that alerts you when a creature enters a 20-ft cube area.', classes: ['ranger', 'wizard'], ritual: true },
  armorOfAgathys: { name: 'Armor of Agathys', level: 1, school: 'abjuration', castTime: '1 action', range: 'Self', duration: '1 hour', description: 'Gain 5 temp HP. While active, creatures hitting you in melee take 5 cold damage.', classes: ['warlock'] },
  bane: { name: 'Bane', level: 1, school: 'enchantment', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Up to 3 creatures subtract 1d4 from attack rolls and saving throws.', classes: ['bard', 'cleric'], concentration: true },
  bless: { name: 'Bless', level: 1, school: 'enchantment', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Up to 3 creatures add 1d4 to attack rolls and saving throws.', classes: ['cleric', 'paladin'], concentration: true },
  burningHands: { name: 'Burning Hands', level: 1, school: 'evocation', castTime: '1 action', range: 'Self (15-ft cone)', duration: 'Instantaneous', description: 'Each creature in 15-ft cone takes 3d6 fire damage (Dex half).', classes: ['sorcerer', 'wizard'] },
  charmPerson: { name: 'Charm Person', level: 1, school: 'enchantment', castTime: '1 action', range: '30 ft', duration: '1 hour', description: 'Humanoid regards you as friendly. Wis save. Advantage if you\'re fighting it.', classes: ['bard', 'druid', 'sorcerer', 'warlock', 'wizard'], concentration: true },
  chromaticOrb: { name: 'Chromatic Orb', level: 1, school: 'evocation', castTime: '1 action', range: '90 ft', duration: 'Instantaneous', description: 'Hurl orb of acid, cold, fire, lightning, poison, or thunder for 3d8 damage.', classes: ['sorcerer', 'wizard'] },
  colorSpray: { name: 'Color Spray', level: 1, school: 'illusion', castTime: '1 action', range: 'Self (15-ft cone)', duration: '1 round', description: 'Blind creatures in cone with total HP up to 6d10 (starting from lowest HP).', classes: ['sorcerer', 'wizard'] },
  command: { name: 'Command', level: 1, school: 'enchantment', castTime: '1 action', range: '60 ft', duration: '1 round', description: 'Speak one-word command. Wis save or target follows command on its turn.', classes: ['cleric', 'paladin'] },
  compelledDuel: { name: 'Compelled Duel', level: 1, school: 'enchantment', castTime: '1 bonus action', range: '30 ft', duration: '1 minute', description: 'Force creature to fight you. Wis save or disadvantage on attacks against others.', classes: ['paladin'], concentration: true },
  cureWounds: { name: 'Cure Wounds', level: 1, school: 'evocation', castTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'Heal 1d8 + spellcasting modifier HP.', classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger'] },
  detectMagic: { name: 'Detect Magic', level: 1, school: 'divination', castTime: '1 action', range: 'Self', duration: '10 minutes', description: 'Sense magic within 30 ft and see its aura. See through most barriers.', classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'wizard'], ritual: true, concentration: true },
  disguiseSelf: { name: 'Disguise Self', level: 1, school: 'illusion', castTime: '1 action', range: 'Self', duration: '1 hour', description: 'Change your appearance including clothing, armor, weapons, and other belongings.', classes: ['bard', 'sorcerer', 'wizard'] },
  dissonantWhispers: { name: 'Dissonant Whispers', level: 1, school: 'enchantment', castTime: '1 action', range: '60 ft', duration: 'Instantaneous', description: 'Whisper discordant melody. 3d6 psychic damage, Wis save or flee.', classes: ['bard'] },
  divineFavor: { name: 'Divine Favor', level: 1, school: 'evocation', castTime: '1 bonus action', range: 'Self', duration: '1 minute', description: 'Your weapon attacks deal extra 1d4 radiant damage.', classes: ['paladin'] },
  entangle: { name: 'Entangle', level: 1, school: 'conjuration', castTime: '1 action', range: '90 ft', duration: '1 minute', description: 'Grasping weeds in 20-ft square. Str save or restrained. Difficult terrain.', classes: ['druid'], concentration: true },
  expeditiousRetreat: { name: 'Expeditious Retreat', level: 1, school: 'transmutation', castTime: '1 bonus action', range: 'Self', duration: '10 minutes', description: 'Dash as bonus action for duration.', classes: ['sorcerer', 'warlock', 'wizard'], concentration: true },
  faerieFire: { name: 'Faerie Fire', level: 1, school: 'evocation', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Objects and creatures in 20-ft cube outlined in light. Attacks have advantage.', classes: ['bard', 'druid'], concentration: true },
  falseLife: { name: 'False Life', level: 1, school: 'necromancy', castTime: '1 action', range: 'Self', duration: '1 hour', description: 'Gain 1d4 + 4 temporary HP.', classes: ['sorcerer', 'wizard'] },
  featherFall: { name: 'Feather Fall', level: 1, school: 'transmutation', castTime: '1 reaction', range: '60 ft', duration: '1 minute', description: 'Up to 5 falling creatures slow to 60 ft/round and take no falling damage.', classes: ['bard', 'sorcerer', 'wizard'] },
  findFamiliar: { name: 'Find Familiar', level: 1, school: 'conjuration', castTime: '1 hour', range: '10 ft', duration: 'Instantaneous', description: 'Summon a spirit as bat, cat, owl, etc. Telepathic link, can see through its senses.', classes: ['wizard'], ritual: true },
  fogCloud: { name: 'Fog Cloud', level: 1, school: 'conjuration', castTime: '1 action', range: '120 ft', duration: '1 hour', description: 'Create 20-ft radius sphere of fog. Area is heavily obscured.', classes: ['druid', 'ranger', 'sorcerer', 'wizard'], concentration: true },
  goodberry: { name: 'Goodberry', level: 1, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'Create 10 berries. Each heals 1 HP and provides nourishment for a day.', classes: ['druid', 'ranger'] },
  grease: { name: 'Grease', level: 1, school: 'conjuration', castTime: '1 action', range: '60 ft', duration: '1 minute', description: '10-ft square becomes difficult terrain. Dex save or fall prone.', classes: ['wizard'], concentration: true },
  guidingBolt: { name: 'Guiding Bolt', level: 1, school: 'evocation', castTime: '1 action', range: '120 ft', duration: '1 round', description: '4d6 radiant damage. Next attack against target has advantage.', classes: ['cleric'] },
  healingWord: { name: 'Healing Word', level: 1, school: 'evocation', castTime: '1 bonus action', range: '60 ft', duration: 'Instantaneous', description: 'Heal 1d4 + spellcasting modifier HP at range.', classes: ['bard', 'cleric', 'druid'] },
  hellishRebuke: { name: 'Hellish Rebuke', level: 1, school: 'evocation', castTime: '1 reaction', range: '60 ft', duration: 'Instantaneous', description: 'When damaged, creature takes 2d10 fire damage (Dex half).', classes: ['warlock'] },
  heroism: { name: 'Heroism', level: 1, school: 'enchantment', castTime: '1 action', range: 'Touch', duration: '1 minute', description: 'Target immune to frightened, gains temp HP equal to spellcasting mod each turn.', classes: ['bard', 'paladin'], concentration: true },
  hex: { name: 'Hex', level: 1, school: 'enchantment', castTime: '1 bonus action', range: '90 ft', duration: '1 hour', description: 'Curse target. Deal extra 1d6 necrotic on hits. Disadvantage on one ability checks.', classes: ['warlock'], concentration: true },
  huntersMark: { name: 'Hunter\'s Mark', level: 1, school: 'divination', castTime: '1 bonus action', range: '90 ft', duration: '1 hour', description: 'Mark prey. Deal extra 1d6 damage on hits. Advantage on tracking.', classes: ['ranger'], concentration: true },
  identify: { name: 'Identify', level: 1, school: 'divination', castTime: '1 minute', range: 'Touch', duration: 'Instantaneous', description: 'Learn properties of magic item or if creature is affected by spell.', classes: ['bard', 'wizard'], ritual: true },
  inflictWounds: { name: 'Inflict Wounds', level: 1, school: 'necromancy', castTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'Melee spell attack deals 3d10 necrotic damage.', classes: ['cleric'] },
  jump: { name: 'Jump', level: 1, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '1 minute', description: 'Triple target\'s jump distance.', classes: ['druid', 'ranger', 'sorcerer', 'wizard'] },
  longstrider: { name: 'Longstrider', level: 1, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target\'s speed increases by 10 ft.', classes: ['bard', 'druid', 'ranger', 'wizard'] },
  mageArmor: { name: 'Mage Armor', level: 1, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '8 hours', description: 'Target\'s base AC becomes 13 + Dex modifier (no armor).', classes: ['sorcerer', 'wizard'] },
  magicMissile: { name: 'Magic Missile', level: 1, school: 'evocation', castTime: '1 action', range: '120 ft', duration: 'Instantaneous', description: 'Three darts automatically hit for 1d4+1 force damage each.', classes: ['sorcerer', 'wizard'] },
  protectionFromEvilAndGood: { name: 'Protection from Evil and Good', level: 1, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '10 minutes', description: 'Protect against aberrations, celestials, elementals, fey, fiends, undead.', classes: ['cleric', 'paladin', 'warlock', 'wizard'] },
  sanctuary: { name: 'Sanctuary', level: 1, school: 'abjuration', castTime: '1 bonus action', range: '30 ft', duration: '1 minute', description: 'Creatures must make Wis save to attack warded target.', classes: ['cleric'] },
  shield: { name: 'Shield', level: 1, school: 'abjuration', castTime: '1 reaction', range: 'Self', duration: '1 round', description: '+5 AC until your next turn, including against triggering attack.', classes: ['sorcerer', 'wizard'] },
  shieldOfFaith: { name: 'Shield of Faith', level: 1, school: 'abjuration', castTime: '1 bonus action', range: '60 ft', duration: '10 minutes', description: 'Target gains +2 AC.', classes: ['cleric', 'paladin'] },
  sleep: { name: 'Sleep', level: 1, school: 'enchantment', castTime: '1 action', range: '90 ft', duration: '1 minute', description: 'Creatures with HP totaling up to 5d8 fall unconscious (lowest HP first).', classes: ['bard', 'sorcerer', 'wizard'] },
  speakWithAnimals: { name: 'Speak with Animals', level: 1, school: 'divination', castTime: '1 action', range: 'Self', duration: '10 minutes', description: 'Communicate with beasts. Intelligence limits information.', classes: ['bard', 'druid', 'ranger'], ritual: true },
  tashasHideousLaughter: { name: 'Tasha\'s Hideous Laughter', level: 1, school: 'enchantment', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Creature falls prone laughing. Incapacitated, can\'t stand. Wis save each turn.', classes: ['bard', 'wizard'] },
  thunderwave: { name: 'Thunderwave', level: 1, school: 'evocation', castTime: '1 action', range: 'Self (15-ft cube)', duration: 'Instantaneous', description: '2d8 thunder damage in 15-ft cube. Con save or pushed 10 ft.', classes: ['bard', 'druid', 'sorcerer', 'wizard'] },
  witchBolt: { name: 'Witch Bolt', level: 1, school: 'evocation', castTime: '1 action', range: '30 ft', duration: '1 minute', description: '1d12 lightning damage. Use action each turn to auto-deal 1d12 more.', classes: ['sorcerer', 'warlock', 'wizard'] },
  wrathfulSmite: { name: 'Wrathful Smite', level: 1, school: 'evocation', castTime: '1 bonus action', range: 'Self', duration: '1 minute', description: 'Next hit deals +1d6 psychic. Wis save or frightened.', classes: ['paladin'] },

  // 2ND LEVEL SPELLS
  aid: { name: 'Aid', level: 2, school: 'abjuration', castTime: '1 action', range: '30 ft', duration: '8 hours', description: 'Up to 3 creatures gain 5 extra max HP and current HP for duration.', classes: ['cleric', 'paladin'] },
  alterSelf: { name: 'Alter Self', level: 2, school: 'transmutation', castTime: '1 action', range: 'Self', duration: '1 hour', description: 'Transform your body: aquatic adaptation, change appearance, or natural weapons.', classes: ['sorcerer', 'wizard'] },
  barkskin: { name: 'Barkskin', level: 2, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target\'s AC can\'t be less than 16, regardless of armor.', classes: ['druid', 'ranger'] },
  blindnessDeafness: { name: 'Blindness/Deafness', level: 2, school: 'necromancy', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Con save or creature is blinded or deafened for duration.', classes: ['bard', 'cleric', 'sorcerer', 'wizard'] },
  blur: { name: 'Blur', level: 2, school: 'illusion', castTime: '1 action', range: 'Self', duration: '1 minute', description: 'Attackers have disadvantage on attack rolls against you.', classes: ['sorcerer', 'wizard'] },
  brandingSmite: { name: 'Branding Smite', level: 2, school: 'evocation', castTime: '1 bonus action', range: 'Self', duration: '1 minute', description: 'Next hit deals +2d6 radiant and target sheds light, can\'t become invisible.', classes: ['paladin'] },
  calmEmotions: { name: 'Calm Emotions', level: 2, school: 'enchantment', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Suppress strong emotions in 20-ft sphere. End charm/frighten or make indifferent.', classes: ['bard', 'cleric'] },
  cloudOfDaggers: { name: 'Cloud of Daggers', level: 2, school: 'conjuration', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Spinning daggers in 5-ft cube deal 4d4 slashing to creatures entering.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  crownOfMadness: { name: 'Crown of Madness', level: 2, school: 'enchantment', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Wis save or charmed and must attack nearest creature on its turn.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  darkness: { name: 'Darkness', level: 2, school: 'evocation', castTime: '1 action', range: '60 ft', duration: '10 minutes', description: 'Magical darkness fills 15-ft sphere. Darkvision can\'t see through it.', classes: ['sorcerer', 'warlock', 'wizard'] },
  darkvision: { name: 'Darkvision', level: 2, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '8 hours', description: 'Target gains darkvision out to 60 ft.', classes: ['druid', 'ranger', 'sorcerer', 'wizard'] },
  detectThoughts: { name: 'Detect Thoughts', level: 2, school: 'divination', castTime: '1 action', range: 'Self', duration: '1 minute', description: 'Read surface thoughts of creatures within 30 ft. Wis save to probe deeper.', classes: ['bard', 'sorcerer', 'wizard'] },
  enhanceAbility: { name: 'Enhance Ability', level: 2, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Grant advantage on checks with one ability. Some options grant extra benefits.', classes: ['bard', 'cleric', 'druid', 'sorcerer'] },
  enlargeReduce: { name: 'Enlarge/Reduce', level: 2, school: 'transmutation', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Double or halve target\'s size. Affects damage and Str checks.', classes: ['sorcerer', 'wizard'] },
  enthrall: { name: 'Enthrall', level: 2, school: 'enchantment', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Wis save or creatures have disadvantage on Perception checks.', classes: ['bard', 'warlock'] },
  findSteed: { name: 'Find Steed', level: 2, school: 'conjuration', castTime: '10 minutes', range: '30 ft', duration: 'Instantaneous', description: 'Summon a loyal warhorse, pony, camel, elk, or mastiff.', classes: ['paladin'] },
  flameBlade: { name: 'Flame Blade', level: 2, school: 'evocation', castTime: '1 bonus action', range: 'Self', duration: '10 minutes', description: 'Create flaming blade. Melee spell attack deals 3d6 fire damage.', classes: ['druid'] },
  flamingSphere: { name: 'Flaming Sphere', level: 2, school: 'conjuration', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Create 5-ft sphere of fire. 2d6 fire damage to nearby creatures.', classes: ['druid', 'wizard'] },
  gentleRepose: { name: 'Gentle Repose', level: 2, school: 'necromancy', castTime: '1 action', range: 'Touch', duration: '10 days', description: 'Protect corpse from decay and becoming undead.', classes: ['cleric', 'wizard'], ritual: true },
  gustOfWind: { name: 'Gust of Wind', level: 2, school: 'evocation', castTime: '1 action', range: 'Self (60-ft line)', duration: '1 minute', description: 'Strong wind in 60-ft line. Str save or pushed 15 ft. Difficult terrain.', classes: ['druid', 'sorcerer', 'wizard'] },
  heat_metal: { name: 'Heat Metal', level: 2, school: 'transmutation', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Heat metal object. 2d8 fire damage to holder. Con save or drop it.', classes: ['bard', 'druid'] },
  holdPerson: { name: 'Hold Person', level: 2, school: 'enchantment', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Wis save or humanoid is paralyzed. Save each turn to end.', classes: ['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard'] },
  invisibility: { name: 'Invisibility', level: 2, school: 'illusion', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target becomes invisible until it attacks or casts a spell.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  knock: { name: 'Knock', level: 2, school: 'transmutation', castTime: '1 action', range: '60 ft', duration: 'Instantaneous', description: 'Unlock one lock, bar, or seal. Magically locked items are suppressed.', classes: ['bard', 'sorcerer', 'wizard'] },
  lesserRestoration: { name: 'Lesser Restoration', level: 2, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'End one disease or condition: blinded, deafened, paralyzed, or poisoned.', classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger'] },
  levitate: { name: 'Levitate', level: 2, school: 'transmutation', castTime: '1 action', range: '60 ft', duration: '10 minutes', description: 'Target rises up to 20 ft and floats. Can move by pushing/pulling.', classes: ['sorcerer', 'wizard'] },
  locateObject: { name: 'Locate Object', level: 2, school: 'divination', castTime: '1 action', range: 'Self', duration: '10 minutes', description: 'Sense direction of specific or general object within 1000 ft.', classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'wizard'] },
  magicWeapon: { name: 'Magic Weapon', level: 2, school: 'transmutation', castTime: '1 bonus action', range: 'Touch', duration: '1 hour', description: 'Weapon becomes +1 magic weapon.', classes: ['paladin', 'wizard'] },
  mirrorImage: { name: 'Mirror Image', level: 2, school: 'illusion', castTime: '1 action', range: 'Self', duration: '1 minute', description: 'Create 3 illusory duplicates. Attacks may hit duplicates instead.', classes: ['sorcerer', 'warlock', 'wizard'] },
  mistyStep: { name: 'Misty Step', level: 2, school: 'conjuration', castTime: '1 bonus action', range: 'Self', duration: 'Instantaneous', description: 'Teleport up to 30 ft to unoccupied space you can see.', classes: ['sorcerer', 'warlock', 'wizard'] },
  moonbeam: { name: 'Moonbeam', level: 2, school: 'evocation', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Silvery beam in 5-ft cylinder. 2d10 radiant damage. Con save for half.', classes: ['druid'] },
  passWithoutTrace: { name: 'Pass without Trace', level: 2, school: 'abjuration', castTime: '1 action', range: 'Self', duration: '1 hour', description: 'You and nearby allies gain +10 to Stealth and can\'t be tracked.', classes: ['druid', 'ranger'] },
  phantasmalForce: { name: 'Phantasmal Force', level: 2, school: 'illusion', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Int save or creature perceives illusory object. 1d6 psychic per turn.', classes: ['bard', 'sorcerer', 'wizard'] },
  prayerOfHealing: { name: 'Prayer of Healing', level: 2, school: 'evocation', castTime: '10 minutes', range: '30 ft', duration: 'Instantaneous', description: 'Up to 6 creatures heal 2d8 + spellcasting modifier HP.', classes: ['cleric'] },
  protectionFromPoison: { name: 'Protection from Poison', level: 2, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Neutralize one poison. Advantage on saves vs poison, resistance to poison damage.', classes: ['cleric', 'druid', 'paladin', 'ranger'] },
  rayOfEnfeeblement: { name: 'Ray of Enfeeblement', level: 2, school: 'necromancy', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Ranged spell attack. Target deals half damage with Str weapons.', classes: ['warlock', 'wizard'] },
  scorchingRay: { name: 'Scorching Ray', level: 2, school: 'evocation', castTime: '1 action', range: '120 ft', duration: 'Instantaneous', description: 'Create 3 rays. Each ray deals 2d6 fire damage on hit.', classes: ['sorcerer', 'wizard'] },
  seeInvisibility: { name: 'See Invisibility', level: 2, school: 'divination', castTime: '1 action', range: 'Self', duration: '1 hour', description: 'See invisible creatures and objects, and into the Ethereal Plane.', classes: ['bard', 'sorcerer', 'wizard'] },
  shatter: { name: 'Shatter', level: 2, school: 'evocation', castTime: '1 action', range: '60 ft', duration: 'Instantaneous', description: 'Loud noise in 10-ft sphere. 3d8 thunder damage. Con save for half.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  silence: { name: 'Silence', level: 2, school: 'illusion', castTime: '1 action', range: '120 ft', duration: '10 minutes', description: 'No sound in 20-ft sphere. Creatures immune to thunder, can\'t cast verbal spells.', classes: ['bard', 'cleric', 'ranger'], ritual: true },
  spiderClimb: { name: 'Spider Climb', level: 2, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target can climb walls and ceilings, hands free.', classes: ['sorcerer', 'warlock', 'wizard'] },
  spikeGrowth: { name: 'Spike Growth', level: 2, school: 'transmutation', castTime: '1 action', range: '150 ft', duration: '10 minutes', description: 'Ground sprouts spikes. 2d4 piercing per 5 ft moved. Difficult terrain.', classes: ['druid', 'ranger'] },
  spiritualWeapon: { name: 'Spiritual Weapon', level: 2, school: 'evocation', castTime: '1 bonus action', range: '60 ft', duration: '1 minute', description: 'Create floating weapon. 1d8 + modifier force damage. Bonus action to attack.', classes: ['cleric'] },
  suggestion: { name: 'Suggestion', level: 2, school: 'enchantment', castTime: '1 action', range: '30 ft', duration: '8 hours', description: 'Wis save or creature follows reasonable suggestion.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  wardingBond: { name: 'Warding Bond', level: 2, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target gains +1 AC, +1 saves, resistance. You take same damage they take.', classes: ['cleric'] },
  web: { name: 'Web', level: 2, school: 'conjuration', castTime: '1 action', range: '60 ft', duration: '1 hour', description: 'Fill 20-ft cube with webs. Dex save or restrained. Difficult terrain.', classes: ['sorcerer', 'wizard'] },
  zoneOfTruth: { name: 'Zone of Truth', level: 2, school: 'enchantment', castTime: '1 action', range: '60 ft', duration: '10 minutes', description: 'Creatures in 15-ft sphere can\'t deliberately lie. Cha save to avoid.', classes: ['bard', 'cleric', 'paladin'] },

  // 3RD LEVEL SPELLS
  animateDead: { name: 'Animate Dead', level: 3, school: 'necromancy', castTime: '1 minute', range: '10 ft', duration: 'Instantaneous', description: 'Create skeleton or zombie servant from bones or corpse.', classes: ['cleric', 'wizard'] },
  auraOfVitality: { name: 'Aura of Vitality', level: 3, school: 'evocation', castTime: '1 action', range: 'Self (30-ft radius)', duration: '1 minute', description: 'Bonus action to heal one creature in aura for 2d6 HP.', classes: ['paladin'] },
  beaconOfHope: { name: 'Beacon of Hope', level: 3, school: 'abjuration', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Creatures have advantage on Wis saves and death saves. Max healing.', classes: ['cleric'] },
  bestowCurse: { name: 'Bestow Curse', level: 3, school: 'necromancy', castTime: '1 action', range: 'Touch', duration: '1 minute', description: 'Wis save or cursed with various debilitating effects.', classes: ['bard', 'cleric', 'wizard'] },
  blinkSpell: { name: 'Blink', level: 3, school: 'transmutation', castTime: '1 action', range: 'Self', duration: '1 minute', description: 'Roll d20 each turn. 11+ you vanish to Ethereal Plane until next turn.', classes: ['sorcerer', 'wizard'] },
  callLightning: { name: 'Call Lightning', level: 3, school: 'conjuration', castTime: '1 action', range: '120 ft', duration: '10 minutes', description: 'Storm cloud. Action to call 3d10 lightning bolt. Dex save for half.', classes: ['druid'] },
  clairvoyance: { name: 'Clairvoyance', level: 3, school: 'divination', castTime: '10 minutes', range: '1 mile', duration: '10 minutes', description: 'Create invisible sensor to see or hear at a familiar location.', classes: ['bard', 'cleric', 'sorcerer', 'wizard'] },
  conjureAnimals: { name: 'Conjure Animals', level: 3, school: 'conjuration', castTime: '1 action', range: '60 ft', duration: '1 hour', description: 'Summon fey spirits as beasts. CR depends on number summoned.', classes: ['druid', 'ranger'] },
  counterspell: { name: 'Counterspell', level: 3, school: 'abjuration', castTime: '1 reaction', range: '60 ft', duration: 'Instantaneous', description: 'Interrupt spell being cast. Auto-success if same level or lower.', classes: ['sorcerer', 'warlock', 'wizard'] },
  createFoodAndWater: { name: 'Create Food and Water', level: 3, school: 'conjuration', castTime: '1 action', range: '30 ft', duration: 'Instantaneous', description: 'Create 45 pounds of food and 30 gallons of water.', classes: ['cleric', 'paladin'] },
  crusadersMantle: { name: 'Crusader\'s Mantle', level: 3, school: 'evocation', castTime: '1 action', range: 'Self', duration: '1 minute', description: 'Allies within 30 ft deal extra 1d4 radiant on weapon hits.', classes: ['paladin'] },
  daylight: { name: 'Daylight', level: 3, school: 'evocation', castTime: '1 action', range: '60 ft', duration: '1 hour', description: '60-ft sphere of bright light. Dispels darkness spells of 3rd or lower.', classes: ['cleric', 'druid', 'paladin', 'ranger', 'sorcerer'] },
  dispelMagic: { name: 'Dispel Magic', level: 3, school: 'abjuration', castTime: '1 action', range: '120 ft', duration: 'Instantaneous', description: 'End spells of 3rd level or lower. Check required for higher levels.', classes: ['bard', 'cleric', 'druid', 'paladin', 'sorcerer', 'warlock', 'wizard'] },
  elementalWeapon: { name: 'Elemental Weapon', level: 3, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Weapon becomes +1 magic and deals extra 1d4 elemental damage.', classes: ['paladin'] },
  fear: { name: 'Fear', level: 3, school: 'illusion', castTime: '1 action', range: 'Self (30-ft cone)', duration: '1 minute', description: 'Wis save or creatures drop held items and become frightened.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  feign_death: { name: 'Feign Death', level: 3, school: 'necromancy', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Willing creature appears dead. Blinded, incapacitated, resistant to all but psychic.', classes: ['bard', 'cleric', 'druid', 'wizard'], ritual: true },
  fireball: { name: 'Fireball', level: 3, school: 'evocation', castTime: '1 action', range: '150 ft', duration: 'Instantaneous', description: '20-ft radius explosion. 8d6 fire damage. Dex save for half.', classes: ['sorcerer', 'wizard'] },
  fly: { name: 'Fly', level: 3, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '10 minutes', description: 'Target gains 60 ft flying speed.', classes: ['sorcerer', 'warlock', 'wizard'] },
  gaseousForm: { name: 'Gaseous Form', level: 3, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target becomes misty cloud. 10 ft fly, can pass through tiny openings.', classes: ['sorcerer', 'warlock', 'wizard'] },
  glyph_of_warding: { name: 'Glyph of Warding', level: 3, school: 'abjuration', castTime: '1 hour', range: 'Touch', duration: 'Until dispelled', description: 'Inscribe glyph that triggers spell or explosion when conditions met.', classes: ['bard', 'cleric', 'wizard'] },
  haste: { name: 'Haste', level: 3, school: 'transmutation', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Double speed, +2 AC, advantage on Dex saves, extra action.', classes: ['sorcerer', 'wizard'] },
  hungerOfHadar: { name: 'Hunger of Hadar', level: 3, school: 'conjuration', castTime: '1 action', range: '150 ft', duration: '1 minute', description: 'Void sphere. Cold damage start of turn, acid damage end of turn.', classes: ['warlock'] },
  hypnoticPattern: { name: 'Hypnotic Pattern', level: 3, school: 'illusion', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Wis save or charmed, incapacitated, speed 0 in 30-ft cube.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  leomundsTinyHut: { name: 'Leomund\'s Tiny Hut', level: 3, school: 'evocation', castTime: '1 minute', range: 'Self (10-ft hemisphere)', duration: '8 hours', description: 'Create dome shelter for up to 9 creatures. Blocks spells.', classes: ['bard', 'wizard'], ritual: true },
  lightningBolt: { name: 'Lightning Bolt', level: 3, school: 'evocation', castTime: '1 action', range: 'Self (100-ft line)', duration: 'Instantaneous', description: '100-ft line. 8d6 lightning damage. Dex save for half.', classes: ['sorcerer', 'wizard'] },
  magicCircle: { name: 'Magic Circle', level: 3, school: 'abjuration', castTime: '1 minute', range: '10 ft', duration: '1 hour', description: 'Cylinder protects against celestials, elementals, fey, fiends, or undead.', classes: ['cleric', 'paladin', 'warlock', 'wizard'] },
  majorImage: { name: 'Major Image', level: 3, school: 'illusion', castTime: '1 action', range: '120 ft', duration: '10 minutes', description: 'Create illusory image with sound, smell, temperature. Int check to see through.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  massHealingWord: { name: 'Mass Healing Word', level: 3, school: 'evocation', castTime: '1 bonus action', range: '60 ft', duration: 'Instantaneous', description: 'Up to 6 creatures heal 1d4 + spellcasting modifier HP.', classes: ['cleric'] },
  meldIntoStone: { name: 'Meld into Stone', level: 3, school: 'transmutation', castTime: '1 action', range: 'Touch', duration: '8 hours', description: 'Step into stone surface large enough to contain you.', classes: ['cleric', 'druid'], ritual: true },
  nondetection: { name: 'Nondetection', level: 3, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '8 hours', description: 'Target hidden from divination magic.', classes: ['bard', 'ranger', 'wizard'] },
  phantomSteed: { name: 'Phantom Steed', level: 3, school: 'illusion', castTime: '1 minute', range: '30 ft', duration: '1 hour', description: 'Create quasi-real horse with 100 ft speed.', classes: ['wizard'], ritual: true },
  plantGrowth: { name: 'Plant Growth', level: 3, school: 'transmutation', castTime: '1 action or 8 hours', range: '150 ft', duration: 'Instantaneous', description: 'Enrich land or cause overgrowth making difficult terrain.', classes: ['bard', 'druid', 'ranger'] },
  protectionFromEnergy: { name: 'Protection from Energy', level: 3, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target has resistance to acid, cold, fire, lightning, or thunder.', classes: ['cleric', 'druid', 'ranger', 'sorcerer', 'wizard'] },
  removeCurse: { name: 'Remove Curse', level: 3, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'End all curses affecting one creature or object.', classes: ['cleric', 'paladin', 'warlock', 'wizard'] },
  revivify: { name: 'Revivify', level: 3, school: 'necromancy', castTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'Return creature dead less than 1 minute to life with 1 HP.', classes: ['cleric', 'paladin'] },
  sendingSpell: { name: 'Sending', level: 3, school: 'evocation', castTime: '1 action', range: 'Unlimited', duration: '1 round', description: 'Send 25-word message to creature you know. It can reply.', classes: ['bard', 'cleric', 'wizard'] },
  slow: { name: 'Slow', level: 3, school: 'transmutation', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Wis save or speed halved, -2 AC, -2 Dex saves, no reactions, limited actions.', classes: ['sorcerer', 'wizard'] },
  speakWithDead: { name: 'Speak with Dead', level: 3, school: 'necromancy', castTime: '1 action', range: '10 ft', duration: '10 minutes', description: 'Ask corpse up to 5 questions.', classes: ['bard', 'cleric'] },
  speakWithPlants: { name: 'Speak with Plants', level: 3, school: 'transmutation', castTime: '1 action', range: 'Self (30-ft radius)', duration: '10 minutes', description: 'Communicate with plants. Can make difficult terrain passable.', classes: ['bard', 'druid', 'ranger'] },
  spiritGuardians: { name: 'Spirit Guardians', level: 3, school: 'conjuration', castTime: '1 action', range: 'Self (15-ft radius)', duration: '10 minutes', description: 'Spirits protect you. Enemies take 3d8 radiant/necrotic damage. Wis save half.', classes: ['cleric'] },
  stinkingCloud: { name: 'Stinking Cloud', level: 3, school: 'conjuration', castTime: '1 action', range: '90 ft', duration: '1 minute', description: 'Nauseating gas in 20-ft sphere. Con save or waste action retching.', classes: ['bard', 'sorcerer', 'wizard'] },
  tongues: { name: 'Tongues', level: 3, school: 'divination', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target understands any spoken language and can be understood.', classes: ['bard', 'cleric', 'sorcerer', 'warlock', 'wizard'] },
  vampiricTouch: { name: 'Vampiric Touch', level: 3, school: 'necromancy', castTime: '1 action', range: 'Self', duration: '1 minute', description: 'Melee spell attack deals 3d6 necrotic. You heal half damage dealt.', classes: ['warlock', 'wizard'] },
  waterBreathing: { name: 'Water Breathing', level: 3, school: 'transmutation', castTime: '1 action', range: '30 ft', duration: '24 hours', description: 'Up to 10 creatures can breathe underwater.', classes: ['druid', 'ranger', 'sorcerer', 'wizard'], ritual: true },
  waterWalk: { name: 'Water Walk', level: 3, school: 'transmutation', castTime: '1 action', range: '30 ft', duration: '1 hour', description: 'Up to 10 creatures can walk on liquid surfaces.', classes: ['cleric', 'druid', 'ranger', 'sorcerer'], ritual: true },

  // 4TH LEVEL SPELLS
  arcaneEye: { name: 'Arcane Eye', level: 4, school: 'divination', castTime: '1 action', range: '30 ft', duration: '1 hour', description: 'Create invisible floating eye you can see through. 30 ft fly speed.', classes: ['wizard'] },
  auraOfLife: { name: 'Aura of Life', level: 4, school: 'abjuration', castTime: '1 action', range: 'Self (30-ft radius)', duration: '10 minutes', description: 'Allies resistant to necrotic, can\'t have max HP reduced. 1 HP creatures regain 1 HP.', classes: ['paladin'] },
  auraOfPurity: { name: 'Aura of Purity', level: 4, school: 'abjuration', castTime: '1 action', range: 'Self (30-ft radius)', duration: '10 minutes', description: 'Allies can\'t be diseased, resistant to poison, advantage vs conditions.', classes: ['paladin'] },
  banishment: { name: 'Banishment', level: 4, school: 'abjuration', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Cha save or creature banished to another plane. Gone permanently if native.', classes: ['cleric', 'paladin', 'sorcerer', 'warlock', 'wizard'] },
  blight: { name: 'Blight', level: 4, school: 'necromancy', castTime: '1 action', range: '30 ft', duration: 'Instantaneous', description: 'Necromantic energy deals 8d8 necrotic damage. Con save for half.', classes: ['druid', 'sorcerer', 'warlock', 'wizard'] },
  compulsion: { name: 'Compulsion', level: 4, school: 'enchantment', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Wis save or creatures move in direction you choose.', classes: ['bard'] },
  confusion: { name: 'Confusion', level: 4, school: 'enchantment', castTime: '1 action', range: '90 ft', duration: '1 minute', description: 'Wis save or creatures act randomly in 10-ft sphere.', classes: ['bard', 'druid', 'sorcerer', 'wizard'] },
  conjureMinorElementals: { name: 'Conjure Minor Elementals', level: 4, school: 'conjuration', castTime: '1 minute', range: '90 ft', duration: '1 hour', description: 'Summon elementals of CR 2 or lower.', classes: ['druid', 'wizard'] },
  conjureWoodlandBeings: { name: 'Conjure Woodland Beings', level: 4, school: 'conjuration', castTime: '1 action', range: '60 ft', duration: '1 hour', description: 'Summon fey creatures of CR 2 or lower.', classes: ['druid', 'ranger'] },
  controlWater: { name: 'Control Water', level: 4, school: 'transmutation', castTime: '1 action', range: '300 ft', duration: '10 minutes', description: 'Control water in 100-ft cube: flood, part, redirect, or whirlpool.', classes: ['cleric', 'druid', 'wizard'] },
  deathWard: { name: 'Death Ward', level: 4, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '8 hours', description: 'First time target drops to 0 HP, it drops to 1 HP instead.', classes: ['cleric', 'paladin'] },
  dimensionDoor: { name: 'Dimension Door', level: 4, school: 'conjuration', castTime: '1 action', range: '500 ft', duration: 'Instantaneous', description: 'Teleport yourself and one willing creature up to 500 ft.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  divination: { name: 'Divination', level: 4, school: 'divination', castTime: '1 action', range: 'Self', duration: 'Instantaneous', description: 'Contact deity for truthful reply about goal or event within 7 days.', classes: ['cleric'], ritual: true },
  dominateBeast: { name: 'Dominate Beast', level: 4, school: 'enchantment', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Wis save or beast is charmed and you control it telepathically.', classes: ['druid', 'sorcerer'] },
  evardBlackTentacles: { name: 'Evard\'s Black Tentacles', level: 4, school: 'conjuration', castTime: '1 action', range: '90 ft', duration: '1 minute', description: 'Tentacles fill 20-ft square. Dex save or restrained, 3d6 bludgeoning.', classes: ['wizard'] },
  fabricate: { name: 'Fabricate', level: 4, school: 'transmutation', castTime: '10 minutes', range: '120 ft', duration: 'Instantaneous', description: 'Convert raw materials into finished products.', classes: ['wizard'] },
  fireShield: { name: 'Fire Shield', level: 4, school: 'evocation', castTime: '1 action', range: 'Self', duration: '10 minutes', description: 'Choose warm (fire resist) or chill (cold resist). Attackers take 2d8 damage.', classes: ['wizard'] },
  freedomOfMovement: { name: 'Freedom of Movement', level: 4, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target unaffected by difficult terrain, can\'t be paralyzed or restrained.', classes: ['bard', 'cleric', 'druid', 'ranger'] },
  giantInsect: { name: 'Giant Insect', level: 4, school: 'transmutation', castTime: '1 action', range: '30 ft', duration: '10 minutes', description: 'Transform insects into giant versions that obey you.', classes: ['druid'] },
  greaterInvisibility: { name: 'Greater Invisibility', level: 4, school: 'illusion', castTime: '1 action', range: 'Touch', duration: '1 minute', description: 'Target invisible even while attacking or casting spells.', classes: ['bard', 'sorcerer', 'wizard'] },
  guardianOfFaith: { name: 'Guardian of Faith', level: 4, school: 'conjuration', castTime: '1 action', range: '30 ft', duration: '8 hours', description: 'Spectral guardian. Creatures within 10 ft take 20 radiant damage. Dex half.', classes: ['cleric'] },
  hallucinatoryTerrain: { name: 'Hallucinatory Terrain', level: 4, school: 'illusion', castTime: '10 minutes', range: '300 ft', duration: '24 hours', description: 'Make terrain look, sound, smell like different terrain.', classes: ['bard', 'druid', 'warlock', 'wizard'] },
  iceStorm: { name: 'Ice Storm', level: 4, school: 'evocation', castTime: '1 action', range: '300 ft', duration: 'Instantaneous', description: '20-ft cylinder. 2d8 bludgeoning + 4d6 cold. Dex save for half. Difficult terrain.', classes: ['druid', 'sorcerer', 'wizard'] },
  locateCreature: { name: 'Locate Creature', level: 4, school: 'divination', castTime: '1 action', range: 'Self', duration: '1 hour', description: 'Sense direction to specific creature within 1000 ft.', classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'wizard'] },
  otilukeResilientSphere: { name: 'Otiluke\'s Resilient Sphere', level: 4, school: 'evocation', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Dex save or creature enclosed in indestructible force sphere.', classes: ['wizard'] },
  phantasmalKiller: { name: 'Phantasmal Killer', level: 4, school: 'illusion', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Wis save or creature frightened of nightmarish illusion. 4d10 psychic per turn.', classes: ['wizard'] },
  polymorph: { name: 'Polymorph', level: 4, school: 'transmutation', castTime: '1 action', range: '60 ft', duration: '1 hour', description: 'Wis save or transform creature into beast of equal or lower CR.', classes: ['bard', 'druid', 'sorcerer', 'wizard'] },
  privateS: { name: 'Private Sanctum', level: 4, school: 'abjuration', castTime: '10 minutes', range: '120 ft', duration: '24 hours', description: 'Area secure from scrying, teleportation, and planar travel.', classes: ['wizard'] },
  staggeringSmite: { name: 'Staggering Smite', level: 4, school: 'evocation', castTime: '1 bonus action', range: 'Self', duration: '1 minute', description: 'Next hit deals +4d6 psychic. Wis save or disadvantage and no reactions.', classes: ['paladin'] },
  stoneskin: { name: 'Stoneskin', level: 4, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: '1 hour', description: 'Target has resistance to nonmagical bludgeoning, piercing, and slashing.', classes: ['druid', 'ranger', 'sorcerer', 'wizard'] },
  stormSphere: { name: 'Storm Sphere', level: 4, school: 'evocation', castTime: '1 action', range: '150 ft', duration: '1 minute', description: '20-ft sphere of wind. 2d6 bludgeoning. Bonus action for 4d6 lightning bolt.', classes: ['sorcerer', 'wizard'] },
  summonGreaterDemon: { name: 'Summon Greater Demon', level: 4, school: 'conjuration', castTime: '1 action', range: '60 ft', duration: '1 hour', description: 'Summon demon of CR 5 or lower. Requires blood.', classes: ['warlock', 'wizard'] },
  wallOfFire: { name: 'Wall of Fire', level: 4, school: 'evocation', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Create wall of fire. 5d8 fire damage to creatures within 10 ft.', classes: ['druid', 'sorcerer', 'wizard'] },

  // 5TH LEVEL SPELLS
  animateObjects: { name: 'Animate Objects', level: 5, school: 'transmutation', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Animate up to 10 nonmagical objects. They attack on your command.', classes: ['bard', 'sorcerer', 'wizard'] },
  antilife_shell: { name: 'Antilife Shell', level: 5, school: 'abjuration', castTime: '1 action', range: 'Self (10-ft radius)', duration: '1 hour', description: 'Barrier prevents creatures from entering or passing through.', classes: ['druid'] },
  awaken: { name: 'Awaken', level: 5, school: 'transmutation', castTime: '8 hours', range: 'Touch', duration: 'Instantaneous', description: 'Give beast or plant Intelligence of 10 and ability to speak.', classes: ['bard', 'druid'] },
  banishingSmite: { name: 'Banishing Smite', level: 5, school: 'abjuration', castTime: '1 bonus action', range: 'Self', duration: '1 minute', description: 'Next hit deals +5d10 force. If under 50 HP, banished.', classes: ['paladin'] },
  bigbysHand: { name: 'Bigby\'s Hand', level: 5, school: 'evocation', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Create Large hand of force. Can punch, push, grasp, or block.', classes: ['wizard'] },
  circleOfPower: { name: 'Circle of Power', level: 5, school: 'abjuration', castTime: '1 action', range: 'Self (30-ft radius)', duration: '10 minutes', description: 'Allies have advantage on saves vs magic. Successful saves take no damage.', classes: ['paladin'] },
  cloudkill: { name: 'Cloudkill', level: 5, school: 'conjuration', castTime: '1 action', range: '120 ft', duration: '10 minutes', description: 'Poisonous fog in 20-ft sphere. 5d8 poison damage. Con save for half.', classes: ['sorcerer', 'wizard'] },
  commune: { name: 'Commune', level: 5, school: 'divination', castTime: '1 minute', range: 'Self', duration: '1 minute', description: 'Contact deity and ask up to 3 yes/no questions.', classes: ['cleric'], ritual: true },
  communeWithNature: { name: 'Commune with Nature', level: 5, school: 'divination', castTime: '1 minute', range: 'Self', duration: 'Instantaneous', description: 'Gain knowledge of surrounding territory within 3 miles.', classes: ['druid', 'ranger'], ritual: true },
  coneOfCold: { name: 'Cone of Cold', level: 5, school: 'evocation', castTime: '1 action', range: 'Self (60-ft cone)', duration: 'Instantaneous', description: '60-ft cone. 8d8 cold damage. Con save for half.', classes: ['sorcerer', 'wizard'] },
  conjureElemental: { name: 'Conjure Elemental', level: 5, school: 'conjuration', castTime: '1 minute', range: '90 ft', duration: '1 hour', description: 'Summon elemental of CR 5 or lower.', classes: ['druid', 'wizard'] },
  contactOtherPlane: { name: 'Contact Other Plane', level: 5, school: 'divination', castTime: '1 minute', range: 'Self', duration: '1 minute', description: 'Contact extraplanar entity for information. Risk of insanity.', classes: ['warlock', 'wizard'], ritual: true },
  contagion: { name: 'Contagion', level: 5, school: 'necromancy', castTime: '1 action', range: 'Touch', duration: '7 days', description: 'Melee spell attack. Target diseased with blinding sickness, filth fever, etc.', classes: ['cleric', 'druid'] },
  creation: { name: 'Creation', level: 5, school: 'illusion', castTime: '1 minute', range: '30 ft', duration: 'Special', description: 'Create nonliving object of vegetable or mineral matter.', classes: ['sorcerer', 'wizard'] },
  destructiveWave: { name: 'Destructive Wave', level: 5, school: 'evocation', castTime: '1 action', range: 'Self (30-ft radius)', duration: 'Instantaneous', description: 'Thunder and radiant/necrotic. 5d6 thunder + 5d6 radiant/necrotic. Con save half.', classes: ['paladin'] },
  dispelEvilAndGood: { name: 'Dispel Evil and Good', level: 5, school: 'abjuration', castTime: '1 action', range: 'Self', duration: '1 minute', description: 'Protection from aberrations, celestials, elementals, fey, fiends, undead.', classes: ['cleric', 'paladin'] },
  dominatePerson: { name: 'Dominate Person', level: 5, school: 'enchantment', castTime: '1 action', range: '60 ft', duration: '1 minute', description: 'Wis save or humanoid is charmed and you control it telepathically.', classes: ['bard', 'sorcerer', 'wizard'] },
  dream: { name: 'Dream', level: 5, school: 'illusion', castTime: '1 minute', range: 'Special', duration: '8 hours', description: 'Enter target\'s dreams. Can converse or cause nightmares.', classes: ['bard', 'warlock', 'wizard'] },
  flameStrike: { name: 'Flame Strike', level: 5, school: 'evocation', castTime: '1 action', range: '60 ft', duration: 'Instantaneous', description: '10-ft cylinder. 4d6 fire + 4d6 radiant damage. Dex save for half.', classes: ['cleric'] },
  geas: { name: 'Geas', level: 5, school: 'enchantment', castTime: '1 minute', range: '60 ft', duration: '30 days', description: 'Command creature. 5d10 psychic damage when it acts against command.', classes: ['bard', 'cleric', 'druid', 'paladin', 'wizard'] },
  greaterRestoration: { name: 'Greater Restoration', level: 5, school: 'abjuration', castTime: '1 action', range: 'Touch', duration: 'Instantaneous', description: 'End charm, petrification, curse, ability reduction, or max HP reduction.', classes: ['bard', 'cleric', 'druid'] },
  hallow: { name: 'Hallow', level: 5, school: 'evocation', castTime: '24 hours', range: 'Touch', duration: 'Until dispelled', description: 'Imbue area with holy or unholy power. Various effects.', classes: ['cleric'] },
  holdMonster: { name: 'Hold Monster', level: 5, school: 'enchantment', castTime: '1 action', range: '90 ft', duration: '1 minute', description: 'Wis save or creature paralyzed. Works on any creature.', classes: ['bard', 'sorcerer', 'warlock', 'wizard'] },
  holyWeapon: { name: 'Holy Weapon', level: 5, school: 'evocation', castTime: '1 bonus action', range: 'Touch', duration: '1 hour', description: 'Weapon deals extra 2d8 radiant. Can dismiss for 4d8 radiant burst.', classes: ['cleric', 'paladin'] },
  insectPlague: { name: 'Insect Plague', level: 5, school: 'conjuration', castTime: '1 action', range: '300 ft', duration: '10 minutes', description: 'Swarming locusts in 20-ft sphere. 4d10 piercing. Con save for half.', classes: ['cleric', 'druid', 'sorcerer'] },
  legendLore: { name: 'Legend Lore', level: 5, school: 'divination', castTime: '10 minutes', range: 'Self', duration: 'Instantaneous', description: 'Learn legendary information about person, place, or object.', classes: ['bard', 'cleric', 'wizard'] },
  massC: { name: 'Mass Cure Wounds', level: 5, school: 'evocation', castTime: '1 action', range: '60 ft', duration: 'Instantaneous', description: 'Up to 6 creatures heal 3d8 + spellcasting modifier HP.', classes: ['bard', 'cleric', 'druid'] },
  mislead: { name: 'Mislead', level: 5, school: 'illusion', castTime: '1 action', range: 'Self', duration: '1 hour', description: 'Become invisible and create illusory double.', classes: ['bard', 'wizard'] },
  modifyMemory: { name: 'Modify Memory', level: 5, school: 'enchantment', castTime: '1 action', range: '30 ft', duration: '1 minute', description: 'Wis save or reshape target\'s memories of last 24 hours.', classes: ['bard', 'wizard'] },
  passwall: { name: 'Passwall', level: 5, school: 'transmutation', castTime: '1 action', range: '30 ft', duration: '1 hour', description: 'Create passage through wood, plaster, or stone wall.', classes: ['wizard'] },
  planarBinding: { name: 'Planar Binding', level: 5, school: 'abjuration', castTime: '1 hour', range: '60 ft', duration: '24 hours', description: 'Bind celestial, elemental, fey, or fiend to your service.', classes: ['bard', 'cleric', 'druid', 'wizard'] },
  raiseDead: { name: 'Raise Dead', level: 5, school: 'necromancy', castTime: '1 hour', range: 'Touch', duration: 'Instantaneous', description: 'Return creature dead up to 10 days to life. -4 penalty to rolls.', classes: ['bard', 'cleric', 'paladin'] },
  rarysTelepathicBond: { name: 'Rary\'s Telepathic Bond', level: 5, school: 'divination', castTime: '1 action', range: '30 ft', duration: '1 hour', description: 'Up to 8 creatures can communicate telepathically.', classes: ['wizard'], ritual: true },
  reincarnate: { name: 'Reincarnate', level: 5, school: 'transmutation', castTime: '1 hour', range: 'Touch', duration: 'Instantaneous', description: 'Return dead creature to life in new randomly determined body.', classes: ['druid'] },
  scrying: { name: 'Scrying', level: 5, school: 'divination', castTime: '10 minutes', range: 'Self', duration: '10 minutes', description: 'Wis save or see and hear target creature.', classes: ['bard', 'cleric', 'druid', 'warlock', 'wizard'] },
  seeming: { name: 'Seeming', level: 5, school: 'illusion', castTime: '1 action', range: '30 ft', duration: '8 hours', description: 'Change appearance of any number of creatures. Cha save to resist.', classes: ['bard', 'sorcerer', 'wizard'] },
  swiftQuiver: { name: 'Swift Quiver', level: 5, school: 'transmutation', castTime: '1 bonus action', range: 'Touch', duration: '1 minute', description: 'Quiver produces endless ammunition. Bonus action for 2 attacks.', classes: ['ranger'] },
  telekinesis: { name: 'Telekinesis', level: 5, school: 'transmutation', castTime: '1 action', range: '60 ft', duration: '10 minutes', description: 'Move creature or object up to 1000 lbs with your mind.', classes: ['sorcerer', 'wizard'] },
  teleportationCircle: { name: 'Teleportation Circle', level: 5, school: 'conjuration', castTime: '1 minute', range: '10 ft', duration: '1 round', description: 'Create circle linking to permanent teleportation circle.', classes: ['bard', 'sorcerer', 'wizard'] },
  treeStride: { name: 'Tree Stride', level: 5, school: 'conjuration', castTime: '1 action', range: 'Self', duration: '1 minute', description: 'Enter tree and teleport to another tree within 500 ft.', classes: ['druid', 'ranger'] },
  wallOfForce: { name: 'Wall of Force', level: 5, school: 'evocation', castTime: '1 action', range: '120 ft', duration: '10 minutes', description: 'Create invisible wall. Immune to all damage. Nothing passes through.', classes: ['wizard'] },
  wallOfStone: { name: 'Wall of Stone', level: 5, school: 'evocation', castTime: '1 action', range: '120 ft', duration: '10 minutes', description: 'Create stone wall. 6 inches thick. Can be permanent if lasts duration.', classes: ['druid', 'sorcerer', 'wizard'] },
  wrathOfNature: { name: 'Wrath of Nature', level: 5, school: 'evocation', castTime: '1 action', range: '120 ft', duration: '1 minute', description: 'Animate trees, rocks, and grass to attack enemies in 60-ft cube.', classes: ['druid', 'ranger'] }
};

// Get spells available to a class at a given level
const getSpellsForClass = (classId, spellLevel) => {
  return Object.entries(SPELLS)
    .filter(([_, spell]) => spell.level === spellLevel && spell.classes.includes(classId))
    .map(([id, spell]) => ({ id, ...spell }));
};

// Get spellcasting info for a class
const getSpellcastingInfo = (classId, characterLevel = 1) => {
  const classData = CLASSES[classId];
  if (!classData?.spellcasting) return null;
  
  const sc = classData.spellcasting;
  
  // Check if spellcasting starts at higher level
  if (sc.startsAtLevel && characterLevel < sc.startsAtLevel) {
    return { ...sc, available: false, startsAt: sc.startsAtLevel };
  }
  
  return { ...sc, available: true };
};

// ============================================================================
// D&D 5E LANGUAGES
// ============================================================================

const LANGUAGES = {
  common: { name: 'Common', type: 'standard', speakers: 'Humans, most civilized races' },
  dwarvish: { name: 'Dwarvish', type: 'standard', speakers: 'Dwarves' },
  elvish: { name: 'Elvish', type: 'standard', speakers: 'Elves' },
  giant: { name: 'Giant', type: 'standard', speakers: 'Ogres, Giants' },
  gnomish: { name: 'Gnomish', type: 'standard', speakers: 'Gnomes' },
  goblin: { name: 'Goblin', type: 'standard', speakers: 'Goblinoids' },
  halfling: { name: 'Halfling', type: 'standard', speakers: 'Halflings' },
  orc: { name: 'Orc', type: 'standard', speakers: 'Orcs' },
  abyssal: { name: 'Abyssal', type: 'exotic', speakers: 'Demons' },
  celestial: { name: 'Celestial', type: 'exotic', speakers: 'Celestials' },
  draconic: { name: 'Draconic', type: 'exotic', speakers: 'Dragons, Dragonborn' },
  deepSpeech: { name: 'Deep Speech', type: 'exotic', speakers: 'Aboleths, Cloakers' },
  infernal: { name: 'Infernal', type: 'exotic', speakers: 'Devils' },
  primordial: { name: 'Primordial', type: 'exotic', speakers: 'Elementals' },
  sylvan: { name: 'Sylvan', type: 'exotic', speakers: 'Fey creatures' },
  undercommon: { name: 'Undercommon', type: 'exotic', speakers: 'Underdark traders' }
};

// Get languages a character already knows from race
const getFixedLanguages = (raceId, subraceId) => {
  if (!raceId || !RACES[raceId]) return ['Common'];
  const race = RACES[raceId];
  // Filter out "One of your choice" type entries
  return (race.languages || []).filter(lang => 
    !lang.toLowerCase().includes('choice') && 
    !lang.toLowerCase().includes('your choice')
  );
};

// Get number of bonus language choices from race
const getRaceLanguageChoices = (raceId, subraceId) => {
  if (!raceId || !RACES[raceId]) return 0;
  const race = RACES[raceId];
  const subrace = subraceId && race.subraces ? race.subraces[subraceId] : null;
  
  let choices = 0;
  
  // Check race languages for "choice" entries
  (race.languages || []).forEach(lang => {
    if (lang.toLowerCase().includes('one of your choice')) choices += 1;
  });
  
  // Human gets +1, High Elf gets +1
  if (raceId === 'human') choices = 1;
  if (subraceId === 'highElf') choices = 1;
  
  return choices;
};

// Get number of bonus language choices from background
const getBackgroundLanguageChoices = (backgroundId) => {
  if (!backgroundId || !BACKGROUNDS[backgroundId]) return 0;
  return BACKGROUNDS[backgroundId].languages || 0;
};

// ============================================================================
// D&D 5E SKILLS
// ============================================================================

const SKILLS = {
  acrobatics: { name: 'Acrobatics', ability: 'dexterity', description: 'Balance, tumbling, and staying on your feet in tricky situations.' },
  animalHandling: { name: 'Animal Handling', ability: 'wisdom', description: 'Calming, training, or reading the intentions of animals.' },
  arcana: { name: 'Arcana', ability: 'intelligence', description: 'Recalling lore about spells, magic items, eldritch symbols, and magical traditions.' },
  athletics: { name: 'Athletics', ability: 'strength', description: 'Climbing, jumping, swimming, and other physical activities.' },
  deception: { name: 'Deception', ability: 'charisma', description: 'Convincingly hiding the truth through misdirection or lies.' },
  history: { name: 'History', ability: 'intelligence', description: 'Recalling lore about historical events, legendary people, ancient kingdoms, and past disputes.' },
  insight: { name: 'Insight', ability: 'wisdom', description: 'Determining the true intentions of a creature, reading body language, or sensing deception.' },
  intimidation: { name: 'Intimidation', ability: 'charisma', description: 'Influencing someone through threats, hostile actions, or physical violence.' },
  investigation: { name: 'Investigation', ability: 'intelligence', description: 'Looking for clues, making deductions, finding hidden objects, or deciphering puzzles.' },
  medicine: { name: 'Medicine', ability: 'wisdom', description: 'Stabilizing dying companions, diagnosing illnesses, or treating wounds.' },
  nature: { name: 'Nature', ability: 'intelligence', description: 'Recalling lore about terrain, plants, animals, weather, and natural cycles.' },
  perception: { name: 'Perception', ability: 'wisdom', description: 'Spotting, hearing, or detecting the presence of something using your senses.' },
  performance: { name: 'Performance', ability: 'charisma', description: 'Entertaining an audience through music, dance, acting, storytelling, or other arts.' },
  persuasion: { name: 'Persuasion', ability: 'charisma', description: 'Influencing someone through tact, social graces, or good nature.' },
  religion: { name: 'Religion', ability: 'intelligence', description: 'Recalling lore about deities, rites, prayers, religious hierarchies, and holy symbols.' },
  sleightOfHand: { name: 'Sleight of Hand', ability: 'dexterity', description: 'Picking pockets, concealing objects, performing tricks, or other acts of manual trickery.' },
  stealth: { name: 'Stealth', ability: 'dexterity', description: 'Hiding, moving silently, or slipping past guards without being noticed.' },
  survival: { name: 'Survival', ability: 'wisdom', description: 'Tracking, hunting, navigating wilderness, predicting weather, or avoiding natural hazards.' }
};

// Get skill ID from skill name
const getSkillId = (skillName) => {
  const entry = Object.entries(SKILLS).find(([_, s]) => 
    s.name.toLowerCase() === skillName.toLowerCase()
  );
  return entry ? entry[0] : null;
};

// Get overlapping skills between background and class
const getSkillOverlap = (classId, backgroundId) => {
  if (!classId || !backgroundId) return [];
  
  const classData = CLASSES[classId];
  const bgData = BACKGROUNDS[backgroundId];
  
  if (!classData || !bgData) return [];
  
  const bgSkills = bgData.skillProficiencies || [];
  const classSkillOptions = classData.skillChoices?.from;
  
  // If class can choose from any skill, no overlap issues
  if (classSkillOptions === 'any') return [];
  
  // Find skills that appear in both background AND class options
  const overlap = bgSkills.filter(skill => 
    classSkillOptions?.includes(skill)
  );
  
  return overlap;
};

// Get all available skills for replacement (skills not already gained)
const getAvailableReplacementSkills = (classId, backgroundId, alreadyChosen = []) => {
  const bgSkills = BACKGROUNDS[backgroundId]?.skillProficiencies || [];
  const classSkillOptions = CLASSES[classId]?.skillChoices?.from;
  
  // All skills except background skills and already chosen replacements
  const excluded = [...bgSkills, ...alreadyChosen.map(id => SKILLS[id]?.name)].map(s => s?.toLowerCase());
  
  return Object.entries(SKILLS).filter(([id, skill]) => 
    !excluded.includes(skill.name.toLowerCase())
  );
};

// Get levels at which character gets ASI/Feat (Ability Score Improvement)
const getASILevels = (characterLevel) => {
  const asiLevels = [4, 8, 12, 16, 19];
  return asiLevels.filter(level => characterLevel >= level);
};

// Tooltip dictionaries for Racial Traits and Class Features
const TRAIT_INFO = {
  'Darkvision': 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness.',
  'Keen Senses': 'You have proficiency in the Perception skill.',
  'Fey Ancestry': 'You have advantage on saving throws against being charmed, and magic can’t put you to sleep.',
  'Trance': 'Elves don’t need sleep. They meditate deeply for 4 hours a day and gain long rest benefits.',
  'Elf Weapon Training': 'You have proficiency with longsword, shortsword, shortbow, and longbow.',
  'Cantrip': 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability.',
  'Extra Language (choice)': 'You can speak, read, and write one extra language of your choice.',
  'Fleet of Foot': 'Your base walking speed increases by 5 feet.',
  'Mask of the Wild': 'You can attempt to hide even when only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.',
  'Superior Darkvision': 'You can see in darkness up to 120 feet.',
  'Sunlight Sensitivity': 'You have disadvantage on attack rolls and Perception checks that rely on sight when you, the target, or whatever you are trying to perceive is in direct sunlight.',
  'Drow Magic': 'You know the dancing lights cantrip. At 3rd level, you can cast faerie fire; at 5th level, darkness. Charisma is your spellcasting ability.',
  'Drow Weapon Training': 'You have proficiency with rapiers, shortswords, and hand crossbows.',
  'Dwarven Resilience': 'You have advantage on saving throws against poison, and resistance against poison damage.',
  'Stonecunning': 'Whenever you make a History check related to the origin of stonework, you are considered proficient and add double your proficiency bonus.',
  'Dwarven Toughness': 'Your hit point maximum increases by 1, and increases by 1 every time you level.',
  'Dwarven Armor Training': 'You have proficiency with light and medium armor.',
  'Lucky': 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
  'Brave': 'You have advantage on saving throws against being frightened.',
  'Halfling Nimbleness': 'You can move through the space of any creature that is of a size larger than yours.',
  'Naturally Stealthy': 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',
  'Stout Resilience': 'You have advantage on saving throws against poison, and resistance against poison damage.',
  'Gnome Cunning': 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.',
  'Natural Illusionist': 'You know the minor illusion cantrip. Intelligence is your spellcasting ability.',
  'Speak with Small Beasts': 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.',
  'Artificer’s Lore': 'Add double your proficiency bonus to History checks related to magic items, alchemical objects, or technological devices.',
  'Tinker': 'You can construct tiny clockwork devices using tools; they have minor effects.',
  'Skill Versatility': 'You gain proficiency in two skills of your choice.',
  'Menacing': 'You gain proficiency in the Intimidation skill.',
  'Relentless Endurance': 'When reduced to 0 HP but not killed, you drop to 1 HP once per long rest.',
  'Savage Attacks': 'When you score a critical hit with a melee weapon attack, add one additional weapon damage die.',
  'Hellish Resistance': 'You have resistance to fire damage.',
  'Infernal Legacy': 'You know thaumaturgy cantrip; at higher levels you can cast hellish rebuke and darkness. Charisma is your spellcasting ability.',
  'Draconic Ancestry': 'You have a draconic ancestry granting a breath weapon and damage resistance based on your dragon type.',
  'Breath Weapon': 'You can use your action to exhale destructive energy; damage type and area depend on your ancestry.',
  'Damage Resistance': 'You have resistance to the damage type associated with your draconic ancestry.'
};

const FEATURE_INFO = {
  'Rage': 'Enter a battle rage as a bonus action; you gain damage resistance and bonus damage while raging.',
  'Unarmored Defense': 'Calculate AC without armor using specific ability modifiers (Barbarian: 10 + DEX + CON; Monk: 10 + DEX + WIS).',
  'Spellcasting': 'You can cast spells using your class’s spellcasting rules and ability.',
  'Bardic Inspiration': 'Use a bonus action to grant an ally an inspiration die they can add to rolls.',
  'Divine Domain': 'Choose a domain that grants additional features at certain levels.',
  'Druidic': 'You know Druidic, a secret language; speak it and leave hidden messages.',
  'Martial Arts': 'Use DEX for monk weapons and unarmed strikes; gain bonus unarmed strike as a bonus action.',
  'Fighting Style': 'Choose a style that grants a passive combat benefit (e.g., Archery, Defense).',
  'Second Wind': 'Use a bonus action to regain 1d10 + fighter level hit points once per short rest.',
  'Divine Sense': 'Detect celestials, fiends, and undead within 60 feet a limited number of times per long rest.',
  'Lay on Hands': 'Pool of healing equal to 5 × paladin level; touch to restore hit points.',
  'Favored Enemy': 'Gain bonuses against chosen enemy types (tracking, knowledge).',
  'Natural Explorer': 'You are adept at traveling and surviving in your favored terrain.',
  'Expertise': 'Choose skills to double proficiency bonus on checks.',
  'Sneak Attack': 'Deal extra damage once per turn with finesse or ranged weapon when you have advantage or an ally adjacent.',
  'Thieves\' Cant': 'Secret mix of dialect, jargon, and code allows you to convey messages to other rogues.',
  'Sorcerous Origin': 'Choose a bloodline granting features at certain levels.',
  'Otherworldly Patron': 'Choose a patron granting features and invocations.',
  'Pact Magic': 'Warlocks use pact magic with limited spell slots that recover on short rests.',
  'Arcane Recovery': 'Regain some spell slots during a short rest once per day.'
};

// ============================================================================
// FIGHTING STYLES
// ============================================================================

const FIGHTING_STYLES = {
  archery: {
    name: 'Archery',
    description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
    availableFor: ['fighter', 'paladin', 'ranger']
  },
  defense: {
    name: 'Defense',
    description: 'While you are wearing armor, you gain a +1 bonus to AC.',
    availableFor: ['fighter', 'paladin', 'ranger']
  },
  dueling: {
    name: 'Dueling',
    description: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
    availableFor: ['fighter', 'paladin', 'ranger']
  },
  greatWeaponFighting: {
    name: 'Great Weapon Fighting',
    description: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll.',
    availableFor: ['fighter', 'paladin', 'ranger']
  },
  protection: {
    name: 'Protection',
    description: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.',
    availableFor: ['fighter', 'paladin']
  },
  twoWeaponFighting: {
    name: 'Two-Weapon Fighting',
    description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.',
    availableFor: ['fighter', 'paladin', 'ranger']
  }
};

// ============================================================================
// WARLOCK INVOCATIONS
// ============================================================================

const WARLOCK_INVOCATIONS = {
  agonizingBlast: { name: 'Agonizing Blast', description: 'Add your Charisma modifier to the damage of your eldritch blast cantrip.', prereq: 'Eldritch blast cantrip' },
  armorOfShadows: { name: 'Armor of Shadows', description: 'You can cast mage armor on yourself at will, without expending a spell slot or material components.' },
  ascendantStep: { name: 'Ascendant Step', description: 'You can cast levitate on yourself at will, without expending a spell slot or material components.', levelReq: 9 },
  beastSpeech: { name: 'Beast Speech', description: 'You can cast speak with animals at will, without expending a spell slot.' },
  beguilingInfluence: { name: 'Beguiling Influence', description: 'You gain proficiency in the Deception and Persuasion skills.' },
  bookOfAncientSecrets: { name: 'Book of Ancient Secrets', description: 'You can now inscribe magical rituals in your Book of Shadows. Choose two 1st-level spells that have the ritual tag.', prereq: 'Pact of the Tome' },
  devilsSight: { name: "Devil's Sight", description: 'You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.' },
  eldritchSight: { name: 'Eldritch Sight', description: 'You can cast detect magic at will, without expending a spell slot.' },
  eldritchSpear: { name: 'Eldritch Spear', description: 'When you cast eldritch blast, its range is 300 feet.', prereq: 'Eldritch blast cantrip' },
  eyesOfTheRuneKeeper: { name: 'Eyes of the Rune Keeper', description: 'You can read all writing.' },
  fiendishVigor: { name: 'Fiendish Vigor', description: 'You can cast false life on yourself at will as a 1st-level spell, without expending a spell slot or material components.' },
  gazeOfTwoMinds: { name: 'Gaze of Two Minds', description: 'You can use your action to touch a willing humanoid and perceive through its senses until the end of your next turn.' },
  maskOfManyFaces: { name: 'Mask of Many Faces', description: 'You can cast disguise self at will, without expending a spell slot.' },
  mistySisions: { name: 'Misty Visions', description: 'You can cast silent image at will, without expending a spell slot or material components.' },
  repellingBlast: { name: 'Repelling Blast', description: 'When you hit a creature with eldritch blast, you can push the creature up to 10 feet away from you in a straight line.', prereq: 'Eldritch blast cantrip' },
  thirstingBlade: { name: 'Thirsting Blade', description: 'You can attack with your pact weapon twice, instead of once, whenever you take the Attack action on your turn.', levelReq: 5, prereq: 'Pact of the Blade' },
  voiceOfTheChainMaster: { name: 'Voice of the Chain Master', description: 'You can communicate telepathically with your familiar and perceive through your familiar\'s senses.', prereq: 'Pact of the Chain' }
};

// ============================================================================
// SORCERER METAMAGIC
// ============================================================================

const METAMAGIC_OPTIONS = {
  carefulSpell: { name: 'Careful Spell', description: 'When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell\'s full force. Choose a number of creatures up to your Charisma modifier (minimum of one). A chosen creature automatically succeeds on its saving throw against the spell.' },
  distantSpell: { name: 'Distant Spell', description: 'When you cast a spell that has a range of 5 feet or greater, you can double the range of the spell. When you cast a spell that has a range of touch, you can make the range of the spell 30 feet.' },
  empoweredSpell: { name: 'Empowered Spell', description: 'When you roll damage for a spell, you can reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls.' },
  extendedSpell: { name: 'Extended Spell', description: 'When you cast a spell that has a duration of 1 minute or longer, you can double its duration, to a maximum duration of 24 hours.' },
  heightenedSpell: { name: 'Heightened Spell', description: 'When you cast a spell that forces a creature to make a saving throw to resist its effects, you can give one target of the spell disadvantage on its first saving throw made against the spell.' },
  quickenedSpell: { name: 'Quickened Spell', description: 'When you cast a spell that has a casting time of 1 action, you can change the casting time to 1 bonus action for this casting.' },
  subtleSpell: { name: 'Subtle Spell', description: 'When you cast a spell, you can cast it without any somatic or verbal components.' },
  twinnedSpell: { name: 'Twinned Spell', description: 'When you cast a spell that targets only one creature and doesn\'t have a range of self, you can target a second creature in range with the same spell.' }
};

// ============================================================================
// BATTLE MASTER MANEUVERS
// ============================================================================

const BATTLE_MASTER_MANEUVERS = {
  commandersStrike: { name: "Commander's Strike", description: 'When you take the Attack action, you can forgo one attack and use a bonus action to direct a companion to strike.' },
  disarmingAttack: { name: 'Disarming Attack', description: 'You attempt to knock a weapon or object from a target\'s grasp. Add superiority die to damage; target makes Strength save or drops object.' },
  distractingStrike: { name: 'Distracting Strike', description: 'You distract the target, giving your allies an opening. Add superiority die to damage; next attack roll against target by another has advantage.' },
  evasiveFootwork: { name: 'Evasive Footwork', description: 'When you move, add superiority die to AC until you stop moving.' },
  feintingAttack: { name: 'Feinting Attack', description: 'You feint, confusing your target. Gain advantage on next attack; if it hits, add superiority die to damage.' },
  goadingAttack: { name: 'Goading Attack', description: 'You provoke the target. Add superiority die to damage; target makes Wisdom save or has disadvantage on attacks against others.' },
  lungingAttack: { name: 'Lunging Attack', description: 'Increase reach by 5 feet for one attack. If it hits, add superiority die to damage.' },
  maneuveringAttack: { name: 'Maneuvering Attack', description: 'Add superiority die to damage. An ally can use reaction to move half their speed without provoking opportunity attacks.' },
  menacingAttack: { name: 'Menacing Attack', description: 'Add superiority die to damage; target makes Wisdom save or is frightened of you until end of your next turn.' },
  parry: { name: 'Parry', description: 'When damaged by melee attack, use reaction to reduce damage by superiority die + DEX modifier.' },
  precisionAttack: { name: 'Precision Attack', description: 'Add superiority die to an attack roll. Can be used before or after making the attack, but before DM determines hit or miss.' },
  pushingAttack: { name: 'Pushing Attack', description: 'Add superiority die to damage; if Large or smaller, target makes Strength save or is pushed 15 feet away.' },
  rally: { name: 'Rally', description: 'Use bonus action to bolster an ally. They gain temp HP equal to superiority die + CHA modifier.' },
  riposte: { name: 'Riposte', description: 'When a creature misses you with melee attack, use reaction to make melee attack. If it hits, add superiority die to damage.' },
  sweepingAttack: { name: 'Sweeping Attack', description: 'When you hit with melee weapon, choose another creature within 5 feet. If original attack would hit, they take damage equal to superiority die.' },
  tripAttack: { name: 'Trip Attack', description: 'Add superiority die to damage; if Large or smaller, target makes Strength save or is knocked prone.' }
};

// ============================================================================
// MUSICAL INSTRUMENTS
// ============================================================================

const MUSICAL_INSTRUMENTS = [
  'Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn', 'Pan flute', 'Shawm', 'Viol'
];

// ============================================================================
// ARTISAN TOOLS
// ============================================================================

const ARTISAN_TOOLS = [
  "Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies",
  "Carpenter's tools", "Cartographer's tools", "Cobbler's tools",
  "Cook's utensils", "Glassblower's tools", "Jeweler's tools",
  "Leatherworker's tools", "Mason's tools", "Painter's supplies",
  "Potter's tools", "Smith's tools", "Tinker's tools", "Weaver's tools",
  "Woodcarver's tools"
];

// Helper to find language ID by display name
const getLanguageIdByName = (name) => {
  const entry = Object.entries(LANGUAGES).find(([_, lang]) => lang.name.toLowerCase() === (name || '').toLowerCase());
  return entry ? entry[0] : null;
};

const getRacialBonuses = (raceId, subraceId) => {
  if (!raceId || !RACES[raceId]) return {};
  const race = RACES[raceId];

  // Start with race bonuses
  let bonuses = { ...(race.abilityBonuses || {}) };

  // Human: { all: 1 }
  if (bonuses.all) {
    const v = bonuses.all;
    delete bonuses.all;
    bonuses = {
      strength: v, dexterity: v, constitution: v,
      intelligence: v, wisdom: v, charisma: v
    };
  }

  // Half-elf “choice” bonus is deferred to a later phase UI
  if (bonuses.choice) {
    delete bonuses.choice;
  }

  if (bonuses.choice2) {
    delete bonuses.choice2;
  }

  // Subrace bonuses overlay
  if (subraceId && race.subraces && race.subraces[subraceId]?.abilityBonuses) {
    const subBonuses = { ...race.subraces[subraceId].abilityBonuses };
    if (subBonuses.choice2) delete subBonuses.choice2;
    if (race.subraces[subraceId].overrideParentBonuses) {
      bonuses = subBonuses;
    } else {
      bonuses = { ...bonuses, ...subBonuses };
    }
  }

  return bonuses;
};

const applyBonusesToAbilities = (baseAbilities, bonuses) => {
  const out = { ...baseAbilities };
  ABILITY_NAMES.forEach((a) => {
    out[a] = (out[a] || 0) + (bonuses[a] || 0);
  });
  return out;
};

const formatBonusLine = (bonuses) => {
  const parts = [];
  ABILITY_NAMES.forEach((a) => {
    const v = bonuses[a];
    if (v) parts.push(`${ABILITY_LABELS[a].short} +${v}`);
  });
  return parts.length ? parts.join(', ') : 'No ability score bonuses';
};

// Animated D6 Die Component
const AnimatedDie = ({ value, isRolling, isDropped = false }) => {
  const [displayValue, setDisplayValue] = useState(value || 1);
  
  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 80);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [isRolling, value]);

  const dotPositions = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
  };

  return (
    <div 
      className={`relative w-10 h-10 md:w-12 md:h-12 rounded-lg transition-all duration-200 ${
        isDropped 
          ? 'bg-slate-700/50 border-2 border-red-500/30 opacity-50 scale-90' 
          : 'bg-gradient-to-br from-white to-slate-200 shadow-lg'
      } ${isRolling ? 'animate-bounce' : ''}`}
    >
      {dotPositions[displayValue]?.map(([x, y], i) => (
        <div
          key={i}
          className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isDropped ? 'bg-red-400/50' : 'bg-slate-800'}`}
          style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
        />
      ))}
      {isDropped && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-red-500/60 rotate-45 absolute" />
        </div>
      )}
    </div>
  );
};

// Single Ability Score Roll Display
const AbilityRollResult = ({ roll, index, onAssign, assignedTo }) => {
  const total = roll.kept.reduce((a, b) => a + b, 0);
  const modifier = getModifier(total);
  
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      assignedTo 
        ? 'bg-green-500/10 border-green-500/30' 
        : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-1">
          {roll.all.map((val, i) => (
            <AnimatedDie 
              key={i} 
              value={val} 
              isRolling={false}
              isDropped={val === roll.dropped}
            />
          ))}
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{total}</div>
          <div className={`text-sm font-medium ${modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatModifier(modifier)}
          </div>
        </div>
      </div>
      {assignedTo ? (
        <div className="text-xs text-green-400 flex items-center gap-1">
          <Check className="w-3 h-3" />
          Assigned to {ABILITY_LABELS[assignedTo].short}
        </div>
      ) : (
        <div className="text-xs text-slate-500">Click an ability below to assign</div>
      )}
    </div>
  );
};

// Main Ability Score Step
const AbilityScoreStep = ({ character, updateCharacter }) => {
  const [method, setMethod] = useState(character.abilityMethod || null);
  const [rolls, setRolls] = useState(character.abilityRolls || []);
  const [isRolling, setIsRolling] = useState(false);
  const [assignments, setAssignments] = useState(character.abilityAssignments || {}); // Maps ability -> scoreIndex (not value!)
  const [selectedIndex, setSelectedIndex] = useState(null); // Index of selected score, not value
  const [pointBuyScores, setPointBuyScores] = useState(() => {
    // Initialize from character abilities if using point buy
    if (character.abilityMethod === 'pointbuy') {
      return character.abilities;
    }
    return {
      strength: 8, dexterity: 8, constitution: 8,
      intelligence: 8, wisdom: 8, charisma: 8
    };
  });

  const primaryClassData = character.class ? CLASSES[character.class] : null;
  const multiclassData = (character.multiclass || []).map(mc => CLASSES[mc.classId]).filter(Boolean);
  const addUnique = (list, value) => {
    if (value && !list.includes(value)) list.push(value);
  };
  const primaryAbilityOrder = [];
  (primaryClassData?.primaryAbility || []).forEach((a) => addUnique(primaryAbilityOrder, a));
  multiclassData.forEach((cls) => (cls?.primaryAbility || []).forEach((a) => addUnique(primaryAbilityOrder, a)));

  // Saving throws only from primary class per official 5e rules
  const savingThrowOrder = [];
  (primaryClassData?.savingThrows || []).forEach((a) => addUnique(savingThrowOrder, a));
  
  // Calculate unassigned indices from assignments
  const getUnassignedIndices = () => {
    if (method === 'standard') {
      const assignedIndices = new Set(Object.values(assignments));
      return [0, 1, 2, 3, 4, 5].filter(i => !assignedIndices.has(i));
    }
    if (method === 'roll' && rolls.length > 0) {
      const assignedIndices = new Set(Object.values(assignments));
      return [0, 1, 2, 3, 4, 5].filter(i => !assignedIndices.has(i));
    }
    return [];
  };
  const [unassignedIndices, setUnassignedIndices] = useState(getUnassignedIndices);
  
  // Recalculate unassigned when assignments or rolls change
  useEffect(() => {
    setUnassignedIndices(getUnassignedIndices());
  }, [assignments, rolls, method]);
  
  // Get the actual scores array based on method
  const getScoresArray = () => {
    if (method === 'standard') return STANDARD_ARRAY;
    if (method === 'roll') return rolls.map(r => r.kept.reduce((a, b) => a + b, 0));
    return [];
  };
  const scoresArray = getScoresArray();

  // Calculate point buy remaining
  const pointBuySpent = Object.values(pointBuyScores).reduce((sum, score) => sum + POINT_BUY_COSTS[score], 0);
  const pointBuyRemaining = 27 - pointBuySpent;

  // Roll 4d6 drop lowest
  const rollAbilityScore = () => {
    const dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    const sorted = [...dice].sort((a, b) => a - b);
    const dropped = sorted[0];
    const kept = sorted.slice(1);
    return { all: dice, kept, dropped };
  };

  const rollAllScores = () => {
    setIsRolling(true);
    setAssignments({});
    setSelectedIndex(null);
    
    // Generate rolls immediately
    const newRolls = Array(6).fill(null).map(() => rollAbilityScore());
    
    // Show results after animation
    setTimeout(() => {
      setRolls(newRolls);
      setIsRolling(false);
      // Persist rolls to character state
      updateCharacter('abilityRolls', newRolls);
      updateCharacter('abilityAssignments', {});
      updateCharacter('abilities', {
        strength: 10, dexterity: 10, constitution: 10,
        intelligence: 10, wisdom: 10, charisma: 10
      });
    }, 1500);
  };

  const resetAbilities = () => {
    const defaultAbilities = {
      strength: 10, dexterity: 10, constitution: 10,
      intelligence: 10, wisdom: 10, charisma: 10
    };
    updateCharacter('abilities', defaultAbilities);
    setAssignments({});
    setSelectedIndex(null);
    setUnassignedIndices([]);
    setRolls([]);
    setPointBuyScores({
      strength: 8, dexterity: 8, constitution: 8,
      intelligence: 8, wisdom: 8, charisma: 8
    });
  };

  const selectMethod = (newMethod) => {
    setMethod(newMethod);
    updateCharacter('abilityMethod', newMethod);
    setAssignments({});
    setSelectedIndex(null);
    updateCharacter('abilityAssignments', {});
    
    if (newMethod === 'standard') {
      // Reset abilities to 10 until assigned
      updateCharacter('abilities', {
        strength: 10, dexterity: 10, constitution: 10,
        intelligence: 10, wisdom: 10, charisma: 10
      });
      updateCharacter('abilityRolls', []);
    } else if (newMethod === 'roll') {
      setRolls([]);
      updateCharacter('abilityRolls', []);
      updateCharacter('abilities', {
        strength: 10, dexterity: 10, constitution: 10,
        intelligence: 10, wisdom: 10, charisma: 10
      });
    } else if (newMethod === 'pointbuy') {
      const startScores = {
        strength: 8, dexterity: 8, constitution: 8,
        intelligence: 8, wisdom: 8, charisma: 8
      };
      setPointBuyScores(startScores);
      updateCharacter('abilities', startScores);
      updateCharacter('abilityRolls', []);
    } else if (newMethod === 'manual') {
      // Keep current abilities or reset to 10
      updateCharacter('abilities', {
        strength: 10, dexterity: 10, constitution: 10,
        intelligence: 10, wisdom: 10, charisma: 10
      });
      updateCharacter('abilityRolls', []);
    }
  };

  const assignScore = (ability) => {
    if (method === 'pointbuy' || method === 'manual') return;
    
    if (selectedIndex !== null) {
      const scoreValue = scoresArray[selectedIndex];
      
      // If this ability already has a score assigned, put its index back
      const oldIndex = assignments[ability];
      
      const newAssignments = { ...assignments };
      newAssignments[ability] = selectedIndex;
      setAssignments(newAssignments);
      
      // Persist assignments to character state
      updateCharacter('abilityAssignments', newAssignments);
      
      // Update character abilities
      const newAbilities = { ...character.abilities };
      newAbilities[ability] = scoreValue;
      updateCharacter('abilities', newAbilities);
      
      setSelectedIndex(null);
    }
  };

  const adjustPointBuy = (ability, delta) => {
    const current = pointBuyScores[ability];
    const newValue = current + delta;
    
    if (newValue < 8 || newValue > 15) return;
    
    const newCost = POINT_BUY_COSTS[newValue];
    const oldCost = POINT_BUY_COSTS[current];
    const costDelta = newCost - oldCost;
    
    if (pointBuyRemaining - costDelta < 0) return;
    
    const newScores = { ...pointBuyScores, [ability]: newValue };
    setPointBuyScores(newScores);
    updateCharacter('abilities', newScores);
  };

  const autoAssignOptimal = () => {
    if (method === 'pointbuy' || method === 'manual') return;
    if (!character.class) return;
    if (scoresArray.length === 0) return;
    
    // Sort scores descending
    const sortedIndices = [...scoresArray.keys()].sort((a, b) => scoresArray[b] - scoresArray[a]);
    
    // Priority order: primary abilities first (primary class, then multiclasses), then saving throws, then CON, then rest
    const abilityPriority = [];

    primaryAbilityOrder.forEach((ability, idx) => {
      abilityPriority.push({ ability, priority: idx });
    });

    savingThrowOrder.forEach((ability, idx) => {
      if (!abilityPriority.some(p => p.ability === ability)) {
        abilityPriority.push({ ability, priority: primaryAbilityOrder.length + idx });
      }
    });

    if (!abilityPriority.some(p => p.ability === 'constitution')) {
      abilityPriority.push({ ability: 'constitution', priority: abilityPriority.length + 1 });
    }

    ABILITY_NAMES.forEach((ability) => {
      if (!abilityPriority.some(p => p.ability === ability)) {
        abilityPriority.push({ ability, priority: abilityPriority.length + 10 });
      }
    });
    
    abilityPriority.sort((a, b) => a.priority - b.priority);
    
    // Assign scores
    const newAssignments = {};
    const newAbilities = {};
    
    abilityPriority.slice(0, sortedIndices.length).forEach((item, index) => {
      const scoreIndex = sortedIndices[index];
      newAssignments[item.ability] = scoreIndex;
      newAbilities[item.ability] = scoresArray[scoreIndex];
    });
    
    setAssignments(newAssignments);
    updateCharacter('abilityAssignments', newAssignments);
    updateCharacter('abilities', newAbilities);
  };

  const setManualScore = (ability, value) => {
    const numValue = parseInt(value) || 8;
    const clamped = Math.max(3, Math.min(18, numValue));
    const newAbilities = { ...character.abilities, [ability]: clamped };
    updateCharacter('abilities', newAbilities);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Ability Scores</h3>
        {(primaryClassData || multiclassData.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-500">Saving Throws:</span>
            {savingThrowOrder.map((st) => (
              <span key={st} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
                {ABILITY_LABELS[st]?.short}
              </span>
            ))}
            {primaryAbilityOrder.length > 0 && (
              <span className="text-slate-600 text-xs ml-2">
                Primary: {primaryAbilityOrder.map((a) => ABILITY_LABELS[a]?.short).join('/')}
              </span>
            )}
            {multiclassData.length > 0 && (
              <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Multiclass active
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Method Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'standard', label: 'Standard Array', desc: '15, 14, 13, 12, 10, 8', icon: '📊' },
          { id: 'pointbuy', label: 'Point Buy', desc: '27 points to spend', icon: '🛒' },
          { id: 'roll', label: 'Roll 4d6', desc: 'Drop lowest die', icon: '🎲' },
          { id: 'manual', label: 'Manual Entry', desc: 'Type your own', icon: '✏️' }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => selectMethod(m.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              method === m.id
                ? 'bg-indigo-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl mb-1">{m.icon}</div>
            <div className={`font-semibold ${method === m.id ? 'text-indigo-300' : 'text-slate-200'}`}>
              {m.label}
            </div>
            <div className="text-xs text-slate-500">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Rolling UI */}
      {method === 'roll' && (
        <div className="space-y-4">
          <button
            onClick={rollAllScores}
            disabled={isRolling}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50"
          >
            {isRolling ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Rolling...
              </span>
            ) : rolls.length > 0 ? (
              '🎲 Reroll All Scores'
            ) : (
              '🎲 Roll Ability Scores'
            )}
          </button>
          
          {isRolling && (
            <div className="flex justify-center gap-3 py-8">
              {[0, 1, 2, 3].map(i => (
                <AnimatedDie key={i} value={1} isRolling={true} delay={i * 100} />
              ))}
            </div>
          )}
          
          {rolls.length > 0 && !isRolling && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {rolls.map((roll, i) => {
                const total = roll.kept.reduce((a, b) => a + b, 0);
                const assignedAbility = Object.entries(assignments).find(([_, idx]) => idx === i)?.[0];
                const modifier = getModifier(total);
                
                // Find the INDEX of the dropped die (first occurrence of the lowest value)
                const lowestValue = Math.min(...roll.all);
                const droppedIndex = roll.all.indexOf(lowestValue);
                
                return (
                  <div 
                    key={i}
                    className={`p-3 rounded-xl border transition-all ${
                      assignedAbility 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-slate-800/50 border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {roll.all.map((val, dieIndex) => (
                        <AnimatedDie 
                          key={dieIndex} 
                          value={val} 
                          isRolling={false}
                          isDropped={dieIndex === droppedIndex}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-white">{total}</span>
                        <span className={`ml-2 text-sm font-medium ${modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ({formatModifier(modifier)})
                        </span>
                      </div>
                      {assignedAbility ? (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {ABILITY_LABELS[assignedAbility].short}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Click an ability below to assign</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Standard Array / Roll Assignment */}
      {(method === 'standard' || (method === 'roll' && rolls.length > 0 && !isRolling)) && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center items-center p-4 bg-slate-800/30 rounded-xl">
            <span className="text-slate-400 text-sm mr-2">
              {unassignedIndices.filter(i => !Object.values(assignments).includes(i)).length > 0 
                ? 'Click a score, then click an ability:' 
                : 'All scores assigned!'}
            </span>
            {unassignedIndices.filter(i => !Object.values(assignments).includes(i)).map((scoreIndex) => (
              <button
                key={scoreIndex}
                onClick={() => setSelectedIndex(selectedIndex === scoreIndex ? null : scoreIndex)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  selectedIndex === scoreIndex
                    ? 'bg-indigo-500 text-white scale-110'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {scoresArray[scoreIndex]}
              </button>
            ))}
            {character.class && Object.keys(assignments).length === 0 && (
              <button
                onClick={autoAssignOptimal}
                className="ml-4 px-3 py-1.5 text-sm rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Assign Optimally
              </button>
            )}
            {Object.keys(assignments).length > 0 && (
              <button
                onClick={resetAbilities}
                className="ml-4 px-3 py-1.5 text-sm rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all"
              >
                Reset All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Ability Score Grid */}
      {method && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ABILITY_NAMES.map(ability => {
            const info = ABILITY_LABELS[ability];
            const score = method === 'pointbuy' ? pointBuyScores[ability] : character.abilities[ability];
            const modifier = getModifier(score);
            const isAssigned = (method === 'standard' || method === 'roll') ? assignments[ability] !== undefined : true;
            const assignedScore = isAssigned && assignments[ability] !== undefined ? scoresArray[assignments[ability]] : null;
            
            // Check if this is a primary ability for the selected class
            const isPrimaryAbility = character.class && CLASSES[character.class]?.primaryAbility?.includes(ability);
            
            return (
              <div
                key={ability}
                onClick={() => (method === 'standard' || method === 'roll') && selectedIndex !== null && assignScore(ability)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isPrimaryAbility
                    ? 'border-amber-500/60 shadow-lg shadow-amber-500/10'
                    : isAssigned && (method === 'standard' || method === 'roll')
                      ? 'border-green-500/30'
                      : 'border-slate-700/50'
                } ${
                  selectedIndex !== null && (method === 'standard' || method === 'roll')
                    ? 'cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/10'
                    : ''
                } ${
                  isAssigned && (method === 'standard' || method === 'roll')
                    ? 'bg-green-500/10'
                    : 'bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="text-lg font-bold text-white">{info.short}</div>
                      {isPrimaryAbility && (
                        <span className="px-1 py-0.5 rounded text-[9px] md:text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold whitespace-nowrap" title="Primary Ability for this class">
                          <span className="hidden md:inline">PRIMARY</span>
                          <span className="md:hidden">1°</span>
                        </span>
                      )}
                      {savingThrowOrder.includes(ability) && (
                        <span className="px-1 py-0.5 rounded text-[9px] md:text-[10px] bg-green-500/20 text-green-300 border border-green-500/30 whitespace-nowrap" title="Saving Throw Proficiency">
                          <span className="hidden md:inline">SAVE</span>
                          <span className="md:hidden">✓</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{info.name}</div>
                  </div>
                  <div className="text-right">
                    {method === 'manual' ? (
                      <input
                        type="number"
                        min="3"
                        max="18"
                        value={score}
                        onChange={(e) => setManualScore(ability, e.target.value)}
                        className="w-16 text-2xl font-bold text-center bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                      />
                    ) : method === 'pointbuy' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => adjustPointBuy(ability, -1)}
                          disabled={score <= 8}
                          className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-white w-8 text-center">{score}</span>
                        <button
                          onClick={() => adjustPointBuy(ability, 1)}
                          disabled={score >= 15 || pointBuyRemaining < (POINT_BUY_COSTS[score + 1] - POINT_BUY_COSTS[score])}
                          className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-white">{score}</div>
                    )}
                    <div className={`text-sm font-semibold ${modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatModifier(modifier)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">{info.desc}</div>
                {method === 'pointbuy' && (
                  <div className="text-xs text-indigo-400 mt-1">
                    Cost: {POINT_BUY_COSTS[score]} points
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Point Buy Summary */}
      {method === 'pointbuy' && (
        <div className={`p-4 rounded-xl border ${
          pointBuyRemaining === 0 
            ? 'bg-green-500/10 border-green-500/30' 
            : pointBuyRemaining < 0
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-slate-800/50 border-slate-700/50'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Points Remaining:</span>
            <span className={`text-2xl font-bold ${
              pointBuyRemaining === 0 ? 'text-green-400' : pointBuyRemaining < 0 ? 'text-red-400' : 'text-white'
            }`}>
              {pointBuyRemaining} / 27
            </span>
          </div>
          {pointBuyRemaining === 0 && (
            <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <Check className="w-3 h-3" /> All points allocated!
            </div>
          )}
        </div>
      )}

      {/* D&D Modifier Reference */}
      {method && (
        <div className="text-xs text-slate-600 text-center">
          D&D Modifier: (Score - 10) ÷ 2, rounded down. 8 = -1, 10 = +0, 12 = +1, 14 = +2, 16 = +3, 18 = +4
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ASI/FEATS STEP (Ability Score Improvement or Feat selection at levels 4, 8, etc.)
// ============================================================================

const ASIFeatsStep = ({ character, updateCharacter }) => {
  const asiLevels = getASILevels(character.level || 1);

  const primaryClassData = character.class ? CLASSES[character.class] : null;
  const multiclassData = (character.multiclass || []).map(mc => CLASSES[mc.classId]).filter(Boolean);
  const addUnique = (list, value) => {
    if (value && !list.includes(value)) list.push(value);
  };
  const primaryAbilityOrder = [];
  (primaryClassData?.primaryAbility || []).forEach((a) => addUnique(primaryAbilityOrder, a));
  multiclassData.forEach((cls) => (cls?.primaryAbility || []).forEach((a) => addUnique(primaryAbilityOrder, a)));

  // Saving throws only from primary class per official 5e rules
  const savingThrowOrder = [];
  (primaryClassData?.savingThrows || []).forEach((a) => addUnique(savingThrowOrder, a));
  
  // Initialize ASI choices if not exist
  const asiChoices = character.asiChoices || {};
  
  const updateASIChoice = (level, choice) => {
    const updated = { ...asiChoices, [level]: choice };
    updateCharacter('asiChoices', updated);
  };
  
  if (asiLevels.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">No ASI/Feats Available</p>
        <p className="text-sm mt-2">Characters gain Ability Score Improvements or Feats at levels 4, 8, 12, 16, and 19.</p>
        <p className="text-sm text-amber-400 mt-4">You can skip this step.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Ability Score Improvements & Feats</h3>
        <p className="text-sm text-slate-500">
          At certain levels, you can choose to increase ability scores OR gain a feat.
        </p>
        {(primaryClassData || multiclassData.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-500">Saving Throws:</span>
            {savingThrowOrder.map((st) => (
              <span key={st} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
                {ABILITY_LABELS[st]?.short}
              </span>
            ))}
            {primaryAbilityOrder.length > 0 && (
              <span className="text-slate-600 text-xs ml-2">
                Primary: {primaryAbilityOrder.map((a) => ABILITY_LABELS[a]?.short).join('/')}
              </span>
            )}
          </div>
        )}
      </div>
      
      {asiLevels.map(level => {
        const choice = asiChoices[level] || {};
        const choiceType = choice.type; // 'asi' or 'feat'
        
        return (
          <div key={level} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-400" />
              <h4 className="text-lg font-semibold text-white">Level {level}</h4>
            </div>
            
            {/* Choice Type Selector */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => updateASIChoice(level, { type: 'asi', abilityIncreases: {} })}
                className={`p-3 rounded-lg border transition-all ${
                  choiceType === 'asi'
                    ? 'bg-indigo-500/20 border-indigo-500/50'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
                }`}
              >
                <div className="text-sm font-semibold text-indigo-300">Ability Score Improvement</div>
                <div className="text-xs text-slate-400 mt-1">+2 to one ability, OR +1 to two abilities</div>
              </button>
              <button
                onClick={() => updateASIChoice(level, { type: 'feat', feat: null })}
                className={`p-3 rounded-lg border transition-all ${
                  choiceType === 'feat'
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30'
                }`}
              >
                <div className="text-sm font-semibold text-purple-300">Feat</div>
                <div className="text-xs text-slate-400 mt-1">Gain a special ability or feature</div>
              </button>
            </div>
            
            {/* ASI Selection */}
            {choiceType === 'asi' && (
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                <div className="text-sm font-semibold text-indigo-300 mb-3">Choose Your Increases</div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => updateASIChoice(level, { ...choice, asiType: 'single' })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      choice.asiType === 'single'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-indigo-500/30'
                    }`}
                  >
                    +2 to One Ability
                  </button>
                  <button
                    onClick={() => updateASIChoice(level, { ...choice, asiType: 'double' })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      choice.asiType === 'double'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-indigo-500/30'
                    }`}
                  >
                    +1 to Two Abilities
                  </button>
                </div>
                
                {choice.asiType === 'single' && (
                  <div className="grid grid-cols-3 gap-2">
                    {ABILITY_NAMES.map(ability => {
                      const currentScore = character.abilities?.[ability] || 10;
                      const isSelected = choice.singleAbility === ability;
                      const atMax = currentScore >= 20;
                      
                      return (
                        <button
                          key={ability}
                          onClick={() => updateASIChoice(level, { ...choice, singleAbility: ability })}
                          disabled={atMax}
                          className={`px-2 py-2 rounded text-xs font-medium transition-all border ${
                            isSelected
                              ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                              : atMax
                                ? 'bg-slate-900/30 border-slate-800/30 text-slate-600 cursor-not-allowed'
                                : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-indigo-500/30'
                          }`}
                        >
                          <div>{ABILITY_LABELS[ability].short}</div>
                          <div className="text-[10px] text-slate-500">{currentScore} → {currentScore + 2}</div>
                          {isSelected && <div className="text-green-400">✓</div>}
                          {atMax && <div className="text-red-400 text-[10px]">Max</div>}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {choice.asiType === 'double' && (
                  <div>
                    <div className="grid grid-cols-3 gap-2">
                      {ABILITY_NAMES.map(ability => {
                        const currentScore = character.abilities?.[ability] || 10;
                        const doubleAbilities = choice.doubleAbilities || [];
                        const isSelected = doubleAbilities.includes(ability);
                        const canSelect = doubleAbilities.length < 2 || isSelected;
                        const atMax = currentScore >= 20;
                        
                        return (
                          <button
                            key={ability}
                            onClick={() => {
                              const current = choice.doubleAbilities || [];
                              let updated;
                              if (current.includes(ability)) {
                                updated = current.filter(a => a !== ability);
                              } else if (current.length < 2) {
                                updated = [...current, ability];
                              } else {
                                return;
                              }
                              updateASIChoice(level, { ...choice, doubleAbilities: updated });
                            }}
                            disabled={!canSelect || atMax}
                            className={`px-2 py-2 rounded text-xs font-medium transition-all border ${
                              isSelected
                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                                : canSelect && !atMax
                                  ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-indigo-500/30'
                                  : 'bg-slate-900/30 border-slate-800/30 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <div>{ABILITY_LABELS[ability].short}</div>
                            <div className="text-[10px] text-slate-500">{currentScore} → {currentScore + 1}</div>
                            {isSelected && <div className="text-green-400">✓</div>}
                            {atMax && <div className="text-red-400 text-[10px]">Max</div>}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      {(choice.doubleAbilities?.length || 0)} / 2 selected
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Feat Selection */}
            {choiceType === 'feat' && (
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="text-sm font-semibold text-purple-300 mb-2">Choose a Feat</div>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  {Object.entries(FEATS).map(([featId, feat]) => {
                    const isSelected = choice.feat === featId;
                    return (
                      <button
                        key={featId}
                        onClick={() => updateASIChoice(level, { ...choice, feat: isSelected ? null : featId })}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className={`text-sm font-semibold ${isSelected ? 'text-purple-300' : 'text-slate-200'}`}>
                              {feat.name}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {feat.description}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {choice.feat && (
                  <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Selected: {FEATS[choice.feat]?.name}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// RACE SELECTION STEP (PHASE 3)
// ============================================================================

const RaceSelectionStep = ({ character, updateCharacter }) => {
  const [showAllRaces, setShowAllRaces] = useState(!character.race);
  const selectedRaceId = character.race;
  const selectedSubraceId = character.subrace;

  const selectedRace = selectedRaceId ? RACES[selectedRaceId] : null;

  const racialBonuses = (() => {
    const base = getRacialBonuses(selectedRaceId, selectedSubraceId);
    // Add variant human choices
    if (selectedRaceId === 'human' && selectedSubraceId === 'variant' && character.variantHumanChoices) {
      const variantBonuses = { ...base };
      character.variantHumanChoices.forEach(ability => {
        variantBonuses[ability] = (variantBonuses[ability] || 0) + 1;
      });
      return variantBonuses;
    }
    return base;
  })();
  const previewAbilities = applyBonusesToAbilities(character.abilities, racialBonuses);

  const pickRace = (raceId) => {
    updateCharacter('race', raceId);
    updateCharacter('subrace', null);
    setShowAllRaces(false);
  };

  const pickSubrace = (subId) => {
    updateCharacter('subrace', subId);
  };

  const getFullTraits = () => {
    if (!selectedRace) return [];
    const base = selectedRace.traits || [];
    const sub = selectedRace.subraces && selectedSubraceId
      ? (selectedRace.subraces[selectedSubraceId]?.traits || [])
      : [];
    // de-dupe while preserving order
    const seen = new Set();
    return [...base, ...sub].filter(t => {
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    });
  };

  const fullTraits = getFullTraits();

  const speed = (() => {
    if (!selectedRace) return null;
    let s = selectedRace.speed;
    if (selectedRace.subraces && selectedSubraceId && selectedRace.subraces[selectedSubraceId]?.speed) {
      s = selectedRace.subraces[selectedSubraceId].speed;
    }
    return s;
  })();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Choose Your Race</h3>
        <p className="text-sm text-slate-500">
          Racial bonuses are shown as a preview here. Your base ability scores stay unchanged.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Race Grid */}
        <div className="lg:col-span-3">
          {/* Mobile: Show selected race with change button when collapsed */}
          {character.race && !showAllRaces && (
            <div className="md:hidden mb-3">
              <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{RACE_ICONS[character.race]}</span>
                    <div>
                      <div className="font-medium text-indigo-300">{RACES[character.race]?.name}</div>
                      {character.subrace && RACES[character.race]?.subraces?.[character.subrace] && (
                        <div className="text-xs text-slate-400">{RACES[character.race].subraces[character.subrace].name}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllRaces(true)}
                    className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm hover:bg-slate-600/50 transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 ${character.race && !showAllRaces ? 'hidden md:grid' : ''}`}>
            {Object.entries(RACES).map(([id, race]) => {
              const isSelected = selectedRaceId === id;
              return (
                <button
                  key={id}
                  onClick={() => pickRace(id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
                  }`}
                >
                  <Tooltip content={race.description}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{RACE_ICONS[id] || '🧙'}</div>
                      <div className="min-w-0">
                        <div className={`font-semibold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                          {race.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Hover for details
                        </div>
                        <div className="text-xs mt-2">
                          <span className="text-slate-500">Bonuses: </span>
                          <span className={isSelected ? 'text-indigo-200' : 'text-slate-300'}>
                            {formatBonusLine(getRacialBonuses(id, null))}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-400 ml-auto mt-0.5 shrink-0" />
                      )}
                    </div>
                  </Tooltip>
                </button>
              );
            })}
          </div>

          {/* Subrace Selector */}
          {selectedRace && selectedRace.subraces && (
            <div className="mt-5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-slate-200">
                    {selectedRaceId === 'dragonborn' ? 'Choose Draconic Ancestry' : 'Choose Subrace'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {selectedRaceId === 'dragonborn'
                      ? 'This determines your breath weapon and resistance flavor.'
                      : 'Adds additional traits and sometimes extra bonuses.'}
                  </div>
                </div>
                {selectedSubraceId && (
                  <button
                    onClick={() => updateCharacter('subrace', null)}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedRace.subraces).map(([sid, sub]) => {
                  const isSelected = selectedSubraceId === sid;
                  const subBonus = sub.abilityBonuses ? formatBonusLine(sub.abilityBonuses) : null;

                  return (
                    <button
                      key={sid}
                      onClick={() => pickSubrace(sid)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-indigo-500/30'
                      }`}
                      title={sub.description || ''}
                    >
                      <div className="font-medium">{sub.name}</div>
                      {(sub.description || subBonus) && (
                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {sub.description || subBonus}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Variant Human Ability Choice */}
              {selectedRaceId === 'human' && selectedSubraceId === 'variant' && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="text-sm font-semibold text-amber-300 mb-2">Choose Two Abilities for +1 Bonus</div>
                    <div className="grid grid-cols-3 gap-2">
                      {ABILITY_NAMES.map(ability => {
                        const variantChoices = character.variantHumanChoices || [];
                        const isSelected = variantChoices.includes(ability);
                        const canSelect = variantChoices.length < 2 || isSelected;
                        
                        return (
                          <button
                            key={ability}
                            onClick={() => {
                              const current = character.variantHumanChoices || [];
                              let updated;
                              if (current.includes(ability)) {
                                updated = current.filter(a => a !== ability);
                              } else if (current.length < 2) {
                                updated = [...current, ability];
                              } else {
                                return; // Already have 2
                              }
                              updateCharacter('variantHumanChoices', updated);
                            }}
                            disabled={!canSelect}
                            className={`px-2 py-1.5 rounded text-xs font-medium transition-all border ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                                : canSelect
                                  ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-amber-500/30'
                                  : 'bg-slate-900/30 border-slate-800/30 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            {ABILITY_LABELS[ability].short}
                            {isSelected && ' ✓'}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      {(character.variantHumanChoices?.length || 0)} / 2 selected
                    </div>
                  </div>

                  {/* Feat Selection */}
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="text-sm font-semibold text-purple-300 mb-2">Choose a Bonus Feat</div>
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                      {Object.entries(FEATS).map(([featId, feat]) => {
                        const isSelected = character.variantHumanFeat === featId;
                        return (
                          <button
                            key={featId}
                            onClick={() => updateCharacter('variantHumanFeat', isSelected ? null : featId)}
                            className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-purple-500/20 border-purple-500/50'
                                : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className={`text-sm font-semibold ${isSelected ? 'text-purple-300' : 'text-slate-200'}`}>
                                  {feat.name}
                                </div>
                                <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                                  {feat.description}
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {character.variantHumanFeat && (
                      <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Selected: {FEATS[character.variantHumanFeat]?.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-2">
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4">
            {!selectedRace ? (
              <div className="text-center py-10 text-slate-500">
                <User className="w-14 h-14 mx-auto mb-3 opacity-40" />
                <div className="font-semibold text-slate-300">Select a race to see details</div>
                <div className="text-xs mt-1">Traits, speed, languages, and ability preview.</div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{RACE_ICONS[selectedRaceId] || '🧙'}</div>
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-white">
                      {selectedRace.name}
                      {selectedRace.subraces && selectedSubraceId
                        ? `: ${selectedRace.subraces[selectedSubraceId]?.name || ''}`
                        : ''}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      {selectedRace.subraces && selectedSubraceId && selectedRace.subraces[selectedSubraceId]?.description
                        ? selectedRace.subraces[selectedSubraceId].description
                        : selectedRace.description}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                    <div className="text-xs text-slate-500">Speed</div>
                    <div className="text-sm font-semibold text-slate-200">{speed} ft</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                    <div className="text-xs text-slate-500">Bonuses</div>
                    <div className="text-sm font-semibold text-slate-200">{formatBonusLine(racialBonuses)}</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-700/40">
                  <div className="text-xs text-slate-500 mb-2">Ability Preview</div>
                  <div className="grid grid-cols-3 gap-2">
                    {ABILITY_NAMES.map((a) => {
                      const base = character.abilities[a];
                      const bonus = racialBonuses[a] || 0;
                      const total = previewAbilities[a];
                      const mod = getModifier(total);

                      return (
                        <div key={a} className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
                          <div className="text-[11px] text-slate-500">{ABILITY_LABELS[a].short}</div>
                          <div className="flex items-baseline justify-between">
                            <div className="text-sm font-bold text-slate-200">
                              {total}
                              {bonus ? <span className="text-[11px] text-green-400 ml-1">(+{bonus})</span> : null}
                            </div>
                            <div className={`text-xs font-semibold ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatModifier(mod)}
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-600 mt-0.5">
                            Base {base}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-700/40 space-y-2">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Languages</div>
                    <div className="text-sm text-slate-200">
                      {(selectedRace.languages || []).join(', ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Traits</div>
                    {fullTraits.length ? (
                      <ul className="text-sm text-slate-200 space-y-1 list-disc list-inside">
                        {fullTraits.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-slate-400">No traits listed.</div>
                    )}
                  </div>
                </div>

                {/* Tiny note so nobody yells about Half-Elf choice bonuses yet */}
                {selectedRaceId === 'halfElf' && (
                  <div className="text-xs text-amber-400/90">
                    Half-Elf “choose two +1s” will be selectable in a later phase. For now it’s preview-only.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// REVIEW & EXPORT STEP (PHASE 8)
// ============================================================================

const ReviewStep = ({
  character,
  updateCharacter,
  onRandomize,
  onUndo,
  canUndo,
  randomWithMulticlass,
  setRandomWithMulticlass,
  onGoToStep
}) => {
  const [exportFormat, setExportFormat] = useState(null);
  const [copied, setCopied] = useState(false);

  const goToStep = (stepIndex) => {
    if (typeof stepIndex !== 'number') return;
    if (typeof onGoToStep === 'function') {
      onGoToStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const race = character.race ? RACES[character.race] : null;
  const subrace = character.subrace && race?.subraces ? race.subraces[character.subrace] : null;
  const classData = character.class ? CLASSES[character.class] : null;
  const background = character.background ? BACKGROUNDS[character.background] : null;

  const totalLevel = character.level || 1;
  const multiclassEntries = character.multiclass || [];
  const multiclassLevelSum = multiclassEntries.reduce((sum, mc) => sum + (Number(mc?.level) || 0), 0);
  const primaryLevel = Math.max(1, totalLevel - multiclassLevelSum);

  // Start with racial/subrace bonuses and include Variant Human +1/+1
  const baseRacialBonuses = getRacialBonuses(character.race, character.subrace);
  const racialBonuses = (() => {
    if (character.race === 'human' && character.subrace === 'variant' && Array.isArray(character.variantHumanChoices)) {
      const b = { ...baseRacialBonuses };
      character.variantHumanChoices.forEach((ability) => {
        b[ability] = (b[ability] || 0) + 1;
      });
      return b;
    }
    return baseRacialBonuses;
  })();

  // Aggregate ASI bonuses from selections at 4/8/12/16/19
  const asiBonuses = (() => {
    const out = {};
    const choices = character.asiChoices || {};
    Object.values(choices).forEach((choice) => {
      if (!choice || choice.type !== 'asi') return;
      if (choice.asiType === 'single' && choice.singleAbility) {
        out[choice.singleAbility] = (out[choice.singleAbility] || 0) + 2;
      } else if (choice.asiType === 'double' && Array.isArray(choice.doubleAbilities)) {
        choice.doubleAbilities.forEach((ability) => {
          out[ability] = (out[ability] || 0) + 1;
        });
      }
    });
    return out;
  })();

  // Merge racial and ASI bonuses
  const mergedBonuses = { ...racialBonuses };
  ABILITY_NAMES.forEach((a) => {
    if (asiBonuses[a]) mergedBonuses[a] = (mergedBonuses[a] || 0) + asiBonuses[a];
  });

  // Apply and clamp to 20 per 5e rules
  const finalAbilities = (() => {
    const out = applyBonusesToAbilities(character.abilities, mergedBonuses);
    ABILITY_NAMES.forEach((a) => {
      if (out[a] > 20) out[a] = 20;
    });
    return out;
  })();

  const spellcastingInfo = character.class ? getSpellcastingInfo(character.class, totalLevel) : null;

  // Calculate derived stats
  const proficiencyBonus = Math.ceil(totalLevel / 4) + 1; // +2 at level 1
  const initiative = getModifier(finalAbilities.dexterity);
  const speed = subrace?.speed || race?.speed || 30;
  
  // AC calculation - accounts for Unarmored Defense (Barbarian, Monk)
  const calculateAC = () => {
    const dexMod = getModifier(finalAbilities.dexterity);
    const conMod = getModifier(finalAbilities.constitution);
    const wisMod = getModifier(finalAbilities.wisdom);
    
    // Barbarian Unarmored Defense: 10 + DEX + CON
    if (character.class === 'barbarian') {
      return 10 + dexMod + conMod;
    }
    // Monk Unarmored Defense: 10 + DEX + WIS
    if (character.class === 'monk') {
      return 10 + dexMod + wisMod;
    }
    // Draconic Sorcerer: 13 + DEX (if subclass is draconicBloodline)
    if (character.class === 'sorcerer' && character.subclass === 'draconicBloodline') {
      return 13 + dexMod;
    }
    // Default: 10 + DEX
    return 10 + dexMod;
  };
  const baseAC = calculateAC();
  
  // HP calculation - uses calculateHP helper for multi-level support
  const hitDie = classData?.hitDie || 8;
  const conMod = getModifier(finalAbilities.constitution);

  const calculateMulticlassHP = () => {
    if (!character.class) return hitDie + conMod;

    const getAverageGain = (hitDieValue) => Math.floor(hitDieValue / 2) + 1;
    const primaryHitDie = CLASSES[character.class]?.hitDie || hitDie;

    // Starter approximation:
    // - Level 1 (primary): max hit die + CON
    // - Remaining primary levels: average + CON
    // - Multiclass levels: average + CON each level
    const primaryFirst = primaryHitDie + conMod;
    const primaryRemainder = Math.max(0, primaryLevel - 1) * (getAverageGain(primaryHitDie) + conMod);

    const multiclassHP = multiclassEntries.reduce((sum, mc) => {
      const mcClass = CLASSES[mc.classId];
      if (!mcClass) return sum;
      const mcLevels = Math.max(0, Number(mc.level) || 0);
      return sum + mcLevels * (getAverageGain(mcClass.hitDie) + conMod);
    }, 0);

    return Math.max(1, primaryFirst + primaryRemainder + multiclassHP);
  };

  const maxHP = character.class
    ? (multiclassEntries.length > 0 ? calculateMulticlassHP() : calculateHP(character.class, totalLevel, conMod, 'average'))
    : hitDie + conMod;

  // Passive Perception
  const passivePerception = 10 + getModifier(finalAbilities.wisdom);

  // Get all proficiencies
  const getAllProficiencies = () => {
    // Combine fixed languages with chosen languages
    const fixedLangs = getFixedLanguages(character.race, character.subrace);
    const chosenLangs = (character.chosenLanguages || []).map(id => LANGUAGES[id]?.name).filter(Boolean);
    const allLanguages = [...fixedLangs, ...chosenLangs];
    
    // Combine class skills with background skills and replacement skills, remove overlaps
    const classSkills = character.classSkills || [];
    const bgSkills = background?.skillProficiencies || [];
    // Normalize class skill ids to names if needed
    const normalizedClassSkills = classSkills.map(s => {
      // If s is an id in SKILLS, use its name; otherwise assume it's already a name
      if (SKILLS[s]) return SKILLS[s].name;
      return s;
    });
    // Overlap are background skills that appear in the class selections
    const overlap = bgSkills.filter(skill => normalizedClassSkills.map(n => n.toLowerCase()).includes(skill.toLowerCase()));
    const replacementSkills = (character.replacementSkills || []).map(id => SKILLS[id]?.name).filter(Boolean);
    const bgEffective = [
      ...bgSkills.filter(s => !overlap.map(o => o.toLowerCase()).includes(s.toLowerCase())),
      ...replacementSkills
    ];
    const allSkillNames = Array.from(new Set([ ...normalizedClassSkills, ...bgEffective ]));
    
    // Calculate skill bonuses (ability mod + proficiency since these are proficient skills)
    const allSkillsWithBonuses = allSkillNames.map(skillName => {
      // Find the skill in SKILLS to get its ability
      const skillEntry = Object.values(SKILLS).find(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (skillEntry) {
        const abilityMod = getModifier(finalAbilities[skillEntry.ability]);
        const totalBonus = abilityMod + proficiencyBonus;
        const bonusStr = totalBonus >= 0 ? `+${totalBonus}` : `${totalBonus}`;
        return `${skillName} ${bonusStr}`;
      }
      return skillName;
    });
    
    // Saving throws - only from primary class per official 5e rules
    const profs = {
      armor: classData?.armorProficiencies || [],
      weapons: classData?.weaponProficiencies || [],
      tools: background?.toolProficiencies || [],
      skills: allSkillsWithBonuses,
      savingThrows: (classData?.savingThrows || []).map(s => {
        const abilityMod = getModifier(finalAbilities[s]);
        const totalBonus = abilityMod + proficiencyBonus;
        const bonusStr = totalBonus >= 0 ? `+${totalBonus}` : `${totalBonus}`;
        return `${ABILITY_LABELS[s]?.short || s} ${bonusStr}`;
      }),
      languages: allLanguages.length > 0 ? allLanguages : ['Common']
    };
    return profs;
  };

  const proficiencies = getAllProficiencies();

  // Get selected equipment
  const getEquipmentList = () => {
    if (character.equipmentMethod === 'starting' && character.class) {
      const classEquip = STARTING_EQUIPMENT[character.class];
      const items = [...(classEquip?.fixed || [])];
      
      // Add chosen options
      if (character.equipmentChoices && classEquip?.choices) {
        classEquip.choices.forEach((choice, idx) => {
          const chosenIdx = character.equipmentChoices[idx];
          if (chosenIdx !== undefined && choice.options[chosenIdx]) {
            items.push(choice.options[chosenIdx]);
          }
        });
      }
      
      // Add background equipment
      if (background?.equipment) {
        items.push(...background.equipment);
      }
      
      return items;
    } else if (character.equipmentMethod === 'gold') {
      return character.purchasedItems || [];
    } else if (character.equipment && Array.isArray(character.equipment)) {
      // For random characters with direct equipment array - clean up proficiency notes
      return character.equipment.map(item => 
        typeof item === 'string' ? item.replace(/\s*\(if proficient\)/gi, '') : item
      );
    }
    return [];
  };

  const equipment = getEquipmentList();

  // Get selected spells
  const getSpellList = () => {
    const cantrips = (character.cantrips || []).map(id => SPELLS[id]?.name).filter(Boolean);
    const spells = (character.spells || []).map(id => SPELLS[id]?.name).filter(Boolean);
    return { cantrips, spells };
  };

  const spellList = getSpellList();

  // Helpers: find spell by name/id and format tooltip content
  const getSpellIdByName = (name) => {
    const entry = Object.entries(SPELLS).find(([_, s]) => s?.name?.toLowerCase() === (name || '').toLowerCase());
    return entry ? entry[0] : null;
  };

  const renderSpellTooltipContent = (spell) => {
    if (!spell) return null;
    return (
      <div className="space-y-1">
        <div className="text-xs text-slate-200 font-semibold">{spell.name}</div>
        <div className="text-[11px] text-slate-400">
          {spell.school ? `${spell.school} • ` : ''}
          {typeof spell.level === 'number' ? (spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`) : ''}
        </div>
        <div className="text-[11px] text-slate-400">
          {spell.ritual ? <span className="text-amber-300">Ritual</span> : null}
          {spell.ritual && spell.concentration ? ' • ' : ''}
          {spell.concentration ? <span className="text-indigo-300">Concentration</span> : null}
        </div>
        {spell.description && (
          <div className="text-[11px] text-slate-300 leading-relaxed">
            {spell.description}
          </div>
        )}
      </div>
    );
  };

  // Generate text export
  const generateTextExport = () => {
    const lines = [
      '═══════════════════════════════════════════════════════════',
      `  ${character.name || 'Unnamed Character'}`,
      '═══════════════════════════════════════════════════════════',
      '',
      `Race: ${race?.name || 'None'}${subrace ? ` (${subrace.name})` : ''}`,
      `Class: ${classData?.name || 'None'} ${totalLevel}${character.subclass && SUBCLASSES[character.class]?.[character.subclass] ? ` (${SUBCLASSES[character.class][character.subclass].name})` : ''}${character.multiclass && character.multiclass.length > 0 ? ` / ${character.multiclass.map(m => {
        const mcClass = CLASSES[m.classId];
        const mcSubclass = m.subclass && SUBCLASSES[m.classId]?.[m.subclass];
        return `${mcClass?.name} ${m.level}${mcSubclass ? ` (${mcSubclass.name})` : ''}`;
      }).join(' / ')}` : ''}`,
      `Background: ${background?.name || 'None'}`,
      '',
      '─── ABILITY SCORES ───────────────────────────────────────',
      '',
      ...ABILITY_NAMES.map(a => {
        const base = character.abilities[a];
        const bonus = racialBonuses[a] || 0;
        const final = finalAbilities[a];
        const mod = getModifier(final);
        const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
        const bonusStr = bonus > 0 ? ` (+${bonus} racial)` : '';
        return `${ABILITY_LABELS[a].short}: ${final} (${modStr})${bonusStr}`;
      }),
      '',
      '─── COMBAT STATS ─────────────────────────────────────────',
      '',
      `AC: ${baseAC}`,
      `HP: ${maxHP}${character.multiclass && character.multiclass.length > 0 ? ' (approx. average for multiclass)' : ' (d' + hitDie + ' + ' + conMod + ')'}`,
      `Initiative: ${initiative >= 0 ? '+' : ''}${initiative}`,
      `Speed: ${speed} ft`,
      `Proficiency Bonus: +${proficiencyBonus}`,
      `Passive Perception: ${passivePerception}`,
      '',
      '─── PROFICIENCIES ────────────────────────────────────────',
      '',
      `Saving Throws: ${proficiencies.savingThrows.join(', ') || 'None'}`,
      `Skills: ${proficiencies.skills.join(', ') || 'None'}`,
      `Armor: ${proficiencies.armor.join(', ') || 'None'}`,
      `Weapons: ${proficiencies.weapons.join(', ') || 'None'}`,
      `Tools: ${proficiencies.tools.join(', ') || 'None'}`,
      `Languages: ${proficiencies.languages.join(', ') || 'Common'}`,
      '',
      '─── FEATURES & TRAITS ────────────────────────────────────',
      '',
      `Racial Traits: ${race?.traits?.join(', ') || 'None'}`,
      `Class Features: ${classData?.features?.join(', ') || 'None'}`,
      `Background Feature: ${background?.feature || 'None'}`,
      '',
    ];

    // Add Fighting Style
    if (character.fightingStyle && FIGHTING_STYLES[character.fightingStyle]) {
      lines.push('─── FIGHTING STYLE ───────────────────────────────────────');
      lines.push('');
      lines.push(`${FIGHTING_STYLES[character.fightingStyle].name}`);
      lines.push(`${FIGHTING_STYLES[character.fightingStyle].description}`);
      lines.push('');
    }

    // Add Warlock Invocations
    if (character.warlockInvocations && character.warlockInvocations.length > 0) {
      lines.push('─── ELDRITCH INVOCATIONS ─────────────────────────────────');
      lines.push('');
      character.warlockInvocations.forEach(invKey => {
        const inv = WARLOCK_INVOCATIONS[invKey];
        if (inv) {
          lines.push(`${inv.name}${inv.prerequisite ? ` (${inv.prerequisite})` : ''}`);
        }
      });
      lines.push('');
    }

    // Add Metamagic Options
    if (character.metamagicOptions && character.metamagicOptions.length > 0) {
      lines.push('─── METAMAGIC OPTIONS ────────────────────────────────────');
      lines.push('');
      character.metamagicOptions.forEach(metaKey => {
        const meta = METAMAGIC_OPTIONS[metaKey];
        if (meta) {
          lines.push(`${meta.name} (${meta.cost} SP)`);
        }
      });
      lines.push('');
    }

    // Add Battle Master Maneuvers
    if (character.battleMasterManeuvers && character.battleMasterManeuvers.length > 0) {
      lines.push('─── BATTLE MASTER MANEUVERS ──────────────────────────────');
      lines.push('');
      character.battleMasterManeuvers.forEach(manKey => {
        const man = BATTLE_MASTER_MANEUVERS[manKey];
        if (man) lines.push(`${man.name}`);
      });
      lines.push('');
    }

    // Add Musical Instrument
    if (character.musicalInstrument && MUSICAL_INSTRUMENTS[character.musicalInstrument]) {
      lines.push('─── MUSICAL INSTRUMENT ───────────────────────────────────');
      lines.push('');
      lines.push(MUSICAL_INSTRUMENTS[character.musicalInstrument].name);
      lines.push('');
    }

    // Add Physical Characteristics
    if (character.physicalCharacteristics && 
        (character.physicalCharacteristics.age || 
         character.physicalCharacteristics.height || 
         character.physicalCharacteristics.weight || 
         character.physicalCharacteristics.eyes || 
         character.physicalCharacteristics.hair || 
         character.physicalCharacteristics.skin)) {
      lines.push('─── PHYSICAL CHARACTERISTICS ─────────────────────────────');
      lines.push('');
      if (character.physicalCharacteristics.age) lines.push(`Age: ${character.physicalCharacteristics.age}`);
      if (character.physicalCharacteristics.height) lines.push(`Height: ${character.physicalCharacteristics.height}`);
      if (character.physicalCharacteristics.weight) lines.push(`Weight: ${character.physicalCharacteristics.weight}`);
      if (character.physicalCharacteristics.eyes) lines.push(`Eyes: ${character.physicalCharacteristics.eyes}`);
      if (character.physicalCharacteristics.hair) lines.push(`Hair: ${character.physicalCharacteristics.hair}`);
      if (character.physicalCharacteristics.skin) lines.push(`Skin: ${character.physicalCharacteristics.skin}`);
      lines.push('');
    }

    if (equipment.length > 0) {
      lines.push('─── EQUIPMENT ────────────────────────────────────────────');
      lines.push('');
      equipment.forEach(item => lines.push(`• ${item}`));
      if (character.equipmentMethod === 'gold' && character.gold > 0) {
        lines.push(`• ${character.gold} gp remaining`);
      }
      lines.push('');
    }

    if (spellcastingInfo?.available && (spellList.cantrips.length > 0 || spellList.spells.length > 0)) {
      lines.push('─── SPELLCASTING ─────────────────────────────────────────');
      lines.push('');
      lines.push(`Spellcasting Ability: ${ABILITY_LABELS[spellcastingInfo.ability]?.name}`);
      lines.push(`Spell Save DC: ${8 + proficiencyBonus + getModifier(finalAbilities[spellcastingInfo.ability])}`);
      lines.push(`Spell Attack: +${proficiencyBonus + getModifier(finalAbilities[spellcastingInfo.ability])}`);
      
      // Add spell slots to export
      const slots = getSpellSlots(character.class, totalLevel);
      if (slots) {
        if (character.class === 'warlock') {
          lines.push(`Pact Magic: ${slots.slots} slots (Level ${slots.level})`);
        } else {
          const slotStr = Object.entries(slots)
            .filter(([_, count]) => count > 0)
            .map(([lvl, count]) => `${lvl === '1' ? '1st' : lvl === '2' ? '2nd' : lvl === '3' ? '3rd' : `${lvl}th`}: ${count}`)
            .join(', ');
          if (slotStr) lines.push(`Spell Slots: ${slotStr}`);
        }
      }
      
      lines.push('');
      if (spellList.cantrips.length > 0) {
        lines.push(`Cantrips: ${spellList.cantrips.join(', ')}`);
      }
      if (spellList.spells.length > 0) {
        lines.push(`1st Level Spells: ${spellList.spells.join(', ')}`);
      }
      lines.push('');
    }

    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('  Generated by AetherNames Character Creator');
    lines.push('═══════════════════════════════════════════════════════════');

    return lines.join('\n');
  };

  // Generate JSON export
  const generateJSONExport = () => {
    return JSON.stringify({
      name: character.name,
      playerName: character.playerName,
      race: race?.name,
      subrace: subrace?.name || null,
      class: classData?.name,
      level: totalLevel,
      background: background?.name,
      abilities: {
        base: character.abilities,
        racial: racialBonuses,
        final: finalAbilities
      },
      combat: {
        ac: baseAC,
        hp: maxHP,
        hitDie: `d${hitDie}`,
        initiative: initiative,
        speed: speed,
        proficiencyBonus: proficiencyBonus,
        passivePerception: passivePerception
      },
      proficiencies: proficiencies,
      features: {
        racial: race?.traits || [],
        class: classData?.features || [],
        background: background?.feature || null,
        fightingStyle: character.fightingStyle ? FIGHTING_STYLES[character.fightingStyle]?.name : null,
        warlockInvocations: character.warlockInvocations?.map(key => WARLOCK_INVOCATIONS[key]?.name).filter(Boolean) || [],
        metamagicOptions: character.metamagicOptions?.map(key => METAMAGIC_OPTIONS[key]?.name).filter(Boolean) || [],
        battleMasterManeuvers: character.battleMasterManeuvers?.map(key => BATTLE_MASTER_MANEUVERS[key]?.name).filter(Boolean) || [],
        musicalInstrument: character.musicalInstrument ? MUSICAL_INSTRUMENTS[character.musicalInstrument]?.name : null
      },
      physicalCharacteristics: character.physicalCharacteristics || {},
      equipment: equipment,
      gold: character.gold || 0,
      spellcasting: spellcastingInfo?.available ? {
        ability: spellcastingInfo.ability,
        saveDC: 8 + proficiencyBonus + getModifier(finalAbilities[spellcastingInfo.ability]),
        attackBonus: proficiencyBonus + getModifier(finalAbilities[spellcastingInfo.ability]),
        cantrips: spellList.cantrips,
        spells: spellList.spells
      } : null
    }, null, 2);
  };

  // Generate beautiful PDF character sheet
  const generatePDFExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let y = margin;

    // Color palette - Fantasy RPG theme
    const colors = {
      parchment: [252, 248, 240],
      darkPurple: [45, 35, 75],
      gold: [218, 165, 32],
      lightGold: [255, 215, 100],
      silver: [192, 192, 192],
      headerBg: [58, 45, 95],
      textDark: [40, 30, 50],
      textMuted: [100, 90, 110],
      accentBlue: [70, 130, 180],
      accentPurple: [138, 92, 246]
    };

    // Parchment background
    doc.setFillColor(...colors.parchment);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Helper functions
    const addDecorativeBorder = () => {
      // Outer decorative border
      doc.setDrawColor(...colors.gold);
      doc.setLineWidth(2);
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
      
      // Inner border
      doc.setDrawColor(...colors.darkPurple);
      doc.setLineWidth(0.5);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
      
      // Corner decorations
      const cornerSize = 8;
      [
        [8, 8], [pageWidth - 8, 8], 
        [8, pageHeight - 8], [pageWidth - 8, pageHeight - 8]
      ].forEach(([x, y]) => {
        doc.setFillColor(...colors.gold);
        doc.circle(x, y, 1.5, 'F');
      });
    };

    const addText = (text, x, yPos, size = 12, style = 'normal', color = colors.textDark) => {
      doc.setFontSize(size);
      doc.setFont('times', style);
      doc.setTextColor(...color);
      doc.text(text, x, yPos);
    };

    const addStyledBox = (x, yPos, width, height, label, value, labelSize = 8, valueSize = 16, boxColor = colors.darkPurple) => {
      // Clean white background
      doc.setFillColor(255, 255, 255);
      doc.rect(x, yPos, width, height, 'F');
      
      // Strong border
      doc.setDrawColor(...boxColor);
      doc.setLineWidth(1.5);
      doc.rect(x, yPos, width, height);
      
      // Inner gold accent
      doc.setDrawColor(...colors.gold);
      doc.setLineWidth(0.4);
      doc.rect(x + 1, yPos + 1, width - 2, height - 2);
      
      // Label at top
      doc.setFontSize(labelSize);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.textMuted);
      const labelWidth = doc.getTextWidth(label);
      doc.text(label, x + (width - labelWidth) / 2, yPos + 5);
      
      // Value (large, centered, bold)
      doc.setFontSize(valueSize);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.textDark);
      const valueStr = String(value);
      const valueWidth = doc.getTextWidth(valueStr);
      doc.text(valueStr, x + (width - valueWidth) / 2, yPos + height - 5);
    };

    const addAbilityBox = (x, yPos, ability, score, modifier, bonus = 0) => {
      const width = 28;
      const height = 30;
      
      // White background with purple border
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...colors.darkPurple);
      doc.setLineWidth(1.5);
      doc.rect(x, yPos, width, height, 'FD');
      
      // Gold inner accent
      doc.setDrawColor(...colors.gold);
      doc.setLineWidth(0.4);
      doc.rect(x + 1, yPos + 1, width - 2, height - 2);
      
      // Ability abbreviation
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.darkPurple);
      const abilityText = ABILITY_LABELS[ability].short.toUpperCase();
      const abilityWidth = doc.getTextWidth(abilityText);
      doc.text(abilityText, x + (width - abilityWidth) / 2, yPos + 6);
      
      // Modifier circle
      const circleY = yPos + 14;
      doc.setFillColor(...colors.headerBg);
      doc.circle(x + width / 2, circleY, 6, 'F');
      doc.setDrawColor(...colors.gold);
      doc.setLineWidth(0.8);
      doc.circle(x + width / 2, circleY, 6);
      
      // Modifier value
      const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.setTextColor(255, 255, 255);
      const modWidth = doc.getTextWidth(modStr);
      doc.text(modStr, x + (width - modWidth) / 2, circleY + 2);
      
      // Score at bottom
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.textDark);
      const scoreWidth = doc.getTextWidth(String(score));
      doc.text(String(score), x + (width - scoreWidth) / 2, yPos + height - 3);
      
      // Racial bonus indicator
      if (bonus > 0) {
        doc.setFontSize(7);
        doc.setTextColor(...colors.accentBlue);
        doc.text(`+${bonus}`, x + width - 5, yPos + height - 2);
      }
    };

    const drawSectionHeader = (text, yPos) => {
      const headerHeight = 7;
      
      // Purple background
      doc.setFillColor(...colors.headerBg);
      doc.rect(margin, yPos, pageWidth - 2 * margin, headerHeight, 'F');
      
      // Gold accent lines
      doc.setDrawColor(...colors.gold);
      doc.setLineWidth(1.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos + headerHeight, pageWidth - margin, yPos + headerHeight);
      
      // Section title
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.lightGold);
      doc.text(text, margin + 4, yPos + 5.5);
      
      // Corner dots
      doc.setFillColor(...colors.gold);
      doc.circle(margin, yPos, 1.5, 'F');
      doc.circle(pageWidth - margin, yPos, 1.5, 'F');
      doc.circle(margin, yPos + headerHeight, 1.5, 'F');
      doc.circle(pageWidth - margin, yPos + headerHeight, 1.5, 'F');
      
      return yPos + headerHeight + 2;
    };

    addDecorativeBorder();

    // ============== HEADER ==============
    const headerHeight = 28;
    doc.setFillColor(...colors.darkPurple);
    doc.rect(margin, margin, pageWidth - 2 * margin, headerHeight, 'F');
    
    // Gold border
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(2.5);
    doc.rect(margin, margin, pageWidth - 2 * margin, headerHeight);
    doc.setLineWidth(0.5);
    doc.rect(margin + 1.5, margin + 1.5, pageWidth - 2 * margin - 3, headerHeight - 3);
    
    // Character name - larger and properly positioned
    doc.setFontSize(28);
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.lightGold);
    const charName = character.name || 'Unnamed Character';
    const nameWidth = doc.getTextWidth(charName);
    doc.text(charName, (pageWidth - nameWidth) / 2, margin + 11);
    
    // Class/Level line - multiclass support
    // Primary class is in character.class + character.level
    // Multiclass array contains ADDITIONAL classes only
    let classText = '';
    const primarySubclassName = character.subclass && SUBCLASSES[character.class]?.[character.subclass]?.name;
    const primaryClassText = `${classData?.name || 'Unknown'} ${character.level || totalLevel}${primarySubclassName ? ` (${primarySubclassName})` : ''}`;
    
    if (character.multiclass && character.multiclass.length > 0) {
      // Show primary class + all additional multiclass entries
      const multiclassText = character.multiclass.map(mc => {
        const mcClass = CLASSES[mc.classId];
        const mcSubclass = mc.subclass && SUBCLASSES[mc.classId]?.[mc.subclass];
        return `${mcClass?.name || 'Unknown'} ${mc.level}${mcSubclass ? ` (${mcSubclass.name})` : ''}`;
      }).join(' / ');
      classText = `${primaryClassText} / ${multiclassText}`;
    } else {
      classText = primaryClassText;
    }
    doc.setFontSize(14);
    doc.setFont('times', 'italic');
    doc.setTextColor(255, 255, 255);
    const classWidth = doc.getTextWidth(classText);
    doc.text(classText, (pageWidth - classWidth) / 2, margin + 18);
    
    // Race & Background - centered below class
    const raceText = `${race?.name || 'Unknown'}${subrace ? ` (${subrace.name})` : ''}`;
    const bgText = background?.name || 'Unknown';
    const detailText = `${raceText}  •  ${bgText}`;
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.setTextColor(...colors.silver);
    const detailWidth = doc.getTextWidth(detailText);
    doc.text(detailText, (pageWidth - detailWidth) / 2, margin + 25);
    
    // Player name - left corner
    if (character.playerName) {
      doc.setFontSize(9);
      doc.setFont('times', 'italic');
      doc.setTextColor(...colors.silver);
      doc.text(`Player: ${character.playerName}`, margin + 4, margin + 6);
    }
    
    // Alignment - right corner
    if (character.alignment && ALIGNMENTS[character.alignment]) {
      doc.setFontSize(9);
      doc.setFont('times', 'italic');
      doc.setTextColor(...colors.silver);
      const alignText = ALIGNMENTS[character.alignment].name;
      const alignWidth = doc.getTextWidth(alignText);
      doc.text(alignText, pageWidth - margin - alignWidth - 4, margin + 6);
    }

    y = margin + headerHeight + 4;

    // ============== CORE STATS ==============
    y = drawSectionHeader('CORE STATS', y) + 2;
    
    // Evenly spaced stat boxes
    const statBoxWidth = 25;
    const statBoxHeight = 22;
    const statLabels = ['AC', 'INIT', 'SPEED', 'PROF', 'HP', 'HIT DIE', 'PERCEP'];
    const statValues = [baseAC, initiative >= 0 ? `+${initiative}` : initiative, `${speed}ft`, `+${proficiencyBonus}`, maxHP, `d${hitDie}`, passivePerception];
    const statColors = [colors.darkPurple, colors.darkPurple, colors.darkPurple, colors.darkPurple, colors.accentBlue, colors.darkPurple, colors.darkPurple];
    
    const totalStatWidth = statLabels.length * statBoxWidth;
    const statGap = (pageWidth - 2 * margin - totalStatWidth) / (statLabels.length - 1);
    
    statLabels.forEach((label, idx) => {
      const x = margin + idx * (statBoxWidth + statGap);
      addStyledBox(x, y, statBoxWidth, statBoxHeight, label, statValues[idx], 8, 14, statColors[idx]);
    });

    y += statBoxHeight + 4;

    // ============== ABILITY SCORES ==============
    y = drawSectionHeader('ABILITY SCORES', y) + 2;
    
    const abilityBoxWidth = 28;
    const totalAbilityWidth = 6 * abilityBoxWidth;
    const abilityGap = (pageWidth - 2 * margin - totalAbilityWidth) / 5;
    
    ABILITY_NAMES.forEach((ability, idx) => {
      const final = finalAbilities[ability];
      const mod = getModifier(final);
      const bonus = racialBonuses[ability] || 0;
      const x = margin + idx * (abilityBoxWidth + abilityGap);
      addAbilityBox(x, y, ability, final, mod, bonus);
    });

    y += 34;

    // ============== PROFICIENCIES ==============
    y = drawSectionHeader('PROFICIENCIES', y) + 3;
    
    // Three-column layout: Saves | Skills (2 cols)
    const saveColX = margin + 3;
    const skillCol1X = margin + 55;
    const skillCol2X = margin + 115;
    
    // Saving Throws header
    doc.setFontSize(11);
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.darkPurple);
    doc.text('SAVING THROWS', saveColX, y);
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(0.5);
    doc.line(saveColX, y + 1.5, saveColX + 38, y + 1.5);
    
    // Skills header
    doc.text('SKILLS', skillCol1X, y);
    doc.line(skillCol1X, y + 1.5, skillCol1X + 18, y + 1.5);
    
    const profStartY = y + 6;
    
    // Saving Throws list
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.setTextColor(...colors.textDark);
    
    proficiencies.savingThrows.forEach((save, idx) => {
      doc.setFillColor(...colors.gold);
      doc.circle(saveColX + 2, profStartY + idx * 5, 1, 'F');
      doc.text(save, saveColX + 6, profStartY + idx * 5 + 1.5);
    });
    
    // Skills - two columns
    const skillsPerCol = Math.ceil(proficiencies.skills.length / 2);
    proficiencies.skills.forEach((skill, idx) => {
      const col = idx < skillsPerCol ? 0 : 1;
      const rowIdx = col === 0 ? idx : idx - skillsPerCol;
      const skillX = col === 0 ? skillCol1X : skillCol2X;
      const bulletY = profStartY + rowIdx * 5;
      
      doc.setFillColor(...colors.accentPurple);
      doc.circle(skillX + 2, bulletY, 1, 'F');
      doc.text(skill, skillX + 6, bulletY + 1.5);
    });
    
    y = profStartY + Math.max(proficiencies.savingThrows.length * 5, skillsPerCol * 5) + 2;
    
    // Languages
    if (proficiencies.languages && proficiencies.languages.length > 0) {
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.darkPurple);
      doc.text('LANGUAGES', margin + 3, y);
      
      doc.setDrawColor(...colors.gold);
      doc.line(margin + 3, y + 1.5, margin + 33, y + 1.5);
      
      y += 5;
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.textDark);
      const langText = proficiencies.languages.join(', ');
      const langLines = doc.splitTextToSize(langText, pageWidth - 2 * margin - 6);
      langLines.forEach((line, idx) => {
        doc.text(line, margin + 5, y + idx * 4);
      });
      y += langLines.length * 4 + 2;
    }

    y += 3;

    // ============== TWO-COLUMN LAYOUT FOR BOTTOM SECTIONS ==============
    const twoColStartY = y;
    const bottomLeftX = margin;
    const bottomRightX = pageWidth / 2 + 4;
    const leftColWidth = pageWidth / 2 - margin - 6;
    const rightColWidth = pageWidth / 2 - margin - 6;
    
    let leftY = twoColStartY;
    let rightY = twoColStartY;
    
    // Column header helper
    const drawColumnHeader = (text, yPos, xPos, width) => {
      const headerHeight = 6;
      doc.setFillColor(...colors.headerBg);
      doc.rect(xPos, yPos, width, headerHeight, 'F');
      doc.setDrawColor(...colors.gold);
      doc.setLineWidth(1.2);
      doc.line(xPos, yPos, xPos + width, yPos);
      doc.setLineWidth(0.4);
      doc.line(xPos, yPos + headerHeight, xPos + width, yPos + headerHeight);
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.lightGold);
      doc.text(text, xPos + 3, yPos + 4.5);
      return yPos + headerHeight + 2;
    };

    // ============== LEFT COLUMN: FEATURES & TRAITS ==============
    leftY = drawColumnHeader('FEATURES & TRAITS', leftY, bottomLeftX, leftColWidth);
    
    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.setTextColor(...colors.textDark);
    
    const features = [];
    if (race?.traits) features.push(...race.traits.map(t => ({ text: t, type: 'Racial' })));
    
    // Always show primary class features
    if (classData?.features) {
      features.push(...classData.features.map(f => ({ text: f, type: classData.name })));
    }
    
    // Also show features from additional multiclass entries
    if (character.multiclass && character.multiclass.length > 0) {
      character.multiclass.forEach(mc => {
        const mcClass = CLASSES[mc.classId];
        if (mcClass?.features) {
          features.push(...mcClass.features.map(f => ({ text: f, type: mcClass.name })));
        }
      });
    }
    
    if (background?.feature) features.push({ text: background.feature, type: 'Background' });
    
    features.forEach((feat, idx) => {
      // Type badge
      doc.setFillColor(...colors.headerBg);
      doc.setFontSize(6);
      const typeWidth = doc.getTextWidth(feat.type) + 3;
      doc.roundedRect(bottomLeftX + 1, leftY - 1, typeWidth, 4, 0.8, 0.8, 'F');
      
      doc.setFont('times', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(feat.type, bottomLeftX + 2.5, leftY + 1.5);
      
      // Feature text
      doc.setFontSize(9);
      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.textDark);
      const wrappedText = doc.splitTextToSize(feat.text, leftColWidth - typeWidth - 4);
      wrappedText.forEach((line, lineIdx) => {
        doc.text(line, bottomLeftX + typeWidth + 3, leftY + 1.5 + lineIdx * 3.5);
      });
      
      leftY += Math.max(4, wrappedText.length * 3.5) + 1;
    });
    
    leftY += 3;

    // ============== LEFT COLUMN: EQUIPMENT ==============
    if (equipment.length > 0) {
      leftY = drawColumnHeader('EQUIPMENT', leftY, bottomLeftX, leftColWidth) + 1;
      
      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.textDark);
      
      equipment.forEach((item, idx) => {
        const cleanItem = item.replace(/\s*\(if proficient\)/gi, '');
        
        doc.setFillColor(...colors.gold);
        doc.circle(bottomLeftX + 3, leftY + 1, 1, 'F');
        doc.text(cleanItem, bottomLeftX + 7, leftY + 2);
        leftY += 4.5;
      });
      
      if (character.gold > 0) {
        doc.setFontSize(11);
        doc.setFont('times', 'bolditalic');
        doc.setTextColor(...colors.gold);
        doc.text(`${character.gold} gp`, bottomLeftX + 3, leftY + 2);
        leftY += 5;
      }
    }
    
    // ============== LEFT COLUMN: LEVEL ADVANCEMENTS ==============
    const levelAdvancements = [];
    if (character.feats && character.feats.length > 0) {
      character.feats.forEach(feat => {
        if (feat.choices && feat.choices.length > 0) {
          feat.choices.forEach(choice => {
            if (choice.type === 'feat' && choice.featId) {
              const featData = FEATS.find(f => f.id === choice.featId);
              if (featData) {
                levelAdvancements.push(`Lv${feat.level}: ${featData.name}`);
              }
            } else if (choice.type === 'asi') {
              const asiText = Object.entries(choice.abilities || {})
                .filter(([_, val]) => val > 0)
                .map(([ability, val]) => `${ABILITY_LABELS[ability].short} +${val}`)
                .join(', ');
              if (asiText) {
                levelAdvancements.push(`Lv${feat.level}: ${asiText}`);
              }
            }
          });
        }
      });
    }
    
    if (levelAdvancements.length > 0) {
      leftY += 3;
      leftY = drawColumnHeader('LEVEL ADV', leftY, bottomLeftX, leftColWidth) + 1;
      
      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.textDark);
      
      levelAdvancements.forEach((adv) => {
        doc.setFillColor(...colors.accentPurple);
        doc.circle(bottomLeftX + 3, leftY + 1, 1, 'F');
        doc.text(adv, bottomLeftX + 7, leftY + 2);
        leftY += 4.5;
      });
    }
    
    // ============== LEFT COLUMN: FIGHTING STYLE ==============
    if (character.fightingStyle) {
      leftY += 3;
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.darkPurple);
      doc.text('FIGHTING STYLE', bottomLeftX + 2, leftY);
      leftY += 4;
      
      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.textDark);
      const styleName = FIGHTING_STYLES[character.fightingStyle]?.name || character.fightingStyle;
      doc.text(styleName, bottomLeftX + 5, leftY);
      leftY += 5;
    }
    
    // ============== LEFT COLUMN: PHYSICAL CHARACTERISTICS ==============
    const hasPhysicalTraits = character.age || character.height || character.weight || 
                              character.eyes || character.hair || character.skin;
    
    if (hasPhysicalTraits) {
      leftY += 3;
      const physicalTraits = [
        { label: 'Age', value: character.age },
        { label: 'Height', value: character.height },
        { label: 'Weight', value: character.weight },
        { label: 'Eyes', value: character.eyes },
        { label: 'Hair', value: character.hair },
        { label: 'Skin', value: character.skin }
      ].filter(t => t.value);
      
      doc.setFontSize(8);
      doc.setFont('times', 'bolditalic');
      doc.setTextColor(...colors.textMuted);
      
      physicalTraits.forEach((trait, idx) => {
        if (idx % 2 === 0 && idx > 0) leftY += 6;
        const xPos = bottomLeftX + (idx % 2) * (leftColWidth / 2);
        doc.text(trait.label.toUpperCase(), xPos, leftY);
        doc.setFontSize(9);
        doc.setFont('times', 'normal');
        doc.setTextColor(...colors.textDark);
        doc.text(String(trait.value), xPos, leftY + 3);
        doc.setFontSize(8);
        doc.setFont('times', 'bolditalic');
        doc.setTextColor(...colors.textMuted);
      });
    }

    // ============== RIGHT COLUMN: SPELLCASTING ==============
    if (spellcastingInfo?.available && (spellList.cantrips.length > 0 || spellList.spells.length > 0)) {
      rightY = drawColumnHeader('SPELLCASTING', rightY, bottomRightX, rightColWidth) + 1;
      
      // Multiclass disclaimer
      if (character.multiclass && character.multiclass.length > 1) {
        const hasMultipleCasters = character.multiclass.filter(mc => {
          const mcClass = CLASSES[mc.classId];
          return mcClass?.spellcasting;
        }).length > 1;
        
        if (hasMultipleCasters) {
          doc.setFontSize(8);
          doc.setFont('times', 'italic');
          doc.setTextColor(...colors.accentBlue);
          doc.text('Multiclass spells: primary class only', bottomRightX + 2, rightY);
          rightY += 4;
        }
      }
      
      const spellDC = 8 + proficiencyBonus + getModifier(finalAbilities[spellcastingInfo.ability]);
      const spellAttack = proficiencyBonus + getModifier(finalAbilities[spellcastingInfo.ability]);
      
      // Spell stats
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.accentPurple);
      doc.text(`DC ${spellDC}  •  ATK +${spellAttack}  •  ${ABILITY_LABELS[spellcastingInfo.ability]?.name.toUpperCase()}`, bottomRightX + 2, rightY);
      rightY += 6;
      
      // Spell slots
      const slots = getSpellSlots(character.class, totalLevel);
      if (slots) {
        doc.setFontSize(10);
        doc.setFont('times', 'bold');
        doc.setTextColor(...colors.darkPurple);
        doc.text('Slots:', bottomRightX + 2, rightY);
        rightY += 4;
        
        doc.setFontSize(10);
        doc.setFont('times', 'normal');
        doc.setTextColor(...colors.textDark);
        
        if (character.class === 'warlock') {
          doc.text(`${slots.slots} × Lv${slots.level}`, bottomRightX + 4, rightY);
          rightY += 5;
        } else {
          const slotText = Object.entries(slots)
            .filter(([_, count]) => count > 0)
            .map(([lvl, count]) => `${lvl}:${count}`)
            .join(' • ');
          if (slotText) {
            const wrappedSlots = doc.splitTextToSize(slotText, rightColWidth - 6);
            wrappedSlots.forEach((line, idx) => {
              doc.text(line, bottomRightX + 4, rightY + idx * 4);
            });
            rightY += wrappedSlots.length * 4 + 2;
          }
        }
      }
      
      // Cantrips
      if (spellList.cantrips.length > 0) {
        doc.setFontSize(10);
        doc.setFont('times', 'bold');
        doc.setTextColor(...colors.accentPurple);
        doc.text('CANTRIPS', bottomRightX + 2, rightY);
        rightY += 5;
        
        doc.setFontSize(10);
        doc.setFont('times', 'normal');
        doc.setTextColor(...colors.textDark);
        spellList.cantrips.forEach((spell, idx) => {
          doc.setFillColor(...colors.accentPurple);
          doc.circle(bottomRightX + 4, rightY + 0.5, 1, 'F');
          doc.text(spell, bottomRightX + 8, rightY + 2);
          rightY += 4.5;
        });
        rightY += 2;
      }
      
      // Prepared/Known Spells
      if (spellList.spells.length > 0) {
        doc.setFontSize(10);
        doc.setFont('times', 'bold');
        doc.setTextColor(...colors.accentPurple);
        doc.text('KNOWN/PREPARED', bottomRightX + 2, rightY);
        rightY += 5;
        
        doc.setFontSize(10);
        doc.setFont('times', 'normal');
        doc.setTextColor(...colors.textDark);
        spellList.spells.forEach((spell, idx) => {
          doc.setFillColor(...colors.accentPurple);
          doc.circle(bottomRightX + 4, rightY + 0.5, 1, 'F');
          doc.text(spell, bottomRightX + 8, rightY + 2);
          rightY += 4.5;
        });
      }
    }
    
    // ============== RIGHT COLUMN: ELDRITCH INVOCATIONS ==============
    if (character.warlockInvocations && character.warlockInvocations.length > 0) {
      rightY += 4;
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.setTextColor(...colors.accentPurple);
      doc.text('INVOCATIONS', bottomRightX + 2, rightY);
      rightY += 5;
      
      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.setTextColor(...colors.textDark);
      character.warlockInvocations.forEach((invKey) => {
        const invocation = WARLOCK_INVOCATIONS[invKey];
        if (invocation) {
          doc.setFillColor(...colors.darkPurple);
          doc.circle(bottomRightX + 4, rightY + 0.5, 1, 'F');
          doc.text(invocation.name, bottomRightX + 8, rightY + 2);
          rightY += 4.5;
        }
      });
    }

    // Footer
    const addFooter = (pageNum) => {
      doc.setFontSize(10);
      doc.setFont('times', 'italic');
      doc.setTextColor(...colors.textMuted);
      doc.text('Generated by AetherNames Character Creator', pageWidth / 2, pageHeight - 8, { align: 'center' });
      
      // Decorative footer line
      doc.setDrawColor(...colors.gold);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 9, pageWidth - margin, pageHeight - 9);
    };
    
    // Add footer to all pages
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i);
    }
    
    return doc;
  };

  const handleExport = (format) => {
    try {
      setExportFormat(format);
      
      if (format === 'pdf') {
        // Generate and download PDF
        const doc = generatePDFExport();
        doc.save(`${character.name || 'character'}.pdf`);
        return;
      }
      
      let content, filename, type;
      
      if (format === 'json') {
        content = generateJSONExport();
        filename = `${character.name || 'character'}.json`;
        type = 'application/json';
      } else {
        content = generateTextExport();
        filename = `${character.name || 'character'}.txt`;
        type = 'text/plain';
      }

      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export: ${error.message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTextExport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check completion status
  const raceLanguageChoices = getRaceLanguageChoices(character.race, character.subrace);
  const bgLanguageChoices = getBackgroundLanguageChoices(character.background);
  const totalLanguageChoices = raceLanguageChoices + bgLanguageChoices;
  const languagesComplete = totalLanguageChoices === 0 || (character.chosenLanguages || []).length >= totalLanguageChoices;

  const skillOverlap = getSkillOverlap(character.class, character.background);
  const skillsComplete = skillOverlap.length === 0 || (character.replacementSkills || []).length >= skillOverlap.length;

  // Check if subclass is required and selected
  const subclassRequired = classData && totalLevel >= classData.subclassLevel;
  const subclassComplete = !subclassRequired || !!character.subclass;

  // Core required fields (always required)
  const isComplete = {
    name: !!character.name,
    race: !!character.race,
    class: !!character.class,
    abilities: Object.values(character.abilities).some(v => v !== 10),
    background: !!character.background
  };

  // Conditionally required fields
  const conditionalRequired = {};
  
  // Subclass is only required if level is high enough
  if (subclassRequired) {
    conditionalRequired.subclass = subclassComplete;
  }
  
  // Languages only required if there are choices to make
  if (totalLanguageChoices > 0) {
    conditionalRequired.languages = languagesComplete;
  }
  
  // Skills only required if there are overlaps to resolve
  if (skillOverlap.length > 0) {
    conditionalRequired.skills = skillsComplete;
  }

  // Combine all required fields
  const allRequired = { ...isComplete, ...conditionalRequired };
  const completionCount = Object.values(allRequired).filter(Boolean).length;
  const totalRequired = Object.keys(allRequired).length;

  // Build detailed missing items list
  const missingItems = [];
  if (!isComplete.name) missingItems.push({ label: 'Character name', step: 0 });
  if (!isComplete.race) missingItems.push({ label: 'Race selection', step: 1 });
  if (!isComplete.class) missingItems.push({ label: 'Class selection', step: 2 });
  if (subclassRequired && !subclassComplete) {
    missingItems.push({ label: `Subclass (required at level ${classData?.subclassLevel})`, step: 2 });
  }
  if (!isComplete.abilities) missingItems.push({ label: 'Ability scores', step: 3 });
  if (!isComplete.background) missingItems.push({ label: 'Background selection', step: 5 });
  if (totalLanguageChoices > 0 && !languagesComplete) {
    const chosenCount = (character.chosenLanguages || []).length;
    missingItems.push({ 
      label: `Language selection (${chosenCount}/${totalLanguageChoices} chosen)`, 
      step: 5 
    });
  }
  if (skillOverlap.length > 0 && !skillsComplete) {
    const chosenCount = (character.replacementSkills || []).length;
    missingItems.push({ 
      label: `Skill replacement (${chosenCount}/${skillOverlap.length} chosen)`, 
      step: 5 
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">Character Review</h3>
          <p className="text-sm text-slate-500">
            Review your character and export when ready.
          </p>
          {/* Player Name - More prominent */}
          {character.playerName && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-sm">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium">Player:</span>
                <span className="font-semibold">{character.playerName}</span>
              </span>
            </div>
          )}
          {/* Alignment */}
          {character.alignment && ALIGNMENTS[character.alignment] && (
            <div className="mt-2">
              <Tooltip content={ALIGNMENTS[character.alignment].description}>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-slate-200 text-xs">
                  <span className="font-semibold text-indigo-300">Alignment:</span>
                  <span>{ALIGNMENTS[character.alignment].name}</span>
                  <span className="text-slate-500">({ALIGNMENTS[character.alignment].short})</span>
                </span>
              </Tooltip>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-semibold whitespace-nowrap ${
            completionCount === totalRequired 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {completionCount}/{totalRequired} Complete
          </div>

          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 cursor-pointer hover:bg-slate-700/50 transition-all">
            <input
              type="checkbox"
              checked={!!randomWithMulticlass}
              onChange={(e) => {
                const checked = e.target.checked;
                if (typeof setRandomWithMulticlass === 'function') {
                  setRandomWithMulticlass(checked);
                }
                if (checked && (character.level || 1) < 2) {
                  updateCharacter('level', 2);
                }
              }}
              className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
            />
            <span>Multiclass (Random)</span>
          </label>
          <button
            onClick={onRandomize}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm sm:text-base font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
            title="Generate a new random character"
          >
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden xs:inline">Randomize</span>
            <span className="xs:hidden">Random</span>
          </button>
          {/* Undo */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all ${
              canUndo 
                ? 'bg-slate-700/50 border border-slate-600/50 text-slate-200 hover:bg-slate-600/50' 
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-500 cursor-not-allowed'
            }`}
            title="Undo last randomize"
          >
            Undo
          </button>
        </div>
      </div>

      {/* Character Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30">
        <div className="flex items-start gap-4">
          <div className="text-5xl">
            {RACE_ICONS[character.race] || '🧙'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">
              {character.name || 'Unnamed Character'}
            </h2>
            <p className="text-slate-300">
              {race?.name || 'Unknown Race'}
              {subrace ? ` (${subrace.name})` : ''} {classData?.name || 'Unknown Class'} {totalLevel}
              {character.subclass && SUBCLASSES[character.class]?.[character.subclass] && (
                <span className="text-indigo-300"> ({SUBCLASSES[character.class][character.subclass].name})</span>
              )}
              {character.multiclass && character.multiclass.length > 0 && (
                <span className="text-amber-300">
                  {' '}• {character.multiclass.map(m => {
                    const mcClass = CLASSES[m.classId];
                    const mcSubclass = m.subclass && SUBCLASSES[m.classId]?.[m.subclass];
                    return `${mcClass?.name} ${m.level}${mcSubclass ? ` (${mcSubclass.name})` : ''}`;
                  }).join(' / ')}
                </span>
              )}
            </p>
            {character.multiclass && character.multiclass.length > 0 && (
              <div className="mt-2 text-xs text-purple-200/70">
                Spellcasting note: multiclass spellcasting isn’t fully calculated yet (spell slots/spells shown are primary-class only).
              </div>
            )}
            {background && (
              <p className="text-slate-400 text-sm mt-1">{background.name} Background</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-400">{maxHP}</div>
            <div className="text-xs text-slate-500">Hit Points</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Combat Stats */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-300">Combat Stats</h4>
              <button
                onClick={() => goToStep(3)}
                className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-slate-900/50">
                <div className="text-2xl font-bold text-blue-400">{baseAC}</div>
                <div className="text-xs text-slate-500">AC</div>
                {character.class === 'barbarian' && (
                  <div className="text-[10px] text-amber-400 mt-1">Unarmored Defense</div>
                )}
                {character.class === 'monk' && (
                  <div className="text-[10px] text-amber-400 mt-1">Unarmored Defense</div>
                )}
                {character.class === 'sorcerer' && character.subclass === 'draconicBloodline' && (
                  <div className="text-[10px] text-amber-400 mt-1">Draconic Resilience</div>
                )}
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-900/50">
                <div className="text-2xl font-bold text-slate-200">
                  {initiative >= 0 ? '+' : ''}{initiative}
                </div>
                <div className="text-xs text-slate-500">Initiative</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-900/50">
                <div className="text-2xl font-bold text-green-400">{speed}</div>
                <div className="text-xs text-slate-500">Speed</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center p-2 rounded-lg bg-slate-900/50">
                <div className="text-lg font-bold text-amber-400">+{proficiencyBonus}</div>
                <div className="text-xs text-slate-500">Proficiency</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-900/50">
                <div className="text-lg font-bold text-cyan-400">{passivePerception}</div>
                <div className="text-xs text-slate-500">Passive Perception</div>
              </div>
            </div>
          </div>

          {/* Ability Scores */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-300">Ability Scores</h4>
              <button
                onClick={() => goToStep(3)}
                className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ABILITY_NAMES.map(a => {
                const final = finalAbilities[a];
                const mod = getModifier(final);
                const bonus = racialBonuses[a] || 0;
                
                return (
                  <div key={a} className="text-center p-2 rounded-lg bg-slate-900/50">
                    <div className="text-xs text-slate-500 mb-1">{ABILITY_LABELS[a].short}</div>
                    <div className="text-xl font-bold text-white">{final}</div>
                    <div className={`text-sm font-medium ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {mod >= 0 ? '+' : ''}{mod}
                    </div>
                    {bonus > 0 && (
                      <div className="text-[10px] text-indigo-400">+{bonus} racial</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Proficiencies */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-300">Proficiencies</h4>
              <button
                onClick={() => goToStep(5)}
                className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
              >
                Edit
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-500">Saving Throws: </span>
                <span className="text-slate-200">{proficiencies.savingThrows.join(', ') || 'None'}</span>
              </div>
              <div>
                <span className="text-slate-500">Skills: </span>
                {proficiencies.skills.length > 0 ? (
                  <div className="inline-flex flex-wrap gap-1 align-middle">
                    {proficiencies.skills.map((name, i) => {
                      const id = getSkillId(name);
                      const info = id ? SKILLS[id]?.description : null;
                      const chip = (
                        <span key={i} className="px-1.5 py-0.5 rounded-md bg-green-500/20 text-green-300 text-[11px]">
                          {name}
                        </span>
                      );
                      return info ? (
                        <Tooltip key={`${name}-${i}`} content={info}>{chip}</Tooltip>
                      ) : chip;
                    })}
                  </div>
                ) : (
                  <span className="text-slate-200">None</span>
                )}
              </div>
              <div>
                <span className="text-slate-500">Languages: </span>
                {proficiencies.languages.length > 0 ? (
                  <div className="inline-flex flex-wrap gap-1 align-middle">
                    {proficiencies.languages.map((name, i) => {
                      const id = getLanguageIdByName(name);
                      const lang = id ? LANGUAGES[id] : null;
                      const info = lang ? `${lang.type === 'exotic' ? 'Exotic' : 'Standard'} — Speakers: ${lang.speakers}` : null;
                      const chip = (
                        <span key={i} className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[11px]">
                          {name}
                        </span>
                      );
                      return info ? (
                        <Tooltip key={`${name}-${i}`} content={info}>{chip}</Tooltip>
                      ) : chip;
                    })}
                  </div>
                ) : (
                  <span className="text-slate-200">Common</span>
                )}
              </div>
            </div>
          </div>

        </div>
        {/* Right Column */}
        <div className="space-y-4">
          {/* Features - Mobile Collapsible */}
          <details className="md:hidden" open>
            <summary className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer list-none flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-300">Features & Traits</h4>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </summary>
          </details>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="hidden md:flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">Features & Traits</h4>
                <button
                  onClick={() => goToStep(2)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
                >
                  Edit
                </button>
              </div>
            <div className="space-y-3">
              {race?.traits && race.traits.length > 0 && (
                <div>
                  <div className="text-xs text-indigo-400 mb-1">Racial Traits</div>
                  <div className="flex flex-wrap gap-1">
                    {race.traits.map((t, i) => {
                      const info = TRAIT_INFO[t];
                      const chip = (
                        <span key={i} className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs">
                          {t}
                        </span>
                      );
                      return info ? (
                        <Tooltip key={`${t}-${i}`} content={info}>{chip}</Tooltip>
                      ) : chip;
                    })}
                  </div>
                </div>
              )}
              {classData?.features && classData.features.length > 0 && (
                <div>
                  <div className="text-xs text-purple-400 mb-1">Class Features</div>
                  <div className="flex flex-wrap gap-1">
                    {classData.features.map((f, i) => {
                      const info = FEATURE_INFO[f];
                      const chip = (
                        <span key={i} className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs">
                          {f}
                        </span>
                      );
                      return info ? (
                        <Tooltip key={`${f}-${i}`} content={info}>{chip}</Tooltip>
                      ) : chip;
                    })}
                  </div>
                </div>
              )}
              {background?.feature && (
                <div>
                  <div className="text-xs text-amber-400 mb-1">Background Feature</div>
                  <Tooltip content={background.featureDesc}>
                    <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs">
                      {background.feature}
                    </span>
                  </Tooltip>
                </div>
              )}
              {character.variantHumanFeat && FEATS[character.variantHumanFeat] && (
                <div>
                  <div className="text-xs text-green-400 mb-1">Feat (Variant Human)</div>
                  <Tooltip content={FEATS[character.variantHumanFeat].description}>
                    <div className="px-2 py-1.5 rounded-md bg-green-500/20 border border-green-500/30">
                      <div className="text-xs font-semibold text-green-300">{FEATS[character.variantHumanFeat].name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                        Hover to view details
                      </div>
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          {/* Level Advancements (ASI/Feats) */}
          {character.asiChoices && Object.keys(character.asiChoices).length > 0 && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">Level Advancements</h4>
                <button
                  onClick={() => goToStep(4)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(character.asiChoices)
                  .sort(([aLevel], [bLevel]) => Number(aLevel) - Number(bLevel))
                  .map(([lvl, choice]) => (
                  <div key={lvl} className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] border border-indigo-500/30">Level {lvl}</span>
                    {choice.type === 'asi' ? (
                      <div className="text-xs text-slate-300">
                        ASI: +{choice.boost1} {ABILITY_LABELS[choice.ability1]?.short}
                        {choice.ability2 && choice.boost2 ? (
                          <span> • +{choice.boost2} {ABILITY_LABELS[choice.ability2]?.short}</span>
                        ) : null}
                      </div>
                    ) : choice.type === 'feat' && FEATS[choice.feat] ? (
                      <Tooltip content={FEATS[choice.feat].description}>
                        <div className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">
                          Feat: {FEATS[choice.feat].name}
                        </div>
                      </Tooltip>
                    ) : (
                      <div className="text-xs text-slate-500">Unknown advancement</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fighting Style */}
          {character.fightingStyle && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">Fighting Style</h4>
                <button
                  onClick={() => goToStep(2)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
                >
                  Edit
                </button>
              </div>
              <Tooltip content={FIGHTING_STYLES[character.fightingStyle]?.description || ''}>
                <div className="px-2 py-1.5 rounded-md bg-blue-500/20 border border-blue-500/30">
                  <div className="text-xs font-semibold text-blue-300">{FIGHTING_STYLES[character.fightingStyle]?.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    Hover to view details
                  </div>
                </div>
              </Tooltip>
            </div>
          )}

          {/* Warlock Invocations */}
          {character.warlockInvocations && character.warlockInvocations.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">Eldritch Invocations</h4>
                <button
                  onClick={() => goToStep(2)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                {character.warlockInvocations.map(invKey => {
                  const inv = WARLOCK_INVOCATIONS[invKey];
                  if (!inv) return null;
                  return (
                    <Tooltip key={invKey} content={inv.description}>
                      <div className="px-2 py-1.5 rounded-md bg-purple-500/20 border border-purple-500/30">
                        <div className="text-xs font-semibold text-purple-300">{inv.name}</div>
                        {inv.prerequisite && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Req: {inv.prerequisite}
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metamagic Options */}
          {character.metamagicOptions && character.metamagicOptions.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">Metamagic Options</h4>
                <button
                  onClick={() => goToStep(2)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                {character.metamagicOptions.map(metaKey => {
                  const meta = METAMAGIC_OPTIONS[metaKey];
                  if (!meta) return null;
                  return (
                    <Tooltip key={metaKey} content={meta.description}>
                      <div className="px-2 py-1.5 rounded-md bg-pink-500/20 border border-pink-500/30">
                        <div className="text-xs font-semibold text-pink-300">{meta.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Cost: {meta.cost} sorcery {meta.cost === 1 ? 'point' : 'points'}
                        </div>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          )}

          {/* Battle Master Maneuvers */}
          {character.battleMasterManeuvers && character.battleMasterManeuvers.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">Battle Master Maneuvers</h4>
                <button
                  onClick={() => goToStep(2)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                {character.battleMasterManeuvers.map(manKey => {
                  const man = BATTLE_MASTER_MANEUVERS[manKey];
                  if (!man) return null;
                  return (
                    <Tooltip key={manKey} content={man.description}>
                      <div className="px-2 py-1.5 rounded-md bg-red-500/20 border border-red-500/30">
                        <div className="text-xs font-semibold text-red-300">{man.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                          Hover to view details
                        </div>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          )}

          {/* Musical Instrument */}
          {character.musicalInstrument && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">Musical Instrument Proficiency</h4>
                <button
                  onClick={() => goToStep(2)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
                >
                  Edit
                </button>
              </div>
              <span className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30">
                {MUSICAL_INSTRUMENTS[character.musicalInstrument]?.name || character.musicalInstrument}
              </span>
            </div>
          )}

          {/* Physical Characteristics */}
          {(character.physicalCharacteristics?.age || 
            character.physicalCharacteristics?.height || 
            character.physicalCharacteristics?.weight || 
            character.physicalCharacteristics?.eyes || 
            character.physicalCharacteristics?.hair || 
            character.physicalCharacteristics?.skin) && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">Physical Characteristics</h4>
                <button
                  onClick={() => goToStep(0)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {character.physicalCharacteristics?.age && (
                  <div>
                    <div className="text-slate-500 text-[10px]">Age</div>
                    <div className="text-slate-300">{character.physicalCharacteristics.age}</div>
                  </div>
                )}
                {character.physicalCharacteristics?.height && (
                  <div>
                    <div className="text-slate-500 text-[10px]">Height</div>
                    <div className="text-slate-300">{character.physicalCharacteristics.height}</div>
                  </div>
                )}
                {character.physicalCharacteristics?.weight && (
                  <div>
                    <div className="text-slate-500 text-[10px]">Weight</div>
                    <div className="text-slate-300">{character.physicalCharacteristics.weight}</div>
                  </div>
                )}
                {character.physicalCharacteristics?.eyes && (
                  <div>
                    <div className="text-slate-500 text-[10px]">Eyes</div>
                    <div className="text-slate-300">{character.physicalCharacteristics.eyes}</div>
                  </div>
                )}
                {character.physicalCharacteristics?.hair && (
                  <div>
                    <div className="text-slate-500 text-[10px]">Hair</div>
                    <div className="text-slate-300">{character.physicalCharacteristics.hair}</div>
                  </div>
                )}
                {character.physicalCharacteristics?.skin && (
                  <div>
                    <div className="text-slate-500 text-[10px]">Skin</div>
                    <div className="text-slate-300">{character.physicalCharacteristics.skin}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Equipment */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-300">Equipment</h4>
              <button
                onClick={() => goToStep(6)}
                className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
              >
                Edit
              </button>
            </div>
            {equipment.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {equipment.map((item, i) => (
                  <span key={i} className="px-2 py-1 rounded-md bg-slate-700/50 text-slate-300 text-xs">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">Not selected.</div>
            )}
            {character.equipmentMethod === 'gold' && character.gold > 0 && (
              <div className="mt-2 text-sm text-amber-400">
                💰 {character.gold} gp remaining
              </div>
            )}
          </div>

          {/* Spells */}
          {spellcastingInfo?.available && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-purple-300">Spellcasting</h4>
                <button
                  onClick={() => goToStep(7)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 text-xs hover:bg-slate-600/50 transition-all"
                >
                  Edit
                </button>
              </div>
              {character.multiclass && character.multiclass.length > 0 && (
                <div className="text-xs text-purple-200/80 mb-3">
                  Note: multiclass spellcasting isn’t fully calculated yet (spell slots/spells shown are primary-class only).
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <span className="text-slate-500">Save DC: </span>
                  <span className="text-white font-medium">
                    {8 + proficiencyBonus + getModifier(finalAbilities[spellcastingInfo.ability])}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Attack: </span>
                  <span className="text-white font-medium">
                    +{proficiencyBonus + getModifier(finalAbilities[spellcastingInfo.ability])}
                  </span>
                </div>
              </div>
              
              {/* Spell Slots */}
              {(() => {
                const slots = getSpellSlots(character.class, character.level);
                if (!slots) return null;
                
                if (character.class === 'warlock') {
                  return (
                    <div className="mb-3 p-2 rounded-lg bg-slate-900/50">
                      <div className="text-xs text-slate-400 mb-1">Pact Magic Slots</div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array(slots.slots).fill(0).map((_, i) => (
                            <div key={i} className="w-4 h-4 rounded-full bg-purple-500/50 border border-purple-400"></div>
                          ))}
                        </div>
                        <span className="text-xs text-purple-300">Level {slots.level}</span>
                      </div>
                    </div>
                  );
                }
                
                const slotLevels = Object.entries(slots).filter(([_, count]) => count > 0);
                if (slotLevels.length === 0) return null;
                
                return (
                  <div className="mb-3 p-2 rounded-lg bg-slate-900/50">
                    <div className="text-xs text-slate-400 mb-2">Spell Slots</div>
                    <div className="flex flex-wrap gap-2">
                      {slotLevels.map(([level, count]) => (
                        <div key={level} className="flex items-center gap-1">
                          <span className="text-xs text-slate-500">
                            {level === '1' ? '1st' : level === '2' ? '2nd' : level === '3' ? '3rd' : `${level}th`}:
                          </span>
                          <div className="flex gap-0.5">
                            {Array(count).fill(0).map((_, i) => (
                              <div key={i} className="w-3 h-3 rounded-full bg-indigo-500/50 border border-indigo-400"></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              
              {spellList.cantrips.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-purple-400 mb-1">Cantrips</div>
                  <div className="flex flex-wrap gap-1">
                    {spellList.cantrips.map((name, i) => {
                      const id = getSpellIdByName(name);
                      const spell = id ? SPELLS[id] : null;
                      const chip = (
                        <span key={i} className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs">
                          {name}
                        </span>
                      );
                      return spell ? (
                        <Tooltip key={`${name}-${i}`} content={renderSpellTooltipContent(spell)}>{chip}</Tooltip>
                      ) : chip;
                    })}
                  </div>
                </div>
              )}
              {spellList.spells.length > 0 && (
                <div>
                  <div className="text-xs text-indigo-400 mb-1">Prepared/Known Spells</div>
                  <div className="flex flex-wrap gap-1">
                    {spellList.spells.map((name, i) => {
                      const id = getSpellIdByName(name);
                      const spell = id ? SPELLS[id] : null;
                      const chip = (
                        <span key={i} className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs">
                          {name}
                        </span>
                      );
                      return spell ? (
                        <Tooltip key={`${name}-${i}`} content={renderSpellTooltipContent(spell)}>{chip}</Tooltip>
                      ) : chip;
                    })}
                  </div>
                </div>
              )}

              {spellList.cantrips.length === 0 && spellList.spells.length === 0 && (
                <div className="text-sm text-slate-400">Not selected.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pending Choices - Languages */}
      {(() => {
        const raceChoices = getRaceLanguageChoices(character.race, character.subrace);
        const bgChoices = getBackgroundLanguageChoices(character.background);
        const totalChoices = raceChoices + bgChoices;
        const fixedLangs = getFixedLanguages(character.race, character.subrace);
        const chosenLangs = character.chosenLanguages || [];
        
        if (totalChoices === 0) return null;
        
        const knownLanguageNames = [...fixedLangs, ...chosenLangs.map(id => LANGUAGES[id]?.name)].map(n => n?.toLowerCase());
        const availableLanguages = Object.entries(LANGUAGES).filter(([id, lang]) => 
          !knownLanguageNames.includes(lang.name.toLowerCase())
        );
        
        const toggleLanguage = (langId) => {
          const current = character.chosenLanguages || [];
          if (current.includes(langId)) {
            updateCharacter('chosenLanguages', current.filter(l => l !== langId));
          } else if (current.length < totalChoices) {
            updateCharacter('chosenLanguages', [...current, langId]);
          }
        };
        
        const isComplete = chosenLangs.length >= totalChoices;
        
        return (
          <div className={`mt-6 p-4 rounded-xl border ${
            isComplete 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-semibold ${isComplete ? 'text-green-300' : 'text-amber-300'}`}>
                {isComplete ? '✓ ' : '⚠ '}Language Selection
              </h4>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isComplete ? 'text-green-400' : 'text-amber-400'}`}>
                  {chosenLangs.length}/{totalChoices} chosen
                </span>
                <button
                  onClick={() => goToStep(5)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/30 border border-slate-600/40 text-slate-200 text-[11px] hover:bg-slate-600/40 transition-all"
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div className="text-xs text-slate-400 mb-3">
              {raceChoices > 0 && <span>{raceChoices} from {RACES[character.race]?.name || 'race'}</span>}
              {raceChoices > 0 && bgChoices > 0 && <span> • </span>}
              {bgChoices > 0 && <span>{bgChoices} from {BACKGROUNDS[character.background]?.name || 'background'}</span>}
            </div>
            
            {/* Already known */}
            {fixedLangs.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-slate-500 mb-1">Already Known</div>
                <div className="flex flex-wrap gap-1">
                  {fixedLangs.map((lang, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-slate-700/50 text-slate-400 text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Selected */}
            {chosenLangs.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-slate-500 mb-1">Selected</div>
                <div className="flex flex-wrap gap-1">
                  {chosenLangs.map(id => (
                    <button
                      key={id}
                      onClick={() => toggleLanguage(id)}
                      className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs flex items-center gap-1 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                      {LANGUAGES[id]?.name}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Available choices */}
            {!isComplete && (
              <div>
                <div className="text-xs text-slate-500 mb-2">Choose {totalChoices - chosenLangs.length} more</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 max-h-32 sm:max-h-48 overflow-y-auto">
                  {availableLanguages.map(([id, lang]) => (
                    <button
                      key={id}
                      onClick={() => toggleLanguage(id)}
                      className="px-2 py-1.5 rounded-md bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs hover:border-indigo-500/30 transition-all text-left"
                    >
                      <div>{lang.name}</div>
                      <div className="text-[10px] text-slate-500">{lang.type}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Pending Choices - Skill Replacements */}
      {(() => {
        const overlap = getSkillOverlap(character.class, character.background);
        
        if (overlap.length === 0) return null;
        
        const chosenReplacements = character.replacementSkills || [];
        const availableSkills = getAvailableReplacementSkills(
          character.class, 
          character.background, 
          chosenReplacements
        );
        
        const toggleSkill = (skillId) => {
          const current = character.replacementSkills || [];
          if (current.includes(skillId)) {
            updateCharacter('replacementSkills', current.filter(s => s !== skillId));
          } else if (current.length < overlap.length) {
            updateCharacter('replacementSkills', [...current, skillId]);
          }
        };
        
        const isComplete = chosenReplacements.length >= overlap.length;
        
        return (
          <div className={`mt-6 p-4 rounded-xl border ${
            isComplete 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-semibold ${isComplete ? 'text-green-300' : 'text-amber-300'}`}>
                {isComplete ? '✓ ' : '⚠ '}Skill Replacement
              </h4>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isComplete ? 'text-green-400' : 'text-amber-400'}`}>
                  {chosenReplacements.length}/{overlap.length} chosen
                </span>
                <button
                  onClick={() => goToStep(5)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700/30 border border-slate-600/40 text-slate-200 text-[11px] hover:bg-slate-600/40 transition-all"
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div className="text-xs text-slate-400 mb-3">
              Your <span className="text-purple-300">{BACKGROUNDS[character.background]?.name}</span> background 
              grants skills that overlap with <span className="text-indigo-300">{CLASSES[character.class]?.name}</span> options.
              Choose {overlap.length} replacement skill{overlap.length > 1 ? 's' : ''}.
            </div>
            
            {/* Overlapping skills */}
            <div className="mb-3">
              <div className="text-xs text-slate-500 mb-1">Overlapping Skills (from background)</div>
              <div className="flex flex-wrap gap-1">
                {overlap.map((skill, i) => (
                  <span key={i} className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Selected replacements */}
            {chosenReplacements.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-slate-500 mb-1">Replacement Skills</div>
                <div className="flex flex-wrap gap-1">
                  {chosenReplacements.map(id => (
                    <button
                      key={id}
                      onClick={() => toggleSkill(id)}
                      className="px-2 py-1 rounded-md bg-green-500/20 text-green-300 text-xs flex items-center gap-1 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                      {SKILLS[id]?.name}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Available choices */}
            {!isComplete && (
              <div>
                <div className="text-xs text-slate-500 mb-2">Choose {overlap.length - chosenReplacements.length} more</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {availableSkills.map(([id, skill]) => (
                    <button
                      key={id}
                      onClick={() => toggleSkill(id)}
                      className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs hover:border-green-500/30 transition-all text-left"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-[10px] text-indigo-400 shrink-0">{ABILITY_LABELS[skill.ability]?.short}</div>
                      </div>
                      <div className="text-[10px] text-slate-500 leading-relaxed">{skill.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Export Options */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Export Character</h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500/50 text-white hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2 font-semibold shadow-lg shadow-indigo-500/25"
          >
            <FileText className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={() => handleExport('txt')}
            className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 hover:bg-slate-600/50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download .txt
          </button>
          <button
            onClick={() => handleExport('json')}
            className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 hover:bg-slate-600/50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download .json
          </button>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
              copied 
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : 'bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>

      {/* Completion Checklist */}
      {completionCount < totalRequired && missingItems.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Incomplete Steps ({missingItems.length} {missingItems.length === 1 ? 'item' : 'items'})
          </h4>
          <div className="space-y-2 text-sm">
            {missingItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  // Jump to the step that needs completion
                  if (typeof item.step === 'number') goToStep(item.step);
                }}
                className="w-full text-left flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all group"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-amber-200 font-medium">{item.label}</div>
                  {typeof item.step === 'number' && (
                    <div className="text-amber-400/70 text-xs mt-0.5">Go to: Step {item.step + 1}</div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400/50 group-hover:text-amber-400 transition-colors mt-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MULTICLASS SELECTION STEP (PHASE 6.5)
// ============================================================================

const MulticlassStep = ({ character, updateCharacter }) => {
  const primaryClass = character.class ? CLASSES[character.class] : null;
  const totalLevel = character.level || 1;
  const multiclassEntries = character.multiclass || [];
  const multiclassLevelSum = multiclassEntries.reduce((sum, mc) => sum + (Number(mc?.level) || 0), 0);

  // Enforce: total character level is the sum of all class levels.
  // This step only tracks multiclass allocations; the primary class gets the remainder.
  const minPrimaryLevel = 1;
  const maxMulticlassTotal = Math.max(0, totalLevel - minPrimaryLevel);
  const primaryLevel = Math.max(minPrimaryLevel, totalLevel - multiclassLevelSum);

  const normalizeMulticlassLevels = (entries) => {
    const normalized = (entries || []).map((mc) => ({
      classId: mc?.classId,
      level: Math.max(1, Number(mc?.level) || 1),
      subclass: mc?.subclass ?? null
    }));

    let sum = normalized.reduce((s, mc) => s + mc.level, 0);
    if (sum <= maxMulticlassTotal) return normalized;

    // Reduce from the end until we fit, never dropping below 1.
    for (let i = normalized.length - 1; i >= 0 && sum > maxMulticlassTotal; i--) {
      const canReduce = Math.max(0, normalized[i].level - 1);
      const needReduce = sum - maxMulticlassTotal;
      const delta = Math.min(canReduce, needReduce);
      normalized[i].level -= delta;
      sum -= delta;
    }

    return normalized;
  };

  useEffect(() => {
    const fixed = normalizeMulticlassLevels(multiclassEntries);
    const fixedSum = fixed.reduce((s, mc) => s + mc.level, 0);
    if (fixedSum !== multiclassLevelSum) {
      updateCharacter('multiclass', fixed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalLevel]);
  
  // Get all available classes except the primary class
  const availableClasses = Object.entries(CLASSES).filter(([id]) => id !== character.class);
  
  // Multi-class rules: need to be at least level 2 to multi-class
  if (totalLevel < 2) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Multi-classing</h3>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-300">
            Multi-classing is available starting at character level 2.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Your current level: {totalLevel}
          </p>
        </div>
      </div>
    );
  }

  const availableMulticlassLevels = Math.max(0, maxMulticlassTotal - multiclassLevelSum);
  const canAddClass = availableMulticlassLevels >= 1 && multiclassEntries.length < 2; // Max 3 classes total (2 additional)
  
  const addMulticlass = (classId) => {
    if (availableMulticlassLevels < 1) return;
    const newMulticlass = [...multiclassEntries, { classId, level: 1, subclass: null }];
    updateCharacter('multiclass', newMulticlass);
  };
  
  const removeMulticlass = (index) => {
    const newMulticlass = multiclassEntries.filter((_, i) => i !== index);
    updateCharacter('multiclass', newMulticlass);
  };
  
  const updateMulticlassLevel = (index, newLevel) => {
    const safeLevel = Math.max(1, Number(newLevel) || 1);
    const sumOther = multiclassEntries.reduce((sum, mc, i) => sum + (i === index ? 0 : (Number(mc?.level) || 0)), 0);
    const maxForThis = Math.max(1, maxMulticlassTotal - sumOther);
    const newMulticlass = [...multiclassEntries];
    newMulticlass[index] = { ...newMulticlass[index], level: Math.min(safeLevel, maxForThis) };
    updateCharacter('multiclass', newMulticlass);
  };
  
  const updateMulticlassSubclass = (index, subclassId) => {
    const newMulticlass = [...multiclassEntries];
    newMulticlass[index].subclass = subclassId;
    updateCharacter('multiclass', newMulticlass);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Multi-classing (Optional)</h3>
        <p className="text-sm text-slate-500">
          Split your total character level across multiple classes. Your primary class gets any unassigned levels.
        </p>
      </div>

      {/* Level Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
          <div className="text-xs text-indigo-300">Primary Class Level</div>
          <div className="text-2xl font-bold text-indigo-400">{primaryLevel}</div>
        </div>
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="text-xs text-purple-300">Multi-class Levels</div>
          <div className="text-2xl font-bold text-purple-400">
            {multiclassLevelSum}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-xs text-slate-400">Total Levels</div>
          <div className="text-2xl font-bold text-slate-200">{totalLevel}/20</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-xs text-slate-400">Classes</div>
          <div className="text-2xl font-bold text-slate-200">{multiclassEntries.length + 1}/3</div>
        </div>
      </div>

      {/* Primary Class Display */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{CLASS_ICONS[character.class] || '⚔️'}</div>
          <div>
            <div className="font-bold text-indigo-300">{primaryClass?.name}</div>
            <div className="text-sm text-slate-400">Level {primaryLevel}</div>
          </div>
        </div>
      </div>

      {/* Multi-class Entries */}
      {multiclassEntries.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300">Additional Classes</h4>
          {multiclassEntries.map((multiclass, index) => {
            const mcClass = CLASSES[multiclass.classId];
            const subclasses = SUBCLASSES[multiclass.classId] || {};
            const selectedSubclass = multiclass.subclass ? subclasses[multiclass.subclass] : null;
            
            return (
              <div key={index} className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{CLASS_ICONS[multiclass.classId] || '⚔️'}</div>
                    <div>
                      <div className="font-semibold text-purple-300">{mcClass?.name}</div>
                      {selectedSubclass && (
                        <div className="text-xs text-slate-400">{selectedSubclass.name}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeMulticlass(index)}
                    className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 text-sm transition-all"
                  >
                    Remove
                  </button>
                </div>

                {/* Level Selector */}
                <div>
                  <label className="block text-xs text-slate-400 mb-2">
                    Class Level
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (multiclass.level > 1) {
                          updateMulticlassLevel(index, multiclass.level - 1);
                        }
                      }}
                      disabled={multiclass.level <= 1}
                      className="px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={Math.max(1, maxMulticlassTotal - multiclassEntries.reduce((sum, mc, i) => sum + (i === index ? 0 : (Number(mc?.level) || 0)), 0))}
                      value={multiclass.level}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1) updateMulticlassLevel(index, val);
                      }}
                      className="w-20 px-3 py-2 text-center bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500/50"
                    />
                    <button
                      onClick={() => {
                        const maxLevel = Math.max(1, maxMulticlassTotal - multiclassEntries.reduce((sum, mc, i) => sum + (i === index ? 0 : (Number(mc?.level) || 0)), 0));
                        if (multiclass.level < maxLevel) {
                          updateMulticlassLevel(index, multiclass.level + 1);
                        }
                      }}
                      disabled={multiclass.level >= Math.max(1, maxMulticlassTotal - multiclassEntries.reduce((sum, mc, i) => sum + (i === index ? 0 : (Number(mc?.level) || 0)), 0))}
                      className="px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-200 hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      +
                    </button>
                    <div className="text-xs text-slate-500 ml-2">
                      ({availableMulticlassLevels} multiclass level{availableMulticlassLevels === 1 ? '' : 's'} available)
                    </div>
                  </div>
                </div>

                {/* Subclass Selector */}
                {Object.keys(subclasses).length > 0 && mcClass && multiclass.level >= mcClass.subclassLevel && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">
                      {mcClass.subclassName} (Optional)
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => updateMulticlassSubclass(index, null)}
                        className={`p-2 rounded-lg text-left text-sm transition-all ${
                          multiclass.subclass === null
                            ? 'bg-slate-700/50 border border-slate-600 text-slate-200'
                            : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        None
                      </button>
                      {Object.entries(subclasses).map(([subId, sub]) => (
                        <button
                          key={subId}
                          onClick={() => updateMulticlassSubclass(index, subId)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            multiclass.subclass === subId
                              ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                              : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-purple-500/30'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Multi-class Button */}
      {canAddClass && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-3">
            {multiclassEntries.length === 0 ? 'Add a Class' : 'Add Another Class'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {availableClasses.map(([classId, classData]) => {
              const isAlreadySelected = multiclassEntries.some(mc => mc.classId === classId);
              return (
                <button
                  key={classId}
                  onClick={() => addMulticlass(classId)}
                  disabled={isAlreadySelected}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isAlreadySelected
                      ? 'bg-slate-900/50 border-slate-800/30 opacity-50 cursor-not-allowed'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CLASS_ICONS[classId] || '⚔️'}</span>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-200">{classData.name}</div>
                      <div className="text-xs text-slate-500">d{classData.hitDie} Hit Die</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Multi-classing Notes:</h4>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• You can skip multi-classing entirely - it's optional</li>
          <li>• Proficiencies come only from your primary class</li>
          <li>• Spellcasting ability is determined by each class</li>
          <li>• You gain all features from each class at their respective levels</li>
          <li>• Ability Score Improvements are gained at standard class intervals</li>
        </ul>
      </div>
    </div>
  );
};

// ============================================================================
// SPELL SELECTION STEP (PHASE 7)
// ============================================================================

const SpellSelectionStep = ({ character, updateCharacter }) => {
  const classId = character.class;
  const classData = classId ? CLASSES[classId] : null;
  const spellcastingInfo = classId ? getSpellcastingInfo(classId, character.level) : null;
  
  const [selectedCantrips, setSelectedCantrips] = useState(character.cantrips || []);
  const [selectedSpells, setSelectedSpells] = useState(character.spells || []);
  const [viewingSpell, setViewingSpell] = useState(null);
  const [activeTab, setActiveTab] = useState('cantrips');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showRitualOnly, setShowRitualOnly] = useState(false);
  const [showConcentrationOnly, setShowConcentrationOnly] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState(new Set());

  // Use the primary class spellcasting if available; otherwise fall back to the first spellcasting multiclass.
  const getSpellcastingClassId = () => {
    if (spellcastingInfo?.available) return classId;
    for (const mc of character.multiclass || []) {
      if (!mc?.classId) continue;
      const mcSpellcasting = getSpellcastingInfo(mc.classId, character.level);
      if (mcSpellcasting?.available) return mc.classId;
    }
    return classId;
  };

  const spellcastingClassId = getSpellcastingClassId();
  const effectiveSpellcasting = spellcastingClassId ? getSpellcastingInfo(spellcastingClassId, character.level) : null;

  const availableCantrips = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 0) : [];
  const availableLevel1Spells = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 1) : [];
  const availableLevel2Spells = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 2) : [];
  const availableLevel3Spells = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 3) : [];
  const availableLevel4Spells = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 4) : [];
  const availableLevel5Spells = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 5) : [];
  const availableLevel6Spells = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 6) : [];
  const availableLevel7Spells = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 7) : [];
  const availableLevel8Spells = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 8) : [];
  const availableLevel9Spells = spellcastingClassId ? getSpellsForClass(spellcastingClassId, 9) : [];
  
  // Filter spells based on search query and filters
  const filterSpells = (spellObjects) => {
    if (!searchQuery && !showRitualOnly && !showConcentrationOnly && selectedSchools.size === 0) {
      return spellObjects;
    }
    
    return spellObjects.filter(spell => {
      if (!spell) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = spell.name.toLowerCase().includes(query);
        const descMatch = spell.description?.toLowerCase().includes(query);
        const schoolMatch = spell.school?.toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !schoolMatch) return false;
      }
      
      // School filter (OR - show if spell matches any selected school)
      if (selectedSchools.size > 0 && !selectedSchools.has(spell.school)) return false;
      
      // Ritual filter
      if (showRitualOnly && !spell.ritual) return false;
      
      // Concentration filter
      if (showConcentrationOnly && !spell.concentration) return false;
      
      return true;
    });
  };
  
  // Apply filtering to all spell lists
  const filteredCantrips = filterSpells(availableCantrips);
  const filteredLevel1Spells = filterSpells(availableLevel1Spells);
  const filteredLevel2Spells = filterSpells(availableLevel2Spells);
  const filteredLevel3Spells = filterSpells(availableLevel3Spells);
  const filteredLevel4Spells = filterSpells(availableLevel4Spells);
  const filteredLevel5Spells = filterSpells(availableLevel5Spells);
  const filteredLevel6Spells = filterSpells(availableLevel6Spells);
  const filteredLevel7Spells = filterSpells(availableLevel7Spells);
  const filteredLevel8Spells = filterSpells(availableLevel8Spells);
  const filteredLevel9Spells = filterSpells(availableLevel9Spells);
  
  // Get max spell level based on character level
  const getMaxSpellLevel = () => {
    const level = character.level || 1;
    if (level >= 17) return 9;
    if (level >= 15) return 8;
    if (level >= 13) return 7;
    if (level >= 11) return 6;
    if (level >= 9) return 5;
    if (level >= 7) return 4;
    if (level >= 5) return 3;
    if (level >= 3) return 2;
    return 1;
  };
  const maxSpellLevel = getMaxSpellLevel();

  const maxCantrips = effectiveSpellcasting?.cantrips || 0;
  const maxSpellsKnown = effectiveSpellcasting?.spellsKnown || 0;
  const spellcastingType = effectiveSpellcasting?.type; // 'known', 'prepared', 'pact'
  
  // Calculate max prepared spells for prepared casters (Wizard, Cleric, Druid, Paladin)
  const getMaxPreparedSpells = () => {
    if (spellcastingType !== 'prepared') return null;
    const abilityMod = getModifier(character.abilities[effectiveSpellcasting?.ability] || 10);
    const level = character.level || 1;
    // Prepared = ability mod + class level (minimum 1)
    return Math.max(1, abilityMod + level);
  };
  const maxPreparedSpells = getMaxPreparedSpells();

  // Update character when selections change
  useEffect(() => {
    updateCharacter('cantrips', selectedCantrips);
    updateCharacter('spells', selectedSpells);
  }, [selectedCantrips, selectedSpells]);

  const toggleCantrip = (spellId) => {
    setSelectedCantrips(prev => {
      if (prev.includes(spellId)) {
        return prev.filter(id => id !== spellId);
      }
      if (prev.length >= maxCantrips) return prev;
      return [...prev, spellId];
    });
  };

  const toggleSpell = (spellId) => {
    setSelectedSpells(prev => {
      if (prev.includes(spellId)) {
        return prev.filter(id => id !== spellId);
      }
      // For 'known' casters, limit spells
      if (spellcastingType === 'known' || spellcastingType === 'pact') {
        if (prev.length >= maxSpellsKnown) return prev;
      }
      // For 'prepared' casters, limit to max prepared
      if (spellcastingType === 'prepared' && maxPreparedSpells !== null) {
        if (prev.length >= maxPreparedSpells) return prev;
      }
      return [...prev, spellId];
    });
  };

  const getSchoolColor = (school) => {
    const colors = {
      abjuration: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      conjuration: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      divination: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
      enchantment: 'text-pink-400 bg-pink-500/20 border-pink-500/30',
      evocation: 'text-red-400 bg-red-500/20 border-red-500/30',
      illusion: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      necromancy: 'text-green-400 bg-green-500/20 border-green-500/30',
      transmutation: 'text-orange-400 bg-orange-500/20 border-orange-500/30'
    };
    return colors[school] || 'text-slate-400 bg-slate-500/20 border-slate-500/30';
  };

  // No class selected
  if (!classId) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Please select a class first</p>
        <p className="text-sm mt-2">Your class determines your available spells.</p>
      </div>
    );
  }

  // Non-spellcaster
  if (!effectiveSpellcasting || !effectiveSpellcasting.available) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Sword className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">None of your classes cast spells</p>
        <p className="text-sm mt-2">Your power comes from martial prowess, not magic.</p>
        <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 inline-block">
          <p className="text-slate-400 text-sm">You can skip this step and proceed to Review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Choose Your Spells</h3>
        <p className="text-sm text-slate-500">
          Spellcasting Ability: {ABILITY_LABELS[effectiveSpellcasting.ability]?.name}
        </p>
      </div>

      {/* Spellcasting Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="text-xs text-purple-300">Cantrips</div>
          <div className="text-xl font-bold text-purple-400">
            {selectedCantrips.length} / {maxCantrips}
          </div>
        </div>
        {(spellcastingType === 'known' || spellcastingType === 'pact') && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <div className="text-xs text-indigo-300">Spells Known</div>
            <div className="text-xl font-bold text-indigo-400">
              {selectedSpells.length} / {maxSpellsKnown}
            </div>
          </div>
        )}
        {spellcastingType === 'prepared' && maxPreparedSpells !== null && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <div className="text-xs text-indigo-300">Prepared Spells</div>
            <div className="text-xl font-bold text-indigo-400">
              {selectedSpells.length} / {maxPreparedSpells}
            </div>
            <div className="text-xs text-slate-500">
              {ABILITY_LABELS[effectiveSpellcasting?.ability]?.short} mod ({getModifier(character.abilities[effectiveSpellcasting?.ability])}) + Total Level ({character.level})
            </div>
          </div>
        )}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="text-xs text-amber-300">Spell Save DC</div>
          <div className="text-xl font-bold text-amber-400">
            {8 + 2 + getModifier(character.abilities[effectiveSpellcasting?.ability] || 10)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
          <div className="text-xs text-green-300">Spell Attack</div>
          <div className="text-xl font-bold text-green-400">
            +{2 + getModifier(character.abilities[effectiveSpellcasting?.ability] || 10)}
          </div>
        </div>
      </div>

      {/* Spell Slots Display */}
      {(() => {
        const slots = getMulticlassSpellSlots(character);
        if (!slots) return null;
        
        // Warlock has different display
        if (classId === 'warlock' || (character.multiclass?.some(m => m.classId === 'warlock') && !character.multiclass?.some(m => ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'].includes(m.classId)))) {
          return (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-slate-200">Pact Magic Slots</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Slots:</span>
                  <div className="flex gap-1">
                    {Array(slots.slots).fill(0).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-purple-500/30 border-2 border-purple-500 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-slate-300">
                  All slots are <span className="text-purple-400 font-semibold">Level {slots.level}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Warlock slots recharge on a short rest.</p>
            </div>
          );
        }
        
        // Regular casters
        const slotLevels = Object.entries(slots).filter(([_, count]) => count > 0);
        if (slotLevels.length === 0) return null;
        
        return (
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-slate-200">Spell Slots Per Day</span>
              <span className="text-xs text-slate-500">(Recharge on long rest)</span>
            </div>
            {character.multiclass && character.multiclass.length > 0 && (
              <p className="text-xs text-slate-400 mb-3">
                Combined spell slots from: {[character.class, ...character.multiclass.map(m => m.classId)].join(', ')}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {slotLevels.map(([level, count]) => (
                <div key={level} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50">
                  <span className="text-xs text-slate-400 w-12">
                    {level === '1' ? '1st' : level === '2' ? '2nd' : level === '3' ? '3rd' : `${level}th`}
                  </span>
                  <div className="flex gap-1">
                    {Array(count).fill(0).map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-indigo-500/30 border-2 border-indigo-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spells by name, description, or school..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggles */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowRitualOnly(!showRitualOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showRitualOnly
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 border'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 border hover:border-slate-600'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            Ritual Only
          </button>
          <button
            onClick={() => setShowConcentrationOnly(!showConcentrationOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showConcentrationOnly
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 border'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 border hover:border-slate-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Concentration
          </button>
          {(searchQuery || showRitualOnly || showConcentrationOnly || selectedSchools.size > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowRitualOnly(false);
                setShowConcentrationOnly(false);
                setSelectedSchools(new Set());
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 border-slate-700/50 text-slate-400 border hover:text-red-400 hover:border-red-500/50 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>

        {/* School Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="text-xs text-slate-500 w-full mb-1">Filter by School (select multiple):</div>
          {Object.entries(SPELL_SCHOOLS).map(([schoolId, school]) => {
            const isSelected = selectedSchools.has(schoolId);
            const colorClasses = {
              blue: isSelected ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-blue-500/30',
              yellow: isSelected ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-yellow-500/30',
              cyan: isSelected ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-cyan-500/30',
              pink: isSelected ? 'bg-pink-500/20 border-pink-500/50 text-pink-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-pink-500/30',
              red: isSelected ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-red-500/30',
              purple: isSelected ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-purple-500/30',
              green: isSelected ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-green-500/30',
              orange: isSelected ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-orange-500/30'
            };
            return (
              <button
                key={schoolId}
                onClick={() => {
                  setSelectedSchools(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(schoolId)) {
                      newSet.delete(schoolId);
                    } else {
                      newSet.add(schoolId);
                    }
                    return newSet;
                  });
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${colorClasses[school.color]}`}
              >
                <span>{school.icon}</span>
                {school.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 md:gap-2 border-b border-slate-700/50 pb-1">
        <button
          onClick={() => setActiveTab('cantrips')}
          className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'cantrips'
              ? 'text-purple-400 border-purple-400'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Cantrips ({filteredCantrips.length})
        </button>
        <button
          onClick={() => setActiveTab('level1')}
          className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'level1'
              ? 'text-indigo-400 border-indigo-400'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          1st ({filteredLevel1Spells.length})
        </button>
        {maxSpellLevel >= 2 && availableLevel2Spells.length > 0 && (
          <button
            onClick={() => setActiveTab('level2')}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'level2'
                ? 'text-blue-400 border-blue-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            2nd ({filteredLevel2Spells.length})
          </button>
        )}
        {maxSpellLevel >= 3 && availableLevel3Spells.length > 0 && (
          <button
            onClick={() => setActiveTab('level3')}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'level3'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            3rd ({filteredLevel3Spells.length})
          </button>
        )}
        {maxSpellLevel >= 4 && availableLevel4Spells.length > 0 && (
          <button
            onClick={() => setActiveTab('level4')}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'level4'
                ? 'text-teal-400 border-teal-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            4th ({filteredLevel4Spells.length})
          </button>
        )}
        {maxSpellLevel >= 5 && availableLevel5Spells.length > 0 && (
          <button
            onClick={() => setActiveTab('level5')}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'level5'
                ? 'text-emerald-400 border-emerald-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            5th ({filteredLevel5Spells.length})
          </button>
        )}
        {maxSpellLevel >= 6 && availableLevel6Spells.length > 0 && (
          <button
            onClick={() => setActiveTab('level6')}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'level6'
                ? 'text-lime-400 border-lime-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            6th ({filteredLevel6Spells.length})
          </button>
        )}
        {maxSpellLevel >= 7 && availableLevel7Spells.length > 0 && (
          <button
            onClick={() => setActiveTab('level7')}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'level7'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            7th ({filteredLevel7Spells.length})
          </button>
        )}
        {maxSpellLevel >= 8 && availableLevel8Spells.length > 0 && (
          <button
            onClick={() => setActiveTab('level8')}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'level8'
                ? 'text-orange-400 border-orange-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            8th ({filteredLevel8Spells.length})
          </button>
        )}
        {maxSpellLevel >= 9 && availableLevel9Spells.length > 0 && (
          <button
            onClick={() => setActiveTab('level9')}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'level9'
                ? 'text-red-400 border-red-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            9th ({filteredLevel9Spells.length})
          </button>
        )}
        {selectedCantrips.length + selectedSpells.length > 0 && (
          <button
            onClick={() => setActiveTab('selected')}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'selected'
                ? 'text-green-400 border-green-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            ✓ ({selectedCantrips.length + selectedSpells.length})
          </button>
        )}
      </div>

      {/* Spell Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {activeTab === 'cantrips' && filteredCantrips.map(spell => {
            const isSelected = selectedCantrips.includes(spell.id);
            const isDisabled = !isSelected && selectedCantrips.length >= maxCantrips;
            
            return (
              <div
                key={spell.id}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : isDisabled
                      ? 'bg-slate-900/30 border-slate-800/50 opacity-50 cursor-not-allowed'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30'
                }`}
                onClick={() => !isDisabled && toggleCantrip(spell.id)}
                onMouseEnter={() => setViewingSpell(spell)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{SPELL_SCHOOLS[spell.school]?.icon}</span>
                    <div>
                      <div className={`font-medium ${isSelected ? 'text-purple-300' : 'text-slate-200'}`}>
                        {spell.name}
                      </div>
                      <div className="text-xs text-slate-500">{spell.castTime} • {spell.range}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-purple-400" />}
                </div>
              </div>
            );
          })}

          {activeTab === 'level1' && filteredLevel1Spells.map(spell => {
            const isSelected = selectedSpells.includes(spell.id);
            const isDisabledKnown = (spellcastingType === 'known' || spellcastingType === 'pact') && selectedSpells.length >= maxSpellsKnown;
            const isDisabledPrepared = spellcastingType === 'prepared' && maxPreparedSpells !== null && selectedSpells.length >= maxPreparedSpells;
            const isDisabled = !isSelected && (isDisabledKnown || isDisabledPrepared);
            
            return (
              <div
                key={spell.id}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-500/20 border-indigo-500/50'
                    : isDisabled
                      ? 'bg-slate-900/30 border-slate-800/50 opacity-50 cursor-not-allowed'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
                }`}
                onClick={() => !isDisabled && toggleSpell(spell.id)}
                onMouseEnter={() => setViewingSpell(spell)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{SPELL_SCHOOLS[spell.school]?.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                          {spell.name}
                        </span>
                        {spell.ritual && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Ritual
                          </span>
                        )}
                        {spell.concentration && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Conc
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{spell.castTime} • {spell.range}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-indigo-400" />}
                </div>
              </div>
            );
          })}

          {/* Level 2-9 Spells - using same pattern */}
          {['level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', 'level9'].map(levelTab => {
            if (activeTab !== levelTab) return null;
            const levelNum = parseInt(levelTab.replace('level', ''));
            const spellList = levelNum === 2 ? filteredLevel2Spells 
              : levelNum === 3 ? filteredLevel3Spells 
              : levelNum === 4 ? filteredLevel4Spells 
              : levelNum === 5 ? filteredLevel5Spells
              : levelNum === 6 ? filteredLevel6Spells
              : levelNum === 7 ? filteredLevel7Spells
              : levelNum === 8 ? filteredLevel8Spells
              : filteredLevel9Spells;
            const colors = {
              2: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-300', check: 'text-blue-400' },
              3: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-300', check: 'text-cyan-400' },
              4: { bg: 'bg-teal-500/20', border: 'border-teal-500/50', text: 'text-teal-300', check: 'text-teal-400' },
              5: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300', check: 'text-emerald-400' },
              6: { bg: 'bg-lime-500/20', border: 'border-lime-500/50', text: 'text-lime-300', check: 'text-lime-400' },
              7: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-300', check: 'text-amber-400' },
              8: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-300', check: 'text-orange-400' },
              9: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-300', check: 'text-red-400' }
            };
            const color = colors[levelNum];
            
            return spellList.map(spell => {
              const isSelected = selectedSpells.includes(spell.id);
              const isDisabledKnown = (spellcastingType === 'known' || spellcastingType === 'pact') && selectedSpells.length >= maxSpellsKnown;
              const isDisabledPrepared = spellcastingType === 'prepared' && maxPreparedSpells !== null && selectedSpells.length >= maxPreparedSpells;
              const isDisabled = !isSelected && (isDisabledKnown || isDisabledPrepared);
              
              return (
                <div
                  key={spell.id}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? `${color.bg} ${color.border}`
                      : isDisabled
                        ? 'bg-slate-900/30 border-slate-800/50 opacity-50 cursor-not-allowed'
                        : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
                  }`}
                  onClick={() => !isDisabled && toggleSpell(spell.id)}
                  onMouseEnter={() => setViewingSpell(spell)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{SPELL_SCHOOLS[spell.school]?.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isSelected ? color.text : 'text-slate-200'}`}>
                            {spell.name}
                          </span>
                          {spell.ritual && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              Ritual
                            </span>
                          )}
                          {spell.concentration && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Conc
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{spell.castTime} • {spell.range}</div>
                      </div>
                    </div>
                    {isSelected && <Check className={`w-5 h-5 ${color.check}`} />}
                  </div>
                </div>
              );
            });
          })}

          {activeTab === 'selected' && (
            <>
              {selectedCantrips.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-purple-400 font-medium mb-2">Cantrips</div>
                  {selectedCantrips.map(spellId => {
                    const spell = SPELLS[spellId];
                    return (
                      <div
                        key={spellId}
                        className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/50 mb-2 cursor-pointer"
                        onClick={() => toggleCantrip(spellId)}
                        onMouseEnter={() => setViewingSpell({ id: spellId, ...spell })}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{SPELL_SCHOOLS[spell.school]?.icon}</span>
                            <span className="font-medium text-purple-300">{spell.name}</span>
                          </div>
                          <X className="w-4 h-4 text-purple-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {selectedSpells.length > 0 && (
                <div>
                  <div className="text-xs text-indigo-400 font-medium mb-2">1st Level Spells</div>
                  {selectedSpells.map(spellId => {
                    const spell = SPELLS[spellId];
                    return (
                      <div
                        key={spellId}
                        className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/50 mb-2 cursor-pointer"
                        onClick={() => toggleSpell(spellId)}
                        onMouseEnter={() => setViewingSpell({ id: spellId, ...spell })}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{SPELL_SCHOOLS[spell.school]?.icon}</span>
                            <span className="font-medium text-indigo-300">{spell.name}</span>
                          </div>
                          <X className="w-4 h-4 text-indigo-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Spell Detail Panel */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 sticky top-4 h-fit">
          {viewingSpell ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">{SPELL_SCHOOLS[viewingSpell.school]?.icon}</span>
                <div>
                  <div className="font-bold text-white">{viewingSpell.name}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${getSchoolColor(viewingSpell.school)}`}>
                    {SPELL_SCHOOLS[viewingSpell.school]?.name}
                    {viewingSpell.level === 0 ? ' cantrip' : ` (Level ${viewingSpell.level})`}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-500">Casting Time: </span>
                  <span className="text-slate-200">{viewingSpell.castTime}</span>
                </div>
                <div>
                  <span className="text-slate-500">Range: </span>
                  <span className="text-slate-200">{viewingSpell.range}</span>
                </div>
                <div>
                  <span className="text-slate-500">Duration: </span>
                  <span className="text-slate-200">{viewingSpell.duration}</span>
                </div>
                {viewingSpell.ritual && (
                  <div className="text-cyan-400 text-xs">✦ Can be cast as a ritual</div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <p className="text-sm text-slate-300 leading-relaxed">{viewingSpell.description}</p>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Hover over a spell to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EQUIPMENT SELECTION STEP (PHASE 6)
// ============================================================================

const EquipmentSelectionStep = ({ character, updateCharacter }) => {
  const [method, setMethod] = useState(character.equipmentMethod || null);
  const [equipmentChoices, setEquipmentChoices] = useState(character.equipmentChoices || {});
  const [gold, setGold] = useState(character.gold || 0);
  const [goldRolled, setGoldRolled] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState(character.purchasedItems || []);
  const [shopCategory, setShopCategory] = useState('weapons');

  const classId = character.class;
  const classEquipment = classId ? STARTING_EQUIPMENT[classId] : null;
  const classGold = classId ? STARTING_GOLD[classId] : null;
  const backgroundEquipment = character.background ? BACKGROUNDS[character.background]?.equipment : null;

  // Update character when equipment changes
  useEffect(() => {
    updateCharacter('equipmentMethod', method);
    updateCharacter('equipmentChoices', equipmentChoices);
    updateCharacter('gold', gold);
    updateCharacter('purchasedItems', purchasedItems);
  }, [method, equipmentChoices, gold, purchasedItems]);

  const rollStartingGold = () => {
    if (!classGold) return;
    let total = 0;
    for (let i = 0; i < classGold.dice; i++) {
      total += Math.floor(Math.random() * classGold.sides) + 1;
    }
    total *= classGold.multiplier;
    setGold(total);
    setGoldRolled(true);
    setPurchasedItems([]);
  };

  const selectChoice = (choiceIndex, optionIndex) => {
    setEquipmentChoices(prev => ({
      ...prev,
      [choiceIndex]: optionIndex
    }));
  };

  const buyItem = (item) => {
    if (gold >= item.cost) {
      setGold(prev => Math.round((prev - item.cost) * 100) / 100);
      setPurchasedItems(prev => [...prev, item.name]);
    }
  };

  const removeItem = (index) => {
    const item = purchasedItems[index];
    const shopItem = [...EQUIPMENT_SHOP.weapons, ...EQUIPMENT_SHOP.armor, ...EQUIPMENT_SHOP.gear, ...EQUIPMENT_SHOP.packs]
      .find(i => i.name === item);
    if (shopItem) {
      setGold(prev => Math.round((prev + shopItem.cost) * 100) / 100);
    }
    setPurchasedItems(prev => prev.filter((_, i) => i !== index));
  };

  if (!classId) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Sword className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Please select a class first</p>
        <p className="text-sm mt-2">Your class determines your starting equipment options.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Choose Your Equipment</h3>
        <p className="text-sm text-slate-500">
          Take your class starting equipment or roll for gold to buy your own.
        </p>
      </div>

      {/* Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => { setMethod('starting'); setGoldRolled(false); }}
          className={`p-4 rounded-xl border text-left transition-all ${
            method === 'starting'
              ? 'bg-indigo-500/20 border-indigo-500/50'
              : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📦</div>
            <div>
              <div className={`font-semibold ${method === 'starting' ? 'text-indigo-300' : 'text-slate-200'}`}>
                Starting Equipment
              </div>
              <div className="text-xs text-slate-500">
                Take your {CLASSES[classId]?.name}'s default gear with choices
              </div>
            </div>
            {method === 'starting' && <Check className="w-5 h-5 text-indigo-400 ml-auto" />}
          </div>
        </button>

        <button
          onClick={() => setMethod('gold')}
          className={`p-4 rounded-xl border text-left transition-all ${
            method === 'gold'
              ? 'bg-indigo-500/20 border-indigo-500/50'
              : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">💰</div>
            <div>
              <div className={`font-semibold ${method === 'gold' ? 'text-indigo-300' : 'text-slate-200'}`}>
                Roll for Gold
              </div>
              <div className="text-xs text-slate-500">
                {classGold ? `${classGold.dice}d${classGold.sides} × ${classGold.multiplier} gp` : '—'} to buy equipment
              </div>
            </div>
            {method === 'gold' && <Check className="w-5 h-5 text-indigo-400 ml-auto" />}
          </div>
        </button>
      </div>

      {/* Starting Equipment */}
      {method === 'starting' && classEquipment && (
        <div className="space-y-4">
          {/* Equipment Choices */}
          {classEquipment.choices.map((choice, choiceIndex) => (
            <div key={choiceIndex} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-sm font-medium text-slate-300 mb-3">{choice.name}</div>
              <div className="flex flex-wrap gap-2">
                {choice.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => selectChoice(choiceIndex, optionIndex)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                      equipmentChoices[choiceIndex] === optionIndex
                        ? 'bg-green-500/20 border-green-500/50 text-green-300'
                        : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:border-green-500/30'
                    }`}
                  >
                    {option}
                    {equipmentChoices[choiceIndex] === optionIndex && (
                      <Check className="w-3 h-3 inline ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Fixed Equipment */}
          {classEquipment.fixed.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-sm font-medium text-slate-300 mb-3">Also Included</div>
              <div className="flex flex-wrap gap-2">
                {classEquipment.fixed.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Background Equipment */}
          {backgroundEquipment && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <div className="text-sm font-medium text-purple-300 mb-3">
                From Background ({BACKGROUNDS[character.background]?.name})
              </div>
              <div className="flex flex-wrap gap-2">
                {backgroundEquipment.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-200 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gold Method */}
      {method === 'gold' && (
        <div className="space-y-4">
          {/* Roll / Gold Display */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-amber-300 font-medium">Starting Gold</div>
                <div className="text-3xl font-bold text-amber-400">{gold} gp</div>
              </div>
              <button
                onClick={rollStartingGold}
                className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500/30 transition-colors"
              >
                {goldRolled ? 'Reroll' : 'Roll'} ({classGold?.dice}d{classGold?.sides} × {classGold?.multiplier})
              </button>
            </div>
          </div>

          {goldRolled && (
            <>
              {/* Shop Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['weapons', 'armor', 'gear', 'packs'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setShopCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      shopCategory === cat
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 border'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 border hover:text-slate-200'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Shop Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {EQUIPMENT_SHOP[shopCategory]?.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => buyItem(item)}
                    disabled={gold < item.cost}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      gold >= item.cost
                        ? 'bg-slate-800/50 border-slate-700/50 hover:border-green-500/30'
                        : 'bg-slate-900/30 border-slate-800/50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-slate-200 text-sm">{item.name}</div>
                      <div className="text-amber-400 text-sm font-medium">{item.cost} gp</div>
                    </div>
                    {item.damage && (
                      <div className="text-xs text-red-400 mt-1">{item.damage}</div>
                    )}
                    {item.ac && (
                      <div className="text-xs text-blue-400 mt-1">AC: {item.ac}</div>
                    )}
                    {item.properties && (
                      <div className="text-xs text-slate-500 mt-1">{item.properties}</div>
                    )}
                    {item.contents && (
                      <div className="text-xs text-slate-400 mt-1 leading-relaxed">{item.contents}</div>
                    )}
                  </button>
                ))}
              </div>

              {/* Purchased Items */}
              {purchasedItems.length > 0 && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="text-sm font-medium text-green-300 mb-3">
                    Purchased ({purchasedItems.length} items)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {purchasedItems.map((item, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-200 text-sm flex items-center gap-2 cursor-pointer hover:bg-red-500/20 hover:text-red-200 transition-colors"
                        onClick={() => removeItem(i)}
                        title="Click to refund"
                      >
                        {item}
                        <X className="w-3 h-3" />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// BACKGROUND SELECTION STEP (PHASE 5)
// ============================================================================

const BackgroundSelectionStep = ({ character, updateCharacter }) => {
  const [showAllBackgrounds, setShowAllBackgrounds] = useState(!character.background);
  const selectedBackgroundId = character.background;
  const selectedBackground = selectedBackgroundId ? BACKGROUNDS[selectedBackgroundId] : null;

  const pickBackground = (bgId) => {
    updateCharacter('background', bgId);
    setShowAllBackgrounds(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Choose Your Background</h3>
        <p className="text-sm text-slate-500">
          Your background reveals where you came from and your place in the world.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Background Grid */}
        <div className="lg:col-span-3">
          {/* Mobile: Show selected background with change button when collapsed */}
          {character.background && !showAllBackgrounds && (
            <div className="md:hidden mb-3">
              <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{BACKGROUND_ICONS[character.background]}</span>
                    <div>
                      <div className="font-medium text-indigo-300">{BACKGROUNDS[character.background]?.name}</div>
                      <div className="text-xs text-slate-400">{BACKGROUNDS[character.background]?.skillProficiencies?.join(', ')}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllBackgrounds(true)}
                    className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm hover:bg-slate-600/50 transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 ${character.background && !showAllBackgrounds ? 'hidden md:grid' : ''}`}>
            {Object.entries(BACKGROUNDS).map(([id, bg]) => {
              const isSelected = selectedBackgroundId === id;
              
              return (
                <button
                  key={id}
                  onClick={() => pickBackground(id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
                  }`}
                >
                  <Tooltip content={bg.description}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{BACKGROUND_ICONS[id] || '📜'}</div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-semibold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                          {bg.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Hover for details
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                          {bg.skillProficiencies.join(', ')}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      )}
                    </div>
                  </Tooltip>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-2">
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4 sticky top-4">
            {!selectedBackground ? (
              <div className="text-center py-10 text-slate-500">
                <Scroll className="w-14 h-14 mx-auto mb-3 opacity-40" />
                <div className="font-semibold text-slate-300">Select a background to see details</div>
                <div className="text-xs mt-1">Skills, tools, languages, and features.</div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{BACKGROUND_ICONS[selectedBackgroundId] || '📜'}</div>
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-white">{selectedBackground.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{selectedBackground.description}</div>
                  </div>
                </div>

                {/* Proficiencies */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                    <div className="text-xs text-slate-500 mb-2">Skill Proficiencies</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedBackground.skillProficiencies.map((skill, i) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-green-500/20 text-green-300 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedBackground.toolProficiencies.length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                      <div className="text-xs text-slate-500 mb-2">Tool Proficiencies</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedBackground.toolProficiencies.map((tool, i) => (
                          <span key={i} className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-medium">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBackground.languages > 0 && (
                    <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                      <div className="text-xs text-slate-500">Languages</div>
                      <div className="text-sm text-slate-200 mt-1">
                        {selectedBackground.languages} of your choice
                      </div>
                    </div>
                  )}
                </div>

                {/* Feature */}
                <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <div className="text-sm text-indigo-300 font-semibold">{selectedBackground.feature}</div>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {selectedBackground.featureDesc}
                  </div>
                </div>

                {/* Equipment */}
                <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                  <div className="text-xs text-slate-500 mb-2">Starting Equipment</div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {selectedBackground.equipment.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-600">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Personality Traits (if available for this background) */}
                {selectedBackground.personalityTraits && (
                  <div className="space-y-3">
                    {/* Personality Traits */}
                    <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                      <div className="text-xs text-slate-500 mb-2">
                        Personality Traits (choose up to 2)
                        {character.personalityTraits?.length > 0 && (
                          <span className="text-purple-400 ml-2">({character.personalityTraits.length}/2 selected)</span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {selectedBackground.personalityTraits.map((trait, i) => {
                          const isSelected = character.personalityTraits?.includes(trait);
                          const canSelect = !isSelected && (character.personalityTraits?.length || 0) < 2;
                          
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                if (isSelected) {
                                  updateCharacter('personalityTraits', character.personalityTraits.filter(t => t !== trait));
                                } else if (canSelect) {
                                  updateCharacter('personalityTraits', [...(character.personalityTraits || []), trait]);
                                }
                              }}
                              disabled={!isSelected && !canSelect}
                              className={`w-full p-2 rounded-lg border text-left transition-all text-xs ${
                                isSelected
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-200'
                                  : canSelect
                                  ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-purple-500/30'
                                  : 'bg-slate-900/50 border-slate-800/30 text-slate-600 cursor-not-allowed'
                              }`}
                            >
                              {trait}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ideals */}
                    {selectedBackground.ideals && (
                      <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                        <div className="text-xs text-slate-500 mb-2">
                          Ideal (choose 1)
                          {character.ideals && <span className="text-blue-400 ml-2">✓ Selected</span>}
                        </div>
                        <div className="space-y-1.5">
                          {selectedBackground.ideals.map((ideal, i) => {
                            const isSelected = character.ideals === ideal;
                            
                            return (
                              <button
                                key={i}
                                onClick={() => updateCharacter('ideals', ideal)}
                                className={`w-full p-2 rounded-lg border text-left transition-all text-xs ${
                                  isSelected
                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-blue-500/30'
                                }`}
                              >
                                {ideal}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Bonds */}
                    {selectedBackground.bonds && (
                      <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                        <div className="text-xs text-slate-500 mb-2">
                          Bond (choose 1)
                          {character.bonds && <span className="text-green-400 ml-2">✓ Selected</span>}
                        </div>
                        <div className="space-y-1.5">
                          {selectedBackground.bonds.map((bond, i) => {
                            const isSelected = character.bonds === bond;
                            
                            return (
                              <button
                                key={i}
                                onClick={() => updateCharacter('bonds', bond)}
                                className={`w-full p-2 rounded-lg border text-left transition-all text-xs ${
                                  isSelected
                                    ? 'bg-green-500/20 border-green-500/50 text-green-200'
                                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-green-500/30'
                                }`}
                              >
                                {bond}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Flaws */}
                    {selectedBackground.flaws && (
                      <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                        <div className="text-xs text-slate-500 mb-2">
                          Flaw (choose 1)
                          {character.flaws && <span className="text-red-400 ml-2">✓ Selected</span>}
                        </div>
                        <div className="space-y-1.5">
                          {selectedBackground.flaws.map((flaw, i) => {
                            const isSelected = character.flaws === flaw;
                            
                            return (
                              <button
                                key={i}
                                onClick={() => updateCharacter('flaws', flaw)}
                                className={`w-full p-2 rounded-lg border text-left transition-all text-xs ${
                                  isSelected
                                    ? 'bg-red-500/20 border-red-500/50 text-red-200'
                                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-red-500/30'
                                }`}
                              >
                                {flaw}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Synergy hint */}
                {character.class && (() => {
                  const classSkills = CLASSES[character.class]?.skillChoices.from;
                  if (classSkills === 'any') return null;
                  
                  const overlap = selectedBackground.skillProficiencies.filter(
                    skill => classSkills?.includes(skill)
                  );
                  
                  if (overlap.length > 0) {
                    return (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                        ⚠️ Overlap with {CLASSES[character.class].name} skills: {overlap.join(', ')}. 
                        You'll choose replacements in the Review step.
                      </div>
                    );
                  }
                  return null;
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CLASS SELECTION STEP (PHASE 4)
// ============================================================================

const ClassSelectionStep = ({ character, updateCharacter, randomWithMulticlass, setRandomWithMulticlass }) => {
  const [showAllClasses, setShowAllClasses] = useState(!character.class);
  const [multiclassExpanded, setMulticlassExpanded] = useState(randomWithMulticlass || (character.multiclass?.length > 0));
  const selectedClassId = character.class;
  const selectedClass = selectedClassId ? CLASSES[selectedClassId] : null;

  const renderMulticlassToggle = ({ compact = false } = {}) => {
    if (!selectedClass) return null;

    return (
      <div className={compact ? 'p-3 rounded-xl bg-slate-800/50 border border-slate-700/50' : 'p-4 rounded-xl bg-slate-900/30 border border-slate-700/40'}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={multiclassExpanded}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setMulticlassExpanded(checked);
                  setRandomWithMulticlass(checked);
                  if (checked && (character.level || 1) < 2) {
                    updateCharacter('level', 2);
                  }
                  if (!checked) {
                    updateCharacter('multiclass', []);
                  }
                }}
                className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
              />
              <span>Multi-class?</span>
            </label>
            <p className="text-xs text-slate-500 mt-1">
              Enable to allocate levels into secondary classes.
            </p>
          </div>
          {multiclassExpanded && (
            <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1 self-start sm:self-auto">
              <AlertCircle className="w-3 h-3" /> Requires level 2+
            </span>
          )}
        </div>
        {multiclassExpanded && (
          <div className="mt-4">
            <MulticlassStep character={character} updateCharacter={updateCharacter} />
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if ((character.multiclass || []).length > 0 && !multiclassExpanded) {
      setMulticlassExpanded(true);
      setRandomWithMulticlass(true);
    }
  }, [character.multiclass, multiclassExpanded, setRandomWithMulticlass]);

  const pickClass = (classId) => {
    updateCharacter('class', classId);
    updateCharacter('subclass', null); // Clear subclass when class changes
    updateCharacter('classSkills', []); // Clear class skills when class changes
    setShowAllClasses(false);
  };

  const getHitPointsAtLevel1 = () => {
    if (!selectedClass) return null;
    const conMod = getModifier(character.abilities.constitution);
    return selectedClass.hitDie + conMod;
  };

  const getPrimaryAbilityDisplay = () => {
    if (!selectedClass) return '';
    return selectedClass.primaryAbility
      .map(a => ABILITY_LABELS[a]?.short || a)
      .join(' or ');
  };

  const getSavingThrowDisplay = () => {
    if (!selectedClass) return '';
    return selectedClass.savingThrows
      .map(a => ABILITY_LABELS[a]?.short || a)
      .join(', ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Choose Your Class</h3>
        <p className="text-sm text-slate-500">
          Your class determines your abilities, features, and role in the party.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Multiclass options appear after selecting a primary class (below the class grid, or below on small screens).
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Note: multiclassing splits your total character level across classes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Class Grid */}
        <div className="lg:col-span-3">
          {/* Mobile: Show selected class with change button when collapsed */}
          {character.class && !showAllClasses && (
            <div className="md:hidden mb-3">
              <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CLASS_ICONS[character.class]}</span>
                    <div>
                      <div className="font-medium text-indigo-300">{CLASSES[character.class]?.name}</div>
                      {character.subclass && SUBCLASSES[character.class]?.[character.subclass] ? (
                        <div className="text-xs text-amber-300">{SUBCLASSES[character.class][character.subclass].name}</div>
                      ) : (
                        <div className="text-xs text-slate-400">d{CLASSES[character.class]?.hitDie} Hit Die</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllClasses(true)}
                    className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm hover:bg-slate-600/50 transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Mobile: multiclass toggle directly below primary class */}
              <div className="mt-3">
                {renderMulticlassToggle({ compact: true })}
              </div>
            </div>
          )}
          
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 ${character.class && !showAllClasses ? 'hidden md:grid' : ''}`}>
            {Object.entries(CLASSES).map(([id, cls]) => {
              const isSelected = selectedClassId === id;
              const primaryAbs = cls.primaryAbility.map(a => ABILITY_LABELS[a]?.short).join('/');
              
              return (
                <button
                  key={id}
                  onClick={() => pickClass(id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
                  }`}
                >
                  <Tooltip content={cls.description}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{CLASS_ICONS[id] || '⚔️'}</div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-semibold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                          {cls.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Hover for details
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                            d{cls.hitDie}
                          </span>
                          <span className="text-slate-500">
                            {primaryAbs}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      )}
                    </div>
                  </Tooltip>
                </button>
              );
            })}
          </div>

          {/* Desktop/tablet: multiclass lives under the class grid (red area) */}
          <div className="hidden md:block mt-4">
            {renderMulticlassToggle()}
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-2">
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4 sticky top-4">
            {!selectedClass ? (
              <div className="text-center py-10 text-slate-500">
                <Sword className="w-14 h-14 mx-auto mb-3 opacity-40" />
                <div className="font-semibold text-slate-300">Select a class to see details</div>
                <div className="text-xs mt-1">Hit die, features, proficiencies, and more.</div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{CLASS_ICONS[selectedClassId] || '⚔️'}</div>
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-white">{selectedClass.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{selectedClass.description}</div>
                  </div>
                </div>

                {/* Core Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                    <div className="text-xs text-slate-500">Hit Die</div>
                    <div className="text-lg font-bold text-red-400">d{selectedClass.hitDie}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      HP at Lvl 1: <span className="text-white font-medium">{getHitPointsAtLevel1()}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                    <div className="text-xs text-slate-500">Primary Ability</div>
                    <div className="text-lg font-bold text-amber-400">{getPrimaryAbilityDisplay()}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Saves: <span className="text-white font-medium">{getSavingThrowDisplay()}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                  <div className="text-xs text-slate-500 mb-2">Level 1 Features</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedClass.features.map((f, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                  {selectedClass.subclassLevel === 1 && (
                    <div className="text-xs text-amber-400 mt-2">
                      ⚡ {selectedClass.subclassName} chosen at level 1
                    </div>
                  )}
                  {selectedClass.subclassLevel > 1 && (
                    <div className="text-xs text-slate-500 mt-2">
                      {selectedClass.subclassName} at level {selectedClass.subclassLevel}
                    </div>
                  )}
                </div>

                {/* Proficiencies */}
                <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40 space-y-2">
                  <div className="text-xs text-slate-500">Proficiencies</div>
                  
                  {selectedClass.armorProficiencies.length > 0 && (
                    <div>
                      <span className="text-xs text-slate-500">Armor: </span>
                      <span className="text-xs text-slate-300">{selectedClass.armorProficiencies.join(', ')}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-xs text-slate-500">Weapons: </span>
                    <span className="text-xs text-slate-300">{selectedClass.weaponProficiencies.join(', ')}</span>
                  </div>
                  
                  <div>
                    <span className="text-xs text-slate-500">Skills: </span>
                    <span className="text-xs text-slate-300">
                      Choose {selectedClass.skillChoices.count} from {
                        selectedClass.skillChoices.from === 'any' 
                          ? 'any skill' 
                          : selectedClass.skillChoices.from.join(', ')
                      }
                    </span>
                  </div>
                </div>

                {/* Skill Selection */}
                <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/40">
                  <div className="text-xs text-slate-500 mb-2">
                    Choose {selectedClass.skillChoices.count} Class Skills
                    {character.classSkills?.length > 0 && (
                      <span className="text-green-400 ml-2">({character.classSkills.length}/{selectedClass.skillChoices.count} selected)</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(selectedClass.skillChoices.from === 'any' ? Object.keys(SKILLS) : selectedClass.skillChoices.from)
                      .map(skillOption => (selectedClass.skillChoices.from === 'any' ? skillOption : (getSkillId(skillOption) || skillOption)))
                      .filter(Boolean)
                      .map(skillId => {
                      const currentSelected = (character.classSkills || []).map(s => getSkillId(s) || s);
                      const isSelected = currentSelected.includes(skillId);
                      const skillInfo = SKILLS[skillId];
                      const canSelect = !isSelected && currentSelected.length < selectedClass.skillChoices.count;
                      
                      return (
                        <Tooltip key={skillId} content={skillInfo?.description || skillInfo?.name || skillId}>
                          <button
                            onClick={() => {
                              if (isSelected) {
                                // Deselect
                                updateCharacter('classSkills', currentSelected.filter(s => s !== skillId));
                              } else if (canSelect) {
                                // Select
                                updateCharacter('classSkills', [...currentSelected, skillId]);
                              }
                            }}
                            disabled={!isSelected && !canSelect}
                            className={`p-2 rounded-lg border text-left transition-all text-xs ${
                              isSelected
                                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                : canSelect
                                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-green-500/30'
                                : 'bg-slate-900/50 border-slate-800/30 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <div className="font-medium">{skillInfo?.name || skillId}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Hover for details</div>
                          </button>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>

                {/* Spellcasting */}
                {selectedClass.spellcasting && (
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <div className="text-xs text-purple-300 font-semibold">Spellcaster</div>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1">
                      <div>
                        <span className="text-slate-500">Ability: </span>
                        {ABILITY_LABELS[selectedClass.spellcasting.ability]?.name}
                      </div>
                      {selectedClass.spellcasting.cantrips > 0 && (
                        <div>
                          <span className="text-slate-500">Cantrips: </span>
                          {selectedClass.spellcasting.cantrips} known
                        </div>
                      )}
                      {selectedClass.spellcasting.startsAtLevel && selectedClass.spellcasting.startsAtLevel > 1 && (
                        <div className="text-amber-400">
                          Spellcasting begins at level {selectedClass.spellcasting.startsAtLevel}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Subclass Selection */}
                {character.level >= selectedClass.subclassLevel && SUBCLASSES[selectedClassId] && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-amber-400" />
                      <div className="text-xs text-amber-300 font-semibold">
                        Choose Your {selectedClass.subclassName}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(SUBCLASSES[selectedClassId]).map(([subId, sub]) => {
                        const isSubSelected = character.subclass === subId;
                        return (
                          <Tooltip key={subId} content={sub.description}>
                            <button
                              onClick={() => updateCharacter('subclass', subId)}
                              className={`w-full p-3 rounded-lg border text-left transition-all ${
                                isSubSelected
                                  ? 'bg-amber-500/20 border-amber-500/50'
                                  : 'bg-slate-800/50 border-slate-700/50 hover:border-amber-500/30'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{SUBCLASS_ICONS[subId] || '⭐'}</span>
                                <div className="flex-1 min-w-0">
                                  <div className={`font-medium text-sm ${isSubSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                                    {sub.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500">Hover for details</div>
                                </div>
                                {isSubSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                              </div>
                            </button>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Subclass Note - if not high enough level */}
                {character.level < selectedClass.subclassLevel && (
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="text-xs text-slate-400">
                      <span className="text-amber-400">📋 {selectedClass.subclassName}</span> will be available at level {selectedClass.subclassLevel}.
                      {character.level === 1 && selectedClass.subclassLevel <= 3 && (
                        <span className="block mt-1 text-slate-500">
                          Increase your level in Basics to choose now.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Recommendation based on abilities */}
                {(() => {
                  const abilities = character.abilities;
                  const primaryScores = selectedClass.primaryAbility.map(a => abilities[a]);
                  const maxPrimary = Math.max(...primaryScores);
                  const isGoodFit = maxPrimary >= 14;
                  const isGreatFit = maxPrimary >= 16;
                  
                  if (isGreatFit) {
                    return (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-300">
                        ✨ Excellent fit! Your {getPrimaryAbilityDisplay()} score is great for this class.
                      </div>
                    );
                  } else if (isGoodFit) {
                    return (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300">
                        👍 Good fit! Your {getPrimaryAbilityDisplay()} score works well for this class.
                      </div>
                    );
                  } else {
                    return (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                        ⚠️ Consider boosting your {getPrimaryAbilityDisplay()} for this class (currently {maxPrimary}).
                      </div>
                    );
                  }
                })()}

                {/* FIGHTING STYLE - Fighter/Paladin/Ranger */}
                {selectedClassId && ['fighter', 'paladin', 'ranger'].includes(selectedClassId) && (
                  (selectedClassId === 'fighter' && character.level >= 1) ||
                  (selectedClassId === 'paladin' && character.level >= 2) ||
                  (selectedClassId === 'ranger' && character.level >= 2)
                ) && (
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Sword className="w-4 h-4 text-orange-400" />
                      <div className="text-xs text-orange-300 font-semibold">
                        Choose Your Fighting Style
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(FIGHTING_STYLES)
                        .filter(([_, style]) => style.availableFor.includes(selectedClassId))
                        .map(([styleId, style]) => {
                          const isSelected = character.fightingStyle === styleId;
                          return (
                            <button
                              key={styleId}
                              onClick={() => updateCharacter('fightingStyle', styleId)}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                isSelected
                                  ? 'bg-orange-500/20 border-orange-500/50'
                                  : 'bg-slate-800/50 border-slate-700/50 hover:border-orange-500/30'
                              }`}
                            >
                              <div className={`font-medium text-sm ${isSelected ? 'text-orange-300' : 'text-slate-200'}`}>
                                {style.name}
                              </div>
                              <div className="text-xs text-slate-400 mt-1 leading-relaxed">{style.description}</div>
                              {isSelected && <Check className="w-4 h-4 text-orange-400 mt-2" />}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* WARLOCK INVOCATIONS */}
                {selectedClassId === 'warlock' && character.level >= 2 && (
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <div className="text-xs text-purple-300 font-semibold">
                          Eldritch Invocations
                        </div>
                      </div>
                      <div className="text-xs text-purple-400">
                        {(character.warlockInvocations || []).length}/2 chosen
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                      {Object.entries(WARLOCK_INVOCATIONS)
                        .filter(([_, inv]) => !inv.levelReq || character.level >= inv.levelReq)
                        .map(([invId, inv]) => {
                          const isSelected = (character.warlockInvocations || []).includes(invId);
                          const canSelect = !isSelected && (character.warlockInvocations || []).length < 2;
                          return (
                            <button
                              key={invId}
                              onClick={() => {
                                const current = character.warlockInvocations || [];
                                if (isSelected) {
                                  updateCharacter('warlockInvocations', current.filter(i => i !== invId));
                                } else if (canSelect) {
                                  updateCharacter('warlockInvocations', [...current, invId]);
                                }
                              }}
                              disabled={!isSelected && !canSelect}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                isSelected
                                  ? 'bg-purple-500/20 border-purple-500/50'
                                  : canSelect
                                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30'
                                  : 'bg-slate-900/50 border-slate-800/30 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <div className={`font-medium text-sm ${isSelected ? 'text-purple-300' : 'text-slate-200'}`}>
                                {inv.name}
                              </div>
                              {inv.prereq && <div className="text-xs text-amber-400 mt-0.5">Req: {inv.prereq}</div>}
                              <div className="text-xs text-slate-400 mt-1 leading-relaxed">{inv.description}</div>
                              {isSelected && <Check className="w-4 h-4 text-purple-400 mt-2" />}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* SORCERER METAMAGIC */}
                {selectedClassId === 'sorcerer' && character.level >= 3 && (
                  <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-pink-400" />
                        <div className="text-xs text-pink-300 font-semibold">
                          Metamagic Options
                        </div>
                      </div>
                      <div className="text-xs text-pink-400">
                        {(character.metamagicOptions || []).length}/2 chosen
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(METAMAGIC_OPTIONS).map(([metaId, meta]) => {
                        const isSelected = (character.metamagicOptions || []).includes(metaId);
                        const canSelect = !isSelected && (character.metamagicOptions || []).length < 2;
                        return (
                          <button
                            key={metaId}
                            onClick={() => {
                              const current = character.metamagicOptions || [];
                              if (isSelected) {
                                updateCharacter('metamagicOptions', current.filter(m => m !== metaId));
                              } else if (canSelect) {
                                updateCharacter('metamagicOptions', [...current, metaId]);
                              }
                            }}
                            disabled={!isSelected && !canSelect}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'bg-pink-500/20 border-pink-500/50'
                                : canSelect
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-pink-500/30'
                                : 'bg-slate-900/50 border-slate-800/30 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className={`font-medium text-sm ${isSelected ? 'text-pink-300' : 'text-slate-200'}`}>
                              {meta.name}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 leading-relaxed">{meta.description}</div>
                            {isSelected && <Check className="w-4 h-4 text-pink-400 mt-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* BATTLE MASTER MANEUVERS */}
                {selectedClassId === 'fighter' && character.subclass === 'battleMaster' && character.level >= 3 && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sword className="w-4 h-4 text-red-400" />
                        <div className="text-xs text-red-300 font-semibold">
                          Combat Maneuvers
                        </div>
                      </div>
                      <div className="text-xs text-red-400">
                        {(character.battleMasterManeuvers || []).length}/3 chosen
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                      {Object.entries(BATTLE_MASTER_MANEUVERS).map(([maneuverId, maneuver]) => {
                        const isSelected = (character.battleMasterManeuvers || []).includes(maneuverId);
                        const canSelect = !isSelected && (character.battleMasterManeuvers || []).length < 3;
                        return (
                          <button
                            key={maneuverId}
                            onClick={() => {
                              const current = character.battleMasterManeuvers || [];
                              if (isSelected) {
                                updateCharacter('battleMasterManeuvers', current.filter(m => m !== maneuverId));
                              } else if (canSelect) {
                                updateCharacter('battleMasterManeuvers', [...current, maneuverId]);
                              }
                            }}
                            disabled={!isSelected && !canSelect}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'bg-red-500/20 border-red-500/50'
                                : canSelect
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-red-500/30'
                                : 'bg-slate-900/50 border-slate-800/30 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className={`font-medium text-sm ${isSelected ? 'text-red-300' : 'text-slate-200'}`}>
                              {maneuver.name}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 leading-relaxed">{maneuver.description}</div>
                            {isSelected && <Check className="w-4 h-4 text-red-400 mt-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* MUSICAL INSTRUMENT - Bard */}
                {selectedClassId === 'bard' && !character.musicalInstrument && (
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Music className="w-4 h-4 text-cyan-400" />
                      <div className="text-xs text-cyan-300 font-semibold">
                        Choose Your Musical Instrument
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {MUSICAL_INSTRUMENTS.map((instrument) => (
                        <button
                          key={instrument}
                          onClick={() => updateCharacter('musicalInstrument', instrument)}
                          className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-cyan-500/30 transition-all text-xs"
                        >
                          {instrument}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedClassId === 'bard' && character.musicalInstrument && (
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-cyan-400" />
                        <div className="text-xs text-cyan-300">
                          Instrument: <span className="font-semibold">{character.musicalInstrument}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => updateCharacter('musicalInstrument', null)}
                        className="text-xs text-slate-400 hover:text-slate-300 underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// RANDOM CHARACTER GENERATOR (SMART)
// ============================================================================

// Generates a random character with synergistic choices
const generateRandomCharacter = (importedName = '', enableMulticlass = false) => {
  // Helper to pick random from array
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  // Step 1: Pick a random class first (determines build strategy)
  const classId = pick(Object.keys(CLASSES));
  const selectedClass = CLASSES[classId];
  
  // Step 2: Pick a synergistic race based on class primary abilities
  const getRacesForClass = (cls) => {
    const primaryAbilities = cls.primaryAbility;
    
    // Define race-ability synergies
    const raceAbilityMap = {
      mountainDwarf: ['strength', 'constitution'],
      hillDwarf: ['constitution', 'wisdom'],
      highElf: ['dexterity', 'intelligence'],
      woodElf: ['dexterity', 'wisdom'],
      darkElf: ['dexterity', 'charisma'],
      lightfootHalfling: ['dexterity', 'charisma'],
      stoutHalfling: ['dexterity', 'constitution'],
      human: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'], // versatile
      variantHuman: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'], // versatile
      dragonborn: ['strength', 'charisma'],
      gnome: ['intelligence', 'constitution'],
      halfElf: ['charisma', 'dexterity'],
      halfOrc: ['strength', 'constitution'],
      tiefling: ['charisma', 'intelligence']
    };
    
    // Find races that boost the class's primary abilities
    return Object.keys(RACES).filter(raceId => {
      const raceAbilities = raceAbilityMap[raceId] || [];
      return primaryAbilities.some(ability => raceAbilities.includes(ability));
    });
  };
  
  const compatibleRaces = getRacesForClass(selectedClass);
  const raceId = compatibleRaces.length > 0 ? pick(compatibleRaces) : pick(Object.keys(RACES));
  const selectedRace = RACES[raceId];
  
  // Step 3: Pick subrace if available
  let subraceId = null;
  if (selectedRace.subraces && selectedRace.subraces.length > 0) {
    subraceId = pick(selectedRace.subraces);
  }
  
  // Step 4: Pick a thematic background
  const getBackgroundsForClass = (cls) => {
    const thematicMap = {
      barbarian: ['outlander', 'folkHero', 'soldier'],
      bard: ['entertainer', 'charlatan', 'noble'],
      cleric: ['acolyte', 'hermit', 'sage'],
      druid: ['hermit', 'outlander', 'sage'],
      fighter: ['soldier', 'folkHero', 'noble'],
      monk: ['hermit', 'outlander', 'urchin'],
      paladin: ['acolyte', 'noble', 'soldier'],
      ranger: ['outlander', 'folkHero', 'sailor'],
      rogue: ['criminal', 'charlatan', 'urchin'],
      sorcerer: ['noble', 'hermit', 'entertainer'],
      warlock: ['charlatan', 'hermit', 'sage'],
      wizard: ['sage', 'hermit', 'acolyte']
    };
    
    return thematicMap[cls.name.toLowerCase()] || Object.keys(BACKGROUNDS);
  };
  
  const compatibleBackgrounds = getBackgroundsForClass(selectedClass);
  const backgroundId = pick(compatibleBackgrounds);
  const selectedBackground = BACKGROUNDS[backgroundId];
  
  // Step 5: Assign ability scores using standard array optimally
  const standardArray = [15, 14, 13, 12, 10, 8];
  const abilityPriority = {
    barbarian: ['strength', 'constitution', 'dexterity', 'wisdom', 'charisma', 'intelligence'],
    bard: ['charisma', 'dexterity', 'constitution', 'wisdom', 'intelligence', 'strength'],
    cleric: ['wisdom', 'constitution', 'strength', 'charisma', 'dexterity', 'intelligence'],
    druid: ['wisdom', 'constitution', 'dexterity', 'intelligence', 'charisma', 'strength'],
    fighter: ['strength', 'constitution', 'dexterity', 'wisdom', 'charisma', 'intelligence'],
    monk: ['dexterity', 'wisdom', 'constitution', 'strength', 'charisma', 'intelligence'],
    paladin: ['strength', 'charisma', 'constitution', 'wisdom', 'dexterity', 'intelligence'],
    ranger: ['dexterity', 'wisdom', 'constitution', 'strength', 'intelligence', 'charisma'],
    rogue: ['dexterity', 'charisma', 'constitution', 'intelligence', 'wisdom', 'strength'],
    sorcerer: ['charisma', 'constitution', 'dexterity', 'wisdom', 'intelligence', 'strength'],
    warlock: ['charisma', 'constitution', 'dexterity', 'wisdom', 'intelligence', 'strength'],
    wizard: ['intelligence', 'constitution', 'dexterity', 'wisdom', 'charisma', 'strength']
  };
  
  const priority = abilityPriority[selectedClass.name.toLowerCase()] || 
    ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  
  const abilities = {};
  priority.forEach((ability, i) => {
    abilities[ability] = standardArray[i];
  });
  
  // Step 6: Variant Human special handling
  let variantHumanChoices = [];
  let variantHumanFeat = null;
  
  if (raceId === 'variantHuman') {
    // Boost the two most important abilities
    variantHumanChoices = [priority[0], priority[1]];
    
    // Pick a feat that synergizes with the class
    const featsByClass = {
      barbarian: ['greatWeaponMaster', 'polearmMaster', 'toughness', 'athlete'],
      bard: ['actor', 'inspiringLeader', 'keenMind', 'skilled'],
      cleric: ['warCaster', 'resilient', 'healer', 'observant'],
      druid: ['warCaster', 'resilient', 'observant', 'alert'],
      fighter: ['greatWeaponMaster', 'sharpshooter', 'polearmMaster', 'sentinel'],
      monk: ['mobile', 'alert', 'athlete', 'observant'],
      paladin: ['greatWeaponMaster', 'polearmMaster', 'inspiringLeader', 'mounted Combatant'],
      ranger: ['sharpshooter', 'crossbowExpert', 'alert', 'observant'],
      rogue: ['crossbowExpert', 'alert', 'mobile', 'skulker'],
      sorcerer: ['warCaster', 'elemental Adept', 'resilient', 'alert'],
      warlock: ['warCaster', 'actor', 'resilient', 'alert'],
      wizard: ['warCaster', 'keenMind', 'resilient', 'observant']
    };
    
    const compatibleFeats = featsByClass[selectedClass.name.toLowerCase()] || ['alert', 'athlete', 'actor', 'toughness'];
    const availableFeats = compatibleFeats.filter(f => FEATS[f]);
    variantHumanFeat = availableFeats.length > 0 ? pick(availableFeats) : pick(Object.keys(FEATS));
  }
  
  // Step 7: Select class skills
  const availableSkills = selectedClass.skillChoices.from === 'any' 
    ? Object.keys(SKILLS) 
    : selectedClass.skillChoices.from
        .map(s => getSkillId(s) || s)
        .filter(Boolean);
  
  const classSkills = [];
  const skillsNeeded = selectedClass.skillChoices.count;
  const shuffled = [...availableSkills].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(skillsNeeded, shuffled.length); i++) {
    classSkills.push(shuffled[i]);
  }
  
  // Step 8: Choose alignment (random but biased toward class archetype)
  const alignmentsByClass = {
    barbarian: ['chaoticGood', 'chaoticNeutral', 'neutralGood'],
    bard: ['chaoticGood', 'neutralGood', 'chaoticNeutral'],
    cleric: ['lawfulGood', 'neutralGood', 'lawfulNeutral'],
    druid: ['neutralGood', 'trueNeutral', 'chaoticGood'],
    fighter: ['lawfulGood', 'lawfulNeutral', 'neutralGood'],
    monk: ['lawfulGood', 'lawfulNeutral', 'trueNeutral'],
    paladin: ['lawfulGood', 'lawfulNeutral'],
    ranger: ['neutralGood', 'chaoticGood', 'trueNeutral'],
    rogue: ['chaoticNeutral', 'neutralGood', 'chaoticGood'],
    sorcerer: ['chaoticGood', 'chaoticNeutral', 'neutralGood'],
    warlock: ['chaoticNeutral', 'neutralEvil', 'chaoticEvil'],
    wizard: ['lawfulNeutral', 'trueNeutral', 'neutralGood']
  };
  
  const possibleAlignments = alignmentsByClass[selectedClass.name.toLowerCase()] || Object.keys(ALIGNMENTS);
  const alignment = pick(possibleAlignments);
  
  // Step 9: Random level (weighted toward low levels)
  const levelWeights = [1, 1, 1, 1, 1, 3, 2, 2, 1, 1]; // More likely to be level 1-5
  const weightedLevels = [];
  levelWeights.forEach((weight, i) => {
    for (let j = 0; j < weight; j++) {
      weightedLevels.push(i + 1);
    }
  });
  const levelPool = enableMulticlass ? weightedLevels.filter(l => l >= 2) : weightedLevels;
  const level = pick(levelPool.length ? levelPool : weightedLevels);
  
  // Step 9.5: Multiclass generation (if enabled and level is high enough)
  let multiclassLevels = [];

  if (enableMulticlass && level >= 2) {
    // When multiclass is explicitly enabled, always multiclass
    // Allocate levels to a secondary class while keeping primary at least level 1.
    const multiclassLevelCount = level >= 10 ? pick([2, 3, 4]) : level >= 5 ? pick([2, 3]) : 1;
    const safeMulticlassCount = Math.min(multiclassLevelCount, Math.max(1, level - 1));
    
    // Pick a synergistic multiclass based on primary abilities
    const getCompatibleMulticlass = (primaryClass) => {
      const synergies = {
        barbarian: ['fighter', 'ranger'],
        bard: ['rogue', 'warlock', 'sorcerer'],
        cleric: ['paladin', 'druid'],
        druid: ['ranger', 'cleric'],
        fighter: ['barbarian', 'paladin', 'ranger'],
        monk: ['rogue', 'ranger'],
        paladin: ['fighter', 'cleric', 'warlock'],
        ranger: ['fighter', 'druid', 'rogue'],
        rogue: ['bard', 'ranger', 'monk'],
        sorcerer: ['warlock', 'bard', 'wizard'],
        warlock: ['sorcerer', 'bard', 'paladin'],
        wizard: ['sorcerer', 'cleric']
      };
      
      const compatible = synergies[primaryClass.toLowerCase()] || [];
      const available = compatible.filter(id => CLASSES[id]);
      return available.length > 0 ? pick(available) : pick(Object.keys(CLASSES).filter(id => id !== classId));
    };
    
    const multiclassId = getCompatibleMulticlass(selectedClass.name);
    const multiclassData = CLASSES[multiclassId];
    
    // Choose a subclass if the multiclass level is high enough
    let multiclassSubclass = null;
    if (safeMulticlassCount >= multiclassData.subclassLevel) {
      const subclasses = SUBCLASSES[multiclassId];
      if (subclasses) {
        multiclassSubclass = pick(Object.keys(subclasses));
      }
    }
    
    multiclassLevels = [{
      classId: multiclassId,
      level: safeMulticlassCount,
      subclass: multiclassSubclass
    }];
  }

  // Step 9.75: Choose a subclass if required at this level
  let subclass = null;
  if (level >= selectedClass.subclassLevel) {
    const subclasses = SUBCLASSES[classId];
    if (subclasses) {
      subclass = pick(Object.keys(subclasses));
    }
  }
  
  // Step 10: Personality traits (if background has them)
  let personalityTraits = [];
  let ideals = null;
  let bonds = null;
  let flaws = null;
  
  if (selectedBackground.personalityTraits) {
    const traits = [...selectedBackground.personalityTraits].sort(() => Math.random() - 0.5);
    personalityTraits = traits.slice(0, 2);
  }
  
  if (selectedBackground.ideals) {
    ideals = pick(selectedBackground.ideals);
  }
  
  if (selectedBackground.bonds) {
    bonds = pick(selectedBackground.bonds);
  }
  
  if (selectedBackground.flaws) {
    flaws = pick(selectedBackground.flaws);
  }
  
  // Step 11: ASI or Feats for milestone levels
  const asiChoices = {};
  const asiLevels = [4, 8, 12, 16, 19].filter(l => l <= level);
  
  asiLevels.forEach(asiLevel => {
    // Decide between ASI and Feat (60% ASI, 40% Feat for variety)
    const chooseASI = Math.random() < 0.6;
    
    if (chooseASI) {
      // Pick top 2 abilities to boost
      const topTwo = priority.slice(0, 2);
      const boostOne = Math.random() < 0.5; // 50% chance to boost one ability by +2 vs two by +1
      
      asiChoices[asiLevel] = {
        type: 'asi',
        ability1: topTwo[0],
        boost1: boostOne ? 2 : 1,
        ability2: boostOne ? null : topTwo[1],
        boost2: boostOne ? 0 : 1
      };
    } else {
      // Pick a feat appropriate for the class
      const featsByClass = {
        barbarian: ['greatWeaponMaster', 'polearmMaster', 'toughness', 'athlete', 'sentinel'],
        bard: ['actor', 'inspiringLeader', 'keenMind', 'skilled', 'warCaster'],
        cleric: ['warCaster', 'resilient', 'healer', 'observant', 'ritual Caster'],
        druid: ['warCaster', 'resilient', 'observant', 'alert', 'sentinel'],
        fighter: ['greatWeaponMaster', 'sharpshooter', 'polearmMaster', 'sentinel', 'crossbowExpert'],
        monk: ['mobile', 'alert', 'athlete', 'observant', 'sentinel'],
        paladin: ['greatWeaponMaster', 'polearmMaster', 'inspiringLeader', 'sentinel', 'mounted Combatant'],
        ranger: ['sharpshooter', 'crossbowExpert', 'alert', 'observant', 'mobile'],
        rogue: ['crossbowExpert', 'alert', 'mobile', 'skulker', 'sentinel'],
        sorcerer: ['warCaster', 'elemental Adept', 'resilient', 'alert', 'metamagic Adept'],
        warlock: ['warCaster', 'actor', 'resilient', 'alert', 'fey Touched'],
        wizard: ['warCaster', 'keenMind', 'resilient', 'observant', 'ritual Caster']
      };
      
      const compatibleFeats = featsByClass[selectedClass.name.toLowerCase()] || ['alert', 'athlete', 'actor', 'toughness'];
      const availableFeats = compatibleFeats.filter(f => FEATS[f]);
      const feat = availableFeats.length > 0 ? pick(availableFeats) : pick(Object.keys(FEATS));
      
      asiChoices[asiLevel] = {
        type: 'feat',
        feat: feat
      };
    }
  });
  
  // Step 12: Replacement skills (to satisfy overlap requirements in Review)
  const replacementSkills = [];
  const skillOverlap = getSkillOverlap(classId, backgroundId);
  if (skillOverlap.length > 0) {
    const availableReplacements = getAvailableReplacementSkills(classId, backgroundId, []);
    const shuffledAvailable = [...availableReplacements].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(skillOverlap.length, shuffledAvailable.length); i++) {
      replacementSkills.push(shuffledAvailable[i][0]);
    }
  }

  // Step 12.5: Language choices (to satisfy language-choice requirements in Review)
  const chosenLanguages = [];
  const raceLanguageChoices = getRaceLanguageChoices(raceId, subraceId);
  const bgLanguageChoices = getBackgroundLanguageChoices(backgroundId);
  const totalLanguageChoices = raceLanguageChoices + bgLanguageChoices;

  if (totalLanguageChoices > 0) {
    const fixedLangNames = getFixedLanguages(raceId, subraceId).map(n => (n || '').toLowerCase());
    const availableLanguageIds = Object.entries(LANGUAGES)
      .filter(([_, lang]) => !fixedLangNames.includes((lang?.name || '').toLowerCase()))
      .map(([id]) => id);

    const shuffledLanguages = [...availableLanguageIds].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(totalLanguageChoices, shuffledLanguages.length); i++) {
      chosenLanguages.push(shuffledLanguages[i]);
    }
  }
  
  // Step 13: Spells for casters
  const spells = [];
  const cantrips = [];
  
  if (selectedClass.spellcasting) {
    const spellAbility = selectedClass.spellcasting.ability;
    const cantripsKnown = selectedClass.spellcasting.cantrips || 0;
    
    // Filter spells by class
    const classSpells = Object.entries(SPELLS).filter(([id, spell]) => 
      spell.classes?.includes(selectedClass.name.toLowerCase())
    );
    
    // Pick cantrips
    const availableCantrips = classSpells.filter(([id, spell]) => spell.level === 0);
    const shuffledCantrips = [...availableCantrips].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(cantripsKnown, shuffledCantrips.length); i++) {
      cantrips.push(shuffledCantrips[i][0]);
    }
    
    // Pick 1st level spells (simplified - just pick a few)
    const available1stLevel = classSpells.filter(([id, spell]) => spell.level === 1);
    const shuffled1st = [...available1stLevel].sort(() => Math.random() - 0.5);
    const spellsToKnow = Math.min(4, shuffled1st.length); // Pick ~4 spells
    
    for (let i = 0; i < spellsToKnow; i++) {
      spells.push(shuffled1st[i][0]);
    }
  }
  
  // Step 14: Class-specific features
  
  // Fighting Style (Fighter, Paladin, Ranger at level 2+)
  let fightingStyle = null;
  if ((classId === 'fighter' || classId === 'paladin' || classId === 'ranger') && level >= 2) {
    const styles = Object.keys(FIGHTING_STYLES);
    fightingStyle = pick(styles);
  }
  
  // Warlock Invocations (level 2+)
  const warlockInvocations = [];
  if (classId === 'warlock' && level >= 2) {
    const numInvocations = level >= 12 ? 6 : level >= 9 ? 5 : level >= 7 ? 4 : level >= 5 ? 3 : 2;
    const availableInvocations = Object.keys(WARLOCK_INVOCATIONS);
    const shuffledInvs = [...availableInvocations].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(numInvocations, shuffledInvs.length); i++) {
      warlockInvocations.push(shuffledInvs[i]);
    }
  }
  
  // Sorcerer Metamagic (level 3+)
  const metamagicOptions = [];
  if (classId === 'sorcerer' && level >= 3) {
    const numOptions = level >= 10 ? 4 : level >= 17 ? 4 : 2;
    const availableMeta = Object.keys(METAMAGIC_OPTIONS);
    const shuffledMeta = [...availableMeta].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(numOptions, shuffledMeta.length); i++) {
      metamagicOptions.push(shuffledMeta[i]);
    }
  }
  
  // Battle Master Maneuvers (if Fighter - randomly assign)
  const battleMasterManeuvers = [];
  if (classId === 'fighter' && level >= 3) {
    // Assume Battle Master archetype for random generation
    const numManeuvers = level >= 15 ? 9 : level >= 10 ? 7 : level >= 7 ? 5 : 3;
    const availableManeuvers = Object.keys(BATTLE_MASTER_MANEUVERS);
    const shuffledManeuvers = [...availableManeuvers].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(numManeuvers, shuffledManeuvers.length); i++) {
      battleMasterManeuvers.push(shuffledManeuvers[i]);
    }
  }
  
  // Musical Instrument (Bard)
  let musicalInstrument = null;
  if (classId === 'bard') {
    const instruments = Object.keys(MUSICAL_INSTRUMENTS);
    musicalInstrument = pick(instruments);
  }
  
  // Step 15: Smart Equipment Selection
  const equipment = [];
  
  // Get class proficiencies
  const classData = CLASSES[classId];
  const weaponProfs = classData?.weaponProficiencies || [];
  const armorProfs = classData?.armorProficiencies || [];
  
  // Check if proficient with weapon/armor
  const hasMartialWeapons = weaponProfs.some(p => p.toLowerCase().includes('martial'));
  const hasHeavyArmor = armorProfs.some(p => p.toLowerCase().includes('all armor') || p.toLowerCase().includes('heavy'));
  
  // Helper to check if item requires proficiency and if character has it
  const checkProficiency = (item) => {
    // Check for conditional items
    if (item.includes('(if proficient)')) {
      const itemName = item.replace('(if proficient)', '').trim();
      
      // Check weapon proficiency
      if (itemName === 'Warhammer') {
        return hasMartialWeapons;
      }
      
      // Check armor proficiency
      if (itemName === 'Chain mail') {
        return hasHeavyArmor;
      }
      
      return false; // Default to not proficient
    }
    return true; // No proficiency check needed
  };
  
  // Helper to make generic equipment specific
  const makeSpecific = (item) => {
    // Complex equipment combinations
    if (item === 'Martial weapon + shield') return pick(['Longsword + shield', 'Battleaxe + shield', 'Warhammer + shield', 'Rapier + shield']);
    if (item === 'Two martial weapons') return pick(['Two longswords', 'Longsword + rapier', 'Two battleaxes', 'Battleaxe + warhammer']);
    if (item === 'Two shortswords') return 'Two shortswords';
    if (item === 'Two simple melee weapons') return pick(['Two clubs', 'Two daggers', 'Club + mace', 'Two maces']);
    if (item === 'Two handaxes') return 'Two handaxes';
    
    // Armor + weapon combos
    if (item === 'Leather armor + longbow + 20 arrows') return 'Leather armor, longbow, 20 arrows';
    if (item === 'Chain mail') return 'Chain mail';
    if (item === 'Scale mail') return 'Scale mail';
    if (item === 'Leather armor') return 'Leather armor';
    
    // Ranged weapon combos
    if (item === 'Light crossbow + 20 bolts') return 'Light crossbow, 20 bolts';
    if (item === 'Shortbow + 20 arrows') return 'Shortbow, 20 arrows';
    if (item === '5 javelins') return '5 javelins';
    if (item === 'Longbow') return 'Longbow';
    if (item === '20 arrows') return '20 arrows';
    
    // Generic weapon types
    if (item === 'Any martial melee weapon') return pick(['Longsword', 'Battleaxe', 'Warhammer', 'Greatsword', 'Maul', 'Rapier']);
    if (item === 'Any martial weapon') return pick(['Longsword', 'Rapier', 'Battleaxe', 'Longbow']);
    if (item === 'Any simple weapon') return pick(['Club', 'Dagger', 'Quarterstaff', 'Mace', 'Javelin', 'Spear']);
    if (item === 'Any simple melee weapon') return pick(['Club', 'Dagger', 'Quarterstaff', 'Mace', 'Spear']);
    if (item === 'Any musical instrument') return pick(['Lute', 'Flute', 'Drum', 'Harp', 'Viol']);
    
    // Keep specific items as-is
    return item;
  };
  
  // Helper to decide random choices from equipment options
  const pickEquipment = (classEquipment) => {
    const items = [];
    
    if (classEquipment.choices) {
      classEquipment.choices.forEach(choice => {
        // Filter options to only those the character is proficient with
        const validOptions = choice.options.filter(checkProficiency);
        
        if (validOptions.length > 0) {
          const selectedOption = makeSpecific(pick(validOptions));
          items.push(selectedOption);
        } else {
          // Fallback to first option without proficiency check if no valid options
          const selectedOption = makeSpecific(choice.options[0].replace('(if proficient)', '').trim());
          items.push(selectedOption);
        }
      });
    }
    
    if (classEquipment.fixed) {
      // Apply makeSpecific to fixed items too
      const fixedItems = classEquipment.fixed.map(item => makeSpecific(item));
      items.push(...fixedItems);
    }
    
    return items;
  };
  
  // Primary class equipment
  const primaryClassEquipment = STARTING_EQUIPMENT[classId];
  if (primaryClassEquipment) {
    equipment.push(...pickEquipment(primaryClassEquipment));
  }
  
  // If multiclassed, potentially add some equipment from secondary class
  if (multiclassLevels.length > 0) {
    const secondaryClassId = multiclassLevels[0].classId;
    const secondaryClassEquipment = STARTING_EQUIPMENT[secondaryClassId];
    
    if (secondaryClassEquipment) {
      // 50% chance to add weapon/armor from secondary class (to represent versatility)
      if (Math.random() < 0.5) {
        // Pick one random choice from secondary class
        if (secondaryClassEquipment.choices && secondaryClassEquipment.choices.length > 0) {
          const randomChoice = pick(secondaryClassEquipment.choices);
          const selectedOption = makeSpecific(pick(randomChoice.options));
          
          // Avoid duplicates
          if (!equipment.includes(selectedOption)) {
            equipment.push(selectedOption);
          }
        }
      }
    }
  }
  
  // Add background equipment
  if (selectedBackground.equipment) {
    equipment.push(...selectedBackground.equipment);
  }
  
  // Roll starting gold
  const goldDice = STARTING_GOLD[classId];
  let startingGold = 0;
  if (goldDice) {
    for (let i = 0; i < goldDice.dice; i++) {
      startingGold += Math.floor(Math.random() * goldDice.sides) + 1;
    }
    startingGold *= goldDice.multiplier;
  }
  
  // Random Physical Characteristics
  const ages = ['18', '25', '30', '45', '60', '120', '200'];
  const heights = ['4\'10"', '5\'2"', '5\'6"', '5\'10"', '6\'0"', '6\'4"'];
  const weights = ['100 lbs', '130 lbs', '160 lbs', '180 lbs', '200 lbs', '240 lbs'];
  const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Amber', 'Gray', 'Violet'];
  const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'White', 'Silver', 'Auburn'];
  const skinTones = ['Pale', 'Fair', 'Light', 'Olive', 'Tan', 'Brown', 'Dark'];
  
  const physicalCharacteristics = {
    age: pick(ages),
    height: pick(heights),
    weight: pick(weights),
    eyes: pick(eyeColors),
    hair: pick(hairColors),
    skin: pick(skinTones)
  };
  
  // Return the generated character
  return {
    name: importedName || `Random ${selectedRace.name}`,
    playerName: '',
    race: raceId,
    subrace: subraceId,
    class: classId,
    subclass: subclass,
    background: backgroundId,
    alignment: alignment,
    level: level,
    multiclass: multiclassLevels,
    abilities: abilities,
    abilityMethod: 'standard',
    chosenLanguages: chosenLanguages,
    replacementSkills: replacementSkills,
    classSkills: classSkills,
    personalityTraits: personalityTraits,
    ideals: ideals,
    bonds: bonds,
    flaws: flaws,
    fightingStyle: fightingStyle,
    warlockInvocations: warlockInvocations,
    metamagicOptions: metamagicOptions,
    battleMasterManeuvers: battleMasterManeuvers,
    musicalInstrument: musicalInstrument,
    physicalCharacteristics: physicalCharacteristics,
    skills: [],
    equipment: equipment,
    gold: startingGold,
    spells: spells,
    cantrips: cantrips,
    traits: [],
    variantHumanChoices: variantHumanChoices,
    variantHumanFeat: variantHumanFeat,
    asiChoices: asiChoices,
    proficiencies: {
      armor: [],
      weapons: [],
      tools: [],
      languages: [],
      savingThrows: [],
      skills: []
    }
  };
};

// ============================================================================
// CHARACTER CREATOR COMPONENT (SKELETON)
// ============================================================================

const CharacterCreator = ({ 
  theme, 
  importedName, 
  setImportedName,
  onGoToGenerator 
}) => {
  const currentTheme = themeConfig[theme] || themeConfig.mixed;
  const [currentStep, setCurrentStep] = useState(0);
  const stepContentRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to top when step changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Scroll to character creator on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const [character, setCharacter] = useState({
    name: importedName || '',
    playerName: '',
    race: null,
    subrace: null,
    class: null,
    subclass: null,
    background: null,
    alignment: null,
    level: 1,
    // Multi-classing support
    multiclass: [], // Array of {classId, level, subclass} for additional classes
    
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    abilityMethod: null, // 'standard', 'pointbuy', 'roll', 'manual'
    chosenLanguages: [], // Languages chosen by player (not automatic ones)
    replacementSkills: [], // Skills chosen to replace overlapping background/class skills
    classSkills: [], // Skills chosen from class skill list
    personalityTraits: [], // Up to 2 personality traits
    ideals: null, // One ideal
    bonds: null, // One bond
    flaws: null, // One flaw
    
    // Class-specific choices
    fightingStyle: null, // Fighting style for Fighter/Paladin/Ranger
    warlockInvocations: [], // Warlock invocations (2 at level 2+)
    metamagicOptions: [], // Sorcerer metamagic (2 at level 3+)
    battleMasterManeuvers: [], // Battle Master maneuvers (3 at level 3+)
    musicalInstrument: null, // Bard's chosen instrument
    chosenTools: [], // Tools chosen from background options
    
    // Physical characteristics
    physicalCharacteristics: {
      age: '',
      height: '',
      weight: '',
      eyes: '',
      hair: '',
      skin: ''
    },
    
    skills: [],
    equipment: [],
    cantrips: [],
    spells: [],
    traits: [],
    proficiencies: {
      armor: [],
      weapons: [],
      tools: [],
      languages: [],
      savingThrows: [],
      skills: []
    }
  });

  // Update character name when importedName changes
  useEffect(() => {
    if (importedName) {
      setCharacter(prev => ({ ...prev, name: importedName }));
    }
  }, [importedName]);

  const steps = [
    { id: 'basics', label: 'Basics', icon: User },
    { id: 'race', label: 'Race', icon: User },
    { id: 'class', label: 'Class', icon: Sword },
    { id: 'abilities', label: 'Abilities', icon: Zap },
    { id: 'asi', label: 'ASI/Feats', icon: Star },
    { id: 'background', label: 'Background', icon: Scroll },
    { id: 'equipment', label: 'Equipment', icon: Sword },
    { id: 'spells', label: 'Spells', icon: Sparkles },
    { id: 'review', label: 'Review', icon: Check }
  ];

  const updateCharacter = (key, value) => {
    setCharacter(prev => {
      const updated = { ...prev, [key]: value };
      
      // Reset dependent choices when race changes
      if (key === 'race') {
        updated.subrace = null;
        updated.chosenLanguages = [];
      }
      
      // Reset subrace languages too
      if (key === 'subrace') {
        updated.chosenLanguages = [];
      }
      
      // Reset skill replacements when class changes
      if (key === 'class') {
        updated.replacementSkills = [];
      }
      
      // Reset both languages and skill replacements when background changes
      if (key === 'background') {
        updated.chosenLanguages = [];
        updated.replacementSkills = [];
      }
      
      return updated;
    });
  };

  // One-level undo snapshot for randomize on Review step
  const [lastRandomSnapshot, setLastRandomSnapshot] = useState(null);
  const [randomWithMulticlass, setRandomWithMulticlass] = useState(false);

  const randomizeFromReview = () => {
    const prev = character;
    const randomChar = generateRandomCharacter(importedName, randomWithMulticlass);
    setLastRandomSnapshot(prev);
    setCharacter(randomChar);
  };

  const undoRandomizeFromReview = () => {
    if (lastRandomSnapshot) {
      setCharacter(lastRandomSnapshot);
      setLastRandomSnapshot(null);
    }
  };

  // Validate step completion
  const validateStep = (stepId) => {
    switch (stepId) {
      case 'basics':
        return !!character.name && character.level >= 1;
      case 'race':
        return !!character.race;
      case 'class':
        const classData = character.class ? CLASSES[character.class] : null;
        const subclassRequired = classData && character.level >= classData.subclassLevel;
        return !!character.class && (!subclassRequired || !!character.subclass);
      case 'abilities':
        return Object.values(character.abilities).some(v => v !== 10);
      case 'asi':
        return true; // ASI/Feats step is optional
      case 'background':
        return !!character.background;
      case 'equipment':
        return true; // Equipment is optional for now
      case 'spells':
        return true; // Spells validated separately for spellcasters
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <div ref={containerRef} className="space-y-4 md:space-y-6 overflow-x-hidden">
      {/* Step Progress Bar */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 border border-slate-800/50 relative z-10">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
            <span className="md:hidden">5e CC</span>
            <span className="hidden md:inline">5e-Compatible Character Creator</span>
          </h2>
          <span className="text-xs md:text-sm text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        {/* Mobile: Compact Progress Dots + Current Step Name */}
        <div className="md:hidden relative z-20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isComplete = validateStep(step.id) && index < currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      isActive
                        ? 'bg-indigo-500 scale-125 ring-2 ring-indigo-400/50'
                        : isComplete
                          ? 'bg-green-500'
                          : 'bg-slate-600'
                    }`}
                    aria-label={step.label}
                  />
                );
              })}
            </div>
            <span className="text-sm text-indigo-300 font-medium">
              {steps[currentStep]?.label}
            </span>
          </div>
          
          {/* Prev/Next Navigation Buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm font-medium text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="flex-1 px-4 py-2.5 bg-indigo-500/20 border border-indigo-500/50 rounded-lg text-sm font-medium text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500/30 transition-all flex items-center justify-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* Mobile Step Selector Dropdown */}
          <select
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 relative z-50"
          >
            <option disabled>5e-Compatible Character Creator</option>
            {steps.map((step, index) => {
              const isComplete = validateStep(step.id) && index < currentStep;
              return (
                <option key={step.id} value={index}>
                  {index + 1}. {step.label} {isComplete ? '✓' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Desktop: Full Progress Steps */}
        <div className="hidden md:flex items-center gap-1">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = validateStep(step.id) && index < currentStep;
            
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                      : isComplete
                        ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                        : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {isComplete ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                  {step.label}
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-4 h-0.5 ${isComplete ? 'bg-green-500/50' : 'bg-slate-700'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div ref={stepContentRef} className="bg-slate-900/50 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-800/50 min-h-[400px] md:min-h-[500px] overflow-x-hidden">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Basic Information</h3>
              <div className="flex flex-col items-end gap-2">
                <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-slate-300 cursor-pointer hover:bg-slate-700/50 transition-all">
                  <input
                    type="checkbox"
                    checked={randomWithMulticlass}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setRandomWithMulticlass(checked);
                      if (checked && (character.level || 1) < 2) {
                        updateCharacter('level', 2);
                      }
                    }}
                    className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span>Multiclass (Random)</span>
                </label>
                <button
                  onClick={() => {
                    const randomChar = generateRandomCharacter(importedName, randomWithMulticlass);
                    setCharacter(randomChar);
                    // Jump to review step (last step)
                    setCurrentStep(steps.length - 1);
                  }}
                  className="px-4 py-2.5 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 text-sm md:text-base"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Random Character</span>
                  <span className="sm:hidden">Random</span>
                </button>
              </div>
            </div>
            
            {/* Character Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Character Name
              </label>
              <input
                type="text"
                value={character.name}
                onChange={(e) => updateCharacter('name', e.target.value)}
                placeholder="Enter character name..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3.5 md:py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-base"
              />
              {importedName ? (
                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Imported from Name Generator
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-2">
                  Need a name? Use the{' '}
                  <button 
                    onClick={onGoToGenerator} 
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Name Generator
                  </button>
                  {' '}to create one!
                </p>
              )}
            </div>

            {/* Player Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Player Name
              </label>
              <input
                type="text"
                value={character.playerName}
                onChange={(e) => updateCharacter('playerName', e.target.value)}
                placeholder="Your name..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3.5 md:py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-base"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Character Level (Total)
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                  <button
                    key={level}
                    onClick={() => updateCharacter('level', level)}
                    className={`py-2.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-all border ${
                      character.level === level
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                This is your total character level. If you multiclass, levels are split across classes (e.g., Level 5 total = Barbarian 3 / Warlock 2). Levels 4 and 8 grant Ability Score Improvements or Feats.
              </p>
            </div>

            {/* Alignment */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Alignment
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {Object.entries(ALIGNMENTS).map(([key, alignment]) => (
                  <button
                    key={key}
                    onClick={() => updateCharacter('alignment', key)}
                    className={`p-3 md:p-4 rounded-lg border text-left transition-all ${
                      character.alignment === key
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-sm md:text-base">{alignment.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{alignment.short}</div>
                    <div className="text-xs text-slate-500 mt-2 leading-relaxed">{alignment.description}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Alignment represents your character's moral and ethical outlook. It affects roleplay but has minimal mechanical impact in 5e.
              </p>
            </div>

            {/* Physical Characteristics */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Physical Characteristics <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Age</label>
                  <input
                    type="text"
                    value={character.physicalCharacteristics?.age || ''}
                    onChange={(e) => updateCharacter('physicalCharacteristics', { ...character.physicalCharacteristics, age: e.target.value })}
                    placeholder="e.g., 25"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Height</label>
                  <input
                    type="text"
                    value={character.physicalCharacteristics?.height || ''}
                    onChange={(e) => updateCharacter('physicalCharacteristics', { ...character.physicalCharacteristics, height: e.target.value })}
                    placeholder="e.g., 5'10&quot;"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Weight</label>
                  <input
                    type="text"
                    value={character.physicalCharacteristics?.weight || ''}
                    onChange={(e) => updateCharacter('physicalCharacteristics', { ...character.physicalCharacteristics, weight: e.target.value })}
                    placeholder="e.g., 180 lbs"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Eyes</label>
                  <input
                    type="text"
                    value={character.physicalCharacteristics?.eyes || ''}
                    onChange={(e) => updateCharacter('physicalCharacteristics', { ...character.physicalCharacteristics, eyes: e.target.value })}
                    placeholder="e.g., Blue"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Hair</label>
                  <input
                    type="text"
                    value={character.physicalCharacteristics?.hair || ''}
                    onChange={(e) => updateCharacter('physicalCharacteristics', { ...character.physicalCharacteristics, hair: e.target.value })}
                    placeholder="e.g., Brown"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Skin</label>
                  <input
                    type="text"
                    value={character.physicalCharacteristics?.skin || ''}
                    onChange={(e) => updateCharacter('physicalCharacteristics', { ...character.physicalCharacteristics, skin: e.target.value })}
                    placeholder="e.g., Fair"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-sm"
                  />
                </div>
              </div>
            </div>

            
          </div>
        )}

        {currentStep === 1 && (
          <RaceSelectionStep 
            character={character}
            updateCharacter={updateCharacter}
          />
        )}

        {currentStep === 2 && (
          <ClassSelectionStep 
            character={character}
            updateCharacter={updateCharacter}
            randomWithMulticlass={randomWithMulticlass}
            setRandomWithMulticlass={setRandomWithMulticlass}
          />
        )}

        {currentStep === 3 && (
          <AbilityScoreStep 
            character={character}
            updateCharacter={updateCharacter}
          />
        )}

        {currentStep === 4 && (
          <ASIFeatsStep 
            character={character}
            updateCharacter={updateCharacter}
          />
        )}

        {currentStep === 5 && (
          <BackgroundSelectionStep 
            character={character}
            updateCharacter={updateCharacter}
          />
        )}

        {currentStep === 6 && (
          <EquipmentSelectionStep 
            character={character}
            updateCharacter={updateCharacter}
          />
        )}

        {currentStep === 7 && (
          <SpellSelectionStep 
            character={character}
            updateCharacter={updateCharacter}
          />
        )}

        {currentStep === 8 && (
          <ReviewStep 
            character={character} 
            updateCharacter={updateCharacter} 
            onRandomize={randomizeFromReview}
            onUndo={undoRandomizeFromReview}
            canUndo={!!lastRandomSnapshot}
            randomWithMulticlass={randomWithMulticlass}
            setRandomWithMulticlass={setRandomWithMulticlass}
            onGoToStep={setCurrentStep}
          />
        )}
      </div>

      {/* Character Creator Quick Guide */}
      <details className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-lg md:rounded-xl mb-4">
        <summary className="flex items-center justify-between p-2.5 md:p-4 cursor-pointer list-none">
          <span className="font-semibold text-indigo-400 flex items-center gap-2 text-sm md:text-base">
            <HelpCircle className="w-4 h-4 md:w-5 md:h-5" /> Character Creator Guide
          </span>
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="px-4 pb-4 text-sm text-slate-400 space-y-3">
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">Building Your Character</h4>
            <p>Work through each step to create a complete D&D 5th Edition character. You can jump between steps using the progress bar or Previous/Next buttons above.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">Steps Overview</h4>
            <ul className="space-y-1 ml-4 text-xs">
              <li><span className="text-indigo-400">Basics</span> — Name, player name, starting level (1-20). Higher levels grant ASI/Feats.</li>
              <li><span className="text-purple-400">Race</span> — Choose race and subrace for ability bonuses, languages, and traits</li>
              <li><span className="text-pink-400">Class</span> — Your character's profession, hit dice, proficiencies, and starting equipment</li>
              <li><span className="text-amber-400">Abilities</span> — Set your six ability scores using Standard Array, Point Buy, Roll 4d6, or Manual Entry</li>
              <li><span className="text-emerald-400">Background</span> — Your character's history, skill proficiencies, and starting equipment</li>
              <li><span className="text-cyan-400">Equipment</span> — Choose starting gear from your class and background, or roll for gold</li>
              <li><span className="text-violet-400">Spells</span> — Select cantrips and prepared spells (if your class uses magic)</li>
              <li><span className="text-green-400">Review</span> — See final stats, choose ASI/Feats (levels 4+), and export your character</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">Ability Score Methods</h4>
            <ul className="space-y-1 ml-4 text-xs">
              <li><span className="text-amber-400">Standard Array</span> — Assign 15, 14, 13, 12, 10, 8 to abilities. Great for balanced builds.</li>
              <li><span className="text-amber-400">Point Buy</span> — Spend 27 points to customize (8-15 range). Most flexible method.</li>
              <li><span className="text-amber-400">Roll 4d6</span> — Roll 4 six-sided dice, drop lowest. Classic but random method.</li>
              <li><span className="text-amber-400">Auto-Assign</span> — Click the sparkle button to optimally assign scores based on your class's primary abilities and saving throws!</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">Ability Score Badges</h4>
            <ul className="space-y-1 ml-4 text-xs">
              <li><span className="text-amber-400">PRIMARY</span> (or <span className="text-amber-400">1°</span> on mobile) — Your class's most important ability for attacks/spells</li>
              <li><span className="text-green-400">SAVE</span> (or <span className="text-green-400">✓</span> on mobile) — Proficient saving throw for your class</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 mb-1">Tips</h4>
            <ul className="space-y-1 ml-4 text-xs">
              <li>Use the <span className="text-indigo-400">Name Generator</span> (top navigation) to create authentic fantasy names</li>
              <li>At higher levels, choose <span className="text-purple-400">ASI</span> (+2 to one ability or +1 to two) or a <span className="text-purple-400">Feat</span> for special abilities</li>
              <li>Final ability scores include racial bonuses, variant human bonuses, and ASI increases (capped at 20)</li>
              <li>Check the <span className="text-green-400">Review</span> step to ensure you've selected all required skills, languages, and spells</li>
              <li>Export as formatted text or JSON to import into virtual tabletops or character sheets</li>
            </ul>
          </div>
        </div>
      </details>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-3 pb-20 md:pb-0">
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className={`px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-medium transition-all text-sm md:text-base ${
            currentStep === 0
              ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 border border-slate-600/50'
          }`}
        >
          ← Back
        </button>
        
        <button
          onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
          disabled={currentStep === steps.length - 1}
          className={`px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-medium transition-all text-sm md:text-base ${
            currentStep === steps.length - 1
              ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AetherNames() {
  // Page navigation state
  const [currentPage, setCurrentPage] = useState('generator');
  const [characterImportName, setCharacterImportName] = useState('');

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
  // Removed old refine selections - flask now instantly generates variations
  const [showInstructions, setShowInstructions] = useState(false);
  const resultsRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);

  // Load favorites and history from localStorage on mount
  useEffect(() => {
    const savedFavorites = LocalStorageUtil.getItem(STORAGE_KEYS.FAVORITES, []);
    const savedHistory = LocalStorageUtil.getItem(STORAGE_KEYS.HISTORY, []);
    
    if (savedFavorites && Array.isArray(savedFavorites)) {
      setFavorites(savedFavorites);
    }
    
    if (savedHistory && Array.isArray(savedHistory) && savedHistory.length > 0) {
      setNameHistory(savedHistory);
      setHistoryIndex(savedHistory.length - 1);
      // Optionally restore the last generation
      const lastGeneration = savedHistory[savedHistory.length - 1];
      if (lastGeneration && Array.isArray(lastGeneration)) {
        setGeneratedNames(lastGeneration);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length > 0 || LocalStorageUtil.getItem(STORAGE_KEYS.FAVORITES)) {
      LocalStorageUtil.setItem(STORAGE_KEYS.FAVORITES, favorites);
    }
  }, [favorites]);

  // Save history to localStorage whenever it changes (debounced)
  useEffect(() => {
    if (nameHistory.length > 0) {
      const timeoutId = setTimeout(() => {
        LocalStorageUtil.setItem(STORAGE_KEYS.HISTORY, nameHistory);
      }, 500); // Debounce to avoid excessive writes
      return () => clearTimeout(timeoutId);
    }
  }, [nameHistory]);

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

  const clearFavorites = () => {
    setFavorites([]);
    LocalStorageUtil.removeItem(STORAGE_KEYS.FAVORITES);
  };

  const isFavorite = (name) => favorites.some(f => f.name === name);

  const exportFavorites = () => {
    const blob = new Blob([favorites.map(f => f.name).join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'aethernames.txt';
    a.click();
  };

  // Explode a name into variations (flask button)
  const explodeNameVariations = useCallback((nameObj) => {
    if (!nameObj.metadata) return;
    
    const metadata = nameObj.metadata;
    const regions = metadata.allRegions || [metadata.selectedRegion];
    const primaryRegion = regions[0];
    const lang = linguisticData[primaryRegion] || linguisticData.neutral;
    const tone = metadata.tones?.[0] ? toneModifiers[metadata.tones[0]] : null;
    
    // Get the parts of this name
    const getParts = () => {
      const name = nameObj.name;
      const hasSpaces = name.includes(' ');
      
      if (hasSpaces) {
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
      } else if (metadata?.method === 'type-elements' && metadata.elements?.start) {
        return [
          { id: 'type-start', text: metadata.elements.start, type: 'type-prefix', region: metadata?.selectedRegion },
          { id: 'type-end', text: metadata.elements.end, type: 'type-suffix', region: metadata?.selectedRegion }
        ];
      } else {
        const syllables = breakIntoSyllables(name);
        return syllables.map((s, i) => ({
          id: `auto-${i}`,
          text: s,
          type: 'syllable',
          region: metadata?.selectedRegion || 'neutral'
        }));
      }
    };
    
    const originalParts = getParts();
    const variations = [];
    
    // Add original at the top
    variations.push({ ...nameObj, id: Date.now() + Math.random() });
    
    // Generate variations by changing each part
    originalParts.forEach((part, partIndex) => {
      if (part.isTitle) return; // Don't vary "The"
      
      // Generate 2-3 variations for each part
      const numVariations = Math.min(3, Math.max(2, Math.floor(8 / originalParts.length)));
      
      for (let v = 0; v < numVariations; v++) {
        const newParts = originalParts.map((p, i) => {
          if (i !== partIndex) return p;
          
          // Generate new text for this part
          const partRegion = p.region || primaryRegion;
          const partLang = linguisticData[partRegion] || lang;
          
          if (p.type === 'type-prefix') {
            const nameType = metadata.nameType || 'location';
            const typeElems = nameTypeElements[nameType] || nameTypeElements.location;
            if (typeElems.prefixes?.length > 0) {
              const available = typeElems.prefixes.filter(x => x !== p.text);
              const newText = available[Math.floor(Math.random() * available.length)] || p.text;
              return { ...p, text: newText };
            }
          }
          
          if (p.type === 'type-suffix') {
            const nameType = metadata.nameType || 'location';
            const typeElems = nameTypeElements[nameType] || nameTypeElements.location;
            if (typeElems.suffixes?.length > 0) {
              const available = typeElems.suffixes.filter(x => x !== p.text);
              const newText = available[Math.floor(Math.random() * available.length)] || p.text;
              return { ...p, text: newText };
            }
          }
          
          if (p.type === 'word') {
            const nameType = metadata.nameType || 'location';
            const typeElems = nameTypeElements[nameType] || nameTypeElements.location;
            const isFirst = partIndex === 0 || (originalParts[0]?.isTitle && partIndex === 1);
            
            if (isFirst && typeElems.prefixes?.length > 0) {
              const available = typeElems.prefixes.filter(x => x.toLowerCase() !== p.text.toLowerCase());
              const newText = available[Math.floor(Math.random() * available.length)] || p.text;
              return { ...p, text: newText };
            } else if (typeElems.suffixes?.length > 0) {
              const available = typeElems.suffixes.filter(x => x.toLowerCase() !== p.text.toLowerCase());
              const newText = available[Math.floor(Math.random() * available.length)] || p.text;
              return { ...p, text: newText };
            }
          }
          
          if (p.type === 'element') {
            const isStart = p.id.includes('start') || partIndex === 0;
            if (isStart && partLang.elements?.starts) {
              const available = partLang.elements.starts.filter(x => x !== p.text);
              const newText = available[Math.floor(Math.random() * available.length)] || p.text;
              return { ...p, text: newText };
            } else if (partLang.elements?.ends) {
              const available = partLang.elements.ends.filter(x => x !== p.text);
              const newText = available[Math.floor(Math.random() * available.length)] || p.text;
              return { ...p, text: newText };
            }
          }
          
          // Syllable - generate new one
          const pattern = weightedRandom(partLang.patterns.map(x => x.type), partLang.patterns.map(x => x.weight));
          const newSyllable = generateSyllable(partLang, pattern, tone);
          return { ...p, text: newSyllable };
        });
        
        // Build the new name
        let newName;
        const hasWordParts = newParts.some(p => p.type === 'word');
        const hasTypeParts = newParts.some(p => p.type === 'type-prefix' || p.type === 'type-suffix');
        
        if (hasWordParts) {
          newName = newParts.map(p => p.isTitle ? p.text : capitalize(p.text.toLowerCase())).join(' ');
        } else if (hasTypeParts) {
          const hadSpaces = nameObj.name.includes(' ');
          const hadThe = nameObj.name.toLowerCase().startsWith('the ');
          
          if (hadThe) {
            newName = 'The ' + capitalize(newParts[0].text) + ' ' + capitalize(newParts[1]?.text || '');
          } else if (hadSpaces) {
            newName = newParts.map(p => capitalize(p.text)).join(' ');
          } else {
            newName = capitalize(newParts[0].text) + (newParts[1]?.text.toLowerCase() || '');
          }
        } else {
          newName = newParts.map(p => p.text).join('');
          newName = cleanConsonantClusters(newName, primaryRegion);
          newName = capitalize(newName.toLowerCase());
        }
        
        // Skip if duplicate
        if (variations.some(v => v.name.toLowerCase() === newName.toLowerCase())) continue;
        
        // Build metadata for variation
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
        } else if (metadata.method === 'type-elements') {
          newMetadata.elements = {
            start: newParts[0]?.text,
            end: newParts[1]?.text
          };
        }
        
        variations.push({
          id: Date.now() + Math.random(),
          name: newName,
          syllables: countSyllables(newName),
          gender: classifyGender(newName),
          metadata: newMetadata
        });
      }
    });
    
    // Update generated names with variations
    setGeneratedNames(variations.slice(0, config.nameCount));
    
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [config.nameCount]);

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
    <div className={`min-h-screen text-slate-100 relative ${config.genre === 'fantasy' ? 'font-medium' : ''}`} style={{ fontFamily: currentTheme.font }}>
      <AnimatedBackground theme={config.genre} />
      
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 pb-32">
        {/* Header */}
        <header className={`relative z-50 text-center py-8 mb-8 transition-all duration-1000 ${animateHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {/* Navigation */}
          <div className="flex justify-center mb-6">
            <Navigation 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              theme={config.genre}
            />
          </div>

          {currentPage === 'generator' && (
          <>
          <div className="inline-flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
            <div className="relative w-14 h-14 md:w-28 md:h-28 flex-shrink-0">
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
            <h1 className="text-2xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              AetherNames
            </h1>
          </div>
          
          <p className="text-slate-400 text-sm md:text-lg font-light mb-2 md:mb-4">Linguistically Authentic Fantasy & Sci-Fi Name Forge</p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-slate-900/80 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 mb-2 md:mb-4 backdrop-blur-md">
            <Cpu className="w-3 h-3 md:w-4 md:h-4 text-indigo-400" />
            <span className="text-xs md:text-sm font-medium text-slate-300">
              <span className="text-indigo-400 font-bold">No AI / LLMs.</span> 100% algorithmic phonotactics.
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-3 md:mb-6">
            {['Phonotactically Accurate', 'Cross-Linguistic', 'Customizable'].map((tag, i) => (
              <span key={i} className="px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm font-medium bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400">
                {tag}
              </span>
            ))}
          </div>

          {/* Main Action Buttons - Side by Side on Mobile */}
          <div className="flex gap-2 md:gap-3 justify-center mb-3 md:mb-4">
            <GlowButton onClick={generate} disabled={isGenerating} className="flex-1 max-w-[180px] md:max-w-none md:flex-none md:px-8" theme={config.genre}>
              <Sparkles className={`w-4 h-4 md:w-5 md:h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isGenerating ? 'Forging...' : 'Generate Names'}</span>
              <span className="sm:hidden">{isGenerating ? 'Forging...' : 'Generate'}</span>
            </GlowButton>
            <GlowButton variant="secondary" onClick={surpriseMe} className="flex-1 max-w-[180px] md:max-w-none md:flex-none md:px-6" theme={config.genre}>
              <Zap className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Surprise Me</span>
              <span className="sm:hidden">Surprise</span>
            </GlowButton>
          </div>
          
          {/* Support Button - Smaller on Mobile */}
          <div className="flex justify-center mb-2">
            <GlowButton variant="donate" onClick={openDonation} className="px-4 py-2 md:px-8 md:py-3 text-sm md:text-base" theme={config.genre}>
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Support the Creator</span>
              <span className="sm:hidden">Support</span>
            </GlowButton>
          </div>

          {/* Quick Guide Dropdown */}
          <div className="mt-2 md:mt-4 max-w-2xl mx-auto">
            <details className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-lg md:rounded-xl">
              <summary className="flex items-center justify-between p-2.5 md:p-4 cursor-pointer list-none">
                <span className="font-semibold text-indigo-400 flex items-center gap-2 text-sm md:text-base">
                  <HelpCircle className="w-4 h-4 md:w-5 md:h-5" /> Quick Guide
                </span>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-400 space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Getting Started</h4>
                  <p>Choose your settings on the left panel, then click "Generate Names" (or press Ctrl+Enter). Each name is built using authentic linguistic rules from the regions you select.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Key Settings</h4>
                  <ul className="space-y-1 ml-4 text-xs">
                    <li><span className="text-purple-400">Name Type</span> — Character, location, faction, or item names. Each has unique generation patterns.</li>
                    <li><span className="text-teal-400">Linguistic Influence</span> — The language family that shapes sound (Celtic, Norse, Arabic, etc.). Select up to 4 for blended results.</li>
                    <li><span className="text-pink-400">Tone</span> — Emotional flavor. "Dark" uses harsh sounds, "Noble" uses elegant flows, "Mystical" adds arcane touches.</li>
                    <li><span className="text-emerald-400">Time Period</span> — Era-appropriate styling. Medieval adds titles ("Ser", "Lord"), Futuristic adds tech elements ("Neo-", "-tech").</li>
                    <li><span className="text-amber-400">Gender Lean</span> — Filters by masculine/feminine sound patterns based on linguistic endings.</li>
                    <li><span className="text-cyan-400">Name Style</span> — Formatting control for non-character names (OneWord, Two Words, or The Article Prefix).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Name Card Actions</h4>
                  <ul className="space-y-1 ml-4 text-xs">
                    <li><Star className="w-3.5 h-3.5 inline text-yellow-400" /> <span className="text-yellow-400">Star</span> — Add to favorites. Saved at the bottom, can be exported in multiple formats.</li>
                    <li><FlaskConical className="w-3.5 h-3.5 inline text-teal-400" /> <span className="text-teal-400">Flask</span> — Explode into variations. Generates 6 similar names by modifying patterns.</li>
                    <li><Volume2 className="w-3.5 h-3.5 inline text-cyan-400" /> <span className="text-cyan-400">Speaker</span> — Text-to-speech pronunciation. Hear how the name sounds.</li>
                    <li><Glasses className="w-3.5 h-3.5 inline text-amber-400" /> <span className="text-amber-400">Glasses</span> — View generation metadata (patterns, influences, syllable breakdown).</li>
                    <li><RefreshCw className="w-3.5 h-3.5 inline text-purple-400" /> <span className="text-purple-400">Refresh</span> — Reroll specific syllables while keeping parts you like.</li>
                    <li><User className="w-3.5 h-3.5 inline text-indigo-400" /> <span className="text-indigo-400">Person</span> — Send to Character Creator to build a full 5e-compatible character.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Advanced Features</h4>
                  <ul className="space-y-1 ml-4 text-xs">
                    <li><span className="text-purple-400">Randomize Button</span> — Instantly generates a random name with current settings. Great for quick inspiration!</li>
                    <li><span className="text-pink-400">Surprise Me</span> — Randomizes ALL unlocked settings and generates new names. Pure chaos mode!</li>
                    <li><span className="text-amber-400">Lock Icons (🔒)</span> — Lock any setting to keep it fixed when using "Surprise Me". Perfect for maintaining specific vibes.</li>
                    <li><span className="text-teal-400">Refine Feature</span> — Found names you almost like? Click "Refine" to analyze patterns and generate intelligent variations.</li>
                    <li><span className="text-emerald-400">Copy Format</span> — Export favorites as plain text, bullets, numbered list, or comma-separated for easy pasting.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Pro Tips</h4>
                  <ul className="space-y-1 ml-4 text-xs">
                    <li>Combine multiple tones for unique blends ("Noble" + "Dark" = morally complex characters).</li>
                    <li>Mix linguistic influences (Celtic + Arabic) for exotic, culturally-rich names.</li>
                    <li>Use the tweak (🔄) feature to fine-tune names by rerolling individual syllables.</li>
                    <li>Favorites persist in your browser — star anything you like for later!</li>
                    <li>Press <span className="text-indigo-400">Ctrl+Enter</span> anywhere to quickly generate new names.</li>
                  </ul>
                </div>
              </div>
            </details>

            <details className="group mt-3 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-lg md:rounded-xl">
              <summary className="flex items-center justify-between p-2.5 md:p-4 cursor-pointer list-none">
                <span className="font-semibold text-indigo-400 flex items-center gap-2 text-sm md:text-base">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" /> About / Features
                </span>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-400 space-y-2">
                <p>
                  AetherNames is a free fantasy &amp; sci-fi name generator for writers, worldbuilding, and tabletop RPGs (TTRPG).
                </p>
                <p>
                  It also includes a 5e-compatible character creator and character sheet builder for campaign prep and quick NPCs.
                </p>
              </div>
            </details>

            <details className="group mt-3 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-lg md:rounded-xl">
              <summary className="flex items-center justify-between p-2.5 md:p-4 cursor-pointer list-none">
                <span className="font-semibold text-indigo-400 flex items-center gap-2 text-sm md:text-base">
                  <Scroll className="w-4 h-4 md:w-5 md:h-5" /> Legal / Disclaimer
                </span>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-400 space-y-3">
                <p className="text-slate-300">
                  AetherNames is an independent, unofficial fan-made tool.
                </p>
                <p>
                  This project is intended to follow the guidelines set forth in Wizards of the Coast&apos;s Fan Content Policy.
                  See: <a className="text-indigo-300 hover:text-indigo-200 underline" href="https://company.wizards.com/en/legal/fancontentpolicy" target="_blank" rel="noreferrer">Wizards of the Coast Fan Content Policy</a>.
                </p>
                <p>
                  Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast.
                  © Wizards of the Coast LLC.
                </p>
              </div>
            </details>
          </div>
          </>
          )}
        </header>

        {currentPage === 'generator' ? (
          <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
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
                    <span className="hidden md:inline text-[10px] opacity-60 font-normal mt-0.5">Ctrl+Enter</span>
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
                      metadata={n.metadata}
                      onRerollSiblings={(selectedPartIds, allParts) => tweakName(n, index, selectedPartIds, allParts)}
                      onSendToCharacter={() => {
                        setCharacterImportName(n.name);
                        setCurrentPage('character');
                      }}
                      onExplode={() => explodeNameVariations(n)}
                    />
                  ))
                )}
              </div>

              {/* Refine section removed - flask now instantly generates variations */}

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
                      <div key={f.id || f.name} className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-sm text-yellow-300 max-w-[250px]">
                        <span className="truncate">{f.name}</span>
                        <button 
                          onClick={() => {
                            setCharacterImportName(f.name);
                            setCurrentPage('character');
                          }} 
                          className="text-yellow-500/50 hover:text-indigo-400 transition-colors"
                          title="Send to Character Creator"
                        >
                          <User className="w-3.5 h-3.5" />
                        </button>
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
        ) : (
          <CharacterCreator 
            theme={config.genre}
            importedName={characterImportName}
            setImportedName={setCharacterImportName}
            onGoToGenerator={() => setCurrentPage('generator')}
          />
        )}
      </div>

      {/* Floating Generate Button - Mobile (Only on Generator Page) */}
      {currentPage === 'generator' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/50 z-50">
          <GlowButton onClick={generate} disabled={isGenerating} className="w-full" theme={config.genre}>
            <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Forging...' : 'Generate Names'}
          </GlowButton>
        </div>
      )}
    </div>
  );
}
