import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserCircle, Mail, Calendar, ClipboardList, Folder, Check, AlertCircle, Search, Clock } from "lucide-react";
import { FaUsers, FaTasks, FaCheckCircle, FaClock, FaFlagCheckered } from 'react-icons/fa';
import Loader from "../../Component/Loading";
import ButtonDown from "../../Ui/ButtonDown";
import { HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";
import { GiFinishLine } from "react-icons/gi";

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
  user_id: IUser
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
  start_date: string,
  end_date: string,
  createdAt: string;
  updatedAt: string;
}

export interface ITaskInfo {
  _id: string;
  name: string;
  description: string;
  projectId: string;
  priority: string;
  status: string;
  recorde: string | null;
  file: string | null;
  Depatment_id: string;
   start_date: string,
  end_date: string,
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserTask {
  _id: string;
  user_id: IUser;
    task_id: ITaskInfo | null;
  status: string;
  is_finished: boolean;
  role: string;
  description: string;
  User_taskId: ISubTask[];
  start_date: string,
  end_date: string,
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

const Teamlead: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<IProjectDetails | null>(null);
  const [members, setMembers] = useState<IProjectMember[]>([]);
  const [tasks, setTasks] = useState<IUserTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<IUserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch data from API
  useEffect(() => {
    const fetchProjectDetails = async () => {
      setError(false);
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
          setFilteredTasks(response.data.data.tasks);
        }
      } catch (error) {
        setError(true);
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
          task.task_id.description?.toLowerCase().includes(searchText.toLowerCase())||
          task.description?.toLowerCase().includes(searchText.toLowerCase())||
          task.user_id.email?.toLowerCase().includes(searchText.toLowerCase())
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    if (role?.toLowerCase().includes("lead")) return "bg-purple-600";
    if (role?.toLowerCase().includes("approve")) return "bg-blue-600";
    return "bg-gray-700";
  };
type StatusValue =
  | ""
  | "pending"
  | "in_progress"
  | "Approved from Member_can_approve"
  | "pending_edit"
  | "in_progress_edit"
  | "rejected"
  | "done";

// كائن mapping بين القيم والنصوص
const statusNames: Record<StatusValue, string> = {
  "": "All statuses",
  "pending": "Pending",
  "in_progress": "In Progress",
  "Approved from Member_can_approve": "Wait Approved",
  "pending_edit": "Pending Edit",
  "in_progress_edit": "In Progress Edit",
  "rejected": "Rejected",
  "done": "Completed"
};


  if (loading) {
    return (
      <div className="min-h-screen text-center">
        <Loader color={"#000000"} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-xl text-gray-700">{error || "Error fetching project details"}</p>
        </div>
      </div>
    );
  }

  // Project not found
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-xl text-gray-700">Project is not found  </p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-r from-gray-600 via-black-600 to-gray-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform -rotate-45 bg-white rounded-full w-96 h-96 -top-48 -left-48"></div>
          <div className="absolute transform rotate-45 bg-white rounded-full w-96 h-96 -bottom-48 -right-48"></div>
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow-2xl">
              <Folder className="w-16 h-16 text-base-600" />
            </div>
          </div>

          <h1 className="text-5xl font-extrabold text-center text-white drop-shadow-lg">
            {project.name}
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-xl text-center text-white/90">
            {project.description}
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Calendar className="w-5 h-5 text-white/80" />
            <p className="text-sm text-white/80">
              created   At {formatDate(project.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-12 mx-auto -mt-16 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mb-12 md:grid-cols-5">
          <div className="relative p-8 overflow-hidden text-center transition-all duration-300 transform bg-white shadow-xl group rounded-3xl hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-blue-500 to-purple-500 group-hover:opacity-10"></div>
            <FaUsers className="relative mx-auto mb-4 text-5xl text-gray-600 transition-transform duration-300 group-hover:scale-110" />
            <div className="relative text-4xl font-bold text-gray-800">{stats.totalMembers}</div>
            <div className="relative mt-2 text-sm font-medium text-gray-600">Total Members </div>
          </div>

          <div className="relative p-8 overflow-hidden text-center transition-all duration-300 transform bg-white shadow-xl group rounded-3xl hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-purple-500 to-pink-500 group-hover:opacity-10"></div>
            <FaTasks className="relative mx-auto mb-4 text-5xl text-gray-400 transition-transform duration-300 group-hover:scale-110" />
            <div className="relative text-4xl font-bold text-gray-800">{stats.totalTasks}</div>
            <div className="relative mt-2 text-sm font-medium text-gray-600">Total Tasks</div>
          </div>

          <div className="relative p-8 overflow-hidden text-center transition-all duration-300 transform bg-white shadow-xl group rounded-3xl hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-green-500 to-teal-500 group-hover:opacity-10"></div>
            <FaCheckCircle className="relative mx-auto mb-4 text-5xl text-gray-800 transition-transform duration-300 group-hover:scale-110" />
            <div className="relative text-4xl font-bold text-gray-800">{stats.validTasks}</div>
            <div className="relative mt-2 text-sm font-medium text-gray-600">Valid Tasks</div>
          </div>

          <div className="relative p-8 overflow-hidden text-center transition-all duration-300 transform bg-white shadow-xl group rounded-3xl hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:opacity-10"></div>
            <FaClock className="relative mx-auto mb-4 text-5xl text-gray-400 transition-transform duration-300 group-hover:scale-110" />
            <div className="relative text-4xl font-bold text-gray-800">{stats.pendingTasks}</div>
            <div className="relative mt-2 text-sm font-medium text-gray-600">Pending</div>
          </div>

          <div className="relative p-8 overflow-hidden text-center transition-all duration-300 transform bg-white shadow-xl group rounded-3xl hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-teal-500 to-cyan-500 group-hover:opacity-10"></div>
            <FaFlagCheckered className="relative mx-auto mb-4 text-5xl text-gray-900 transition-transform duration-300 group-hover:scale-110" />
            <div className="relative text-4xl font-bold text-gray-800">{stats.completedTasks}</div>
            <div className="relative mt-2 text-sm font-medium text-gray-600">Completed</div>
          </div>
        </div>

        {/* Members Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white shadow-lg rounded-xl">
              <UserCircle className="w-8 h-8 text-neutral-900" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800">
              Project Members
            </h2>
          </div>

          {members.length === 0 ? (
            <div className="p-16 text-center bg-white shadow-xl rounded-3xl">
              <UserCircle className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <p className="text-gray-500">No members added yet</p>

            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {members.map((member, index) => (
                <div
                  key={member._id}
                  className="relative p-6 overflow-hidden transition-all duration-300 transform bg-white shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2"
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-2 ${index % 4 === 0
                        ? 'bg-gradient-to-r from-gray-100 to-gray-500'
                        : index % 4 === 1
                          ? 'bg-gradient-to-r from-gray-400 to-gray-800'
                          : index % 4 === 2
                            ? 'bg-gradient-to-r from-gray-600 to-black'
                            : 'bg-gradient-to-r from-gray-200 via-gray-500 to-black'
                      }`}
                  ></div>


                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 transition-transform duration-300 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 group-hover:scale-110">
                      <UserCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{member.user_id.name}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="flex-shrink-0 w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ClipboardList className="flex-shrink-0 w-4 h-4 text-gray-500" />
                      <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-xs text-gray-500 border-t">
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
        <div className="space-y-10">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
                Project Tasks
              </h2>
              <p className="mt-2 text-gray-500">
                Manage and track all project activities
              </p>
            </div>

            <div className="flex items-center gap-2 px-5 py-3 bg-black rounded-xl">
              <ClipboardList className="w-6 h-6 text-white" />
              <span className="text-sm font-semibold text-white">
                {tasks.length} Tasks
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-5 p-6 bg-white border border-gray-200 shadow-sm rounded-2xl md:grid-cols-3">

            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="Approved from Member_can_approve">Wait Approved</option>
              <option value="pending_edit">Pending Edit</option>
              <option value="in_progress_edit">In Progress Edit </option>
              <option value="rejected">Rejected</option>
              <option value="done">Completed</option>
            </select>
          </div>

          {/* Tasks */}
          {filteredTasks.length === 0 ? (
            <div className="py-24 text-center bg-white border border-gray-200 rounded-3xl">
              <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">No tasks found</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map(task => {
                const isCompleted = task.is_finished && task.status === "done";
                const isDependent = Array.isArray(task.User_taskId) && task.User_taskId.length > 0;
                const allDone = isDependent && task.User_taskId.every(t => t.is_finished);
                const show = isCompleted || !isDependent || allDone;

                return (
                  <div
                    key={task._id}
                    className={`relative group rounded-2xl border transition-all duration-300
              ${isCompleted
                        ? "border-black bg-gradient-to-br from-gray-50 to-gray-100"
                        : show
                          ? "border-gray-200 bg-white k "
                          : "border-dashed border-gray-300 bg-gray-50"
                      }`}
                  >

                    {/* Priority Indicator */}
                    <div
                      className={`absolute top-0 left-0 w-full h-[3px] rounded-t-2xl
                ${task.task_id?.priority === "high"
                          ? "bg-black"
                          : task.task_id?.priority === "medium"
                            ? "bg-gray-600"
                            : "bg-gray-300"
                        }`}
                    />

                    <div className="flex flex-col p-6 space-y-6">

                      {/* Title */}
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {task.task_id?.name || "Untitled Task"}
                        </h3>


                        <div className="flex items-center justify-center w-10 h-10 bg-gray-900 rounded-xl">
                          {isCompleted ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <Clock className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                    <div className="flex items-center gap-2">
  <Mail className="w-5 h-5 text-gray-500" />
  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
    {task.user_id.email || "No Email"}
  </h3>
</div>

                      <div className="p-4 mb-4 border border-gray-200 shadow-sm bg-gray-50 rounded-xl">
                        {/* Task Description (User specific) */}
                        {task.description && (
                          <div className="flex items-start gap-3 mb-3">
                            <span className="flex-shrink-0 w-6 h-6 text-blue-600">
                              <ClipboardList className="w-6 h-6" />
                            </span>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700">User Note</h4>
                              <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                                {task.description}
                              </p>
                            </div>
                          </div>
                        )}

                        {task.task_id?.description && (
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 text-green-600">
                              <UserCircle className="w-6 h-6" />
                            </span>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700">Original Description</h4>
                              <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                                {task.task_id.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
{task.start_date  && (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-6 h-6 text-green-600">
        <HiOutlineArrowRightStartOnRectangle className="w-6 h-6" />
      </span>
      <div>
        <h4 className="text-sm font-semibold text-gray-700">Start</h4>
        <p className="mt-1 text-sm text-gray-600 line-clamp-3">
          {formatDate(task.start_date)}
        </p>
      </div>
    </div>
  )}
{task.end_date  && (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-6 h-6 text-green-600">
        <GiFinishLine className="w-6 h-6" />
      </span>
      <div>
        <h4 className="text-sm font-semibold text-gray-700">End</h4>
        <p className="mt-1 text-sm text-gray-600 line-clamp-3">
          {formatDate(task.end_date)}
        </p>
      </div>
    </div>
  )}



                      {task.task_id?.file && (
                        <ButtonDown file={task.task_id?.file} />
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-3 py-1 font-semibold text-white bg-black rounded-full">
<span>{statusNames[task.status as StatusValue]}</span>
                        </span>

                        <span className="px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded-full">
                          {task.task_id?.priority || "low"}
                        </span>

                        <span className="text-gray-500">
                          {formatDate(task.createdAt)}
                        </span>
                      </div>


                      {!show && (<>
                        {/* Dependencies */}
                        {isDependent && task.User_taskId.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Depends on:</p>
                            {task.User_taskId.map((dep) => (
                              <div
                                key={dep._id}
                                className="flex items-center justify-between p-2 border border-gray-200 bg-gray-50 rounded-xl"
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {dep.user_id?.name as string || "Unknown"}
                                  </p>
                                  <p className="text-xs text-gray-500">{dep.task_id?.name || "Task"}</p>
                                </div>
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${dep.is_finished ? "bg-black text-white" : "bg-gray-300 text-gray-800"
                                    }`}
                                >
                                  {dep.is_finished ? "Completed" : "In Progress"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                      </>
                      )}

                    </div>
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



export default Teamlead