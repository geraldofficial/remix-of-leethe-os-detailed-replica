'use client';

export interface ClipboardItem {
  type: 'file' | 'text';
  data: string | string[]; // file paths or text content
  operation: 'copy' | 'cut'; // determines if original should be deleted on paste
  timestamp: number;
}

class ClipboardService {
  private clipboard: ClipboardItem | null = null;
  private listeners: Set<() => void> = new Set();

  /**
   * Copy files or text to clipboard
   */
  copy(type: 'file' | 'text', data: string | string[]): void {
    this.clipboard = {
      type,
      data,
      operation: 'copy',
      timestamp: Date.now(),
    };
    this.notifyListeners();
    console.log('[v0] Clipboard copy:', { type, data });
  }

  /**
   * Cut files or text (will be deleted on paste)
   */
  cut(type: 'file' | 'text', data: string | string[]): void {
    this.clipboard = {
      type,
      data,
      operation: 'cut',
      timestamp: Date.now(),
    };
    this.notifyListeners();
    console.log('[v0] Clipboard cut:', { type, data });
  }

  /**
   * Get current clipboard item
   */
  get(): ClipboardItem | null {
    return this.clipboard;
  }

  /**
   * Check if clipboard has files
   */
  hasFiles(): boolean {
    return this.clipboard?.type === 'file' && this.clipboard.operation === 'copy';
  }

  /**
   * Check if clipboard has files to cut
   */
  hasCutFiles(): boolean {
    return this.clipboard?.type === 'file' && this.clipboard.operation === 'cut';
  }

  /**
   * Check if clipboard has text
   */
  hasText(): boolean {
    return this.clipboard?.type === 'text' && this.clipboard.operation === 'copy';
  }

  /**
   * Clear clipboard
   */
  clear(): void {
    this.clipboard = null;
    this.notifyListeners();
    console.log('[v0] Clipboard cleared');
  }

  /**
   * Subscribe to clipboard changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const clipboardService = new ClipboardService();
