'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { FlowchartViewer } from '@/components/FlowchartViewer';
import { ExplanationPanel } from '@/components/ExplanationPanel';
import { HistorySidebar } from '@/components/HistorySidebar';
import { AnalysisResponse, HistoryItem, SupportedLanguage, ThemeCombination } from '@/types/analysis';
import { HistoryStorage } from '@/utils/storage';
import { SAMPLE_CODES } from '@/constants/samples';
import { THEME_PRESETS } from '@/constants/themes';
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

  // Theme Combinations State
  const [currentTheme, setCurrentTheme] = useState<ThemeCombination>('light-clean');

  // History Drawer State
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load history and theme on mount
  useEffect(() => {
    const saved = HistoryStorage.getAll();
    setHistoryItems(saved);

    const savedTheme = (localStorage.getItem('flowsight_theme_combo') as ThemeCombination) || 'light-clean';
    setCurrentTheme(savedTheme);
  }, []);

  // Update body class whenever theme combination changes
  useEffect(() => {
    const preset = THEME_PRESETS.find((p) => p.id === currentTheme) || THEME_PRESETS[0];
    document.body.className = `${preset.bodyClass} min-h-screen flex flex-col font-sans transition-colors duration-300`;
    localStorage.setItem('flowsight_theme_combo', currentTheme);
  }, [currentTheme]);

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

  const activePreset = THEME_PRESETS.find((p) => p.id === currentTheme) || THEME_PRESETS[0];

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Header Bar with Interactive Theme Combination Menu */}
      <Header
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        historyCount={historyItems.length}
        currentTheme={currentTheme}
        onChangeTheme={(newTheme) => {
          setCurrentTheme(newTheme);
          showToast(`Applied theme: ${THEME_PRESETS.find((p) => p.id === newTheme)?.name}`, 'info');
        }}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-16 sm:top-20 right-4 sm:right-6 z-40 animate-slide-up max-w-sm sm:max-w-md">
          <div
            className={`flex items-center space-x-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-xl backdrop-blur-md border text-xs font-bold ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-700 text-rose-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-100'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 hover:bg-white/10 rounded-lg ml-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 p-3 sm:p-5 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1920px] w-full mx-auto items-stretch">
        {/* Left Side: Monaco Code Editor */}
        <section className="xl:col-span-5 flex flex-col h-full min-h-[440px] sm:min-h-[500px] xl:h-[calc(100vh-5.5rem)]">
          <CodeEditor
            code={code}
            language={language}
            onChangeCode={setCode}
            onChangeLanguage={setLanguage}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            monacoTheme={activePreset.monacoTheme}
          />
        </section>

        {/* Right Side: Flowchart Diagram & Explanation Breakdown */}
        <section className="xl:col-span-7 flex flex-col space-y-5 h-full min-h-[500px] xl:h-[calc(100vh-5.5rem)]">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start space-x-3 text-rose-200 text-xs shrink-0 shadow-sm">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="block font-bold mb-0.5">Analysis Issue</strong>
                <p className="font-medium">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="p-1 hover:bg-rose-900/50 rounded shrink-0"
              >
                <X className="w-4 h-4 text-rose-300" />
              </button>
            </div>
          )}

          {/* Top Panel: Interactive Flowchart Viewer */}
          <div className="h-[380px] sm:h-[450px] xl:h-[55%] shrink-0">
            <FlowchartViewer
              mermaidCode={analysisResult?.mermaidCode || null}
              isLoading={isLoading}
              onCopyMermaid={() => showToast('Mermaid code copied to clipboard!', 'success')}
              mermaidTheme={activePreset.mermaidTheme}
            />
          </div>

          {/* Bottom Panel: Detailed Explanation Breakdown */}
          <div className="flex-1 min-h-[320px] xl:min-h-0 overflow-hidden">
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
