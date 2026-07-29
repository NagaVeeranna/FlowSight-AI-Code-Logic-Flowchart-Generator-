import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisRequest, AnalysisResponse } from '@/types/analysis';
import { cleanMermaidCode, isValidMermaidSyntax } from '@/utils/mermaid-validator';
import { generateStaticAnalysis } from '@/utils/static-flowchart-generator';

const SYSTEM_PROMPT = `
You are FlowSight, an expert static code analysis & software visualization engine.
Your task is to analyze user source code and return a single, strictly valid JSON object matching the JSON schema below.

### Rules for Mermaid Flowchart Generation:
1. The flowchart syntax MUST start with 'flowchart TD'.
2. Node IDs MUST be simple alphanumeric strings without spaces or special characters (e.g., Node1, Start, LoopCheck, Cond1).
3. All node labels MUST be enclosed in double quotes inside square brackets or decision diamonds. Example: Node1["Initialize low = 0, high = n - 1"] or Cond1{"is low <= high?"}.
4. Do NOT use unsupported special characters or raw HTML in node text.
5. For decision nodes, label edges clearly with ["Yes"] or ["No"] (e.g., Cond1 -->|Yes| Node2).
6. Represent functions, loops, recursions, and exception handlers accurately.
7. Keep node text concise and human-readable.

### Expected JSON Output Structure:
{
  "summary": "Brief 1-2 sentence overall summary of what this code does.",
  "mermaidCode": "flowchart TD\\nStart[\\"Start\\"] --> Init[\\"Initialize variables\\"] ...",
  "explanation": {
    "overview": "Detailed overview of the program's primary objective and mechanism.",
    "inputs": "Description of input parameters, types, or expected user inputs.",
    "outputs": "Description of return values, console output, or side effects.",
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
      "1. Enter function",
      "2. Evaluate condition",
      "3. Execute loop until low > high"
    ],
    "edgeCases": [
      {
        "scenario": "Empty input array",
        "behavior": "Returns -1 immediately without entering loop",
        "riskLevel": "low"
      }
    ],
    "timeComplexity": "O(log N) - Logarithmic time complexity because...",
    "spaceComplexity": "O(1) - Constant space complexity since..."
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

    // 2. API Key verification
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env.local file.',
        },
        { status: 500 }
      );
    }

    // 3. Gemini Client Initialization
    const genAI = new GoogleGenerativeAI(apiKey);

    // Primary models supported by Google Gemini API
    const MODEL_CANDIDATES = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-pro',
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

      // If all candidates failed, check if it was due to rate limits
      const isQuota =
        lastError?.status === 429 ||
        lastError?.message?.includes('429') ||
        lastError?.message?.includes('Quota');

      if (isQuota) {
        throw new Error(
          'Gemini API Free Tier rate limit reached. Please wait ~30-45 seconds before clicking analyze again, or get a new free API key from https://aistudio.google.com/.'
        );
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
