import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { cleanMermaidCode } from '@/utils/mermaid-validator';
import { toPng, toSvg } from 'html-to-image';
import { Tooltip } from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Check,
  Maximize2,
  FileCode,
  AlertCircle,
  Network,
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Mermaid configuration
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: true,
      },
    });
  }, []);

  // Render Mermaid code into SVG whenever mermaidCode changes
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
        const cleaned = cleanMermaidCode(mermaidCode);
        const uniqueId = `mermaid_svg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const { svg } = await mermaid.render(uniqueId, cleaned);
        if (isMounted) {
          setSvgContent(svg);
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
  }, [mermaidCode]);

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
      const dataUrl = await toPng(containerRef.current, { backgroundColor: '#070a12' });
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

  return (
    <div
      className={`glass-panel flex flex-col h-full border border-slate-800/80 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 bg-[#070a12]/95 backdrop-blur-2xl' : ''
      }`}
    >
      {/* Top Controls Bar */}
      <div className="px-4 py-3 bg-[#0f172a]/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <Network className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-bold text-slate-100 tracking-wide">Interactive Flowchart</span>
        </div>

        {mermaidCode && (
          <div className="flex items-center space-x-2">
            {/* Copy Mermaid Code */}
            <Tooltip title="Copy Mermaid Code" arrow>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <FileCode className="w-4 h-4" />}
              </button>
            </Tooltip>

            {/* Download SVG */}
            <Tooltip title="Download Vector SVG" arrow>
              <button
                onClick={handleDownloadSVG}
                className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white hover:border-indigo-500/50 transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG</span>
              </button>
            </Tooltip>

            {/* Download PNG */}
            <Tooltip title="Download High-Res PNG" arrow>
              <button
                onClick={handleDownloadPNG}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-800/80 text-xs font-semibold text-indigo-200 hover:text-white hover:border-indigo-500 transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>PNG</span>
              </button>
            </Tooltip>

            {/* Fullscreen Toggle */}
            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'} arrow>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Main Flowchart Viewer Body */}
      <div className="flex-1 relative min-h-[350px] bg-[#070a12]/80 overflow-hidden flex items-center justify-center p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-xs text-cyan-300 font-semibold animate-pulse">
              Synthesizing flowchart nodes...
            </p>
          </div>
        ) : renderError ? (
          <div className="flex flex-col items-center max-w-md text-center p-6 bg-rose-950/20 border border-rose-800/40 rounded-xl space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400" />
            <h4 className="text-sm font-semibold text-rose-200">Diagram Rendering Issue</h4>
            <p className="text-xs text-rose-300/80">{renderError}</p>
            <pre className="w-full text-[11px] font-mono bg-[#070a12] p-3 rounded text-slate-300 text-left overflow-x-auto max-h-40 border border-slate-800">
              {mermaidCode}
            </pre>
          </div>
        ) : svgContent ? (
          <TransformWrapper initialScale={1} minScale={0.2} maxScale={4} centerOnInit={true}>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Floating Zoom Controls */}
                <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 bg-[#0f172a]/90 border border-slate-800/80 p-1.5 rounded-xl backdrop-blur-xl shadow-2xl">
                  <Tooltip title="Zoom In" arrow>
                    <button
                      onClick={() => zoomIn()}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Zoom Out" arrow>
                    <button
                      onClick={() => zoomOut()}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Reset View" arrow>
                    <button
                      onClick={() => resetTransform()}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>

                <TransformComponent
                  wrapperClass="!w-full !h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                  contentClass="!w-full !h-full flex items-center justify-center"
                >
                  <div
                    ref={containerRef}
                    className="mermaid flex items-center justify-center p-6 w-full h-full"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-500">
            <Network className="w-12 h-12 text-slate-700 stroke-1" />
            <h3 className="text-sm font-semibold text-slate-300">No Diagram Generated Yet</h3>
            <p className="text-xs max-w-xs text-slate-500">
              Paste your source code in the editor and click &quot;Generate Flowchart & Logic&quot; to build an interactive diagram.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
