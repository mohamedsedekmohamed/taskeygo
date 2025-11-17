import { useEffect, useState } from "react";
import Titles from "../../Ui/Titles";
import InputField from "../../Ui/InputField";
import ButtonDone from "../../Ui/ButtonDone";
import usePost from "../../Hooks/usePost";
import usePut from "../../Hooks/usePut";
import useGet from "../../Hooks/useGet";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../Component/Loading";
import { useTranslation } from "react-i18next";

interface PlanData {
  name: string;
  price_monthly: number | string;
  price_annually: number | string;
  projects_limit: number | string;
  members_limit: number | string;
}

const AddPlans: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const planId = location.state || null;
  const isEdit = !!planId;
  const { t } = useTranslation();

  const { get: getPlan } = useGet<{ plan: PlanData }>();
  const { post, loading: postLoading ,error:errorPost} = usePost();
  const { put, loading: putLoading ,error:errorPut} = usePut();

  const [formData, setFormData] = useState<PlanData>({
    name: "",
    price_monthly: "",
    price_annually: "",
    projects_limit: "",
    members_limit: "",
  });

  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!isEdit || !planId) return;

      setLoadingData(true);
      try {
        const res = await getPlan(
          `https://taskatbcknd.wegostation.com/api/superadmin/plans/${planId}`
        );

        if (res?.plan) {
          setFormData({
            name: res.plan.name,
            price_monthly: res.plan.price_monthly,
            price_annually: res.plan.price_annually,
            projects_limit: res.plan.projects_limit,
            members_limit: res.plan.members_limit,
          });
        }
      } catch {
        toast.error(t("Failedtoloadplandata"));
      } finally {
        setLoadingData(false);
      }
    };
    fetchPlan();
  }, [planId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error(t("Pleaseenterplanname"));
      return;
    }

    const numericFields = [
      "price_monthly",
      "price_annually",
      "projects_limit",
      "members_limit",
    ];

    for (let field of numericFields) {
      if (!formData[field as keyof PlanData] || isNaN(Number(formData[field as keyof PlanData]))) {
        toast.error(t("Allvaluesmustbenumbers"));
        return;
      }
    }

    const payload = {
      ...formData,
      price_monthly: Number(formData.price_monthly),
      price_annually: Number(formData.price_annually),
      projects_limit: Number(formData.projects_limit),
      members_limit: Number(formData.members_limit),
    };

    try {
      let res;
      if (isEdit) {
        res = await put(
          `https://taskatbcknd.wegostation.com/api/superadmin/plans/${planId}`,
          payload
        );

        if (res?.success !== false) {
          toast.success(t("Planupdatedsuccessfully"));
          nav("/SuperAdmin/plans");
        } else toast.error(errorPut || t("Failedtoupdateplan"));
      } else {
        res = await post(
          "https://taskatbcknd.wegostation.com/api/superadmin/plans",
          payload
        );

        if (res?.success !== false) {
          toast.success(t("Planaddedsuccessfully"));
          nav("/SuperAdmin/plans");
        } else toast.error(errorPost || t("Failedtoaddplan"));
      }
    } catch (err: any) {
      toast.error(err?.message || t("Unknownerror"));
    }
  };

  if ((isEdit && loadingData) || postLoading || putLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Titles title={isEdit ? t("EditPlans") : t("AddPlans")} />

      <div className="flex flex-col max-w-lg gap-4">
        <InputField
          placeholder={t("PlanName")}
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          placeholder={t("MonthlyPrice")}
          name="price_monthly"
          type="number"
          value={String(formData.price_monthly)}
          onChange={handleChange}
        />

        <InputField
          placeholder={t("AnnualPrice")}
          name="price_annually"
          type="number"
          value={String(formData.price_annually)}
          onChange={handleChange}
        />

        <InputField
          placeholder={t("ProjectsLimit")}
          name="projects_limit"
          type="number"
          value={String(formData.projects_limit)}
          onChange={handleChange}
        />

        <InputField
          placeholder={t("MembersLimit")}
          name="members_limit"
          type="number"
          value={String(formData.members_limit)}
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

export default AddPlans;
