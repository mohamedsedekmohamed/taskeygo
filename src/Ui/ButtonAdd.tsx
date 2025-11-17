 
import { Link } from "react-router-dom";
import { useTheme } from "../Hooks/ThemeContext";
import { FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface ButtonAddProps {
  title: string;
  to?: string;
}

const ButtonAdd: React.FC<ButtonAddProps> = ({ title, to }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-5">
      <h1
        className={`font-bold transition text-xl sm:text-2xl md:text-3xl ${
          theme === "dark" ? "text-white" : "text-maincolor"
        }`}
      >
        {t(title)}
      </h1>
{to?(   <Link
        to={to}
        className={`flex items-center gap-2 rounded-lg border transition font-semibold
          text-base sm:text-lg md:text-xl
          px-3 sm:px-4 py-1.5 sm:py-2 mt-2 sm:mt-3
          ${
            theme === "dark"
              ? "bg-black/50 hover:bg-black border-white text-white"
              : "bg-maincolor/50 hover:bg-maincolor/80 text-maincolor hover:text-white border border-maincolor"
          }`}
      >
        <span>{t("Add")}</span>
        <FaPlus className="inline-block text-sm sm:text-base" />
      </Link>):null}
   
    </div>
  );
};

export default ButtonAdd;
