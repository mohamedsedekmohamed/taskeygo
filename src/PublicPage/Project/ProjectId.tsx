import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { UserCircle, Mail, Calendar, ClipboardList, Folder, Check, AlertCircle, Search, Filter } from "lucide-react";
import Loader from "../../Component/Loading";
import { FaUsers, FaTasks, FaCheckCircle, FaClock, FaFlagCheckered } from 'react-icons/fa';
import ButtonDown from "../../Ui/ButtonDown";

// Interfaces
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface IProjectMember {
  _id: string;
  email: string;
  user_id: IUser;
  project_id: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISubTask {
  _id: string;
  user_id: string;
  task_id: {
    _id: string;
    name: string;
    end_date: string;
    priority: string;
    status: string;
  };
  status: string;
  is_finished: boolean;
  role: string;
  User_taskId: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ITaskInfo {
  _id: string;
  name: string;
  description: string;
  projectId: string;
  end_date: string;
  priority: string;
  status: string;
  recorde: string | null;
  file: string | null;
  Depatment_id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserTask {
  _id: string;
  user_id: string;
  task_id: ITaskInfo | null;
  status: string;
  is_finished: boolean;
  role: string;
  User_taskId: ISubTask[];
  createdAt: string;
  updatedAt: string;
}

export interface IProjectDetails {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectAPIResponse {
  success: boolean;
  data: {
    message: string;
    project: IProjectDetails;
    members: IProjectMember[];
    tasks: IUserTask[];
  };
}

// Component
const ProjectId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<IProjectDetails | null>(null);
  const [members, setMembers] = useState<IProjectMember[]>([]);
  const [tasks, setTasks] = useState<IUserTask[]>([]);

  // ✅ تم التعديل هنا
  const [filteredTasks, setFilteredTasks] = useState<IUserTask[]>([]);

  const [loading, setLoading] = useState(true);

  const nav = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://taskatbcknd.wegostation.com/api/user/projects/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setProject(response.data.data.project);
          setMembers(response.data.data.members);
          setTasks(response.data.data.tasks);
          setFilteredTasks(response.data.data.tasks); // نفس النوع
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // Filter tasks
  useEffect(() => {
    let tempTasks = [...tasks];

    if (searchText.trim() !== "") {
      tempTasks = tempTasks.filter(task => {
        if (!task.task_id) return false;
        return (
          task.task_id.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          task.task_id.description?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    if (priorityFilter) {
      tempTasks = tempTasks.filter(task =>
        task.task_id && task.task_id.priority === priorityFilter
      );
    }

    if (statusFilter) {
      tempTasks = tempTasks.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(tempTasks);
  }, [searchText, priorityFilter, statusFilter, tasks]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-600";
      case "approved": return "bg-blue-600";
      case "pending": return "bg-yellow-600";
      case "rejected": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getRoleColor = (role: string) => {
    if (role?.toLowerCase().includes("lead")) return "bg-purple-600";
    if (role?.toLowerCase().includes("approve")) return "bg-blue-600";
    return "bg-gray-700";
  };

  if (loading)
    return (
      <div className="min-h-screen text-center">
        <Loader color={"#000000"} />
      </div>
    );

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-xl text-gray-700">Project is not found</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalTasks: tasks.length,
    validTasks: tasks.filter(t => t.task_id !== null).length,
    completedTasks: tasks.filter(t => t.is_finished).length,
    pendingTasks: tasks.filter(t => t.status === "pending").length,
    totalMembers: members.length
  };
  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className="relative py-16 overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-5"></div>
        <div className="relative z-10 px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-center mb-4">
            <Folder className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-4xl font-extrabold text-center text-black bg-clip-text ">
            {project.name} 
          </h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-center text-gray-600">
            {project.description}
          </p>
          <p className="mt-2 text-sm text-center text-gray-500">
            تم الإنشاء في: {formatDate(project.createdAt)}
          </p>
        </div>
      </div>

      <div className="px-4 py-12 mx-auto max-w-7xl">
        

<div className="grid grid-cols-2 gap-4 mb-12 md:grid-cols-5">
  <div className="p-6 text-center transition-transform duration-300 bg-white shadow-lg rounded-2xl hover:scale-105">
    <FaUsers className="mx-auto text-4xl text-black animate-bounce" />
    <div className="mt-2 text-3xl font-bold text-black">{stats.totalMembers}</div>
    <div className="mt-1 text-sm text-gray-600">Total Members</div>
  </div>
  
  <div className="p-6 text-center transition-transform duration-300 bg-white shadow-lg rounded-2xl hover:scale-105">
    <FaTasks className="mx-auto text-4xl text-black animate-pulse" />
    <div className="mt-2 text-3xl font-bold text-black">{stats.totalTasks}</div>
    <div className="mt-1 text-sm text-gray-600">Total Tasks</div>
  </div>
  
  <div className="p-6 text-center transition-transform duration-300 bg-white shadow-lg rounded-2xl hover:scale-105">
    <FaCheckCircle className="mx-auto text-4xl text-black animate-bounce" />
    <div className="mt-2 text-3xl font-bold text-black">{stats.validTasks}</div>
    <div className="mt-1 text-sm text-gray-600">Valid Tasks</div>
  </div>
  
  <div className="p-6 text-center transition-transform duration-300 bg-white shadow-lg rounded-2xl hover:scale-105">
    <FaClock className="mx-auto text-4xl text-black animate-pulse" />
    <div className="mt-2 text-3xl font-bold text-black">{stats.pendingTasks}</div>
    <div className="mt-1 text-sm text-gray-600">Pending</div>
  </div>
  
  <div className="p-6 text-center transition-transform duration-300 bg-white shadow-lg rounded-2xl hover:scale-105">
    <FaFlagCheckered className="mx-auto text-4xl text-black animate-bounce" />
    <div className="mt-2 text-3xl font-bold text-black">{stats.completedTasks}</div>
    <div className="mt-1 text-sm text-gray-600">Completed</div>
  </div>
</div>


        {/* Members Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
Project Members
            <span className="ml-2 text-lg text-gray-500">({members.length})</span>
          </h2>
          {members.length === 0 ? (
            <div className="p-12 text-center bg-white shadow-lg rounded-2xl">
              <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
<p className="text-gray-500">No members added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((member, index) => (
                <div
                  key={member._id}
                  className="relative p-6 overflow-hidden transition-all duration-300 bg-white shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${
                    index % 3 === 0 ? 'bg-blue-500' : 
                    index % 3 === 1 ? 'bg-purple-500' : 'bg-green-500'
                  }`}></div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <UserCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{member.user_id.name}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-gray-500" />
                      <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Join: {formatDate(member.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div>
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
  Project Tasks
  <span className="ml-2 text-lg text-gray-500">({tasks.length})</span>
</h2>


          {/* Search & Filters */}
          <div className="p-6 mb-8 bg-white shadow-lg rounded-2xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
placeholder="Search for a task..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="w-full py-3 pr-3 transition border border-gray-300 rounded-xl pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <select
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                  className="w-full py-3 pr-3 transition border border-gray-300 rounded-xl pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              <option value="">All Priorities</option>
<option value="high">High</option>
<option value="medium">Medium</option>
<option value="low">Low</option>

                </select>
              </div>
              
              <div className="relative">
                <Filter className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full py-3 pr-3 transition border border-gray-300 rounded-xl pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">All Statuses</option>
<option value="pending">Pending</option>
<option value="approved">Approved</option>
<option value="rejected">Rejected</option>
<option value="completed">Completed</option>

                </select>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center bg-white shadow-lg rounded-2xl">
              <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
<p className="text-gray-500">No tasks match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
{filteredTasks.map((task, index) => {
 const isIndependent =
    Array.isArray(task.User_taskId) && task.User_taskId.length === 0;

  const isDependent =
    Array.isArray(task.User_taskId) && task.User_taskId.length > 0;

  const dependencyFinished =
    isDependent && task.User_taskId[0].is_finished === true;

  const shouldShowTask = isIndependent || dependencyFinished;


                return (
                  <div
                    key={task._id}
                    className={`relative p-6 transition-all duration-300 shadow-lg group rounded-2xl hover:-translate-y-1 ${
                      shouldShowTask 
                        ? 'bg-white hover:shadow-2xl' 
                        : 'bg-gray-100 border-2 border-dashed border-gray-300'
                    }`}
                  >
                    {/* Task Header */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${
                      shouldShowTask 
                        ? (index % 3 === 0 ? 'bg-blue-500' : 
                           index % 3 === 1 ? 'bg-purple-500' : 'bg-green-500')
                        : 'bg-gray-400'
                    }`}></div>

                    {!shouldShowTask ? (
                   <div  className="text-center">
  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
  <h3 className="mb-2 text-lg font-bold text-gray-600">Incomplete Task</h3>
  
  <p className="mb-4 text-sm text-gray-500">No data available for this task</p>
  <div className="flex items-center justify-center gap-2 mb-3">
    <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(task.status)}`}>
      {task.status}
    </span>
  </div>
  <p className="text-xs text-gray-400">
    Created: {formatDate(task.createdAt)}
  </p>
</div>

                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="flex-1 text-lg font-bold text-gray-800 line-clamp-2">
                            {task.task_id?.name}
                          </h3>
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <ClipboardList className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>

                        <p className="py-3 mb-4 text-sm text-gray-600 line-clamp-3">
                          {task.task_id?.description ?? 'N/A'}
                        </p>
       {task.task_id?.file && (
 <ButtonDown file={task.task_id?.file} />

)}



                        <div className="my-3 mb-6 space-y-3 ">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                      End Date      {task.task_id?.end_date ? formatDate(task.task_id.end_date) : 'N/A'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-gray-500" />
                            <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getPriorityColor(task.task_id?.priority ?? '')}`}>
                              Priority: {task.task_id?.priority ?? 'N/A'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <UserCircle className="w-4 h-4 text-gray-500" />
                            <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                      
                        </div>
<button
  onClick={() => {
    if (task?.task_id?.projectId) {
      nav(`/user/task/${task.task_id.projectId}`);
    }
  }}
  className="w-full py-3 font-semibold text-white transition-all duration-300 transform bg-black rounded-xl hover:scale-105"
  disabled={!task?.task_id?.projectId}
>
  View Details
</button>

                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectId;