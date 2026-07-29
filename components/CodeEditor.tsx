import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { SupportedLanguage } from '@/types/analysis';
import { SUPPORTED_LANGUAGES, SAMPLE_CODES } from '@/constants/samples';
import { Upload, Trash2, Copy, Check, Code2, Sparkles } from 'lucide-react';
import { Tooltip, Chip, CircularProgress } from '@mui/material';

interface CodeEditorProps {
  code: string;
  language: SupportedLanguage;
  onChangeCode: (val: string) => void;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  theme: 'dark' | 'light';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChangeCode,
  onChangeLanguage,
  onAnalyze,
  isLoading,
  theme,
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
    <div className="flex flex-col h-full w-full glass-panel border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-xl overflow-hidden shadow-glass-lg transition-colors duration-300">
      {/* Top Toolbar */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-900/90 dark:bg-surface-900/90 light:bg-slate-100/90 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Language & Preset Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-indigo-400 mr-1">
            <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">Editor</span>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
            className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer shadow-sm"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-surface-900 dark:bg-surface-900 light:bg-white text-slate-200 dark:text-slate-200 light:text-slate-800">
                {lang.name}
              </option>
            ))}
          </select>

          {/* Sample Presets Dropdown */}
          <select
            defaultValue=""
            onChange={(e) => handleSelectSample(e.target.value)}
            className="bg-indigo-950/60 dark:bg-indigo-950/60 light:bg-indigo-50 border border-indigo-800/60 dark:border-indigo-800/60 light:border-indigo-200 text-indigo-200 dark:text-indigo-200 light:text-indigo-800 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer max-w-[160px] sm:max-w-xs truncate shadow-sm"
          >
            <option value="" disabled className="bg-surface-900 dark:bg-surface-900 light:bg-white text-slate-400">
              Presets...
            </option>
            {SAMPLE_CODES.map((s) => (
              <option key={s.id} value={s.id} className="bg-surface-900 dark:bg-surface-900 light:bg-white text-slate-200 dark:text-slate-200 light:text-slate-800">
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Action Icons with MUI Tooltips */}
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".py,.js,.java,.cpp,.c,.txt"
            className="hidden"
          />
          <Tooltip title="Upload Source File (.py, .java, .js, .cpp, .c)" arrow>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Copy Button */}
          <Tooltip title="Copy Source Code" arrow>
            <button
              onClick={handleCopyCode}
              disabled={!code}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </Tooltip>

          {/* Clear Button */}
          <Tooltip title="Clear Editor" arrow>
            <button
              onClick={() => onChangeCode('')}
              disabled={!code}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-rose-400 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]">
        <Editor
          height="100%"
          language={selectedLangObj.monacoLanguage}
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
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
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-900/90 dark:bg-surface-900/90 light:bg-slate-100/90 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <Chip label={`${lineCount} ${lineCount === 1 ? 'line' : 'lines'}`} size="small" variant="outlined" />
          <Chip label={`${charCount} chars`} size="small" variant="outlined" />
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !code.trim()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-cyan text-white text-xs font-semibold shadow-glow-indigo hover:shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} color="inherit" />
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
