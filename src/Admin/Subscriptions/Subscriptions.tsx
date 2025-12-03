import  { useEffect, useMemo, useState } from "react";
import Table from "../../Ui/Table";
import { useTheme } from "../../Hooks/ThemeContext";
import useGet from "../../Hooks/useGet";
import Loading from "../../Component/Loading";
import { useSearchStore } from "../../store/useSearchStore";
import { useTranslation } from "react-i18next";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineCreditCard,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineDollarCircle,
  AiOutlineDatabase,
  AiOutlineGlobal,
} from "react-icons/ai";

interface InfoCardProps {
icon: React.ReactElement;
  label: string;
  value: string | number | undefined | null;
}

interface SubscriptionType {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  planId: {
    name: string;
    price_monthly: number;
    price_annually: number;
  };
  PaymentId: {
    amount: number;
    status: string;
    subscriptionType: string;
  };
  startDate: string;
  endDate: string;
  websites_created_count: number;
  websites_remaining_count: number;
  status: string;
}

interface SubscriptionResponse {
  success: boolean;
    message: string;
    data: SubscriptionType[];
}



interface TableColumn<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactElement | string | number;
}


const Subscriptions: React.FC = () => {
  const { searchQuery } = useSearchStore();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { data, loading, error, get } = useGet<SubscriptionResponse>();
  const [selected, setSelected] = useState<SubscriptionType | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = (row: SubscriptionType) => {
    setSelected(row);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelected(null);
  };

  useEffect(() => {
    get("https://taskatbcknd.wegostation.com/api/admin/subscriptions");
  }, [get]);

  const subscriptions: SubscriptionType[] = data?.data ?? [];

 
  const filtered = useMemo(() => {
    if (!searchQuery) return subscriptions;
    const s = searchQuery.toLowerCase();
    return subscriptions.filter(
      (sub) =>
        sub.userId?.name?.toLowerCase().includes(s) ||
        sub.userId?.email?.toLowerCase().includes(s) ||
        sub.planId?.name?.toLowerCase().includes(s)
    );
  }, [subscriptions, searchQuery]);



  const columns: TableColumn<SubscriptionType>[] = [
    {
      key: "user",
      label: t("User"),
      render: (_, row) => row.userId?.name,
    },
    {
      key: "email",
      label: t("Email"),
      render: (_, row) => row.userId?.email,
    },
    {
      key: "plan",
      label: t("Plan"),
      render: (_, row) => row.planId?.name,
    },
    {
      key: "monthlyPrice",
      label: t("MonthlyPrice"),
      render: (_, row) => row.planId?.price_monthly,
    },
    {
      key: "annualPrice",
      label: t("AnnualPrice"),
      render: (_, row) => row.planId?.price_annually,
    },
    {
      key: "status",
      label: t("Status"),
      render: (_, row) => row.status,
    },
    {
      key: "actions",
      label: t("Details"),
      render: (_, row) => (
        <button
          onClick={() => openPopup(row)}
          className="flex items-center gap-2 px-3 py-1 text-white transition rounded-lg bg-maincolor hover:bg-maincolor/80"
        >
          <span className="text-sm material-icons">{t("visibility")}</span>
        </button>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">{t("Subscriptions")}</h1>

      {error && <p className="text-red-500">{t("FailedToLoadSubscriptions")}</p>}

      {filtered.length > 0 ? (
        <Table<SubscriptionType> columns={columns} data={filtered} />
      ) : (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
          {t("NoSubscriptionsFound")}
        </p>
      )}

      {/* Popup */}
      {showPopup && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 w-[90%] max-w-lg max-h-[80vh] overflow-auto">

            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {t("SubscriptionDetails")}
              </h2>
              <button
                onClick={closePopup}
                className="text-2xl text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <InfoCard icon={<AiOutlineUser className="text-2xl text-blue-500" />} label={t("User")} value={selected.userId?.name} />

              <InfoCard icon={<AiOutlineMail className="text-2xl text-green-500" />} label={t("Email")} value={selected.userId?.email} />

              <InfoCard icon={<AiOutlineCreditCard className="text-2xl text-purple-500" />} label={t("Plan")} value={selected.planId?.name} />

              <div className="grid grid-cols-2 gap-4">
                <InfoCard icon={<AiOutlineCalendar className="text-2xl text-orange-500" />} label={t("StartDate")} value={selected.startDate?.slice(0, 10)} />
                <InfoCard icon={<AiOutlineCalendar className="text-2xl text-red-500" />} label={t("EndDate")} value={selected.endDate?.slice(0, 10)} />
              </div>

              <InfoCard icon={<AiOutlineCheckCircle className="text-2xl text-yellow-500" />} label={t("PaymentStatus")} value={selected.PaymentId?.status} />

              <InfoCard icon={<AiOutlineDollarCircle className="text-2xl text-teal-500" />} label={t("AmountPaid")} value={selected.PaymentId?.amount} />

              <InfoCard icon={<AiOutlineDatabase className="text-2xl text-pink-500" />} label={t("SubscriptionType")} value={selected.PaymentId?.subscriptionType} />

              <InfoCard icon={<AiOutlineGlobal className="text-2xl text-blue-400" />} label={t("WebsitesCreated")} value={selected.websites_created_count} />

              <InfoCard icon={<AiOutlineGlobal className="text-2xl text-indigo-500" />} label={t("WebsitesRemaining")} value={selected.websites_remaining_count} />
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={closePopup}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;



const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 transition-colors bg-gray-100 cursor-default rounded-xl dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
    {icon}
    <div>
      <p className="text-sm text-gray-500 t-3 dark:text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  </div>
);
