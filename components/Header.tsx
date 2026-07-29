import React from 'react';
import { Network, History, Sparkles } from 'lucide-react';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, historyCount }) => {
  return (
    <header className="w-full h-14 sm:h-16 border-b border-slate-800/80 bg-surface-900/80 backdrop-blur-md px-3 sm:px-5 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-glass-sm shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-cyan p-0.5 shadow-glow-indigo flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-surface-950 rounded-[10px] flex items-center justify-center">
            <Network className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 animate-pulse-glow" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight">
              FlowSight
            </h1>
            <span className="glass-pill text-[9px] sm:text-[10px] text-cyan-400 border-cyan-500/30 px-2 py-0.5">
              AI v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            AI Code Logic & Interactive Flowchart Generator
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* History Toggle Button */}
        <button
          onClick={onToggleHistory}
          className="relative glass-panel-interactive px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium text-slate-200 flex items-center space-x-1.5 sm:space-x-2 hover:text-white"
          title="Open Analysis History"
        >
          <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
          <span className="hidden sm:inline">History</span>
          {historyCount > 0 && (
            <span className="bg-brand-600 text-white text-[10px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>

        {/* Internship Badge */}
        <div className="hidden xs:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Internship Edition</span>
          <span className="sm:hidden">Pro</span>
        </div>
      </div>
    </header>
  );
};
