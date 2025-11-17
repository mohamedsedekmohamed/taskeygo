import { useTheme } from "../Hooks/ThemeContext";
import { useTranslation } from "react-i18next";

interface SwitchButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  onLabel?: string;
  offLabel?: string;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  checked,
  onChange,
  disabled = false,
  onLabel = "On",
  offLabel = "Off",
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl"; // ✅ تحديد الاتجاه الحالي

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex items-center rounded-full transition-all duration-500 ease-in-out
          h-8 w-16 border-2
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${
            theme === "dark"
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-gray-100"
          }
        `}
      >
        <span
          className={`inline-block h-7 w-7 rounded-full shadow-md transform transition-all duration-500 ease-in-out
            ${
              checked
                ? isRTL
                  ? "-translate-x-8" // ✅ بالعكس في اللغة العربية
                  : "translate-x-8"
                : "translate-x-0"
            }
            ${checked ? "bg-green-400 animate-pulse" : "bg-red-400"}
          `}
          style={{
            boxShadow: checked
              ? theme === "dark"
                ? "0 0 10px rgba(34,197,94,0.7), 0 0 20px rgba(34,197,94,0.5)"
                : "0 0 6px rgba(34,197,94,0.5)"
              : theme === "dark"
              ? "0 0 10px rgba(239,68,68,0.6), 0 0 20px rgba(239,68,68,0.4)"
              : "0 0 6px rgba(239,68,68,0.4)",
          }}
        />
      </button>

      <span
        className={`text-sm font-medium transition-colors duration-300 ${
          checked
            ? theme === "dark"
              ? "text-green-300"
              : "text-green-600"
            : theme === "dark"
            ? "text-red-400"
            : "text-red-600"
        }`}
      >
        {checked ? onLabel : offLabel}
      </span>
    </div>
  );
};

export default SwitchButton;
