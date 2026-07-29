import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { SupportedLanguage } from '@/types/analysis';
import { SUPPORTED_LANGUAGES, SAMPLE_CODES } from '@/constants/samples';
import { Upload, Trash2, Copy, Check, Code2, Sparkles } from 'lucide-react';

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
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0];

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

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_CODES.find((s) => s.id === sampleId);
    if (sample) {
      onChangeLanguage(sample.language);
      onChangeCode(sample.code);
    }
  };

  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="flex flex-col h-full w-full glass-panel border border-slate-800 rounded-xl overflow-hidden shadow-glass-lg">
      {/* Top Toolbar */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-900/90 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Language & Preset Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-indigo-400 mr-1">
            <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-semibold text-slate-200">Editor</span>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
            className="bg-slate-800/80 border border-slate-700 text-slate-100 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-surface-900 text-slate-200">
                {lang.name}
              </option>
            ))}
          </select>

          {/* Sample Presets Dropdown */}
          <select
            defaultValue=""
            onChange={(e) => handleSelectSample(e.target.value)}
            className="bg-indigo-950/60 border border-indigo-800/60 text-indigo-200 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer max-w-[160px] sm:max-w-xs truncate"
          >
            <option value="" disabled className="bg-surface-900 text-slate-400">
              Presets...
            </option>
            {SAMPLE_CODES.map((s) => (
              <option key={s.id} value={s.id} className="bg-surface-900 text-slate-200">
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Action Icons */}
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".py,.js,.java,.cpp,.c,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Upload Source Code File"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            disabled={!code}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Clear Button */}
          <button
            onClick={() => onChangeCode('')}
            disabled={!code}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Clear Code"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]">
        <Editor
          height="100%"
          language={selectedLangObj.monacoLanguage}
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
      </div>

      {/* Footer / Analyze Bar */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-[11px] sm:text-xs text-slate-400 flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !code.trim()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-cyan text-white text-xs font-semibold shadow-glow-indigo hover:shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Code...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Flowchart & Logic</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
