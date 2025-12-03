import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Loader from "../../Component/Loading";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface TaskDetail {
  _id: string;
  name: string;
}

export interface Task {
  _id: string;
  user_id: User;
  task_id: TaskDetail;
  status: string;
  is_finished: boolean;
  role: string;
  User_taskId: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    message: string;
    data: Task[];
  };
}

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging = false }) => {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    pending_edit: "bg-orange-100 text-orange-800 border-orange-300",
    in_progress: "bg-blue-100 text-blue-800 border-blue-300",
    in_progress_edit: "bg-cyan-100 text-cyan-800 border-cyan-300",
    done: "bg-green-100 text-green-800 border-green-300",
  };

  const statusColor = statusColors[task.status] || "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div
      className={`p-6 bg-white border rounded-lg shadow-sm transition-all cursor-move ${
        isDragging ? "opacity-60 shadow-2xl scale-105 rotate-3" : "hover:shadow-lg"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-800">{task.task_id.name}</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColor}`}>
          {task.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <p className="font-medium text-gray-700">{task.user_id.name}</p>
          <p className="text-xs text-gray-500">{task.user_id.email}</p>
        </div>
        <p className="text-gray-600">
          <span className="font-medium">Role:</span> {task.role}
        </p>
        <p className={`mt-2 text-sm font-medium ${task.is_finished ? "text-green-600" : "text-orange-600"}`}>
          {task.is_finished ? "Completed" : "In Progress"}
        </p>
        <p className="pt-2 text-xs text-gray-500 border-t border-gray-200">
          Created: {new Date(task.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

const SortableTask: React.FC<{ task: Task }> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
};

interface DroppableColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  count: number;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, tasks, count }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col p-4 rounded-xl transition-colors ${
        isOver ? "bg-blue-200 ring-2 ring-blue-400" : "border"
      }`}
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-400">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <span className="px-3 py-1 text-sm font-bold text-white bg-gray-700 rounded-full">
          {count}
        </span>
      </div>

      <SortableContext
        items={tasks.map(t => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4 min-h-[200px] flex-1">
          {tasks.map(task => (
            <SortableTask key={task._id} task={task} />
          ))}

          {tasks.length === 0 && (
            <div className={`flex items-center justify-center h-32 text-gray-500 border-2 border-dashed rounded-lg transition-colors ${
              isOver ? "bg-blue-100 border-blue-400" : "bg-gray-100 border-gray-400"
            }`}>
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const Tasks: React.FC = () => {
  const pathname = window.location.pathname; // "/user/task/692ecdd4dd4c821dda60e966"
  const pathParts = pathname.split("/"); 
  const id = pathParts[pathParts.length - 1]; // "692ecdd4dd4c821dda60e966"

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const columns = [
  { id: "pending", title: "Pending" },
  { id: "pending_edit", title: "Pending Edit" },
  { id: "in_progress", title: "In Progress" },
  { id: "in_progress_edit", title: "In Progress Edit" },
  { id: "done", title: "Done" },
];

  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  const nextStatusMap: Record<string, string | null> = {
    pending: "in_progress",
    in_progress: "done",
    pending_edit: "in_progress_edit",
    in_progress_edit: "done",
    done: null,
  };

  const getAllowedStatuses = (currentStatus: string) => {
  const next = nextStatusMap[currentStatus];
  if (!next) return []; // done أو حالة مالهاش انتقال
  return [next]; // الحالة التالية فقط
};


  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found");
      setLoading(false);
      return;
    }
    if (!id) {
      setError("Task ID not found");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `https://taskatbcknd.wegostation.com/api/user/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setTasks(response.data.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchTasks();
  }, [id, fetchTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeTaskId = active.id as string;
    const activeTask = tasks.find(t => t._id === activeTaskId);
    if (!activeTask) return;

    const overId = over.id as string;

    const allowedStatuses = getAllowedStatuses(activeTask.status);
    if (!allowedStatuses.includes(overId)) return; // منع السحب غير المسموح

    if (overId === activeTask.status) return;

    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t =>
      t._id === activeTaskId ? { ...t, status: overId } : t
    ));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      await axios.put(
        `https://taskatbcknd.wegostation.com/api/user/tasks/${activeTaskId}`,
        { status: overId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
      setTasks(previousTasks);
      alert("Failed to update task status. Changes have been reverted.");
    }
  };

  const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

  if (loading) return <Loader color="#000" />;

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-6 text-center border border-red-200 rounded-lg bg-red-50">
          <h3 className="mb-2 text-lg font-bold text-red-800">Error</h3>
          <p className="mb-4 text-red-700">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const allowedStatuses = activeId
    ? getAllowedStatuses(tasks.find(t => t._id === activeId)?.status || "")
    : columns.map(c => c.id);

  return (
    <div className="min-h-screen p-6 ">
      <div className="mx-auto max-w-screen-2xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">Tasks Board</h1>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {columns.map(column => {
              const columnTasks = tasks.filter(t => t.status === column.id);
              const isAllowed = allowedStatuses.includes(column.id);
              return (
                <div
                  key={column.id}
                  className={`flex flex-col p-4 rounded-xl transition-colors ${
                    isAllowed
                      ? "bg-gray-50"
                      : "bg-gray-300 opacity-50 pointer-events-none"
                  }`}
                >
                  <DroppableColumn
                    id={column.id}
                    title={column.title}
                    tasks={columnTasks}
                    count={columnTasks.length}
                  />
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};


export default Tasks;
