'use client';

import { Copy, Scissors, Clipboard, Trash2, Edit2, Eye } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { clipboardService } from '@/lib/services/clipboard-service';

export interface ContextMenuHandlers {
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
  onPreview?: () => void;
  [key: string]: (() => void) | undefined;
}

/**
 * Generate file/folder context menu items
 */
export function generateFileContextMenu(
  handlers: ContextMenuHandlers,
  options: {
    canCut?: boolean;
    canCopy?: boolean;
    canDelete?: boolean;
    canRename?: boolean;
    canPreview?: boolean;
  } = {}
): MenuItem[] {
  const {
    canCut = true,
    canCopy = true,
    canDelete = true,
    canRename = true,
    canPreview = true,
  } = options;

  const items: MenuItem[] = [];

  if (canPreview && handlers.onPreview) {
    items.push({
      label: 'Preview',
      icon: <Eye size={16} />,
      onClick: handlers.onPreview,
      shortcut: 'Space',
    });
    items.push({ separator: true });
  }

  if (canCut && handlers.onCut) {
    items.push({
      label: 'Cut',
      icon: <Scissors size={16} />,
      onClick: handlers.onCut,
      shortcut: 'Cmd+X',
    });
  }

  if (canCopy && handlers.onCopy) {
    items.push({
      label: 'Copy',
      icon: <Copy size={16} />,
      onClick: handlers.onCopy,
      shortcut: 'Cmd+C',
    });
  }

  if (handlers.onPaste) {
    const hasClipboard = clipboardService.get();
    items.push({
      label: 'Paste',
      icon: <Clipboard size={16} />,
      onClick: handlers.onPaste,
      shortcut: 'Cmd+V',
      disabled: !hasClipboard,
    });
  }

  if (canRename && handlers.onRename) {
    items.push({
      label: 'Rename',
      icon: <Edit2 size={16} />,
      onClick: handlers.onRename,
      shortcut: 'Return',
    });
  }

  if (canDelete && handlers.onDelete) {
    items.push({
      label: 'Delete',
      icon: <Trash2 size={16} />,
      onClick: handlers.onDelete,
      shortcut: 'Delete',
      className: 'text-red-500 hover:text-red-600',
    });
  }

  return items;
}

/**
 * Generate text editor context menu items
 */
export function generateTextContextMenu(
  handlers: ContextMenuHandlers
): MenuItem[] {
  return [
    {
      label: 'Cut',
      icon: <Scissors size={16} />,
      onClick: handlers.onCut,
      shortcut: 'Cmd+X',
    },
    {
      label: 'Copy',
      icon: <Copy size={16} />,
      onClick: handlers.onCopy,
      shortcut: 'Cmd+C',
    },
    {
      label: 'Paste',
      icon: <Clipboard size={16} />,
      onClick: handlers.onPaste,
      shortcut: 'Cmd+V',
      disabled: !clipboardService.get(),
    },
  ];
}

/**
 * Generate generic desktop context menu items
 */
export function generateDesktopContextMenu(
  handlers: ContextMenuHandlers
): MenuItem[] {
  return [
    {
      label: 'New Folder',
      onClick: handlers.onRename,
      shortcut: 'Cmd+Shift+N',
    },
    {
      label: 'Paste',
      icon: <Clipboard size={16} />,
      onClick: handlers.onPaste,
      shortcut: 'Cmd+V',
      disabled: !clipboardService.get(),
    },
    { separator: true },
    {
      label: 'Sort By',
      onClick: () => {}, // Submenu would be handled separately
      disabled: true,
    },
    {
      label: 'Refresh',
      onClick: handlers.onPreview,
      shortcut: 'Cmd+R',
    },
  ];
}
