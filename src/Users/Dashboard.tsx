// KanbanDragDrop.tsx
import React, { useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  description?: string;
};

type Columns = {
  pending: Item[];
  success: Item[];
  failed: Item[];
};

const STORAGE_KEY = "kanban-columns-v1";

const initialData = (): Columns => ({
  pending: [
    { id: "p-1", title: "Task 1" },
    { id: "p-2", title: "Task 2" },
    { id: "p-3", title: "Task 3" },
  ],
  success: [{ id: "s-1", title: "Done task" }],
  failed: [{ id: "f-1", title: "Failed task" }],
});

const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState<Columns>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Columns;
    } catch {}
    return initialData();
  });

  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  // Start dragging: store item id in dataTransfer and local state for styling
  const onDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("text/plain", itemId);
    // allow moving effect
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(itemId);
  };

  const onDragEnd = () => {
    setDraggingId(null);
  };

  // When an item is dragged over a column we must preventDefault to allow drop
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Drop handler: move item to target column (append to end)
  const onDropToColumn = (e: React.DragEvent, columnKey: keyof Columns) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (!itemId) return;

    // find the item and its current column
    const sourceKey = findItemColumn(columns, itemId);
    if (!sourceKey) return;
    if (sourceKey === columnKey) {
      setDraggingId(null);
      return; // same column -> do nothing
    }

    const item = columns[sourceKey].find((it) => it.id === itemId);
    if (!item) return;

    setColumns((prev) => {
      const copy: Columns = {
        pending: [...prev.pending],
        success: [...prev.success],
        failed: [...prev.failed],
      };
      // remove from source
      copy[sourceKey] = copy[sourceKey].filter((it) => it.id !== itemId);
      // add to target
      copy[columnKey] = [...copy[columnKey], item];
      return copy;
    });

    setDraggingId(null);
  };

  // optional: remove item
  const removeItem = (itemId: string) => {
    const sourceKey = findItemColumn(columns, itemId);
    if (!sourceKey) return;
    setColumns((prev) => {
      const copy: Columns = {
        pending: [...prev.pending],
        success: [...prev.success],
        failed: [...prev.failed],
      };
      copy[sourceKey] = copy[sourceKey].filter((it) => it.id !== itemId);
      return copy;
    });
  };

  // optional: create new item in pending
  const addNew = () => {
    const id = "p-" + Math.random().toString(36).slice(2, 9);
    const newItem: Item = { id, title: `New task ${id.slice(-4)}` };
    setColumns((prev) => ({ ...prev, pending: [newItem, ...prev.pending] }));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Kanban — Drag & Drop</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={addNew}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
            >
              + Add task
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setColumns(initialData());
              }}
              className="px-3 py-2 text-sm border rounded-lg"
            >
              Reset
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {([
            { key: "pending", title: "Pending", hint: "الطلبات المعلقة" },
            { key: "success", title: "Success", hint: "نجحت" },
            { key: "failed", title: "Failed", hint: "فشلت" },
          ] as const).map((col) => {
            const key = col.key as keyof Columns;
            const items = columns[key];

            return (
              <div
                key={col.key}
                onDragOver={onDragOver}
                onDrop={(e) => onDropToColumn(e, key)}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">{col.title}</h2>
                    <p className="text-xs text-gray-500">{col.hint}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[120px]">
                  {items.length === 0 && (
                    <div className="p-4 text-sm text-center text-gray-400 border-2 border-dashed rounded">
                      سحب وافلات هنا
                    </div>
                  )}

                  {items.map((item) => {
                    const isDragging = draggingId === item.id;
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, item.id)}
                        onDragEnd={onDragEnd}
                        className={`flex items-center justify-between p-3 transition-shadow bg-white border rounded-lg cursor-grab
                          ${isDragging ? "opacity-70 ring-2 ring-purple-300" : "hover:shadow-md"}
                        `}
                      >
                        <div>
                          <div className="font-medium">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500">{item.description}</div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="px-2 py-1 text-xs text-red-600 rounded bg-red-50 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// helper to find which column contains an item id
function findItemColumn(cols: Columns, itemId: string): keyof Columns | null {
  if (cols.pending.some((it) => it.id === itemId)) return "pending";
  if (cols.success.some((it) => it.id === itemId)) return "success";
  if (cols.failed.some((it) => it.id === itemId)) return "failed";
  return null;
}


export default Dashboard