import { ThemePreset } from '@/types/analysis';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'light-clean',
    name: 'Light Clean',
    badgeColor: '#4f46e5',
    monacoTheme: 'vs',
    mermaidTheme: 'default',
    bodyClass: 'theme-light-clean',
  },
  {
    id: 'dark-cyber',
    name: 'Dark Cyberpunk',
    badgeColor: '#06b6d4',
    monacoTheme: 'vs-dark',
    mermaidTheme: 'dark',
    bodyClass: 'theme-dark-cyber',
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    badgeColor: '#f43f5e',
    monacoTheme: 'vs-dark',
    mermaidTheme: 'dark',
    bodyClass: 'theme-sunset-glow',
  },
  {
    id: 'nordic-slate',
    name: 'Nordic Slate',
    badgeColor: '#10b981',
    monacoTheme: 'vs-dark',
    mermaidTheme: 'neutral',
    bodyClass: 'theme-nordic-slate',
  },
];
