import React from 'react';
import { Network, History, Sparkles } from 'lucide-react';
import { Tooltip, Badge } from '@mui/material';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, historyCount }) => {
  return (
    <header className="w-full h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 p-0.5 shadow-sm flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Network className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              FlowSight
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
              AI v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden md:block font-medium">
            AI Code Logic Explainer & Interactive Flowchart Generator
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-3">
        {/* History Toggle Button (Large & Prominent) */}
        <Tooltip title="View Saved Analysis History" arrow>
          <button
            onClick={onToggleHistory}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all flex items-center space-x-2 sm:space-x-2.5 shadow-md hover:shadow-indigo-500/30 ring-2 ring-indigo-500/30 cursor-pointer"
          >
            <Badge badgeContent={historyCount} color="error" max={99}>
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-1" />
            </Badge>
            <span className="inline font-extrabold tracking-wide">Analysis History</span>
          </button>
        </Tooltip>

        {/* Open & Free Tool Badge */}
        <div className="hidden xs:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Free & Open Tool</span>
          <span className="sm:hidden">Open</span>
        </div>
      </div>
    </header>
  );
};
