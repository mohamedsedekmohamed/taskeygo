import  { useEffect, useMemo, useState } from "react";
import ButtonAdd from "../../Ui/ButtonAdd";
import Table from "../../Ui/Table";
import { useTheme } from "../../Hooks/ThemeContext";
import useGet from "../../Hooks/useGet";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loading from "../../Component/Loading";
import { useSearchStore } from "../../store/useSearchStore";
import { useTranslation } from "react-i18next";

interface PaymentType {
  _id: string;
  userId: { _id: string; name: string; email: string };
  plan_id: { name: string; price_monthly: number; price_annually: number };
  paymentmethod_id: { name: string; logo_Url: string };
  amount: number;
  status: string;
  payment_date: string;
  subscriptionType: string;
  photo: string;
  final_price: number;
}

const Payment: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { get, loading, error } = useGet<{ payments: { pending: PaymentType[]; history: PaymentType[] } }>();

  const [pendingPayments, setPendingPayments] = useState<PaymentType[]>([]);
  const [historyPayments, setHistoryPayments] = useState<PaymentType[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await get("https://taskatbcknd.wegostation.com/api/superadmin/payments");
      if (res?.payments) {
        setPendingPayments(res.payments.pending || []);
        setHistoryPayments(res.payments.history || []);
      }
    };
    fetchPayments();
  }, [get]);

  const handleApprove = async (row: PaymentType) => {
    const result = await Swal.fire({
      title: t("ApprovePaymentTitle", { name: row.userId.name }),
      text: t("ApprovePaymentText"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("YesApprove"),
      cancelButtonText: t("Cancel"),
      background: theme === "dark" ? "#1a1a1a" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    });
        const token = localStorage.getItem("token"); 

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `https://taskatbcknd.wegostation.com/api/superadmin/payments/${row._id}`,
          {
            method: "PUT",
 headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },            body: JSON.stringify({ status: "approved" }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success(t("PaymentApprovedSuccessfully"));
          setPendingPayments((prev) => prev.filter((p) => p._id !== row._id));
          setHistoryPayments((prev) => [...prev, { ...row, status: "approved" }]);
        } else {
          toast.error(data.message || t("FailedToApprovePayment"));
        }
      } catch {
        toast.error(t("FailedToApprovePayment"));
      }
    }
  };

  // ✅ الأعمدة
  const columns = [
    { key: "user", label: t("User"), render: (_: any, row: PaymentType) => row.userId.name },
    { key: "amount", label: t("Amount") },
    { key: "method", label: t("Method"), render: (_: any, row: PaymentType) => row.paymentmethod_id.name },
    { key: "status", label: t("Status") },
    {
      key: "payment_date",
      label: t("PaymentDate"),
      render: (_: any, row: PaymentType) => new Date(row.payment_date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: t("Actions"),
      showLabel: false,
      render: (_: any, row: PaymentType) => {
        const baseBtn = "px-3 py-1 rounded text-sm font-medium transition-all duration-300";
        return (
          <div className="flex gap-2">
            <button
              className={`${baseBtn} ${
                theme === "dark"
                  ? "bg-maincolor hover:bg-maincolor/50 text-white"
                  : "bg-maincolor hover:bg-maincolor/70 text-white"
              }`}
              onClick={() => setSelectedPayment(row)}
            >
              {t("ViewDetails")}
            </button>

            {activeTab === "pending" && (
              <button
                className={`${baseBtn} ${
                  theme === "dark"
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                onClick={() => handleApprove(row)}
              >
                {t("Approve")}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const filteredPayments = useMemo(() => {
    const data = activeTab === "pending" ? pendingPayments : historyPayments;
    if (!searchQuery) return data;
    const search = searchQuery.toLowerCase();
    return data.filter(
      (p) =>
        p.userId.name.toLowerCase().includes(search) ||
        p.paymentmethod_id.name.toLowerCase().includes(search) ||
        p.status.toLowerCase().includes(search)
    );
  }, [pendingPayments, historyPayments, searchQuery, activeTab]);

  if (loading)
    return (
      <div className="flex items-center justify-center max-h-screen max-w-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <ButtonAdd title={t("Payments")} />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "pending" ? "bg-maincolor text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("pending")}
        >
          {t("Pending")}
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "history" ? "bg-maincolor text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("history")}
        >
          {t("History")}
        </button>
      </div>

      {error && <p className="font-medium text-red-500">{t("FailedToLoadPayments")}: {error}</p>}

      {!loading && !error && filteredPayments.length > 0 && (
        <Table<PaymentType> columns={columns} data={filteredPayments} />
      )}

      {!loading && !error && filteredPayments.length === 0 && (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>{t("NoPaymentsFound")}</p>
      )}

      {/* Popup لعرض التفاصيل */}
    {selectedPayment && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
    <div
      className={`relative w-full max-w-lg p-6 rounded-2xl shadow-2xl transform transition-all animate-scaleUp ${
        theme === "dark"
          ? "bg-gray-900/90 text-white border border-gray-700"
          : "bg-white/90 text-gray-900 border border-gray-200"
      }`}
    >
      {/* زر الإغلاق */}
      <button
        onClick={() => setSelectedPayment(null)}
        className="absolute text-gray-400 transition top-3 right-3 hover:text-red-500"
      >
        ✕
      </button>

      {/* العنوان */}
      <h2 className="pb-3 mb-5 text-2xl font-semibold text-center border-b border-gray-300 dark:border-gray-700">
        {t("PaymentDetails")}
      </h2>

      {/* المحتوى */}
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-medium text-gray-500">{t("User")}</p>
          <p>{selectedPayment.userId.name}</p>
        </div>

        <div>
          <p className="font-medium text-gray-500">{t("Email")}</p>
          <p>{selectedPayment.userId.email}</p>
        </div>

        <div>
          <p className="font-medium text-gray-500">{t("Amount")}</p>
          <p>${selectedPayment.amount}</p>
        </div>

        <div>
          <p className="font-medium text-gray-500">{t("FinalPrice")}</p>
          <p>${selectedPayment.final_price}</p>
        </div>

        <div>
          <p className="font-medium text-gray-500">{t("Plan")}</p>
          <p>{selectedPayment.plan_id.name}</p>
        </div>

        <div>
          <p className="font-medium text-gray-500">{t("SubscriptionType")}</p>
          <p>{selectedPayment.subscriptionType}</p>
        </div>

        <div>
          <p className="font-medium text-gray-500">{t("Method")}</p>
          <div className="flex items-center gap-2">
            {selectedPayment.paymentmethod_id.logo_Url && (
              <img
                src={selectedPayment.paymentmethod_id.logo_Url}
                alt="method"
                className="w-6 h-6 rounded-full"
              />
            )}
            <span>{selectedPayment.paymentmethod_id.name}</span>
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-500">{t("Status")}</p>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              selectedPayment.status === "approved"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {selectedPayment.status}
          </span>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <p className="font-medium text-gray-500">{t("PaymentDate")}</p>
          <p>{new Date(selectedPayment.payment_date).toLocaleString()}</p>
        </div>
      </div>

      {/* الصورة لو موجودة */}
      {selectedPayment.photo && (
        <div className="flex justify-center mt-5">
          <img
            src={selectedPayment.photo}
            alt="user"
            className="object-cover w-20 h-20 border border-gray-300 rounded-full shadow-md"
          />
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default Payment;
