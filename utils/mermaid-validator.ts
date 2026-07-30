/**
 * Sanitizes and validates Mermaid flowchart syntax before rendering.
 */
export function cleanMermaidCode(rawMermaid: string): string {
  if (!rawMermaid) return '';

  let cleaned = rawMermaid.trim();

  // Strip markdown code block fences if present (e.g., ```mermaid ... ```)
  cleaned = cleaned.replace(/^```(?:mermaid)?/i, '').replace(/```$/, '').trim();

  // Ensure it starts with a flowchart diagram definition if missing
  if (!/^(flowchart|graph)\s+(TD|TB|BT|RL|LR)/i.test(cleaned)) {
    cleaned = `flowchart TD\n${cleaned}`;
  }

  // Replace common invalid characters or unescaped quotes inside labels
  // Convert illegal smart quotes
  cleaned = cleaned.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  // Sanitize unescaped parentheses inside double-quoted square bracket node labels ["..."]
  cleaned = cleaned.replace(/\["([^"]*?)"\]/g, (_, labelContent) => {
    const sanitized = labelContent.replace(/\(/g, '#40;').replace(/\)/g, '#41;');
    return `["${sanitized}"]`;
  });

  // Sanitize unescaped parentheses inside double-quoted diamond node labels {"..."}
  cleaned = cleaned.replace(/\{"([^"]*?)"\}/g, (_, labelContent) => {
    const sanitized = labelContent.replace(/\(/g, '#40;').replace(/\)/g, '#41;');
    return `{"${sanitized}"}`;
  });

  // Sanitize unescaped parentheses inside edge label pipes |...|
  cleaned = cleaned.replace(/\|([^|]*?)\|/g, (_, edgeLabel) => {
    const sanitized = edgeLabel.replace(/\(/g, '#40;').replace(/\)/g, '#41;');
    return `|${sanitized}|`;
  });

  return cleaned;
}

/**
 * Basic syntax sanity checker for flowchart structure
 */
export function isValidMermaidSyntax(mermaidCode: string): { valid: boolean; error?: string } {
  const cleaned = cleanMermaidCode(mermaidCode);

  if (!cleaned) {
    return { valid: false, error: 'Empty Mermaid code string.' };
  }

  // Check for graph/flowchart header
  if (!/^(flowchart|graph)\s+/i.test(cleaned)) {
    return { valid: false, error: 'Missing flowchart or graph header definition.' };
  }

  // Check for balanced brackets in node definitions
  const openSquare = (cleaned.match(/\[/g) || []).length;
  const closeSquare = (cleaned.match(/\]/g) || []).length;
  if (openSquare !== closeSquare) {
    return { valid: false, error: `Unbalanced square brackets: ${openSquare} open vs ${closeSquare} close.` };
  }

  return { valid: true };
}
