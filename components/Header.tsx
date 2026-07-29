import React from 'react';
import { Network, History, Sparkles, Code, Cpu } from 'lucide-react';
import { Tooltip, Badge } from '@mui/material';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, historyCount }) => {
  return (
    <header className="w-full h-16 border-b border-slate-800/80 bg-[#0d121e]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-glass-sm shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-[#070a12] rounded-[14px] flex items-center justify-center">
            <Network className="w-5 h-5 text-cyan-400 animate-neon-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent tracking-tight">
              FlowSight
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              AI v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block font-medium">
            AI Code Logic Explainer & Interactive Flowchart Generator
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-3">
        {/* History Toggle Button */}
        <Tooltip title="View Saved Analysis History" arrow>
          <button
            onClick={onToggleHistory}
            className="glass-panel-interactive px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 flex items-center space-x-2 hover:text-white"
          >
            <Badge badgeContent={historyCount} color="primary" max={9}>
              <History className="w-4 h-4 text-indigo-400 mr-1" />
            </Badge>
            <span className="hidden sm:inline">History</span>
          </button>
        </Tooltip>

        {/* Pro / Internship Badge */}
        <div className="hidden xs:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-800/50 text-indigo-200 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Internship Edition</span>
          <span className="sm:hidden">Pro</span>
        </div>
      </div>
    </header>
  );
};
