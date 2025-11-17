import  { useEffect, useRef, useState } from "react";

interface FileUploadButtonArroyProps {
  onChange: (base64Array: string[]) => void;
  label?: string;
  defaultImages?: string[]; // الصور القديمة من الـ API
}

const FileUploadButtonArroy: React.FC<FileUploadButtonArroyProps> = ({
  onChange,
  label = "Upload Images",
  defaultImages = [],
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // 🔹 عند تحميل بيانات جديدة (وقت التعديل) حدّث الصور المعروضة
  useEffect(() => {
    if (defaultImages && defaultImages.length > 0) {
      setPreviewImages(defaultImages);
      onChange(defaultImages);
    }
  }, [defaultImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    let loaded = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          newImages.push(reader.result);
        }
        loaded++;
        if (loaded === files.length) {
          const updatedImages = [...previewImages, ...newImages];
          setPreviewImages(updatedImages);
          onChange(updatedImages);
        }
      };
    });
  };

  const handleRemoveImage = (index: number) => {
    const updated = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updated);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3">
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
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {previewImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {previewImages.map((img, index) => (
            <div key={index} className="relative w-24 h-24 overflow-hidden border rounded-lg">
              <img
                src={img}
                alt={`preview-${index}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 w-6 h-6 text-white bg-red-500 rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadButtonArroy;
