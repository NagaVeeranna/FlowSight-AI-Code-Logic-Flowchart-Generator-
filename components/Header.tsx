import React from 'react';
import { Network, History, Sparkles, Sun, Moon } from 'lucide-react';
import { Tooltip, Badge } from '@mui/material';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleHistory,
  historyCount,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="w-full h-14 sm:h-16 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200/80 bg-surface-900/80 dark:bg-surface-900/80 light:bg-white/80 backdrop-blur-md px-3 sm:px-5 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-glass-sm shrink-0 transition-colors duration-300">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-cyan p-0.5 shadow-glow-indigo flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-surface-950 dark:bg-surface-950 light:bg-slate-900 rounded-[10px] flex items-center justify-center">
            <Network className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 animate-pulse-glow" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-600 to-indigo-800 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
              FlowSight
            </h1>
            <span className="glass-pill text-[9px] sm:text-[10px] text-cyan-400 border-cyan-500/30 px-2 py-0.5">
              AI v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 hidden md:block">
            AI Code Logic & Interactive Flowchart Generator
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Dark / Light Mode Toggle */}
        <Tooltip title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`} arrow>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl glass-panel-interactive text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-indigo-400 transition-all flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </Tooltip>

        {/* History Toggle Button with MUI Badge */}
        <Tooltip title="View Analysis History" arrow>
          <button
            onClick={onToggleHistory}
            className="relative glass-panel-interactive px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 flex items-center space-x-1.5 sm:space-x-2 hover:text-indigo-400"
          >
            <Badge badgeContent={historyCount} color="primary" max={9}>
              <History className="w-4 h-4 text-indigo-400 mr-1" />
            </Badge>
            <span className="hidden sm:inline font-semibold">History</span>
          </button>
        </Tooltip>

        {/* Internship Badge */}
        <div className="hidden xs:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-950/60 dark:bg-indigo-950/60 light:bg-indigo-50 border border-indigo-800/50 dark:border-indigo-800/50 light:border-indigo-200 text-indigo-300 dark:text-indigo-300 light:text-indigo-700 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Internship Edition</span>
          <span className="sm:hidden">Pro</span>
        </div>
      </div>
    </header>
  );
};
