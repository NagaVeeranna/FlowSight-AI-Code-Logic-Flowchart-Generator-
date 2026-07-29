# FlowSight – REST API Documentation

FlowSight exposes a serverless REST endpoint for processing source code and generating structured logic explanations and Mermaid flowchart diagrams.

---

## Endpoint Specification

### `POST /api/analyze`

Analyzes source code and returns algorithm overview, step-by-step breakdown, edge cases, complexity estimates, and valid Mermaid flowchart syntax.

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
  "mermaidCode": "flowchart TD\nStart[\"Start binary_search\"] --> Init[\"Initialize low=0, high=len-1\"]\nInit --> LoopCheck{\"is low <= high?\"}\nLoopCheck -->|Yes| CalcMid[\"Calculate mid = (low + high) // 2\"]\nCalcMid --> CheckEqual{\"arr[mid] == target?\"}\nCheckEqual -->|Yes| ReturnMid[\"Return mid\"]\nCheckEqual -->|No| CheckLess{\"arr[mid] < target?\"}\nCheckLess -->|Yes| MoveLow[\"low = mid + 1\"]\nCheckLess -->|No| MoveHigh[\"high = mid - 1\"]\nMoveLow --> LoopCheck\nMoveHigh --> LoopCheck\nLoopCheck -->|No| ReturnNotFound[\"Return -1\"]",
  "explanation": {
    "overview": "Binary search divides the search space in half during each iteration until the target value is found or the array is exhausted.",
    "inputs": "Sorted array `arr`, target value `target`",
    "outputs": "Integer index of target if found, else -1",
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
        "purpose": "Lower bound index of search range."
      },
      {
        "name": "high",
        "type": "Integer",
        "purpose": "Upper bound index of search range."
      }
    ],
    "controlFlow": [
      "1. Initialize low and high pointers.",
      "2. Loop while low <= high.",
      "3. Compute mid index and compare with target.",
      "4. Adjust bounds or return mid."
    ],
    "edgeCases": [
      {
        "scenario": "Empty input array",
        "behavior": "Returns -1 immediately without entering loop.",
        "riskLevel": "low"
      }
    ],
    "timeComplexity": "O(log N) - Search space is halved each iteration.",
    "spaceComplexity": "O(1) - Constant auxiliary space."
  }
}
```

---

#### Error Responses

##### `HTTP 400 Bad Request`
Occurs when request body validation fails (empty code or unsupported language).
```json
{
  "error": "Source code input is required and cannot be empty."
}
```

##### `HTTP 500 Internal Server Error`
Occurs when `GEMINI_API_KEY` is missing or AI provider encounters an error.
```json
{
  "error": "GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env.local file."
}
```
