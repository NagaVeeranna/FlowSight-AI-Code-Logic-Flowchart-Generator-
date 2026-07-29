export type SupportedLanguage = 'python' | 'java' | 'javascript' | 'cpp' | 'c';
export type ThemeCombination = 'light-clean' | 'dark-cyber' | 'sunset-glow' | 'nordic-slate';
export type DiagramOrientation = 'TD' | 'LR';

export interface ThemePreset {
  id: ThemeCombination;
  name: string;
  badgeColor: string;
  monacoTheme: 'vs' | 'vs-dark';
  mermaidTheme: 'default' | 'dark' | 'neutral';
  bodyClass: string;
}

export interface LanguageOption {
  id: SupportedLanguage;
  name: string;
  extension: string;
  monacoLanguage: string;
}

export interface VariableInfo {
  name: string;
  type: string;
  purpose: string;
}

export interface EdgeCaseInfo {
  scenario: string;
  behavior: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CodeMetrics {
  linesOfCode: number;
  functions: number;
  loops: number;
  conditions: number;
  complexityScore: string;
  maintainability: string;
}

export interface TimeComplexityDetail {
  geminiAnalysis?: string;
  staticParser?: string;
  overall?: string;
}

export interface DetailedExplanation {
  overview: string;
  inputs: string;
  outputs: string;
  classes?: string[];
  methods?: string[];
  lineByLine: {
    lineRange: string;
    codeSnippet: string;
    explanation: string;
  }[];
  variables: VariableInfo[];
  controlFlow: string[];
  edgeCases: EdgeCaseInfo[];
  concepts?: string[];
  designPatterns?: string[];
  possibleIssues?: string[];
  recommendations?: string[];
  metrics?: CodeMetrics;
  timeComplexity: string;
  timeComplexityDetail?: TimeComplexityDetail;
  spaceComplexity: string;
}

export interface AnalysisResponse {
  summary: string;
  mermaidCode: string;
  explanation: DetailedExplanation;
}

export interface AnalysisRequest {
  language: SupportedLanguage;
  code: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  language: SupportedLanguage;
  title: string;
  codeSnippet: string;
  fullCode: string;
  result: AnalysisResponse;
}

export interface SampleCode {
  id: string;
  title: string;
  language: SupportedLanguage;
  category: 'Algorithms' | 'Data Structures' | 'Web & API' | 'Basics';
  description: string;
  code: string;
}
