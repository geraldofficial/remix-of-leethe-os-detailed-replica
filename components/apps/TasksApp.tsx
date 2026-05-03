"use client";

import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function TasksApp({ windowId }: { windowId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "hsl(var(--card))" }}>
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold mb-3">Tasks</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 rounded-md text-sm border"
            style={{
              background: "hsl(var(--secondary))",
              borderColor: "hsl(var(--border))",
            }}
          />
          <button
            onClick={handleAdd}
            className="p-2 rounded-md"
            style={{
              background: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-sm opacity-60">
            No tasks yet. Add one to get started!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 border-b flex items-center gap-2 hover:bg-secondary/30"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="p-1 rounded flex-shrink-0"
                style={{
                  background: task.completed ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                }}
              >
                {task.completed && <Check size={16} />}
              </button>
              <span className={`flex-1 text-sm ${task.completed ? "line-through opacity-60" : ""}`}>
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
