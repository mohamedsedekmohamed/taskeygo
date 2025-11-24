// KanbanDragDrop.tsx
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

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

  const data = [400, 800, 600, 1200];
  const labels = ["Jan", "Feb", "Mar", "Apr"];

  const onDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(itemId);
  };

  const onDragEnd = () => {
    setDraggingId(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropToColumn = (e: React.DragEvent, columnKey: keyof Columns) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (!itemId) return;

    const sourceKey = findItemColumn(columns, itemId);
    if (!sourceKey) return;
    if (sourceKey === columnKey) return;

    const item = columns[sourceKey].find((it) => it.id === itemId);
    if (!item) return;

    setColumns((prev) => {
      const copy: Columns = {
        pending: [...prev.pending],
        success: [...prev.success],
        failed: [...prev.failed],
      };
      copy[sourceKey] = copy[sourceKey].filter((it) => it.id !== itemId);
      copy[columnKey] = [...copy[columnKey], item];
      return copy;
    });

    setDraggingId(null);
  };

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

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(["pending", "success", "failed"] as const).map((colKey) => {
            const key = colKey as keyof Columns;
            const items = columns[key];

            return (
              <div
                key={colKey}
                onDragOver={onDragOver}
                onDrop={(e) => onDropToColumn(e, key)}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">{key}</h2>
                    <p className="text-xs text-gray-500">{items.length} items</p>
                  </div>
                </div>

                <div className="space-y-3 min-h-[120px]">
                  {items.length === 0 && (
                    <div className="p-4 text-sm text-center text-gray-400 border-2 border-dashed rounded">
                      Drag & Drop here
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
                          ${isDragging ? "opacity-70 ring-2 ring-purple-300" : "hover:shadow-md"}`}
                      >
                        <div>
                          <div className="font-medium">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500">{item.description}</div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="px-2 py-1 text-xs text-red-600 rounded bg-red-50 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Polar Area */}
          <div className="p-4 bg-white shadow rounded-xl">
            <h2 className="mb-2 font-semibold">User Activity</h2>
            <Chart
              type="polarArea"
              height={200}
              series={[20, 35, 25, 15]}
              options={{ labels: ["Login", "Purchase", "View", "Share"] }}
            />
          </div>

          {/* Range Bar */}
          <div className="p-4 bg-white shadow rounded-xl">
            <h2 className="mb-2 font-semibold">Task Timeline</h2>
            <Chart
              type="rangeBar"
              height={200}
              series={[{ data: [{ x: "Task A", y: [1, 5] }, { x: "Task B", y: [3, 8] }] }]}
              options={{ chart: { id: "range-bar" } }}
            />
          </div>

          {/* Candlestick */}
          <div className="p-4 bg-white shadow rounded-xl">
            <h2 className="mb-2 font-semibold">Stock Movement</h2>
            <Chart
              type="candlestick"
              height={200}
              series={[{ data: [[1, 30, 40, 20, 35], [2, 32, 42, 25, 38]] }]}
              options={{ chart: { id: "candlestick" } }}
            />
          </div>

          {/* Radial Bar */}
          <div className="p-4 bg-white shadow rounded-xl">
            <h2 className="mb-2 font-semibold">Progress Overview</h2>
            <Chart
              type="radialBar"
              height={250}
              series={[70, 55, 85]}
              options={{ labels: ["Sales", "Users", "Revenue"], plotOptions: { radialBar: { hollow: { size: "30%" } } } }}
            />
          </div>

          {/* Donut Chart */}
          <div className="p-4 bg-white shadow rounded-xl">
            <h2 className="mb-2 font-semibold">Order Distribution</h2>
            <Chart
              type="donut"
              height={200}
              series={[50, 30, 20]}
              options={{ labels: ["Online", "Store", "Other"] }}
            />
          </div>

          {/* Bubble Chart */}
          <div className="p-4 bg-white shadow rounded-xl">
            <h2 className="mb-2 font-semibold">Bubble Analysis</h2>
            <Chart
              type="bubble"
              height={200}
              series={[{ name: "Bubbles", data: [[1, 2, 5], [2, 3, 10], [3, 4, 8]] }]}
              options={{ xaxis: { tickAmount: 5 }, yaxis: { tickAmount: 5 } }}
            />
          </div>

          {/* Line + Column */}
          <div className="p-4 bg-white shadow rounded-xl">
            <h2 className="mb-2 font-semibold">Sales vs Revenue</h2>
            <Chart
              type="line"
              height={200}
              series={[
                { name: "Sales", type: "column", data },
                { name: "Revenue", type: "line", data },
              ]}
              options={{ chart: { stacked: false }, xaxis: { categories: labels } }}
            />
          </div>

          {/* Heatmap */}
          <div className="p-4 bg-white shadow rounded-xl">
            <h2 className="mb-2 font-semibold">Heatmap</h2>
            <Chart
              type="heatmap"
              height={200}
              series={[
                { name: "Team A", data: [{ x: "Mon", y: 10 }, { x: "Tue", y: 20 }] },
                { name: "Team B", data: [{ x: "Mon", y: 15 }, { x: "Tue", y: 25 }] },
              ]}
              options={{ xaxis: { type: "category" } }}
            />
          </div>

          {/* Treemap */}
          <div className="p-4 bg-white shadow rounded-xl">
            <h2 className="mb-2 font-semibold">Treemap</h2>
            <Chart
              type="treemap"
              height={200}
              series={[{ data: [{ x: "A", y: 10 }, { x: "B", y: 15 }, { x: "C", y: 8 }] }]}
              options={{ legend: { show: true } }}
            />
          </div>
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

export default Dashboard;
