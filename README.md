# FlowSight – AI Code Logic & Flowchart Generator 🔍⚡

**FlowSight** is a production-quality, enterprise-grade web application that converts source code across multiple programming languages (**Python, Java, JavaScript, C++, C**) into:

1. **Human-Readable Step-by-Step Logic Breakdown**
2. **Interactive Vector Flowcharts (Mermaid.js)**
3. **Evidence-Based Static Analysis & Security Audit**
4. **AI Code Quality Scorecard (0–100 Rating & Grades)**

---

## 🌟 Key Features

### 💻 1. Multi-Language Monaco Code Editor Workspace
- **IDE-Grade Editing**: Powered by `@monaco-editor/react` with syntax highlighting and line/character counters.
- **Language Support**: Seamlessly switch between **Python**, **Java**, **JavaScript**, **C++**, and **C**.
- **File Upload Support**: Drag and drop or upload `.py`, `.java`, `.js`, `.cpp`, or `.c` files directly.
- **Preset Algorithm Library**: Built-in sample algorithms (Binary Search, Merge Sort, JWT Authentication, Linked List Reversal, Depth-First Search).

### 📊 2. Interactive Flowchart Visualization Engine
- **Mermaid.js Vector Diagrams**: Renders clean, high-contrast flowcharts with decision diamonds and iteration loops.
- **Layout Orientation Toggle**: Switch dynamically between **Top-Down (TD)** and **Left-to-Right (LR)** layouts with 1 click.
- **Pan & Zoom Canvas**: Built-in vector zoom in/out, pan, reset, and full-screen mode powered by `react-zoom-pan-pinch`.
- **Export Options**: One-click download for **High-Res PNG**, **Vector SVG**, or copy raw **Mermaid Code**.

### 🛡️ 3. Evidence-Based Dynamic Adaptive Code Analysis
- **Truthful Extraction (No Guesses)**: Analyzes source code first and reports ONLY features backed by evidence.
  - **Algorithms Detected**: Binary Search, DFS/BFS, Quick Sort, Merge Sort, Dynamic Programming, Two Pointers.
  - **Data Structures**: Array, ArrayList, LinkedList, HashMap, HashSet, Stack, Queue.
  - **OOP Concepts**: Class Encapsulation, Inheritance, Interfaces, Polymorphism, Static Members.
  - **Verified Design Patterns**: Factory, Strategy, Fallback, Validation, Repository.
- **Security & Code Smells Audit**: Scans for unstringified SQL query patterns, hardcoded API keys/secrets, missing input validation, long functions (`>60 LOC`), and deep nesting (`>= 3 levels`).

### 🏆 4. AI Code Quality Scorecard
- **Overall Score**: 0 to 100 calculated rating.
- **Letter Grades (A–F)**:
  - **Maintainability Grade**
  - **Readability Grade**
  - **Performance Grade**
  - **Reliability Grade**

### ⚡ 5. Zero-Latency Resiliency & AST Fallback
- **Guaranteed HTTP 200 Uptime**: Built-in **FlowSight Static AST Parser** (`utils/static-flowchart-generator.ts`).
- **Quota Safeguard**: Automatically falls back to local AST generation when Google Gemini API keys hit rate limits (`429 Too Many Requests`) or invalid key formats without failing.

### 💾 6. Local Session History Drawer
- **Persistent Storage**: Automatically saves past analyses in client-side `localStorage`.
- **Search & Filter**: Real-time keyword search and language filtering.
- **One-Click Restore**: Reopen previous analyses or clear history cleanly.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router), TypeScript, React 18
- **UI & Styling**: Tailwind CSS, Material-UI (`@mui/material`), Lucide Icons
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Diagram Engine**: Mermaid.js, `react-zoom-pan-pinch`, `html-to-image`
- **AI Core**: Google Gemini API (`@google/generative-ai` SDK)
- **Static Parser**: Custom TypeScript AST & Regex Rule Engine

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/NagaVeeranna/FlowSight-AI-Code-Logic-Flowchart-Generator-.git
cd FlowSight
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Google Gemini API Key from Google AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY=AIzaSyYourActualGoogleGeminiApiKeyHere
```
*(Note: If no API key is provided, FlowSight automatically activates its local zero-latency AST generator fallback engine).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📁 Directory Structure

```text
FlowSight/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts         # Serverless API endpoint with Gemini SDK & static fallback
│   ├── globals.css              # Pure white high-contrast theme & glassmorphic utilities
│   ├── layout.tsx               # Root layout & Google Font loaders (Inter & Fira Code)
│   └── page.tsx                 # Main dashboard split-panel layout
├── components/
│   ├── CodeEditor.tsx           # Monaco Editor component with language & preset loaders
│   ├── ExplanationPanel.tsx     # Tabbed logic breakdown, scorecards, metrics & risk audit
│   ├── FlowchartViewer.tsx      # Interactive Mermaid SVG viewer with pan/zoom & exports
│   ├── Header.tsx               # High-contrast navigation header with history drawer trigger
│   └── HistorySidebar.tsx       # Slide-over local analysis history manager
├── constants/
│   └── samples.ts               # Preset algorithm code library across 5 languages
├── types/
│   └── analysis.ts              # TypeScript interfaces for request/response & metrics
├── utils/
│   ├── mermaid-validator.ts     # Mermaid syntax sanitizer and structure checker
│   ├── static-flowchart-generator.ts # AST rule parser for zero-latency fallback engine
│   └── storage.ts               # LocalStorage CRUD helper
├── README.md
├── ARCHITECTURE.md
├── API_DOCS.md
└── FOLDER_STRUCTURE.md
```

---

## 📜 License & Acknowledgments

Built with ❤️ for the Internship Project Demonstration. Designed with an emphasis on code visualization, AI resiliency, and evidence-based static software analysis.
