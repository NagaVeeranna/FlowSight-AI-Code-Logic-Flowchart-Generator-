import type { Metadata } from 'next';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'FlowSight - AI Code Logic & Flowchart Generator',
  description:
    'Transform complex source code (Python, Java, JavaScript, C++, C) into human-readable step-by-step logic and interactive Mermaid flowcharts instantly.',
  keywords: [
    'AI Flowchart Generator',
    'Code Visualizer',
    'Code Logic Explainer',
    'Mermaid Flowchart',
    'Software Architecture',
    'Developer Tool',
  ],
  authors: [{ name: 'FlowSight Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-500/20 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
