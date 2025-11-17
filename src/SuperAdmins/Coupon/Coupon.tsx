import  { useEffect, useMemo, useState } from "react";
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

interface CouponType {
  _id: string;
  code: string;
  start_date: string;
  end_date: string;
  discount_type: string;
  discount_value: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const Coupon: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { get, loading, error } = useGet<{ coupons: CouponType[] }>();
  const { del } = useDelete();
  const nav = useNavigate();

  const [coupons, setCoupons] = useState<CouponType[]>([]);

  // 🧩 fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      const res = await get("https://taskatbcknd.wegostation.com/api/superadmin/Coupons");
      if (res?.coupons) {
        setCoupons(res.coupons);
      }
    };
    fetchCoupons();
  }, [get]);

  // 🧩 handle delete coupon
  const handleDelete = async (row: CouponType) => {
    const result = await Swal.fire({
      title: t("DeleteConfirmationTitle", { name: row.code }),
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
      const res = await del(`https://taskatbcknd.wegostation.com/api/superadmin/Coupons/${row._id}`);
      if (res && (res as any).success !== false) {
        toast.success(t("coupondeletedsuccessfully"));
        setCoupons((prev) => prev.filter((c) => c._id !== row._id));
      } else {
        toast.error(t("Failedtodeletecoupon"));
      }
    }
  };

  // 🧩 table columns
  const columns = [
    { key: "code", label: t("Code") },
    {
      key: "start_date",
      label: t("StartDate"),
      render: (_: any, row: CouponType) => new Date(row.start_date).toLocaleDateString(),
    },
    {
      key: "end_date",
      label: t("EndDate"),
      render: (_: any, row: CouponType) => new Date(row.end_date).toLocaleDateString(),
    },
    { key: "discount_type", label: t("DiscountType") },
    { key: "discount_value", label: t("DiscountValue") },
    {
      key: "isActive",
      label: t("Active"),
      render: (_: any, row: CouponType) =>
        row.isActive ? (
          <span className="font-medium text-green-600">{t("Yes")}</span>
        ) : (
          <span className="font-medium text-red-500">{t("No")}</span>
        ),
    },
    {
      key: "actions",
      label: t("Actions"),
      showLabel: false,
      render: (_: any, row: CouponType) => {
        const baseBtn = "px-3 py-1 rounded text-sm font-medium transition-all duration-300";
        return (
          <div className="flex gap-2">
            <button
              className={`${baseBtn} ${
                theme === "dark"
                  ? "bg-maincolor/80 hover:bg-maincolor text-white"
                  : "bg-maincolor hover:bg-maincolor/70 text-white"
              }`}
              onClick={() => nav("/SuperAdmin/addcoupon", { state: row._id })}
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

  // 🧩 search filter
  const filteredCoupons = useMemo(() => {
    if (!searchQuery) return coupons;
    const search = searchQuery.toLowerCase();
    return coupons.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(search) ||
        coupon.discount_type.toLowerCase().includes(search)
    );
  }, [coupons, searchQuery]);

  if (loading)
    return (
      <div className="flex items-center justify-center max-h-screen max-w-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd title={t("Coupons")} to="/SuperAdmin/addcoupon" />
      </div>

      {error && (
        <p className="font-medium text-red-500">
          {t("Failedtoloadcoupons")}: {error}
        </p>
      )}

      {!loading && !error && filteredCoupons.length > 0 && (
        <Table<CouponType> columns={columns} data={filteredCoupons} />
      )}

      {!loading && !error && filteredCoupons.length === 0 && (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoCouponsfound")}
        </p>
      )}
    </div>
  );
};

export default Coupon;
