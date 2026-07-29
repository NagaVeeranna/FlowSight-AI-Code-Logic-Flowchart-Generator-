import React, { useState } from 'react';
import { DetailedExplanation } from '@/types/analysis';
import {
  BookOpen,
  ListOrdered,
  Variable,
  Activity,
  AlertTriangle,
  Clock,
  HardDrive,
  Copy,
  Check,
} from 'lucide-react';
import { Tooltip, Chip } from '@mui/material';

interface ExplanationPanelProps {
  summary: string | null;
  explanation: DetailedExplanation | null;
  isLoading: boolean;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  summary,
  explanation,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stepByStep' | 'variables' | 'flow' | 'edgeCases'>('overview');
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="glass-panel flex flex-col h-full border border-slate-800/80 rounded-2xl p-6 items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-xs text-cyan-300 font-semibold animate-pulse">Extracting control flow & variables...</p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="glass-panel flex flex-col h-full border border-slate-800/80 rounded-2xl p-6 sm:p-8 items-center justify-center text-center space-y-3 text-slate-500">
        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-700 stroke-1" />
        <h3 className="text-xs sm:text-sm font-semibold text-slate-300">No Explanation Ready</h3>
        <p className="text-[11px] sm:text-xs max-w-xs text-slate-500">
          Program breakdown, line-by-line logic, and edge cases will appear here after analysis.
        </p>
      </div>
    );
  }

  const handleCopyExplanation = () => {
    const formatted = `### Algorithm Summary\n${summary}\n\n### Overview\n${explanation.overview}\n\n### Time Complexity\n${explanation.timeComplexity}\n\n### Space Complexity\n${explanation.spaceComplexity}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel flex flex-col h-full w-full border border-slate-800/80 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Top Header & Horizontal Scrollable Tabs */}
      <div className="bg-[#0f172a]/90 border-b border-slate-800/80 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('stepByStep')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'stepByStep'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Step-by-Step</span>
          </button>

          <button
            onClick={() => setActiveTab('variables')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'variables'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <Variable className="w-3.5 h-3.5" />
            <span>Variables</span>
          </button>

          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'flow'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Control Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('edgeCases')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'edgeCases'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Edge Cases</span>
          </button>
        </div>

        <Tooltip title="Copy Summary & Overview" arrow>
          <button
            onClick={handleCopyExplanation}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </Tooltip>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto max-h-[380px] lg:max-h-none text-xs text-slate-300 space-y-4">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {summary && (
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 text-indigo-200 font-semibold leading-relaxed shadow-inner">
                {summary}
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                Program Overview
              </h4>
              <p className="leading-relaxed text-slate-300">{explanation.overview}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#070a12]/80 border border-slate-800/80 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Inputs</span>
                <p className="text-slate-200 font-medium">{explanation.inputs || 'N/A'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#070a12]/80 border border-slate-800/80 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Outputs</span>
                <p className="text-slate-200 font-medium">{explanation.outputs || 'N/A'}</p>
              </div>
            </div>

            {/* Complexity Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong className="text-slate-100">Time:</strong> {explanation.timeComplexity}</span>
              </div>
              <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs">
                <HardDrive className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong className="text-slate-100">Space:</strong> {explanation.spaceComplexity}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Step-by-Step Line-by-Line */}
        {activeTab === 'stepByStep' && (
          <div className="space-y-3 animate-fade-in">
            {explanation.lineByLine?.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#070a12]/80 border border-slate-800/80 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between text-cyan-400 font-bold text-[11px]">
                  <span>{item.lineRange}</span>
                </div>
                {item.codeSnippet && (
                  <pre className="font-mono text-[11px] bg-[#03050a] p-2.5 rounded-xl text-slate-200 overflow-x-auto border border-slate-800">
                    {item.codeSnippet}
                  </pre>
                )}
                <p className="text-slate-300 text-xs leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Variables */}
        {activeTab === 'variables' && (
          <div className="space-y-3 animate-fade-in">
            {explanation.variables?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {explanation.variables.map((v, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#070a12]/80 border border-slate-800/80 flex flex-col space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-cyan-400 text-xs">{v.name}</span>
                      <Chip label={v.type} size="small" variant="outlined" />
                    </div>
                    <p className="text-slate-300 text-xs">{v.purpose}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No significant state variables detected.</p>
            )}
          </div>
        )}

        {/* Tab 4: Control Flow */}
        {activeTab === 'flow' && (
          <div className="space-y-2.5 animate-fade-in">
            {explanation.controlFlow?.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#070a12]/80 border border-slate-800/80 flex items-start space-x-3 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-slate-200 leading-relaxed text-xs font-medium">{step}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Edge Cases */}
        {activeTab === 'edgeCases' && (
          <div className="space-y-3 animate-fade-in">
            {explanation.edgeCases?.map((ec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#070a12]/80 border border-slate-800/80 space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-xs">{ec.scenario}</span>
                  <span
                    className={`glass-pill text-[10px] font-bold ${
                      ec.riskLevel === 'high'
                        ? 'text-rose-400 border-rose-500/30 bg-rose-950/40'
                        : ec.riskLevel === 'medium'
                        ? 'text-amber-400 border-amber-500/30 bg-amber-950/40'
                        : 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
                    }`}
                  >
                    {ec.riskLevel?.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-slate-300 text-xs">{ec.behavior}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
