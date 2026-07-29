import React from 'react';
import { Network, History, Sparkles, Palette } from 'lucide-react';
import { Tooltip, Badge, Menu, MenuItem } from '@mui/material';
import { ThemeCombination } from '@/types/analysis';
import { THEME_PRESETS } from '@/constants/themes';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
  currentTheme: ThemeCombination;
  onChangeTheme: (themeId: ThemeCombination) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleHistory,
  historyCount,
  currentTheme,
  onChangeTheme,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const selectedPreset = THEME_PRESETS.find((t) => t.id === currentTheme) || THEME_PRESETS[0];

  return (
    <header className="w-full h-16 border-b border-slate-700/40 bg-slate-900/60 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div
          className="w-10 h-10 rounded-2xl p-0.5 shadow-md flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${selectedPreset.badgeColor}, #38bdf8)` }}
        >
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Network className="w-5 h-5 text-white animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              FlowSight
            </h1>
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-2xs"
              style={{ backgroundColor: selectedPreset.badgeColor }}
            >
              {selectedPreset.name}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block font-medium">
            AI Code Logic Explainer & Interactive Flowchart Generator
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Interactive Theme Combination Selector */}
        <Tooltip title="Switch Theme Combination" arrow>
          <button
            onClick={handleOpenMenu}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/80 border border-slate-700 hover:border-slate-500 hover:text-white transition-all flex items-center space-x-2 shadow-sm"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Theme Palette</span>
          </button>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '12px',
              marginTop: '8px',
            },
          }}
        >
          {THEME_PRESETS.map((preset) => (
            <MenuItem
              key={preset.id}
              onClick={() => {
                onChangeTheme(preset.id);
                handleCloseMenu();
              }}
              selected={preset.id === currentTheme}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: preset.badgeColor }}
              />
              <span>{preset.name}</span>
            </MenuItem>
          ))}
        </Menu>

        {/* History Toggle Button */}
        <Tooltip title="View Saved Analysis History" arrow>
          <button
            onClick={onToggleHistory}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/80 border border-slate-700 hover:border-slate-500 hover:text-white transition-all flex items-center space-x-2 shadow-sm"
          >
            <Badge badgeContent={historyCount} color="primary" max={9}>
              <History className="w-4 h-4 text-indigo-400 mr-1" />
            </Badge>
            <span className="hidden sm:inline">History</span>
          </button>
        </Tooltip>

        {/* Internship Badge */}
        <div className="hidden xs:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-800/60 text-indigo-200 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Internship Edition</span>
          <span className="sm:hidden">Pro</span>
        </div>
      </div>
    </header>
  );
};
