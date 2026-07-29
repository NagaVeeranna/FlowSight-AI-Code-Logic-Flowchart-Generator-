import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { cleanMermaidCode } from '@/utils/mermaid-validator';
import { toPng, toSvg } from 'html-to-image';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Copy,
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
      const dataUrl = await toPng(containerRef.current, { backgroundColor: '#0b0f19' });
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
      className={`glass-panel flex flex-col h-full border border-slate-800 rounded-xl overflow-hidden shadow-glass-lg ${
        isFullscreen ? 'fixed inset-4 z-50 bg-surface-950/95' : ''
      }`}
    >
      {/* Top Controls Bar */}
      <div className="px-4 py-3 bg-surface-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-accent-cyan" />
          <span className="text-sm font-semibold text-slate-200">Interactive Flowchart</span>
        </div>

        {mermaidCode && (
          <div className="flex items-center space-x-2">
            {/* Copy Mermaid Code */}
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy Mermaid Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <FileCode className="w-4 h-4" />}
            </button>

            {/* Download SVG */}
            <button
              onClick={handleDownloadSVG}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white hover:border-slate-600 transition-colors flex items-center space-x-1.5"
              title="Download SVG"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SVG</span>
            </button>

            {/* Download PNG */}
            <button
              onClick={handleDownloadPNG}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-xs font-medium text-indigo-200 hover:text-white hover:border-indigo-600 transition-colors flex items-center space-x-1.5"
              title="Download PNG"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PNG</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Flowchart Viewer Body */}
      <div className="flex-1 relative min-h-[350px] bg-surface-950/60 overflow-hidden flex items-center justify-center p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-accent-cyan rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-medium animate-pulse">
              Synthesizing flowchart nodes...
            </p>
          </div>
        ) : renderError ? (
          <div className="flex flex-col items-center max-w-md text-center p-6 bg-rose-950/20 border border-rose-800/40 rounded-xl space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400" />
            <h4 className="text-sm font-semibold text-rose-200">Diagram Rendering Issue</h4>
            <p className="text-xs text-rose-300/80">{renderError}</p>
            <pre className="w-full text-[11px] font-mono bg-surface-950 p-3 rounded text-slate-300 text-left overflow-x-auto max-h-40 border border-slate-800">
              {mermaidCode}
            </pre>
          </div>
        ) : svgContent ? (
          <TransformWrapper
            initialScale={1}
            minScale={0.2}
            maxScale={4}
            centerOnInit={true}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Floating Zoom Controls */}
                <div className="absolute top-4 right-4 z-20 flex items-center space-x-1 bg-surface-900/90 border border-slate-800 p-1 rounded-lg backdrop-blur-md shadow-lg">
                  <button
                    onClick={() => zoomIn()}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
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
            <h3 className="text-sm font-medium text-slate-400">No Diagram Generated Yet</h3>
            <p className="text-xs max-w-xs text-slate-500">
              Paste your source code in the editor and click &quot;Generate Flowchart & Logic&quot; to build an interactive diagram.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
