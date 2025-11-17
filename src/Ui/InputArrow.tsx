 
import { useTheme } from "../Hooks/ThemeContext";
import { useTranslation } from "react-i18next";

interface Option {
  id: string | number;
  name: string;
}

interface InputArrowProps {
  placeholder?: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  name: string;
  options: Option[];
  disabled?: boolean;
}

const InputArrow: React.FC<InputArrowProps> = ({
  placeholder = "",
  value,
  onChange,
  name,
  options,
  disabled = false,
}) => {
  const hasValue = value !== "" && value !== null && value !== undefined;
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full max-w-md gap-2">
      <label
        className={`font-normal text-lg transition ${
          theme === "dark" ? "text-white" : "text-maincolor"
        }`}
      >
        {placeholder}
      </label>

      <select
        name={name}
        disabled={disabled}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-300 appearance-none
          ${
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-700 focus:ring-gray-500 focus:border-gray-500"
              : "bg-white text-gray-900 border-gray-300 focus:ring-maincolor/50 focus:border-maincolor"
          }
          ${hasValue ? (theme === "dark" ? "border-four" : "border-maincolor") : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        style={{
          backgroundImage:
            theme === "dark"
              ? "url('data:image/svg+xml;utf8,<svg fill=\"white\" height=\"12\" width=\"12\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7 10l5 5 5-5z\"/></svg>')"
              : "url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"12\" width=\"12\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          backgroundSize: "1rem",
        }}
      >
        <option value="" disabled>
          -- {t("Select")} {placeholder} --
        </option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputArrow;
