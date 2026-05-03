import { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder, Plus, ArrowDown, Search, Minus as MinusIcon, Plus as PlusIcon, Settings } from 'lucide-react';

const fileTree = [
  { name: '.github', type: 'folder' as const, children: [] },
  { name: 'build', type: 'folder' as const, children: [] },
  { name: 'data', type: 'folder' as const, children: [] },
  { name: 'meson', type: 'folder' as const, children: [] },
  { name: 'plugins', type: 'folder' as const, children: [] },
  { name: 'po', type: 'folder' as const, children: [] },
  {
    name: 'src', type: 'folder' as const, expanded: true, children: [
      { name: 'Dialogs', type: 'folder' as const, children: [] },
      { name: 'FolderManager', type: 'folder' as const, children: [] },
      { name: 'Services', type: 'folder' as const, children: [] },
      { name: 'SymbolPane', type: 'folder' as const, children: [] },
      { name: 'Widgets', type: 'folder' as const, expanded: true, children: [] },
      { name: 'Application.vala', type: 'file' as const },
      { name: 'codecore.deps', type: 'file' as const },
      { name: 'config.vala.in', type: 'file' as const },
      { name: 'MainWindow.vala', type: 'file' as const, active: true },
      { name: 'meson.build', type: 'file' as const },
      { name: 'Utils.vala', type: 'file' as const },
    ]
  },
  { name: 'vapi', type: 'folder' as const, children: [] },
  { name: '.editorconfig', type: 'file' as const },
  { name: '.gitignore', type: 'file' as const },
  { name: 'COPYING', type: 'file' as const },
  { name: 'io.elementary.code.yml', type: 'file' as const },
];

const codeLines = [
  { num: 1, content: '/*', cls: 'syntax-comment' },
  { num: 2, content: ' * Copyright 2017-2020 elementary, Inc. <https://elementary.io>', cls: 'syntax-comment' },
  { num: 3, content: ' *      2011-2013 Mario Guerriero <mefrio.g@gmail.com>', cls: 'syntax-comment' },
  { num: 4, content: ' *', cls: 'syntax-comment' },
  { num: 5, content: ' * This program is free software; you can redistribute it and/or', cls: 'syntax-comment' },
  { num: 6, content: ' * modify it under the terms of the GNU General Public', cls: 'syntax-comment' },
  { num: 7, content: ' * License as published by the Free Software Foundation; either', cls: 'syntax-comment' },
  { num: 8, content: ' * version 3 of the License, or (at your option) any later version.', cls: 'syntax-comment' },
  { num: 9, content: ' *', cls: 'syntax-comment' },
  { num: 10, content: ' * This program is distributed in the hope that it will be useful,', cls: 'syntax-comment' },
  { num: 11, content: ' * but WITHOUT ANY WARRANTY; without even the implied warranty of', cls: 'syntax-comment' },
  { num: 12, content: ' * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU', cls: 'syntax-comment' },
  { num: 13, content: ' * General Public License for more details.', cls: 'syntax-comment' },
  { num: 14, content: ' *', cls: 'syntax-comment' },
  { num: 15, content: ' * You should have received a copy of the GNU General Public', cls: 'syntax-comment' },
  { num: 16, content: ' * License along with this program; if not, write to the', cls: 'syntax-comment' },
  { num: 17, content: ' * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,', cls: 'syntax-comment' },
  { num: 18, content: ' * Boston, MA 02110-1301 USA', cls: 'syntax-comment' },
  { num: 19, content: ' */', cls: 'syntax-comment' },
  { num: 20, content: '' },
  { num: 21, content: 'namespace Scratch {', cls: 'syntax-keyword' },
  { num: 22, content: '    public class MainWindow : Hdy.Window {', mixed: true },
  { num: 23, content: '        public const int FONT_SIZE_MAX = 72;', mixed: true },
  { num: 24, content: '        public const int FONT_SIZE_MIN = 7;', mixed: true },
  { num: 25, content: '        private const uint MAX_SEARCH_TEXT_LENGTH = 255;', mixed: true },
  { num: 26, content: '' },
  { num: 27, content: '        public weak Scratch.Application app { get; construct; }', mixed: true },
  { num: 28, content: '' },
  { num: 29, content: '        public Scratch.Widgets.DocumentView document_view;', mixed: true },
  { num: 30, content: '' },
  { num: 31, content: '        // Widgets', cls: 'syntax-comment' },
  { num: 32, content: '        public Scratch.Widgets.HeaderBar toolbar;', mixed: true },
];

function renderMixed(line: string) {
  return line
    .replace(/(namespace|public|private|class|const|weak|get|construct|int|uint)/g, '<span class="syntax-keyword">$1</span>')
    .replace(/(\d+)/g, '<span class="syntax-number">$1</span>')
    .replace(/(Scratch\.\w+\.\w+|Hdy\.\w+|Scratch\.\w+)/g, '<span class="syntax-type">$1</span>')
    .replace(/(\/\/.*)/g, '<span class="syntax-comment">$1</span>');
}

interface TreeNodeProps {
  item: typeof fileTree[0];
  depth: number;
}

function TreeNode({ item, depth }: TreeNodeProps) {
  const [expanded, setExpanded] = useState((item as any).expanded ?? false);
  const isFolder = item.type === 'folder';
  const isActive = (item as any).active;

  return (
    <>
      <div
        className={`flex items-center gap-1 py-0.5 px-2 cursor-pointer text-xs hover:bg-secondary transition-colors ${isActive ? 'bg-accent/10 font-medium' : ''}`}
        style={{ paddingLeft: depth * 16 + 8, color: 'hsl(var(--sidebar-fg))' }}
        onClick={() => isFolder && setExpanded(!expanded)}
      >
        {isFolder ? (expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : <span className="w-3" />}
        {isFolder ? <Folder size={13} className="text-accent opacity-60" /> : <FileText size={13} className="opacity-40" />}
        <span>{item.name}</span>
        {isFolder && (item as any).expanded && <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />}
      </div>
      {isFolder && expanded && (item as any).children?.map((child: any, i: number) => (
        <TreeNode key={i} item={child} depth={depth + 1} />
      ))}
    </>
  );
}

export default function CodeApp() {
  return (
    <div className="flex flex-col h-full text-sm">
      {/* Toolbar */}
      <div className="h-8 flex items-center px-3 gap-2 border-b"
        style={{ backgroundColor: 'hsl(var(--toolbar-bg))', borderColor: 'hsl(var(--border))' }}>
        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#f97316', color: 'white' }}>● code</span>
        <div className="flex-1" />
        <ArrowDown size={14} className="opacity-40" />
        <ArrowDown size={14} className="opacity-40 rotate-180" />
        <div className="flex items-center gap-3 ml-4 text-xs opacity-60">
          <span>⊞ 4 Tabs</span>
          <span>&lt;/&gt; Vala</span>
          <span>⊞ 1166.1</span>
        </div>
        <Settings size={14} className="opacity-40 ml-2" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 border-r overflow-y-auto os-scrollbar shrink-0"
          style={{ backgroundColor: 'hsl(var(--sidebar-bg))', borderColor: 'hsl(var(--border))' }}>
          {fileTree.map((item, i) => (
            <TreeNode key={i} item={item} depth={0} />
          ))}
          <div className="px-3 py-2 text-xs opacity-50 flex items-center gap-1 cursor-pointer border-t mt-2"
            style={{ borderColor: 'hsl(var(--border))' }}>
            <Folder size={12} /> Open Project Folder...
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="h-8 flex items-center border-b"
            style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
            <button className="px-1 py-1 ml-1 opacity-40"><Plus size={14} /></button>
            <div className="flex items-center gap-1 px-3 py-1 text-xs bg-card border-b-2"
              style={{ borderColor: 'hsl(var(--foreground))' }}>
              <span className="opacity-40 cursor-pointer">✕</span>
              <span>MainWindow.vala</span>
            </div>
          </div>

          {/* Code area + settings panel */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto os-scrollbar font-mono text-xs leading-5"
              style={{ backgroundColor: 'hsl(var(--card))' }}>
              {codeLines.map(line => (
                <div key={line.num} className="flex hover:bg-secondary/50">
                  <span className="w-10 text-right pr-3 select-none shrink-0 opacity-30">{line.num}</span>
                  {line.mixed ? (
                    <span dangerouslySetInnerHTML={{ __html: renderMixed(line.content) }} />
                  ) : (
                    <span className={line.cls || ''}>{line.content}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Settings mini panel */}
            <div className="w-48 border-l p-3 text-xs shrink-0"
              style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <div className="flex items-center justify-center gap-2 mb-3 border rounded p-1"
                style={{ borderColor: 'hsl(var(--border))' }}>
                <MinusIcon size={12} />
                <span className="text-sm font-medium">100%</span>
                <PlusIcon size={12} />
              </div>
              <div className="flex items-center justify-center gap-1 mb-3 border rounded p-1"
                style={{ borderColor: 'hsl(var(--border))' }}>
                <Search size={12} className="opacity-40" />
                <Search size={12} className="opacity-40" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <span>Follow System Style</span>
                <div className="w-8 h-4 rounded-full bg-border relative">
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-card" />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: '#f5f5f5', borderColor: 'hsl(var(--border))' }} />
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: '#e8e8e8', borderColor: 'hsl(var(--accent))' }}>✓</div>
                <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: '#2d2d2d', borderColor: 'hsl(var(--border))' }} />
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-8 h-8 border rounded" style={{ borderColor: 'hsl(var(--border))' }} />
                <div className="w-8 h-8 border rounded" style={{ borderColor: 'hsl(var(--border))' }} />
                <div className="w-8 h-8 border rounded" style={{ borderColor: 'hsl(var(--border))' }} />
              </div>
              <div className="text-center opacity-60">Preferences</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
