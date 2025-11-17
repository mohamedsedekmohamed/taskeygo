import { useTheme } from "../Hooks/ThemeContext";
import { useTranslation } from "react-i18next";

interface InputFieldProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  min?: number;
  type?: "text" | "number" | "email" | "password" | "date";
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder = "",
  value,
  onChange,
  name,
  min = 0,
  type = "text",
  disabled = false,
}) => {
  const maxLength =
    type === "number" ? 20 : type === "email" ? 45 : 200;

  const hasValue = value.trim() !== "";
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full max-w-md gap-2">
      {placeholder && (
        <label
          className={`text-lg font-normal ${
            theme === "dark" ? "text-white" : "text-maincolor"
          }`}
        >
          {t(placeholder)}
        </label>
      )}

      <input
        type={type}
        name={name}
        disabled={disabled}
        value={value}
        min={min}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={`${t("Enter")} ${t(placeholder)}`}
        className={`
          w-full px-5 py-3 rounded-xl
          bg-two text-maincolor placeholder-gray-700
          border-2 border-zinc-700
          transition-all duration-300
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${hasValue ? "border-sky-500" : ""}
          focus:outline-none focus:ring-2 focus:ring-four/50 focus:border-four
        `}
      />
    </div>
  );
};

export default InputField;
