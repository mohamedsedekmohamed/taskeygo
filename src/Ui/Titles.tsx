 
import { useTheme } from "../Hooks/ThemeContext";
import {  Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TiArrowBack } from "react-icons/ti";

interface TitlesProps {
  title: string;
  to?: string | number;
}

const Titles: React.FC<TitlesProps> = ({ title, to }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();


  const buttonClasses = `
    flex items-center gap-2 rounded-lg border transition font-semibold
    text-base sm:text-lg md:text-xl
    px-3 sm:px-4 py-1.5 sm:py-2 mt-2 sm:mt-3
    ${
      theme === "dark"
        ? "bg-black/80 hover:bg-black/60 border-white text-white"
        : "bg-maincolor/50 hover:bg-maincolor/80 text-maincolor hover:text-white border border-maincolor"
    }
  `;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        <h1
          className={`font-bold transition text-xl sm:text-2xl md:text-3xl  mt-2 ${
            theme === "dark" ? "text-white" : "text-maincolor"
          }`}
        >
          {t(title)}
        </h1>

        {typeof to === "string" ? (
          <Link to={to}  className={buttonClasses}>
            <TiArrowBack className="inline-block text-sm sm:text-base" />
          </Link>
        ) : (
          <button onClick={() => navigate(-1)} className={buttonClasses}>
            <TiArrowBack className="inline-block text-sm sm:text-base" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Titles;
