export type SupportedLanguage = 'python' | 'java' | 'javascript' | 'cpp' | 'c';
export type DiagramOrientation = 'TD' | 'LR';

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
  nestingDepth?: number;
  commentsCount?: number;
}

export interface QualityRatings {
  overallScore: number; // 0 to 100
  maintainabilityRating: 'A' | 'B' | 'C' | 'D' | 'F';
  readabilityRating: 'A' | 'B' | 'C' | 'D' | 'F';
  performanceRating: 'A' | 'B' | 'C' | 'D' | 'F';
  reliabilityRating: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface TimeComplexityDetail {
  geminiAnalysis?: string;
  staticParser?: string;
  overall?: string;
}

export interface DetailedExplanation {
  projectType?: string;
  overview: string;
  inputs: string;
  outputs: string;
  classes?: string[];
  methods?: string[];
  oopConcepts?: string[];
  detectedAlgorithms?: string[];
  detectedDataStructures?: string[];
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
  securityAnalysis?: string[];
  codeSmells?: string[];
  possibleIssues?: string[];
  recommendations?: string[];
  metrics?: CodeMetrics;
  ratings?: QualityRatings;
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

export type InputMode = 'custom' | 'preset';

export interface StarterTemplate {
  id: string;
  language: SupportedLanguage;
  name: string;
  code: string;
}

export interface SampleCode {
  id: string;
  title: string;
  language: SupportedLanguage;
  category: 'Algorithms' | 'Data Structures' | 'Web & API' | 'Dynamic Programming' | 'Graphs';
  description: string;
  code: string;
}
