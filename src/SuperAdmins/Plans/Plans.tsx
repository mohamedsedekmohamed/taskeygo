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

interface PlanType {
  _id: string;
  name: string;
  price_monthly: number;
  price_annually: number;
  projects_limit: number;
  members_limit: number;
  createdAt: string;
}

const Plans: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data, loading, error, get } = useGet<{ plans: PlanType[] }>();
  const { del } = useDelete();
  const nav = useNavigate();

  useEffect(() => {
    get("https://taskatbcknd.wegostation.com/api/superadmin/plans");
  }, [get]);

  const handleDelete = async (row: PlanType) => {
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
        `https://taskatbcknd.wegostation.com/api/superadmin/plans/${row._id}`
      );

      if (res && (res as any).success !== false) {
        toast.success(t("plandeletedsuccessfully"));
        get("https://taskatbcknd.wegostation.com/api/superadmin/plans");
      } else {
        toast.error(t("Failedtodeleteplan"));
      }
    }
  };

  const columns = [
    { key: "name", label: t("Name") },
    { key: "price_monthly", label: t("MonthlyPrice") },
    { key: "price_annually", label: t("AnnualPrice") },
    { key: "projects_limit", label: t("ProjectsLimit") },
    { key: "members_limit", label: t("MembersLimit") },

    {
      key: "actions",
      label: t("Actions"),
      showLabel: false,
      render: (_: any, row: PlanType) => {
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
              onClick={() => nav("/SuperAdmin/addplans", { state: row._id })}
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

  const filteredPlans = useMemo(() => {
    if (!searchQuery) return data?.plans;
    const search = searchQuery.toLowerCase();
    return data?.plans?.filter((plan) =>
      plan.name?.toLowerCase().includes(search)
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
        <ButtonAdd title={t("Plans")} to="/SuperAdmin/addplans" />
      </div>

      {error && (
        <p className="font-medium text-red-500">
          {t("Failedtoloadplans")}: {error}
        </p>
      )}

      {filteredPlans && filteredPlans.length > 0 ? (
        <Table<PlanType> columns={columns} data={filteredPlans} />
      ) : (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoPlansfound")}
        </p>
      )}
    </div>
  );
};

export default Plans;
