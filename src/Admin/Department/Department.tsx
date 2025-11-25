import { useEffect, useMemo } from "react";
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

interface DepartmentType {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface DepartmentResponse {
  success: boolean;
    message: string;
    data: DepartmentType[];
}

const Department: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data, loading, error, get } = useGet<DepartmentResponse>();
  const { del } = useDelete();
  const nav = useNavigate();

  useEffect(() => {
    get("https://taskatbcknd.wegostation.com/api/admin/departments");
  }, [get]);

  const handleDelete = async (row: DepartmentType) => {
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
        `https://taskatbcknd.wegostation.com/api/admin/departments/${row._id}`
      );

      if (res && (res as any).success !== false) {
        toast.success(t("Departmentdeletedsuccessfully"));
        get("https://taskatbcknd.wegostation.com/api/admin/departments");
      } else {
        toast.error(t("Failedtodeletedepartment"));
      }
    }
  };

  // تعريف الأعمدة
  const columns = [
    { key: "name", label: t("Name") },
    {
      key: "actions",
      label: t("Actions"),
      render: (_: any, row: DepartmentType) => (
        <div className="flex gap-2">
          <button
            onClick={() => nav("/admin/adddepartment", { state: row._id })}
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
const departments =  useMemo(() =>data?.data || [], [data]);

const filteredDepartments = useMemo(() => {
  if (!searchQuery) return departments;
  const search = searchQuery.toLowerCase();
  return departments.filter((d) => d.name.toLowerCase().includes(search));
}, [departments, searchQuery]);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd title={t("Department")} to="/admin/adddepartment" />
      </div>

      {error && <p className="text-red-500">{t("Failedtoloaddepartments")}</p>}

      {filteredDepartments.length > 0 ? (
        <Table<DepartmentType> columns={columns} data={filteredDepartments} />
      ) : (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoDepartmentsFound")}
        </p>
      )}
    </div>
  );
};

export default Department;
