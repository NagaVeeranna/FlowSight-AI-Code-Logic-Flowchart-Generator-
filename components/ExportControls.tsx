import React from 'react';
import { Download, FileCode, Copy, Check } from 'lucide-react';

interface ExportControlsProps {
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  onCopyMermaid: () => void;
  onCopyExplanation: () => void;
  disabled?: boolean;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  onDownloadPNG,
  onDownloadSVG,
  onCopyMermaid,
  onCopyExplanation,
  disabled = false,
}) => {
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [copiedText, setCopiedText] = React.useState(false);

  const handleCopyCode = () => {
    onCopyMermaid();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyText = () => {
    onCopyExplanation();
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onDownloadPNG}
        disabled={disabled}
        className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-xs font-medium text-indigo-200 hover:text-white hover:border-indigo-600 transition-colors flex items-center space-x-1.5 disabled:opacity-40"
      >
        <Download className="w-3.5 h-3.5" />
        <span>PNG</span>
      </button>

      <button
        onClick={onDownloadSVG}
        disabled={disabled}
        className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white hover:border-slate-600 transition-colors flex items-center space-x-1.5 disabled:opacity-40"
      >
        <Download className="w-3.5 h-3.5" />
        <span>SVG</span>
      </button>

      <button
        onClick={handleCopyCode}
        disabled={disabled}
        className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white hover:border-slate-600 transition-colors flex items-center space-x-1.5 disabled:opacity-40"
      >
        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
        <span>Mermaid Code</span>
      </button>

      <button
        onClick={handleCopyText}
        disabled={disabled}
        className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white hover:border-slate-600 transition-colors flex items-center space-x-1.5 disabled:opacity-40"
      >
        {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        <span>Explanation</span>
      </button>
    </div>
  );
};
