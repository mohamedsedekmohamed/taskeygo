import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../Component/Loading";

// Types
interface User {
  _id: string;
  name: string;
  email: string;
}

interface TaskDetail {
  _id: string;
  name: string;
}

interface Task {
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
    tasks: Task[];
  };
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const [status, setStatus] = useState(task.status);
  const [loadingStatus, setLoadingStatus] = useState(false);
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoadingStatus(true);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://taskatbcknd.wegostation.com/api/user/tasks/${task.task_id._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to update status:", error);
   } finally {
      setLoadingStatus(false);
    }
  };
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
    completed: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300"
  };

  const statusColor = statusColors[task.status] || "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div className="p-6 transition-shadow duration-300 border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{task.task_id.name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
          {task.status}
        </span>
      </div>
    
      
      <div className="space-y-3">
        <div className="flex items-center">
          <svg className="w-5 h-5 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-700">{task.user_id.name}</p>
            <p className="text-xs text-gray-500">{task.user_id.email}</p>
          </div>
        </div>

        <div className="flex items-center">
          <svg className="w-5 h-5 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-700">
            <span className="font-medium">Role:</span> {task.role}
          </span>
        </div>
      <select
          value={status}
          onChange={handleStatusChange}
          disabled={loadingStatus}
          className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border rounded-full"
        >
          <option value="">Select</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="in_progress_edit">In Progress Edit</option>
        </select>
        <div className="flex items-center">
          {task.is_finished ? (
            <span className="flex items-center text-sm font-medium text-green-600">
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          ) : (
            <span className="flex items-center text-sm font-medium text-orange-600">
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              In Progress
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Created: {new Date(task.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Component
const Tasks: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Authentication token not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await axios.get<ApiResponse>(
        `https://taskatbcknd.wegostation.com/api/user/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setTasks(response.data.data.tasks);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Error fetching data";
      setError(errorMessage);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTasks();
    }
  }, [id, fetchTasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader color={"#000000"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 ">
        <div className="w-full max-w-md p-6 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 ml-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
          </div>
          <p className="mb-4 text-red-700">{error}</p>
          <button
            onClick={fetchTasks}
            className="w-full px-4 py-2 font-medium text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 ">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">
            {tasks.length > 0 
              ? `Showing ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`
              : 'No tasks available'
            }
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow-md">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">No tasks</h3>
            <p className="text-gray-500">No tasks found at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
