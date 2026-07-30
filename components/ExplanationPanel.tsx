'use client';

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
  Code2,
  Boxes,
  Cpu,
  ShieldAlert,
  Lightbulb,
  Gauge,
  Layers,
  Award,
  Binary,
  Database,
  Lock,
  Bug,
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
  const [activeTab, setActiveTab] = useState<'overview' | 'stepByStep' | 'analysis' | 'variables' | 'flow' | 'security'>('overview');
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="glass-panel flex flex-col h-full border border-slate-200 rounded-2xl p-6 items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-xs text-indigo-700 font-extrabold animate-pulse">Running evidence-based static analysis...</p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="glass-panel flex flex-col h-full border border-slate-200 rounded-2xl p-6 sm:p-8 items-center justify-center text-center space-y-3 text-slate-400">
        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 stroke-1" />
        <h3 className="text-xs sm:text-sm font-bold text-slate-700">No Analysis Generated Yet</h3>
        <p className="text-[11px] sm:text-xs max-w-xs text-slate-500">
          Paste source code and click &quot;Generate Flowchart & Logic&quot; to run dynamic evidence-based analysis.
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
    <div className="glass-panel flex flex-col h-full w-full border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all duration-300">
      {/* Top Header & Horizontal Scrollable Tabs */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1.5 ${activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Overview & Quality</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1.5 ${activeTab === 'analysis'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-200" />
            <span>Algorithms & OOP</span>
          </button>

          <button
            onClick={() => setActiveTab('stepByStep')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1.5 ${activeTab === 'stepByStep'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Step-by-Step</span>
          </button>

          <button
            onClick={() => setActiveTab('variables')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1.5 ${activeTab === 'variables'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
          >
            <Variable className="w-3.5 h-3.5" />
            <span>Variables</span>
          </button>

          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1.5 ${activeTab === 'flow'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Control Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center space-x-1.5 ${activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Security & Audit</span>
          </button>
        </div>

        <button
          onClick={handleCopyExplanation}
          title="Copy Summary & Overview"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto max-h-[420px] lg:max-h-none text-xs text-slate-700 space-y-4 bg-white">
        {/* Tab 1: Overview & Quality Scorecard */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {/* Top Project Type & Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-2xs">
              <div>
                {explanation.projectType && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white mr-2">
                    {explanation.projectType}
                  </span>
                )}
                <span className="text-xs font-bold text-indigo-900 leading-relaxed">
                  {summary}
                </span>
              </div>
            </div>

            {/* Quality Scorecard (0 - 100) */}
            {explanation.ratings && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-indigo-900 font-extrabold text-xs">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span>AI Code Quality Scorecard</span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-xs">
                    {explanation.ratings.overallScore} / 100
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-bold">Maintainability</span>
                    <strong className="text-indigo-700 text-sm font-extrabold">Grade {explanation.ratings.maintainabilityRating}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-bold">Readability</span>
                    <strong className="text-cyan-700 text-sm font-extrabold">Grade {explanation.ratings.readabilityRating}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-bold">Performance</span>
                    <strong className="text-emerald-700 text-sm font-extrabold">Grade {explanation.ratings.performanceRating}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-bold">Reliability</span>
                    <strong className="text-purple-700 text-sm font-extrabold">Grade {explanation.ratings.reliabilityRating}</strong>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider mb-1.5">
                Program Overview
              </h4>
              <p className="leading-relaxed text-slate-700 font-medium">{explanation.overview}</p>
            </div>

            {/* Code Metrics Grid */}
            {explanation.metrics && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-indigo-900 font-extrabold text-xs">
                  <Gauge className="w-4 h-4 text-indigo-600" />
                  <span>Calculated Code Metrics</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block font-bold">LOC</span>
                    <strong className="text-indigo-700 text-xs font-mono">{explanation.metrics.linesOfCode}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block font-bold">Functions</span>
                    <strong className="text-indigo-700 text-xs font-mono">{explanation.metrics.functions}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block font-bold">Loops</span>
                    <strong className="text-purple-700 text-xs font-mono">{explanation.metrics.loops}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block font-bold">Conditions</span>
                    <strong className="text-amber-700 text-xs font-mono">{explanation.metrics.conditions}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block font-bold">Complexity</span>
                    <strong className="text-emerald-700 text-xs">{explanation.metrics.complexityScore}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block font-bold">Nesting</span>
                    <strong className="text-cyan-700 text-xs">{explanation.metrics.nestingDepth || 1} Lvl</strong>
                  </div>
                </div>
              </div>
            )}

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

        {/* Tab 2: Algorithms, Data Structures & OOP (Truthful Evidence-Based) */}
        {activeTab === 'analysis' && (
          <div className="space-y-4 animate-fade-in">
            {/* Detected Algorithms */}
            {explanation.detectedAlgorithms && explanation.detectedAlgorithms.length > 0 && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider flex items-center space-x-2">
                  <Binary className="w-4 h-4 text-indigo-600" />
                  <span>Detected Algorithms</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {explanation.detectedAlgorithms.map((algo, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-extrabold"
                    >
                      {algo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Detected Data Structures */}
            {explanation.detectedDataStructures && explanation.detectedDataStructures.length > 0 && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-extrabold text-cyan-900 uppercase tracking-wider flex items-center space-x-2">
                  <Database className="w-4 h-4 text-cyan-600" />
                  <span>Detected Data Structures</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {explanation.detectedDataStructures.map((ds, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-extrabold"
                    >
                      {ds}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* OOP Concepts */}
            {explanation.oopConcepts && explanation.oopConcepts.length > 0 && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center space-x-2">
                  <Boxes className="w-4 h-4 text-purple-600" />
                  <span>Object-Oriented Concepts</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {explanation.oopConcepts.map((oop, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-extrabold"
                    >
                      {oop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Design Patterns */}
            {explanation.designPatterns && explanation.designPatterns.length > 0 && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Verified Design Patterns</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {explanation.designPatterns.map((pattern, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold"
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Step-by-Step Line-by-Line */}
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

        {/* Tab 4: Variables */}
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
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 border border-slate-300 text-slate-700">{v.type}</span>
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

        {/* Tab 5: Control Flow Timeline */}
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

        {/* Tab 6: Security & Code Smells Audit */}
        {activeTab === 'security' && (
          <div className="space-y-4 animate-fade-in">
            {/* Security Audit */}
            {explanation.securityAnalysis && explanation.securityAnalysis.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 shadow-2xs">
                <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Security Audit & Vulnerabilities</span>
                </h4>
                <div className="space-y-1.5 pt-1">
                  {explanation.securityAnalysis.map((sec, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-amber-900 text-xs font-medium">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{sec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code Smells */}
            {explanation.codeSmells && explanation.codeSmells.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 shadow-2xs">
                <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider flex items-center space-x-2">
                  <Bug className="w-4 h-4 text-rose-600" />
                  <span>Detected Code Smells</span>
                </h4>
                <div className="space-y-1.5 pt-1">
                  {explanation.codeSmells.map((smell, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-rose-900 text-xs font-medium">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{smell}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {explanation.recommendations && explanation.recommendations.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 shadow-2xs">
                <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>Refactoring Recommendations</span>
                </h4>
                <div className="space-y-1.5 pt-1">
                  {explanation.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-emerald-900 text-xs font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
