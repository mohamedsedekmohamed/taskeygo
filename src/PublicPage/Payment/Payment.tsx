// src/pages/Payment.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../Component/Loading";
import { useLocation } from "react-router-dom";
import { AiOutlineUpload } from "react-icons/ai";

interface Plan {
  _id: string;
  name: string;
  price_monthly: number;
  price_annually: number;
}

interface PaymentMethod {
  _id: string;
  name: string;
  logo_Url?: string;
  discription?: string;
}

const Payment = () => {
  const location = useLocation();
  const { id: selectedIdFromPrev, kind } = location.state || {};

  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("");

  const [subscriptionType, setSubscriptionType] =
    useState<"monthly" | "yearly">("monthly");

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
        toast.error(err.response?.data?.message || "Failed to load payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, selectedIdFromPrev]);

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
      return toast.error("Image must be < 5MB");

    setReceiptPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlanId || !selectedPaymentMethodId)
      return toast.error("Please select plan & payment method");
    if (!receiptPhoto )
      return toast.error("Please receipt Photo");
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

      toast.success("Payment sent.");
      setReceiptPhoto(null);
      setPhotoPreview("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen text-center">
        <Loader color="#000000" />
      </div>
    );

  return (
    <div className="min-h-screen p-4 grayscale md:p-10">
      <div className="max-w-4xl p-5 mx-auto shadow-xl rounded-xl md:p-8">
        <h1 className="mb-8 text-3xl font-bold text-center md:text-4xl">
          Payment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* 🟦 PLANS */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Choose Plan</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {plans.map((plan) => {
                const isPlanDisabled = kind === "Plans" && plan._id !== selectedIdFromPrev;

                return (
                  <div
                    key={plan._id}
                    onClick={() => {
                      if (isPlanDisabled) return;
                      setSelectedPlanId(plan._id);
                    }}
                    className={`p-5 rounded-xl border-2 transition
                      ${
                        selectedPlanId === plan._id
                          ? "border-black bg-gray-200 shadow-md"
                          : isPlanDisabled
                          ? "border-gray-400 opacity-50 cursor-not-allowed"
                          : "border-gray-400 hover:border-black cursor-pointer"
                      }`}
                  >
                    <h3 className="text-xl font-bold break-words">
                      {truncate(plan.name)}
                    </h3>

                    <p className="mt-2 text-lg">
                      <span className="font-bold">{plan.price_monthly}</span>{" "}
                      EGP / month
                    </p>
                    <p className="text-sm">
                      or <strong>{plan.price_annually}</strong> yearly
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
<div>
  <h2 className="mb-3 text-2xl font-semibold">Subscription Type</h2>
  <div className="flex gap-4">
    {["monthly", "yearly"].map((type) => {
      const isSelected = subscriptionType === type;
      return (
        <button
          key={type}
          type="button"
          onClick={() => setSubscriptionType(type as "monthly" | "yearly")}
          className={`px-6 py-3 rounded-xl font-semibold transition
            ${
              isSelected
                ? "bg-black text-white shadow-md"
                : "bg-white text-black border-2 border-black hover:bg-black hover:text-white"
            }`}
        >
          {type === "monthly" ? "Monthly" : "Yearly"}
        </button>
      );
    })}
  </div>
</div>
          {/* 🟦 PAYMENT METHODS */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Payment Method</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {paymentMethods.map((m) => {
                const isPaymentDisabled = kind === "PaymentMethods";

                return (
                  <div
                    key={m._id}
                    onClick={() => {
                      if (isPaymentDisabled) return;
                      setSelectedPaymentMethodId(m._id);
                    }}
                    className={`p-4 rounded-xl text-center border-2 transition 
                      ${
                        selectedPaymentMethodId === m._id
                          ? "border-black bg-gray-300"
                          : isPaymentDisabled
                          ? "border-gray-300 opacity-50 cursor-not-allowed"
                          : "border-gray-400 hover:border-black cursor-pointer"
                      }`}
                  >
                    <img
                      src={m.logo_Url}
                      className="object-contain w-16 h-16 mx-auto md:w-20 md:h-20"
                    />
                    <p className="text-sm font-semibold break-words md:text-base">
                      {truncate(m.name)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
<div className="mb-4">
  <h2 className="mb-3 text-2xl font-semibold">Upload Receipt </h2>

  <label
    htmlFor="receipt-upload"
    className="flex flex-col items-center justify-center w-full p-6 text-center transition-colors duration-300 border-2 border-black cursor-pointer rounded-xl hover:bg-black hover:text-white"
  >
    <AiOutlineUpload size={40} className="mb-2" />
    <span className="text-lg font-semibold">Click to upload receipt</span>
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
      className="max-w-xs mt-4 rounded-lg shadow-md"
    />
  )}
</div>

          {/* 🟦 TOTAL */}
          <div className="p-6 text-xl font-bold text-center bg-gray-200 rounded-xl">
            Total: {getAmount()} EGP
          </div>

          <button
            disabled={submitting}
            className={`w-full py-4 text-xl font-bold rounded-xl transition
              ${
                submitting
                  ? "bg-gray-400"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
          >
            {submitting ? "Submitting..." : "Confirm Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
