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

interface UserType {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
  project_id: string;
  role: "admin" | "member" | "teamlead"|"membercanapprove";
  createdAt: string;
}

const UserProject: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data, loading, error, get } = useGet< UserType[] >();
  const { del } = useDelete();
  const nav = useNavigate();
  const location = useLocation();
  const projectId = location.state || null;

  useEffect(() => {
    get(`https://taskatbcknd.wegostation.com/api/admin/user-project/${projectId}`);
  }, [get, projectId]);

  const handleDelete = async (row: UserType) => {
    const result = await Swal.fire({
      title: t("DeleteConfirmationTitle", { name: row.user_id.name }),
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
      const res = await del(`https://taskatbcknd.wegostation.com/api/admin/user-project/${row.user_id._id}/${projectId}`);
      if (res && (res).success !== false) {
        toast.success(t("User deleted successfully"));
        get(`https://taskatbcknd.wegostation.com/api/admin/user-project/${projectId}`);
      } else {
        toast.error(t("Failed to delete user"));
      }
    }
  };

  const columns = [
    { key: "name", label: t("Name"), render: (_: any, row: UserType) => row.user_id.name },
    { key: "email", label: t("Email"), render: (_: any, row: UserType) => row.user_id.email },
    { key: "role", label: t("Role"), render: (_: any, row: UserType) => row.role },
    {
      key: "actions",
      label: t("Actions"),
      render: (_: any, row: UserType) => (
        <div className="flex gap-2">
          <button
            onClick={() => nav(`/admin/adduserproject/${projectId}`, { state: row })}
            className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {t("Edit")}
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

  const filteredUsers = useMemo(() => {
    if (!searchQuery || !data) return data;
    return data.filter((u) =>
      u.user_id.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.user_id.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd title={t("AddUser")} to={`/admin/adduserproject/${projectId}`} />
      </div>

      {error && <p className="text-red-500">{t("Failed to load users")}</p>}

      {filteredUsers && filteredUsers.length > 0 ? (
        <Table<UserType> columns={columns} data={filteredUsers} />
      ) : (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("No users found")}
        </p>
      )}
    </div>
  );
};

export default UserProject;
