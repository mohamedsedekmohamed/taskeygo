import  { useRef } from "react";

interface FileUploadBase64Props {
  onChange: (base64: string) => void;
  label?: string;
}

const FileUploadBase64: React.FC<FileUploadBase64Props> = ({ onChange, label = "Upload Image" }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-lg font-medium text-maincolor">{label}</label>}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 font-semibold text-white transition rounded-lg bg-maincolor hover:bg-maincolor/80"
      >
        {label}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadBase64;
