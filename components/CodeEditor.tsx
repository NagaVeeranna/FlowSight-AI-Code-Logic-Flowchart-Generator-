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
    <div className="flex flex-col h-full w-full glass-panel border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      {/* Top Toolbar */}
      <div className="px-4 py-3 bg-slate-100/90 border-b border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Language & Preset Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-2 text-indigo-600 mr-1">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-slate-800 tracking-wide">Editor</span>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
            className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer shadow-2xs"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-white text-slate-800">
                {lang.name}
              </option>
            ))}
          </select>

          {/* Sample Presets Dropdown */}
          <select
            defaultValue=""
            onChange={(e) => handleSelectSample(e.target.value)}
            className="bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer max-w-[170px] sm:max-w-xs truncate shadow-2xs"
          >
            <option value="" disabled className="bg-white text-slate-500">
              Preset Algorithms...
            </option>
            {SAMPLE_CODES.map((s) => (
              <option key={s.id} value={s.id} className="bg-white text-slate-800">
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-1.5">
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
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Copy Button */}
          <Tooltip title="Copy Source Code" arrow>
            <button
              onClick={handleCopyCode}
              disabled={!code}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </Tooltip>

          {/* Clear Button */}
          <Tooltip title="Clear Code Editor" arrow>
            <button
              onClick={() => onChangeCode('')}
              disabled={!code}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-200/80 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Monaco Editor Container in Light/VS mode */}
      <div className="flex-1 w-full relative min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]">
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
      <div className="px-4 py-3 bg-slate-100/90 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600 flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <span className="font-mono font-bold text-indigo-700">{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          <span>•</span>
          <span className="font-mono text-slate-500">{charCount} chars</span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !code.trim()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 text-white text-xs font-bold shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2.5"
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} color="inherit" />
              <span>Analyzing Code Logic...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Generate Flowchart & Logic</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
