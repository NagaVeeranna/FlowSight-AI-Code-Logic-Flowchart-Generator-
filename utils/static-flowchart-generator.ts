import { AnalysisResponse, SupportedLanguage } from '@/types/analysis';

/**
 * Static AST & Rule-Based Code Parser & Flowchart Generator.
 * Serves as an instant zero-latency fallback engine when AI API keys hit quota limits.
 */
export function generateStaticAnalysis(code: string, language: SupportedLanguage): AnalysisResponse {
  const lines = code.split('\n').map((l) => l.trim()).filter(Boolean);
  
  // Extract function names or main logic block
  const funcMatch = code.match(/(?:def|function|public static|void|int|double|String)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/);
  const funcName = funcMatch ? funcMatch[1] : 'mainProcess';
  const rawArgs = funcMatch ? funcMatch[2].trim() : 'inputData';

  // Detect loop structures
  const hasLoops = /for\s*\(|while\s*\(|for\s+[a-zA-Z0-9_]+\s+in/i.test(code);
  const hasRecursion = funcMatch ? new RegExp(`\\b${funcName}\\s*\\(`, 'g').test(code.substring(code.indexOf('{') > 0 ? code.indexOf('{') : 20)) : false;
  const hasConditionals = /if\s*\(|else\s+if|elif|else\b|switch\s*\(/i.test(code);

  // Extract variables
  const variables: { name: string; type: string; purpose: string }[] = [];
  const varMatches = code.matchAll(/(?:let|const|var|int|double|float|String|auto)\s+([a-zA-Z0-9_]+)\s*=\s*([^;,\n]+)/g);
  for (const m of varMatches) {
    variables.push({
      name: m[1],
      type: 'Variable',
      purpose: `Stores value initialized as ${m[2].trim()}`,
    });
  }

  // Construct valid Mermaid Flowchart TD syntax dynamically
  const mermaidLines: string[] = ['flowchart TD'];
  mermaidLines.push(`  Start["Start: ${funcName}(${rawArgs})"]`);

  let nodeCounter = 1;
  let prevNode = 'Start';

  // 1. Inputs Node
  const inputNode = `Node${nodeCounter++}`;
  mermaidLines.push(`  ${inputNode}["Receive Input: ${rawArgs || 'parameters'}"]`);
  mermaidLines.push(`  ${prevNode} --> ${inputNode}`);
  prevNode = inputNode;

  // 2. Conditionals / Loop Nodes
  if (hasConditionals) {
    const condNode = `Cond${nodeCounter++}`;
    mermaidLines.push(`  ${condNode}{"Evaluate Conditional Logic"}`);
    mermaidLines.push(`  ${prevNode} --> ${condNode}`);

    const trueNode = `ExecTrue${nodeCounter++}`;
    const falseNode = `ExecFalse${nodeCounter++}`;
    mermaidLines.push(`  ${trueNode}["Execute Primary Branch"]`);
    mermaidLines.push(`  ${falseNode}["Execute Fallback / Else Branch"]`);

    mermaidLines.push(`  ${condNode} -->|True / Satisfied| ${trueNode}`);
    mermaidLines.push(`  ${condNode} -->|False / Default| ${falseNode}`);

    const mergeNode = `Merge${nodeCounter++}`;
    mermaidLines.push(`  ${mergeNode}["Synchronize Execution Flow"]`);
    mermaidLines.push(`  ${trueNode} --> ${mergeNode}`);
    mermaidLines.push(`  ${falseNode} --> ${mergeNode}`);
    prevNode = mergeNode;
  }

  if (hasLoops) {
    const loopCheck = `LoopCheck${nodeCounter++}`;
    const loopBody = `LoopBody${nodeCounter++}`;
    mermaidLines.push(`  ${loopCheck}{"Is Loop Condition Valid?"}`);
    mermaidLines.push(`  ${loopBody}["Execute Iteration & Update Pointers"]`);

    mermaidLines.push(`  ${prevNode} --> ${loopCheck}`);
    mermaidLines.push(`  ${loopCheck} -->|Yes| ${loopBody}`);
    mermaidLines.push(`  ${loopBody} --> ${loopCheck}`);
    
    const exitLoop = `ExitLoop${nodeCounter++}`;
    mermaidLines.push(`  ${exitLoop}["Exit Loop Routine"]`);
    mermaidLines.push(`  ${loopCheck} -->|No| ${exitLoop}`);
    prevNode = exitLoop;
  }

  if (hasRecursion) {
    const recNode = `RecCall${nodeCounter++}`;
    mermaidLines.push(`  ${recNode}["Recursive Call: ${funcName}(sub_problem)"]`);
    mermaidLines.push(`  ${prevNode} --> ${recNode}`);
    mermaidLines.push(`  ${recNode} -->|Stack Return| ${prevNode}`);
  }

  // Final Output / Return Node
  const endNode = `EndNode`;
  mermaidLines.push(`  ${endNode}["End & Return Result"]`);
  mermaidLines.push(`  ${prevNode} --> ${endNode}`);

  // Determine Complexity
  const timeComplexity = hasRecursion
    ? 'O(2^N) or O(N) - Recursive call stack evaluation'
    : hasLoops
    ? 'O(N) - Linear iteration over dataset'
    : 'O(1) - Constant time execution';

  const spaceComplexity = hasRecursion
    ? 'O(N) - Auxiliary call stack space'
    : 'O(1) - Constant space allocation';

  return {
    summary: `Analyzed ${language.toUpperCase()} implementation of routine '${funcName}'. Generates control flow graph and execution breakdown.`,
    mermaidCode: mermaidLines.join('\n'),
    explanation: {
      overview: `This program defines the function '${funcName}' with input parameters (${rawArgs}). It executes sequential statement steps, ${hasConditionals ? 'evaluates control conditionals, ' : ''}${hasLoops ? 'iterates over loop constructs, ' : ''}and returns the calculated output.`,
      inputs: rawArgs || 'Standard input arguments',
      outputs: 'Return value or state modification',
      lineByLine: lines.slice(0, 8).map((line, idx) => ({
        lineRange: `Line ${idx + 1}`,
        codeSnippet: line,
        explanation: `Executes instruction '${line}'`,
      })),
      variables: variables.length > 0 ? variables : [
        { name: 'inputData', type: 'Data', purpose: 'Primary input payload' },
      ],
      controlFlow: [
        `1. Enter function ${funcName}(${rawArgs})`,
        hasConditionals ? '2. Check decision condition statements' : '2. Execute linear statements',
        hasLoops ? '3. Enter loop iteration until condition terminates' : '3. Finalize execution',
        '4. Return computed output',
      ],
      edgeCases: [
        {
          scenario: 'Null or empty input dataset',
          behavior: 'Handles base boundary checks prior to loop entry',
          riskLevel: 'low',
        },
        hasRecursion
          ? {
              scenario: 'Deep stack recursion depth',
              behavior: 'Risk of StackOverflowError if base case fails',
              riskLevel: 'high',
            }
          : {
              scenario: 'Unexpected type or overflow',
              behavior: 'Type safety and boundary limit validation',
              riskLevel: 'medium',
            },
      ],
      timeComplexity,
      spaceComplexity,
    },
  };
}
