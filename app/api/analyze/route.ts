import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisRequest, AnalysisResponse } from '@/types/analysis';
import { cleanMermaidCode, isValidMermaidSyntax } from '@/utils/mermaid-validator';
import { generateStaticAnalysis } from '@/utils/static-flowchart-generator';

const SYSTEM_PROMPT = `
You are FlowSight, an evidence-based static code analysis & software visualization engine.
Analyze the ENTIRE user source code and return a single, strictly valid JSON object.

### CRITICAL DESIGN PRINCIPLES & EVIDENCE RULES:
1. TRUTHFULNESS: Never claim something that cannot be justified directly from the provided source code.
   - Do NOT report Design Patterns unless strong evidence exists.
   - Do NOT report Algorithms (Binary Search, DFS, Quick Sort, etc.) unless actually detected in the logic.
   - Do NOT report OOP Concepts (Inheritance, Polymorphism) unless classes/interfaces exist.
   - Do NOT report Data Structures (HashMap, Queue, Stack) unless instantiated or used.
2. FLOWCHART SYNTAX RULES:
   - Syntax MUST start with 'flowchart TD'.
   - Node IDs MUST be simple alphanumeric strings without spaces (e.g., Start, Cond1, Exec1).
   - Labels MUST be enclosed in double quotes inside square brackets or decision diamonds. Example: Node1["Initialize i = 0"] or Cond1{"i < n?"}.
   - Keep label text clean and plain text (avoid unescaped parentheses or brackets inside node labels). Example: Start["Start: binary search"] instead of Start["binary_search(arr, target)"].
   - Decision branches MUST label edges with ["Yes"] / ["No"] or branch values.

### Expected JSON Output Schema:
{
  "summary": "Brief 1-2 sentence summary of what this program does based on evidence.",
  "mermaidCode": "flowchart TD\\nStart[\\"Start\\"] --> Cond1{\\"Check Condition\\"} ...",
  "explanation": {
    "projectType": "Console App | REST API | Algorithm Script | Web App | Utility Library",
    "overview": "Detailed evidence-based overview of the program's primary objective and mechanism.",
    "inputs": "Description of input parameters, types, or expected user inputs.",
    "outputs": "Description of return values, console output, or side effects.",
    "classes": ["ClassName1"],
    "methods": ["methodName1()"],
    "oopConcepts": ["Inheritance", "Encapsulation"],
    "detectedAlgorithms": ["Binary Search", "DFS"],
    "detectedDataStructures": ["Array", "HashMap"],
    "lineByLine": [
      {
        "lineRange": "Lines 1-5",
        "codeSnippet": "snippet of code",
        "explanation": "Clear explanation of what happens in these lines."
      }
    ],
    "variables": [
      {
        "name": "variableName",
        "type": "Data Type",
        "purpose": "What this variable stores or tracks."
      }
    ],
    "controlFlow": [
      "1. Receive input parameters",
      "2. Evaluate branch conditions",
      "3. Execute primary loop",
      "4. Return calculated output"
    ],
    "edgeCases": [
      {
        "scenario": "Empty input array",
        "behavior": "Returns -1 immediately without entering loop",
        "riskLevel": "low"
      }
    ],
    "concepts": ["REST API", "Recursion", "State Management"],
    "designPatterns": ["Factory Pattern", "Strategy Pattern"],
    "securityAnalysis": ["Hardcoded API key detected", "Missing input validation"],
    "codeSmells": ["Long method (>40 lines)", "Deep nesting (>3 levels)", "Magic numbers"],
    "possibleIssues": ["Potential NullPointerException under null input"],
    "recommendations": ["Refactor nested loop into HashMap lookup", "Add entry point null check"],
    "metrics": {
      "linesOfCode": 45,
      "functions": 2,
      "loops": 1,
      "conditions": 3,
      "complexityScore": "Low",
      "maintainability": "High",
      "nestingDepth": 2,
      "commentsCount": 4
    },
    "ratings": {
      "overallScore": 88,
      "maintainabilityRating": "A",
      "readabilityRating": "A",
      "performanceRating": "B",
      "reliabilityRating": "A"
    },
    "timeComplexity": "O(N) - Linear time complexity",
    "timeComplexityDetail": {
      "overall": "O(N)",
      "staticParser": "O(N)",
      "geminiAnalysis": "O(1)"
    },
    "spaceComplexity": "O(1) - Constant auxiliary space"
  }
}
`;

export async function POST(req: NextRequest) {
  try {
    const body: AnalysisRequest = await req.json();
    const { language, code } = body;

    // 1. Validation
    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { error: 'Source code input is required and cannot be empty.' },
        { status: 400 }
      );
    }

    if (!language || !['python', 'java', 'javascript', 'cpp', 'c'].includes(language)) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}. Supported: python, java, javascript, cpp, c.` },
        { status: 400 }
      );
    }

    if (code.length > 15000) {
      return NextResponse.json(
        { error: 'Code size exceeds the 15,000 character limit for analysis.' },
        { status: 400 }
      );
    }

    // 2. API Key verification & Format Check
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const isValidKeyFormat = apiKey && apiKey.startsWith('AIzaSy') && !apiKey.includes('your_');

    if (!isValidKeyFormat) {
      console.warn('GEMINI_API_KEY is missing or invalid format. Using FlowSight Static AST Generator.');
      const fallbackResult = generateStaticAnalysis(code, language);
      return NextResponse.json(fallbackResult, { status: 200 });
    }

    // 3. Gemini Client Initialization
    const genAI = new GoogleGenerativeAI(apiKey);

    // Primary models supported by Google Gemini API
    const MODEL_CANDIDATES = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash-lite',
    ];

    const userPrompt = `Target Language: ${language}\n\nSource Code:\n\`\`\`${language}\n${code}\n\`\`\``;

    // Helper for AI Generation with model fallback
    const callGemini = async (extraInstruction?: string) => {
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}${
        extraInstruction ? `\n\nCRITICAL FIX REQUIRED: ${extraInstruction}` : ''
      }`;

      let lastError: any = null;

      for (const modelName of MODEL_CANDIDATES) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          });

          const result = await model.generateContent(fullPrompt);
          const responseText = result.response.text();
          if (!responseText) {
            throw new Error('Gemini API returned an empty response.');
          }
          return JSON.parse(responseText) as AnalysisResponse;
        } catch (err: any) {
          console.warn(`Model '${modelName}' attempt failed: ${err?.message || err}. Trying next candidate...`);
          lastError = err;
        }
      }

      throw lastError || new Error('All Gemini model candidates failed to respond.');
    };

    // 4. Attempt Gemini AI Generation with automatic static engine fallback
    try {
      let analysisResult = await callGemini();

      // Validate Mermaid Syntax & Automatic Retry Fallback
      let cleanedMermaid = cleanMermaidCode(analysisResult.mermaidCode);
      const syntaxCheck = isValidMermaidSyntax(cleanedMermaid);

      if (!syntaxCheck.valid) {
        console.warn(`Mermaid syntax error detected on first attempt: ${syntaxCheck.error}. Retrying...`);
        try {
          analysisResult = await callGemini(
            `Previous response generated invalid Mermaid syntax: "${syntaxCheck.error}". Please re-generate valid 'flowchart TD' syntax with properly quoted labels.`
          );
          cleanedMermaid = cleanMermaidCode(analysisResult.mermaidCode);
        } catch (retryErr) {
          console.error('Retry attempt failed, using cleaned version:', retryErr);
        }
      }

      analysisResult.mermaidCode = cleanedMermaid;
      return NextResponse.json(analysisResult, { status: 200 });
    } catch (aiError: any) {
      console.warn('Gemini AI API unavailable or quota limited. Invoking FlowSight Static AST Engine:', aiError?.message);
      const fallbackResult = generateStaticAnalysis(code, language);
      return NextResponse.json(fallbackResult, { status: 200 });
    }
  } catch (error: any) {
    console.error('FlowSight API Critical Error:', error);
    const fallbackResult = generateStaticAnalysis('function main() {}', 'javascript');
    return NextResponse.json(fallbackResult, { status: 200 });
  }
}
