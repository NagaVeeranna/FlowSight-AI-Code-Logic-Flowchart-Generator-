import React, { useState } from 'react';
import { HistoryItem, SupportedLanguage } from '@/types/analysis';
import { HistoryStorage } from '@/utils/storage';
import {
  X,
  Search,
  Trash2,
  ExternalLink,
  Clock,
  Calendar,
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

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl animate-slide-up">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Analysis History</h2>
            <span className="glass-pill text-[10px] text-indigo-700 bg-indigo-50 border-indigo-200">
              {history.length} Saved
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-white border-b border-slate-200 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search history by title or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Filter options */}
          <div className="flex items-center justify-between">
            <select
              value={selectedLangFilter}
              onChange={(e) => setSelectedLangFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-2.5 py-1 font-semibold focus:outline-none"
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
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* History List Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold">No analysis records found.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="glass-panel-interactive p-3.5 rounded-xl cursor-pointer space-y-2 group bg-white border border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="glass-pill text-[10px] uppercase font-mono text-indigo-700 bg-indigo-50 border-indigo-200">
                      {item.language}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">
                      {item.title}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => handleSingleDelete(item.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 font-medium">
                  {item.result.summary}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="flex items-center space-x-1 font-medium">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formatDate(item.timestamp)}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-indigo-600 font-bold">
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
