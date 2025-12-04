import { useEffect, useState, useMemo } from "react";
import ButtonAdd from "../../Ui/ButtonAdd";
import Table from "../../Ui/Table";
import { useTheme } from "../../Hooks/ThemeContext";
import useGet from "../../Hooks/useGet";
import useDelete from "../../Hooks/useDelete";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loading from "../../Component/Loading";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "../../store/useSearchStore";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface TaskType {
  _id: string;
  name: string;
  description?: string;
  priority?: string;
  projectId?: { _id: string; name: string };
  Depatment_id?: { _id: string; name: string };
  createdBy?: { _id: string; name: string; email: string };
  status?: string; // active / inactive / waiting_for_approve
  end_date?: string;
  file?: string | null;
  recorde?: string | null;
  start_date?: string |null;
  updatedAt?: string;
  is_active?: boolean;
  email?: string;
}

interface UserReasons {
  _id: string;
  reason: string;
  points: string;
}

interface TaskResponse {
  success: boolean;
    activeTasks: TaskType[];
    inactiveTasks: TaskType[];
}

const Task: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data, loading, error, get } = useGet<TaskResponse>();
  const { del } = useDelete();
  const nav = useNavigate();
  const [option, setOption] = useState<UserReasons[]>([]);
  const [currentTab, setCurrentTab] = useState<"active" | "inactive">("active");
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    // جلب أسباب الرفض
    axios
      .get(`https://taskatbcknd.wegostation.com/api/admin/rejected-reasons`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const Reasons: UserReasons[] = (res.data.data?.data || []).map(
          (item: { _id: string; reason?: string; points?: string }) => ({
            _id: item._id,
            reason: item.reason || "Unknown User",
            points: item.points || "Unknown User",
          })
        );
        setOption(Reasons);
      })
      .catch((err) => console.error(err));

    get("https://taskatbcknd.wegostation.com/api/admin/tasks");
  }, [get, token]);

  const handleDelete = async (row: TaskType) => {
    const result = await Swal.fire({
      title: t("DeleteConfirmationTitle", { name: row.name }),
      text: t("DeleteConfirmationText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("YesDelete"),
      cancelButtonText: t("Cancel"),
      background: theme === "dark" ? "#1a1a1a" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    });

    if (result.isConfirmed) {
      const res = await del(
        `https://taskatbcknd.wegostation.com/api/admin/tasks/${row._id}`
      );

      if (res && (res as any).success !== false) {
        toast.success(t("TaskDeletedSuccessfully"));
        get("https://taskatbcknd.wegostation.com/api/admin/tasks");
      } else {
        toast.error(t("FailedToDeleteTask"));
      }
    }
  };

  const columns = [
    { key: "name", label: t("Title") },
    { key: "description", label: t("Description") },
    { key: "priority", label: t("Priority") },
    {
      key: "projectId",
      label: t("Project"),
      render: (_: any, row: TaskType) => row.projectId?.name || "-",
    },
    {
      key: "Department_id",
      label: t("Department"),
      render: (_: any, row: TaskType) => row.Depatment_id?.name || "-",
    },
{
  key: "status_active",
  label: t("Status"),
  render: (_: any, row: TaskType) => {

    const toggleActive = async () => {
      try {
        const res = await fetch(
          `https://taskatbcknd.wegostation.com/api/admin/tasks/toggle_status/${row._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ is_active: !row.is_active }),
          }
        );

        const data = await res.json();
        if (data.success) {
          toast.success(t("StatusUpdatedSuccessfully"));
          get("https://taskatbcknd.wegostation.com/api/admin/tasks");
        } else {
          toast.error(t("FailedToUpdateStatus"));
        }
      } catch {
        toast.error(t("UnknownError"));
      }
    };

    // ------------------ Badge Colors ------------------
    const statusColors =
      row.status === "completed"
        ? "bg-green-100 text-green-700"
        : row.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-blue-100 text-blue-700";

    return (
      <div className="flex items-center gap-3">

        {/* Badge */}
        {!row.is_active ? (
          <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
            {t("Not Started")}
          </span>
        ) : (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors}`}
          >
            {t(row.status || "Active")}
          </span>
        )}

        {/* Toggle Button */}
        <button
          onClick={toggleActive}
          className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
            row.is_active
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {row.is_active ? t("Deactivate") : t("Activate")}
        </button>
      </div>
    );
  },
}

,
{
  key: "dates",
  label: t("Dates"),
  render: (_: any, row: TaskType) => {
    const formatDate = (d?: string | null) => {
      if (!d) return null; // covers null, undefined, empty
      const parsed = Date.parse(d);
      if (Number.isNaN(parsed)) return null;
      return new Date(parsed).toLocaleDateString("en-GB"); // or "ar-EG"
    };

    const startDate = formatDate(row.start_date);
    const endDate = formatDate(row.end_date);

    // لو مفيش أي تاريخ نعرض "-"
    if (!startDate && !endDate) return <span className="text-sm text-gray-500">-</span>;

    return (
      <div className="flex flex-col text-sm">
        {startDate && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-600">
              <span className="font-medium">{t("Start")}: </span>{startDate}
            </span>
          </div>
        )}

        {endDate && (
          <div className="flex items-center gap-2 mt-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-600">
              <span className="font-medium">{t("End")}: </span>{endDate}
            </span>
          </div>
        )}
      </div>
    );
  },
}
,
    {
      key: "file",
      label: t("file"),
      render: (_: any, row: TaskType) =>
        row.file ? (
          <a
            href={row.file}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 text-white rounded-md bg-maincolor hover:bg-maincolor/80"
          >
            {t("download")}
          </a>
        ) : (
          "-"
        ),
    },
    {
      key: "actions",
      label: t("Actions"),
      render: (_: any, row: TaskType) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => nav("/admin/addtask", { state: row._id })}
            className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {t("Edit")}
          </button>
          <button
            onClick={() =>
              nav("/admin/usertaskproject", {
                state: {
                  tasktId: row._id,
                  projectId: row.projectId?._id,
                },
              })
            }
            className="px-3 py-1 text-white rounded bg-maincolor hover:bg-maincolor/70"
          >
            {t("userintask")}
          </button>
          {row.status === "waiting_for_approve" && (
            <div>
              <select
                className="px-3 py-1 text-black bg-white border border-gray-300 rounded hover:border-gray-500"
                value={row.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  if (newStatus === "rejected") {
                    const reasonId = await Swal.fire({
                      title: t("SelectRejectionReason"),
                      input: "select",
                      inputOptions: Object.fromEntries(
                        option.map((opt) => [opt._id, `${opt.reason} (${opt.points})`])
                      ),
                      inputPlaceholder: t("SelectReason"),
                      showCancelButton: true,
                    });

                    if (reasonId.isConfirmed) {
                      try {
                        const res = await fetch(
                          `https://taskatbcknd.wegostation.com/api/admin/tasks/approve_reject/${row._id}`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                            body: JSON.stringify({
                              status: newStatus,
                              rejection_reasonId: reasonId.value,
                            }),
                          }
                        );
                        const data = await res.json();
                        if (data.success) {
                          toast.success(t("StatusUpdatedSuccessfully"));
                          get(`https://taskatbcknd.wegostation.com/api/admin/tasks`);
                        } else toast.error(t("FailedToUpdateStatus"));
                      } catch (err) {
                        toast.error(t("UnknownError"));
                      }
                    }
                  } else {
                    try {
                      const res = await fetch(
                        `https://taskatbcknd.wegostation.com/api/admin/tasks/approve_reject/${row._id}`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                          body: JSON.stringify({ status: newStatus }),
                        }
                      );
                      const data = await res.json();
                      if (data.success) {
                        toast.success(t("StatusUpdatedSuccessfully"));
                        get(`https://taskatbcknd.wegostation.com/api/admin/tasks`);
                      } else toast.error(t("FailedToUpdateStatus"));
                    } catch (err) {
                      toast.error(t("UnknownError"));
                    }
                  }
                }}
              >
                <option value="">Select</option>
                <option value="Approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
          <button
            onClick={() => handleDelete(row)}
            className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
          >
            {t("Delete")}
          </button>
        </div>
      ),
    },
  ];

  // derive filtered lists from data.active and data.inactive inside useMemo
  const filteredActiveTasks = useMemo(() => {
    const activeTasks = data?.activeTasks || [];
    if (!searchQuery) return activeTasks;
    return activeTasks.filter((task: TaskType) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.activeTasks, searchQuery]);

  const filteredInactiveTasks = useMemo(() => {
    const inactiveTasks = data?.inactiveTasks || [];
    if (!searchQuery) return inactiveTasks;
    return inactiveTasks.filter((task: TaskType) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.inactiveTasks, searchQuery]);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd title={t("Task")} to="/admin/addtask" />
      </div>

      {/* Tabs */}
      <div className="flex w-full gap-4 mb-4">
        <button
          className={`px-4 w-full  py-2 rounded-3xl ${
            currentTab === "active"
              ? "bg-maincolor text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setCurrentTab("active")}
        >
          {t("Active")}
        </button>
        <button
          className={`px-4 py-2 w-full  rounded-3xl ${
            currentTab === "inactive"
              ? "bg-maincolor text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setCurrentTab("inactive")}
        >
          {t("Inactive")}
        </button>
      </div>

      {error && <p className="text-red-500">{t("FailedToLoadTasks")}</p>}

      {currentTab === "active" && filteredActiveTasks.length === 0 && (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoTasksFound")}
        </p>
      )}
      {currentTab === "inactive" && filteredInactiveTasks.length === 0 && (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoTasksFound")}
        </p>
      )}

      {currentTab === "active" && filteredActiveTasks.length > 0 && (
        <Table<TaskType> columns={columns} data={filteredActiveTasks} />
      )}
      {currentTab === "inactive" && filteredInactiveTasks.length > 0 && (
        <Table<TaskType> columns={columns} data={filteredInactiveTasks} />
      )}
    </div>
  );
};

export default Task;
