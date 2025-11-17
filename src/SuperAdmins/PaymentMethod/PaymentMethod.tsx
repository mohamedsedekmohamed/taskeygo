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

interface PaymentMethodType {
  _id: string;
  name: string;
  isActive: boolean;
  discription: string;
  logo_Url: string;
  createdAt: string;
  updatedAt: string;
}

const PaymentMethods: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { get, loading, error } = useGet<{ paymentMethods: PaymentMethodType[]  }>();
  const { del } = useDelete();
  const nav = useNavigate();

  const [methods, setMethods] = useState<PaymentMethodType[]>([]);

  // 🧩 Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const res = await get("https://taskatbcknd.wegostation.com/api/superadmin/payment-methods");
      if (res?.paymentMethods) {
        setMethods(res.paymentMethods);
      }
    };
    fetchPaymentMethods();
  }, [get]);

  // 🧩 Handle delete
  const handleDelete = async (row: PaymentMethodType) => {
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
      const res = await del(`https://taskatbcknd.wegostation.com/api/superadmin/payment-methods/${row._id}`);
      if (res && (res as any).success !== false) {
        toast.success(t("Paymentmethoddeletedsuccessfully"));
        setMethods((prev) => prev.filter((m) => m._id !== row._id));
      } else {
        toast.error(t("Failedtodeletepaymentmethod"));
      }
    }
  };

  // 🧩 Table columns
  const columns = [
    {
      key: "logo_Url",
      label: t("Logo"),
      render: (_: any, row: PaymentMethodType) => (
        <img
          src={row.logo_Url}
          alt={row.name}
          className="object-contain w-10 h-10 border rounded-md"
        />
      ),
    },
    { key: "name", label: t("Name") },
    { key: "discription", label: t("Description") },
    {
      key: "isActive",
      label: t("Active"),
      render: (_: any, row: PaymentMethodType) =>
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
      render: (_: any, row: PaymentMethodType) => {
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
              onClick={() => nav("/SuperAdmin/addpaymentmethod", { state: row._id })}
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

  // 🧩 Search filter
  const filteredMethods = useMemo(() => {
    if (!searchQuery) return methods;
    const search = searchQuery.toLowerCase();
    return methods.filter(
      (method) =>
        method.name.toLowerCase().includes(search) ||
        method.discription?.toLowerCase().includes(search)
    );
  }, [methods, searchQuery]);

  if (loading)
    return (
      <div className="flex items-center justify-center max-h-screen max-w-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd title={t("PaymentMethods")} to="/SuperAdmin/addpaymentmethod" />
      </div>

      {error && (
        <p className="font-medium text-red-500">
          {t("Failedtoloadpaymentmethods")}: {error}
        </p>
      )}

      {!loading && !error && filteredMethods.length > 0 && (
        <Table<PaymentMethodType> columns={columns} data={filteredMethods} />
      )}

      {!loading && !error && filteredMethods.length === 0 && (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoPaymentMethodsFound")}
        </p>
      )}
    </div>
  );
};

export default PaymentMethods;
