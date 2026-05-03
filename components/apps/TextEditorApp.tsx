'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOSStore } from '@/lib/stores/os-store';
import { fileSystem } from '@/lib/os/filesystem';
import {
  Save,
  FileText,
  FolderOpen,
  FilePlus,
  Undo,
  Redo,
  Copy,
  Scissors,
  Clipboard,
  Search,
  Replace,
  X,
  ChevronDown,
} from 'lucide-react';

interface TextEditorAppProps {
  windowId: string;
  initialFile?: string;
}

interface Tab {
  id: string;
  name: string;
  path: string | null;
  content: string;
  savedContent: string;
  isModified: boolean;
}

export function TextEditorApp({ windowId, initialFile }: TextEditorAppProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'new-1',
      name: 'Untitled',
      path: null,
      content: '',
      savedContent: '',
      isModified: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('new-1');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [savePath, setSavePath] = useState('/Users/Guest/Documents/');
  const [saveFileName, setSaveFileName] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [currentOpenPath, setCurrentOpenPath] = useState('/Users/Guest/Documents');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  useEffect(() => {
    if (initialFile) {
      loadFile(initialFile);
    }
  }, [initialFile]);

  const loadFile = async (path: string) => {
    try {
      const file = await fileSystem.getNode(path);
      if (file && file.type === 'file') {
        const content = file.content || '';
        const existingTab = tabs.find((t) => t.path === path);
        if (existingTab) {
          setActiveTabId(existingTab.id);
        } else {
          const newTab: Tab = {
            id: `file-${Date.now()}`,
            name: file.name,
            path: path,
            content: content,
            savedContent: content,
            isModified: false,
          };
          setTabs((prev) => [...prev, newTab]);
          setActiveTabId(newTab.id);
        }
      }
    } catch (error) {
      console.error('Failed to load file:', error);
    }
  };

  const loadFilesForOpen = async (path: string) => {
    const items = await fileSystem.listDirectory(path);
    setFiles(items.filter((f) => f.type === 'directory' || f.name.match(/\.(txt|md|js|ts|jsx|tsx|json|css|html|xml|yaml|yml|ini|conf|log|sh|py|rb|go|rs|c|cpp|h|hpp|java|kt|swift|sql)$/i)));
    setCurrentOpenPath(path);
  };

  const handleNewFile = () => {
    const newTab: Tab = {
      id: `new-${Date.now()}`,
      name: 'Untitled',
      path: null,
      content: '',
      savedContent: '',
      isModified: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setShowMenu(null);
  };

  const handleSave = async () => {
    if (!activeTab) return;
    
    if (activeTab.path) {
      await fileSystem.writeFile(activeTab.path, activeTab.content);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab.id
            ? { ...t, savedContent: t.content, isModified: false }
            : t
        )
      );
    } else {
      setSaveFileName(activeTab.name === 'Untitled' ? '' : activeTab.name);
      setShowSaveDialog(true);
    }
    setShowMenu(null);
  };

  const handleSaveAs = async () => {
    if (!activeTab) return;
    setSaveFileName(activeTab.name === 'Untitled' ? '' : activeTab.name);
    setShowSaveDialog(true);
    setShowMenu(null);
  };

  const handleSaveConfirm = async () => {
    if (!activeTab || !saveFileName) return;
    
    const fullPath = savePath.endsWith('/') 
      ? `${savePath}${saveFileName}` 
      : `${savePath}/${saveFileName}`;
    
    await fileSystem.writeFile(fullPath, activeTab.content);
    
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTab.id
          ? {
              ...t,
              name: saveFileName,
              path: fullPath,
              savedContent: t.content,
              isModified: false,
            }
          : t
      )
    );
    setShowSaveDialog(false);
  };

  const handleOpen = () => {
    loadFilesForOpen('/Users/Guest/Documents');
    setShowOpenDialog(true);
    setShowMenu(null);
  };

  const handleOpenFile = async (file: any) => {
    if (file.type === 'directory') {
      loadFilesForOpen(file.path);
    } else {
      await loadFile(file.path);
      setShowOpenDialog(false);
    }
  };

  const handleCloseTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (tabs.length === 1) {
      handleNewFile();
    }
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
    if (activeTabId === tabId) {
      const remaining = tabs.filter((t) => t.id !== tabId);
      if (remaining.length > 0) {
        setActiveTabId(remaining[remaining.length - 1].id);
      }
    }
  };

  const handleContentChange = (content: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, content, isModified: content !== t.savedContent }
          : t
      )
    );
  };

  const handleFind = () => {
    if (!activeTab || !findText) return;
    const textarea = document.querySelector(`#editor-${activeTabId}`) as HTMLTextAreaElement;
    if (textarea) {
      const index = activeTab.content.indexOf(findText, textarea.selectionEnd);
      if (index !== -1) {
        textarea.focus();
        textarea.setSelectionRange(index, index + findText.length);
      }
    }
  };

  const handleReplace = () => {
    if (!activeTab || !findText) return;
    const newContent = activeTab.content.replace(findText, replaceText);
    handleContentChange(newContent);
  };

  const handleReplaceAll = () => {
    if (!activeTab || !findText) return;
    const newContent = activeTab.content.split(findText).join(replaceText);
    handleContentChange(newContent);
  };

  const getLineNumbers = (content: string) => {
    const lines = content.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white">
      {/* Menu Bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 border-b border-zinc-700 text-sm">
        <div className="relative">
          <button
            onClick={() => setShowMenu(showMenu === 'file' ? null : 'file')}
            className="px-3 py-1 hover:bg-zinc-700 rounded"
          >
            File
          </button>
          {showMenu === 'file' && (
            <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-50 min-w-[180px]">
              <button onClick={handleNewFile} className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center gap-2">
                <FilePlus size={14} /> New File
              </button>
              <button onClick={handleOpen} className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center gap-2">
                <FolderOpen size={14} /> Open...
              </button>
              <div className="border-t border-zinc-700 my-1" />
              <button onClick={handleSave} className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center gap-2">
                <Save size={14} /> Save
              </button>
              <button onClick={handleSaveAs} className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center gap-2">
                <Save size={14} /> Save As...
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(showMenu === 'edit' ? null : 'edit')}
            className="px-3 py-1 hover:bg-zinc-700 rounded"
          >
            Edit
          </button>
          {showMenu === 'edit' && (
            <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-50 min-w-[180px]">
              <button onClick={() => { setShowFindReplace(true); setShowMenu(null); }} className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center gap-2">
                <Search size={14} /> Find & Replace
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(showMenu === 'view' ? null : 'view')}
            className="px-3 py-1 hover:bg-zinc-700 rounded"
          >
            View
          </button>
          {showMenu === 'view' && (
            <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-50 min-w-[180px]">
              <button onClick={() => { setFontSize(f => Math.min(f + 2, 24)); setShowMenu(null); }} className="w-full px-4 py-2 text-left hover:bg-zinc-700">
                Zoom In
              </button>
              <button onClick={() => { setFontSize(f => Math.max(f - 2, 10)); setShowMenu(null); }} className="w-full px-4 py-2 text-left hover:bg-zinc-700">
                Zoom Out
              </button>
              <div className="border-t border-zinc-700 my-1" />
              <button onClick={() => { setWordWrap(!wordWrap); setShowMenu(null); }} className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center justify-between">
                Word Wrap
                {wordWrap && <span className="text-blue-400">✓</span>}
              </button>
              <button onClick={() => { setLineNumbers(!lineNumbers); setShowMenu(null); }} className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center justify-between">
                Line Numbers
                {lineNumbers && <span className="text-blue-400">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-zinc-850 border-b border-zinc-700 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 border-r border-zinc-700 cursor-pointer min-w-[120px] max-w-[200px] ${
              tab.id === activeTabId ? 'bg-zinc-900' : 'bg-zinc-800 hover:bg-zinc-750'
            }`}
          >
            <FileText size={14} className="text-zinc-400 flex-shrink-0" />
            <span className="truncate text-sm">
              {tab.isModified && <span className="text-orange-400 mr-1">●</span>}
              {tab.name}
            </span>
            <button
              onClick={(e) => handleCloseTab(tab.id, e)}
              className="ml-auto p-0.5 hover:bg-zinc-600 rounded flex-shrink-0"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Find & Replace Bar */}
      {showFindReplace && (
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-zinc-700">
          <Search size={16} className="text-zinc-400" />
          <input
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Find"
            className="bg-zinc-700 px-2 py-1 rounded text-sm w-40"
          />
          <Replace size={16} className="text-zinc-400" />
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace"
            className="bg-zinc-700 px-2 py-1 rounded text-sm w-40"
          />
          <button onClick={handleFind} className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm">
            Find
          </button>
          <button onClick={handleReplace} className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm">
            Replace
          </button>
          <button onClick={handleReplaceAll} className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm">
            Replace All
          </button>
          <button onClick={() => setShowFindReplace(false)} className="ml-auto p-1 hover:bg-zinc-700 rounded">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden">
        {lineNumbers && activeTab && (
          <div className="bg-zinc-850 text-zinc-500 text-right pr-2 pl-2 py-2 select-none border-r border-zinc-700 overflow-hidden" style={{ fontSize }}>
            {getLineNumbers(activeTab.content).map((num) => (
              <div key={num} className="leading-relaxed">{num}</div>
            ))}
          </div>
        )}
        <textarea
          id={`editor-${activeTabId}`}
          value={activeTab?.content || ''}
          onChange={(e) => handleContentChange(e.target.value)}
          className="flex-1 bg-zinc-900 text-zinc-100 p-2 resize-none outline-none font-mono leading-relaxed"
          style={{ 
            fontSize,
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            overflowWrap: wordWrap ? 'break-word' : 'normal',
          }}
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-800 border-t border-zinc-700 text-xs text-zinc-400">
        <div className="flex items-center gap-4">
          <span>{activeTab?.path || 'Untitled'}</span>
          {activeTab?.isModified && <span className="text-orange-400">Modified</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>Lines: {activeTab?.content.split('\n').length || 0}</span>
          <span>Characters: {activeTab?.content.length || 0}</span>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-lg p-4 w-[400px] border border-zinc-700">
            <h3 className="text-lg font-medium mb-4">Save File</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Location</label>
                <input
                  type="text"
                  value={savePath}
                  onChange={(e) => setSavePath(e.target.value)}
                  className="w-full bg-zinc-700 px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">File Name</label>
                <input
                  type="text"
                  value={saveFileName}
                  onChange={(e) => setSaveFileName(e.target.value)}
                  placeholder="document.txt"
                  className="w-full bg-zinc-700 px-3 py-2 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfirm}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Dialog */}
      {showOpenDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-lg p-4 w-[500px] h-[400px] border border-zinc-700 flex flex-col">
            <h3 className="text-lg font-medium mb-2">Open File</h3>
            <div className="text-sm text-zinc-400 mb-2">{currentOpenPath}</div>
            <div className="flex-1 overflow-y-auto bg-zinc-900 rounded border border-zinc-700">
              {currentOpenPath !== '/' && (
                <div
                  onClick={() => loadFilesForOpen(currentOpenPath.split('/').slice(0, -1).join('/') || '/')}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 cursor-pointer"
                >
                  <FolderOpen size={16} className="text-yellow-400" />
                  <span>..</span>
                </div>
              )}
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleOpenFile(file)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 cursor-pointer"
                >
                  {file.type === 'directory' ? (
                    <FolderOpen size={16} className="text-yellow-400" />
                  ) : (
                    <FileText size={16} className="text-zinc-400" />
                  )}
                  <span>{file.name}</span>
                </div>
              ))}
              {files.length === 0 && (
                <div className="text-zinc-500 text-center py-8">No files found</div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowOpenDialog(false)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
