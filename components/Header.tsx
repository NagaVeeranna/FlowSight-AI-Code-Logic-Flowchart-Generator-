import React from 'react';
import { Network, History, Sparkles, BookOpen, FileCode2 } from 'lucide-react';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, historyCount }) => {
  return (
    <header className="w-full h-16 border-b border-slate-800/80 bg-surface-900/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-glass-sm">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-cyan p-0.5 shadow-glow-indigo flex items-center justify-center">
          <div className="w-full h-full bg-surface-950 rounded-[10px] flex items-center justify-center">
            <Network className="w-5 h-5 text-indigo-400 animate-pulse-glow" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight">
              FlowSight
            </h1>
            <span className="glass-pill text-[10px] text-cyan-400 border-cyan-500/30">
              AI v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            AI Code Logic & Interactive Flowchart Generator
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* History Toggle Button */}
        <button
          onClick={onToggleHistory}
          className="relative glass-panel-interactive px-3.5 py-2 rounded-lg text-xs font-medium text-slate-200 flex items-center space-x-2 hover:text-white"
          title="Open Analysis History"
        >
          <History className="w-4 h-4 text-indigo-400" />
          <span className="hidden md:inline">History</span>
          {historyCount > 0 && (
            <span className="ml-1 bg-brand-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>

        {/* Pro / Internship Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Internship Edition</span>
        </div>
      </div>
    </header>
  );
};
