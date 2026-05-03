import { useState } from 'react';
import { Search, Settings, Maximize2, Clock } from 'lucide-react';

const commitLog = [
  {
    hash: 'c2953c46caf5fe339774750453e3cc241d9fa3d2',
    refs: '(HEAD -> master, origin/master, origin/HEAD)',
    author: 'Weblate <i18n@elementary.io>',
    date: 'Thu Aug 11 18:32:21 2022 +0000',
    title: 'Update translation files',
    body: [
      'Updated by "Update PO files to match POT (msgmerge)" hook in Weblate.',
      '',
      'Translation: Terminal/Terminal (Extra)',
      'Translate-URL: https://l10n.elementary.io/projects/terminal/extra/',
    ],
  },
  {
    hash: 'a45103f2c247cffebed4cf3612556811599e8c4b',
    author: 'Weblate <i18n@elementary.io>',
    date: 'Thu Aug 11 18:32:14 2022 +0000',
    title: 'Update translation files',
    body: [
      'Updated by "Update PO files to match POT (msgmerge)" hook in Weblate.',
      '',
      'Translation: Terminal/Terminal',
      'Translate-URL: https://l10n.elementary.io/projects/terminal/terminal/',
    ],
  },
];

export default function TerminalApp() {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'hsl(var(--terminal-bg))' }}>
      {/* Terminal toolbar */}
      <div className="h-9 flex items-center px-3 border-b shrink-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <button className="px-1 opacity-60 text-white"><span className="text-lg">+</span></button>
        <div className="flex items-center ml-2">
          <div className="flex items-center gap-1 px-3 py-1 rounded-t text-xs text-white" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <span className="opacity-60 mr-1">✕</span>
            <span>terminal</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 text-xs text-white/50">
            <span>code</span>
            <span className="ml-1 text-green-400">✓</span>
          </div>
        </div>
        <div className="flex-1" />
        <Clock size={14} className="text-white/40" />
      </div>

      {/* Terminal content */}
      <div className="flex-1 p-4 font-mono text-xs overflow-auto os-scrollbar" style={{ color: 'hsl(var(--terminal-fg))' }}>
        {commitLog.map((c, i) => (
          <div key={i} className="mb-4">
            <div>
              <span className="term-yellow">commit {c.hash}</span>
              {c.refs && <span className="term-yellow"> </span>}
              {c.refs && (
                <span>
                  <span className="term-white">(</span>
                  <span className="term-cyan">HEAD</span>
                  <span className="term-white"> -&gt; </span>
                  <span className="term-green">master</span>
                  <span className="term-white">, </span>
                  <span className="term-red">origin/master</span>
                  <span className="term-white">, </span>
                  <span className="term-red">origin/HEAD</span>
                  <span className="term-white">)</span>
                </span>
              )}
            </div>
            <div className="term-white">Author: {c.author}</div>
            <div className="term-white">Date:   {c.date}</div>
            <div className="mt-2">
              <div className="term-white ml-4">{c.title}</div>
              {c.body.map((line, j) => (
                <div key={j} className="term-white ml-4">{line}</div>
              ))}
            </div>
          </div>
        ))}
        <div>
          <span className="term-green">dani@Mini</span>
          <span className="term-white">:</span>
          <span className="term-blue">~/Projects/terminal</span>
          <span className="term-yellow">$</span>
          <span className="term-white ml-1 animate-pulse">█</span>
        </div>
      </div>
    </div>
  );
}
