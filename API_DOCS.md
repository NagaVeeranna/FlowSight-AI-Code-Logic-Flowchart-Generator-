# FlowSight – REST API Documentation

FlowSight exposes a serverless REST endpoint for processing source code and generating evidence-based static logic explanations, quality metrics, and Mermaid flowchart diagrams.

---

## Endpoint Specification

### `POST /api/analyze`

Analyzes source code and returns project profiling, detected algorithms, OOP concepts, security audit, code metrics, quality scorecard, complexity estimates, and valid Mermaid flowchart syntax.

#### Request Headers
| Header | Value | Required |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Yes |

#### Request Body
```json
{
  "language": "python",
  "code": "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1"
}
```

##### Input Parameters
* `language` *(string, required)*: One of `python`, `java`, `javascript`, `cpp`, `c`.
* `code` *(string, required)*: Source code string (max 15,000 characters).

---

#### Success Response (`HTTP 200 OK`)
```json
{
  "summary": "Performs binary search on a sorted array to locate the target index in logarithmic time.",
  "mermaidCode": "flowchart TD\n  Start[\"Start: binary_search(arr, target)\"] --> Input[\"Receive Parameters: arr, target\"]\n  Input --> LoopCheck{\"is low <= high?\"}\n  LoopCheck -->|Yes / Valid| CalcMid[\"mid = (low + high) // 2\"]\n  CalcMid --> CheckTarget{\"arr[mid] == target?\"}\n  CheckTarget -->|Yes| ReturnMid[\"Return mid\"]\n  CheckTarget -->|No| CheckLess{\"arr[mid] < target?\"}\n  CheckLess -->|Yes| MoveLow[\"low = mid + 1\"]\n  CheckLess -->|No| MoveHigh[\"high = mid - 1\"]\n  MoveLow --> LoopCheck\n  MoveHigh --> LoopCheck\n  LoopCheck -->|No / Exhausted| ReturnNotFound[\"Return -1\"]",
  "explanation": {
    "projectType": "Algorithm Script",
    "overview": "Binary search divides the search space in half during each iteration until target is located.",
    "inputs": "Sorted array `arr`, target integer `target`",
    "outputs": "Integer index of target if found, else -1",
    "classes": ["Main Execution Scope"],
    "methods": ["binary_search(arr, target)"],
    "oopConcepts": ["Functional Decomposition"],
    "detectedAlgorithms": ["Binary Search (O(log N))"],
    "detectedDataStructures": ["Array"],
    "lineByLine": [
      {
        "lineRange": "Lines 1-2",
        "codeSnippet": "low, high = 0, len(arr) - 1",
        "explanation": "Initializes pointer bounds to cover the full array range."
      }
    ],
    "variables": [
      {
        "name": "low",
        "type": "Integer",
        "purpose": "Lower bound pointer of search window."
      },
      {
        "name": "high",
        "type": "Integer",
        "purpose": "Upper bound pointer of search window."
      }
    ],
    "controlFlow": [
      "1. Enter function binary_search(arr, target)",
      "2. Initialize pointers low = 0 and high = len(arr) - 1",
      "3. Iterate loop while low <= high",
      "4. Calculate midpoint mid and compare arr[mid]",
      "5. Return index mid or -1 if exhausted"
    ],
    "edgeCases": [
      {
        "scenario": "Empty or null input array",
        "behavior": "Returns -1 immediately without loop execution",
        "riskLevel": "low"
      }
    ],
    "concepts": ["Iterative Execution & Loops", "Binary Search"],
    "designPatterns": ["Divide and Conquer", "Validation Pattern"],
    "securityAnalysis": [
      "No critical hardcoded security vulnerabilities detected"
    ],
    "codeSmells": [
      "Missing inline docstring documentation"
    ],
    "possibleIssues": [
      "Missing input array null parameter validation check"
    ],
    "recommendations": [
      "Add explicit null and array bounds validation at function start"
    ],
    "metrics": {
      "linesOfCode": 11,
      "functions": 1,
      "loops": 1,
      "conditions": 2,
      "complexityScore": "Low",
      "maintainability": "High",
      "nestingDepth": 2,
      "commentsCount": 0
    },
    "ratings": {
      "overallScore": 92,
      "maintainabilityRating": "A",
      "readabilityRating": "A",
      "performanceRating": "A",
      "reliabilityRating": "A"
    },
    "timeComplexity": "O(log N) - Logarithmic time complexity",
    "timeComplexityDetail": {
      "overall": "O(log N)",
      "staticParser": "O(N)",
      "geminiAnalysis": "O(1)"
    },
    "spaceComplexity": "O(1) - Constant auxiliary space"
  }
}
```

---

#### Error Responses

##### HTTP 400 Bad Request
```json
{
  "error": "Source code input is required and cannot be empty."
}
```

##### HTTP 500 Internal Server Error (Auto-Handled Fallback)
*(FlowSight API routes catch model quota errors or API key issues automatically and return HTTP 200 with local static AST analysis).*
