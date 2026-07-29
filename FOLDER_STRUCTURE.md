# FlowSight – Project Directory & File Structure

```
FlowSight/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Serverless Gemini AI API Route & Syntax Validator
│   ├── globals.css               # Base CSS, Glassmorphic styling & Mermaid SVG dark themes
│   ├── layout.tsx                # Root layout with fonts, metadata & dark background
│   └── page.tsx                  # Main FlowSight Split Dashboard & State Manager
├── components/
│   ├── CodeEditor.tsx            # Monaco Editor + Toolbar + File Upload + Language Selector
│   ├── ExplanationPanel.tsx      # Tabbed explanation breakdown (Logic, Variables, Flow, Edge Cases)
│   ├── ExportControls.tsx        # Utility export components
│   ├── FlowchartViewer.tsx       # Interactive Mermaid SVG viewer + Pan/Zoom + PNG/SVG download
│   ├── Header.tsx                # Top navigation bar + brand logo + history badge
│   └── HistorySidebar.tsx        # Slide-over drawer for local history search, filtering & restore
├── constants/
│   └── samples.ts                # Preset code examples (Binary Search, Merge Sort, JWT, LinkedList, DFS)
├── types/
│   └── analysis.ts               # Strict TypeScript interfaces for AI Request/Response, History & Samples
├── utils/
│   ├── mermaid-validator.ts      # Mermaid syntax sanitizer and structural validator
│   └── storage.ts                # LocalStorage history persistence manager
├── public/                       # Static public assets & icons
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables secret configuration
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS color tokens, glassmorphism shadows & keyframes
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts configuration
├── README.md                     # Overview, features, setup & deployment instructions
├── ARCHITECTURE.md               # System architecture diagram & design decisions
├── API_DOCS.md                   # REST API documentation for /api/analyze
└── FOLDER_STRUCTURE.md           # Folder structure documentation
```
