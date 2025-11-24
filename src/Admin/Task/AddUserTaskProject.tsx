import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Titles from "../../Ui/Titles";
import InputArrow from "../../Ui/InputArrow";
import ButtonDone from "../../Ui/ButtonDone";
import usePost from "../../Hooks/usePost";
import usePut from "../../Hooks/usePut";
import Loading from "../../Component/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Select from "react-select";
// import type { MultiValue } from "react-select";
import makeAnimated from "react-select/animated";
import { useTheme } from "../../Hooks/ThemeContext";

interface UserTask {
  _id?: string;
  user_id: string; 
  task_id: string;
  User_taskId?: { id: string }[]; // ✅ Array of objects with id
  role: "Member" | "Membercanapprove";
}

interface UserOption {
  _id: string;
  email: string;
}

interface UserReasons {
  id: string;
  name: string;
}
interface UserReasonss {
  user_id:{
    id:string;
  };
  name: string;
}

const AddUserTaskProject: React.FC = () => {
  const { taskId, projectId } = useParams<{ taskId: string; projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const row = location.state as Partial<UserTask> | null;
  const isEdit = !!row;
  const { t } = useTranslation();
  const animatedComponents = makeAnimated();
  const { theme } = useTheme();

  const { post, loading: postLoading } = usePost();
  const { put, loading: putLoading } = usePut();

  const [formData, setFormData] = useState<UserTask>({
    user_id: "",
    task_id: taskId || "",
    role: "Member",
    User_taskId: [],
  });

  const [options, setOptions] = useState<UserOption[]>([]);
  const [usertask, setUsertask] = useState<UserReasonss[]>([]);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!projectId) return;

    axios
      .get(`https://taskatbcknd.wegostation.com/api/admin/user-project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const users = res.data.data?.users || [];
        setOptions(users);
      })
      .catch((err) => console.error(err));

    axios
      .get(`https://taskatbcknd.wegostation.com/api/admin/user-task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const Reasons: UserReasons[] = (res.data.data?.users || []).map((item: any) => ({
          id: item.userTaskId,
          name: item.user?.name || "Unknown User",
        }));
        setUsertask(Reasons);
      })
      .catch((err) => console.error(err));
  }, [taskId, projectId, token]);

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as "Member" | "Membercanapprove",
    }));
  };

  const handleSelectChange = (name: keyof UserTask, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.user_id.trim()) {
      toast.error(t("PleaseSelectUser"));
      return;
    }
    if (!formData.task_id.trim()) {
      toast.error(t("TaskIdMissing"));
      return;
    }
 if (!formData.User_taskId || formData.User_taskId.length === 0) {
    delete formData.User_taskId;
  }
    try {
      let res;
      if (isEdit && row?._id) {
        res = await put(`https://taskatbcknd.wegostation.com/api/admin/user-task`, formData);
        if (res?.success) {
          toast.success(t("UserProjectUpdatedSuccessfully"));
          navigate(`/admin/usertaskproject`, { state: { tasktId: taskId, projectId } });
        } else {
          toast.error(res.error || t("FailedToUpdateUserProject"));
        }
      } else {
        res = await post(`https://taskatbcknd.wegostation.com/api/admin/user-task`, formData);
        if (res?.success) {
          toast.success(t("UserProjectAddedSuccessfully"));
          navigate(`/admin/usertaskproject`, { state: { tasktId: taskId, projectId } });
        } else {
          toast.error(res.error || t("FailedToAddUserProject"));
        }
      }
    } catch (err: any) {
      toast.error(err?.message || t("UnknownError"));
    }
  };

  if (postLoading || putLoading) {
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
        <InputArrow
          placeholder={t("SelectUser")}
          name="user_id"
          value={formData.user_id}
          onChange={(value) => handleSelectChange("user_id", value)}
          options={options.map((p) => ({ id: p.user_id._id, name: p.email }))}
        />

        <Select
  isMulti
  closeMenuOnSelect={false}
  components={animatedComponents}
  
  options={usertask.map((user) => ({ value: user.id, label: user.name }))}
   value={usertask
  .filter(u => formData.User_taskId && formData.User_taskId.includes(u.id))
  .map(u => ({ value: u.id, label: u.name }))}

  onChange={(selectedOptions) => {
    const mapped = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
    setFormData((prev) => ({ ...prev, User_taskId: mapped }));
  }}
  placeholder={t("Depende on")}
/>
        <InputArrow
          placeholder={t("SelectRole")}
          name="role"
          value={formData.role}
          onChange={handleRoleChange}
          options={[
            { id: "Member", name: t("Member") },
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

export default AddUserTaskProject;
