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

interface RejectedReasonType {
  _id: string;
  reason: string;
  points: number;
  createdAt: string;
}

const Rejected: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data, loading, error, get } = useGet<{ RejectedResons: RejectedReasonType[] }>();
  const { del } = useDelete();
  const nav = useNavigate();

  useEffect(() => {
    get("https://taskatbcknd.wegostation.com/api/admin/rejected-reasons");
  }, [get]);

  const handleDelete = async (row: RejectedReasonType) => {
    const result = await Swal.fire({
      title: t("DeleteConfirmationTitle", { name: row.reason }),
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
      const res = await del(`https://taskatbcknd.wegostation.com/api/admin/rejected-reasons/${row._id}`);

      if (res && (res as any).success !== false) {
        toast.success(t("RejectedReasonDeletedSuccessfully"));
        get("https://taskatbcknd.wegostation.com/api/admin/rejected-reasons");
      } else {
        toast.error(t("FailedToDeleteRejectedReason"));
      }
    }
  };

  const columns = [
    { key: "reason", label: t("Reason") },
    { key: "points", label: t("Points") },
    {
      key: "actions",
      label: t("Actions"),
      render: (_: any, row: RejectedReasonType) => (
        <div className="flex gap-2">
          <button
            onClick={() => nav("/admin/addrejected", { state: row._id })}
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

  const filteredReasons = useMemo(() => {
    if (!searchQuery || !data?.RejectedResons) return data?.RejectedResons;
    return data.RejectedResons.filter((r) =>
      r.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd title={t("RejectedReason")} to="/admin/addrejected" />
      </div>

      {error && <p className="text-red-500">{t("FailedToLoadRejectedReasons")}</p>}

      {filteredReasons && filteredReasons.length > 0 ? (
        <Table<RejectedReasonType> columns={columns} data={filteredReasons} />
      ) : (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoRejectedReasonsFound")}
        </p>
      )}
    </div>
  );
};

export default Rejected;
