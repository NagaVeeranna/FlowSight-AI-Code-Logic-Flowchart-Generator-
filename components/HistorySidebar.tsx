import React, { useState } from 'react';
import { HistoryItem, SupportedLanguage } from '@/types/analysis';
import { HistoryStorage } from '@/utils/storage';
import {
  X,
  Search,
  Trash2,
  ExternalLink,
  Clock,
  Code,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onUpdateHistory: (updated: HistoryItem[]) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onUpdateHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');

  if (!isOpen) return null;

  const handleSingleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = HistoryStorage.delete(id);
    onUpdateHistory(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all analysis history?')) {
      HistoryStorage.clearAll();
      onUpdateHistory([]);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang =
      selectedLangFilter === 'all' || item.language === selectedLangFilter;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface-950 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-up">
        {/* Drawer Header */}
        <div className="p-4 bg-surface-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-100">Analysis History</h2>
            <span className="glass-pill text-[10px] text-indigo-300">
              {history.length} Saved
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-surface-950 border-b border-slate-800/80 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search history by title or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Filter options */}
          <div className="flex items-center justify-between">
            <select
              value={selectedLangFilter}
              onChange={(e) => setSelectedLangFilter(e.target.value)}
              className="bg-surface-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="all">All Languages</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>

            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* History List Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Clock className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-xs">No analysis records found.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="glass-panel-interactive p-3.5 rounded-xl cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="glass-pill text-[10px] uppercase font-mono text-cyan-300 border-cyan-500/30">
                      {item.language}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate max-w-[200px]">
                      {item.title}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => handleSingleDelete(item.id, e)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {item.result.summary}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/50">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-indigo-400 font-medium">
                    <span>Reopen</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
