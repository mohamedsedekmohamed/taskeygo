import  { useEffect, useMemo } from "react";
import useGet from "../../Hooks/useGet";
import Loading from "../../Component/Loading";
import { useTheme } from "../../Hooks/ThemeContext";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { FaUser, FaCreditCard, FaCalendarAlt, FaProjectDiagram } from "react-icons/fa";
import { useSearchStore } from "../../store/useSearchStore";

interface Subscription {
  _id: string;
  userId: {
    name: string;
    email: string;
    isVerified: boolean;
    role: string;
    createdAt: string;
  };
  planId: {
    name: string;
    price_monthly: number;
    price_annually: number;
    projects_limit: number;
    members_limit: number;
    createdAt: string;
  };
  PaymentId: {
    subscriptionType: string;
    amount: number;
    status: string;
    payment_date: string;
    photo?: string;
    final_price?: number;
  };
  startDate: string;
  endDate: string;
  websites_created_count: number;
  websites_remaining_count: number;
  status: string;
  createdAt: string;
}

const Subscriptions: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { data, loading, error, get } = useGet<{ data: Subscription[] }>();
  const { searchQuery } = useSearchStore(); 

  useEffect(() => {
    get("https://taskatbcknd.wegostation.com/api/superadmin/subscriptions");
  }, [get]);

const filteredSubs = useMemo(() => {
  if (!searchQuery) return data?.data;

  const search = searchQuery.toLowerCase();

  return data?.data?.filter((sub) => {
    const valuesToSearch = [
      sub.userId.name,
      sub.userId.email,
      sub.userId.role,
      sub.planId.name,
      sub.planId.price_monthly?.toString(),
      sub.planId.price_annually?.toString(),
      sub.PaymentId.subscriptionType,
      sub.PaymentId.amount?.toString(),
      sub.PaymentId.status,
      format(new Date(sub.startDate), "dd/MM/yyyy"),
      format(new Date(sub.endDate), "dd/MM/yyyy"),
      sub.status,
      sub.websites_created_count?.toString(),
      sub.websites_remaining_count?.toString()
    ];

    const combined = valuesToSearch.join(" ").toLowerCase();

    return combined.includes(search);
  });
}, [data, searchQuery]);



  if (loading)
    return (
      <div className="flex items-center justify-center max-h-screen max-w-screen">
        <Loading />
      </div>
    );


  if (error) return <p className="text-red-500">{t("Failedtoloadsubscriptions")}</p>;

  return (
    <div className="p-6">
    

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredSubs?.map((sub) => (
          <div
            key={sub._id}
            className={`p-6 rounded-3xl shadow-xl border transition duration-300 
              ${theme === "dark" ? "bg-[#1e1e1e] border-gray-700" : "bg-white border-gray-200"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <FaUser className="text-maincolor" /> {sub.userId.name}
              </h2>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  sub.status === "active"
                    ? "bg-green-500/20 text-green-700"
                    : "bg-red-500/20 text-red-700"
                }`}
              >
                {t(sub.status === "active" ? "Active" : "Inactive")}
              </span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 mb-3 text-sm">
              <FaUser className="text-gray-400" />
              <p>{sub.userId.email} | {sub.userId.role}</p>
              {sub.userId.isVerified && (
                <span className="ml-auto px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                  {t("Verified")}
                </span>
              )}
            </div>

            {/* Plan Info */}
            <div className="flex items-center gap-2 mb-3 text-sm">
              <FaProjectDiagram className="text-gray-400" />
              <p>
                <strong>{t("Plan")}:</strong> {sub.planId.name} | {t("Monthly")}: ${sub.planId.price_monthly}, {t("Annually")}: ${sub.planId.price_annually}
              </p>
            </div>

            {/* Payment Info */}
            <div className="flex items-center gap-2 mb-3 text-sm">
              <FaCreditCard className="text-gray-400" />
              <p>
                <strong>{t("Payment")}:</strong> {sub.PaymentId.subscriptionType} | ${sub.PaymentId.amount} | {sub.PaymentId.status}
              </p>
            </div>

            {sub.PaymentId.photo && (
              <div className="mb-3">
                <img src={sub.PaymentId.photo} alt="Payment" className="w-full rounded-lg shadow-sm" />
              </div>
            )}

            {/* Dates */}
            <div className="flex flex-col gap-1 mb-3 text-sm">
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" /> <strong>{t("Start")}:</strong> {format(new Date(sub.startDate), "dd/MM/yyyy")}
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" /> <strong>{t("End")}:</strong> {format(new Date(sub.endDate), "dd/MM/yyyy")}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className={`p-3 rounded-xl text-center text-sm ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                <p className="font-bold">{sub.websites_created_count}</p>
                <p>{t("UsedWebsites")}</p>
              </div>
              <div className={`p-3 rounded-xl text-center text-sm ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                <p className="font-bold">{sub.websites_remaining_count}</p>
                <p>{t("RemainingWebsites")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
