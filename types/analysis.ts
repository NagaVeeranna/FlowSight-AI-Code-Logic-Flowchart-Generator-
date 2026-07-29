export type SupportedLanguage = 'python' | 'java' | 'javascript' | 'cpp' | 'c';

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

export interface DetailedExplanation {
  overview: string;
  inputs: string;
  outputs: string;
  lineByLine: {
    lineRange: string;
    codeSnippet: string;
    explanation: string;
  }[];
  variables: VariableInfo[];
  controlFlow: string[];
  edgeCases: EdgeCaseInfo[];
  timeComplexity: string;
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
