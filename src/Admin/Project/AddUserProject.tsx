import {  useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Titles from "../../Ui/Titles";
import InputField from "../../Ui/InputField";
import InputArrow from "../../Ui/InputArrow";
import ButtonDone from "../../Ui/ButtonDone";
import usePost from "../../Hooks/usePost";
import usePut from "../../Hooks/usePut";
import useGet from "../../Hooks/useGet";
import Loading from "../../Component/Loading";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

interface UserProject {
  _id?: string; 
  email: string;
  project_id: string;
  role: "teamlead" | "Member" | "Membercanapprove"|"admin";
}

const AddUserProject: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

    const location = useLocation();
  const row = location.state || null;
  const isEdit = !!row;

    
  const { get: getData } = useGet<{ userProject: UserProject }>();
  const { post, loading: postLoading } = usePost();
  const { put, loading: putLoading } = usePut();

  const [formData, setFormData] = useState<UserProject>({
    email: "",
    project_id: projectId || "",
    role: "admin",
  });

  useEffect(()=>{
    if(isEdit){
      setFormData({
           email: row.email,
    project_id: projectId || "",
    role: row.role,
      })
    }
  },[row])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as "teamlead" | "Member" | "Membercanapprove"|"admin"}));
  };

  const handleSave = async () => {
    if (!formData.email.trim()) {
      toast.error(t("PleaseEnterUser"));
      return;
    }

    if (!formData.project_id.trim()) {
      toast.error(t("ProjectIdMissing"));
      return;
    }

    try { 
      let res;
      if (isEdit ) {
        res = await put(`https://taskatbcknd.wegostation.com/api/admin/user-project/${row.user_id._id}/${projectId}`, formData);
        if (res?.success) {
          toast.success(t("UserProjectUpdatedSuccessfully"));
          navigate(`/admin/userproject`, { state: projectId });
        } else {
          toast.error(res.error || t("FailedToUpdateUserProject"));
        }
      } else {
        res = await post(`https://taskatbcknd.wegostation.com/api/admin/user-project`, formData);
        if (res?.success) {
          toast.success(t("UserProjectAddedSuccessfully"));
          navigate(`/admin/userproject`, { state: projectId });
        } else {
          toast.error(res.error || t("FailedToAddUserProject"));
        }
      }
    } catch (err: any) {
      toast.error(err?.message || t("UnknownError"));
    }
  };

  if ( postLoading || putLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Titles title={isEdit ? t("EditUserProject") : t("AddUserProject")} />

      <div className="flex flex-col max-w-lg gap-4">
        <InputField
          placeholder={t("emailuser")}
          name="email"
          type="text"
          value={formData.email}
          onChange={handleChange}
        />

       

        <InputArrow
          placeholder={t("SelectRole")}
          name="role"
          value={formData.role}
          onChange={handleRoleChange}
          options={[
            { id: "teamlead", name: t("teamlead") },
            { id: "Member", name: t("Member") },
            { id: "admin", name: t("admin") },
            { id: "Membercanapprove", name: t("Membercanapprove") },
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

export default AddUserProject;
