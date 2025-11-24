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

interface RejectedReasonData {
  _id?: string;
  reason: string;
  points: number;
}

const AddRejected: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const rejectedId = location.state || null;
  const isEdit = !!rejectedId;
  const { t } = useTranslation();

  const { get: getRejected } = useGet<{ RejectedResons: RejectedReasonData }>();
  const { post, loading: postLoading } = usePost();
  const { put, loading: putLoading } = usePut();

  const [formData, setFormData] = useState<RejectedReasonData>({
    reason: "",
    points: 0,
  });

  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchRejected = async () => {
      if (isEdit && rejectedId) {
        setLoadingData(true);
        try {
          const res = await getRejected(
            `https://taskatbcknd.wegostation.com/api/admin/rejected-reasons/${rejectedId}`
          );

          if (res?.RejectedResons) {
            setFormData({
              reason: res.RejectedResons.reason,
              points: Number(res.RejectedResons.points),
            });
          }
        } catch {
          toast.error(t("FailedToLoadRejectedReason"));
        } finally {
          setLoadingData(false);
        }
      }
    };
    fetchRejected();
  }, [rejectedId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.reason.trim()) return toast.error(t("PleaseEnterReason"));
    if (formData.points <= 0) return toast.error(t("PointsMustBeGreaterThanZero"));

    const payload = {
      reason: formData.reason,
      points: formData.points,
    };

    try {
      let res;
      if (isEdit) {
        res = await put(
          `https://taskatbcknd.wegostation.com/api/admin/rejected-reasons/${rejectedId}`,
          payload
        );

        if (res?.success !== false) {
          toast.success(t("RejectedReasonUpdatedSuccessfully"));
          nav("/admin/rejected");
        } else {
          toast.error(t("FailedToUpdateRejectedReason"));
        }
      } else {
        res = await post(`https://taskatbcknd.wegostation.com/api/admin/rejected-reasons`, payload);
        if (res?.success !== false) {
          toast.success(t("RejectedReasonAddedSuccessfully"));
          nav("/admin/rejected");
        } else {
          toast.error(t("FailedToAddRejectedReason"));
        }
      }
    } catch {
      toast.error(t("UnknownError"));
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
      <Titles title={isEdit ? t("EditRejectedReason") : t("AddRejectedReason")} />

      <div className="flex flex-col max-w-lg gap-4">
        <InputField
          placeholder={t("Reason")}
          name="reason"
          value={formData.reason}
          onChange={handleChange}
        />

   <InputField
  placeholder={t("Points")}
  name="points"
  type="number"
  value={formData.points.toString()} 
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

export default AddRejected;
