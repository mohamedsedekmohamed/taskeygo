import { useEffect, useMemo } from "react";
import ButtonAdd from "../../Ui/ButtonAdd";
import Table from "../../Ui/Table";
import { useTheme } from "../../Hooks/ThemeContext";
import useGet from "../../Hooks/useGet";
import useDelete from "../../Hooks/useDelete";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loading from "../../Component/Loading";
import { useLocation ,useNavigate} from "react-router-dom";
import { useSearchStore } from "../../store/useSearchStore";
import { useTranslation } from "react-i18next";
// import axios from "axios";
import { TiArrowBack } from "react-icons/ti";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface DependsOnItem {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
}

interface UserTaskItem {
    _id: string;

  userTaskId: string;
  is_finished:boolean;
roleInsideTask:string
status:string;
  user: UserInfo;
    dependsOn: DependsOnItem[];
}


const UserTaskProject: React.FC = () => {

  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
const nav=useNavigate();
  const { data, loading, error, get } = useGet<UserTaskItem[]>();
  const { del } = useDelete();
  const location = useLocation();
  const { tasktId, projectId } = location.state || {};

  useEffect(() => {
    
      get(`https://taskatbcknd.wegostation.com/api/admin/user-task/${tasktId}`);
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
const buttonClasses = `
    flex items-center gap-2 rounded-lg border transition font-semibold
    text-base sm:text-lg md:text-xl
    px-3 sm:px-4 py-1.5 sm:py-2 mt-2 sm:mt-3
    ${
      theme === "dark"
        ? "bg-black/80 hover:bg-black/60 border-white text-white"
        : "bg-maincolor/50 hover:bg-maincolor/80 text-maincolor hover:text-white border border-maincolor"
    }
  `;
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
      <select
        className="px-3 py-1 text-black bg-white border border-gray-300 rounded hover:border-gray-500"
        value={row.roleInsideTask}
        onChange={async (e) => {
          const newRole = e.target.value;
          try {
            const res = await fetch(
              `https://taskatbcknd.wegostation.com/api/admin/user-task/role/${tasktId}`,
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
            } else toast.error(t("FailedToUpdateRole"));
          } catch (err) {
            toast.error(t("UnknownError"));
          }
        }}
      >
        <option value="member">Member</option>
        <option value="membercanapprove">Membercanapprove</option>
      </select>



    

      {/* Delete button */}
      <button
        onClick={() => handleDelete(row)}
        className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
      >
        {t("Delete")}
      </button>
    </div>
  ),
},
{
  key: "dependsOn",
  label: t("DependsOn"),
  render: (_: any, row: UserTaskItem) => {
    if (!row.dependsOn || row.dependsOn.length === 0) {
      return (
        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
          {t("NoDependency")}
        </span>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        {row.dependsOn.map((dep) => (
          <span
            key={dep._id}
            className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded"
          >
            {dep.user_id.name}
          </span>
        ))}
      </div>
    );
  },
},


  ];

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;

    return data.filter((item) =>
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase())||
      item.user.email.toLowerCase().includes(searchQuery.toLowerCase())||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
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
         <button onClick={() => nav(-1)} className={buttonClasses}>
                     <TiArrowBack className="inline-block text-sm sm:text-base" />
                   </button>
      </div>

   {error ? (
  <p className="text-red-500">{t("Failedtoloadusers")}</p>
) : filteredUsers.length > 0 ? (
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
