import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, Copy, Star, ChevronDown, ChevronUp, Sparkles, X, Check, Download, Wand2, RefreshCw, Zap, Globe, Music, Skull, Crown, Flame, TreePine, Cpu, Rocket, Scroll, Heart, Volume2, FlaskConical, Glasses } from 'lucide-react';

// Additional Hooks for Local Storage Persistence
// Load from localStorage on mount
useEffect(() => {
  const savedHistory = JSON.parse(localStorage.getItem('nameHistory'));
  const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
  if (savedHistory) setNameHistory(savedHistory);
  if (savedFavorites) setFavorites(savedFavorites);
}, []);
  // Sync changes to localStorage locally-useEffect(() => {localStorage.setItem('nameHistory', JSON.stringify(nameHistory)); }, [nameHistory]);