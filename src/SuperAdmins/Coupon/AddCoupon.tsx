import { useEffect, useState } from "react";
import Titles from "../../Ui/Titles";
import InputField from "../../Ui/InputField";
import ButtonDone from "../../Ui/ButtonDone";
import InputArrow from "../../Ui/InputArrow";
import usePost from "../../Hooks/usePost";
import usePut from "../../Hooks/usePut";
import useGet from "../../Hooks/useGet";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../Component/Loading";
import { useTranslation } from "react-i18next";

interface CouponData {
  code: string;
  start_date: string;
  end_date: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
}

const AddCoupon: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const CouponId = location.state || null;
  const isEdit = !!CouponId;
  const { t } = useTranslation();
const formatDate = (isoDate: string) => isoDate?.split("T")[0] || "";

  const { get: getCoupon } = useGet<{ coupon: CouponData }>();
  const { post, loading: postLoading } = usePost();
  const { put, loading: putLoading } = usePut();

  const [formData, setFormData] = useState<CouponData>({
    code: "",
    start_date: "",
    end_date: "",
    discount_type: "percentage",
    discount_value: 0,
  });

  const [loadingData, setLoadingData] = useState(false);

  // Fetch coupon data if editing
  useEffect(() => {
    const fetchCoupon = async () => {
      if (isEdit && CouponId) {
        setLoadingData(true);
        try {
          const res = await getCoupon(
            `https://taskatbcknd.wegostation.com/api/superadmin/Coupons/${CouponId}`
          );
          if (res?.coupon) {
            setFormData({
              code: res.coupon.code || "",
               start_date: formatDate(res.coupon.start_date),
  end_date: formatDate(res.coupon.end_date),
              discount_type: res.coupon.discount_type || "percentage",
              discount_value: res.coupon.discount_value || 0,
            });
          }
        } catch {
          toast.error(t("Failedtoloadcoupons"));
        } finally {
          setLoadingData(false);
        }
      }
    };
    fetchCoupon();
  }, [CouponId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "discount_value" ? Number(value) : value, // convert discount to number
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      discount_type: value as "percentage" | "fixed",
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.code.trim()|| formData.code.length < 3) {
      toast.error(t("Pleaseentercouponcode"));
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      toast.error(t("Pleaseenterstartandenddate"));
      return;
    }
    if (formData.discount_value <= 0) {
      toast.error(t("Pleaseentervaliddiscountvalue"));
      return;
    }

    const payload = { ...formData };

    try {
      let res;
      if (isEdit) {
        res = await put(
          `https://taskatbcknd.wegostation.com/api/superadmin/Coupons/${CouponId}`,
          payload
        );
        if (res?.success !== false) {
          toast.success(t("Couponupdatedsuccessfully"));
          nav("/SuperAdmin/coupon");
        } else {
          toast.error(res.error || t("Failedtoupdatecoupon"));
        }
      } else {
        res = await post(
          "https://taskatbcknd.wegostation.com/api/superadmin/Coupons",
          payload
        );
        if (res?.success !== false) {
          toast.success(t("Couponaddedsuccessfully"));
          nav("/SuperAdmin/coupon");
        } else {
          toast.error(res.error || t("Failedtoaddcoupon"));
        }
      }
    } catch (err: any) {
      toast.error(err?.message || t("Unknownerror"));
    }
  };

  if ((isEdit && loadingData) || postLoading || putLoading) {
    return (
      <div className="flex items-center justify-center max-h-screen max-w-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Titles title={isEdit ? t("EditCoupon") : t("AddCoupon")} />
      <div className="flex flex-col max-w-lg gap-4">
        <InputField
          placeholder={t("CouponCode")}
          name="code"
          value={formData.code}
          onChange={handleChange}
        />

        <InputField
          placeholder={t("StartDate")}
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
        />

        <InputField
          placeholder={t("EndDate")}
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
        />

        <InputArrow
          placeholder={t("DiscountType")}
          name="discount_type"
          value={formData.discount_type}
          onChange={handleTypeChange}
          options={[
            { id: "percentage", name: t("Percentage") },
            { id: "amount", name: t("Amount") },
          ]}
        />

        <InputField
          placeholder={t("DiscountValue")}
          name="discount_value"
          type="number"
          
  value={String(formData.discount_value || "")} 
          onChange={handleChange}
        />

        <ButtonDone
          checkLoading={postLoading || putLoading}
          handleSave={handleSave}
          edit={isEdit}
        />
      </div>
    </div>
  );
};

export default AddCoupon;
