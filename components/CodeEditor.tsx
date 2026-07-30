'use client';

import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { SupportedLanguage, InputMode } from '@/types/analysis';
import { SUPPORTED_LANGUAGES, SAMPLE_CODES, STARTER_TEMPLATES } from '@/constants/samples';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Code2,
  Sparkles,
  PenTool,
  RotateCcw,
  FileText,
  Loader2,
} from 'lucide-react';

interface CodeEditorProps {
  code: string;
  language: SupportedLanguage;
  onChangeCode: (val: string) => void;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChangeCode,
  onChangeLanguage,
  onAnalyze,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('binary_search_py');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0];

  const activePreset = SAMPLE_CODES.find((s) => s.id === selectedPresetId);

  // Helper to retrieve default basic starter code for a specific language
  const getBasicStarterCode = (lang: SupportedLanguage): string => {
    const tmpl = STARTER_TEMPLATES.find((t) => t.language === lang);
    return tmpl ? tmpl.code : `# Basic ${lang} code\n`;
  };

  // Check if current code matches active preset algorithm
  const isPresetEdited =
    inputMode === 'preset' && activePreset ? code.trim() !== activePreset.code.trim() : false;

  // Switch to Preset Mode & load sample algorithm
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_CODES.find((s) => s.id === sampleId);
    if (sample) {
      setSelectedPresetId(sample.id);
      setInputMode('preset');
      onChangeLanguage(sample.language);
      onChangeCode(sample.code);
    }
  };

  // Switch to Custom Code Mode & load basic code for currently selected language
  const handleSwitchToCustomMode = (targetLang?: SupportedLanguage) => {
    const langToUse = targetLang || language;
    setInputMode('custom');
    if (targetLang) {
      onChangeLanguage(targetLang);
    }
    const starterCode = getBasicStarterCode(langToUse);
    onChangeCode(starterCode);
  };

  // Handle changing language while in Custom Code mode
  const handleChangeLanguageCustom = (newLang: SupportedLanguage) => {
    onChangeLanguage(newLang);
    if (inputMode === 'custom') {
      const starterCode = getBasicStarterCode(newLang);
      onChangeCode(starterCode);
    }
  };

  // Reset preset code to default algorithm
  const handleResetPreset = () => {
    if (activePreset) {
      onChangeLanguage(activePreset.language);
      onChangeCode(activePreset.code);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const matchedLang = SUPPORTED_LANGUAGES.find((l) => l.extension === ext);
    if (matchedLang) {
      onChangeLanguage(matchedLang.id);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputMode('custom');
        onChangeCode(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group sample algorithms by category for the dropdown
  const categories = Array.from(new Set(SAMPLE_CODES.map((s) => s.category)));

  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="flex flex-col h-full w-full glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all duration-300">
      {/* Top Toolbar - shrink-0 to prevent layout collapse */}
      <div className="px-4 py-3 bg-slate-100/95 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        {/* Dynamic Mode Switcher (Custom Code vs Preset Algorithms) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 text-indigo-700 mr-1 shrink-0">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-extrabold text-slate-800 tracking-wide">FlowEditor</span>
          </div>

          {/* Segmented Mode Control Tabs */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/50">
            <button
              onClick={() => handleSwitchToCustomMode()}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                inputMode === 'custom'
                  ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Custom Code</span>
            </button>
            <button
              onClick={() => {
                setInputMode('preset');
                if (activePreset) {
                  onChangeLanguage(activePreset.language);
                  onChangeCode(activePreset.code);
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                inputMode === 'preset'
                  ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Preset Algorithms</span>
            </button>
          </div>
        </div>

        {/* Dynamic Action Controls based on Input Mode */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
          {inputMode === 'custom' ? (
            /* Language Selector in Custom Mode (Changes language & auto-loads basic code) */
            <select
              value={language}
              onChange={(e) => handleChangeLanguageCustom(e.target.value as SupportedLanguage)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-extrabold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer shadow-2xs"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-white text-slate-800">
                  {lang.name}
                </option>
              ))}
            </select>
          ) : (
            /* Preset Algorithms Selector */
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectSample(e.target.value)}
              className="bg-indigo-50 border border-indigo-300 text-indigo-950 text-xs rounded-xl px-3 py-1.5 font-extrabold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer max-w-[210px] sm:max-w-xs truncate shadow-2xs"
            >
              {categories.map((cat) => (
                <optgroup key={cat} label={cat} className="bg-slate-100 font-bold text-slate-700">
                  {SAMPLE_CODES.filter((s) => s.category === cat).map((s) => (
                    <option key={s.id} value={s.id} className="bg-white text-slate-800 font-medium">
                      {s.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}

          {/* Icon Actions (Upload, Copy, Clear) */}
          <div className="flex items-center space-x-1 border-l border-slate-300/80 pl-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".py,.js,.java,.cpp,.c,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload Source File (.py, .java, .js, .cpp, .c)"
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyCode}
              disabled={!code}
              title="Copy Source Code"
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors disabled:opacity-40 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onChangeCode('')}
              disabled={!code}
              title="Clear Code Editor"
              className="p-1.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-200/80 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Status / Info Sub-Bar - shrink-0 to prevent layout collapse */}
      <div className="px-4 py-2 bg-indigo-950 text-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-indigo-900 shadow-inner shrink-0">
        <div className="flex items-center space-x-2 truncate">
          {inputMode === 'preset' && activePreset ? (
            <>
              <span className="px-2 py-0.5 rounded-md bg-indigo-800 text-indigo-200 font-mono text-[11px] font-semibold uppercase tracking-wider shrink-0">
                {activePreset.category}
              </span>
              <span className="font-semibold text-white truncate">{activePreset.title}</span>
              <span className="text-indigo-300 text-[11px] hidden md:inline truncate border-l border-indigo-800 pl-2">
                {activePreset.description}
              </span>
            </>
          ) : (
            <>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-400" />
                Custom Code Mode
              </span>
              <span className="font-medium text-slate-200 truncate">
                Basic {selectedLangObj.name} starter code loaded. Edit or enter your custom code below.
              </span>
            </>
          )}
        </div>

        {/* Dynamic Editing Status & Reset Option */}
        <div className="flex items-center space-x-2 shrink-0">
          {inputMode === 'preset' && (
            isPresetEdited ? (
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 animate-pulse">
                  • Modified
                </span>
                <button
                  onClick={handleResetPreset}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded bg-indigo-800 hover:bg-indigo-700 text-white text-[11px] font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ✓ Default Preset Active
              </span>
            )
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative min-h-0 overflow-hidden">
        <Editor
          height="100%"
          language={selectedLangObj.monacoLanguage}
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          theme="light"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            padding: { top: 14, bottom: 14 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
      </div>

      {/* Footer / Analyze Bar */}
      <div className="px-4 py-3 bg-slate-100/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-slate-600 flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <span className="font-mono font-bold text-indigo-700">{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          <span>•</span>
          <span className="font-mono text-slate-500 font-medium">{charCount} chars</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="hidden md:inline-block text-[11px] text-slate-500 font-bold bg-slate-200/80 px-2 py-1 rounded-lg border border-slate-300">
            Ctrl + Enter
          </span>
          <button
            onClick={onAnalyze}
            disabled={isLoading || !code.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-extrabold shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing Code Logic...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Flowchart & Logic</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
