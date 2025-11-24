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

interface DepartmentData {

    _id?: string;
    name: string;
  
}

const AddDepartment: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const departmentId = location.state || null;
  const isEdit = !!departmentId;
  const { t } = useTranslation();

  const { get: getDepartment } = useGet<{ data: DepartmentData }>();
  const { post, loading: postLoading } = usePost();
  const { put, loading: putLoading } = usePut();

  const [formData, setFormData] = useState<DepartmentData>({
    name: "",
  });

  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (isEdit && departmentId) {
        setLoadingData(true);

        try {
          const res = await getDepartment(
            `https://taskatbcknd.wegostation.com/api/admin/departments/${departmentId}`
          );

        if (res?.data) { 
            setFormData({ name: res.data.name|| "", });
          }
        } catch {
          toast.error(t("Failedtoloaddepartmentdata"));
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchDepartment();
  }, [departmentId]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error(t("Pleaseenterdepartmentname"));
      return;
    }

    try {
      let res;

      if (isEdit) {
        res = await put(
          `https://taskatbcknd.wegostation.com/api/admin/departments/${departmentId}`,
          formData
        );

        if (res?.success !== false) {
          toast.success(t("Departmentupdatedsuccessfully"));
          nav("/admin/department");
        } else {
          toast.error(res.error || t("Failedtoupdatedepartment"));
        }
      } else {
        res = await post(
          "https://taskatbcknd.wegostation.com/api/admin/departments",
          formData
        );

        if (res?.success !== false) {
          toast.success(t("Departmentaddedsuccessfully"));
          nav("/admin/department");
        } else {
          toast.error(res.error || t("Failedtoadddepartment"));
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
      <Titles title={isEdit ? t("EditDepartment") : t("AddDepartment")} />

      <div className="flex flex-col max-w-lg gap-4">
        <InputField
          placeholder={t("DepartmentName")}
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
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

export default AddDepartment;
