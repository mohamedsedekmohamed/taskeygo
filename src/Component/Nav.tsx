import  { useState, useRef, useEffect } from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useTheme } from "../Hooks/ThemeContext";
import { useSearchStore } from "../store/useSearchStore";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Nav: React.FC = () => {
   const colors = [
    "#FF5733", 
    "#FFC300", 
    "#28A745", 
    "#007BFF", 
    "#6F42C1",
    "#E83E8C", 
    "#20C997",
    "#FD7E14",
    "#aaaA40", 
    "#FFaaaa",
  ];
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, mainColor, setMainColor } = useTheme();
  const { searchQuery, setSearchQuery } = useSearchStore();
 const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
  }, [i18n]);
const name = localStorage.getItem("role");
  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  };
    const navigate = useNavigate();

const handleLogout = () => {
    localStorage.clear();
    navigate("/mainpage");   
  };

  return (
    <nav
      className={`flex items-center justify-between gap-2 px-3 py-3 md:gap-4 md:px-6 rounded-xl shadow-md transition-colors duration-300 
        ${theme === "dark" ? "bg-black text-white" : "bg-white text-maincolor"}`}
    >
      {/* Profile Section */}
      <div className="flex items-center gap-3">
        <FaUserCircle
          className={`w-6 h-6 md:w-10 md:h-10 ${
            theme === "dark" ? "text-white" : "text-maincolor"
          }`}
        />
        <div className="hidden sm:block">
          <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-maincolor"}`}>
            {name}
          </p>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-maincolor"}`}>
            {t("dashboard")}
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative w-full max-w-xs md:max-w-md">
        <FiSearch
          className={`absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 ${
            theme === "dark" ? "text-gray-300" : "text-maincolor"
          }`}
        />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder={t("search")}
          className={`w-full rounded-full pl-10 pr-3 py-1.5 text-sm focus:ring-2 focus:outline-none transition
            ${
              theme === "dark"
                ? "bg-transparent border border-gray-700 text-white placeholder:text-gray-500 focus:ring-gray-600"
                : "bg-transparent border border-maincolor text-maincolor placeholder:text-gray-400 focus:ring-maincolor"
            }`}
        />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-center w-9 h-9 rounded-full border transition
            ${
              theme === "dark"
                ? "border-gray-700 text-white hover:bg-gray-800"
                : "border-maincolor text-maincolor hover:bg-gray-100"
            }`}
        >
          {theme === "light" ? (
            <MdOutlineDarkMode className="w-5 h-5 text-black" />
          ) : (
            <MdOutlineLightMode className="w-5 h-5 text-amber-300" />
          )}
        </button>

        <select
          value={i18n.language}
          onChange={handleChangeLang}
          className={`px-2 py-1 text-[10px] rounded-full border transition duration-200 focus:outline-none focus:ring-2
            ${
              theme === "dark"
                ? "bg-maincolor border-gray-600 text-white focus:ring-gray-500"
                : "bg-white border-maincolor text-maincolor focus:ring-maincolor"
            }`}
        >
          <option value="en">{t("lang_en")}</option>
          <option value="ar">{t("lang_ar")}</option>
        </select>

      <div className="relative group">
        
   <div className="relative inline-block" ref={popupRef}>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center transition-all duration-300 bg-white border-2 border-gray-300 rounded-full shadow-sm cursor-pointer w-9 h-9 hover:shadow-md hover:scale-105 dark:bg-gray-800"
      >
        <div
          className="w-6 h-6 border border-gray-200 rounded-full shadow-inner"
          style={{ backgroundColor: mainColor }}
        ></div>
      </div>

      {/* Popup الألوان */}
      {open && (
        <div className="absolute z-10 flex flex-wrap gap-2 p-3 mt-2 bg-white border border-gray-300 shadow-lg rounded-xl dark:bg-gray-900">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setMainColor(color);
                setOpen(false);
              }}
              className={`w-7 h-7 rounded-full border-2 transition-transform duration-150 ${
                mainColor === color
                  ? "scale-110 border-gray-800 shadow-md"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </div>

  <span
    className="absolute px-1 py-1 text-xs text-white transition-transform duration-200 scale-0 -translate-x-1/2 bg-gray-800 rounded-md shadow-sm top-8 left-4 whitespace-nowrap"
  >
    🎨 اختر اللون الرئيسي
  </span>
</div>
  <motion.button
        onClick={handleLogout}
        whileTap={{ scale: 0.9 }}
        className="flex items-center gap-2 px-1 py-1 text-white transition-all duration-300 bg-red-500 rounded-lg shadow-md hover:bg-red-600"
      >
        <FaSignOutAlt className="text-xl" />
      </motion.button>
      </div>
    </nav>
  );
};

export default Nav;
