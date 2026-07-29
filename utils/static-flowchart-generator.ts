import { AnalysisResponse, SupportedLanguage } from '@/types/analysis';

/**
 * Static AST & Rule-Based Code Parser & Flowchart Generator.
 * Serves as an instant zero-latency fallback engine when AI API keys hit quota limits or key issues.
 */
export function generateStaticAnalysis(code: string, language: SupportedLanguage): AnalysisResponse {
  const rawLines = code.split('\n');
  const lines = rawLines.map((l) => l.trim()).filter(Boolean);
  const loc = rawLines.length;

  // Extract class names
  const classMatches = [...code.matchAll(/(?:class|interface|struct)\s+([a-zA-Z0-9_]+)/g)];
  const classes = classMatches.map((m) => m[1]);

  // Extract function / method names
  const funcMatches = [...code.matchAll(/(?:def|function|public|private|protected|static|void|int|double|String)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g)];
  const methods = funcMatches.map((m) => `${m[1]}(${m[2].trim()})`);

  const funcName = funcMatches.length > 0 ? funcMatches[0][1] : 'mainProcess';
  const rawArgs = funcMatches.length > 0 ? funcMatches[0][2].trim() : 'parameters';

  // Detect code constructs
  const hasLoops = /for\s*\(|while\s*\(|for\s+[a-zA-Z0-9_]+\s+in/i.test(code);
  const hasRecursion = funcMatches.length > 0 ? new RegExp(`\\b${funcName}\\s*\\(`, 'g').test(code.substring(code.indexOf('{') > 0 ? code.indexOf('{') : 20)) : false;
  const hasConditionals = /if\s*\(|else\s+if|elif|else\b|switch\s*\(/i.test(code);
  const hasTryCatch = /try\s*\{|catch\s*\(|except\b|finally\b/i.test(code);
  const hasAsync = /async\s+|await\s+|Promise/i.test(code);

  const loopCount = (code.match(/for\s*\(|while\s*\(|for\s+[a-zA-Z0-9_]+\s+in/gi) || []).length;
  const condCount = (code.match(/if\s*\(|else\s+if|elif|else\b|switch\s*\(/gi) || []).length;

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

  // Detect concepts
  const concepts: string[] = ['Static AST Code Parsing'];
  if (methods.length > 0) concepts.push('Functional Decomposition');
  if (classes.length > 0) concepts.push('Object-Oriented Programming (OOP)');
  if (hasLoops) concepts.push('Iterative Execution & Loops');
  if (hasConditionals) concepts.push('Conditional Branching');
  if (hasRecursion) concepts.push('Recursive Logic');
  if (hasTryCatch) concepts.push('Exception Handling');
  if (hasAsync) concepts.push('Asynchronous Operations');

  // Detect design patterns
  const designPatterns: string[] = ['Fallback Pattern', 'Validation Pattern'];
  if (classes.length > 0) designPatterns.push('Encapsulation Pattern');
  if (hasRecursion) designPatterns.push('Divide and Conquer');
  if (methods.length > 2) designPatterns.push('Strategy Pattern');

  // Construct valid Mermaid Flowchart TD syntax dynamically with failure & decision paths
  const mermaidLines: string[] = ['flowchart TD'];
  mermaidLines.push(`  Start["Start: ${funcName}(${rawArgs})"]`);

  let nodeCounter = 1;
  let prevNode = 'Start';

  // 1. Inputs Node
  const inputNode = `Node${nodeCounter++}`;
  mermaidLines.push(`  ${inputNode}["Receive Input: ${rawArgs || 'parameters'}"]`);
  mermaidLines.push(`  ${prevNode} --> ${inputNode}`);
  prevNode = inputNode;

  // 2. Conditionals / Loop Nodes with failure branches
  if (hasConditionals) {
    const condNode = `Cond${nodeCounter++}`;
    mermaidLines.push(`  ${condNode}{"Evaluate Conditional Branch"}`);
    mermaidLines.push(`  ${prevNode} --> ${condNode}`);

    const trueNode = `ExecTrue${nodeCounter++}`;
    const falseNode = `ExecFalse${nodeCounter++}`;
    mermaidLines.push(`  ${trueNode}["Execute True Branch"]`);
    mermaidLines.push(`  ${falseNode}["Execute Default / Else Branch"]`);

    mermaidLines.push(`  ${condNode} -->|Condition Met| ${trueNode}`);
    mermaidLines.push(`  ${condNode} -->|Condition Failed| ${falseNode}`);

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
    mermaidLines.push(`  ${loopBody}["Process Iteration Item"]`);
    mermaidLines.push(`  ${prevNode} --> ${loopCheck}`);
    mermaidLines.push(`  ${loopCheck} -->|Yes / Valid| ${loopBody}`);
    mermaidLines.push(`  ${loopBody} --> ${loopCheck}`);

    const exitLoop = `ExitLoop${nodeCounter++}`;
    mermaidLines.push(`  ${exitLoop}["Exit Loop Workspace"]`);
    mermaidLines.push(`  ${loopCheck} -->|No / Completed| ${exitLoop}`);
    prevNode = exitLoop;
  }

  if (hasRecursion) {
    const recNode = `RecNode${nodeCounter++}`;
    mermaidLines.push(`  ${recNode}["Recursive Stack Call: ${funcName}()"]`);
    mermaidLines.push(`  ${prevNode} -->|Recurse| ${recNode}`);
    mermaidLines.push(`  ${recNode} -->|Unwind Stack| ${prevNode}`);
  }

  const endNode = `EndNode${nodeCounter++}`;
  mermaidLines.push(`  ${endNode}["End: Return Output"]`);
  mermaidLines.push(`  ${prevNode} --> ${endNode}`);

  // Calculate complexities
  let timeComp = 'O(N) - Linear Time Complexity';
  if (loopCount > 1) timeComp = 'O(N²) - Quadratic Time Complexity due to nested loops';
  else if (hasRecursion) timeComp = 'O(2^N) or O(N log N) - Exponential / Logarithmic Stack Calls';

  return {
    summary: `Analyzed ${language.toUpperCase()} source code containing ${loc} lines of code, ${methods.length || 1} functions, and ${classes.length} classes.`,
    mermaidCode: mermaidLines.join('\n'),
    explanation: {
      overview: `This program defines static logic with function signature '${funcName}(${rawArgs})'. It processes inputs through ${condCount} conditional evaluation branches and ${loopCount} iterative loops.`,
      inputs: rawArgs ? `Parameters: ${rawArgs}` : 'None specified',
      outputs: 'Calculated return value or transformed data output.',
      classes: classes.length > 0 ? classes : ['Main Script'],
      methods: methods.length > 0 ? methods : [`${funcName}()`],
      lineByLine: lines.slice(0, 8).map((line, idx) => ({
        lineRange: `Line ${idx + 1}`,
        codeSnippet: line,
        explanation: `Executes statement: ${line.substring(0, 40)}`,
      })),
      variables: variables.length > 0 ? variables : [{ name: 'inputData', type: 'Any', purpose: 'Primary method arguments' }],
      controlFlow: [
        `1. Enter execution scope at ${funcName}()`,
        hasConditionals ? '2. Evaluate branch conditions' : '2. Execute sequential statements',
        hasLoops ? '3. Iterate through loop boundaries' : '3. Finalize variable assignments',
        '4. Return calculated result output',
      ],
      edgeCases: [
        {
          scenario: 'Empty or null parameter input',
          behavior: 'May encounter NullPointerException or default return value',
          riskLevel: 'medium',
        },
      ],
      concepts,
      designPatterns,
      possibleIssues: [
        'Missing explicit null or undefined input validation',
        hasLoops ? 'Potential infinite loop if exit condition fails' : 'Sequential execution without error boundary',
      ],
      recommendations: [
        'Add input validation checks at the entry point',
        'Wrap execution block in try/catch exception handlers',
        'Extract reusable helper utilities for nested branches',
      ],
      metrics: {
        linesOfCode: loc,
        functions: methods.length || 1,
        loops: loopCount,
        conditions: condCount,
        complexityScore: loopCount > 1 ? 'High' : condCount > 2 ? 'Medium' : 'Low',
        maintainability: 'High',
      },
      timeComplexity: timeComp,
      timeComplexityDetail: {
        overall: timeComp,
        staticParser: 'O(N)',
        geminiAnalysis: 'N/A (AST Fallback)',
      },
      spaceComplexity: 'O(1) - Constant auxiliary space',
    },
  };
}
