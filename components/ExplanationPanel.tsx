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
      <div className="glass-panel flex flex-col h-full border border-slate-200/90 rounded-2xl p-6 items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-xs text-indigo-700 font-bold animate-pulse">Extracting control flow & variables...</p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="glass-panel flex flex-col h-full border border-slate-200/90 rounded-2xl p-6 sm:p-8 items-center justify-center text-center space-y-3 text-slate-400">
        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 stroke-1" />
        <h3 className="text-xs sm:text-sm font-bold text-slate-700">No Explanation Ready</h3>
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
    <div className="glass-panel flex flex-col h-full w-full border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      {/* Top Header & Horizontal Scrollable Tabs */}
      <div className="bg-slate-100/90 border-b border-slate-200/90 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('stepByStep')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'stepByStep'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Step-by-Step</span>
          </button>

          <button
            onClick={() => setActiveTab('variables')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'variables'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <Variable className="w-3.5 h-3.5" />
            <span>Variables</span>
          </button>

          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'flow'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Control Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('edgeCases')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'edgeCases'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Edge Cases</span>
          </button>
        </div>

        <Tooltip title="Copy Summary & Overview" arrow>
          <button
            onClick={handleCopyExplanation}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </Tooltip>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto max-h-[380px] lg:max-h-none text-xs text-slate-700 space-y-4">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {summary && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold leading-relaxed shadow-2xs">
                {summary}
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1.5">
                Program Overview
              </h4>
              <p className="leading-relaxed text-slate-700 font-medium">{explanation.overview}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Inputs</span>
                <p className="text-slate-800 font-bold">{explanation.inputs || 'N/A'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Outputs</span>
                <p className="text-slate-800 font-bold">{explanation.outputs || 'N/A'}</p>
              </div>
            </div>

            {/* Complexity Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-xs shadow-2xs">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong className="text-slate-800">Time:</strong> {explanation.timeComplexity}</span>
              </div>
              <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-xs shadow-2xs">
                <HardDrive className="w-4 h-4 text-purple-600 shrink-0" />
                <span><strong className="text-slate-800">Space:</strong> {explanation.spaceComplexity}</span>
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
                className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between text-indigo-700 font-bold text-[11px]">
                  <span>{item.lineRange}</span>
                </div>
                {item.codeSnippet && (
                  <pre className="font-mono text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-800 overflow-x-auto border border-slate-200">
                    {item.codeSnippet}
                  </pre>
                )}
                <p className="text-slate-700 text-xs leading-relaxed font-medium">{item.explanation}</p>
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
                    className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-indigo-700 text-xs">{v.name}</span>
                      <Chip label={v.type} size="small" variant="outlined" />
                    </div>
                    <p className="text-slate-700 text-xs font-medium">{v.purpose}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No significant state variables detected.</p>
            )}
          </div>
        )}

        {/* Tab 4: Control Flow */}
        {activeTab === 'flow' && (
          <div className="space-y-2.5 animate-fade-in">
            {explanation.controlFlow?.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-slate-200 flex items-start space-x-3 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {idx + 1}
                </div>
                <p className="text-slate-800 leading-relaxed text-xs font-bold">{step}</p>
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
                className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">{ec.scenario}</span>
                  <span
                    className={`glass-pill text-[10px] font-bold ${
                      ec.riskLevel === 'high'
                        ? 'text-rose-700 border-rose-200 bg-rose-50'
                        : ec.riskLevel === 'medium'
                        ? 'text-amber-800 border-amber-200 bg-amber-50'
                        : 'text-emerald-800 border-emerald-200 bg-emerald-50'
                    }`}
                  >
                    {ec.riskLevel?.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-slate-700 text-xs font-medium">{ec.behavior}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
