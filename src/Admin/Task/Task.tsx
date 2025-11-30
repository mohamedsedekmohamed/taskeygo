import { useEffect, useMemo, useState } from "react";
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
  status?: string;
  end_date?: string;
  file?: string | null;
  recorde?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  email?: string;
}

interface TaskResponse {
  success: boolean;
  message?: string;
  tasks: TaskType[];
}

interface UserReasons {
  _id: string;
  reason: string;
  points: string;
}
const Task: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data, loading, error, get } = useGet<TaskResponse>();
  const { del } = useDelete();
  const nav = useNavigate();
  const [option,setOption]=useState<UserReasons[]>([]);
    const token = localStorage.getItem("token") || "";

  useEffect(() => {
      axios
      .get(`https://taskatbcknd.wegostation.com/api/admin/rejected-reasons`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const Reasons: UserReasons[] = (res.data.data?.data || []).map((item: { _id: string; reason?: string; points?: string }) => ({
          _id: item._id,
          reason: item.reason || "Unknown User",
          points: item.points || "Unknown User",
        }));
        setOption(Reasons);
      })
      .catch((err) => console.error(err));
    get("https://taskatbcknd.wegostation.com/api/admin/tasks");
    
  }, [get]);

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

      if (res && (res).success !== false) {
        toast.success(t("TaskDeletedSuccessfully"));
        get("https://taskatbcknd.wegostation.com/api/admin/tasks");
      } else {
        toast.error(t("FailedToDeleteTask"));
      }
    }
  };

  // تعريف الأعمدة
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
      key: "status",
      label: t("Status"),
    },
    {
      key: "createdBy",
      label: t("CreatedBy"),
      render: (_: any, row: TaskType) => row.createdBy?.name || "-",
    },
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
    )
}
,
    {
      key: "actions",
      label: t("Actions"),
      render: (_: any, row: TaskType) => (
        <div className="flex gap-2">
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
      projectId: row.projectId?._id
    }
  })
}
            className="px-3 py-1 text-white rounded bg-maincolor hover:bg-maincolor/70"
          >
usertask
          </button>
              {(row.status === "Approved from Member_can_approve" || row.status === "done") && (
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
  option.map(opt => [opt._id, `${opt.reason} (${opt.points})`])
),
              inputPlaceholder: t("SelectReason"),
              showCancelButton: true,
            });

            if (reasonId.isConfirmed) {
              try {
                const res = await fetch(
                  `https://taskatbcknd.wegostation.com/api/admin/user-task/${row._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      // User_taskId: row.userTaskId,
                      status: newStatus,
                      rejection_reasonId: reasonId.value,
                    }),
                  }
                );
                const data = await res.json();
                if (data.success) {
                  toast.success(t("StatusUpdatedSuccessfully"));
                  get(`https://taskatbcknd.wegostation.com/api/admin/user-task/${tasktId}`);
                } else toast.error(t("FailedToUpdateStatus"));
              } catch (err) {
                toast.error(t("UnknownError"));
              }
            }
          } else {
            try {
              const res = await fetch(
                `https://taskatbcknd.wegostation.com/api/admin/user-task/${row.userTaskId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    // User_taskId: row.userTaskId,
                    status: newStatus,
                  }),
                }
              );
              const data = await res.json();
              if (data.success) {
                toast.success(t("StatusUpdatedSuccessfully"));
                get(`https://taskatbcknd.wegostation.com/api/admin/user-task/${tasktId}`);
              } else toast.error(t("FailedToUpdateStatus"));
            } catch (err) {
              toast.error(t("UnknownError"));
            }
          }
        }}
      >
        <option value="">Select</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>  </div>
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

  const tasks = useMemo(() =>data?.tasks || [], [data]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery||!tasks) return tasks;
    const search = searchQuery.toLowerCase();
    return tasks.filter((t) => t.name.toLowerCase().includes(search));
  }, [tasks, searchQuery]);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd title={t("Task")} to="/admin/addtask" />
      </div>

      {error && <p className="text-red-500">{t("FailedToLoadTasks")}</p>}

      {filteredTasks.length > 0 ? (
        <Table<TaskType> columns={columns} data={filteredTasks} />
      ) : (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoTasksFound")}
        </p>
      )}
    </div>
  );
};

export default Task;
