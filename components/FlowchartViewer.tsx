import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { cleanMermaidCode } from '@/utils/mermaid-validator';
import { toPng } from 'html-to-image';
import { Tooltip } from '@mui/material';
import { DiagramOrientation } from '@/types/analysis';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Check,
  Maximize2,
  Minimize2,
  FileCode,
  AlertCircle,
  Network,
  ArrowRightLeft,
  Palette,
  X,
} from 'lucide-react';

interface FlowchartViewerProps {
  mermaidCode: string | null;
  isLoading: boolean;
  onCopyMermaid: () => void;
}

export const FlowchartViewer: React.FC<FlowchartViewerProps> = ({
  mermaidCode,
  isLoading,
  onCopyMermaid,
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState<DiagramOrientation>('TD');
  const containerRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<'default' | 'dark' | 'forest' | 'neutral'>('default');

  // Initialize Mermaid configuration
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: true,
      },
    });
  }, [theme]);

  // Handle ESC key press to exit full screen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Render Mermaid code into SVG whenever mermaidCode, orientation, or theme changes
  useEffect(() => {
    let isMounted = true;

    if (!mermaidCode) {
      setSvgContent(null);
      setRenderError(null);
      return;
    }

    const renderDiagram = async () => {
      setRenderError(null);
      try {
        let cleaned = cleanMermaidCode(mermaidCode);

        // Adjust diagram orientation if toggled to LR
        if (orientation === 'LR') {
          cleaned = cleaned.replace(/flowchart\s+(TD|TB|BT|RL)/i, 'flowchart LR');
        } else {
          cleaned = cleaned.replace(/flowchart\s+(LR|TB|BT|RL)/i, 'flowchart TD');
        }

        mermaid.initialize({
          startOnLoad: false,
          theme: theme,
          securityLevel: 'loose',
          fontFamily: 'Inter, sans-serif',
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            useMaxWidth: true,
          },
        });

        const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
        let { svg } = await mermaid.render(uniqueId, cleaned);
        // Safely make SVG responsive by updating max-width without corrupting node styles
        const responsiveSvg = svg.replace(/max-width:\s*[\d.]+(px|rem|em|vw|%)/gi, 'max-width: 100%');
        if (isMounted) {
          setSvgContent(responsiveSvg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setRenderError('Failed to render flowchart. Showing raw syntax instead.');
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [mermaidCode, orientation, theme]);

  const handleCopyCode = () => {
    if (!mermaidCode) return;
    onCopyMermaid();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowchart_${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await toPng(containerRef.current, { backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `flowchart_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export PNG:', err);
    }
  };

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'TD' ? 'LR' : 'TD'));
  };

  return (
    <div
      className={`glass-panel flex flex-col h-full border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-white w-screen h-screen rounded-none border-none shadow-2xl'
          : ''
      }`}
    >
      {/* Top Controls Bar */}
      <div className="px-4 py-3 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-2.5">
          <Network className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-extrabold text-slate-800 tracking-wide">
            {isFullscreen ? 'Flowchart (Fullscreen View)' : 'Interactive Flowchart'}
          </span>
          {isFullscreen && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Press ESC to exit
            </span>
          )}
        </div>

        {mermaidCode && (
          <div className="flex items-center space-x-2">
            {/* Diagram Theme Selector */}
            <Tooltip title="Diagram Style Theme" arrow>
              <div className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-white border border-slate-300 shadow-2xs">
                <Palette className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <select
                  value={theme}
                  onChange={(e: any) => setTheme(e.target.value)}
                  className="text-xs font-extrabold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="default">Light</option>
                  <option value="dark">Dark Slate</option>
                  <option value="forest">Forest</option>
                  <option value="neutral">Monochrome</option>
                </select>
              </div>
            </Tooltip>

            {/* Diagram Orientation Toggle (Top-Down vs Left-Right) */}
            <Tooltip title={`Switch Layout: ${orientation === 'TD' ? 'Top-Down' : 'Left-to-Right'}`} arrow>
              <button
                onClick={toggleOrientation}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-extrabold text-indigo-700 hover:bg-slate-50 transition-all flex items-center space-x-1.5 shadow-2xs"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{orientation}</span>
              </button>
            </Tooltip>

            {/* Copy Mermaid Code */}
            <Tooltip title="Copy Mermaid Syntax" arrow>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <FileCode className="w-4 h-4" />}
              </button>
            </Tooltip>

            {/* Download SVG */}
            <Tooltip title="Download Vector SVG" arrow>
              <button
                onClick={handleDownloadSVG}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-extrabold text-slate-800 hover:bg-slate-50 transition-all flex items-center space-x-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG</span>
              </button>
            </Tooltip>

            {/* Download PNG */}
            <Tooltip title="Download High-Res PNG" arrow>
              <button
                onClick={handleDownloadPNG}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-extrabold text-indigo-900 hover:bg-indigo-100 transition-all flex items-center space-x-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>PNG</span>
              </button>
            </Tooltip>

            {/* Fullscreen Toggle */}
            <Tooltip title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Enlarge / Fullscreen Canvas'} arrow>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2 rounded-xl transition-all ${
                  isFullscreen
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Main Flowchart Viewer Body */}
      <div className="flex-1 relative min-h-0 bg-[#f8fafc] overflow-hidden flex items-center justify-center p-2 sm:p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-xs text-indigo-700 font-extrabold animate-pulse">
              Synthesizing flowchart nodes...
            </p>
          </div>
        ) : renderError ? (
          <div className="flex flex-col items-center max-w-md text-center p-6 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600" />
            <h4 className="text-sm font-extrabold text-rose-900">Diagram Rendering Issue</h4>
            <p className="text-xs text-rose-700 font-medium">{renderError}</p>
            <pre className="w-full text-[11px] font-mono bg-white p-3 rounded text-slate-800 text-left overflow-x-auto max-h-40 border border-slate-200">
              {mermaidCode}
            </pre>
          </div>
        ) : svgContent ? (
          <TransformWrapper
            key={isFullscreen ? 'fullscreen-mode' : 'normal-mode'}
            initialScale={1}
            minScale={0.1}
            maxScale={5}
            centerOnInit={true}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Floating Zoom & Fit Controls */}
                <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs border border-slate-200 p-1.5 rounded-xl shadow-md">
                  <Tooltip title="Zoom In" arrow>
                    <button
                      onClick={() => zoomIn()}
                      className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Zoom Out" arrow>
                    <button
                      onClick={() => zoomOut()}
                      className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Reset & Fit to Screen" arrow>
                    <button
                      onClick={() => resetTransform()}
                      className="p-1.5 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>

                <TransformComponent
                  wrapperStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  wrapperClass="!w-full !h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                  contentClass="!w-full !h-full flex items-center justify-center"
                >
                  <div
                    ref={containerRef}
                    className="mermaid flex items-center justify-center p-2 w-full h-full max-w-full max-h-full overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-400">
            <Network className="w-12 h-12 text-slate-300 stroke-1" />
            <h3 className="text-sm font-bold text-slate-700">No Diagram Generated Yet</h3>
            <p className="text-xs max-w-xs text-slate-500">
              Paste your source code in the editor and click &quot;Generate Flowchart & Logic&quot; to build an interactive diagram.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
