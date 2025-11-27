import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../Component/Loading";
import TaskCard from "./TaskCard";
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
    tasks: Task[];
  };
}

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
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">
            {tasks.length > 0
              ? `Showing ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`
              : "No tasks available"}
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
              <TaskCard key={task._id} task={task} fetchTasks={fetchTasks} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
