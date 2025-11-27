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

interface ProjectData {
  _id?: string;
  name: string;
  createdBy: string;
  description: string;
}

const AddProject: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const projectId = location.state || null;
  const isEdit = !!projectId;
  const { t } = useTranslation();

  const { get: getProject } = useGet<{ project: ProjectData }>();
  const { post, loading: postLoading } = usePost();
  const { put, loading: putLoading } = usePut();

  const [formData, setFormData] = useState<ProjectData>({
    name: "",
    description: "",
    createdBy: "",
  });

  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (isEdit && projectId) {
        setLoadingData(true);
        try {
          const res = await getProject(
            `https://taskatbcknd.wegostation.com/api/admin/project/${projectId}`
          );

          if (res?.project) {
            setFormData({
              name: res.project.name,
              description: res.project.description,
              createdBy: res.project.createdBy,
            });
          }
        } catch {
          toast.error(t("Failedtoloadproject"));
        } finally {
          setLoadingData(false);
        }
      }
    };
    fetchProject();
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error(t("Pleaseenterprojectname"));
    if (!formData.description.trim())
      return toast.error(t("Pleaseenterprojectdescription"));
    // if (!formData.description.trim())
    //   return toast.error(t("Pleaseenterprojectdescription"));

    const payload = {
      name: formData.name,
      description: formData.description,
      createdBy: formData.createdBy,
    };

    try {
      let res;
      if (isEdit) {
        res = await put(
          `https://taskatbcknd.wegostation.com/api/admin/project/${projectId}`,
          payload
        );

        if (res?.success !== false) {
          toast.success(t("Projectupdatedsuccessfully"));
          nav("/admin/project");
        } else {
          toast.error(t("Failedtoupdateproject"));
        }
      } else {
        res = await post(`https://taskatbcknd.wegostation.com/api/admin/project`, payload);
        if (res?.success !== false) {
          toast.success(t("Projectaddedsuccessfully"));
          nav("/admin/project");
        } else {
          toast.error(t("Failedtoaddproject"));
        }
      }
    } catch {
      toast.error(t("Unknownerror"));
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
      <Titles title={isEdit ? t("EditProject") : t("AddProject")} />

      <div className="flex flex-col max-w-lg gap-4">
        <InputField
          placeholder={t("ProjectName")}
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder={t("ProjectDescription")}
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 bg-transparent border outline-none rounded-xl"
          rows={4}
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

export default AddProject;
