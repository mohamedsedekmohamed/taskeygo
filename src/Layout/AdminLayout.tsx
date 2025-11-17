import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import Nav from "../Component/Nav";
import { useTheme } from "../Hooks/ThemeContext";
import { useTranslation } from "react-i18next";
import IconDashboard from "../Icons/IconDashboard";
import IconProject from "../Icons/IconProject";
import IconDepartments from "../Icons/IconDepartments";
import IconSubscription from "../Icons/IconSubscription";

const AdminLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { theme } = useTheme();
  const { t } = useTranslation();


  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsOpen(true);
    }
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 
  const AdminLinks = [
    { to: "dashboard", name: t("sidebar.dashboard"), icon: <IconDashboard />, iconActive: <IconDashboard active /> },
    { to: "project", name: t("sidebar.project"), icon: <IconProject />, iconActive: <IconProject active /> },
    { to: "department", name: t("sidebar.departments"), icon: <IconDepartments />, iconActive: <IconDepartments active /> },
  { to: "subscriptions", name: t("sidebar.subscriptions"), icon: <IconSubscription />, iconActive: <IconSubscription active /> },
  ];

  return (
    <div
      className={`
        flex h-screen overflow-hidden relative
        transition-colors duration-300
        ${theme === "dark" ? "bg-[#0b0b0b] text-white" : "bg-[#EDF2EC] text-maincolor"}
      `}
    >
      <aside
        className={`
          transition-all duration-300 relative
          ${isOpen ? "w-56" : "w-16"}
          ${theme === "dark" ? "bg-black border-gray-800" : "bg-white border-maincolor/20"}
          border-r p-1 z-10 h-screen
        `}
      >
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} links={AdminLinks} mainlink={'/admin/dashboard'} main={"admin"}/>
      </aside>

      <div className="flex flex-col w-full overflow-auto">
        <header
          className={`
            sticky top-0 z-10 shadow-md transition-colors duration-300
            ${theme === "dark" ? "bg-black" : "bg-white"}
          `}
        >
          <Nav />
        </header>

        <main
          className={`
            flex-1 w-full p-4 transition-colors duration-300
            ${theme === "dark" ? "bg-[#0b0b0b] text-white" : "bg-[#EDF2EC] text-maincolor"}
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
