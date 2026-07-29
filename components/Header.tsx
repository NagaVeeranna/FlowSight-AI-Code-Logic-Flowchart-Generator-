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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
              {selectedPreset.name}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden md:block font-medium">
            AI Code Logic Explainer & Interactive Flowchart Generator
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Interactive Theme Combination Selector */}
        <Tooltip title="Switch Theme Palette" arrow>
          <button
            onClick={handleOpenMenu}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900 transition-all flex items-center space-x-2 shadow-2xs"
          >
            <Palette className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Theme</span>
          </button>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              marginTop: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
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
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900 transition-all flex items-center space-x-2 shadow-2xs"
          >
            <Badge badgeContent={historyCount} color="primary" max={9}>
              <History className="w-4 h-4 text-indigo-600 mr-1" />
            </Badge>
            <span className="hidden sm:inline">History</span>
          </button>
        </Tooltip>

        {/* Internship Badge */}
        <div className="hidden xs:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Internship Edition</span>
          <span className="sm:hidden">Pro</span>
        </div>
      </div>
    </header>
  );
};
