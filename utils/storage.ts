import { HistoryItem } from '@/types/analysis';

const STORAGE_KEY = 'flowsight_analysis_history_v1';
const MAX_HISTORY_ITEMS = 25;

export const HistoryStorage = {
  /**
   * Retrieves all saved analysis history items sorted by most recent
   */
  getAll(): HistoryItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: HistoryItem[] = JSON.parse(raw);
      return parsed.sort((a, b) => b.timestamp - a.timestamp);
    } catch (err) {
      console.error('Failed to parse history from localStorage:', err);
      return [];
    }
  },

  /**
   * Saves a new analysis item to local history
   */
  save(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
    const history = this.getAll();
    const newItem: HistoryItem = {
      ...item,
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };

    // Prepend new item and cap max storage items
    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Failed to save item to localStorage:', err);
    }

    return newItem;
  },

  /**
   * Deletes a single history item by ID
   */
  delete(id: string): HistoryItem[] {
    const history = this.getAll();
    const filtered = history.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to delete item from localStorage:', err);
    }
    return filtered;
  },

  /**
   * Clears all saved analysis history
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear history from localStorage:', err);
    }
  },
};
