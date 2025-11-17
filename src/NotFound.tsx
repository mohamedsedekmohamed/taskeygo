 
import { useTheme } from "./Hooks/useTheme";
import { useNavigate } from "react-router-dom";
const Error = () => {
  const { theme } = useTheme();
const nav=useNavigate()
  return (
    <section
      className={`relative h-screen w-screen flex justify-center items-center transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0b0b0b] text-white"
          : "bg-maincolor text-white"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[400px] text-center">
              <h2
                className={`mb-2 text-[50px] font-bold leading-none sm:text-[80px] md:text-[100px] ${
                  theme === "dark" ? "text-maincolor" : "text-white"
                }`}
              >
                404
              </h2>
              <h4
                className={`mb-3 text-[22px] font-semibold leading-tight ${
                  theme === "dark" ? "text-gray-200" : "text-white"
                }`}
              >
                Oops! That page can’t be found
              </h4>
              <p
                className={`mb-8 text-lg ${
                  theme === "dark" ? "text-gray-400" : "text-white"
                }`}
              >
                The page you are looking for may have been deleted
              </p>
              <button
                onClick={()=>{nav(-1)}}
                className={`inline-block rounded-lg border px-8 py-3 text-center text-base font-semibold transition ${
                  theme === "dark"
                    ? "border-maincolor text-maincolor hover:bg-maincolor hover:text-white"
                    : "border-white text-white hover:bg-white hover:text-maincolor"
                }`}
              >
                Go To Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* الخلفية */}
      <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full space-x-5 -z-10 md:space-x-8 lg:space-x-14">
        <div
          className={`h-full w-1/3 ${
            theme === "dark"
              ? "bg-gradient-to-t from-[#FFFFFF05] to-transparent"
              : "bg-gradient-to-t from-[#FFFFFF14] to-transparent"
          }`}
        ></div>

        <div className="flex w-1/3 h-full">
          <div
            className={`h-full w-1/2 ${
              theme === "dark"
                ? "bg-gradient-to-b from-[#FFFFFF05] to-transparent"
                : "bg-gradient-to-b from-[#FFFFFF14] to-transparent"
            }`}
          ></div>
          <div
            className={`h-full w-1/2 ${
              theme === "dark"
                ? "bg-gradient-to-t from-[#FFFFFF05] to-transparent"
                : "bg-gradient-to-t from-[#FFFFFF14] to-transparent"
            }`}
          ></div>
        </div>

        <div
          className={`h-full w-1/3 ${
            theme === "dark"
              ? "bg-gradient-to-b from-[#FFFFFF05] to-transparent"
              : "bg-gradient-to-b from-[#FFFFFF14] to-transparent"
          }`}
        ></div>
      </div>
    </section>
  );
};

export default Error;
