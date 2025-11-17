import  { useEffect, useMemo } from "react";
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

interface AdminType {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const Admin: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data, loading, error, get } = useGet<AdminType[]>();
  const { del } = useDelete();
  const nav = useNavigate();

  useEffect(() => {
    get("https://taskatbcknd.wegostation.com/api/superadmin/admins");
  }, [get]);

  const handleDelete = async (row: AdminType) => {
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
      const res = await del(`https://taskatbcknd.wegostation.com/api/superadmin/admins/${row._id}`);

      if (res && (res as any).success !== false) {
        toast.success(t("admindeletedsuccessfully"));
        get("https://taskatbcknd.wegostation.com/api/superadmin/admins");
      } else {
        toast.error(t("Failedtodeleteadmin"));
      }
    }
  };

  const columns = [
    { key: "name", label: t("Name") },
    { key: "email", label: t("Email") },
    {
      key: "isVerified",
      label: t("Verified"),
      render: (_: any, row: AdminType) =>
        row.isVerified ? (
          <span className="font-medium text-green-600">{t("Yes")}</span>
        ) : (
          <span className="font-medium text-red-500">{t("No")}</span>
        ),
    },
    { key: "role", label: t("Role") },
    {
      key: "actions",
      label: t("Actions"),
      showLabel: false,
      render: (_: any, row: AdminType) => {
        const baseBtn =
          "px-3 py-1 rounded text-sm font-medium transition-all duration-300";

        return (
          <div className="flex gap-2">
            <button
              className={`${baseBtn} ${
                theme === "dark"
                  ? "bg-maincolor/80 hover:bg-maincolor text-white"
                  : "bg-maincolor hover:bg-maincolor/70 text-white"
              }`}
              onClick={() => nav("/SuperAdmin/addadmin", { state: row._id })}
            >
              {t("Edit")}
            </button>
            <button
              className={`${baseBtn} ${
                theme === "dark"
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-red-400 hover:bg-red-500 text-white"
              }`}
              onClick={() => handleDelete(row)}
            >
              {t("Delete")}
            </button>
          </div>
        );
      },
    },
  ];

  const filteredAdmins = useMemo(() => {
    if (!searchQuery) return data;
    const search = searchQuery.toLowerCase();
    return data?.filter(
      (admin) =>
        admin.name?.toLowerCase().includes(search) ||
        admin.email?.toLowerCase().includes(search)
    );
  }, [data, searchQuery]);

  if (loading)
    return (
      <div className="flex items-center justify-center max-h-screen max-w-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd title={t("Admin")} to="/SuperAdmin/addadmin" />
      </div>

      {error && (
        <p className="font-medium text-red-500">
          {t("Failedtoloadadmins")}: {error}
        </p>
      )}

      {!loading &&
        !error &&
        Array.isArray(filteredAdmins) &&
        filteredAdmins.length > 0 && (
          <Table<AdminType> columns={columns} data={filteredAdmins} />
        )}

      {!loading &&
        !error &&
        (!Array.isArray(filteredAdmins) || filteredAdmins.length === 0) && (
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
            {t("NoAdminsfound")}
          </p>
        )}
    </div>
  );
};

export default Admin;
