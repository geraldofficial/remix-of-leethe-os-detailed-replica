"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Save } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function NotesApp({ windowId }: { windowId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const currentNote = notes.find((n) => n.id === selectedNote);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote.id);
    setIsCreating(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (selectedNote === id) setSelectedNote(null);
  };

  const handleUpdateNote = (content: string) => {
    if (!currentNote) return;
    const updated = notes.map((n) =>
      n.id === selectedNote
        ? { ...n, content, updatedAt: new Date() }
        : n
    );
    setNotes(updated);
  };

  return (
    <div className="flex h-full" style={{ background: "hsl(var(--card))" }}>
      {/* Sidebar */}
      <div
        className="w-56 border-r flex flex-col"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="p-3 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm">Notes</h2>
          <button
            onClick={handleCreateNote}
            className="p-1.5 rounded-md hover:bg-secondary"
            title="New Note"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {notes.length === 0 ? (
            <div className="p-4 text-center text-sm opacity-60">
              No notes yet
            </div>
          ) : (
            notes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note.id)}
                className={`w-full p-3 border-b text-left transition-colors ${
                  selectedNote === note.id ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <h3 className="font-semibold text-sm line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-xs opacity-60 line-clamp-1">
                  {note.content || "No content"}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {currentNote ? (
          <>
            <div
              className="p-3 border-b flex items-center justify-between"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => {
                  const updated = notes.map((n) =>
                    n.id === selectedNote
                      ? { ...n, title: e.target.value }
                      : n
                  );
                  setNotes(updated);
                }}
                className="flex-1 bg-transparent font-semibold outline-none"
                placeholder="Note title"
              />
              <button
                onClick={() => handleDeleteNote(currentNote.id)}
                className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10"
                title="Delete Note"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <textarea
              value={currentNote.content}
              onChange={(e) => handleUpdateNote(e.target.value)}
              className="flex-1 p-4 outline-none resize-none"
              style={{
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
              }}
              placeholder="Start typing..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <p className="text-sm opacity-60 mb-3">No note selected</p>
              <button
                onClick={handleCreateNote}
                className="px-3 py-1.5 rounded-md text-sm"
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                Create New Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
