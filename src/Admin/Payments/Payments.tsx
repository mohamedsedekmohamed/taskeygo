import  { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../Component/Loading";
import { useLocation } from "react-router-dom";
import { AiOutlineUpload } from "react-icons/ai";
import { useTheme } from "../../Hooks/ThemeContext";
import { useTranslation } from "react-i18next";
import { AiOutlineClockCircle, AiOutlineProject, AiOutlineTeam } from "react-icons/ai";

interface Plan {
  _id: string;
  name: string;
  price_monthly: number;
  price_annually: number;
  projects_limit: number;
  members_limit: number,
}

interface PaymentMethod {
  _id: string;
  name: string;
  logo_Url?: string;
  discription?: string;
}

const Payments: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const location = useLocation();
  const { id: selectedIdFromPrev, kind } = location.state || {};

  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("");
  const [subscriptionType, setSubscriptionType] = useState<"monthly" | "yearly">("monthly");
  const [receiptPhoto, setReceiptPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const token = localStorage.getItem("token");

  const truncate = (str: string, limit = 15) =>
    str.length > limit ? str.slice(0, limit) + "..." : str;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://taskatbcknd.wegostation.com/api/user/payments/select",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPlans(res.data.data.plan);
        setPaymentMethods(res.data.data.paymentmethod);

        if (selectedIdFromPrev) {
          if (kind === "Plans") setSelectedPlanId(selectedIdFromPrev);
          if (kind === "PaymentMethods") setSelectedPaymentMethodId(selectedIdFromPrev);
        } else if (res.data.data.plan.length) {
          setSelectedPlanId(res.data.data.plan[0]._id);
        }

        if (!selectedPaymentMethodId && res.data.data.paymentmethod.length)
          setSelectedPaymentMethodId(res.data.data.paymentmethod[0]._id);

      } catch (err: any) {
        toast.error(err.response?.data?.message || t("Failed to load payment data"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, selectedIdFromPrev, t]);

  const getAmount = () => {
    const plan = plans.find((p) => p._id === selectedPlanId);
    return plan
      ? subscriptionType === "monthly"
        ? plan.price_monthly
        : plan.price_annually
      : 0;
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.readAsDataURL(file);
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
    });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024)
      return toast.error(t("Image must be < 5MB"));

    setReceiptPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlanId || !selectedPaymentMethodId)
      return toast.error(t("Please select plan & payment method"));
    if (!receiptPhoto)
      return toast.error(t("Please upload receipt"));
    setSubmitting(true);

    try {
      let photo64 = "";
      if (receiptPhoto) {
        photo64 = await convertToBase64(receiptPhoto);
      }

      await axios.post(
        "https://taskatbcknd.wegostation.com/api/user/payments",
        {
          plan_id: selectedPlanId,
          paymentmethod_id: selectedPaymentMethodId,
          subscriptionType,
          amount: getAmount(),
          ...(photo64 && { photo: photo64 }),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(t("Payment sent."));
      setReceiptPhoto(null);
      setPhotoPreview("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || t("Payment failed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen text-center">
        <Loader />
      </div>
    );

  return (
    <div className={`min-h-screen p-4 md:p-10 ${theme === "dark" ? "bg-bg-dark" : "bg-gray-50"}`}>
      <div className={`p-5 mx-auto shadow-xl rounded-3xl md:p-8 ${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"}`}>
        <h1 className="mb-8 text-3xl font-bold md:text-4xl text-maincolor">
          {t("Payment")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Plans Section */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-maincolor">{t("Choose Plan")}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {plans.map((plan) => {
                const isPlanDisabled = kind === "Plans" && plan._id !== selectedIdFromPrev;
                const isSelected = selectedPlanId === plan._id;

                return (
       <div
  key={plan._id}
  onClick={() => {
    if (isPlanDisabled) return;
    setSelectedPlanId(plan._id);
  }}
  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer
    ${isSelected
      ? "bg-maincolor border-maincolor shadow-md"
      : isPlanDisabled
        ? "border-gray-300 opacity-50 cursor-not-allowed"
        : "border-gray-300 hover:border-maincolor hover:shadow-lg "
    }`}
>
  <h3 className="text-xl font-bold">{truncate(plan.name)}</h3>
  <p className="mt-2 text-lg font-semibold">
    {subscriptionType === "monthly" ? plan.price_monthly : plan.price_annually} EGP
  </p>

  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
    {/* Subscription Type */}
    <div className="flex items-center gap-1">
      <AiOutlineClockCircle className={`${isSelected ? "text-white" : "text-maincolor/50"}`} />
      <span className={`${isSelected ? "text-white" : ""}`}>
        {subscriptionType === "monthly" ? t("Monthly") : t("Yearly")}
      </span>
    </div>

    {/* Projects Limit */}
    <div className="flex items-center gap-1">
      <AiOutlineProject className={`${isSelected ? "text-white" : "text-maincolor/50"}`} />
      <span className={`${isSelected ? "text-white" : ""}`}>
        {plan.projects_limit} {t("Projects")}
      </span>
    </div>

    {/* Members Limit */}
    <div className="flex items-center gap-1">
      <AiOutlineTeam className={`${isSelected ? "text-white" : "text-maincolor/50"}`} />
      <span className={`${isSelected ? "text-white" : ""}`}>
        {plan.members_limit} {t("Members")}
      </span>
    </div>
  </div>
</div>

                );
              })}
            </div>
          </section>

          {/* Subscription Type Section */}
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-maincolor">{t("Subscription Type")}</h2>
            <div className="flex gap-4">
              {["monthly", "yearly"].map((type) => {
                const isSelected = subscriptionType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSubscriptionType(type as "monthly" | "yearly")}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all
                      ${isSelected
                        ? "bg-maincolor text-white shadow-md"
                        : "bg-maincolor/50 text-maincolor border-2 border-maincolor hover:bg-maincolor/70 hover:text-white"
                      }`}
                  >
                    {type === "monthly" ? t("Monthly") : t("Yearly")}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Payment Methods Section */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-maincolor">{t("Payment Method")}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {paymentMethods.map((m) => {
                const isSelected = selectedPaymentMethodId === m._id;
                return (
                  <div
                    key={m._id}
                    onClick={() => setSelectedPaymentMethodId(m._id)}
                    className={`p-4 rounded-2xl text-center border-2 transition-all cursor-pointer
                      ${isSelected
                        ? "bg-maincolor/40 border-maincolor shadow-md"
                        : "border-gray-300 hover:border-maincolor hover:shadow-lg hover:bg-gray-50"
                      }`}
                  >
                    {m.logo_Url && (
                      <img
                        src={m.logo_Url}
                        className="object-contain w-16 h-16 mx-auto mb-2"
                        alt={m.name}
                      />
                    )}
                    <p className="text-sm font-semibold">{truncate(m.name)}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Receipt Upload Section */}
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-maincolor">{t("Upload Receipt")}</h2>
            <label
              htmlFor="receipt-upload"
              className="flex flex-col items-center justify-center w-full p-6 text-center transition-all border-2 border-gray-300 cursor-pointer rounded-2xl bg-maincolor/30 hover:border-maincolor"
            >
              <AiOutlineUpload size={40} className="mb-2 text-gray-700" />
              <span className="text-lg font-semibold">{t("Click to upload receipt")}</span>
              <span className="text-sm text-gray-500">(PNG, JPG, max 5MB)</span>
            </label>

            <input
              type="file"
              id="receipt-upload"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="max-w-xs mt-4 shadow-md rounded-xl"
              />
            )}
          </section>

          {/* Total Section */}
          <section>
            <div className="p-6 text-xl font-bold text-center shadow-md bg-maincolor/60 rounded-2xl">
              {t("Total")}: {getAmount()} EGP
            </div>
          </section>

          {/* Submit Button */}
          <section>
            <button
              disabled={submitting}
              className={`w-full py-4 text-xl font-bold rounded-2xl transition-all
                ${submitting
                  ? "bg-gray-400"
                  : "bg-maincolor text-white hover:bg-gray-800 shadow-md"
                }`}
            >
              {submitting ? t("Submitting...") : t("Confirm Payment")}
            </button>
          </section>

        </form>
      </div>
    </div>
  );
};

export default Payments;
