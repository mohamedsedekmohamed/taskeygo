import { useEffect, useState } from "react";
import Titles from "../../Ui/Titles";
import InputField from "../../Ui/InputField";
import ButtonDone from "../../Ui/ButtonDone";
import SwitchButton from "../../Ui/SwitchButton"; // ✅ استيراد الـ SwitchButton
import usePost from "../../Hooks/usePost";
import usePut from "../../Hooks/usePut";
import useGet from "../../Hooks/useGet";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../Component/Loading";
import { useTranslation } from "react-i18next";
import FileUploadBase64 from "../../Ui/FileUploadBase64";
interface PaymentMethodData {
  name: string;
  discription: string;
  logo_Url: string;
  isActive: boolean;
}

const AddPaymentMethod: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const paymentMethodId = location.state || null;
  const isEdit = !!paymentMethodId;
  const { t } = useTranslation();
const [imageUpdated, setImageUpdated] = useState(false);

  const { get: getPaymentMethod } = useGet<{ paymentMethod: PaymentMethodData }>();
  const { post, loading: postLoading } = usePost();
  const { put, loading: putLoading } = usePut();

  const [formData, setFormData] = useState<PaymentMethodData>({
    name: "",
    discription: "",
    logo_Url: "",
    isActive: true,
  });

  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      if (isEdit && paymentMethodId) {
        setLoadingData(true);
        try {
          const res = await getPaymentMethod(
            `https://taskatbcknd.wegostation.com/api/superadmin/payment-methods/${paymentMethodId}`
          );
          if (res?.paymentMethod) {
            setFormData({
              name: res.paymentMethod.name || "",
              discription: res.paymentMethod.discription || "",
              logo_Url: res.paymentMethod.logo_Url || "",
              isActive: res.paymentMethod.isActive ?? true,
            });
            setImageUpdated(false);

          }
        } catch {
          toast.error(t("Failedtoloadpaymentmethods"));
        } finally {
          setLoadingData(false);
        }
      }
    };
    fetchPaymentMethod();
  }, [paymentMethodId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || formData.name.length < 2) {
      toast.error(t("Pleaseenterpaymentmethodname"));
      return;
    }
    if (!formData.logo_Url.trim()) {
      toast.error(t("Pleaseenterlogourl"));
      return;
    }

    const payload:any  = { ...formData };
if (isEdit && !imageUpdated) {
  delete payload.logo_Url;
}

    try {
      let res;
      if (isEdit) {
        res = await put(
          `https://taskatbcknd.wegostation.com/api/superadmin/payment-methods/${paymentMethodId}`,
          payload
        );
        if (res?.success !== false) {
          toast.success(t("Paymentmethodupdatedsuccessfully"));
          nav("/SuperAdmin/paymentmethod");
        } else {
          toast.error(res.error || t("Failedtoupdatepaymentmethod"));
        }
      } else {
        res = await post(
          "https://taskatbcknd.wegostation.com/api/superadmin/payment-methods",
          payload
        );
        if (res?.success !== false) {
          toast.success(t("Paymentmethodaddedsuccessfully"));
          nav("/SuperAdmin/paymentmethod");
        } else {
          toast.error(res.error || t("Failedtoaddpaymentmethod"));
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
      <Titles title={isEdit ? t("EditPaymentMethod") : t("AddPaymentMethod")} />
      <div className="flex flex-col max-w-lg gap-4">
        <InputField
          placeholder={t("PaymentMethodName")}
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          placeholder={t("Description")}
          name="discription"
          value={formData.discription}
          onChange={handleChange}
        />

    <FileUploadBase64
  label={t("Logo")}
  onChange={(base64) =>{
    
    setImageUpdated(true);
    
    setFormData((prev) => ({ ...prev, logo_Url: base64 }))
  }
  }
/>
{formData.logo_Url && (
    <img
      src={formData.logo_Url}
      alt="Preview"
      className="object-contain w-32 h-32 mt-2 border rounded-md"
    />
  )}
     <SwitchButton
  checked={formData.isActive}
  onChange={(checked) =>
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }
  onLabel={t("Yes")}
  offLabel={t("No")}
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

export default AddPaymentMethod;
