import { SampleCode, SupportedLanguage, LanguageOption } from '@/types/analysis';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'python', name: 'Python 3', extension: '.py', monacoLanguage: 'python' },
  { id: 'javascript', name: 'JavaScript / Node.js', extension: '.js', monacoLanguage: 'javascript' },
  { id: 'java', name: 'Java', extension: '.java', monacoLanguage: 'java' },
  { id: 'cpp', name: 'C++', extension: '.cpp', monacoLanguage: 'cpp' },
  { id: 'c', name: 'C', extension: '.c', monacoLanguage: 'c' },
];

export const SAMPLE_CODES: SampleCode[] = [
  {
    id: 'binary_search_py',
    title: 'Binary Search (Python)',
    language: 'python',
    category: 'Algorithms',
    description: 'Logarithmic target search in a sorted array using divide and conquer.',
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
    category: 'Algorithms',
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
