import { SampleCode, SupportedLanguage, LanguageOption, StarterTemplate } from '@/types/analysis';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'python', name: 'Python 3', extension: '.py', monacoLanguage: 'python' },
  { id: 'javascript', name: 'JavaScript / Node.js', extension: '.js', monacoLanguage: 'javascript' },
  { id: 'java', name: 'Java', extension: '.java', monacoLanguage: 'java' },
  { id: 'cpp', name: 'C++', extension: '.cpp', monacoLanguage: 'cpp' },
  { id: 'c', name: 'C', extension: '.c', monacoLanguage: 'c' },
];

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'starter_python',
    language: 'python',
    name: 'Python Starter',
    code: `def process_data(items):
    """
    Sample starter function to process list of items.
    """
    results = []
    for item in items:
        if item % 2 == 0:
            results.append(item * 2)
        else:
            results.append(item + 1)
    return results

# Main entry point
if __name__ == "__main__":
    sample_list = [1, 2, 3, 4, 5, 6]
    output = process_data(sample_list)
    print("Processed Output:", output)`
  },
  {
    id: 'starter_javascript',
    language: 'javascript',
    name: 'JavaScript Starter',
    code: `/**
 * Calculate order summary with tax & discounts
 */
function calculateOrderTotal(items, discountCode = null) {
  let subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  if (discountCode === 'SAVE10') {
    subtotal *= 0.90;
  } else if (discountCode === 'VIP20') {
    subtotal *= 0.80;
  }

  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    grandTotal: grandTotal.toFixed(2)
  };
}

const cart = [
  { name: 'Laptop Stand', price: 29.99, quantity: 1 },
  { name: 'Wireless Mouse', price: 49.99, quantity: 2 }
];

console.log('Order Summary:', calculateOrderTotal(cart, 'SAVE10'));`
  },
  {
    id: 'starter_java',
    language: 'java',
    name: 'Java Starter Class',
    code: `import java.util.ArrayList;
import java.util.List;

public class Solution {
    public static List<Integer> filterEvenNumbers(int[] numbers) {
        List<Integer> evens = new ArrayList<>();
        for (int num : numbers) {
            if (num % 2 == 0) {
                evens.add(num);
            }
        }
        return evens;
    }

    public static void main(String[] args) {
        int[] data = {12, 7, 19, 24, 33, 40, 50};
        List<Integer> result = filterEvenNumbers(data);
        System.out.println("Even Numbers: " + result);
    }
}`
  },
  {
    id: 'starter_cpp',
    language: 'cpp',
    name: 'C++ Starter Template',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int findMaxElement(const vector<int>& nums) {
        if (nums.empty()) return -1;
        int maxVal = nums[0];
        for (size_t i = 1; i < nums.size(); ++i) {
            if (nums[i] > maxVal) {
                maxVal = nums[i];
            }
        }
        return maxVal;
    }
};

int main() {
    Solution sol;
    vector<int> numbers = {15, 89, 42, 7, 94, 61};
    int maxNum = sol.findMaxElement(numbers);
    cout << "Maximum Element: " << maxNum << endl;
    return 0;
}`
  },
  {
    id: 'starter_c',
    language: 'c',
    name: 'C Starter Main',
    code: `#include <stdio.h>
#include <stdlib.h>

void computeFactorial(int n) {
    long long fact = 1;
    if (n < 0) {
        printf("Error: Factorial of negative number doesn't exist.\\n");
        return;
    }
    for (int i = 1; i <= n; ++i) {
        fact *= i;
    }
    printf("Factorial of %d = %lld\\n", n, fact);
}

int main() {
    int num = 7;
    computeFactorial(num);
    return 0;
}`
  }
];

export const SAMPLE_CODES: SampleCode[] = [
  {
    id: 'binary_search_py',
    title: 'Binary Search (Python)',
    language: 'python',
    category: 'Algorithms',
    description: 'Logarithmic O(log N) target search in a sorted array using divide and conquer.',
    code: `def binary_search(arr, target):
    """
    Performs binary search on a sorted array.
    Returns index of target if found, else -1.
    """
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        
        if arr[mid] == target:
            return mid  # Element found
        elif arr[mid] < target:
            low = mid + 1  # Search right half
        else:
            high = mid - 1  # Search left half
            
    return -1  # Target not in array

# Example usage
numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target_val = 23
result = binary_search(numbers, target_val)
print(f"Target found at index: {result}")`,
  },
  {
    id: 'fibonacci_dp_py',
    title: 'Fibonacci Memoization (Python)',
    language: 'python',
    category: 'Dynamic Programming',
    description: 'Optimal O(N) Dynamic Programming with memoization hash table.',
    code: `def fib_memo(n, memo={}):
    """
    Computes Nth Fibonacci number using top-down Dynamic Programming.
    """
    if n in memo:
        return memo[n]
    if n <= 1:
        return n

    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

# Test fibonacci calculation
n_terms = 10
print(f"The {n_terms}th Fibonacci number is: {fib_memo(n_terms)}")`,
  },
  {
    id: 'merge_sort_java',
    title: 'Merge Sort (Java)',
    language: 'java',
    category: 'Algorithms',
    description: 'Recursive O(N log N) divide-and-conquer sorting algorithm.',
    code: `public class MergeSort {
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;

            // Sort first and second halves
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);

            // Merge the sorted halves
            merge(arr, left, mid, right);
        }
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int[] L = new int[n1];
        int[] R = new int[n2];

        for (int i = 0; i < n1; ++i) L[i] = arr[left + i];
        for (int j = 0; j < n2; ++j) R[j] = arr[mid + 1 + j];

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }

        while (i < n1) { arr[k] = L[i]; i++; k++; }
        while (j < n2) { arr[k] = R[j]; j++; k++; }
    }
}`,
  },
  {
    id: 'jwt_auth_js',
    title: 'JWT Authentication Middleware (JavaScript)',
    language: 'javascript',
    category: 'Web & API',
    description: 'Express.js authorization middleware with bearer token verification & role check.',
    code: `const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.user = user;
    next();
  });
}`,
  },
  {
    id: 'linked_list_reverse_cpp',
    title: 'Reverse Singly Linked List (C++)',
    language: 'cpp',
    category: 'Data Structures',
    description: 'In-place iterative reversal of pointer links in a singly linked list.',
    code: `#include <iostream>

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
public:
    Node* reverseList(Node* head) {
        Node* prev = nullptr;
        Node* current = head;
        Node* nextTemp = nullptr;

        while (current != nullptr) {
            nextTemp = current->next; // Store next node
            current->next = prev;     // Reverse current node's pointer
            prev = current;           // Move prev forward
            current = nextTemp;       // Move current forward
        }

        return prev; // New head of reversed list
    }
};`,
  },
  {
    id: 'dfs_graph_c',
    title: 'Depth-First Search DFS (C)',
    language: 'c',
    category: 'Graphs',
    description: 'Recursive adjacency list graph traversal tracking visited vertices.',
    code: `#include <stdio.h>
#include <stdlib.h>

#define MAX_VERTICES 20

struct Node {
    int vertex;
    struct Node* next;
};

struct Graph {
    int numVertices;
    struct Node** adjLists;
    int* visited;
};

void DFS(struct Graph* graph, int vertex) {
    struct Node* adjList = graph->adjLists[vertex];
    struct Node* temp = adjList;

    graph->visited[vertex] = 1;
    printf("Visited vertex %d\\n", vertex);

    while (temp != NULL) {
        int connectedVertex = temp->vertex;

        if (graph->visited[connectedVertex] == 0) {
            DFS(graph, connectedVertex);
        }
        temp = temp->next;
    }
}`,
  },
];
