# FlowSight – AI Code Logic & Flowchart Generator 🚀

**FlowSight** is an AI-powered web application that transforms source code into human-readable step-by-step logic, edge case analyses, and interactive Mermaid.js flowcharts.

Designed for students, developers, faculty, and interview candidates, FlowSight makes reading and understanding complex code effortless.

---

## 🌟 Key Features

* **Multi-Language Support**:
  * Python 3
  * Java
  * JavaScript / Node.js
  * C++
  * C
* **Interactive Code Visualizer**:
  * Instant Mermaid.js flowchart rendering
  * Vector pan, zoom in/out, reset, and fullscreen controls powered by `react-zoom-pan-pinch`
  * One-click download as **PNG** or **SVG**
  * Copy raw Mermaid syntax
* **Comprehensive AI Analysis**:
  * **Line-by-line** code explanation
  * **Algorithm summary** & overall objective
  * **Variables & state** tracking
  * **Control flow** sequence execution
  * **Edge case detection** & failure risk levels
  * **Time & Space Complexity** estimation ($O(N)$, $O(\log N)$, etc.)
* **Monaco Code Editor**:
  * Real-time syntax highlighting
  * Preset sample code quick-loader (Binary Search, Merge Sort, JWT Middleware, Linked List Reversal, DFS Graph)
  * Direct source file upload (`.py`, `.java`, `.js`, `.cpp`, `.c`)
  * Line and character counts
* **Local History Manager**:
  * Automatically saves previous code analyses in browser `localStorage`
  * Filter by language and search by keyword
  * Re-open previous sessions with one click
* **Resilient AI Pipeline**:
  * Strict JSON schema enforcement with Google Gemini API
  * Automatic Mermaid syntax validation & corrective retry loop

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript
* **Styling**: Tailwind CSS, Glassmorphic Dark UI, Lucide Icons
* **Code Editor**: `@monaco-editor/react`
* **Diagram Engine**: `mermaid` + `react-zoom-pan-pinch` + `html-to-image`
* **AI Core**: Google Gemini API (`@google/generative-ai` SDK with `gemini-1.5-flash`)
* **Storage**: LocalStorage API

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/)

### Installation Steps

1. **Clone or Download Repository**:
   ```bash
   git clone https://github.com/your-username/FlowSight.git
   cd FlowSight
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Presets & Manual Testing

FlowSight includes pre-loaded sample snippets for instant testing:
* **Binary Search (Python)**: Demonstrates logarithmic divide-and-conquer while loops and conditional returns.
* **Merge Sort (Java)**: Demonstrates recursive function calls, sub-array slicing, and linear merge phases.
* **JWT Authentication Middleware (JavaScript)**: Demonstrates web API authorization pipelines, bearer token parsing, and HTTP status handling.
* **Singly Linked List Reversal (C++)**: Demonstrates pointer manipulation and in-place reference changes.
* **Depth-First Search DFS (C)**: Demonstrates graph node traversal, adjacency lists, and recursion depth tracking.

---

## ☁️ Deployment on Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Under **Environment Variables**, add:
   * **Key**: `GEMINI_API_KEY`
   * **Value**: *Your Google Gemini API Key*
4. Click **Deploy**. Vercel will automatically build and publish your Next.js application.

---

## 🔮 Future Scope & Roadmap

* **Cyclomatic Complexity Analysis**: Real-time code branch complexity scoring.
* **Multi-File Repository Analysis**: Parse multi-file GitHub repositories using RAG.
* **Code Smell & Bug Detection**: Highlight potential memory leaks, unhandled promises, or null pointer dereferences.
* **PDF Report Generation**: Export full technical reports containing code, diagram, and complexity metrics.
* **Team Collaboration & Cloud History**: Sync analysis records across user accounts.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
