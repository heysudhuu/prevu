export interface ThemeDefinition {
  id: string
  name: string
  description: string
  category: string
  colors: {
    bg: string
    surface: string
    surfaceLight: string
    accent: string
    accentHover: string
    text: string
    textMuted: string
    border: string
  }
  tag: string
  isPopular?: boolean
  isNew?: boolean
}

export const PREVU_THEMES: ThemeDefinition[] = [
  {
    id: 'terminal-git',
    name: 'Terminal Git',
    description: 'GitHub Dark engineering palette with monospace CLI cues, deep obsidian slates, and emerald accents.',
    category: 'Engineering',
    colors: {
      bg: '#010409',
      surface: '#0d1117',
      surfaceLight: '#161b22',
      accent: '#238636',
      accentHover: '#2ea44f',
      text: '#e6edf3',
      textMuted: '#7d8590',
      border: 'rgba(56, 189, 248, 0.2)'
    },
    tag: 'Default • Official',
    isPopular: true
  },
  {
    id: 'cosmic-violet',
    name: 'Cosmic Violet',
    description: 'Deep space obsidian with radiant violet auroras, celestial indigo cards, and academic cyan highlights.',
    category: 'Academic',
    colors: {
      bg: '#07070c',
      surface: '#0f0f1a',
      surfaceLight: '#1a1a2e',
      accent: '#8b5cf6',
      accentHover: '#7c3aed',
      text: '#f0f0f8',
      textMuted: '#8888a8',
      border: 'rgba(139, 92, 246, 0.3)'
    },
    tag: 'Prevu Classic'
  },
  {
    id: 'matrix-cyber',
    name: 'Matrix Cybersec',
    description: 'High-contrast true black with 1337 phosphor neon green glowing borders and terminal clarity.',
    category: 'Cybersec',
    colors: {
      bg: '#000000',
      surface: '#040d06',
      surfaceLight: '#081e0c',
      accent: '#00ff66',
      accentHover: '#33ff88',
      text: '#dcfce7',
      textMuted: '#4ade80',
      border: 'rgba(0, 255, 102, 0.35)'
    },
    tag: 'Cybersec Edition'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Electric synthwave aesthetic with neon magenta accents, hot pink CTAs, and hyper-cyan highlights.',
    category: 'Vibrant',
    colors: {
      bg: '#08070d',
      surface: '#120e1c',
      surfaceLight: '#1d162e',
      accent: '#ec4899',
      accentHover: '#f43f5e',
      text: '#fdf2f8',
      textMuted: '#f472b6',
      border: 'rgba(236, 72, 153, 0.3)'
    },
    tag: 'High Energy',
    isNew: true
  },
  {
    id: 'dracula-pro',
    name: 'Dracula Pro',
    description: 'The iconic developer dark theme with soft pastel purples, vampire dark surfaces, and muted cyan accents.',
    category: 'Minimalist',
    colors: {
      bg: '#1e1f29',
      surface: '#282a36',
      surfaceLight: '#343746',
      accent: '#bd93f9',
      accentHover: '#ff79c6',
      text: '#f8f8f2',
      textMuted: '#6272a4',
      border: 'rgba(189, 147, 249, 0.3)'
    },
    tag: 'Dev Favorite'
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    description: 'Midnight deep navy inspired by Tokyo neon city lights with electric cobalt blues and cyan glow.',
    category: 'Vibrant',
    colors: {
      bg: '#1a1b26',
      surface: '#24283b',
      surfaceLight: '#2f354d',
      accent: '#7aa2f7',
      accentHover: '#89ddff',
      text: '#c0caf5',
      textMuted: '#7982a9',
      border: 'rgba(122, 162, 247, 0.35)'
    },
    tag: 'VS Code Trend',
    isPopular: true
  },
  {
    id: 'nord-frost',
    name: 'Nord Frost',
    description: 'Arctic crystalline palette featuring calm polar slates, icy fjord teals, and clean snow-storm typography.',
    category: 'Minimalist',
    colors: {
      bg: '#242933',
      surface: '#2e3440',
      surfaceLight: '#3b4252',
      accent: '#88c0d0',
      accentHover: '#81a1c1',
      text: '#eceff4',
      textMuted: '#d8dee9',
      border: 'rgba(136, 192, 208, 0.35)'
    },
    tag: 'Nordic Clean'
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    description: 'Warm soothing pastel developer theme with velvet crust, soothing lavender mauve accents, and pastel cyan.',
    category: 'Modern',
    colors: {
      bg: '#11111b',
      surface: '#181825',
      surfaceLight: '#1e1e2e',
      accent: '#cba6f7',
      accentHover: '#b4befe',
      text: '#cdd6f4',
      textMuted: '#a6adc8',
      border: 'rgba(203, 166, 247, 0.35)'
    },
    tag: 'Community #1',
    isNew: true
  },
  {
    id: 'monokai-pro',
    name: 'Monokai Pro',
    description: 'Classic Sublime & IDE engineering suite with obsidian charcoal, incandescent amber accents, and coral warmth.',
    category: 'Engineering',
    colors: {
      bg: '#19181a',
      surface: '#221f22',
      surfaceLight: '#2d2a2e',
      accent: '#ffd866',
      accentHover: '#fc9867',
      text: '#fcfcfa',
      textMuted: '#939293',
      border: 'rgba(255, 216, 102, 0.35)'
    },
    tag: 'Legendary IDE'
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Precision-calibrated contrast palette for long research sessions with deep oceanic teal and warm solar highlights.',
    category: 'Academic',
    colors: {
      bg: '#00212b',
      surface: '#002b36',
      surfaceLight: '#073642',
      accent: '#2aa198',
      accentHover: '#b58900',
      text: '#eee8d5',
      textMuted: '#839496',
      border: 'rgba(42, 161, 152, 0.35)'
    },
    tag: 'Research Grade'
  }
]

