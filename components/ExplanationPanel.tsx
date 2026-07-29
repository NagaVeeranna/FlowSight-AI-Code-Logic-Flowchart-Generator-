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
      <div className="glass-panel flex flex-col h-full border border-slate-800 rounded-xl p-6 items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Extracting control flow & variables...</p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="glass-panel flex flex-col h-full border border-slate-800 rounded-xl p-6 sm:p-8 items-center justify-center text-center space-y-3 text-slate-500">
        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-700 stroke-1" />
        <h3 className="text-xs sm:text-sm font-medium text-slate-400">No Explanation Ready</h3>
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
    <div className="glass-panel flex flex-col h-full w-full border border-slate-800 rounded-xl overflow-hidden shadow-glass-lg">
      {/* Top Header & Horizontal Scrollable Tabs */}
      <div className="bg-surface-900/90 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-brand-600 text-white shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('stepByStep')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'stepByStep'
                ? 'bg-brand-600 text-white shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Step-by-Step</span>
          </button>

          <button
            onClick={() => setActiveTab('variables')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'variables'
                ? 'bg-brand-600 text-white shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Variable className="w-3.5 h-3.5" />
            <span>Variables</span>
          </button>

          <button
            onClick={() => setActiveTab('flow')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'flow'
                ? 'bg-brand-600 text-white shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Control Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('edgeCases')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'edgeCases'
                ? 'bg-brand-600 text-white shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Edge Cases</span>
          </button>
        </div>

        <button
          onClick={handleCopyExplanation}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          title="Copy Explanation Summary"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto max-h-[380px] lg:max-h-none text-xs text-slate-300 space-y-4">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {summary && (
              <div className="p-3 sm:p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-200 font-medium">
                {summary}
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                Program Overview
              </h4>
              <p className="leading-relaxed text-slate-300">{explanation.overview}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-surface-900 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Inputs</span>
                <p className="text-slate-200">{explanation.inputs || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-900 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Outputs</span>
                <p className="text-slate-200">{explanation.outputs || 'N/A'}</p>
              </div>
            </div>

            {/* Complexity Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <Clock className="w-4 h-4 text-accent-cyan shrink-0" />
                <span><strong className="text-slate-200">Time:</strong> {explanation.timeComplexity}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <HardDrive className="w-4 h-4 text-accent-purple shrink-0" />
                <span><strong className="text-slate-200">Space:</strong> {explanation.spaceComplexity}</span>
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
                className="p-3 rounded-xl bg-surface-900 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-indigo-400 font-semibold text-[11px]">
                  <span>{item.lineRange}</span>
                </div>
                {item.codeSnippet && (
                  <pre className="font-mono text-[11px] bg-surface-950 p-2 rounded text-slate-300 overflow-x-auto border border-slate-800">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {explanation.variables.map((v, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-surface-900 border border-slate-800 flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-semibold text-accent-cyan text-xs">{v.name}</span>
                      <span className="glass-pill text-[10px] py-0.5">{v.type}</span>
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
          <div className="space-y-2 animate-fade-in">
            {explanation.controlFlow?.map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-surface-900 border border-slate-800 flex items-start space-x-3"
              >
                <div className="w-5 h-5 rounded-full bg-brand-600/30 text-indigo-300 font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">{step}</p>
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
                className="p-3 rounded-xl bg-surface-900 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-xs">{ec.scenario}</span>
                  <span
                    className={`glass-pill text-[10px] ${
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
