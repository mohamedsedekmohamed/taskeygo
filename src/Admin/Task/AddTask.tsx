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

interface Option {
  _id: string;
  name: string;
}

// interface ProjectData {
//   _id?: string;
//   name: string;
//   description: string;
// }
interface ProjectsResponse {
  projects: Option[];
}
interface ProjectsResponses {
  data: Option[];
}
interface TaskResponse {
  task: {
    _id?: string;
    name: string;
    description: string;
    start_date?: string;
    projectId?: { _id: string; name: string };
    Depatment_id?: { _id: string; name: string };
    priority?: "low" | "medium" | "high";
    end_date?: string;
    recorde?: string;
    file?: string;
  };
}

const AddTask: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const TaskId = location.state || null;
  const isEdit = !!TaskId;
  const { t } = useTranslation();

  const { post, loading: postLoading } = usePost();
  const { put, loading: putLoading } = usePut();
const { get: getOptions } = useGet<ProjectsResponse>();
const { get: getOptionss } = useGet<ProjectsResponses>();
const { get: getTask } = useGet<TaskResponse>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [end_date, setEndDate] = useState("");
  const [start_date, setStartDate] = useState("");
  const [recorde, setRecorde] = useState("");

const [file, setFile] = useState<File | string | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const projects = await getOptions("https://taskatbcknd.wegostation.com/api/admin/project");
        setProjectOptions(projects?.projects  || []);

        const departments = await getOptionss("https://taskatbcknd.wegostation.com/api/admin/departments");
        setDepartmentOptions(departments?.data || []);
      } catch {
        toast.error(t("FailedToLoadOptions"));
      }
    };
    fetchOptions();
  }, []);

  // Fetch task on edit
  useEffect(() => {
    const fetchTask = async () => {
      if (isEdit && TaskId) {
        setLoadingData(true);
        try {
          const res = await getTask(`https://taskatbcknd.wegostation.com/api/admin/tasks/${TaskId}`);

          if (res?.task) {
            const task = res.task;

            setTitle(task.name || "");
            setDescription(task.description || "");
            setProjectId(task.projectId?._id || "");
            setDepartment(task.Depatment_id?._id || "");

            setPriority(
              task.priority === "low" ? 1 :
              task.priority === "medium" ? 2 :
              task.priority === "high" ? 3 : null
            );

            setEndDate(task.end_date ? task.end_date.split("T")[0] : "");
            setStartDate(task.start_date ? task.start_date.split("T")[0] : "");
      if(task.recorde !==null) {  
        setRecorde(task.recorde || "");
      } 
            if (task.file) setFile(task.file);
          }
        } catch {
          toast.error(t("FailedToLoadTask"));
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchTask();
  }, [TaskId,isEdit]);

  // Audio recording
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

    } catch {
      toast.error(t("FailedToAccessMicrophone"));
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

const handleSave = async () => {
if (!title.trim()) {
  toast.error(t("TitleIsRequired")); 
  return;
}
if (title.trim().length < 3) {
  toast.error(t("TitleTooShort"));
  return;
}

if (!description.trim()) {
  toast.error(t("DescriptionIsRequired")); 
  return;
}
if (description.trim().length < 5) {
  toast.error(t("DescriptionTooShort"));
  return;
}


  if (!projectId) {
    toast.error(t("PleaseSelectProject"));
    return;
  }

  if (!department) {
    toast.error(t("PleaseSelectDepartment"));
    return;
  }

  if (!priority || ![1, 2, 3].includes(priority)) {
    toast.error(t("PleaseSelectPriority"));
    return;
  }

  if (!end_date) {
    toast.error(t("PleaseSelectEndDate"));
    return;
  }
  if (!start_date) {
    toast.error(t("PleaseSelectEndDate"));
    return;
  }
const toStartOfDayTimestamp = (dateStr: string) => {
  const parsed = Date.parse(dateStr);
  if (Number.isNaN(parsed)) return NaN;
  const d = new Date(parsed);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const startTs = toStartOfDayTimestamp(start_date);
const endTs = toStartOfDayTimestamp(end_date);

if (Number.isNaN(startTs) || Number.isNaN(endTs)) {
  toast.error(t("InvalidDateFormat")); // ضع مفتاح ترجمة مناسب
  return;
}

// الآن نتحقق: لو البداية بعد النهاية -> خطأ
if (startTs > endTs) {
  toast.error(t("StartDateCannotBeAfterEndDate")); // ضع مفتاح ترجمة مناسب
  return;
}

  try {
    const priorityText =
      priority === 1 ? "low" :
      priority === 2 ? "medium" :
      priority === 3 ? "high" : "";

    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    if (priorityText) formData.append("priority", priorityText);
    if (projectId) formData.append("projectId", projectId);
    if (department) formData.append("Depatment_id", department);
    if (end_date) formData.append("end_date", end_date);
    if (start_date) formData.append("start_date", start_date);
     if (file)formData.append("file", file);

  
    if (audioURL) {
      const blob = await fetch(audioURL).then(r => r.blob());
      formData.append("recorde", blob, "record.webm");
    }

    if (recorde) formData.append("recorde", recorde);

    const url = isEdit
      ? `https://taskatbcknd.wegostation.com/api/admin/tasks/${TaskId}`
      : "https://taskatbcknd.wegostation.com/api/admin/tasks";

    const res = isEdit 
      ? await put(url, formData) 
      : await post(url, formData);

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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <InputField
          placeholder={t("TaskDescription")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <InputArrow
        name="Department"
          placeholder={t("Department")}
          value={department}
          onChange={(value) => setDepartment(value)}
          options={departmentOptions.map((d) => ({ id: d._id, name: d.name }))}
        />

        <InputArrow
                name="Project"

          placeholder={t("Project")}
          value={projectId}
          onChange={(value) => setProjectId(value)}
          options={projectOptions.map((p) => ({ id: p._id, name: p.name }))}
        />

        <InputArrow
             name="Priority"
          placeholder={t("Priority")}
          value={priority || ""}
          onChange={(value) => setPriority(Number(value))}
          options={[
            { id: 1, name: t("Low") },
            { id: 2, name: t("Medium") },
            { id: 3, name: t("High") },
          ]}
        />

        <InputField
          placeholder={t("StartDate")}
          type="date"
          value={start_date}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <InputField
          placeholder={t("EndDate")}
          type="date"
          value={end_date}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("UploadFileOrRecord")}</label>

<input
  type="file"
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  onChange={(e) => {
    const selectedFile = e.target.files?.[0];
    console.log("Selected file:", selectedFile); 
    setFile(selectedFile || null);
  }}
  className="w-full px-5 py-3 border-2 rounded-xl"
/>

          {file && (
            <div className="flex items-center justify-between px-3 py-1 mt-2 bg-gray-100 rounded">
              <p>File uploaded</p>
              <button className="font-bold text-red-500" onClick={() => setFile(null)}>✕</button>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={startRecording}
              disabled={recording}
              className={`px-4 py-2 text-white rounded ${recording ? "bg-gray-400" : "bg-green-500"}`}
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
              <button
                className="font-bold text-red-500"
                onClick={() => setAudioURL(null)}
              >
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
