import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../Component/Loading";
import toast from "react-hot-toast";

import {
  ShieldUser,
  Clock, AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  Download,
  Mail,
  Award,
  Target,
  BarChart3,
  User as UserIcon,
} from "lucide-react";

interface IUser {
  _id: string;
  name: string;
  email: string;
}

interface ITeamMember {
  userTaskId: string;
  user: IUser;
  role: string;
  status: string;
  isFinished: boolean;
  relatedTasks: any[];
}

interface ITask {
  _id: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  end_date: string;
  file: string;
  projectId: {
    _id: string;
    name: string;
    description: string;
  };
}

interface ISummary {
  totalMembers: number;
  byStatus: Record<string, number>;
  byRole: Record<string, number>;
  completionRate: number;
}

interface IFilters {
  appliedRoleFilter: string | null;
  appliedStatusFilter: string | null;
  totalFiltered: number;
}

interface IResponseData {
  task: ITask;
  currentUser: any;
  teamMembers: ITeamMember[];
  summary: ISummary;
  filters: IFilters;
}

interface IResponse {
  success: boolean;
  data: {
    message: string;
    data: IResponseData;
  };
}
interface RejectionReason {
  _id: string;
  reason: string;
  points: number;
}
const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<IResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reasons, setReasons] = useState<RejectionReason[]>([]);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await axios.get(
          "https://taskatbcknd.wegostation.com/api/user/tasks/selection",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReasons(response.data.data.rejected_reason);
      } catch (err) {
        toast.error("Failed to fetch rejection reasons:", err);
      }
    };

    fetchReasons();
  }, []);

  useEffect(() => {

    let isMounted = true;

    const fetchTask = async () => {
      if (!id) {
        if (isMounted) {
          setError("Task ID is missing in the URL.");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token") || "";

        const res = await axios.get<IResponse>(
          `https://taskatbcknd.wegostation.com/api/user/tasks/task/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          setData(res.data);
        }
      } catch (err: any) {
        toast.error("Fetch Error:", err);

        if (isMounted) {
          setError(
            err?.response?.data?.message ||
            err?.message ||
            "An error occurred while fetching data."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTask();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-50 text-gray-800 border-gray-200";
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "done":
        return "bg-green-50 text-green-700 border-green-200";
      case "Approved from Member_can_approve":
        return "bg-emerald-50 text-red-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };
  const updateStatus = async (status: string, ids: string, reason?: string) => {
    try {
      const token = localStorage.getItem("token") || "";

      await axios.put(
        `https://taskatbcknd.wegostation.com/api/user/tasks/${ids}`,
        { status, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.reload();
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  const getRoleIcon = (role?: string) => {
    if (!role) return <Target className="w-4 h-4" />;
    if (role.includes("approve")) return <Award className="w-4 h-4" />;
    if (role.includes("lead")) return <Target className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  if (loading)
    return (
      <div className="min-h-screen text-center">
        <Loader color={"#000000"} />
      </div>
    );

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-2xl">
          <div className="flex items-center gap-4">
            <XCircle className="w-12 h-12 text-red-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Error</h2>
              <p className="mt-2 text-gray-600">
                {error || "No data found."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const info = data.data.data;
  const allMembersFinished = info.teamMembers
    ?.filter(m => m.role === "member")
    .every(m => m.status === "Approved from Member_can_approve");
  // const taskid = info.task._id
  return (
    <div className="min-h-screen py-8 ">
      <div className="px-2 mx-auto lg:px-4">
        {/* Header */}
        <div className="mb-8 border shadow-md rounded-2xl">
          <div className="flex items-center gap-6 p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-black rounded-xl">
              <FileText className="text-white w-7 h-7" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{info.task?.name || "—"}</h1>
              <p className="mt-1 text-gray-600">{info.task?.projectId?.name || "Unknown Project"}</p>
              <p className="mt-1 text-sm text-gray-500">{info.task?.projectId?.description}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Task Info */}
 <div className="w-full max-w-5xl mx-auto bg-white border shadow-sm rounded-2xl">
  {/* Header */}
  <div className="p-3 border-b sm:p-4 lg:p-5">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
      <FileText className="w-5 h-5" />
      Task Information
    </h2>
  </div>

  {/* Content */}
  <div className="p-4 space-y-4 sm:p-6">
    {/* Description */}
    <div>
      <p className="mb-1 text-sm text-gray-500">Description</p>
      <div className="p-3 text-gray-800 rounded-lg sm:p-4 bg-gray-50">
        {info.task?.description || "—"}
      </div>
    </div>

    {/* Grid for details */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Priority */}
      <div className="flex flex-col p-3 border sm:p-4 rounded-xl">
        <p className="mb-1 text-xs text-gray-500">Priority</p>
        <span className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${getPriorityColor(info.task?.priority)}`}>
          {info.task?.priority || "—"}
        </span>
      </div>

      {/* Status */}
      <div className="flex flex-col p-3 border sm:p-4 rounded-xl">
        <p className="mb-1 text-xs text-gray-500">Status</p>
        <span className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${getStatusColor(info.task?.status)}`}>
          {info.task?.status || "—"}
        </span>
      </div>

      {/* End Date */}
      <div className="flex flex-col p-3 border sm:p-4 rounded-xl">
        <p className="mb-1 text-xs text-gray-500">End Date</p>
        <p className="font-semibold">
          {info.task?.end_date
            ? new Date(info.task.end_date).toLocaleDateString("en-US")
            : "—"}
        </p>
      </div>

      {/* File */}
      <div className="flex flex-col p-3 border sm:p-4 rounded-xl">
        <p className="mb-1 text-xs text-gray-500">File</p>
        {info.task?.file ? (
          <a
            href={info.task.file}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-around gap-2 px-3 py-1 text-sm font-semibold text-white bg-black rounded-lg "
          >
            <Download className="w-4 h-4" />
            <p>Download</p>
          </a>
        ) : (
          <span className="text-sm text-gray-600">No file</span>
        )}
      </div>
    </div>
  </div>
</div>


            {/* Team Members */}
            <div className="bg-white border shadow-sm rounded-2xl">
              <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                </div>
                <span className="text-sm text-gray-600">{info.teamMembers?.length ?? 0} Members</span>
              </div>

              <div className="p-6 space-y-4">
                {info.teamMembers && info.teamMembers.length > 0 ? (
                  info.teamMembers.map((member, idx) => (
                    <div key={member.userTaskId || idx} className="flex flex-col gap-6 p-4 bg-white border rounded-xl sm:flex-row sm:items-center">
                      <div className="flex items-center flex-1 gap-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-black rounded-xl">
                          {member.role == "member" ? (<UserIcon className="w-6 h-6 text-white" />) : (<ShieldUser className="w-6 h-6 text-white" /> )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{member.user?.name || "—"}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4" />
                            <span>{member.user?.email || "—"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex">
                      
                          <div className="mt-1">
                            {member.role === "member" && member.status === "done" && (
                              <select
                                className="px-4 py-1 text-sm font-semibold border rounded-lg"
                                defaultValue={member.status || ""}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  if (newStatus === "rejected from Member_can_rejected") {
                                    setSelectedMemberId(member.userTaskId);
                                    setShowRejectPopup(true);
                                    e.target.value = "";
                                    return;
                                  }
                                  try {
                                    const token = localStorage.getItem("token") || "";
                                    await axios.put(
                                      `https://taskatbcknd.wegostation.com/api/user/tasks/review/${member.userTaskId}`,
                                      { status: newStatus },
                                      { headers: { Authorization: `Bearer ${token}` } }
                                    );
                                    member.status = newStatus;
                                    window.location.reload();
                                  } catch (err) {
                                    console.error("Update Status Error:", err);
                                  }
                                }}
                              >
                                <option value="">Select</option>
                                <option value="Approved from Member_can_approve">Approved</option>
                                <option value="rejected from Member_can_rejected">Rejected</option>
                              </select>
                            )}
                            {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                            
{member.role == "membercanapprove" && member.status!=="Approved"&&(
                member.role == "membercanapprove" && allMembersFinished ?
                              (
                                <select
                                  className="px-4 py-1 text-sm font-semibold border rounded-lg"
                                  defaultValue={member.status || ""}
                                  onChange={(e) => {
                                    const newStatus = e.target.value;



                                    updateStatus(newStatus, member.userTaskId, undefined);
                                  }}

                                >
                                  <option value="">Select</option>

                                  {member.status === "pending" && (
                                    <option value="in_progress">In Progress</option>
                                  )}

                                  {member.status === "pending_edit" && (
                                    <option value="in_progress_edit">In Progress Edit</option>
                                  )}

                                  {(member.status === "in_progress" ||
                                    member.status === "in_progress_edit") && (
                                      <option value="done">Done</option>
                                    )}

                                  {member.status === "done" && (
                                    <>
                                      <option value="Approved from Member_can_approve">Approved</option>
                                      <option value="rejected from Member_can_rejected">Rejected</option>
                                    </>
                                  )}
                                </select>
                              )
                              : (
                              null
                              )
                              
)}
                            
              
                              
                          </div>
                        </div>


                        {/* Status */}
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <span className={`px-2 py-1 rounded-lg text-sm font-semibold ${getStatusColor(member.status)}`}>
                            {member.status === "Approved from Member_can_approve" ? "Approved" : member.status}
                          </span>
                        </div>
  <div className="flex flex-col gap-1">
                            <p className="text-xs text-gray-500">Role</p>
                            <span className="inline-flex items-center gap-2">
                                  {getRoleIcon(member.role)}
                                  <span className="text-sm font-semibold">{member.role || "—"}</span>
                                </span>
                          </div>
                        {/* Finished */}
                        <div>
                          <p className="text-xs text-gray-500">Finished</p>
                          <div className="mt-1">
                            {member.isFinished ? (
                              <div className="flex items-center gap-2 font-semibold text-green-600">
                                <CheckCircle className="w-5 h-5" /> Yes
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 font-semibold text-red-600">
                                <XCircle className="w-5 h-5" /> No
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  ))
                ) : (
                  <p className="text-gray-600">No team members found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Current User */}
            <div className="p-5 bg-white border shadow-sm rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Current User</h4>
                  <p className="text-sm text-gray-500">{info.currentUser?.role || "—"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-gray-500">Role</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleIcon(info.currentUser?.role)}
                    <span className="font-semibold">{info.currentUser?.role || "—"}</span>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`px-2 py-1 mt-1 rounded-lg text-sm font-semibold ${getStatusColor(info.currentUser?.status)}`}>
                    {info.currentUser?.status || "—"}
                  </span>
                </div>

                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-gray-500">Finished</p>
                  <div className="mt-1">
                    {info.currentUser?.isFinished ? (
                      <div className="flex items-center gap-2 font-semibold text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        Yes
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 font-semibold text-red-600">
                        <XCircle className="w-5 h-5" />
                        No
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-5 bg-white border border-gray-200 shadow-lg rounded-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-black" />
                <h4 className="text-lg font-bold text-gray-900">Summary & Statistics</h4>
              </div>

              <div className="space-y-5">
                {/* Total Members */}
                <div className="flex items-center gap-3 p-4 shadow-sm rounded-xl bg-gray-50">
                  <Users className="w-6 h-6 text-black" />
                  <div>
                    <p className="text-xs text-gray-500">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{info.summary?.totalMembers ?? 0}</p>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="p-4 shadow-sm rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-black" />
                    <p className="text-xs font-semibold text-gray-900">Completion Rate</p>
                  </div>
                  <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
                    <div
                      className="h-full transition-all duration-300 bg-black"
                      style={{ width: `${info.summary?.completionRate ?? 0}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-center text-gray-900">
                    {info.summary?.completionRate ?? 0}%
                  </p>
                </div>

                {/* By Status */}
                <div className="p-4 shadow-sm rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-black" />
                    <p className="text-xs font-semibold text-gray-900">By Status</p>
                  </div>
                  <div className="space-y-2">
                    {info.summary?.byStatus &&
                      Object.entries(info.summary.byStatus).map(([s, c]) =>
                        c > 0 ? (
                          <div key={s} className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                            <span className="text-sm text-gray-700">{s}</span>
                            <span className="px-2 py-0.5 text-sm font-semibold bg-black text-white rounded-full">{c}</span>
                          </div>
                        ) : null
                      )}
                    {Object.values(info.summary?.byStatus || {}).every(v => v === 0) && (
                      <p className="text-sm text-gray-500">No status records found.</p>
                    )}
                  </div>
                </div>

                {/* By Role */}
                <div className="p-4 shadow-sm rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="w-5 h-5 text-black" />
                    <p className="text-xs font-semibold text-gray-900">By Role</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                      <span className="text-sm text-gray-700">Members</span>
                      <span className="px-2 py-0.5 text-sm font-semibold bg-black text-white rounded-full">
                        {info.summary?.byRole?.members ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                      <span className="text-sm text-gray-700">Can Approve</span>
                      <span className="px-2 py-0.5 text-sm font-semibold bg-black text-white rounded-full">
                        {info.summary?.byRole?.memberCanApprove ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                      <span className="text-sm text-gray-700">Team Leaders</span>
                      <span className="px-2 py-0.5 text-sm font-semibold bg-black text-white rounded-full">
                        {info.summary?.byRole?.teamLead ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>




          </aside>
        </div>
      </div>
      {showRejectPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-80">

            <h2 className="mb-3 text-lg font-bold">  Rejected Reason</h2>

            <select
              className="w-full p-2 border rounded"
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              <option value="">اختر السبب</option>
              {reasons.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.reason} ( -{item.points} points )
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-1 bg-gray-300 rounded"
                onClick={() => setShowRejectPopup(false)}
              >
                Canel
              </button>

              <button
                className="px-4 py-1 text-white bg-red-600 rounded"
                onClick={() => {
                  if (!selectedReason) {
                    toast("Sholud Select Reason");
                    return;
                  }

                  updateStatus(
                    "rejected from Member_can_rejected",
                    selectedMemberId,
                    selectedReason
                  );
                }}
              >
                Yes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TaskDetails;
