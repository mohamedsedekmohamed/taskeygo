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

interface AdminData {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

const AddAdmin: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const adminId = location.state || null;
  const isEdit = !!adminId;
  const { t } = useTranslation();

  const { get: getAdmin } = useGet<{ user: AdminData }>();
  const { post, loading: postLoading ,} = usePost();
  const { put, loading: putLoading } = usePut();

  const [formData, setFormData] = useState<AdminData>({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
  const fetchAdmin = async () => {
    if (isEdit && adminId) {
      setLoadingData(true);
      try {
        const res = await getAdmin(`https://taskatbcknd.wegostation.com/api/superadmin/admins/${adminId}`);
        if (res?.user) { 
          setFormData({
            name: res.user.name || "",
            email: res.user.email || "",
            role: res.user.role || "admin",
            password: "", 
          });
        }
      } catch {
        toast.error(t("Failedtoloadadmindata"));
      } finally {
        setLoadingData(false);
      }
    }
  };
  fetchAdmin();
}, [adminId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

const handleSave = async () => {
if (!formData.name.trim() || formData.name.length < 3) {
  toast.error(t("Pleaseenteradminname"));
  return;
}

  if (!formData.email.trim()) {
    toast.error(t("Pleaseenteradminemail"));
    return;
  }

  if (!isEdit) {
    if (!formData.password?.trim()) {
      toast.error(t("Pleaseenterpassword"));
      return;
    }
    if (formData.password.length < 6) {
      toast.error(t("Passwordmustbeatleast6characters"));
      return;
    }
  }

  // ✅ payload
  const payload = {
    name: formData.name,
    email: formData.email,
    ...(formData.password ? { password: formData.password } : {}),
    role: formData.role || "admin",
  };
  try {
    let res;
    if (isEdit) {
      res = await put(
        `https://taskatbcknd.wegostation.com/api/superadmin/admins/${adminId}`,
        payload
      );
      if (res?.success !== false) {
        toast.success(t("Adminupdatedsuccessfully"));
        nav("/SuperAdmin/admin");
      } else {
        toast.error(res.error || t("Failedtoupdateadmin"));
      }
    } else {
      res = await post(
        "https://taskatbcknd.wegostation.com/api/superadmin/admins",
        payload
      );
      if (res?.success !== false) {
        toast.success(t("Adminaddedsuccessfully"));
        nav("/SuperAdmin/admin");
      } else {
        toast.error(res.error || t("Failedtoaddadmin"));
      }
    }
  } catch (err: any) {
    // لو حصل خطأ غير متوقع
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
      <Titles title={isEdit ? t("EditAdmin") : t("AddAdmin")} />

      <div className="flex flex-col max-w-lg gap-4">
        <InputField
          placeholder={t("AdminName")}
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          placeholder={t("AdminEmail")}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

          <InputField
            placeholder={t("AdminPassword")}
            name="password"
            type="password"
            value={formData.password || ""}
            onChange={handleChange}
          />
        

        <InputArrow
          placeholder={t("SelectRole")}
          name="role"
          value={formData.role}
          onChange={handleRoleChange}
          options={[
            { id: "admin", name: t("Admin") },
            { id: "user", name: t("User") },
          ]}
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

export default AddAdmin;
