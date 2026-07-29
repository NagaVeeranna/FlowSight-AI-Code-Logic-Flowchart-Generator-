# FlowSight – Complete Folder & Directory Map

```text
d:\FlowSight
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts                  # Serverless API endpoint (Gemini SDK & AST fallback)
│   ├── globals.css                       # Pure white theme design tokens & Mermaid overrides
│   ├── layout.tsx                        # Root Next.js layout & Google Font loaders
│   └── page.tsx                          # Main dashboard split-panel layout
├── components/
│   ├── CodeEditor.tsx                    # Monaco Editor with file upload & language selector
│   ├── ExplanationPanel.tsx              # Tabbed breakdown, scorecards, metrics & risk audit
│   ├── FlowchartViewer.tsx               # Interactive Mermaid SVG viewer (Pan/Zoom & PNG/SVG export)
│   ├── Header.tsx                        # High-contrast navigation header with history trigger
│   └── HistorySidebar.tsx                # Slide-over local history drawer manager
├── constants/
│   └── samples.ts                        # Preset algorithm sample library (Python, Java, JS, C++, C)
├── types/
│   └── analysis.ts                       # TypeScript interfaces for request/response & metrics
├── utils/
│   ├── mermaid-validator.ts              # Mermaid syntax sanitizer and structure checker
│   ├── static-flowchart-generator.ts    # Evidence-based AST parser for zero-latency fallback
│   └── storage.ts                        # LocalStorage CRUD helper
├── .env.example                          # Environment variable template
├── .env.local                            # Local environment configuration (GEMINI_API_KEY)
├── .gitignore                            # Git ignore rules
├── API_DOCS.md                           # REST API specification for /api/analyze
├── ARCHITECTURE.md                       # System architecture & Clean Architecture data flow
├── FOLDER_STRUCTURE.md                   # Directory map reference
├── package.json                          # Node.js dependencies & npm scripts
├── README.md                             # Main product README
└── tsconfig.json                         # TypeScript configuration
```
