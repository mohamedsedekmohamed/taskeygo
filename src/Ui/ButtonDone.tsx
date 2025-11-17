    import  { useEffect, useState } from "react";
    import { useTheme } from "../Hooks/ThemeContext"; // ✅ استدعاء الثيم
    import { useTranslation } from "react-i18next";

    interface ButtonDoneProps {
      checkLoading: boolean;
      handleSave: () => void;
      edit?: boolean;
    }

    const ButtonDone: React.FC<ButtonDoneProps> = ({
      checkLoading,
      handleSave,
      edit = false,
    }) => {
        const { t } = useTranslation();
      
      const fullText = t("Loading");
      const [displayText, setDisplayText] = useState<string>("");
      const [isDeleting, setIsDeleting] = useState<boolean>(false);
      const [charIndex, setCharIndex] = useState<number>(0);
      const { theme } = useTheme(); // ✅ استخدم الثيم

      useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (checkLoading) {
          timer = setTimeout(() => {
            if (!isDeleting) {
              setDisplayText(fullText.substring(0, charIndex + 1));
              setCharIndex((prev) => prev + 1);

              if (charIndex + 1 === fullText.length) {
                setIsDeleting(true);
              }
            } else {
              setDisplayText(fullText.substring(0, charIndex - 1));
              setCharIndex((prev) => prev - 1);

              if (charIndex - 1 === 0) {
                setIsDeleting(false);
              }
            }
          }, 100);
        } else {
          setDisplayText("");
          setCharIndex(0);
          setIsDeleting(false);
        }

        return () => clearTimeout(timer);
      }, [checkLoading, charIndex, isDeleting]);

      return (
        <div className="flex justify-center mt-6 sm:justify-start">
          <button
            disabled={checkLoading}
            onClick={handleSave}
            className={`transition-transform duration-700 font-medium rounded-[16px]
              hover:scale-95 text-lg sm:text-xl md:text-2xl
              w-[200px] sm:w-[250px] md:w-[300px] h-[56px] sm:h-[64px] md:h-[72px]
              ${
                checkLoading
                  ? theme === "dark"
                    ? "bg-transparent border-2 border-gray-400 text-gray-300"
                    : "bg-transparent border-2 border-maincolor text-maincolor"
                  : theme === "dark"
                  ? "bg-maincolor text-black hover:bg-gray-200"
                  : "bg-maincolor text-white hover:bg-maincolor/80"
              }`}
          >
            {checkLoading ? displayText : <span>{edit ? t("Edit") : t("Add")}</span>}
          </button>
        </div>
      );
    };

    export default ButtonDone;
