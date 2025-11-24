import { useEffect, useMemo } from "react";
import ButtonAdd from "../../Ui/ButtonAdd";
import Table from "../../Ui/Table";
import { useTheme } from "../../Hooks/ThemeContext";
import useGet from "../../Hooks/useGet";
import useDelete from "../../Hooks/useDelete";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loading from "../../Component/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchStore } from "../../store/useSearchStore";
import { useTranslation } from "react-i18next";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface UserTaskItem {
  userTaskId: string;
  is_finished:boolean;
roleInsideTask:string
status:string;
  user: UserInfo;
}

const UserTaskProject: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // 👈 data is an array directly based on your log
  const { data, loading, error, get } = useGet<UserTaskItem[]>();
  const { del } = useDelete();
  const nav = useNavigate();
  const location = useLocation();
  const { tasktId, projectId } = location.state || {};

  useEffect(() => {
    if (tasktId) {
      get(`https://taskatbcknd.wegostation.com/api/admin/user-task/${tasktId}`);
    }
  }, [get, tasktId]);

  // 🗑 Delete User
  const handleDelete = async (row: UserTaskItem) => {
    const result = await Swal.fire({
      title: t("DeleteConfirmationTitle", { name: row.user.name }),
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
        `https://taskatbcknd.wegostation.com/api/admin/user-task/${row.user._id}/${tasktId}`
      );

      if (res && (res as any).success !== false) {
        toast.success(t("User deleted successfully"));
        get(`https://taskatbcknd.wegostation.com/api/admin/user-task/${tasktId}`);
      } else {
        toast.error(t("Failed to delete user"));
      }
    }
  };

  const columns = [

    {
      key: "name",
      label: t("Name"),
      render: (_: any, row: UserTaskItem) => row.user.name,
    },
    {
      key: "email",
      label: t("Email"),
      render: (_: any, row: UserTaskItem) => row.user.email,
    },
    {
      key: "role",
      label: t("Role"),
      render: (_: any, row: UserTaskItem) => row.user.role,
    },
        {
      key: "is_finished",
      label: t("is_finished"),
    },
    {
      key: "roleInsideTask",
      label: t("roleInsideTask"),
    },
    {
      key: "status",
      label: t("status"),
    },
    {
      key: "actions",
      label: t("Actions"),
      render: (_: any, row: UserTaskItem) => (
        <div className="flex gap-2">
          {/* <button
            onClick={() =>
              nav(`/admin/editusertaskproject/${row.user._id}`, {
                state: { tasktId, projectId },
              })
            }
            className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {t("Edit")}
          </button> */}
<select
  className="px-3 py-1 text-black bg-white border border-gray-300 rounded hover:border-gray-500"
  value={row.roleInsideTask} 
  onChange={async (e) => {
    const newRole = e.target.value;

    try {
      const res = await fetch(
        `https://taskatbcknd.wegostation.com/api/admin/user-task/role/${row.userTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            user_id: row.user._id,
            role: newRole,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(t("RoleUpdatedSuccessfully"));
        get(`https://taskatbcknd.wegostation.com/api/admin/user-task/${tasktId}`);
      } else {
        toast.error(t("FailedToUpdateRole"));
      }
    } catch (err) {
      toast.error(t("UnknownError"));
    }
  }}
>
  <option value="Member">Member</option>
  <option value="Membercanapprove">Membercanapprove</option>
</select>



<button
  onClick={async () => {
    try {
      const newRole = row.user.role === "Member" ? "Membercanapprove" : "Member";

      const res = await fetch(
        `https://taskatbcknd.wegostation.com/api/admin/user-task/${row.user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
          body: JSON.stringify({
            user_id: row.user._id,
            role: newRole,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(t("RoleUpdatedSuccessfully"));
        get(`https://taskatbcknd.wegostation.com/api/admin/user-task/${tasktId}`);
      } else {
        toast.error(t("FailedToUpdateRole"));
      }
    } catch (err) {
      toast.error(t("UnknownError"));
    }
  }}
  className="px-3 py-1 text-white rounded bg-fuchsia-900 hover:bg-yellow-700"
>
  {t("stutes")}
</button>


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

  // 🔍 Filtering
  const filteredUsers = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;

    return data.filter((item) =>
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // ⏳ Loading
  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd
          title={t("AddUsertask")}
          to={`/admin/addusertaskproject/${tasktId}/${projectId}`}
        />
      </div>

      {error && (
        <p className="text-red-500">{t("Failedtoloadusers")}</p>
      )}

      {filteredUsers.length > 0 ? (
        <Table<UserTaskItem> columns={columns} data={filteredUsers} />
      ) : (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoUsersFound")}
        </p>
      )}
    </div>
  );
};

export default UserTaskProject;
