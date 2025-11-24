import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Titles from "../../Ui/Titles";
import InputField from "../../Ui/InputField";
import InputArrow from "../../Ui/InputArrow";
import ButtonDone from "../../Ui/ButtonDone";
import Loading from "../../Component/Loading";
import usePost from "../../Hooks/usePost";
import usePut from "../../Hooks/usePut";
import useGet from "../../Hooks/useGet";
import { useTranslation } from "react-i18next";

interface TaskData {
  title: string;
  description: string;
  department: string;
  priority: number | null;
  end_date: string;
  projectId: string;
  file: string;
  recorde: string;
}

interface Option {
  _id: string;
  name: string;
}

interface ProjectData {
  _id?: string;
  name: string;
  description: string;
}

const AddTask: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const TaskId = location.state || null;
  const isEdit = !!TaskId;
  const { t } = useTranslation();

  const { post, loading: postLoading } = usePost();
  const { put, loading: putLoading } = usePut();
  const { get: getOptions } = useGet<{ data: Option[] }>();
  const { get: getTask } = useGet<ProjectData >();

  const [formData, setFormData] = useState<TaskData>({
    title: "",
    description: "",
    projectId: "",
    department: "",
    priority: null,
    end_date: "",
    file: "",
    recorde:""
  });
  const [file, setFile] = useState<string | null>(null);

  const [loadingData, setLoadingData] = useState(false);
  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<Option[]>([]);

  // Fetch select options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const projects = await getOptions(
          "https://taskatbcknd.wegostation.com/api/admin/project"
        );
        setProjectOptions(projects?.projects || []);

        const departments = await getOptions(
          "https://taskatbcknd.wegostation.com/api/admin/departments"
        );
        setDepartmentOptions(departments?.data || []);
      } catch {
        toast.error(t("FailedToLoadOptions"));
      }
    };
    fetchOptions();
  }, []);

  // Fetch task data if edit
  useEffect(() => {
    const fetchTask = async () => {
      if (isEdit && TaskId) {
        setLoadingData(true);
        try {
          const res = await getTask(
            `https://taskatbcknd.wegostation.com/api/admin/tasks/${TaskId}`
          );
          if (res?.task) {
            const task = res.task;
            setFormData({
              title: task.name || "",
              description: task.description || "",
              projectId: task.projectId?._id || "",
              department: task.Depatment_id?._id || "",
              priority:
                task.priority === "low"
                  ? 1
                  : task.priority === "medium"
                  ? 2
                  : task.priority === "high"
                  ? 3
                  : null,
              end_date: task.end_date ? task.end_date.split("T")[0] : "",
              file: task.file || "",
              recorde:task.recorde
            });
            if (task.file) setFile(null);
          }
        } catch {
          toast.error(t("FailedToLoadTask"));
        } finally {
          setLoadingData(false);
        }
      }
    };
    fetchTask();
  }, [TaskId]);

  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
        chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
        chunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
      toast.error(t("FailedToAccessMicrophone"));
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof TaskData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0] || null;
  if (!selectedFile) return;
  const reader = new FileReader();
  reader.onload = () => {
    const fileContent = reader.result as string; 
setFile(fileContent)
  };
  reader.onerror = (err) => {
    console.error("Error reading file", err);
  };
  reader.readAsDataURL(selectedFile);
};

const handleSave = async () => {
  if (!formData.title.trim() || formData.title.length < 3) {
    toast.error(t("PleaseEnterTaskTitle"));
    return;
  }

  if (!file && !audioURL && !formData.file) {
    toast.error(t("PleaseUploadFileOrRecordAudio"));
    return;
  }

  try {
    const payload = new FormData();

    if (file) {
      payload.append("file", file);
    } 
    else if (audioURL) {
     const audioBlob = await fetch(audioURL).then(r => r.blob());
     payload.append("file", audioBlob, "recording.webm"); 
   }

    payload.append("name", formData.title);
    payload.append("description", formData.description);

    let priorityText = "";
    switch (formData.priority) {
      case 1:
        priorityText = "low";
        break;
      case 2:
        priorityText = "medium";
        break;
      case 3:
        priorityText = "high";
        break;
    }
    if (priorityText) payload.append("priority", priorityText);
    if (formData.projectId) payload.append("projectId", formData.projectId);
    if (formData.department) payload.append("Depatment_id", formData.department);
    if (formData.end_date) payload.append("end_date", formData.end_date);

    let res;
    if (isEdit) {
      res = await put(
        `https://taskatbcknd.wegostation.com/api/admin/tasks/${TaskId}`,
        payload
      );
    } else {
      res = await post("https://taskatbcknd.wegostation.com/api/admin/tasks", payload);
    }

    if (res?.success !== false) {
      toast.success(isEdit ? t("TaskUpdatedSuccessfully") : t("TaskAddedSuccessfully"));
      nav("/admin/task");
    } else {
      toast.error(res.error || t("FailedToAddTask"));
    }
  } catch (err: any) {
    toast.error(err?.message || t("UnknownError"));
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
      <Titles title={isEdit ? t("EditTask") : t("AddTask")} />
      <div className="flex flex-col max-w-lg gap-4">
        <InputField
          placeholder={t("TaskTitle")}
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <InputField
          placeholder={t("TaskDescription")}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <InputArrow
          placeholder={t("Department")}
          name="department"
          value={formData.department}
          onChange={(value) => handleSelectChange("department", value)}
          options={departmentOptions.map((d) => ({ id: d._id, name: d.name }))}
        />
        <InputArrow
          placeholder={t("Project")}
          name="projectId"
          value={formData.projectId}
          onChange={(value) => handleSelectChange("projectId", value)}
          options={projectOptions.map((p) => ({ id: p._id, name: p.name }))}
        />
        <InputArrow
          placeholder={t("Priority")}
          name="priority"
          value={formData.priority || ""}
          onChange={(value) => handleSelectChange("priority", Number(value))}
          options={[
            { id: 1, name: t("Low") },
            { id: 2, name: t("Medium") },
            { id: 3, name: t("High") },
          ]}
        />
        <InputField
          placeholder={t("EndDate")}
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("UploadFileOrRecord")}</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full px-5 py-3 placeholder-gray-700 border-2 rounded-xl bg-two text-maincolor border-zinc-700 focus:outline-none focus:ring-2 focus:ring-four/50 focus:border-four"
          />

          {file && (
            <div className="flex items-center justify-between px-3 py-1 mt-2 bg-gray-100 rounded">
              <p>File uploaded</p>
              <button type="button" onClick={() => setFile(null)} className="font-bold text-red-500">
                ✕
              </button>
            </div>
          )}

          {/* تسجيل الصوت */}
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={startRecording}
              disabled={recording || !!formData.file}
              className={`px-4 py-2 text-white rounded ${recording || !!formData.file ? "bg-gray-400" : "bg-green-500"}`}
            >
              {t("StartRecording")}
            </button>
            <button
              type="button"
              onClick={stopRecording}
              disabled={!recording}
              className="px-4 py-2 text-white bg-red-500 rounded"
            >
              {t("StopRecording")}
            </button>
          </div>

          {audioURL && (
            <div className="flex items-center justify-between px-3 py-1 mt-2 bg-gray-100 rounded">
              <audio src={audioURL} controls />
              <button type="button" onClick={() => setAudioURL(null)} className="font-bold text-red-500">
                ✕
              </button>
            </div>
          )}
        </div>

        <ButtonDone checkLoading={postLoading || putLoading} handleSave={handleSave} edit={isEdit} />
      </div>
    </div>
  );
};

export default AddTask;
