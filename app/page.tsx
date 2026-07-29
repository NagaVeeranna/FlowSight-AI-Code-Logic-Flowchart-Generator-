'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { FlowchartViewer } from '@/components/FlowchartViewer';
import { ExplanationPanel } from '@/components/ExplanationPanel';
import { HistorySidebar } from '@/components/HistorySidebar';
import { AnalysisResponse, HistoryItem, SupportedLanguage } from '@/types/analysis';
import { HistoryStorage } from '@/utils/storage';
import { SAMPLE_CODES } from '@/constants/samples';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function Home() {
  // Default to Binary Search Python sample
  const defaultSample = SAMPLE_CODES[0];

  const [code, setCode] = useState<string>(defaultSample.code);
  const [language, setLanguage] = useState<SupportedLanguage>(defaultSample.language);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // History Drawer State
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load history on mount
  useEffect(() => {
    const saved = HistoryStorage.getAll();
    setHistoryItems(saved);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setErrorMessage('Please enter source code to analyze.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete code analysis.');
      }

      const result: AnalysisResponse = data;
      setAnalysisResult(result);

      // Extract a descriptive title from the first non-empty code line
      const firstLine = code.trim().split('\n')[0].replace(/[#/*]/g, '').trim();
      const title = firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine || `${language.toUpperCase()} Analysis`;

      // Save to local history
      const savedItem = HistoryStorage.save({
        language,
        title,
        codeSnippet: code.substring(0, 100),
        fullCode: code,
        result,
      });

      setHistoryItems((prev) => [savedItem, ...prev.filter((i) => i.id !== savedItem.id)]);
      showToast('Analysis completed successfully!', 'success');
    } catch (err: any) {
      console.error('Analysis error:', err);
      const msg = err?.message || 'Failed to connect to AI server.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setLanguage(item.language);
    setCode(item.fullCode);
    setAnalysisResult(item.result);
    showToast(`Loaded analysis: "${item.title}"`, 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-950 text-slate-100">
      {/* Header Bar */}
      <Header
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        historyCount={historyItems.length}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-6 z-40 animate-slide-up">
          <div
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-xs font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-700/60 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-700/60 text-rose-200'
                : 'bg-indigo-950/90 border-indigo-700/60 text-indigo-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <Info className="w-4 h-4 text-indigo-400" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 hover:bg-white/10 rounded-lg ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1800px] w-full mx-auto">
        {/* Left Side: Monaco Code Editor */}
        <section className="flex flex-col h-full min-h-[500px]">
          <CodeEditor
            code={code}
            language={language}
            onChangeCode={setCode}
            onChangeLanguage={setLanguage}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </section>

        {/* Right Side: Flowchart Diagram & Explanation Breakdown */}
        <section className="flex flex-col space-y-6 h-full min-h-[500px]">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-start space-x-3 text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="block font-semibold mb-0.5">Analysis Failed</strong>
                <p>{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="p-1 hover:bg-rose-900/50 rounded"
              >
                <X className="w-4 h-4 text-rose-300" />
              </button>
            </div>
          )}

          {/* Top Panel: Interactive Flowchart Viewer */}
          <div className="h-[420px] shrink-0">
            <FlowchartViewer
              mermaidCode={analysisResult?.mermaidCode || null}
              isLoading={isLoading}
              onCopyMermaid={() => showToast('Mermaid code copied to clipboard!', 'success')}
            />
          </div>

          {/* Bottom Panel: Detailed Explanation Breakdown */}
          <div className="flex-1 min-h-[300px]">
            <ExplanationPanel
              summary={analysisResult?.summary || null}
              explanation={analysisResult?.explanation || null}
              isLoading={isLoading}
            />
          </div>
        </section>
      </main>

      {/* History Slide-over Drawer */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyItems}
        onSelectHistoryItem={handleSelectHistoryItem}
        onUpdateHistory={setHistoryItems}
      />
    </div>
  );
}
